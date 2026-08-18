import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

import {
  KIT_NEED,
  isFreeform,
  labelOf,
  needs,
  needsSituation,
  siteTypes,
  situations,
  timings,
  validateField,
  type ContactField,
} from "@/lib/data/contact";
import { kits } from "@/lib/data/kits";
import { services } from "@/lib/data/services";
import { site } from "@/lib/site";

/**
 * Réception des demandes de l'entonnoir /contact.
 *
 * Variables d'environnement :
 *  - RESEND_API_KEY      clé API (https://resend.com/api-keys)
 *  - CONTACT_TO_EMAIL    boîte de réception de l'équipe commerciale
 *  - CONTACT_FROM_EMAIL  expéditeur vérifié dans Resend
 *
 * **En production, une configuration absente est une erreur, pas un succès.**
 * Le mode « consigné dans les logs » n'existe plus qu'en développement : il
 * répondait `ok: true` sans rien expédier, si bien qu'une variable oubliée sur
 * Vercel avalait silencieusement la totalité des demandes — le visiteur lisait
 * « Demande reçue » et personne ne recevait rien.
 *
 * Le **téléphone est requis, l'email facultatif** : en RDC on rappelle, on
 * n'écrit pas. L'email ne sert qu'à transmettre le devis écrit.
 */

const trim = (value: string) => value.trim();

/** Applique au serveur la règle exacte que le formulaire applique au client. */
function refine(field: ContactField) {
  return (value: string, ctx: z.RefinementCtx) => {
    const message = validateField(field, value ?? "");
    if (message) ctx.addIssue({ code: "custom", message, path: [] });
  };
}

const baseSchema = z.object({
  /** Catalogue, ou l'un des six domaines — cf. lib/data/contact.ts. */
  need: z.enum(needs.map((option) => option.id) as [string, ...string[]]),
  kit: z.string().trim().max(80).optional().or(z.literal("")),
  /* Absents sur une demande libre — cf. le superRefine plus bas. */
  siteType: z
    .enum(["maison", "bureau", "etablissement", "industriel"])
    .nullish(),
  /** Absente quand le domaine ne la rend pas pertinente. */
  situation: z
    .enum(["aucun-reseau", "instable", "groupe", "extension"])
    .nullish(),
  timing: z.enum(["urgent", "trois-mois", "cette-annee", "etude"]).nullish(),
  /*
   * Les quatre champs saisis réutilisent `validateField` — la même fonction
   * que le formulaire applique avant l'envoi. Une règle, un message, deux
   * barrières : l'API ne peut plus refuser ce que le client a accepté, ni
   * répondre dans une autre langue que lui.
   */
  name: z.string().superRefine(refine("name")).transform(trim),
  phone: z.string().superRefine(refine("phone")).transform(trim),
  city: z.string().superRefine(refine("city")).transform(trim),
  email: z
    .string()
    .optional()
    .default("")
    .superRefine(refine("email"))
    .transform(trim),
  message: z
    .string()
    .optional()
    .default("")
    .superRefine(refine("message"))
    .transform(trim),
  /** Piège à robots : rempli → on répond succès sans rien traiter. */
  website: z.string().optional(),
  /*
   * Origine de la demande. L'email disait quoi et pour qui, jamais par où :
   * impossible de savoir quel chemin du site produit des rappels, donc quoi
   * renforcer. Purement informatif — jamais de quoi refuser une demande.
   */
  source: z.enum(["kit", "service", "nu"]).optional(),
  referrer: z.string().max(500).optional().default(""),
  landing: z.string().max(500).optional().default(""),
});

/**
 * Ce que le formulaire garantit, le serveur le revérifie — y compris le
 * caractère conditionnel des champs. Une demande libre saute la qualification
 * mais doit porter un message ; toutes les autres doivent porter leur
 * qualification et peuvent se passer de message.
 */
const payloadSchema = baseSchema.superRefine((data, ctx) => {
  if (isFreeform(data.need)) {
    const message = validateField("message", data.message ?? "", {
      messageRequired: true,
    });
    if (message) {
      ctx.addIssue({ code: "custom", path: ["message"], message });
    }
    return;
  }
  if (!data.siteType) {
    ctx.addIssue({
      code: "custom",
      path: ["siteType"],
      message: "Réponse manquante.",
    });
  }
  if (!data.timing) {
    ctx.addIssue({
      code: "custom",
      path: ["timing"],
      message: "Réponse manquante.",
    });
  }
});

