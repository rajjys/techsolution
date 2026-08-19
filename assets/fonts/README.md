# Outfit — pour les vignettes de partage uniquement

Ces deux TTF ne sont **jamais servis au navigateur**. Ils sont lus au moment
du build par `next/og` (satori), qui n'accepte ni woff2 ni les polices
chargées par `next/font`. La police du site, elle, reste servie par
`next/font/google` dans `app/layout.tsx` — c'est la même famille, chargée
autrement.

- Source : <https://github.com/google/fonts/tree/main/ofl/outfit> (`Outfit[wght].ttf`)
- Instanciés aux graisses 400 et 700, puis réduits au latin étendu (~29 Ko pièce)
- Licence : SIL Open Font License 1.1 — voir `OFL.txt`
