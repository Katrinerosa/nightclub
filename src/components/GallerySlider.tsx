"use client";
import ScrollAnimation from "./ScrollAnimation";

import {
  useEffect,
  useRef,
  useState,
  ViewTransition,
  startTransition,
} from "react";

type GalleryPhoto = {
  id: number;
  asset: {
    url: string;
  };
  description: string;
};

type GallerySliderProps = {
  photos: GalleryPhoto[];
};

export default function GallerySlider({ photos }: GallerySliderProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);


  function selectPhoto(nextIndex: number | null) {
    startTransition(() => {
      setSelectedIndex(nextIndex);
    });
  }

  useEffect(() => {
    if (selectedIndex === null) return;
    const previous = document.activeElement as HTMLElement | null;
    const close = document.getElementById("gallery-close");
    close?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowRight") setSelectedIndex(current => current === null ? null : (current + 1) % photos.length);
      if (event.key === "ArrowLeft") setSelectedIndex(current => current === null ? null : (current - 1 + photos.length) % photos.length);
      if (event.key === "Tab") {
        const buttons = [...document.querySelectorAll<HTMLButtonElement>('[role="dialog"] button')];
        const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
        event.preventDefault();
        buttons[(current + (event.shiftKey ? -1 : 1) + buttons.length) % buttons.length]?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); previous?.focus(); };
  }, [selectedIndex, photos.length]);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    let frameId = 0;

    function updateGallery() {
      if (!gallery) return;

      const top = gallery.getBoundingClientRect().top;
      const screenHeight = window.innerHeight;

      // Bevægelsen starter nær bunden af skærmen
      // og slutter, når galleriets top når midten.
      const start = screenHeight * 0.95;
      const end = screenHeight * 0.5;

      const progress = Math.min(
        1,
        Math.max(0, (start - top) / (start - end))
      );

      gallery.style.setProperty("--gallery-progress", String(progress));
    }

    function handleScroll() {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(updateGallery);
    }

    updateGallery();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

 return (
  <div className="relative overflow-x-clip">
    <ScrollAnimation>
      <div className="gallery-grid">
        {photos.slice(0, 7).map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => selectPhoto(index)}
            className={`gallery-item gallery-item-${index + 1}`}
          >
            {selectedIndex !== index ? (
              <ViewTransition
                name={`gallery-photo-${photo.id}`}
                share="gallery-morph"
                default="none"
              >
                <img
                  src={photo.asset.url}
                  alt={photo.description}
                  className="h-full w-full object-cover"
                />
              </ViewTransition>
            ) : (
              <div className="h-full w-full" aria-hidden="true" />
            )}
                   </button>
        ))}
      </div>
    </ScrollAnimation>

    {selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Forstørret galleribillede"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-6"
          onClick={() => setSelectedIndex(null)}
        >
          <button id="gallery-close" type="button" aria-label="Close gallery" onClick={() => setSelectedIndex(null)} className="absolute right-4 top-4 z-10 h-12 w-12 bg-black/70 text-3xl">×</button>
          <button
            type="button"
            aria-label="Forrige billede"
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-black/70 p-3"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedIndex((current) =>
                current === null
                  ? null
                  : (current - 1 + photos.length) % photos.length
              );
            }}
          >
            <img
              src="/gallery/botton_arrow.png"
              alt=""
              className="h-6 w-6 rotate-180 object-contain"
            />
          </button>

          <button
            type="button"
            aria-label="Næste billede"
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-black/70 p-3"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedIndex((current) =>
                current === null ? null : (current + 1) % photos.length
              );
            }}
          >
            <img
              src="/gallery/botton_arrow.png"
              alt=""
              className="h-6 w-6 object-contain"
            />
          </button>

          <img
            src={photos[selectedIndex].asset.url}
            alt={photos[selectedIndex].description}
            className="max-h-[85vh] max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}