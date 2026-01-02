import Navbar from '@/components/new/Navbar';
import Hero from '@/components/new/Hero';
import Brands from '@/components/new/Brands';
import Features from '@/components/new/Features';
import HowItWorks from '@/components/new/HowItWorks';
import Ranks from '@/components/new/Ranks';
import Stats from '@/components/new/Stats';
import CTA from '@/components/new/CTA';
import Footer from '@/components/new/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Brands />
      <Features />
      <HowItWorks />
      <Ranks />
      <Stats />
      <CTA />
      <Footer />
    </div>
  );
}
