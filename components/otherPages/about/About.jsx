import React from "react";
import Image from "next/image";
export default function About() {
  return (
    <section className="flat-about">
      <div className="tf-container">
        <div className="row">
          <div className="col-lg-7">
            <div className="heading-content">
              <div className="widget box-sub-tag wow fadeInUp">
                <div className="sub-tag-icon">
                  <i className="icon-flash" />
                </div>
                <div className="sub-tag-title">
                  <p>Future-Ready Tech Education</p>
                </div>
              </div>
              <h2 className="font-cardo wow fadeInUp">
                Building a Global Army of Future-Ready Tech Leaders Through AI, Blockchain, and Data Visualization
              </h2>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="content-right wow fadeInUp" data-wow-delay="0.1s">
              <p>
                DAGARMY is dedicated to empowering learners worldwide with cutting-edge technology skills. 
                We provide industry-focused training programs that prepare you for the future of work.
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="inner">
              <div className="about-item item-1 wow fadeInUp">
                <Image
                  className="lazyload"
                  data-src="/images/section/about-9.jpg"
                  alt="DAGARMY Education"
                  width={895}
                  height={520}
                  src="/images/section/about-9.jpg"
                />
              </div>
              <div className="about-item item-2 wow fadeInUp">
                <Image
                  className="lazyload"
                  data-src="/images/section/about-10.jpg"
                  alt="Tech Training"
                  width={893}
                  height={1100}
                  src="/images/section/about-10.jpg"
                />
              </div>
              <div className="about-item item-3 wow fadeInUp">
                <Image
                  className="lazyload"
                  alt="Learning Environment"
                  src="/images/page-title/page-title-home2-1.jpg"
                  width="591"
                  height="680"
                />
              </div>
              <div className="about-item item-4 wow fadeInUp">
                <Image
                  className="lazyload"
                  data-src="/images/courses/courses-04.jpg"
                  alt="Course Preview"
                  width={520}
                  height={380}
                  src="/images/courses/courses-04.jpg"
                />
              </div>
              <div className="about-item item-5 wow fadeInUp">
                <Image
                  className="lazyload"
                  data-src="/images/section/about-1.jpg"
                  alt="DAGARMY Community"
                  width={681}
                  height={681}
                  src="/images/section/about-1.jpg"
                />
              </div>
              <div className="about-item item-6 wow fadeInUp">
                <Image
                  className="lazyload"
                  data-src="/images/courses/courses-01.jpg"
                  alt="Training Programs"
                  width={520}
                  height={380}
                  src="/images/courses/courses-01.jpg"
                />
              </div>
              <div className="about-item item-7 wow fadeInUp">
                <p>
                  "Empowering the next generation of tech leaders with future-ready skills in AI, Blockchain, and Data Visualization"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
