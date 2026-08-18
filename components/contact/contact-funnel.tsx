"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  HelpCircle,
  Loader2,
  Pencil,
  Send,
  TriangleAlert,
} from "lucide-react";

import { WhatsAppIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { track } from "@/lib/analytics";
import {
  KIT_NEED,
  domainNeeds,
  kitNeed,
  labelOf,
  needs,
  needsSituation,
  siteTypes,
  situations,
  timings,
  validateContact,
  validateField,
  type ContactField,
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

/**
 * L'intitulé de chaque écran, et l'indice qui dit **pourquoi** on le demande.
 *
 * Un entonnoir qui interroge sans se justifier se lit comme un péage. Chaque
 * indice répond à « en quoi ça vous regarde ? » — c'est ce qui fait la
 * différence entre remplir un formulaire et préparer un rendez-vous.
 */
const QUESTIONS: Record<StepId, { title: string; hint?: string }> = {
  besoin: {
    title: "Qu'est-ce qui vous amène ?",
    hint: "Une seule réponse — nous préciserons au téléphone.",
  },
  palier: {
    title: "Quelle puissance visez-vous ?",
    hint: "Un ordre d'idée suffit : l'audit l'ajustera à vos charges réelles.",
  },
  site: {
    title: "Qu'y a-t-il à alimenter ?",
    hint: "C'est ce qui donne la taille de l'installation.",
  },
  situation: {
    title: "Comment le site est-il alimenté aujourd'hui ?",
    hint: "De toutes les questions, c'est celle qui change le plus le devis.",
  },
  quand: {
    title: "Dans quel délai ?",
    hint: "« Je compare encore » est une réponse utile — elle change notre appel.",
  },
  contact: {
    title: "Où peut-on vous rappeler ?",
    hint: "Trois champs, et c'est terminé. Un ingénieur vous rappelle sous 24 h ouvrées.",
  },
};

/**
 * Barre d'action collante — commune aux écrans de choix et au formulaire.
 *
 * Elle affleure les trois bords de la carte : posée en retrait, le contenu
 * continuait de défiler dans l'interstice qui restait en dessous, et la barre
 * paraissait flotter par-dessus un texte coupé. D'où les marges négatives,
 * accordées aux trois rembourrages de la carte (`p-5 sm:p-8 lg:p-10`).
 *
 * Fond **opaque** et non voilé : `backdrop-filter` n'est garanti ni sur les
 * navigateurs Android anciens ni au rendu hors écran, et le texte défilant
 * dessous restait alors lisible au travers.
 */
const BAR_CLASSES =
  `sticky bottom-0 z-10 -mx-5 -mb-5 mt-8 flex items-center gap-3 rounded-b-3xl
   border-t border-slate-200 bg-white px-4 py-3.5
   shadow-[0_-10px_24px_-16px_rgba(15,23,42,0.25)]
   sm:-mx-8 sm:-mb-8 sm:gap-4 sm:px-8 sm:py-4 lg:-mx-10 lg:-mb-10 lg:px-10`;

const EMPTY_VALUES: Record<ContactField, string> = {
  name: "",
  phone: "",
  city: "",
  email: "",
  message: "",
};

/**
 * Carte de choix — la brique de tout l'entonnoir.
 *
 * Trois états franchement distincts, et **aucun bleu au repos**. Chaque carte
 * portait auparavant une pastille `brand-100` : sept d'affilée, l'écran
 * devenait un aplat indigo où la sélection ne se voyait plus, faute de
 * contraste avec ce qui l'entoure. Le repos est donc neutre, le survol
 * emprunte l'anneau qui sert de signature au site, et le bleu est réservé au
 * seul état qui compte — celui que le visiteur vient de choisir.
 *
 * Densité volontairement plus forte sous `sm` : la première question compte
 * sept réponses, et le bouton « Continuer » se retrouvait à deux écrans de
 * défilement sur un téléphone.
 *
 * @see docs/design-system.md — « Cartes », « Rôles de couleur »
 */
function Choice({
  icon: Icon,
  label,
  detail,
  selected,
  shortcut = false,
  onSelect,
}: {
  icon: Option<string>["icon"];
  label: string;
  detail: string;
  selected: boolean;
  /** Réponse d'une autre nature — posée à part, en trait discontinu. */
  shortcut?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      tabIndex={-1}
      onClick={onSelect}
      className={cn(
        `group flex items-start gap-3 rounded-2xl border text-left transition-all duration-200
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2
         p-3.5 sm:gap-4 sm:p-4`,
        shortcut ? "border-dashed sm:col-span-2" : "",
        selected
          ? "border-brand-600 bg-brand-50 ring-2 ring-brand-600"
          : `border-slate-200 bg-slate-50/70 hover:-translate-y-0.5 hover:border-brand-300
             hover:bg-white hover:shadow-card hover:ring-4 hover:ring-brand-100 hover:ring-offset-1`,
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors sm:size-10",
          selected
            ? "bg-brand-600"
            : "bg-white text-slate-500 ring-1 ring-slate-200 group-hover:bg-brand-100 group-hover:text-brand-700 group-hover:ring-brand-200",
        )}
      >
        <Icon
          className={cn(
            "size-[18px] transition-colors sm:size-5",
            selected ? "text-white" : "",
          )}
          strokeWidth={1.9}
          aria-hidden="true"
        />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block text-[15px] font-bold leading-snug sm:text-base",
            selected ? "text-brand-900" : "text-slate-900",
          )}
        >
          {label}
        </span>
        <span className="mt-0.5 block text-[13px] leading-snug text-slate-600 sm:text-[13.5px]">
          {detail}
        </span>
      </span>
      <span
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full transition-all",
          selected
            ? "bg-brand-600 opacity-100"
            : "border border-slate-300 opacity-70 group-hover:border-brand-400",
        )}
        aria-hidden="true"
      >
        {selected ? (
          <Check className="size-3.5 text-white" strokeWidth={3} />
        ) : null}
      </span>
    </button>
  );
}

