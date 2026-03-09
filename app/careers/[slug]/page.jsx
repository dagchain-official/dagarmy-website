import { Suspense } from "react";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import JobDetailPage from "@/components/careers/JobDetailPage";

export async function generateMetadata({ params }) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://dagarmy.network"}/api/careers/jobs/${params.slug}`,
      { cache: "no-store" }
    );
    if (!res.ok) return { title: "Job Not Found — DAGArmy" };
    const { job } = await res.json();
    return {
      title: `${job.title} — DAGArmy Careers`,
      description: job.summary,
    };
  } catch {
    return { title: "Careers — DAGArmy" };
  }
}

export default function JobDetailRoute({ params }) {
  return (
    <div id="wrapper">
      <Header2 />
      <Suspense fallback={null}>
        <JobDetailPage slug={params.slug} />
      </Suspense>
      <Footer1 parentClass="footer has-border-top" />
    </div>
  );
}
