# Dokumentation
Navn: Katrine Beck
Hold: WU14

## Tech-stack

- **Next.js** er et framework baseret på React. Jeg bruger det til at bygge sidernes struktur og samle genbrugelige komponenter som Hero og Header.
- **TypeScript** tilføjer typer til JavaScript og hjælper med at opdage typefejl under udviklingen.
- **Tailwind CSS** har færdige klasser, som jeg bruger til farver, afstande og layout, centrering og responsivt layout.
- **CSS** bruger jeg til egne animationer med `@keyframes`, blandt andet indtoningen af hero-logoet. og de der trekanter

## Kodeeksempel: Animation af hero-logo

- Mit logo toner frem i stedet for at folde ind.. Den opfylder ikke kravet om en fold-in-animation. Jeg brugte tid på at undersøge CSS-animationer og forstå, hvordan @keyframes og opacity arbejder sammen. Opacity ændrer logoets gennemsigtighed, mens 1s bestemmer, at ændringen fra usynligt til synligt tager ét sekund.

```css
.hero-logo {
  animation: logo-fade-in 1s ease-out both;
}

@keyframes logo-fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
```

Animationen får logoet til at tone frem på ét sekund.
`from` og `to` beskriver start- og sluttilstanden.
`opacity` ændres fra 0 (usynlig) til 1 (helt synlig).
`ease-out` får ændringen til at aftage mod slutningen.
`both` anvender animationens start- og sluttilstand før og efter afspilningen.

## Video

Self-hosted or direct video files: Embed self-hosted videos using the <video> tag for scenarios requiring detailed control over the player's functionality and appearance. This integration method within Next.js allows for customization and control of your video content.

export function Video() {
  return (
    <video
      width="320"
      height="240"
      poster="/path/to/poster.jpg"
      controls
      preload="none"
    >
      <source src="/path/to/video.mp4" type="video/mp4" />
      <track
        src="/path/to/captions.vtt"
        kind="subtitles"
        srcLang="en"
        label="English"
      />
      Your browser does not support the video tag.
    </video>
  )
}


const WelcomeMessage = (props) => {
  const { isLoggedIn, user } = props;
  return (<div>
    {isLoggedIn ? <h2>Welcome back, {user}!</h2> :
      <p>Please log in to continue </p>
    }
  </div>)
}
export default function App() {
  const user = "John";
  const isLoggedIn = true;

  return <WelcomeMessage user={user} isLoggedIn = {isLoggedIn}/>
}
## Min Header skifter mellem Log in og Log out
Min Header er en funktionskomponent. 
isLoggedIn er en værdi som enten er true eller false.

kode jeg synes var lidt sjov

{isLoggedIn ? (
  <form action={logout}>
    <button type="submit">Log out</button>
  </form>
) : (
  <Link href="/login">Log in</Link>
)}


## Blog
Når man klikker på et blogcard, bruger linket indlæggets ID til at finde adressen
Hvis ID er 2, åbnes /blog/2. Mappen [id] gør at den samem side kan vise forsekllige blogindlæg.
Page.tsx bruger ID til at hente det valgte indlæg fra API.

href={`/blog/${event.id}`}. Det er fra min event slider normalt ville man nok bruge post.

## Kilder

- [MDN: @keyframes](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@keyframes#syntax)
  – Forklaring af from og to.
- [MDN: animation](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation#syntax)
  – Forklaring af animationens indstillinger.
- [MDN: opacity](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/opacity)
  – Forklaring af gennemsigtighed.
- [Typescript: Type Aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)

- [How to use and optimize videos, NEXT.js](https://nextjs.org/docs/app/guides/videos)

- [MDN: iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe#attributes)
- [Motion: scroll](https://motion.dev/docs/react-scroll-animations#track-element-scroll-position-through-viewport)
- [Motion: scroll](https://motion.dev/docs/react-scroll-animations#animate-once-on-scroll)
- [Motion: scroll](https://motion.dev/docs/react-scroll-animations#scroll-triggered-animations)
- [MDN: gradiant](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/linear-gradient)
- [How to blog API, NEXT.js](https://nextjs.org/blog/building-apis-with-nextjs)
- [How to blog API, NEXT.js](https://stackoverflow.com/questions/78961549/how-can-i-show-an-updated-header-component-with-a-users-info-in-next-js)
- [How to blog API, NEXT.js](https://react.dev/learn/conditional-rendering#conditional-ternary-operator--)
- [https://www.educative.io/](https://www.educative.io/answers/how-to-use-the-isloggedin-prop-in-reactjs)