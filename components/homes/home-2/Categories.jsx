import React from "react";
import Link from "next/link";
import Image from "next/image";

const dagarmyCategories = [
  // AI Track subcategories
  {
    src: "/images/item/ai.png",
    width: 40,
    height: 40,
    title: "AI & No-Code Development",
  },
  {
    src: "/images/item/creative.png",
    width: 40,
    height: 40,
    title: "AI Creative Tools",
  },
  {
    src: "/images/item/automation.png",
    width: 40,
    height: 40,
    title: "AI Automation & Agents",
  },
  // Blockchain Track subcategories
  {
    src: "/images/item/blockchain.png",
    width: 40,
    height: 40,
    title: "Blockchain Fundamentals",
  },
  {
    src: "/images/item/crypto.png",
    width: 40,
    height: 40,
    title: "DeFi & Crypto Trading",
  },
  {
    src: "/images/item/nft.png",
    width: 40,
    height: 40,
    title: "NFTs & Web3 Marketing",
  },
  // Data Visualisation Track subcategories
  {
    src: "/images/item/excel.png",
    width: 40,
    height: 40,
    title: "Excel & Data Analysis",
  },
  {
    src: "/images/item/powerbi.png",
    width: 40,
    height: 40,
    title: "Power BI & Tableau",
  },
  {
    src: "/images/item/dashboard.png",
    width: 40,
    height: 40,
    title: "Dashboard Design",
  },
];

export default function Categories() {
  return (
    <section className="section-categories tf-spacing-1 pt-0">
      <div className="tf-container">
        <div className="row">
          <div className="heading-section">
            <h2 className="letter-spacing-1 wow fadeInUp" data-wow-delay="0s">
              Top Categories
            </h2>
            <div className="flex items-center justify-between flex-wrap gap-10">
              <div className="sub fs-15 wow fadeInUp" data-wow-delay="0.2s">
                Choose your path to becoming a future-ready tech leader
              </div>
              <Link
                href={`/categories`}
                className="tf-btn-arrow wow fadeInUp"
                data-wow-delay="0.3s"
              >
                Show More Categories
                <i className="icon-arrow-top-right" />
              </Link>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="wrap-icon-box">
              {dagarmyCategories.slice(0, 3).map((elm, i) => (
                <div
                  key={i}
                  className="icons-box style-2 wow fadeInUp"
                  data-wow-delay="0.1s"
                >
                  <div className="content">
                    <h5>
                      <Link className="fw-5" href={`/categories`}>
                        {elm.title}
                      </Link>
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="wrap-icon-box">
              {dagarmyCategories.slice(3, 6).map((elm, i) => (
                <div
                  key={i}
                  className="icons-box style-2 wow fadeInUp"
                  data-wow-delay="0.1s"
                >
                  <div className="content">
                    <h5>
                      <Link className="fw-5" href={`/categories`}>
                        {elm.title}
                      </Link>
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="wrap-icon-box">
              {dagarmyCategories.slice(6, 9).map((elm, i) => (
                <div
                  key={i}
                  className="icons-box style-2 wow fadeInUp"
                  data-wow-delay="0.1s"
                >
                  <div className="content">
                    <h5>
                      <Link className="fw-5" href={`/categories`}>
                        {elm.title}
                      </Link>
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
