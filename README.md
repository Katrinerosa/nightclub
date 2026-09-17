# NightClub

Et lokalt Next.js-projekt til en natklub med events, galleri, videoer, blog og bordbooking. Projektet videreudvikles efter den oprindelige skoleaflevering.

Repository: https://github.com/Katrinerosa/nightclub

## Start lokalt

1. Hent det oprindelige API fra https://github.com/rts-cmk/night-club-api, installer dets pakker med `npm install`, og start det på port 4000 med `npm start` i API-mappen.
2. Installer API-udvidelsen som beskrevet i [api-extension/README.md](api-extension/README.md).
3. Kør `npm ci` ved første installation af hjemmesiden.
4. Kør `npm run dev -- --port 3000` i denne mappe.
5. Åbn http://localhost:3000.

Serverens API-adresse kan sættes med `API_URL` i `.env.local`. Standardadressen er `http://localhost:4000`. Opret en bruger via `/register`; efter oprettelse bliver du automatisk logget ind. Der er ingen adgangskoder i dokumentationen.

## Funktioner

- Tilfældig hero-baggrund, logoanimation og navigation, der følger med ved scroll.
- Welcome-kort med animation ved mus, tastatur og tryk.
- Events fra API med automatisk slideshow og Book Now.
- Galleri fra API med lightbox, pile, Escape og luk-knap.
- To videoer med afspilningskontroller samt testimonials fra API.
- Nyhedsbrev og kontaktformular med validering og feedback.
- Blog med tre indlæg pr. side, kommentarer, svar og egne kommentarer.
- 15 valgbare borde; reservation for en hel aften med kontrol af bordets kapacitet.
- My Bookings med egne reservationer og annullering.
- Serverkontrol mod dobbeltbooking på samme dato og adgangskontrol via API-token.

## Teknologi

Next.js 16, React 19, TypeScript, Tailwind CSS 4, Motion og Zod. Det lokale API er det oprindelige `json-server-relationship` / `json-server-auth`-API med en booking-udvidelse. API'et bruger `embed`, `sort`, `order` og `limit` uden indledende understregning.

## Kontrol

```sh
npm run lint
npm run build
node --test api-extension/reservations.test.cjs
```

Booking-flowet er afprøvet med oprettelse, oversigt, annullering og afvisning af dobbeltbooking. En isoleret HTTP-test med data i hukommelsen har også kontrolleret samtidige reservationer og adgang til andre brugeres bookinger. Mobilformularen er visuelt gennemgået ved 414 px; forsiden er kontrolleret ved 390 px uden vandret overflow eller ødelagte billeder. Nyhedsbrevets validering og galleriets åbning/lukning er afprøvet i browseren.

Lint har ingen fejl, men giver anbefalinger om optimering af almindelige `img`-elementer. Det er ikke build-fejl.

## Indhold og videre udgivelse

Det oprindelige API indeholder demonstrationsindhold: Lorem ipsum, gamle eventdatoer og generiske blogtitler. Blogindlæggene har ikke publiceringsdatoer; de sorteres derfor efter ID, og der vises ikke opdigtede datoer. Indhold, navn, kontaktoplysninger og brugsrettigheder til mediefiler bør tilpasses, hvis projektet senere offentliggøres som en selvstændig portfolio-demo.

Dette er et lokalt demoprojekt, ikke et produktionsklart reservationssystem. JSON-API'et kører i én proces; en offentlig drift kræver en vedvarende database med unik begrænsning på bord/dato og en produktionsopsætning af godkendelse. Hjemmesiden er ikke publiceret som del af denne gennemgang. Den oprindelige `doc.md` er bevaret som historik.
