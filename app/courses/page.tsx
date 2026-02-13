"use client";
import CourseListCompact from "@/components/course-list/CourseListCompact";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import React from "react";

export default function CoursesPage() {
  return (
    <>
      <div id="wrapper">
        <Header2 />
        <CourseListCompact />
        <Footer1 />
      </div>
    </>
  );
}
