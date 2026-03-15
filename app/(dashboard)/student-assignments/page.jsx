"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentAssignmentsPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/student-my-courses'); }, [router]);
  return null;
}




