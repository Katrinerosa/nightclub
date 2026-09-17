import GallerySlider from "./GallerySlider";

type GalleryPhoto = {
    id: number;
    asset: {
        url: string;
    };
    description: string;
};


export default async function Gallery() {
    let photos: GalleryPhoto[] = [];

    try {
        const response = await fetch(`${process.env.API_URL ?? "http://localhost:4000"}/gallery`, {
            method: "GET",
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error("Kunne ikke hente gallery");
        }

        photos = await response.json();
    } catch {
        return <p role="alert">Gallery kunne ikke indlæses.</p>;
    }

    return (
        <section className="bg-black py-25 text-white">
            <div className="mx-auto w-full max-w-[1440px]">
                <h2 className="text-center text-2xl font-semibold uppercase">
                    Night Club Gallery
                </h2>
                <img
                    src="/bottom_line2.png"
                    alt=""
                    className="mx-auto mt-4 mb-20"
                />

                <GallerySlider photos={photos} />
            </div>
        </section>
    );
}