/**
 * Groupe de choix — un vrai `radiogroup`, pas une pile de boutons.
 *
 * Sans lui, un lecteur d'écran annonçait sept boutons indépendants sans dire
 * qu'ils s'excluent, et le clavier devait traverser chaque option pour
 * atteindre « Continuer ». Un seul élément reste dans l'ordre de tabulation
 * (tabindex mouvant) ; les flèches, Origine et Fin circulent à l'intérieur.
 *
 * @see docs/design-system.md — §6, « une jolie souricière au clavier »
 */
function ChoiceGroup({
  describedBy,
  children,
}: {
  describedBy?: string;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  /* Le point d'entrée au clavier : l'option cochée, sinon la première. */
  React.useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const radios = [...container.querySelectorAll<HTMLElement>('[role="radio"]')];
    const active = radios.find((r) => r.getAttribute("aria-checked") === "true");
    radios.forEach((r) => {
      r.tabIndex = r === (active ?? radios[0]) ? 0 : -1;
    });
  });

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    const container = ref.current;
    if (!container) return;
    const radios = [...container.querySelectorAll<HTMLElement>('[role="radio"]')];
    if (radios.length === 0) return;
    const current = radios.indexOf(document.activeElement as HTMLElement);
    if (current === -1) return;
    event.preventDefault();

    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? radios.length - 1
          : event.key === "ArrowDown" || event.key === "ArrowRight"
            ? (current + 1) % radios.length
            : (current - 1 + radios.length) % radios.length;

    /* Dans un radiogroup, déplacer le focus vaut sélection. */
    radios[next].focus();
    radios[next].click();
  }

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-labelledby="entonnoir-question"
      aria-describedby={describedBy}
      onKeyDown={onKeyDown}
      className="grid gap-2.5 sm:grid-cols-2 sm:gap-3"
    >
      {children}
    </div>
  );
}

/** Message d'erreur posé sous son champ, et lu comme sa description. */
function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      className="mt-1.5 flex items-start gap-1.5 text-[13px] font-medium text-ember-700"
    >
      <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

