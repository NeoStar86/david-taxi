import Advantages from "../components/Advantages";
import Areas from "../components/Areas";
import AvailabilityBadge from "../components/AvailabilityBadge";
import Contact from "../components/Contact";
import Faq from "../components/Faq";
import FareCalculator from "../components/FareCalculator";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import MobileStickyBar from "../components/MobileStickyBar";
import Navbar from "../components/Navbar";
import Services from "../components/Services";
import Testimonials from "../components/Testimonials";

export default function LandingApp() {
  return (
    <div id="top" className="min-h-screen bg-ink text-cream">
      <AvailabilityBadge />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Advantages />
        <Areas />
        <FareCalculator />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <MobileStickyBar />
    </div>
  );
}
