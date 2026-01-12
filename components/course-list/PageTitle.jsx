import React from "react";
import Link from "next/link";

export default function PageTitle({
  parentClass = "page-title style-2 no-border has-bg4 py-60",
}) {
  return (
    <div className={parentClass}>
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <div className="content">
              <ul className="breadcrumbs flex items-center justify-start gap-10 mb-60">
                <li>
                  <Link href={`/`} className="flex">
                    <i className="icon-home" />
                  </Link>
                </li>
                <li>
                  <i className="icon-arrow-right" />
                </li>
                <li>All Courses</li>
              </ul>
              <h2 className="font-cardo fw-7">Master Future-Ready Tech Skills</h2>
              <p>
                Join the global army of Vibe Coders. Master AI, Blockchain, and Data Visualization with battle-tested courses designed for the 2026 economy.
              </p>
              <div className="widget tags-list style3">
                <h6>Explore Our Training Streams</h6>
                <ul className="tag-list">
                  <li className="tag-list-item">
                    <a href="#">Artificial Intelligence</a>
                  </li>
                  <li className="tag-list-item">
                    <a href="#">Blockchain</a>
                  </li>
                  <li className="tag-list-item">
                    <a href="#">Data Visualization</a>
                  </li>
                  <li className="tag-list-item">
                    <a href="#">Cyber Security</a>
                  </li>
                  <li className="tag-list-item">
                    <a href="#">Web3 Development</a>
                  </li>
                  <li className="tag-list-item">
                    <a href="#">Machine Learning</a>
                  </li>
                  <li className="tag-list-item">
                    <a href="#">Smart Contracts</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
