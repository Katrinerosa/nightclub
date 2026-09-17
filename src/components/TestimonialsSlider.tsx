"use client";

import { useEffect, useState } from "react";

type Testimonials = {
    id: number;
    name: string;
    content: string;
    asset: {
        url: string;
    };
    facebook: string;
    twitter: string;
};

type TestimonialsSliderProps = {
    events: Testimonials[];
};

export default function TestimonialsSlider({ events }: TestimonialsSliderProps) {
    // Husk hvilket slide der vises.
    const [index, setIndex] = useState(0);

    // Hold pause, når brugeren interagerer med slideren.
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);


    // Del alle events op i grupper med to i hver.
    const slides = events.slice(0, 3).map((testimonial) => [testimonial]);


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
        return <p>Der er ingen Testimonials at vise lige nu.</p>;
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
                            className="w-full shrink-0"
                        >
                            {slide.map((event) => (
                                <article key={event.id} className="px-6 text-center">
                                    <img
                                        src={event.asset.url}
                                        alt={event.name}
                                        className="mx-auto h-[210px] w-[210px] object-cover"
                                    />

                                    <h3 className="mt-4 font-semibold uppercase">
                                        {event.name}
                                    </h3>

                                    <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed">
                                        {event.content}
                                    </p>

                                    <div className="mt-4 flex justify-center gap-3">
                                        <a
                                            href={event.facebook}
                                            aria-label="Facebook"
                                            className="flex h-9 w-9 items-center justify-center "
                                        >
                                            <img
                                                src="facebook.png"
                                                alt=""
                                                className="h-5 w-5 object-contain"
                                            />
                                        </a>

                                        <a
                                           
                                            aria-label="Snapchat"
                                            className="flex h-9 w-9 items-center justify-center"
                                        >
                                            <img
                                                src="/snapchat.png"
                                                alt=""
                                                className="h-5 w-5 object-contain"
                                            />
                                        </a>
                                        <a
                                            href={event.twitter}
                                            aria-label="Twitter"
                                            className="flex h-9 w-9 items-center justify-center"
                                        >
                                        <img
                                            src="/twitter.png"
                                            alt=""
                                            className="h-5 w-5 object-contain"
                                        />
                                         </a>

                                    </div>
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