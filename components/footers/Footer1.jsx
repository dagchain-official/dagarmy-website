"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";
import { menuItems, socialLinks } from "@/data/footerLinks";
export default function Footer1({ parentClass = "footer" }) {
  const formRef = useRef();
  const [success, setSuccess] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };

  const sendMail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm("service_noj8796", "template_fs3xchn", formRef.current, {
        publicKey: "iG4SCmR-YtJagQ4gV",
      })
      .then((res) => {
        if (res.status === 200) {
          setSuccess(true);
          handleShowMessage();
          formRef.current.reset();
        } else {
          setSuccess(false);
          handleShowMessage();
        }
      });
  };
  return (
    <>
      <style jsx global>{`
        #footer {
          background: #ffffff !important;
        }
        #footer .footer-body {
          background: #ffffff !important;
        }
        #footer .footer-wrap {
          background: #ffffff !important;
        }
        #footer h5 {
          color: #000000 !important;
        }
        #footer p {
          color: #4a5568 !important;
        }
        #footer a,
        #footer a:link,
        #footer a:visited {
          color: #000000 !important;
          text-decoration: none !important;
        }
        #footer a:hover,
        #footer a:active {
          color: #8b5cf6 !important;
        }
        #footer .footer-menu-list h5 {
          color: #000000 !important;
        }
        #footer .footer-menu-list ul {
          list-style: none !important;
        }
        #footer .footer-menu-list ul li {
          margin-bottom: 8px !important;
        }
        #footer .footer-menu-list ul li a,
        #footer .footer-menu-list ul li a:link,
        #footer .footer-menu-list ul li a:visited {
          color: #000000 !important;
        }
        #footer .footer-menu-list ul li a:hover {
          color: #8b5cf6 !important;
        }
        #footer .address li p {
          color: #4a5568 !important;
        }
        #footer .address li i {
          color: #8b5cf6 !important;
        }
        #footer .tf-social-icon a {
          color: #000000 !important;
          background: #f3f4f6 !important;
        }
        #footer .tf-social-icon a:hover {
          background: #8b5cf6 !important;
          color: #ffffff !important;
        }
        #footer .footer-subscribe h5 {
          color: #000000 !important;
        }
        #footer .footer-subscribe p {
          color: #4a5568 !important;
        }
        #footer .footer-subscribe > div h5,
        #footer .footer-subscribe > div p {
          color: #ffffff !important;
        }
        #footer .footer-bottom {
          background: #ffffff !important;
          border-top: 1px solid #e5e7eb !important;
        }
        #footer .footer-bottom p {
          color: #6b7280 !important;
        }
      `}</style>
      <footer id="footer" className={parentClass} style={{ background: '#ffffff' }}>
        <div className="footer-wrap" style={{ background: '#ffffff' }}>
        <div className="footer-body">
          <div className="tf-container">
            <div className="row">
              <div className="col-12">
                <div className="footer-body-wrap flex justify-between">
                  <div
                    className="footer-more-infor wow fadeInUp"
                    data-wow-delay="0s"
                  >
                    <div className="footer-logo">
                      <Link href={`/`}>
                        <Image
                          alt="DAGARMY"
                          src="/images/logo/logo.png"
                          width={62}
                          height={18}
                        />
                      </Link>
                    </div>
                    <ul className="address">
                      <li className="flex gap-10 items-center">
                        <div className="icon">
                          <i className="flaticon-call" />
                        </div>
                        <p>+44 07476 683666</p>
                      </li>
                      <li className="flex gap-10 items-center">
                        <div className="icon">
                          <i className="flaticon-call" />
                        </div>
                        <p>+1 (631) 954-5888</p>
                      </li>
                      <li className="flex gap-10 items-center">
                        <div className="icon">
                          <i className="flaticon-mail-1" />
                        </div>
                        <p>careers@dagchin.network</p>
                      </li>
                    </ul>
                    <ul className="tf-social-icon flex items-center gap-10">
                      {socialLinks.map((link, index) => (
                        <li key={index}>
                          <a href={link.href}>
                            <i className={link.icon} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {menuItems.map((menu, index) => (
                    <div
                      key={index}
                      className="footer-menu-list wow fadeInUp"
                      data-wow-delay={menu.delay}
                    >
                      <h5 className="fw-5">{menu.title}</h5>
                      <ul>
                        {menu.links.map((link, linkIndex) => (
                          <li key={linkIndex}>
                            {link.href.startsWith("/") ? (
                              <Link href={link.href}>{link.name}</Link>
                            ) : (
                              <a href={link.href}>{link.name}</a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div
                    className="footer-subscribe wow fadeInUp"
                    data-wow-delay="0.5s"
                  >
                    <h5 className="fw-5">Subscribe</h5>
                    <p>
                      Join 2,500+ learners mastering AI, Blockchain, and Data Visualisation. Subscribe for exclusive updates and course launches!
                    </p>
                    <div
                      className={`tfSubscribeMsg ${
                        showMessage ? "active" : ""
                      }`}
                    >
                      {success ? (
                        <p style={{ color: "rgb(52, 168, 83)" }}>
                          You have successfully subscribed.
                        </p>
                      ) : (
                        <p style={{ color: "red" }}>Something went wrong</p>
                      )}
                    </div>
                    <form
                      className="form-subscribe style-line-bottom"
                      onSubmit={sendMail}
                      ref={formRef}
                    >
                      <fieldset className="email">
                        <input
                          type="email"
                          placeholder="Your e-mail"
                          className="style-default"
                          name="email"
                          tabIndex={2}
                          defaultValue=""
                          aria-required="true"
                          required
                        />
                      </fieldset>
                      <div className="button-submit">
                        <button className="tf-btn-arrow" type="submit">
                          Send
                          <i className="icon-arrow-top-right" />
                        </button>
                      </div>
                    </form>
                    <div style={{ marginTop: '30px', padding: '20px', background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)', borderRadius: '12px' }}>
                      <h5 className="fw-5" style={{ color: 'white', marginBottom: '10px' }}>Ready to Start?</h5>
                      <p style={{ color: 'white', opacity: 0.9, fontSize: '14px', marginBottom: '15px' }}>Transform your career with cutting-edge tech skills</p>
                      <button 
                        onClick={() => window.location.href = '#'}
                        style={{ 
                          display: 'block',
                          background: '#ffffff', 
                          color: '#8b5cf6', 
                          padding: '14px 24px',
                          borderRadius: '8px',
                          fontWeight: '600',
                          fontSize: '15px',
                          border: 'none',
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'center',
                          fontFamily: 'inherit'
                        }}
                      >
                        <span style={{ color: '#8b5cf6', fontWeight: '600' }}>Explore Courses</span>
                        <i className="icon-arrow-top-right" style={{ marginLeft: '8px', color: '#8b5cf6' }} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom wow fadeInUp" data-wow-delay="0s">
          <div className="tf-container">
            <div className="row">
              <div className="col-12">
                <div className="footer-bottom-wrap flex justify-center items-center">
                  <p>©&nbsp;2026&nbsp;DAGARMY. All Rights Reserved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
