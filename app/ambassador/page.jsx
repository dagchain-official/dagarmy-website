import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import AmbassadorPage from "@/components/ambassador/AmbassadorPage";
import { Suspense } from "react";

export const metadata = {
  title: "Ambassador Program - DAG Army",
  description: "Join the official DAG Army Ambassador Program. Represent the future of AI-native blockchain, earn rewards, and build your personal brand in the Web3 ecosystem.",
};

export default function Page() {
  return (
    <>
      <Header2 />
      <Suspense fallback={null}>
        <AmbassadorPage />
      </Suspense>
      <Footer1 />
    </>
  );
}
