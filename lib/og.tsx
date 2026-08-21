import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";
import sharp from "sharp";

import { site } from "@/lib/site";

/** Format canonique des vignettes OpenGraph — imposé par WhatsApp et LinkedIn. */
export const OG_SIZE = { width: 1200, height: 630 } as const;

/**
 * **JPEG, et non PNG.**
 *
 * `ImageResponse` ne sait produire que du PNG. Sur une carte photographique,
 * le sans-perte pesait 700 Ko à 1 Mo par vignette — mesuré. WhatsApp cesse
 * d'afficher un aperçu au-delà d'environ 600 Ko, et c'est précisément le canal
 * pour lequel ces vignettes existent : une image trop lourde, c'est un lien
 * partagé qui redevient une URL nue. Le rendu est donc ré-encodé en JPEG,
 * autour de 130 Ko, ce qui est invisible à l'œil sur une photo voilée.
 */
export const OG_CONTENT_TYPE = "image/jpeg";

/**
 * Photo de fond par défaut — une **vraie** installation, pas un décor.
 *
 * L'hôtel Bambou à Kisangani : la scène est large, très lisible réduite à
 * 300 px dans un fil WhatsApp, et reconnaissable comme congolaise. C'est la
 * même image que le hero de /references, où elle est déjà légendée.
 */
const DEFAULT_PHOTO = "photos/kisangani-hotel-bambou.webp";

async function asset(relative: string) {
  return readFile(join(process.cwd(), "public", relative));
}

/**
 * Photo de fond, ramenée au format de la vignette et au JPEG.
 *
 * **satori ne décode pas le WebP**, et l'échec ne se voit qu'au prerender :
 * le typage, le lint et la compilation passent, puis le build casse sur
 * « Offset is outside the bounds of the DataView ». Toute la photothèque
 * étant en WebP, on décode ici une bonne fois plutôt que d'entretenir une
 * copie JPEG par image. Le recadrage au passage évite de faire porter à
 * satori une image bien plus grande que la vignette.
 */
async function backdrop(relative: string) {
  const buffer = await asset(relative);
  return sharp(buffer)
    .resize(OG_SIZE.width, OG_SIZE.height, { fit: "cover", position: "attention" })
    .jpeg({ quality: 84 })
    .toBuffer();
}

async function fonts() {
  const [regular, bold] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/outfit-400.ttf")),
    readFile(join(process.cwd(), "assets/fonts/outfit-700.ttf")),
  ]);
  return [
    { name: "Outfit", data: regular, style: "normal" as const, weight: 400 as const },
    { name: "Outfit", data: bold, style: "normal" as const, weight: 700 as const },
  ];
}

/**
 * Vignette de partage.
 *
 * Elle remplace le logo bleu sur fond blanc qui servait pour les huit pages :
 * dans un fil WhatsApp sombre, c'était un rectangle blanc qui ne disait ni ce
 * qu'on fait, ni où. Ici, trois choses et pas une de plus — le chantier, ce
 * que la page annonce, et d'où l'on intervient.
 *
 * @param eyebrow  surtitre court — la rubrique
 * @param title    l'accroche de la page, 2 à 3 lignes au plus
 * @param photo    chemin depuis `public/`, pour surcharger la photo par défaut
 */
export async function ogImage({
  eyebrow,
  title,
  photo = DEFAULT_PHOTO,
}: {
  eyebrow: string;
  title: string;
  photo?: string;
}) {
  const [background, logo, loaded] = await Promise.all([
    backdrop(photo),
    asset("assets/logo-full-white.png"),
    fonts(),
  ]);

  const bg = `data:image/jpeg;base64,${background.toString("base64")}`;
  const mark = `data:image/png;base64,${logo.toString("base64")}`;

  const rendered = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "Outfit",
          backgroundColor: "#0B0A33",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bg}
          alt=""
          width={OG_SIZE.width}
          height={OG_SIZE.height}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/*
          Voile écrit en toutes lettres, à huit paliers, et non en dégradé à
          trois arrêts : une rampe d'alpha linéaire laisse voir sa cassure de
          pente et se lit comme une arête franche (design-system §10).

          ⚠️ satori ne comprend ni le raccourci `inset`, ni un `<div>` sans
          `display: flex` — il l'ignore alors silencieusement. Le voile ne
          s'appliquait pas du tout, et cela ne se voyait ni au typage, ni au
          lint, ni au build : uniquement sur l'image produite.
        */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            backgroundImage:
              "linear-gradient(102deg, rgba(11,10,51,0.95) 0%, rgba(11,10,51,0.92) 20%, rgba(11,10,51,0.85) 34%, rgba(11,10,51,0.74) 46%, rgba(11,10,51,0.58) 58%, rgba(11,10,51,0.42) 70%, rgba(11,10,51,0.28) 84%, rgba(11,10,51,0.20) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px",
            width: "100%",
            height: "100%",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mark} alt="" height={68} width={159} style={{ height: 68, width: 159 }} />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 20,
              }}
            >
              {/* Le filet solaire des surtitres, réduit à sa forme la plus simple */}
              <div style={{ width: 34, height: 4, backgroundColor: "#FFB800", display: "flex" }} />
              <div
                style={{
                  fontSize: 21,
                  fontWeight: 700,
                  letterSpacing: 3.6,
                  textTransform: "uppercase",
                  color: "#FFB800",
                }}
              >
                {eyebrow}
              </div>
            </div>

            <div
              style={{
                fontSize: title.length > 64 ? 55 : 66,
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: -1.4,
                color: "#FFFFFF",
                maxWidth: 900,
                display: "flex",
              }}
            >
              {title}
            </div>

            <div
              style={{
                marginTop: 30,
                display: "flex",
                alignItems: "center",
                gap: 16,
                fontSize: 25,
                color: "#C7C6F5",
              }}
            >
              <div style={{ display: "flex" }}>Bunia · Kinshasa</div>
              <div style={{ width: 5, height: 5, borderRadius: 5, backgroundColor: "#6E6DE0", display: "flex" }} />
              <div style={{ display: "flex" }}>Interventions en RDC</div>
              <div style={{ width: 5, height: 5, borderRadius: 5, backgroundColor: "#6E6DE0", display: "flex" }} />
              <div style={{ display: "flex", fontWeight: 700, color: "#FFFFFF" }}>{site.phoneDisplay}</div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: loaded },
  );

  const jpeg = await sharp(Buffer.from(await rendered.arrayBuffer()))
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": OG_CONTENT_TYPE,
      /* Prérendues au build : elles ne changent qu'au déploiement suivant. */
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
