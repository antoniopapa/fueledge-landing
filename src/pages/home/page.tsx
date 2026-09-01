import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SourcingEngine from './components/SourcingEngine';
import Platform from './components/Platform';
import Outcomes from './components/Outcomes';
import FinalCta from './components/FinalCta';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />
      <main>
        <Hero />
        <SourcingEngine />
        <Platform />
        <Outcomes />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}