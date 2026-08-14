"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  Send,
  TriangleAlert,
  X,
} from "lucide-react";

import { WhatsAppIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  KIT_NEED,
  labelOf,
  needs,
  needsSituation,
  siteTypes,
  situations,
  timings,
  type Option,
  type SiteType,
  type Situation,
  type Timing,
} from "@/lib/data/contact";
import { kits } from "@/lib/data/kits";
import { buildProductWhatsAppLink, buildWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type StepId = "besoin" | "palier" | "site" | "situation" | "quand" | "contact";
type Status = "idle" | "loading" | "success" | "error";

const QUESTIONS: Record<StepId, { title: string; hint?: string }> = {
  besoin: {
    title: "De quoi avez-vous besoin ?",
    hint: "Une seule réponse — nous affinerons au téléphone.",
  },
  palier: {
    title: "Quelle puissance vous intéresse ?",
    hint: "Un ordre d'idée suffit : elle sera réajustée après l'audit.",
  },
  site: { title: "Qu'y a-t-il à alimenter ?" },
  situation: { title: "Aujourd'hui, sur ce site, vous avez…" },
  quand: { title: "Pour quand ?" },
  contact: {
    title: "Où peut-on vous joindre ?",
    hint: "Un ingénieur vous rappelle sous 24 h ouvrées.",
  },
};

/** Carte de choix — la brique de tout l'entonnoir. */
function Choice({
  icon: Icon,
  label,
  detail,
  selected,
  onSelect,
}: {
  icon: Option<string>["icon"];
  label: string;
  detail: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        `group flex items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 sm:p-5`,
        selected
          ? "border-brand-600 bg-brand-50 ring-2 ring-brand-600"
          : "border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/40",
      )}
    >
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors",
          selected ? "bg-brand-600" : "bg-brand-100/60",
        )}
      >
        <Icon
          className={cn(
            "size-5 transition-colors",
            selected ? "text-white" : "text-brand-700",
          )}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-bold leading-snug text-slate-900 sm:text-[17px]">
          {label}
        </span>
        <span className="mt-1 block text-sm leading-relaxed text-slate-600">
          {detail}
        </span>
      </span>
      {selected ? (
        <Check
          className="mt-1 size-5 shrink-0 text-brand-600"
          strokeWidth={2.5}
          aria-hidden="true"
        />
      ) : null}
    </button>
  );
}

/**
 * Entonnoir de contact — une question par écran.
 *
 * Pas de route par étape : l'état tient en mémoire, les transitions sont
 * instantanées et le visiteur ne subit aucun chargement au milieu d'un
 * formulaire. Une route par étape ne se justifierait que pour reprendre un
 * parcours abandonné plusieurs jours plus tard — ce n'est pas notre cas.
 *
 * Le chemin s'adapte : arriver depuis un kit ou depuis un domaine saute la
 * première question ; l'état électrique du site n'est demandé que lorsqu'il
 * change le dimensionnement. Un parcours fait ainsi trois à six écrans, mais
 * **une seule question à la fois** — c'est ce qui permet de la poser en
 * grand et d'y répondre sans lire.
 */
