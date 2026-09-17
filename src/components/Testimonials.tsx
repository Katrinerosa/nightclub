import TestimonialsSlider from "./TestimonialsSlider";

type Testimonial = {
    id: number;
    name: string;
    content: string;
    asset: {
        url: string;
    };
    facebook: string;
    twitter: string;
};


export default async function Testimonials() {
    let events: Testimonial[] = [];

    try {
        // Hent events fra API'et.
        const response = await fetch(`${process.env.API_URL ?? "http://localhost:4000"}/testimonials`, {
            method: "GET",
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error("Kunne ikke hente Testimonials");
        }

        // Gem API'ets data 
        events = await response.json();
    } catch {
        return <p role="alert">Testimonials kunne ikke indlæses.</p>;
    }

    return (
        <section
            className="event-section bg-black mt-28 pt-28 bg-cover bg-center bg-no-repeat text-white"
            style={{
                backgroundImage:
                    "linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url('/footerbg.jpg')",
            }}
        >

            <div className="mx-auto w-full max-w-[1440px] md:w-3/4">

                <h2 className="text-center text-2xl font-semibold uppercase tracking-wider">
                    Testimonials
                </h2>

                <img
                    src="/bottom_line2.png"
                    alt=""
                    className="mx-auto mt-4 mb-20"
                />


                <TestimonialsSlider events={events} />
            </div>


        </section>
    )

}