/**
 * Entonnoir de contact — une question par écran.
 *
 * Pas de route par étape : l'état tient en mémoire, les transitions sont
 * instantanées et le visiteur ne subit aucun chargement au milieu d'un
 * formulaire. En revanche l'entonnoir **empile des entrées d'historique** sur
 * la même URL : sans cela, le geste « retour » du téléphone quittait la page
 * et effaçait toutes les réponses au lieu de reculer d'un écran.
 *
 * Le chemin s'adapte : arriver depuis un kit ou depuis un domaine répond à la
 * première question à votre place — mais la réponse reste modifiable, elle
 * n'est plus gravée. L'état électrique du site n'est demandé que lorsqu'il
 * change le dimensionnement. Un parcours fait ainsi trois à six écrans, mais
 * **une seule question à la fois** — c'est ce qui permet de la poser en
 * grand et d'y répondre sans lire.
 *
 * Le compte d'étapes n'est affiché qu'une fois le chemin déterminé. Il variait
 * auparavant sous les yeux du visiteur — « sur 4 » à l'ouverture, « sur 6 »
 * après avoir choisi un kit : une barre de progression qui s'allonge quand on
 * répond décourage plus qu'elle ne guide.
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
  /** D'où vient le visiteur — reporté sur chaque événement de mesure. */
  const source = presetKit ? "kit" : presetNeed ? "service" : "nu";

  const [need, setNeed] = React.useState<string | null>(presetNeed ?? null);
  const [kitSlug, setKitSlug] = React.useState<string | null>(
    presetKit?.slug ?? null,
  );
  const [siteType, setSiteType] = React.useState<SiteType | null>(null);
  const [situation, setSituation] = React.useState<Situation | null>(null);
  const [timing, setTiming] = React.useState<Timing | null>(null);
  /*
   * Une arrivée qualifiée a déjà répondu aux premières questions : on les lui
   * montre franchies plutôt que de les lui reposer — sans les lui interdire.
   * Un lien `?kit=` en répond deux (le besoin et le palier), `?service=` une.
   */
  const [index, setIndex] = React.useState(presetKit ? 2 : presetNeed ? 1 : 0);
  const [status, setStatus] = React.useState<Status>("idle");
  const [serverError, setServerError] = React.useState<string | null>(null);

  const [values, setValues] =
    React.useState<Record<ContactField, string>>(EMPTY_VALUES);
  const [errors, setErrors] = React.useState<
    Partial<Record<ContactField, string>>
  >({});
  /* Avant la première tentative d'envoi, on ne reproche rien à un champ vide. */
  const [attempted, setAttempted] = React.useState(false);

  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const fieldRefs = React.useRef<
    Partial<Record<ContactField, HTMLInputElement | HTMLTextAreaElement | null>>
  >({});

  /*
   * Le chemin dépend des réponses : on le recalcule à chaque rendu. « besoin »
   * y figure toujours, même préqualifié — c'est ce qui rend la pastille
   * modifiable et le retour possible jusqu'à la première question.
   */
  const steps: StepId[] = [
    "besoin",
    /*
     * Le palier appartient au chemin dès que le besoin est « un kit », y
     * compris pour une arrivée `?kit=` qui l'a déjà franchi. Le retirer du
     * tableau selon l'arrivée faisait glisser tous les rangs qui suivent :
     * une même entrée d'historique désignait alors deux écrans différents, et
     * le geste retour semblait ne rien faire.
     */
    ...(need === KIT_NEED ? (["palier"] as StepId[]) : []),
    "site",
    ...(needsSituation(need) ? (["situation"] as StepId[]) : []),
    "quand",
    "contact",
  ];
  const step = steps[Math.min(index, steps.length - 1)];
  const kit = kits.find((item) => item.slug === kitSlug);
  const isLast = step === "contact";
  /* Le total ne bouge plus dès que « besoin » est derrière nous. */
  const pathResolved = index > 0;

  const focusHeading = React.useCallback(() => {
    window.requestAnimationFrame(() => headingRef.current?.focus());
  }, []);

  /*
   * Historique : une entrée par écran, sur la même URL. Next conserve son
   * propre état dans `history.state` — on l'étale plutôt que de l'écraser,
   * sous peine de désynchroniser son routeur.
   */
  React.useEffect(() => {
    window.history.replaceState(
      { ...window.history.state, tsFunnelStep: index },
      "",
    );
    const onPopState = (event: PopStateEvent) => {
      const target = (event.state as { tsFunnelStep?: number } | null)
        ?.tsFunnelStep;
      if (typeof target === "number") {
        setIndex(target);
        focusHeading();
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
    // Au montage seulement : l'entrée initiale ne doit être posée qu'une fois.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    track("devis_ouvert", { source, besoin: presetNeed, kit: presetKit?.slug });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  /** Avance d'un écran, en laissant une trace dans l'historique. */
  function goForward() {
    const next = Math.min(index + 1, steps.length - 1);
    if (next === index) return;
    window.history.pushState(
      { ...window.history.state, tsFunnelStep: next },
      "",
    );
    setIndex(next);
    focusHeading();
    track("devis_etape", {
      etape: steps[next],
      rang: next + 1,
      total: steps.length,
      source,
    });
  }

  /** Recule d'un écran — via l'historique, pour rester en phase avec lui. */
  function goBack() {
    if (index === 0) return;
    track("devis_retour", { depuis: step });
    window.history.back();
  }

  /**
   * Revenir sur ce qui a été préqualifié depuis la pastille.
   *
   * Le lien pointait vers /produits : cliquer « changer » quittait
   * l'entonnoir et effaçait toutes les réponses déjà données. On reste dans
   * la page — et on rouvre l'écran qui correspond à ce que la pastille
   * affiche : le palier pour un kit, la première question sinon.
   */
  function editSelection() {
    const target = kit ? 1 : 0; // « palier » suit « besoin » quand il existe
    window.history.pushState(
      { ...window.history.state, tsFunnelStep: target },
      "",
    );
    setIndex(target);
    focusHeading();
    track("devis_selection_modifiee", { depuis: step, cible: kit ? "palier" : "besoin" });
  }

  function setField(field: ContactField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    /* On efface l'erreur dès qu'elle est réparée, jamais on n'en ajoute ici. */
    setErrors((current) =>
      current[field] && !validateField(field, value)
        ? { ...current, [field]: undefined }
        : current,
    );
  }

  function blurField(field: ContactField) {
    /* Un champ vide qu'on n'a pas encore tenté d'envoyer ne mérite pas
       de reproche : on ne valide au flou qu'une saisie commencée. */
    if (!attempted && values[field].trim().length === 0) return;
    const message = validateField(field, values[field]);
    setErrors((current) => ({ ...current, [field]: message }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;
    setAttempted(true);

    /*
     * Validation locale d'abord, et **toutes** les erreurs d'un coup. Le
     * serveur reste la barrière qui fait foi, mais il n'a plus à servir de
     * correcteur orthographique : un aller-retour par faute de frappe, sur un
     * réseau congolais, c'est un abandon.
     */
    const found = validateContact(values);
    const invalid = Object.keys(found) as ContactField[];
    if (invalid.length > 0) {
      setErrors(found);
      setStatus("idle");
      setServerError(null);
      track("devis_champs_invalides", { champs: invalid.join(",") });
      window.requestAnimationFrame(() => fieldRefs.current[invalid[0]]?.focus());
      return;
    }

    setStatus("loading");
    setServerError(null);
    setErrors({});

    const data = new FormData(event.currentTarget);
    const payload = {
      need,
      kit: kitSlug ?? "",
      siteType,
      situation: needsSituation(need) ? situation : undefined,
      timing,
      name: values.name,
      phone: values.phone,
      city: values.city,
      email: values.email,
      message: values.message,
      website: String(data.get("website") ?? ""),
      /* D'où vient la demande — l'email ne le disait pas, et c'est ce qui
         permet de savoir quel chemin du site produit des rappels. */
      source,
      referrer: typeof document !== "undefined" ? document.referrer : "",
      landing:
        typeof window !== "undefined" ? window.location.pathname + window.location.search : "",
    };

    track("devis_soumis", {
      source,
      besoin: need ?? undefined,
      kit: kitSlug ?? undefined,
      site: siteType ?? undefined,
      situation: situation ?? undefined,
      echeance: timing ?? undefined,
      avec_email: values.email.length > 0,
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        /* Le serveur peut renvoyer ses reproches champ par champ. */
        const fields = result.fields as
          | Partial<Record<ContactField, string>>
          | undefined;
        if (fields && Object.keys(fields).length > 0) {
          setErrors(fields);
          const first = Object.keys(fields)[0] as ContactField;
          window.requestAnimationFrame(() => fieldRefs.current[first]?.focus());
        }
        setServerError(result.error ?? "L'envoi a échoué.");
        setStatus("error");
        track("devis_erreur", { raison: "serveur", code: response.status });
        return;
      }
      setStatus("success");
      focusHeading();
      track("devis_succes", { source, besoin: need ?? undefined });
    } catch {
      setServerError("Connexion impossible. Réessayez ou passez par WhatsApp.");
      setStatus("error");
      track("devis_erreur", { raison: "reseau" });
    }
  }

  /* ── Confirmation ─────────────────────────────────────────────── */
  if (status === "success") {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8 lg:p-10">
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

        {/*
         * Le numéro composé, relu au visiteur. C'était la seule trace écrite
         * qu'il n'avait nulle part : ni accusé de réception, ni récapitulatif.
         * Le voir permet aussi d'attraper une faute de frappe tant qu'il est
         * encore sur la page — un chiffre faux, et le rappel n'arrive jamais.
         */}
        <p className="mt-4 leading-relaxed text-slate-600">
          Un ingénieur vous rappelle sous 24 h ouvrées au{" "}
          <strong className="font-display font-bold tracking-tight text-slate-900">
            {values.phone}
          </strong>
          {values.city ? `, pour votre site de ${values.city}.` : "."}
        </p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
            La suite
          </p>
          <ol className="mt-3 space-y-2.5">
            {[
              "L'appel, pour caler la visite du site.",
              "L'audit sur place, gratuit et sans engagement.",
              "Le devis chiffré poste par poste. Vous décidez ensuite.",
            ].map((line, i) => (
              <li key={line} className="flex gap-3 text-sm text-slate-700">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-slate-300 text-[11px] font-bold text-slate-500">
                  {i + 1}
                </span>
                {line}
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-5 text-[13px] leading-relaxed text-slate-500">
          Une erreur dans votre numéro&nbsp;? Écrivez-nous sur WhatsApp, nous
          corrigerons avant l&apos;appel.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button variant="neutral" asChild>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("devis_whatsapp", { depuis: "confirmation" })}
            >
              <WhatsAppIcon className="size-4 text-[#25D366]" />
              Continuer sur WhatsApp
            </a>
          </Button>
          <Button variant="outline-strong" className="group" asChild>
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
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft sm:p-8 lg:p-10">
      {/* Progression */}
      {pathResolved ? (
        <>
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
            {`Étape ${index + 1} sur ${steps.length}`}
          </p>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="h-1.5 w-10 rounded-full bg-brand-600" />
            <span className="h-1.5 flex-1 rounded-full bg-slate-200" />
          </div>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">
            Première question
          </p>
        </>
      )}

      {/* Ce qui est déjà acquis, et modifiable */}
      {(need || kit) && !isLast && index > 0 ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={editSelection}
            aria-label={`${kit ? kit.name : labelOf(needs, need)} — changer`}
            className="inline-flex min-h-[36px] flex-wrap items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-left text-sm text-brand-800 transition-colors hover:border-brand-400 hover:bg-brand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            <span className="font-semibold">
              {kit ? kit.name : labelOf(needs, need)}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 underline underline-offset-2">
              <Pencil className="size-3" aria-hidden="true" />
              changer
            </span>
          </button>
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
          className="mt-6 sm:mt-7"
        >
          <h2
            id="entonnoir-question"
            ref={headingRef}
            tabIndex={-1}
            /* L'en-tête est collant : sans marge de défilement, un focus
               programmé posait la question juste dessous, hors de vue. */
            className="scroll-mt-24 text-balance text-xl font-bold leading-snug text-slate-900 focus:outline-none sm:text-2xl"
          >
            {QUESTIONS[step].title}
          </h2>
          {QUESTIONS[step].hint ? (
            <p
              id="entonnoir-indice"
              className="mt-2 text-sm leading-relaxed text-slate-600"
            >
              {QUESTIONS[step].hint}
            </p>
          ) : null}

          <div className="mt-6 sm:mt-7">
            {/*
             * Les options d'un écran forment un vrai groupe : sans
             * `radiogroup`, un lecteur d'écran annonçait sept boutons
             * indépendants, sans dire qu'ils s'excluent ni à quelle question
             * ils répondaient. Cf. docs/design-system.md §6.
             */}
            {step === "besoin" ? (
              /*
               * Le catalogue ne répond pas à la même question que les six
               * domaines — « voilà mon problème » d'un côté, « je sais déjà ce
               * qu'il me faut » de l'autre. Le poser en septième carte
               * identique brouillait les deux : il devient un raccourci, en
               * trait discontinu, sous les autres.
               */
              <ChoiceGroup describedBy="entonnoir-indice">
                {domainNeeds.map((option) => (
                  <Choice
                    key={option.id}
                    icon={option.icon}
                    label={option.label}
                    detail={option.detail}
                    selected={need === option.id}
                    onSelect={() => {
                      setNeed(option.id);
                      setKitSlug(null);
                    }}
                  />
                ))}
                <Choice
                  key={kitNeed.id}
                  icon={kitNeed.icon}
                  label={kitNeed.label}
                  detail={kitNeed.detail}
                  selected={need === kitNeed.id}
                  shortcut
                  onSelect={() => setNeed(kitNeed.id)}
                />
              </ChoiceGroup>
            ) : null}

            {step === "palier" ? (
              <ChoiceGroup describedBy="entonnoir-indice">
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
                <Choice
                  icon={HelpCircle}
                  label="Je ne sais pas encore"
                  detail="Dimensionnez pour moi à partir de mes charges réelles."
                  selected={kitSlug === null}
                  shortcut
                  onSelect={() => setKitSlug(null)}
                />
              </ChoiceGroup>
            ) : null}

            {step === "site" ? (
              <ChoiceGroup describedBy="entonnoir-indice">
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
              </ChoiceGroup>
            ) : null}

            {step === "situation" ? (
              <ChoiceGroup describedBy="entonnoir-indice">
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
              </ChoiceGroup>
            ) : null}

            {step === "quand" ? (
              <ChoiceGroup describedBy="entonnoir-indice">
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
              </ChoiceGroup>
            ) : null}

            {step === "contact" ? (
              /*
               * `autoComplete="on"` explicite et jetons standards sur chaque
               * champ : c'est ce que le navigateur lit pour proposer le profil
               * enregistré (nom, téléphone, email, ville).
               *
               * Les champs sont contrôlés : la saisie survit désormais à un
               * aller-retour vers l'écran précédent, qui la vidait.
               */
              <form onSubmit={onSubmit} autoComplete="on" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      name="name"
                      ref={(node) => {
                        fieldRefs.current.name = node;
                      }}
                      value={values.name}
                      onChange={(event) => setField("name", event.target.value)}
                      onBlur={() => blurField("name")}
                      required
                      autoComplete="name"
                      autoCapitalize="words"
                      enterKeyHint="next"
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      placeholder="Votre nom"
                      className="mt-2"
                    />
                    <FieldError id="name-error" message={errors.name} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      ref={(node) => {
                        fieldRefs.current.phone = node;
                      }}
                      value={values.phone}
                      onChange={(event) =>
                        setField("phone", event.target.value)
                      }
                      onBlur={() => blurField("phone")}
                      type="tel"
                      inputMode="tel"
                      required
                      autoComplete="tel"
                      enterKeyHint="next"
                      aria-invalid={errors.phone ? true : undefined}
                      aria-describedby={
                        errors.phone ? "phone-error" : undefined
                      }
                      placeholder="+243 …"
                      className="mt-2"
                    />
                    <FieldError id="phone-error" message={errors.phone} />
                  </div>
                  <div>
                    <Label htmlFor="city">Ville du site</Label>
                    <Input
                      id="city"
                      name="city"
                      ref={(node) => {
                        fieldRefs.current.city = node;
                      }}
                      value={values.city}
                      onChange={(event) => setField("city", event.target.value)}
                      onBlur={() => blurField("city")}
                      required
                      autoComplete="address-level2"
                      enterKeyHint="next"
                      aria-invalid={errors.city ? true : undefined}
                      aria-describedby={errors.city ? "city-error" : undefined}
                      placeholder="Bunia, Goma, Kinshasa…"
                      className="mt-2"
                    />
                    <FieldError id="city-error" message={errors.city} />
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
                      ref={(node) => {
                        fieldRefs.current.email = node;
                      }}
                      value={values.email}
                      onChange={(event) =>
                        setField("email", event.target.value)
                      }
                      onBlur={() => blurField("email")}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      autoCapitalize="off"
                      enterKeyHint="next"
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      placeholder="Pour recevoir le devis écrit"
                      className="mt-2"
                    />
                    <FieldError id="email-error" message={errors.email} />
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
                    ref={(node) => {
                      fieldRefs.current.message = node;
                    }}
                    value={values.message}
                    onChange={(event) =>
                      setField("message", event.target.value)
                    }
                    onBlur={() => blurField("message")}
                    rows={3}
                    aria-invalid={errors.message ? true : undefined}
                    aria-describedby={
                      errors.message ? "message-error" : undefined
                    }
                    placeholder="Appareils à alimenter, autonomie souhaitée, contraintes du site…"
                    className="mt-2"
                  />
                  <FieldError id="message-error" message={errors.message} />
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

                <p className="mt-6 border-t border-slate-100 pt-5 text-xs leading-relaxed text-slate-500">
                  Réponse sous 24 h ouvrées. Vos informations servent uniquement
                  à traiter cette demande&nbsp;: elles ne sont ni revendues ni
                  transmises à un tiers.{" "}
                  <Link
                    href="/confidentialite"
                    className="font-semibold text-slate-600 underline underline-offset-2 hover:text-brand-700"
                  >
                    Ce que nous en faisons
                  </Link>
                  .
                </p>

                <div className={cn(BAR_CLASSES)}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="min-h-[44px] shrink-0 px-3 sm:px-5"
                    onClick={goBack}
                  >
                    <ArrowLeft className="size-4" />
                    Retour
                  </Button>
                  {/*
                   * `flex-1` sous sm : « Envoyer ma demande » à sa largeur
                   * naturelle plus « Retour » dépassaient la carte à 390 px, et
                   * le bouton sortait par la droite. Il prend ce qui reste.
                   */}
                  <Button
                    type="submit"
                    className="group ml-auto flex-1 px-4 text-[15px] sm:flex-none sm:px-7 sm:text-base"
                    disabled={status === "loading"}
                    aria-busy={status === "loading"}
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Envoi…
                      </>
                    ) : (
                      <>
                        <Send className="size-4" />
                        {/*
                         * Libellé raccourci sous 380 px : « Retour » et
                         * « Envoyer ma demande » ne tiennent pas côte à côte
                         * sur un Galaxy A16, et `flex-1` ne peut pas descendre
                         * sous la largeur minimale d'un texte insécable.
                         */}
                        <span className="min-[380px]:hidden">Envoyer</span>
                        <span className="hidden min-[380px]:inline">
                          Envoyer ma demande
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : null}
          </div>
        </motion.div>
      </AnimatePresence>

      {!isLast ? (
        /*
         * Barre d'action **collante**. La première question compte sept
         * réponses : « Continuer » se trouvait à près de deux écrans de
         * défilement sur un téléphone, alors que la réponse, elle, était déjà
         * donnée. La barre suit le regard et se pose d'elle-même au bas de la
         * carte quand celle-ci tient à l'écran.
         */
        <div className={cn(BAR_CLASSES)}>
          {index > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              className="min-h-[44px]"
              onClick={goBack}
            >
              <ArrowLeft className="size-4" />
              Retour
            </Button>
          ) : null}
          <Button
            className="group ml-auto"
            disabled={!answered[step]}
            onClick={goForward}
          >
            Continuer
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
