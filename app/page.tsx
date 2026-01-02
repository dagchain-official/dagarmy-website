import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import HowItWorks from '@/components/HowItWorks';
import Ranks from '@/components/Ranks';
import RankBadges from '@/components/RankBadges';
import Airdrops from '@/components/Airdrops';
import DAGPoints from '@/components/DAGPoints';
import Tasks from '@/components/Tasks';
import Transparency from '@/components/Transparency';
import WhoShouldJoin from '@/components/WhoShouldJoin';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <About />
      <HowItWorks />
      <Ranks />
      <RankBadges />
      <Airdrops />
      <DAGPoints />
      <Tasks />
      <Transparency />
      <WhoShouldJoin />
      <CTA />
      <Footer />
    </div>
  );
}
