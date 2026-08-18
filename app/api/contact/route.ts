import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

import {
  KIT_NEED,
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

const schema = z.object({
  /** Catalogue, ou l'un des six domaines — cf. lib/data/contact.ts. */
  need: z.enum(needs.map((option) => option.id) as [string, ...string[]]),
  kit: z.string().trim().max(80).optional().or(z.literal("")),
  siteType: z.enum(["maison", "bureau", "etablissement", "industriel"]),
  /** Absente quand le domaine ne la rend pas pertinente. */
  situation: z
    .enum(["aucun-reseau", "instable", "groupe", "extension"])
    .optional(),
  timing: z.enum(["urgent", "trois-mois", "cette-annee", "etude"]),
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
});

type Payload = z.infer<typeof schema>;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * Reconstitue la demande en clair. L'entonnoir transmet des identifiants ;
 * c'est ici qu'ils redeviennent des phrases lisibles par un commercial.
 */
function summarize(data: Payload) {
  const kit = kits.find((item) => item.slug === data.kit);
  const service = services.find((item) => item.slug === data.need);

  const object =
    kit?.name ?? service?.title ?? labelOf(needs, data.need) ?? "Demande";

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
  rows.push(["Site", labelOf(siteTypes, data.siteType) ?? "—"]);
  if (needsSituation(data.need)) {
    rows.push([
      "Situation actuelle",
      labelOf(situations, data.situation) ?? "—",
    ]);
  }
  rows.push(
    ["Échéance", labelOf(timings, data.timing) ?? "—"],
    ["Ville", data.city],
  );

  return { object, rows, kit };
}

function buildHtml(data: Payload) {
  const { object, rows } = summarize(data);

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:11px 20px;border-bottom:1px solid #E8EEFA;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#64748B;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:11px 20px;border-bottom:1px solid #E8EEFA;font-size:14px;color:#0F172A;font-weight:600;">${escapeHtml(value)}</td>
    </tr>`;

  /* Le commercial doit pouvoir appeler depuis son téléphone sans recopier. */
  const contact = `
    <tr>
      <td style="padding:11px 20px;border-bottom:1px solid #E8EEFA;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#64748B;white-space:nowrap;vertical-align:top;">Téléphone</td>
      <td style="padding:11px 20px;border-bottom:1px solid #E8EEFA;font-size:16px;font-weight:700;">
        <a href="tel:${escapeHtml(data.phone.replace(/\s/g, ""))}" style="color:#232199;text-decoration:none;">${escapeHtml(data.phone)}</a>
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

  const parsed = schema.safeParse(body);
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
      subject: `[Devis] ${object} — ${data.name}, ${data.city}`,
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
