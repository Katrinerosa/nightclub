"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type BlogPost = {
    id: number;
    title: string;
    author: string;
    content: string;
    asset: {
        url: string;
    };
    comments?: { id: number }[];
};


type BlogSliderProps = {
    blogposts: BlogPost[];
};

export default function BlogSlider({ blogposts }: BlogSliderProps) {
    // Husk hvilket slide der vises.
    const [index, setIndex] = useState(0);

    // Hold pause, når brugeren interagerer med slideren.
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);


    // Del events op i grupper med 1 to i hver.
    const slides: BlogPost[][] = [];


    for (let i = 0; i < blogposts.length; i += 3) {
        slides.push(blogposts.slice(i, i + 3));
    }


    const slideCount = slides.length;
    const activeIndex = slideCount > 0 ? index % slideCount : 0;

    useEffect(() => {
        if (hovered || focused || slideCount < 2) return;

        // Skift slide hvert femte sekund.
        const timer = setInterval(() => {
            setIndex((current) => (current + 1) % slideCount);
        }, 5000);

        // Stop den gamle timer, når effekten afsluttes.
        return () => clearInterval(timer);
    }, [hovered, focused, slideCount]);

    if (slideCount === 0) {
        return <p>Der er ingen events at vise lige nu.</p>;
    }

    return (
        <div
            role="region"
            aria-label="Event-slideshow"
            aria-roledescription="carousel"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocusCapture={() => setFocused(true)}
            onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                    setFocused(false);
                }
            }}

        >
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-700 ease-in-out motion-reduce:transition-none"
                    style={{
                        transform: `translateX(-${activeIndex * 100}%)`,
                    }}
                >
                    {slides.map((slide, slideIndex) => (
                        <div
                            key={slide[0].id}
                            role="group"
                            aria-label={`Slide ${slideIndex + 1} af ${slideCount}`}
                            aria-hidden={slideIndex !== activeIndex}
                            className="grid w-full shrink-0 grid-cols-1 gap-[31.5px] md:grid-cols-3"
                        >
                            {slide.map((event) => (
                                <article key={event.id}>
                                    <Link
                                        href={`/blog/${event.id}`}
                                        className="block focus-visible:outline-2 focus-visible:outline-pink-500"
                                        tabIndex={slideIndex === activeIndex ? 0 : -1}
                                    >
                                        <div className="event-image group relative overflow-hidden">
                                            <img
                                                src={event.asset.url}
                                                alt={event.title}
                                                className="aspect-[459/240] w-full object-cover"
                                            />

                                            {/* Gør billedet mørkere ved hover. */}
                                            <div className="pointer-events-none absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                            {/* Viser titel og indhold nederst på billedet. */}
                                            <div className="absolute inset-x-0 bottom-0 bg-black/90 p-4 text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                                <h3 className="mb-2 text-lg font-medium uppercase">
                                                    {event.title}
                                                </h3>

                                                <p className="line-clamp-3 text-sm leading-relaxed">
                                                    {event.content}
                                                </p>
                                            </div>
                                        </div>

                                        <h3 className="mt-4 text-lg font-semibold uppercase">{event.title}</h3>
                                        <p className="mt-3 mb-4 line-clamp-3 text-sm text-white/75">{event.content}</p>
                                        <div className="flex flex-wrap gap-3 text-white">
                                            <span>{event.author}</span>
                                            <span>{event.comments?.length ?? 0} comments</span>
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
                {slides.map((slide, slideIndex) => (
                    <button
                        key={slide[0].id}
                        type="button"
                        aria-label={`Vis slide ${slideIndex + 1}`}
                        aria-current={slideIndex === activeIndex ? "true" : undefined}
                        onClick={() => setIndex(slideIndex)}
                        className="flex h-10 w-10 items-center justify-center focus-visible:outline-2 focus-visible:outline-pink-500"
                    >
                        <span
                            className={`h-3 w-3 ${slideIndex === activeIndex ? "bg-pink-500" : "bg-white"
                                }`}
                        />
                    </button>
                ))}


            </div>
        </div>
    );
}
