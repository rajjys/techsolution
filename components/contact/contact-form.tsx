"use client";

import * as React from "react";
import { CheckCircle2, Loader2, Send, TriangleAlert } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const contactSubjects = [
  "Étude & devis — Énergie solaire",
  "Backup & stockage d'énergie",
  "Infrastructure électrique",
  "Télécoms & médias",
  "Sécurité électronique",
  "Maintenance & climatisation",
  "Catalogue produits",
  "Autre demande",
] as const;

type FormStatus = "idle" | "loading" | "success" | "error";

type FieldErrors = Partial<
  Record<"name" | "email" | "phone" | "message", string>
>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s().-]{8,20}$/;

export function ContactForm({
  defaultSubject,
  defaultMessage,
}: {
  defaultSubject?: string;
  defaultMessage?: string;
}) {
  const [status, setStatus] = React.useState<FormStatus>("idle");
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const formRef = React.useRef<HTMLFormElement>(null);

  const validate = (data: FormData): FieldErrors => {
    const next: FieldErrors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (name.length < 2) next.name = "Veuillez indiquer votre nom complet.";
    if (!EMAIL_RE.test(email))
      next.email = "Veuillez saisir une adresse email valide.";
    if (!PHONE_RE.test(phone))
      next.phone = "Veuillez saisir un numéro de téléphone valide.";
    if (message.length < 10)
      next.message =
        "Décrivez brièvement votre projet (10 caractères minimum).";
    return next;
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const fieldErrors = validate(data);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setStatus("loading");
    setServerError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          organization: data.get("organization"),
          email: data.get("email"),
          phone: data.get("phone"),
          subject: data.get("subject"),
          message: data.get("message"),
          website: data.get("website"), // honeypot
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(
          payload.error ??
            "Une erreur est survenue lors de l'envoi. Veuillez réessayer.",
        );
      }

      setStatus("success");
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'envoi. Veuillez réessayer.",
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50/60 p-10 text-center"
        role="status"
      >
        <span className="flex size-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="size-8 text-emerald-600" />
        </span>
        <h3 className="mt-6 font-display text-xl font-bold text-slate-900">
          Demande envoyée avec succès !
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
          Merci pour votre confiance. Notre équipe technique vous répond sous{" "}
          <span className="font-semibold text-slate-900">24 h ouvrées</span>.
          Besoin d&apos;une réponse immédiate ?
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button variant="whatsapp" asChild>
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="size-4" />
              Continuer sur WhatsApp
            </a>
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              formRef.current?.reset();
              setStatus("idle");
            }}
          >
            Nouvelle demande
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Nom complet <span className="text-solar-600">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Ex. : Jean-Claude Mbuyi"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            required
          />
          {errors.name ? (
            <p id="name-error" className="text-xs font-medium text-red-600">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="organization">Organisation / Entreprise</Label>
          <Input
            id="organization"
            name="organization"
            autoComplete="organization"
            placeholder="Ex. : ONG, banque, entreprise…"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">
            Adresse email <span className="text-solar-600">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="vous@organisation.org"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            required
          />
          {errors.email ? (
            <p id="email-error" className="text-xs font-medium text-red-600">
              {errors.email}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">
            Téléphone / WhatsApp <span className="text-solar-600">*</span>
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+243 8XX XXX XXX"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            required
          />
          {errors.phone ? (
            <p id="phone-error" className="text-xs font-medium text-red-600">
              {errors.phone}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Objet de la demande</Label>
        <Select
          id="subject"
          name="subject"
          defaultValue={defaultSubject ?? contactSubjects[0]}
        >
          {contactSubjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">
          Votre projet <span className="text-solar-600">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Décrivez votre site, vos équipements à alimenter, votre localisation…"
          defaultValue={defaultMessage}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          required
        />
        {errors.message ? (
          <p id="message-error" className="text-xs font-medium text-red-600">
            {errors.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot anti-spam — invisible pour les humains */}
      <div className="absolute left-[-9999px] top-auto" aria-hidden="true">
        <label htmlFor="website">Ne pas remplir ce champ</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {status === "error" && serverError ? (
        <div
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          {serverError}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
        <Button
          type="submit"
          size="lg"
          disabled={status === "loading"}
          className="sm:min-w-[240px]"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="animate-spin" />
              Envoi en cours…
            </>
          ) : (
            <>
              <Send />
              Envoyer ma demande
            </>
          )}
        </Button>
        <p className="text-xs leading-relaxed text-slate-500">
          Réponse sous 24 h ouvrées.
          <br className="hidden sm:block" /> Vos informations restent
          strictement confidentielles.
        </p>
      </div>
    </form>
  );
}
