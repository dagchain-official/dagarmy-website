import React from "react";

export default function Banner() {
  return (
    <section className="section-start-banner tf-spacing-1 pt-0 ">
      <div className="tf-container">
        <div className="row">
          <div className="col-lg-12">
            <div className="main-section">
              <div className="heading-section style-white mb-0">
                <h2 className="font-cardo wow fadeInUp">
                  Join the Army. <br /> Claim Your Future.
                </h2>
                <p className="sub wow fadeInUp">
                  Our vision is a future where "DAGARMY Certified" is the ultimate signal of technical mastery. We are building an army of 1,000,000+ pre-vetted professionals and launching 100+ soldier-led startups every year.
                </p>
              </div>
              <a
                href="/"
                className="tf-btn style-secondary wow fadeInUp"
                data-wow-delay="0.1s"
              >
                Explore Courses <i className="icon-arrow-top-right" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
