"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { CheckCircle2, Loader2, X } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { track } from "@/lib/analytics";
import {
  SOLAR_NEED,
  validateField,
  type ContactField,
} from "@/lib/data/contact";
import { findKit, kits, type Kit, type KitSegment } from "@/lib/data/kits";
import { contactHref } from "@/lib/routes";
import { buildProductWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/**
 * « Demander ce kit » — la demande sans quitter la page.
 *
 * Le déclencheur reste un vrai lien vers `/contact?kit=<slug>` : sans
 * JavaScript, au clic molette ou avec Ctrl/⌘, il mène à l'entonnoir complet.
 * Le clic simple, lui, ouvre la fenêtre : le visiteur a déjà choisi son kit,
 * il n'a pas à recharger une page pour le redire.
 *
 * Cinq champs, pas un questionnaire — nom, téléphone, ville, et facultatifs
 * l'email et un mot. Tout le reste passe par ce que `/contact` utilise déjà :
 * la même API, les mêmes règles de saisie (`validateField`, appliquées aussi
 * côté serveur), le même piège à robots, les mêmes événements `devis_*`
 * marqués `source: "modal"`. Le type de site est déduit du segment du kit ;
 * l'échéance, que l'entonnoir demande, se demande ici au rappel.
 */

const SITE_FOR_SEGMENT: Record<KitSegment, "maison" | "bureau" | "etablissement"> = {
  residentiel: "maison",
  professionnel: "bureau",
  industriel: "etablissement",
};

const FIELDS: {
  name: ContactField;
  label: string;
  type?: string;
  autoComplete: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  optional?: boolean;
  hint?: string;
}[] = [
  { name: "name", label: "Votre nom", autoComplete: "name" },
  {
    name: "phone",
    label: "Téléphone ou WhatsApp",
    type: "tel",
    autoComplete: "tel",
    inputMode: "tel",
    hint: "C'est à ce numéro que nous vous rappelons.",
  },
  {
    name: "city",
    label: "Ville du site à équiper",
    autoComplete: "address-level2",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    optional: true,
  },
];

type Status = "idle" | "sending" | "success" | "error";

function QuoteForm({
  initialKit,
  onClose,
}: {
  initialKit: Kit;
  onClose: () => void;
}) {
  const [kitSlug, setKitSlug] = React.useState(initialKit.slug);
  const [errors, setErrors] = React.useState<Partial<Record<ContactField, string>>>({});
  const [status, setStatus] = React.useState<Status>("idle");
  const [sentPhone, setSentPhone] = React.useState("");
  const formRef = React.useRef<HTMLFormElement>(null);
  const kit = kits.find((item) => item.slug === kitSlug) ?? initialKit;

  const validate = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const next: Partial<Record<ContactField, string>> = {};
    for (const field of ["name", "phone", "city", "email", "message"] as const) {
      const message = validateField(field, String(data.get(field) ?? ""));
      if (message) next[field] = message;
    }
    return next;
  };

  const onBlurField = (field: ContactField, value: string) => {
    /* On ne gronde pas un champ vide qu'on vient juste de traverser ; une
       erreur déjà affichée, elle, se corrige en direct. */
    if (!value && !errors[field]) return;
    const message = validateField(field, value);
    setErrors((current) => ({ ...current, [field]: message }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const invalid = validate(form);
    setErrors(invalid);
    const invalidFields = Object.keys(invalid);
    if (invalidFields.length) {
      track("devis_champs_invalides", {
        source: "modal",
        champs: invalidFields.join(","),
      });
      form.querySelector<HTMLElement>(`[name="${invalidFields[0]}"]`)?.focus();
      return;
    }

    const data = new FormData(form);
    const payload = {
      need: SOLAR_NEED,
      kit: kit.slug,
      siteType: SITE_FOR_SEGMENT[kit.segment],
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      city: String(data.get("city") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      website: String(data.get("website") ?? ""),
      source: "modal" as const,
      referrer: document.referrer.slice(0, 500),
      landing: window.location.pathname.slice(0, 500),
    };

    setStatus("sending");
    track("devis_soumis", { source: "modal", kit: kit.slug });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        setStatus("error");
        track("devis_erreur", { source: "modal", raison: "serveur", code: response.status });
        return;
      }
      setSentPhone(payload.phone);
      setStatus("success");
      track("devis_succes", { source: "modal", kit: kit.slug });
    } catch {
      setStatus("error");
      track("devis_erreur", { source: "modal", raison: "reseau" });
    }
  };

  if (status === "success") {
    return (
      <div className="px-6 pb-7 pt-2 text-center sm:px-8 sm:pb-8">
        <CheckCircle2
          className="mx-auto size-12 text-brand-600"
          strokeWidth={1.6}
          aria-hidden="true"
        />
        {/* Annoncé aux lecteurs d'écran : le formulaire vient de disparaître */}
        <div role="status">
          <p className="mt-4 text-xl font-bold text-slate-900">Demande reçue.</p>
          <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-slate-600">
            {`Un technicien vous rappelle au ${sentPhone} sous 24 h ouvrées, pour le ${kit.name}. L'audit sur site et le devis sont gratuits.`}
          </p>
        </div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={buildProductWhatsAppLink(kit.name)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("devis_whatsapp", { depuis: "modal" })}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <WhatsAppIcon className="size-4 text-[#25D366]" />
            Écrire aussi sur WhatsApp
          </a>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl bg-brand-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  const describedBy = (field: ContactField, hint?: string) =>
    [errors[field] ? `quote-${field}-error` : null, hint ? `quote-${field}-hint` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="px-6 sm:px-8">
      {/* Le kit — modifiable : on peut hésiter entre deux paliers */}
      <div className="rounded-2xl border border-brand-100 bg-brand-50/70 px-4 py-3">
        <label
          htmlFor="quote-kit"
          className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500"
        >
          Kit demandé
        </label>
        <select
          id="quote-kit"
          value={kitSlug}
          onChange={(event) => setKitSlug(event.target.value)}
          className="mt-1.5 block w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-base font-semibold text-slate-900 focus-visible:border-solar-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500/30 sm:text-sm"
        >
          {kits.map((item) => (
            <option key={item.slug} value={item.slug}>
              {`${item.name} — ${item.tier}`}
            </option>
          ))}
        </select>
        <p className="mt-2 text-[13px] leading-snug text-slate-600">
          {`${kit.specs.inverter} · ${kit.specs.battery} · ${kit.specs.panels}. Composition ajustée après l'audit gratuit.`}
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div
            key={field.name}
            className={
              field.name === "name" || field.name === "email" ? "sm:col-span-2" : undefined
            }
          >
            <label
              htmlFor={`quote-${field.name}`}
              className="text-sm font-semibold text-slate-800"
            >
              {field.label}
              {field.optional ? (
                <span className="ml-1.5 font-normal text-slate-500">
                  {field.name === "email" ? "(facultatif — pour le devis écrit)" : "(facultatif)"}
                </span>
              ) : null}
            </label>
            <Input
              id={`quote-${field.name}`}
              name={field.name}
              type={field.type ?? "text"}
              autoComplete={field.autoComplete}
              inputMode={field.inputMode}
              required={!field.optional}
              aria-invalid={errors[field.name] ? true : undefined}
              aria-describedby={describedBy(field.name, field.hint)}
              onBlur={(event) => onBlurField(field.name, event.target.value)}
              className="mt-1.5"
            />
            {errors[field.name] ? (
              <p id={`quote-${field.name}-error`} className="mt-1.5 text-[13px] font-medium text-ember-700">
                {errors[field.name]}
              </p>
            ) : field.hint ? (
              <p id={`quote-${field.name}-hint`} className="mt-1.5 text-[13px] text-slate-500">
                {field.hint}
              </p>
            ) : null}
          </div>
        ))}

        <div className="sm:col-span-2">
          <label htmlFor="quote-message" className="text-sm font-semibold text-slate-800">
            Un mot sur votre besoin
            <span className="ml-1.5 font-normal text-slate-500">(facultatif)</span>
          </label>
          <Textarea
            id="quote-message"
            name="message"
            rows={2}
            placeholder="Ex. : coupures tous les soirs, un congélateur et deux climatiseurs."
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? "quote-message-error" : undefined}
            onBlur={(event) => onBlurField("message", event.target.value)}
            className="mt-1.5 min-h-[4.75rem]"
          />
          {errors.message ? (
            <p id="quote-message-error" className="mt-1.5 text-[13px] font-medium text-ember-700">
              {errors.message}
            </p>
          ) : null}
        </div>
      </div>

      {/* Piège à robots — invisible et hors tabulation pour un humain */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="quote-website">Ne pas remplir</label>
        <input id="quote-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" ? (
        <p role="alert" className="mt-5 rounded-xl border border-ember-200 bg-ember-50 px-4 py-3 text-sm text-ember-800">
          L&apos;envoi n&apos;a pas abouti. Réessayez, ou écrivez-nous sur
          WhatsApp : la demande arrive au même endroit.
        </p>
      ) : null}

      {/*
        Barre d'action collante — le motif de /contact (design-system §6 bis) :
        sur un petit écran, le formulaire défile et le bouton reste visible.
        Elle affleure les bords du panneau et son fond est opaque, sans quoi
        les champs défileraient dans l'interstice.
      */}
      <div className="sticky bottom-0 -mx-6 mt-6 flex flex-col-reverse gap-2 border-t border-slate-100 bg-white px-6 py-4 sm:-mx-8 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-8 sm:py-5">
        <a
          href={buildProductWhatsAppLink(kit.name)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("devis_whatsapp", { depuis: "modal" })}
          className="inline-flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <WhatsAppIcon className="size-4 text-[#25D366]" />
          Plutôt WhatsApp ?
        </a>
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-solar-500 px-6 py-3.5 text-base font-semibold text-brand-950 shadow-sm transition-all duration-200 hover:bg-solar-400 hover:ring-4 hover:ring-solar-200 hover:ring-offset-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-80 sm:w-auto"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Envoi…
            </>
          ) : (
            "Être rappelé"
          )}
        </button>
      </div>
    </form>
  );
}

