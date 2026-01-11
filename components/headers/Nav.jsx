"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Nav() {
  const pathname = usePathname();
  
  return (
    <>
      <li className="has-children">
        <Link href="/">Home</Link>
      </li>
      <li className="has-children">
        <a href="#">Courses</a>
      </li>
      <li className="has-children">
        <a href="#">Pages</a>
      </li>
      <li className="has-children">
        <a href="#">Blog</a>
      </li>
      <li>
        <Link href="/contact">Contact</Link>
      </li>
    </>
  );
}
