"use client";
import "./courses.css";
import CourseListNeo from "@/components/course-list/CourseListNeo";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import React from "react";

export default function CoursesPage() {
  return (
    <>
      <div id="wrapper">
        <Header2 />
        <CourseListNeo />
        <Footer1 />
      </div>
    </>
  );
}