/**
 * Le lien « Demander ce kit » et sa fenêtre. `className` habille le lien
 * comme le bouton de l'endroit où il est posé — il en hérite l'apparence,
 * pas le comportement.
 */
export function KitQuoteLink({
  kitSlug,
  className,
  onClick: onClickProp,
  children,
}: {
  /**
   * Le slug, pas l'objet : un `Kit` porte ses pictogrammes (des composants),
   * qu'une page serveur ne peut pas transmettre à un composant client — la
   * fiche répondait 500. Le kit est relu ici, côté client.
   */
  kitSlug: string;
  className?: string;
  /** Appelé d'abord — le comparatif y arrête la propagation vers sa ligne. */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  children: React.ReactNode;
}) {
  const kit = findKit(kitSlug) ?? kits[0];
  const [open, setOpen] = React.useState(false);
  /* Une fenêtre fermée puis rouverte repart d'un formulaire vierge. */
  const [session, setSession] = React.useState(0);
  const linkRef = React.useRef<HTMLAnchorElement>(null);

  const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClickProp?.(event);
    /* Nouvel onglet, nouvelle fenêtre : le lien fait son travail de lien. */
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    setSession((value) => value + 1);
    setOpen(true);
    track("devis_ouvert", { source: "modal", kit: kit.slug });
  };

  return (
    <>
      <a
        ref={linkRef}
        href={contactHref({ kit: kit.slug })}
        onClick={onClick}
        aria-haspopup="dialog"
        className={className}
      >
        {children}
      </a>

      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-brand-950/50 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            onCloseAutoFocus={(event) => {
              /* Le déclencheur n'est pas un `Dialog.Trigger` : on lui rend
                 le focus à la main. */
              event.preventDefault();
              linkRef.current?.focus();
            }}
            className={cn(
              "fixed z-[60] flex max-h-[92dvh] flex-col overflow-hidden bg-white shadow-2xl focus:outline-none",
              /* Mobile : feuille montant du bas, pleine largeur */
              "inset-x-0 bottom-0 rounded-t-3xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
              /* À partir de sm : fenêtre centrée */
              "sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[min(36rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=open]:slide-in-from-bottom-0 sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95",
            )}
          >
            <div className="flex items-start justify-between gap-4 px-6 pb-4 pt-6 sm:px-8 sm:pt-7">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">
                  Demander ce kit
                </p>
                <DialogPrimitive.Title className="mt-1.5 text-xl font-bold leading-snug text-slate-900 sm:text-2xl">
                  Être rappelé pour un devis
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="mt-1 text-sm text-slate-600">
                  Trois champs suffisent. Rappel sous 24 h ouvrées, audit et
                  devis gratuits.
                </DialogPrimitive.Description>
              </div>
              <DialogPrimitive.Close
                aria-label="Fermer"
                className="-mr-2 -mt-1 rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <X className="size-5" />
              </DialogPrimitive.Close>
            </div>
            <div className="overflow-y-auto overscroll-contain">
              <QuoteForm key={session} initialKit={kit} onClose={() => setOpen(false)} />
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
