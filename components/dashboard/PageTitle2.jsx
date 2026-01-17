import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function PageTitle2() {
  return (
    <div className="page-title style-9 bg-5">
      <div className="tf-container">
        <div className="row items-center">
          <div className="col-lg-8">
            <div className="content">
              <div className="author-item">
                <div className="author-item-img">
                  <Image
                    alt="Student Avatar"
                    src="/images/avatar/review-1.png"
                    width={101}
                    height={100}
                  />
                </div>
              </div>
              <div className="title">
                <h2 className="font-cardo fw-7 mb-20">Welcome, Vibe Coder!</h2>
                <ul className="entry-meta mt-4 mb-4">
                  <li>
                    <i className="flaticon-book" />12 Courses Enrolled
                  </li>
                  <li>
                    <i className="flaticon-medal" />5 Certificates Earned
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="right-content">
              <Link className="tf-btn" href={`/courses`}>
                Explore More Courses
                <i className="icon-arrow-top-right" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
