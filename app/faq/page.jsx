import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import FAQPage from "@/components/faq/FAQPage";

export const metadata = {
  title: "FAQ — DAGARMY",
  description: "Frequently asked questions about DAGARMY — courses, careers, ambassador program, Udaan initiative, rewards, and more.",
};

export default function FAQRoute() {
  return (
    <div id="wrapper">
      <Header2 />
      <FAQPage />
      <Footer1 parentClass="footer has-border-top" />
    </div>
  );
}
