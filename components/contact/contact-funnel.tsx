"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Gauge,
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
  SOLAR_NEED,
  isFreeform,
  labelOf,
  needs,
  needsPowerTier,
  needsSituation,
  siteQuestion,
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
 *
 * L'écran « site » fait exception : son verbe suit le domaine choisi, et vient
 * donc de `siteQuestion()`.
 */
const QUESTIONS: Record<StepId, { title: string; hint: string }> = {
  besoin: {
    title: "De quoi avez-vous besoin ?",
    hint: "Si plusieurs vous concernent, choisissez la principale.",
  },
  site: { title: "", hint: "" }, // dépend du domaine — cf. siteQuestion()
  situation: {
    title: "Comment est-ce alimenté aujourd'hui ?",
    hint: "De toutes les questions, c'est celle qui change le plus le devis.",
  },
  palier: {
    title: "Quelle puissance vous faut-il ?",
    hint: "Un ordre d'idée suffit. Si vous ne savez pas, dites-le — c'est l'audit qui tranche.",
  },
  quand: {
    title: "Dans quel délai ?",
    hint: "« Je compare encore » est une réponse utile : elle change notre appel.",
  },
  contact: {
    title: "Où peut-on vous rappeler ?",
    hint: "Trois champs, et c'est terminé.",
  },
};

/**
 * Ce que l'envoi déclenche — posé juste au-dessus du bouton.
 *
 * Ces trois lignes occupaient une section entière sous la page. Elles y
 * arrivaient trop tard : la question « qu'est-ce que je déclenche ? » se pose
 * au moment de taper son numéro, pas après. Elles remontent donc dans la carte,
 * au dernier écran, à l'endroit exact où l'on hésite.
 */
const TRIGGERS = [
  "L'appel d'un ingénieur, sous 24 h ouvrées.",
  "L'audit sur votre site, gratuit et sans engagement.",
  "Le devis, chiffré poste par poste.",
];

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
 * Trois états franchement distincts, et **aucun bleu**. Chaque carte portait
 * une pastille `brand-100` : sept d'affilée, l'écran devenait un aplat indigo
 * où la sélection ne se voyait plus, faute de contraste avec son voisinage.
 *
 * L'état choisi est en **solaire**, comme le bouton qui le valide. Choisir est
 * l'action du visiteur, et la couleur d'action du site est le jaune : lui
 * donner le bleu du mobilier revenait à peindre sa décision de la couleur des
 * meubles. Le reste suit la règle — texte sombre sur jaune (`brand-950`, 11:1),
 * la coche en quasi-noir pour qu'un seul jaune saturé porte la carte.
 *
 * Le repos est neutre et le survol emprunte l'anneau qui sert de signature au
 * site. Densité plus forte sous `sm`.
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
          ? "border-solar-500 bg-solar-50 ring-1 ring-solar-500"
          : `border-slate-200 bg-slate-50/70 hover:-translate-y-0.5 hover:border-brand-300
             hover:bg-white hover:shadow-card hover:ring-4 hover:ring-brand-100 hover:ring-offset-1`,
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors sm:size-10",
          selected
            ? "bg-solar-500 text-brand-950"
            : "bg-white text-slate-500 ring-1 ring-slate-200 group-hover:bg-brand-100 group-hover:text-brand-700 group-hover:ring-brand-200",
        )}
      >
        <Icon
          className="size-[18px] sm:size-5"
          strokeWidth={1.9}
          aria-hidden="true"
        />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block text-[15px] font-bold leading-snug sm:text-base",
            selected ? "text-brand-950" : "text-slate-900",
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            "mt-0.5 block text-[13px] leading-snug sm:text-[13.5px]",
            selected ? "text-solar-900" : "text-slate-600",
          )}
        >
          {detail}
        </span>
      </span>
      <span
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full transition-all",
          selected
            ? "bg-brand-950"
            : "border border-slate-300 group-hover:border-brand-400",
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
 * Le chemin, déduit des réponses.
 *
 * L'ordre n'est pas arbitraire : on nomme le besoin, on situe le lieu, on
 * décrit l'existant, **puis** on parle puissance. La question de puissance est
 * la plus intimidante des cinq — neuf paliers à comparer — et la poser en
 * quatrième position la fait tomber sur quelqu'un qui a déjà répondu trois
 * fois. Elle n'est d'ailleurs posée que pour les domaines que le catalogue
 * couvre vraiment.
 *
 * `skipTier` : une arrivée par `?kit=` a déjà désigné son palier ; on ne le lui
 * redemande pas. Le drapeau ne se lève jamais en cours de route — il ne
 * retombe que si le visiteur revient changer de domaine, à l'écran 0, d'où
 * toute navigation avant efface l'historique suivant.
 */
