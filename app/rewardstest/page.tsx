import ChipScroll from "@/components/ChipScroll";

export const metadata = {
  title: "Rewards - DAG Army",
  description: "An ecosystem designed to reward responsible contribution through measurable action",
};

export default function RewardsPage() {
  return (
    <main className="min-h-screen bg-white">
      <ChipScroll />
      
      {/* Additional content section after scroll animation */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-black/90 mb-4">Verified Actions</h3>
              <p className="text-black/60 leading-relaxed">
                Every contribution is tracked and verified through our transparent blockchain-based system
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-black/90 mb-4">Fair Distribution</h3>
              <p className="text-black/60 leading-relaxed">
                Rewards are distributed fairly based on measurable contributions and verified identity
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-black/90 mb-4">Instant Recognition</h3>
              <p className="text-black/60 leading-relaxed">
                Get rewarded immediately for your contributions without delays or intermediaries
              </p>
            </div>
          </div>

          <div className="mt-20 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-black/90 mb-6 tracking-tight">
              Ready to get rewarded?
            </h2>
            <p className="text-xl text-black/60 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of contributors who are earning rewards for their valuable contributions to the ecosystem
            </p>
            <button className="px-10 py-5 bg-black text-white rounded-full text-lg font-semibold hover:bg-black/90 transition-all hover:scale-105 shadow-xl">
              Start Contributing
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