/* ── Limitation de débit ──────────────────────────────────────────────────
 *
 * Le piège à robots n'arrête que les plus naïfs, et l'endpoint déclenchait un
 * envoi Resend à chaque appel : sans plafond, c'est un distributeur d'emails
 * gratuit et une boîte de réception noyée.
 *
 * En mémoire, donc par instance : Fluid Compute réutilise les instances, ce
 * qui suffit à casser un flot venant d'une même source. Ce n'est pas une
 * défense distribuée — pour ça il faudrait Vercel BotID ou le WAF, et c'est
 * la marche suivante si l'abus devient réel.
 */
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 } as const;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(
    (at) => now - at < RATE_LIMIT.windowMs,
  );
  /* Purge opportuniste : sans elle la Map enfle à chaque IP vue. */
  if (hits.size > 5000) hits.clear();
  if (recent.length >= RATE_LIMIT.max) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

/** Première adresse de la chaîne de proxy — celle du client sur Vercel. */
function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "inconnu"
  );
}

type Payload = z.infer<typeof payloadSchema>;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * Numéro au format `wa.me` — indicatif pays, sans « + » ni zéro d'accès.
 *
 * Préfixer 243 sans réfléchir mutilait tout numéro étranger : un
 * « +33 6 12 34 56 78 » devenait « 24333612345678 ». Une forme internationale
 * explicite (« + » ou « 00 ») est donc respectée telle quelle ; seul un numéro
 * national congolais se voit compléter.
 *
 * Retourne `null` quand il n'y a pas de quoi construire un lien — l'email
 * n'affiche alors que l'appel.
 */
function toWhatsAppNumber(raw: string): string | null {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/[^0-9]/g, "");
  if (digits.length < 8) return null;
  if (trimmed.startsWith("+")) return digits;
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("243")) return digits;
  /*
   * National : 0XXXXXXXXX ou XXXXXXXXX. On retire le zéro d'accès puis on
   * re-teste l'indicatif — « (0243) 82 125 0250 » existe dans la nature, et
   * préfixer sans ce second test donnait 243243… Aucun mobile congolais ne
   * commence par 243 (les préfixes sont en 08x et 09x), le test est sûr.
   */
  const national = digits.replace(/^0/, "");
  return national.startsWith("243") ? national : `243${national}`;
}

/**
 * Reconstitue la demande en clair. L'entonnoir transmet des identifiants ;
 * c'est ici qu'ils redeviennent des phrases lisibles par un commercial.
 */
function summarize(data: Payload) {
  const kit = kits.find((item) => item.slug === data.kit);
  const service = services.find((item) => item.slug === data.need);

  /* Une demande libre n'a pas d'objet commercial : le sujet le dit. */
  const object = isFreeform(data.need)
    ? "Demande libre"
    : (kit?.name ?? service?.title ?? labelOf(needs, data.need) ?? "Demande");

  const rows: [string, string][] = [
    ["Demande", labelOf(needs, data.need) ?? "—"],
  ];
  if (kit) {
    rows.push(["Palier visé", `${kit.name} — ${kit.power}, ${kit.phase}`]);
    rows.push([
      "Composition catalogue",
      `${kit.inverter} · ${kit.battery} · ${kit.panels}`,
    ]);
  } else if (data.need === KIT_NEED) {
    rows.push(["Palier visé", "Non déterminé — à dimensionner"]);
  }
  const siteLabel = labelOf(siteTypes, data.siteType);
  if (siteLabel) rows.push(["Site", siteLabel]);
  if (needsSituation(data.need)) {
    const situationLabel = labelOf(situations, data.situation);
    if (situationLabel) rows.push(["Situation actuelle", situationLabel]);
  }
  const timingLabel = labelOf(timings, data.timing);
  if (timingLabel) rows.push(["Échéance", timingLabel]);
  rows.push(["Ville", data.city]);

  /* Par où la demande est arrivée — pour savoir quoi renforcer sur le site. */
  const origin =
    data.source === "kit"
      ? "Lien préqualifié depuis un kit"
      : data.source === "service"
        ? "Lien préqualifié depuis un domaine"
        : data.source === "nu"
          ? "Formulaire ouvert sans préqualification"
          : undefined;
  if (origin) rows.push(["Origine", origin]);
  if (data.landing && data.landing !== "/contact") {
    rows.push(["Page d'arrivée", data.landing]);
  }
  if (data.referrer) {
    /* Le domaine seul : l'URL entière encombre sans rien apprendre de plus. */
    try {
      const url = new URL(data.referrer);
      const label =
        url.host === new URL(site.url).host
          ? `Page précédente : ${url.pathname}`
          : `Venu de ${url.host}`;
      rows.push(["Provenance", label]);
    } catch {
      /* Referrer illisible : on n'en dit rien plutôt que d'écrire du bruit. */
    }
  }

  return { object, rows, kit };
}

