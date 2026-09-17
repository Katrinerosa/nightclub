import EventsSlider from "./EventsSlider";

type NightClubEvent = {
    id: number;
    title: string;
    description: string;
    date: string;
    asset: {
        url: string;
    };
    location: string;
};


export default async function Events() {
    let events: NightClubEvent[] = [];

    try {
        // Hent events fra API'et.
        const response = await fetch("http://localhost:4000/events", {
            method: "GET",
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error("Kunne ikke hente events");
        }

        
        events = await response.json();
    } catch {
        return <p role="alert">Events kunne ikke indlæses.</p>;
    }

    return (
        <section
            className="event-section mt-28 pt-28  bg-black bg-cover bg-center bg-no-repeat text-white"
            style={{
                backgroundImage: "url('/event-bg/slider_bg_overlay.png')",
            }}
        >

            <div className="mx-auto w-full max-w-[1440px] md:w-3/4">

                <h2 className="text-center text-2xl font-semibold uppercase tracking-wider">
                    Events of the month
                </h2>

                <img
                    src="/bottom_line2.png"
                    alt=""
                    className="mx-auto mt-4 mb-20"
                />

                <EventsSlider events={events} />
            </div>

        </section>
    )

}