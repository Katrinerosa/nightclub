"use client";

import { useRef, useState } from "react";

const videos = [
  "/videos/video-crowd.mp4",
  "/videos/video-dj-crowd-2.mp4",
];

export default function Videos() {
  const [index, setIndex] = useState(0);

  return (
    <section className="bg-black px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-[1440px] md:w-3/4">
        <h2 className="text-center text-2xl font-semibold uppercase tracking-wider">
          Latest Video
        </h2>

        <img
          src="/bottom_line2.png"
          alt=""
          className="mx-auto mt-4 mb-20"
        />

        <VideoPlayer key={videos[index]} src={videos[index]} />

        {/* Pile under videoen */}
        <div className="mt-6 flex justify-center gap-2">
          <button
            type="button"
            aria-label="Forrige video"
            onClick={() =>
              setIndex(
                (current) => (current - 1 + videos.length) % videos.length
              )
            }
            className="flex h-8 w-8 items-center justify-center border border-white hover:border-pink-500 hover:text-pink-500"
          >
            ‹
          </button>

          <button
            type="button"
            aria-label="Næste video"
            onClick={() =>
              setIndex((current) => (current + 1) % videos.length)
            }
            className="flex h-8 w-8 items-center justify-center border border-white hover:border-pink-500 hover:text-pink-500"
          >
            ›
          </button>
        </div>


      </div>
    </section>
  );
}

function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState("");

  async function play() {
    setError("");
    try {
      await videoRef.current?.play();
    } catch {
      setError("Videoen kunne ikke startes. Prøv igen.");
    }
  }

  return (
    <div>
      <div className="relative overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={src}
          poster="/video_poster.jpg"
          aria-label="NightClub video"
          className="aspect-[1170/500] w-full object-contain"
          controls={started}
          playsInline
          preload="none"
          onPlay={() => setStarted(true)}
          onError={() => setError("Videoen kunne ikke indlæses. Prøv igen senere.")}
        >
          Your browser does not support the video tag.
        </video>
        {!started && (
          <button
            type="button"
            aria-label="Afspil video"
            onClick={play}
            className="group absolute inset-0 grid cursor-pointer place-items-center bg-black/15 transition hover:bg-black/30 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-pink-500"
          >
            <span className="grid h-16 w-16 place-items-center rounded-full border-2 border-white bg-black/45 text-white transition group-hover:scale-110 group-hover:border-pink-500 group-hover:text-pink-500 sm:h-24 sm:w-24 motion-reduce:transform-none">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-1 h-8 w-8 fill-current sm:h-10 sm:w-10"><path d="M7 4v16l13-8z" /></svg>
            </span>
          </button>
        )}
      </div>
      {error && <p role="alert" className="mt-3 text-red-400">{error}</p>}
    </div>
  );
}
