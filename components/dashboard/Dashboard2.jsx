"use client";
import React from "react";
import Pagination from "../common/Pagination";
import Image from "next/image";
import { dagarmyCourses } from "@/data/dagarmy-courses";

export default function Dashboard2() {
  const enrolledCourses = dagarmyCourses.slice(0, 4);
  const totalEnrolled = 12;
  const completedCourses = 5;
  const inProgressCourses = 7;

  return (
    <div className="col-xl-9 col-lg-12">
      <div className="section-dashboard-right">
        <div className="section-icons">
          <div className="row">
            <div className="icons-items">
              <div className="icons-box style-4 wow fadeInUp">
                <div className="icons">
                  <i className="flaticon-play-2" />
                </div>
                <div className="content">
                  <h6>Enrolled Courses</h6>
                  <span className="num-count fs-26 fw-5">{totalEnrolled}</span>
                </div>
              </div>
              <div
                className="icons-box style-4 wow fadeInUp"
                data-wow-delay="0.1s"
              >
                <div className="icons">
                  <i className="flaticon-alarm" />
                </div>
                <div className="content">
                  <h6>Completed</h6>
                  <span className="num-count fs-26 fw-5">{completedCourses}</span>
                </div>
              </div>
              <div
                className="icons-box style-4 wow fadeInUp"
                data-wow-delay="0.2s"
              >
                <div className="icons">
                  <i className="flaticon-video" />
                </div>
                <div className="content">
                  <h6>In Progress</h6>
                  <span className="num-count fs-26 fw-5">{inProgressCourses}</span>
                </div>
              </div>
            </div>
            <div className="icons-items">
              <div className="icons-box style-4 wow fadeInUp">
                <div className="icons">
                  <i className="flaticon-user" />
                </div>
                <div className="content">
                  <h6>Total Hours</h6>
                  <span className="num-count fs-26 fw-5">156</span>
                </div>
              </div>
              <div
                className="icons-box style-4 wow fadeInUp"
                data-wow-delay="0.1s"
              >
                <div className="icons">
                  <i className="flaticon-user-2" />
                </div>
                <div className="content">
                  <h6>Certificates</h6>
                  <span className="num-count fs-26 fw-5">{completedCourses}</span>
                </div>
              </div>
              <div
                className="icons-box style-4 wow fadeInUp"
                data-wow-delay="0.2s"
              >
                <div className="icons">
                  <i className="flaticon-graduation" />
                </div>
                <div className="content">
                  <h6>Achievements</h6>
                  <span className="num-count fs-26 fw-5">8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* section-learn */}
        <div className="section-learn">
          <div className="heading-section flex justify-between items-center">
            <h6 className="fw-5 fs-22 wow fadeInUp">My Enrolled Courses</h6>
            <a
              href="/courses"
              className="tf-btn-arrow wow fadeInUp"
              data-wow-delay="0.1s"
            >
              View All <i className="icon-arrow-top-right" />
            </a>
          </div>
          <div className="wg-box">
            <div className="table-selling-course wow fadeInUp">
              <div className="head">
                <div className="item">
                  <div className="fs-15 fw-5">Course Name</div>
                </div>
                <div className="item">
                  <div className="fs-15 fw-5">Progress</div>
                </div>
                <div className="item">
                  <div className="fs-15 fw-5">Status</div>
                </div>
                <div className="item">
                  <div className="fs-15 fw-5">Action</div>
                </div>
              </div>
              <ul>
                {enrolledCourses.map((course, index) => (
                  <li key={course.id}>
                    <div className="selling-course-item item my-20 ptable-20 border-bottom">
                      <div className="image">
                        <Image
                          className="lazyload"
                          src={course.imgSrc}
                          alt={course.title}
                          width={520}
                          height={380}
                        />
                      </div>
                      <div className="title">
                        <a className="fs-15 fw-5" href={`/course-single-v1/${course.id}`}>
                          {course.title}
                        </a>
                      </div>
                      <div>
                        <p className="fs-15 fw-5">{index === 0 ? '100%' : index === 1 ? '75%' : index === 2 ? '45%' : '20%'}</p>
                      </div>
                      <div>
                        <span className={`badge ${index === 0 ? 'bg-success' : 'bg-warning'}`}>
                          {index === 0 ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                      <div>
                        <div className="selling-course-btn btn-style-2">
                          <a href={`/course-single-v1/${course.id}`} className="btn-edit btn">
                            <i className="flaticon-play-2" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <ul className="wg-pagination justify-center pt-0">
            <Pagination />
          </ul>
        </div>
      </div>
      {/* section-learn */}
    </div>
  );
}
