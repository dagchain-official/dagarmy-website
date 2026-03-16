"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    const target = ref ? `/?ref=${ref}&signin=1` : `/?signin=1`;
    router.replace(target);
  }, []);

  return null;
}
