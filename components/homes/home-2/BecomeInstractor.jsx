import React from "react";
import Image from "next/image";

export default function BecomeInstractor() {
  return (
    <section className="section-become-instructor tf-spacing-4 pb-0">
      <div className="tf-container">
        <div className="row justify-center">
          <div className="col-md-5">
            <div className="image-left">
              <Image
                className="lazyload"
                data-src="/images/section/become-instructor-2.png"
                alt=""
                src="/images/section/become-instructor-2.png"
                width={841}
                height={1003}
              />
            </div>
          </div>
          <div className="col-md-5">
            <div className="content-right">
              <div className="content-user wow fadeInUp" data-wow-delay="0s">
                <div className="box-agent style2">
                  <ul className="agent-img-list">
                    <li className="agent-img-item">
                      <Image
                        className="ls-is-cached lazyloaded"
                        data-src="/images/avatar/user-1.png"
                        alt=""
                        src="/images/avatar/user-1.png"
                        width={84}
                        height={84}
                      />
                    </li>
                    <li className="agent-img-item">
                      <Image
                        className="ls-is-cached lazyloaded"
                        data-src="/images/avatar/user-2.png"
                        alt=""
                        src="/images/avatar/user-2.png"
                        width={84}
                        height={84}
                      />
                    </li>
                    <li className="agent-img-item">
                      <Image
                        className="ls-is-cached lazyloaded"
                        data-src="/images/avatar/user-3.png"
                        alt=""
                        src="/images/avatar/user-3.png"
                        width={84}
                        height={84}
                      />
                    </li>
                    <li className="agent-img-item">
                      <p>1M+</p>
                    </li>
                  </ul>
                </div>
              </div>
              <h2
                className="fw-7 letter-spacing-1 wow fadeInUp"
                data-wow-delay="0.1s"
              >
                Become A Trainer
              </h2>
              <p className="fz-15 wow fadeInUp" data-wow-delay="0.2s">
                Share your expertise in AI, Blockchain, or Data Visualisation with thousands of eager learners worldwide. Join DAGARMY's elite community of industry professionals and thought leaders who are shaping the future of tech education.
              </p>
              <div className="wow fadeInUp" data-wow-delay="0.25s" style={{ marginTop: '20px', marginBottom: '20px' }}>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#8b5cf6', marginRight: '10px', fontSize: '20px' }}>✓</span>
                    <span>Create and monetize your courses on cutting-edge technologies</span>
                  </li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#8b5cf6', marginRight: '10px', fontSize: '20px' }}>✓</span>
                    <span>Access our professional course creation tools and support</span>
                  </li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#8b5cf6', marginRight: '10px', fontSize: '20px' }}>✓</span>
                    <span>Build your personal brand as an industry expert</span>
                  </li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#8b5cf6', marginRight: '10px', fontSize: '20px' }}>✓</span>
                    <span>Earn competitive revenue share from your content</span>
                  </li>
                </ul>
              </div>
              <a href="#" className="tf-btn wow fadeInUp" data-wow-delay="0.3s">
                Start Teaching Today
                <i className="icon-arrow-top-right" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