export function ContactFunnel({
  initialKit,
  initialNeed,
}: {
  initialKit?: string;
  initialNeed?: string;
}) {
  const reduce = useReducedMotion();
  const presetKit = kits.find((item) => item.slug === initialKit);
  const presetNeed = presetKit
    ? KIT_NEED
    : needs.find((item) => item.id === initialNeed)?.id;

  const [need, setNeed] = React.useState<string | null>(presetNeed ?? null);
  const [kitSlug, setKitSlug] = React.useState<string | null>(
    presetKit?.slug ?? null,
  );
  const [siteType, setSiteType] = React.useState<SiteType | null>(null);
  const [situation, setSituation] = React.useState<Situation | null>(null);
  const [timing, setTiming] = React.useState<Timing | null>(null);
  const [index, setIndex] = React.useState(0);
  const [status, setStatus] = React.useState<Status>("idle");
  const [serverError, setServerError] = React.useState<string | null>(null);
  const headingRef = React.useRef<HTMLHeadingElement>(null);

  /* Le chemin dépend des réponses : on le recalcule à chaque rendu. */
  const steps: StepId[] = [
    ...(presetNeed ? [] : (["besoin"] as StepId[])),
    ...(need === KIT_NEED && !presetKit ? (["palier"] as StepId[]) : []),
    "site",
    ...(needsSituation(need) ? (["situation"] as StepId[]) : []),
    "quand",
    "contact",
  ];
  const step = steps[Math.min(index, steps.length - 1)];
  const kit = kits.find((item) => item.slug === kitSlug);

  /* Le changement d'écran est annoncé et reprend le focus : sans cela, un
     lecteur d'écran resterait sur le bouton « Continuer » disparu. */
  const goTo = (next: number) => {
    setIndex(Math.min(Math.max(next, 0), steps.length - 1));
    window.requestAnimationFrame(() => headingRef.current?.focus());
  };

  const answered: Record<StepId, boolean> = {
    besoin: need !== null,
    palier: true, // « je ne sais pas encore » est une réponse valable
    site: siteType !== null,
    situation: situation !== null,
    quand: timing !== null,
    contact: true,
  };

  const whatsappLink = kit
    ? buildProductWhatsAppLink(kit.name)
    : buildWhatsAppLink();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setServerError(null);

    const data = new FormData(event.currentTarget);
    const payload = {
      need,
      kit: kitSlug ?? "",
      siteType,
      situation: needsSituation(need) ? situation : undefined,
      timing,
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      city: String(data.get("city") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      website: String(data.get("website") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        setServerError(result.error ?? "L'envoi a échoué.");
        setStatus("error");
        return;
      }
      setStatus("success");
      window.requestAnimationFrame(() => headingRef.current?.focus());
    } catch {
      setServerError("Connexion impossible. Réessayez ou passez par WhatsApp.");
      setStatus("error");
    }
  }

  /* ── Confirmation ─────────────────────────────────────────────── */
  if (status === "success") {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft sm:p-10">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-600">
          <CheckCircle2 className="size-7 text-white" aria-hidden="true" />
        </span>
        <h2
          ref={headingRef}
          tabIndex={-1}
          role="status"
          className="mt-6 font-display text-2xl font-bold text-slate-900 focus:outline-none sm:text-3xl"
        >
          Demande reçue. Merci.
        </h2>
        <p className="mt-3 max-w-lg leading-relaxed text-slate-600">
          Un ingénieur vous rappelle sous 24 h ouvrées pour caler la visite du
          site. Vous n&apos;avez rien d&apos;autre à faire.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button variant="neutral" asChild>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="size-4 text-[#25D366]" />
              Continuer sur WhatsApp
            </a>
          </Button>
          <Button variant="outline-ember" className="group" asChild>
            <Link href="/references">
              Voir nos réalisations
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const isLast = step === "contact";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8 lg:p-10">
      {/* Progression */}
      <div className="flex items-center gap-2" aria-hidden="true">
        {steps.map((id, i) => (
          <span
            key={id}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i <= index ? "bg-brand-600" : "bg-slate-200",
            )}
          />
        ))}
      </div>
      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">
        Étape {index + 1} sur {steps.length}
      </p>

      {/* Ce qui est déjà acquis, et modifiable */}
      {(presetNeed || kit) && !isLast ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {presetNeed && !kit ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-sm font-semibold text-brand-800">
              {labelOf(needs, presetNeed)}
            </span>
          ) : null}
          {kit ? (
            <span className="inline-flex flex-wrap items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-sm text-brand-800">
              <span className="font-semibold">{kit.name}</span>
              <Link
                href="/produits"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 underline underline-offset-2 hover:text-brand-800"
              >
                <X className="size-3" aria-hidden="true" />
                changer
              </Link>
            </span>
          ) : null}
        </div>
      ) : null}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, x: -16 }}
          transition={{
            duration: reduce ? 0 : 0.22,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
          className="mt-7"
        >
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="text-balance text-xl font-bold leading-snug text-slate-900 focus:outline-none sm:text-2xl"
          >
            {QUESTIONS[step].title}
          </h2>
          {QUESTIONS[step].hint ? (
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {QUESTIONS[step].hint}
            </p>
          ) : null}

          <div className="mt-7">
            {step === "besoin" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {needs.map((option) => (
                  <Choice
                    key={option.id}
                    icon={option.icon}
                    label={option.label}
                    detail={option.detail}
                    selected={need === option.id}
                    onSelect={() => {
                      setNeed(option.id);
                      if (option.id !== KIT_NEED) setKitSlug(null);
                    }}
                  />
                ))}
              </div>
            ) : null}

            {step === "palier" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {kits.map((item) => (
                  <Choice
                    key={item.slug}
                    icon={item.runs[0].icon}
                    label={`${item.power} — ${item.tier}`}
                    detail={item.outcome}
                    selected={kitSlug === item.slug}
                    onSelect={() => setKitSlug(item.slug)}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setKitSlug(null)}
                  aria-pressed={kitSlug === null}
                  className={cn(
                    "rounded-2xl border border-dashed p-4 text-left text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:col-span-2 sm:p-5",
                    kitSlug === null
                      ? "border-brand-600 bg-brand-50 text-brand-800"
                      : "border-slate-300 text-slate-600 hover:border-brand-300 hover:bg-brand-50/40",
                  )}
                >
                  Je ne sais pas encore — dimensionnez pour moi
                </button>
              </div>
            ) : null}

            {step === "site" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {siteTypes.map((option) => (
                  <Choice
                    key={option.id}
                    icon={option.icon}
                    label={option.label}
                    detail={option.detail}
                    selected={siteType === option.id}
                    onSelect={() => setSiteType(option.id)}
                  />
                ))}
              </div>
            ) : null}

            {step === "situation" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {situations.map((option) => (
                  <Choice
                    key={option.id}
                    icon={option.icon}
                    label={option.label}
                    detail={option.detail}
                    selected={situation === option.id}
                    onSelect={() => setSituation(option.id)}
                  />
                ))}
              </div>
            ) : null}

            {step === "quand" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {timings.map((option) => (
                  <Choice
                    key={option.id}
                    icon={option.icon}
                    label={option.label}
                    detail={option.detail}
                    selected={timing === option.id}
                    onSelect={() => setTiming(option.id)}
                  />
                ))}
              </div>
            ) : null}

            {step === "contact" ? (
              /*
               * `autoComplete="on"` explicite et jetons standards sur chaque
               * champ : c'est ce que le navigateur lit pour proposer le profil
               * enregistré (nom, téléphone, email, ville).
               */
              <form onSubmit={onSubmit} autoComplete="on" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      autoComplete="name"
                      autoCapitalize="words"
                      placeholder="Votre nom"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      required
                      autoComplete="tel"
                      placeholder="+243 …"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Ville du site</Label>
                    <Input
                      id="city"
                      name="city"
                      required
                      autoComplete="address-level2"
                      placeholder="Bunia, Goma, Kinshasa…"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">
                      Email{" "}
                      <span className="font-normal text-slate-400">
                        (facultatif)
                      </span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="Pour recevoir le devis écrit"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <Label htmlFor="message">
                    À ajouter ?{" "}
                    <span className="font-normal text-slate-400">
                      (facultatif)
                    </span>
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={3}
                    placeholder="Appareils à alimenter, autonomie souhaitée, contraintes du site…"
                    className="mt-2"
                  />
                </div>

                {/* Piège à robots — les humains ne le voient pas */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />

                {status === "error" && serverError ? (
                  <p
                    role="alert"
                    className="mt-5 flex items-start gap-3 rounded-xl border border-ember-200 bg-ember-50 p-4 text-sm text-ember-800"
                  >
                    <TriangleAlert
                      className="mt-0.5 size-4 shrink-0"
                      aria-hidden="true"
                    />
                    {serverError}
                  </p>
                ) : null}

                <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => goTo(index - 1)}
                  >
                    <ArrowLeft className="size-4" />
                    Retour
                  </Button>
                  <Button
                    type="submit"
                    className="group sm:ml-auto"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Envoi…
                      </>
                    ) : (
                      <>
                        <Send className="size-4" />
                        Envoyer ma demande
                      </>
                    )}
                  </Button>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-slate-500">
                  Réponse sous 24 h ouvrées. Vos informations servent
                  uniquement à traiter cette demande.
                </p>
              </form>
            ) : null}
          </div>
        </motion.div>
      </AnimatePresence>

      {!isLast ? (
        <div className="mt-8 flex items-center gap-4 border-t border-slate-100 pt-6">
          {index > 0 ? (
            <Button variant="ghost" size="sm" onClick={() => goTo(index - 1)}>
              <ArrowLeft className="size-4" />
              Retour
            </Button>
          ) : null}
          <Button
            className="group ml-auto"
            disabled={!answered[step]}
            onClick={() => goTo(index + 1)}
          >
            Continuer
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
