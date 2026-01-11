import About from "@/components/otherPages/about/About";
import PageTitle from "@/components/common/PageTitle";

export const metadata = {
  title: "About Us - DAGARMY | Future-Ready Tech Education",
  description: "Learn about DAGARMY's mission to build a global army of future-ready tech leaders through AI, Blockchain, and Data Visualization training.",
};

export default function AboutPage() {
  return (
    <>
      <PageTitle
        title="About Us"
        subtitle="Building the Future of Tech Education"
      />
      <About />
    </>
  );
}
