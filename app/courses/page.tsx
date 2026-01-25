import CourseListDatabase from "@/components/course-list/CourseListDatabase";
import PageTitle from "@/components/course-list/PageTitle";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import React from "react";

export const metadata = {
  title: "Course - DAGARMY | AI, Blockchain & Cyber Security Training",
  description: "Explore DAGARMY's comprehensive course in AI, Blockchain, Data Visualization, and Cyber Security. Join the global army of Vibe Coders.",
};

export default function CoursesPage() {
  return (
    <>
      <div id="wrapper">
        <Header2 />
        <PageTitle parentClass="page-title style-2 has-tags-bg-white" />
        <CourseListDatabase />
        <Footer1 />
      </div>
    </>
  );
}
