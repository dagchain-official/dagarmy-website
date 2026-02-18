"use client";
import { useState, useEffect } from "react";
import PledgeModal from "@/components/udaan/PledgeModal";

export default function UdaanClient() {
  const [pledgeOpen, setPledgeOpen] = useState(false);

  useEffect(() => {
    const handler = () => setPledgeOpen(true);
    window.addEventListener("dagarmy:open-pledge", handler);
    return () => window.removeEventListener("dagarmy:open-pledge", handler);
  }, []);

  return <PledgeModal isOpen={pledgeOpen} onClose={() => setPledgeOpen(false)} />;
}