function buildSteps(need: string | null, skipTier: boolean): StepId[] {
  /* Une demande libre saute la qualification : elle n'apprendrait rien sur
     quelque chose qui, par définition, sort du cadre. */
  if (isFreeform(need)) return ["besoin", "contact"];
  return [
    "besoin",
    "site",
    ...(needsSituation(need) ? (["situation"] as StepId[]) : []),
    ...(needsPowerTier(need) && !skipTier ? (["palier"] as StepId[]) : []),
    "quand",
    "contact",
  ];
}

/**
 * Récapitulatif éditable — ce qui remplace la pastille « changer ».
 *
 * Elle ne montrait que la préqualification d'entrée, et rien de ce que le
 * visiteur venait de répondre. Au dernier écran il ne voyait donc plus ce
 * qu'il s'apprêtait à envoyer et devait remonter le parcours pour le vérifier.
 * Chaque réponse donnée devient une puce ; chaque puce rouvre son écran.
 */
function Recap({
  entries,
  onEdit,
}: {
  entries: { id: StepId; index: number; label: string; value: string }[];
  onEdit: (index: number) => void;
}) {
  if (entries.length === 0) return null;
  return (
    <div className="mt-4">
      {/* L'intitulé n'apparaît qu'à partir de deux puces : sur une seule, il
          double l'étiquette d'étape juste au-dessus sans rien apprendre. */}
      {entries.length > 1 ? (
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Votre demande
        </p>
      ) : null}
      <div className="flex flex-wrap gap-1.5">
        {entries.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => onEdit(entry.index)}
            aria-label={`Modifier — ${entry.label} : ${entry.value}`}
            className="group inline-flex max-w-full items-center gap-1.5 rounded-lg border border-slate-200 bg-white py-1.5 pl-2.5 pr-2 text-left transition-colors hover:border-brand-400 hover:bg-brand-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
          >
            <span className="truncate text-[13px] font-semibold text-slate-800 group-hover:text-brand-800">
              {entry.value}
            </span>
            <Pencil
              className="size-3 shrink-0 text-slate-400 transition-colors group-hover:text-brand-600"
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    </div>
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
  /* Un kit est une installation solaire : l'arrivée par `?kit=` répond au
     domaine autant qu'au palier. */
  const presetNeed = presetKit
    ? SOLAR_NEED
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
  /* Une arrivée qualifiée a déjà répondu à la première question : on la lui
     montre franchie plutôt que de la lui reposer — sans la lui interdire. */
  const [index, setIndex] = React.useState(presetNeed ? 1 : 0);
  /* `?kit=` désigne déjà un palier : l'écran des puissances est sauté, tant
     que le visiteur ne revient pas changer de domaine. */
  const [skipTier, setSkipTier] = React.useState(Boolean(presetKit));
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

  const steps = buildSteps(need, skipTier);
  const step = steps[Math.min(index, steps.length - 1)];
  const kit = kits.find((item) => item.slug === kitSlug);
  const isLast = step === "contact";
  /* Le total ne bouge plus dès que « besoin » est derrière nous. */
  const pathResolved = index > 0;

  /* Sur une demande libre, le message porte toute la demande : il cesse d'être
     facultatif, sans quoi l'équipe reçoit un nom, un numéro et rien d'autre. */
  const messageRequired = isFreeform(need);
  const siteCopy = siteQuestion(need);
  const question =
    step === "site"
      ? siteCopy
      : step === "contact" && messageRequired
        ? {
            title: QUESTIONS.contact.title,
            /* « Trois champs » serait faux ici : le message s'ajoute. */
            hint: "Votre message et vos coordonnées, et c'est terminé.",
          }
        : QUESTIONS[step];

  /* Chaque réponse déjà donnée, et l'écran qui permet de la reprendre. */
  const recap: { id: StepId; index: number; label: string; value: string }[] =
    [];
  for (const [i, id] of steps.entries()) {
    if (i >= index) break;
    const value =
      id === "besoin"
        ? labelOf(needs, need)
        : id === "site"
          ? labelOf(siteTypes, siteType)
          : id === "situation"
            ? labelOf(situations, situation)
            : id === "palier"
              ? (kit?.power ?? "Puissance à définir")
              : id === "quand"
                ? labelOf(timings, timing)
                : undefined;
    if (value) {
      recap.push({
        id,
        index: i,
        label: id === "besoin" ? "votre besoin" : QUESTIONS[id].title || siteCopy.title,
        value,
      });
    }
  }
  /* Une arrivée `?kit=` n'a pas traversé l'écran des puissances mais a bien
     un palier : il doit rester révisable. */
  if (skipTier && kit) {
    recap.splice(1, 0, {
      id: "palier",
      index: -1,
      label: "la puissance",
      value: kit.power,
    });
  }

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
  /**
   * Rouvre l'écran d'une réponse déjà donnée, depuis le récapitulatif.
   *
   * Le lien pointait vers /produits : cliquer « changer » quittait l'entonnoir
   * et effaçait tout. On reste dans la page. Un index de `-1` désigne le seul
   * écran absent du chemin — les puissances, sautées par une arrivée `?kit=` :
   * on le réintègre avant d'y aller.
   */
  function editStep(target: number) {
    let destination = target;
    if (target === -1) {
      setSkipTier(false);
      destination = buildSteps(need, false).indexOf("palier");
    }
    if (destination < 0) return;
    window.history.pushState(
      { ...window.history.state, tsFunnelStep: destination },
      "",
    );
    setIndex(destination);
    focusHeading();
    track("devis_selection_modifiee", { depuis: step, cible: steps[destination] ?? "palier" });
  }

  function setField(field: ContactField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    /* On efface l'erreur dès qu'elle est réparée, jamais on n'en ajoute ici. */
    setErrors((current) =>
      current[field] && !validateField(field, value, { messageRequired })
        ? { ...current, [field]: undefined }
        : current,
    );
  }

  function blurField(field: ContactField) {
    /* Un champ vide qu'on n'a pas encore tenté d'envoyer ne mérite pas
       de reproche : on ne valide au flou qu'une saisie commencée. */
    if (!attempted && values[field].trim().length === 0) return;
    const message = validateField(field, values[field], { messageRequired });
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
    const found = validateContact(values, { messageRequired });
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
      siteType: siteType ?? undefined,
      situation: needsSituation(need) ? (situation ?? undefined) : undefined,
      timing: timing ?? undefined,
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

  /*
   * Le bloc message, défini une fois et posé à deux endroits : devant les
   * coordonnées quand il porte la demande, derrière quand il n'est qu'un
   * complément.
   */
  const messageField = (
    <div className={messageRequired ? "" : "mt-5"}>
      <Label htmlFor="message">
        {messageRequired ? (
          "Que pouvons-nous faire pour vous ?"
        ) : (
          <>
            À ajouter ?{" "}
            <span className="font-normal text-slate-400">(facultatif)</span>
          </>
        )}
      </Label>
      <Textarea
        id="message"
        name="message"
        ref={(node) => {
          fieldRefs.current.message = node;
        }}
        value={values.message}
        onChange={(event) => setField("message", event.target.value)}
        onBlur={() => blurField("message")}
        rows={messageRequired ? 5 : 3}
        required={messageRequired}
        aria-invalid={errors.message ? true : undefined}
        aria-describedby={errors.message ? "message-error" : undefined}
        placeholder={
          messageRequired
            ? "Décrivez votre demande en quelques lignes."
            : "Appareils à alimenter, autonomie souhaitée, contraintes du site…"
        }
        className="mt-2"
      />
      <FieldError id="message-error" message={errors.message} />
    </div>
  );

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
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
            {`Étape ${index + 1} sur ${steps.length}`}
          </p>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="h-1.5 w-10 rounded-full bg-brand-600" />
            <span className="h-1.5 flex-1 rounded-full bg-slate-200" />
          </div>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Première question
          </p>
        </>
      )}

      {/* Ce qui est déjà répondu, et révisable d'un clic */}
      <Recap entries={recap} onEdit={editStep} />

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
            /*
             * La question est l'interaction principale de la page : elle porte
             * l'échelle d'un titre de bloc (22 → 30 px, cf. design-system.md
             * §4), pas celle d'une étiquette de champ. Alignée à gauche comme
             * l'indice et les cartes — un titre centré au-dessus de réponses
             * alignées à gauche fait repartir l'œil de deux endroits.
             */
            className="scroll-mt-24 text-balance font-display text-[24px] font-bold leading-[1.18] text-slate-900 focus:outline-none sm:text-[28px] lg:text-[30px]"
          >
            {question.title}
          </h2>
          {question.hint ? (
            <p
              id="entonnoir-indice"
              className="mt-2.5 text-[15px] leading-relaxed text-slate-600"
            >
              {question.hint}
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
              <ChoiceGroup describedBy="entonnoir-indice">
                {needs.map((option) => (
                  <Choice
                    key={option.id}
                    icon={option.icon}
                    label={option.label}
                    detail={option.detail}
                    /* « Autre chose » n'est pas un domaine de plus : elle sort
                       du lot, comme « je ne sais pas » sur les puissances. */
                    shortcut={isFreeform(option.id)}
                    selected={need === option.id}
                    onSelect={() => {
                      setNeed(option.id);
                      /* Changer de domaine annule le kit venu de l'URL, et
                         rend son écran au parcours. */
                      if (option.id !== SOLAR_NEED) {
                        setKitSlug(null);
                        setSkipTier(false);
                      }
                    }}
                  />
                ))}
              </ChoiceGroup>
            ) : null}

            {step === "palier" ? (
              <ChoiceGroup describedBy="entonnoir-indice">
                {/*
                  En tête, et non en pied : c'est la réponse **présélectionnée**,
                  et de loin la plus fréquente — on arrive rarement en sachant
                  qu'il faut 12 kVA. La reléguer sous neuf paliers obligeait à
                  faire défiler tout l'écran pour découvrir qu'on avait déjà
                  répondu.
                */}
                <Choice
                  icon={Gauge}
                  label="Je ne sais pas encore"
                  detail="Dimensionnez pour moi à partir de mes charges réelles."
                  selected={kitSlug === null}
                  shortcut
                  onSelect={() => setKitSlug(null)}
                />
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
                {/* Sur une demande libre, le message est la demande : il passe
                    devant les coordonnées, qui n'en sont que le moyen. */}
                {messageRequired ? messageField : null}

                <div className={cn("grid gap-5 sm:grid-cols-2", messageRequired && "mt-5")}>
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

                {messageRequired ? null : messageField}

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

                {/*
                 * Ce que l'envoi déclenche, juste au-dessus du bouton. Ces
                 * lignes occupaient une section entière sous la page, où elles
                 * arrivaient trop tard : on se demande « qu'est-ce que je
                 * déclenche ? » en tapant son numéro, pas après l'avoir envoyé.
                 */}
                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    En envoyant, vous déclenchez
                  </p>
                  <ol className="mt-3 space-y-2">
                    {TRIGGERS.map((line, i) => (
                      <li
                        key={line}
                        className="flex items-start gap-2.5 text-[13.5px] leading-snug text-slate-700"
                      >
                        <span className="mt-px flex size-[18px] shrink-0 items-center justify-center rounded-full border border-slate-300 text-[10px] font-bold text-slate-500">
                          {i + 1}
                        </span>
                        {line}
                      </li>
                    ))}
                  </ol>
                  <p className="mt-3 border-t border-dashed border-slate-200 pt-3 text-[13px] leading-relaxed text-slate-500">
                    Rien n&apos;est facturé avant que le devis soit entre vos
                    mains. Vous pouvez arrêter à n&apos;importe quelle étape.
                  </p>
                </div>

                <p className="mt-5 text-xs leading-relaxed text-slate-500">
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
