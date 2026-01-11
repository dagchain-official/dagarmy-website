import React from "react";
import Image from "next/image";
export default function OurVisions() {
  return (
    <section className="section-vison tf-spacing-8 pt-0 page-about ">
      <div className="tf-container">
        <div className="row  ">
          <div className="col-lg-7">
            <div className="images wow fadeInLeft">
              <Image
                className="lazyload"
                data-src="/images/section/video-placeholder.jpg"
                alt=""
                src="/images/section/video-placeholder.jpg"
                width={1372}
                height={1101}
              />
            </div>
          </div>
          <div className="col-lg-5">
            <div className="content">
              <div className="box-sub-tag wow fadeInUp">
                <div className="sub-tag-icon">
                  <i className="icon-flash" />
                </div>
                <div className="sub-tag-title">
                  <p>How We Operate</p>
                </div>
              </div>
              <h2 className="fw-7 font-cardo wow fadeInUp">
                The Training Ground for Future Tech Leaders
              </h2>
              <p className="text-content wow fadeInUp">
                DAGARMY is a community-driven ecosystem where rank is earned through skill. We are the direct link between hidden talent in small towns and global tech giants.
              </p>
              <ul className="list">
                <li className="item wow fadeInUp">
                  <strong>A Training Camp:</strong> We teach practical, "battle-ready" skills for the 2026 economy—from AI to Blockchain security.
                </li>
                <li className="item wow fadeInUp">
                  <strong>A Launchpad:</strong> We provide mentorship and strategic guidance to turn prototypes into products and ideas into startups.
                </li>
                <li className="item wow fadeInUp">
                  <strong>A Bridge:</strong> We vet our "Soldiers" through real-world challenges so companies hire proven excellence.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
