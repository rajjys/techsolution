
import { NextResponse } from "next/server";

/*
 * Mode maintenance — Proxy (ex-Middleware, renommé en Next 16).
 *
 * Il répond 503 + `Retry-After` à toutes les URL, robots.txt et sitemap
 * compris : c'est le bon signal pour une coupure **courte**. Au-delà de
 * quelques jours, Google commence à désindexer — ne pas s'en servir pour une
 * suspension longue. Le `.env` local le met à `true` : lancer le serveur de
 * test avec `MAINTENANCE_MODE=false`.
 */
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === "true";

export function proxy() {
  if (!MAINTENANCE_MODE) {
    return NextResponse.next();
  }

  return new NextResponse(
    `<!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Service temporairement indisponible</title>
        <style>
          body {
            font-family: system-ui, sans-serif;
            background: #f8fafc;
            color: #0f172a;
            min-height: 100vh;
            margin: 0;
            display: grid;
            place-items: center;
            text-align: center;
          }
          main {
            max-width: 560px;
            padding: 32px 24px;
          }
          h1 { font-size: 2rem; }
          p { line-height: 1.7; color: #475569; }
        </style>
      </head>
      <body>
        <main>
          <h1>Service temporairement indisponible</h1>
          <p>
            Ce site web est temporairement indisponible.
            Veuillez contacter le prestataire de services pour plus d'informations.
          </p>
        </main>
      </body>
    </html>`,
    {
      status: 503,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Retry-After": "3600",
        "Cache-Control": "no-store",
      },
    }
  );
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};