export const metadata = {
  title: "Rewards - DAG Army",
  description: "Discover how DAG Army rewards contributors for their valuable contributions to the ecosystem",
};

export default function RewardsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-black/90 mb-6 tracking-tight">
              Rewards Ecosystem
            </h1>
            <p className="text-xl text-black/60 max-w-3xl mx-auto leading-relaxed">
              A comprehensive rewards system designed to recognize and incentivize meaningful contributions to the DAG Army ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-black/90 mb-4">Token Rewards</h3>
              <p className="text-black/60 leading-relaxed mb-4">
                Earn DAG tokens for completing tasks, contributing to projects, and participating in community activities.
              </p>
              <ul className="space-y-2 text-black/60">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Project contributions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Code reviews and testing</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Community engagement</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-black/90 mb-4">Achievement Badges</h3>
              <p className="text-black/60 leading-relaxed mb-4">
                Unlock exclusive badges and recognition for reaching milestones and demonstrating expertise.
              </p>
              <ul className="space-y-2 text-black/60">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Skill-based achievements</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Contribution milestones</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Leadership recognition</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-black/90 mb-4">Priority Access</h3>
              <p className="text-black/60 leading-relaxed mb-4">
                Get early access to new features, exclusive events, and premium opportunities.
              </p>
              <ul className="space-y-2 text-black/60">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Beta feature access</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Exclusive workshops</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Priority job listings</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-black/90 mb-4">Mentorship Opportunities</h3>
              <p className="text-black/60 leading-relaxed mb-4">
                Top contributors gain access to mentorship programs and can become mentors themselves.
              </p>
              <ul className="space-y-2 text-black/60">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>1-on-1 expert guidance</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Mentor certification</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Knowledge sharing rewards</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-black to-gray-800 rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Start Earning Rewards Today</h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join thousands of contributors who are building their skills and earning rewards in the DAG Army ecosystem
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-10 py-5 bg-white text-black rounded-full text-lg font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-xl">
                View Opportunities
              </button>
              <button className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-full text-lg font-semibold hover:bg-white/10 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
