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
  intents,
  siteTypes,
  situations,
  timings,
  type Intent,
  type Option,
  type SiteType,
  type Situation,
  type Timing,
} from "@/lib/data/contact";
import { kits } from "@/lib/data/kits";
import { services } from "@/lib/data/services";
import { buildProductWhatsAppLink, buildWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const STEPS = ["Votre besoin", "Votre site", "Vos coordonnées"] as const;

type Status = "idle" | "loading" | "success" | "error";

/** Carte de choix — la brique de tout l'entonnoir. */
function Choice<T extends string>({
  option,
  selected,
  onSelect,
}: {
  option: Option<T>;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        `group relative flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 sm:p-5`,
        selected
          ? "border-brand-600 bg-brand-50 ring-2 ring-brand-600"
          : "border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/40",
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors",
          selected ? "bg-brand-600" : "bg-brand-100/60",
        )}
      >
        <option.icon
          className={cn(
            "size-5 transition-colors",
            selected ? "text-white" : "text-brand-700",
          )}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-bold leading-snug text-slate-900">
          {option.label}
        </span>
        <span className="mt-1 block text-sm leading-relaxed text-slate-600">
          {option.detail}
        </span>
      </span>
      {selected ? (
        <Check
          className="mt-0.5 size-5 shrink-0 text-brand-600"
          strokeWidth={2.5}
          aria-hidden="true"
        />
      ) : null}
    </button>
  );
}

function Question({
  legend,
  children,
}: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
        {legend}
      </legend>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

/**
 * Entonnoir de contact — trois étapes sur une seule page.
 *
 * Pas de route par étape : l'état tient en mémoire, les transitions sont
 * instantanées et le visiteur ne subit aucun chargement au milieu d'un
 * formulaire. Une route par étape ne se justifierait que pour reprendre un
 * parcours abandonné plusieurs jours plus tard — ce n'est pas notre cas.
 *
 * Le prospect **clique** son contexte et ne **tape** que ses coordonnées :
 * c'est ce qui rend la qualification supportable et l'email exploitable.
 *
 * Deux portes d'entrée, un seul écran : « Demander ce kit » arrive avec
 * `?kit=<slug>` (première étape déjà répondue), « Parler de mon projet »
 * arrive nu et commence par la question du besoin.
 */
export function ContactFunnel({
  initialKit,
  initialService,
}: {
  initialKit?: string;
  initialService?: string;
}) {
  const reduce = useReducedMotion();
  const kit = kits.find((item) => item.slug === initialKit);
  const service = services.find((item) => item.slug === initialService);

  const [step, setStep] = React.useState(kit || service ? 1 : 0);
  const [intent, setIntent] = React.useState<Intent | null>(
    kit ? "kit" : service ? "etude" : null,
  );
  const [siteType, setSiteType] = React.useState<SiteType | null>(null);
  const [situation, setSituation] = React.useState<Situation | null>(null);
  const [timing, setTiming] = React.useState<Timing | null>(null);
  const [status, setStatus] = React.useState<Status>("idle");
  const [serverError, setServerError] = React.useState<string | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const headingRef = React.useRef<HTMLParagraphElement>(null);

  /* Le changement d'étape est annoncé et reprend le focus : sans cela, un
     lecteur d'écran reste sur le bouton « Continuer » disparu. */
  const goTo = (next: number) => {
    setStep(next);
    window.requestAnimationFrame(() => headingRef.current?.focus());
  };

  const canContinue =
    step === 0 ? intent !== null : Boolean(siteType && situation && timing);

  const whatsappLink = kit
    ? buildProductWhatsAppLink(kit.name)
    : buildWhatsAppLink();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setServerError(null);

    const data = new FormData(event.currentTarget);
    const payload = {
      intent,
      kit: kit?.slug,
      service: service?.slug,
      siteType,
      situation,
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
      setServerError(
        "Connexion impossible. Réessayez ou passez par WhatsApp.",
      );
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
        <p
          ref={headingRef}
          tabIndex={-1}
          role="status"
          className="mt-6 font-display text-2xl font-bold text-slate-900 focus:outline-none sm:text-3xl"
        >
          Demande reçue. Merci.
        </p>
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

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8 lg:p-10">
      {/* Progression — trois étapes, jamais plus */}
      <ol className="flex items-center gap-2" aria-label="Progression">
        {STEPS.map((label, index) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                index <= step ? "bg-brand-600" : "bg-slate-200",
              )}
            />
          </li>
        ))}
      </ol>
      <p
        ref={headingRef}
        tabIndex={-1}
        aria-live="polite"
        className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700 focus:outline-none"
      >
        Étape {step + 1} sur {STEPS.length} — {STEPS[step]}
      </p>

      {/* Rappel de la demande d'origine, modifiable */}
      {kit ? (
        <p className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-sm text-brand-800">
          <span className="font-semibold">{kit.name}</span>
          <Link
            href="/produits"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 underline underline-offset-2 hover:text-brand-800"
          >
            <X className="size-3" aria-hidden="true" />
            changer
          </Link>
        </p>
      ) : null}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, x: -16 }}
          transition={{ duration: reduce ? 0 : 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mt-8"
        >
          {step === 0 ? (
            <Question legend="Qu'est-ce qui vous amène ?">
              {intents.map((option) => (
                <Choice
                  key={option.id}
                  option={option}
                  selected={intent === option.id}
                  onSelect={() => setIntent(option.id)}
                />
              ))}
            </Question>
          ) : null}

          {step === 1 ? (
            <div className="space-y-9">
              <Question legend="Qu'y a-t-il à alimenter ?">
                {siteTypes.map((option) => (
                  <Choice
                    key={option.id}
                    option={option}
                    selected={siteType === option.id}
                    onSelect={() => setSiteType(option.id)}
                  />
                ))}
              </Question>

              <Question legend="Aujourd'hui, vous avez…">
                {situations.map((option) => (
                  <Choice
                    key={option.id}
                    option={option}
                    selected={situation === option.id}
                    onSelect={() => setSituation(option.id)}
                  />
                ))}
              </Question>

              <Question legend="Pour quand ?">
                {timings.map((option) => (
                  <Choice
                    key={option.id}
                    option={option}
                    selected={timing === option.id}
                    onSelect={() => setTiming(option.id)}
                  />
                ))}
              </Question>
            </div>
          ) : null}

          {step === 2 ? (
            <form ref={formRef} onSubmit={onSubmit} noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    autoComplete="name"
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

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => goTo(1)}
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
                Réponse sous 24 h ouvrées. Vos informations servent uniquement
                à traiter cette demande.
              </p>
            </form>
          ) : null}
        </motion.div>
      </AnimatePresence>

      {/* Navigation des deux premières étapes */}
      {step < 2 ? (
        <div className="mt-8 flex items-center gap-4 border-t border-slate-100 pt-6">
          {step > 0 ? (
            <Button variant="ghost" size="sm" onClick={() => goTo(step - 1)}>
              <ArrowLeft className="size-4" />
              Retour
            </Button>
          ) : null}
          <Button
            className="group ml-auto"
            disabled={!canContinue}
            onClick={() => goTo(step + 1)}
          >
            Continuer
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