function buildHtml(data: Payload) {
  const { object, rows } = summarize(data);

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:11px 20px;border-bottom:1px solid #E8EEFA;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#64748B;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:11px 20px;border-bottom:1px solid #E8EEFA;font-size:14px;color:#0F172A;font-weight:600;">${escapeHtml(value)}</td>
    </tr>`;

  /*
   * Le commercial doit pouvoir joindre depuis son téléphone sans recopier —
   * et en RDC le rappel le plus rapide passe par WhatsApp. Deux liens, un
   * seul numéro : appeler, ou écrire.
   */
  const wa = toWhatsAppNumber(data.phone);
  const contact = `
    <tr>
      <td style="padding:11px 20px;border-bottom:1px solid #E8EEFA;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#64748B;white-space:nowrap;vertical-align:top;">Téléphone</td>
      <td style="padding:11px 20px;border-bottom:1px solid #E8EEFA;font-size:16px;font-weight:700;">
        <a href="tel:${escapeHtml(wa ? `+${wa}` : data.phone)}" style="color:#232199;text-decoration:none;">${escapeHtml(data.phone)}</a>${
          wa
            ? `<span style="color:#CBD5E1;padding:0 8px;">|</span><a href="https://wa.me/${escapeHtml(wa)}" style="color:#1FA855;text-decoration:none;font-size:14px;font-weight:600;">WhatsApp</a>`
            : ""
        }
      </td>
    </tr>`;

  return `
  <div style="font-family:Helvetica,Arial,sans-serif;background:#F4F7FE;padding:28px 16px;">
    <div style="max-width:600px;margin:0 auto;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E8EEFA;">
      <div style="background:#0B0A33;padding:22px 26px;">
        <p style="margin:0;color:#FFB800;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.16em;">${escapeHtml(site.legalName)} — nouvelle demande</p>
        <h1 style="margin:8px 0 0;color:#FFFFFF;font-size:20px;line-height:1.3;">${escapeHtml(object)}</h1>
        <p style="margin:8px 0 0;color:#C9C8F6;font-size:14px;">${escapeHtml(data.name)} · ${escapeHtml(data.city)}</p>
      </div>

      <table style="width:100%;border-collapse:collapse;">
        ${contact}
        ${row("Email", data.email || "non communiqué")}
        ${rows.map(([label, value]) => row(label, value)).join("")}
      </table>

      ${
        data.message
          ? `<div style="padding:18px 26px;">
               <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#64748B;">Précisions du demandeur</p>
               <p style="margin:0;font-size:14px;line-height:1.7;color:#334155;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
             </div>`
          : ""
      }

      <div style="padding:16px 26px;background:#F4F7FE;border-top:1px solid #E8EEFA;">
        <p style="margin:0;font-size:12px;color:#64748B;">Rappeler sous 24 h ouvrées.${data.email ? " Répondre à cet email écrit directement au demandeur." : " Aucun email fourni : le téléphone est le seul canal."}</p>
      </div>
    </div>
  </div>`;
}

function buildText(data: Payload) {
  const { object, rows } = summarize(data);
  return [
    `Nouvelle demande — ${site.name}`,
    object,
    "",
    `Nom : ${data.name}`,
    `Téléphone : ${data.phone}`,
    ...(toWhatsAppNumber(data.phone)
      ? [`WhatsApp : https://wa.me/${toWhatsAppNumber(data.phone)}`]
      : []),
    `Email : ${data.email || "non communiqué"}`,
    ...rows.map(([label, value]) => `${label} : ${value}`),
    ...(data.message ? ["", "Précisions :", data.message] : []),
  ].join("\n");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Requête invalide." },
      { status: 400 },
    );
  }

  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    /*
     * Toutes les erreurs, indexées par champ — et non la première seule sous
     * son nom de variable anglais. Le formulaire les repose sous les champs
     * concernés ; il n'y a plus d'aller-retour réseau par faute de frappe.
     */
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key && !fields[key]) fields[key] = issue.message;
    }
    return NextResponse.json(
      {
        ok: false,
        error: "Quelques informations sont à corriger.",
        fields,
      },
      { status: 422 },
    );
  }

  const data = parsed.data;
  if (data.website) return NextResponse.json({ ok: true });

  if (rateLimited(clientIp(request))) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Trop de demandes envoyées depuis cet appareil. Réessayez dans quelques minutes, ou passez par WhatsApp.",
      },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const from =
    process.env.CONTACT_FROM_EMAIL ??
    `${site.legalName} <onboarding@resend.dev>`;

  const isProduction = process.env.NODE_ENV === "production";

  /*
   * Piège classique : le domaine est vérifié dans Resend, mais l'expéditeur
   * est resté sur le bac à sable partagé. Resend refuse alors tout
   * destinataire autre que le propriétaire du compte — avec un message qui
   * parle de vérifier le domaine, déjà fait.
   */
  const sandboxSender =
    from.includes("@resend.dev") && !to.endsWith("@resend.dev");

  /*
   * Une demande perdue coûte plus cher qu'une erreur affichée : en production,
   * toute configuration qui garantit la non-délivrance est traitée comme une
   * panne. Le visiteur voit alors l'erreur, garde sa saisie et se voit proposer
   * WhatsApp — au lieu de repartir convaincu d'avoir été entendu.
   */
  if (isProduction && (!apiKey || sandboxSender)) {
    console.error(
      "[contact] Configuration d'envoi invalide — demande NON délivrée :",
      {
        raison: !apiKey
          ? "RESEND_API_KEY absente"
          : `CONTACT_FROM_EMAIL sur le bac à sable Resend (${from})`,
        destinataire: to,
        demande: { ...data, website: undefined },
      },
    );
    return NextResponse.json(
      {
        ok: false,
        error: "L'envoi a échoué. Réessayez ou passez par WhatsApp.",
      },
      { status: 500 },
    );
  }

  if (sandboxSender) {
    console.warn(
      `[contact] CONTACT_FROM_EMAIL utilise le bac à sable Resend (${from}). ` +
        `Tant qu'il n'expédie pas depuis un domaine vérifié, seul le ` +
        `propriétaire du compte peut recevoir — l'envoi vers ${to} échouera.`,
    );
  }

  /* Développement seulement : on consigne et on laisse le parcours se dérouler. */
  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY absente — demande consignée :", {
      ...data,
      website: undefined,
    });
    return NextResponse.json({ ok: true, delivered: false });
  }

  const { object } = summarize(data);

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      /* Sans email fourni, un Reply-To vide ferait échouer l'envoi. */
      ...(data.email ? { replyTo: data.email } : {}),
      /* Le préfixe trie la boîte : un devis n'appelle pas la même personne
         qu'une demande hors catalogue. */
      subject: `${isFreeform(data.need) ? "[Message]" : "[Devis]"} ${object} — ${data.name}, ${data.city}`,
      html: buildHtml(data),
      text: buildText(data),
    });

    if (error) {
      console.error("[contact] Erreur Resend :", error);
      return NextResponse.json(
        {
          ok: false,
          error: "L'envoi a échoué. Réessayez ou passez par WhatsApp.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (error) {
    console.error("[contact] Exception :", error);
    return NextResponse.json(
      {
        ok: false,
        error: "L'envoi a échoué. Réessayez ou passez par WhatsApp.",
      },
      { status: 500 },
    );
  }
}
