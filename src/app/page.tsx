import Hero from "../components/Hero";
import Header from "../components/Header";
import Welcome from "../components/Welcome";
import Events from "../components/Events";
import Gallery from "../components/Gallery";
import Videos from "../components/LatestVideo";
import Testimonials from "../components/Testimonials"
import Blog from "../components/Blog"
import { NewsletterForm } from "../components/newsletter/NewsletterForm";

export default function Home() {
  return (
    <>
      <Hero />
      <Header />
       <Welcome />
       <Events />
       <Gallery />
       <Videos />
       <Testimonials />
       <Blog />
       <NewsletterForm />

    </>
  );
}