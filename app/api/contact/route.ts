import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

import { site } from "@/lib/site";

/**
 * Endpoint de réception des demandes de devis (formulaire /contact).
 *
 * Configuration production (Vercel → Settings → Environment Variables) :
 *  - RESEND_API_KEY      : clé API Resend (https://resend.com/api-keys)
 *  - CONTACT_TO_EMAIL    : boîte de réception des demandes (défaut : info@techsolution.cd)
 *  - CONTACT_FROM_EMAIL  : expéditeur vérifié dans Resend, ex. "Tech Solution <devis@techsolution.cd>"
 *                          (tant que le domaine techsolution.cd n'est pas vérifié
 *                          dans Resend, le défaut onboarding@resend.dev fonctionne).
 *
 * Sans RESEND_API_KEY (démo/développement), la demande est consignée côté
 * serveur et l'API répond succès afin de ne pas bloquer le parcours visiteur.
 */
const contactSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(120),
  organization: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.email("Adresse email invalide"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s().-]{8,20}$/, "Numéro de téléphone invalide"),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10, "Message trop court").max(5000),
  /** Honeypot anti-spam : les humains le laissent vide (contrôlé après parsing
   *  pour répondre un faux succès aux robots, sans révéler le champ piège). */
  website: z.string().optional(),
});

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildEmailHtml(data: z.infer<typeof contactSchema>): string {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #E2E8F0;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#64748B;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #E2E8F0;font-size:14px;color:#0F172A;font-weight:600;">${escapeHtml(value)}</td>
    </tr>`;

  return `
  <div style="font-family:Helvetica,Arial,sans-serif;background:#F8FAFC;padding:32px;">
    <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;">
      <div style="background:#0B192C;padding:24px 28px;">
        <p style="margin:0;color:#FFB800;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.15em;">Tech Solution RDC — ${escapeHtml(site.domain)}</p>
        <h1 style="margin:6px 0 0;color:#FFFFFF;font-size:20px;">Nouvelle demande de devis</h1>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        ${row("Nom", data.name)}
        ${row("Organisation", data.organization || "—")}
        ${row("Email", data.email)}
        ${row("Téléphone", data.phone)}
        ${row("Objet", data.subject)}
      </table>
      <div style="padding:20px 28px;">
        <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#64748B;">Message</p>
        <p style="margin:0;font-size:14px;line-height:1.7;color:#334155;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
      </div>
      <div style="padding:16px 28px;background:#F8FAFC;border-top:1px solid #E2E8F0;">
        <p style="margin:0;font-size:12px;color:#94A3B8;">Répondez directement à cet email pour contacter le demandeur (Reply-To configuré).</p>
      </div>
    </div>
  </div>`;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Corps de requête invalide." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      {
        ok: false,
        error: firstIssue
          ? `Champ « ${String(firstIssue.path[0] ?? "formulaire")} » : ${firstIssue.message}`
          : "Données du formulaire invalides.",
      },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Honeypot rempli → robot : on répond succès sans traiter.
  if (data.website && data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const from =
    process.env.CONTACT_FROM_EMAIL ??
    "Tech Solution RDC <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn(
      "[contact] RESEND_API_KEY absente — demande consignée sans envoi email :",
      { ...data, website: undefined },
    );
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: data.email,
      subject: `[${site.domain}] ${data.subject} — ${data.name}`,
      html: buildEmailHtml(data),
      text: [
        `Nouvelle demande de devis — ${site.name}`,
        `Nom : ${data.name}`,
        `Organisation : ${data.organization || "—"}`,
        `Email : ${data.email}`,
        `Téléphone : ${data.phone}`,
        `Objet : ${data.subject}`,
        "",
        data.message,
      ].join("\n"),
    });

    if (error) {
      console.error("[contact] Erreur Resend :", error);
      return NextResponse.json(
        {
          ok: false,
          error:
            "L'envoi a échoué. Réessayez ou contactez-nous via WhatsApp.",
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
        error: "L'envoi a échoué. Réessayez ou contactez-nous via WhatsApp.",
      },
      { status: 500 },
    );
  }
}
