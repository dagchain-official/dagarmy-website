import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import About from "@/components/otherPages/about/About";
import Features from "@/components/otherPages/about/Features";
import OurVisions from "@/components/otherPages/about/OurVisions";
import Facts from "@/components/otherPages/about/Facts";
import Banner from "@/components/otherPages/about/Banner";
import Testimonials from "@/components/homes/home-1/Testimonials";
import Instractors from "@/components/homes/home-1/Instractors";

export const metadata = {
  title: "About Us - DAGARMY | Future-Ready Tech Education",
  description: "Learn about DAGARMY's mission to build a global army of future-ready tech leaders through AI, Blockchain, and Data Visualization training.",
};

export default function AboutPage() {
  return (
    <>
      <div id="wrapper">
        <Header2 />
        
        <div className="page-title basic" style={{ background: '#fff', paddingTop: '140px', paddingBottom: '60px' }}>
          <div className="tf-container full">
            <div className="row">
              <div className="col-12">
                <div className="content text-center">
                  <h2 className="font-cardo fw-7" style={{ color: '#1f2937' }}>About Us</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="main-content pt-0">
          <About />
          <Features />
          <OurVisions />
          <Facts />
          <Testimonials parentClass="tf-spacing-5 widget-saying bg-4 page-about" />
          <div className="tf-spacing-5 pt-0"></div>
          <Instractors />
          <Banner />
        </div>
        
        <Footer1 />
      </div>
    </>
  );
}
