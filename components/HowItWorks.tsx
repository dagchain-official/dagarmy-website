export default function HowItWorks() {
  return (
    <section className="py-20 px-12 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-30 -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20 -z-10" />
      
      <div className="w-full max-w-[1600px] mx-auto">
        <div className="mb-20">
          <div className="inline-flex items-center space-x-2 mb-4">
            <svg className="w-5 h-5 text-[#3B82F6]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-[#3B82F6] font-semibold uppercase tracking-wide">How It Works</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#2C2B28] mb-6">
            Your Journey in<br />Four Simple Steps
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl">
            From joining to earning rewards, here's how DAG ARMY works for you
          </p>
        </div>

        {/* Timeline-style steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute left-0 right-0 top-32 h-1 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200" />
          
          <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="relative group">
              <div className="relative z-10 bg-white p-8 rounded-3xl border-2 border-gray-100 hover:border-[#3B82F6] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="absolute -top-6 left-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#3B82F6] to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50 transition-transform">
                    <span className="text-white text-2xl font-bold">01</span>
                  </div>
                </div>
                <div className="mt-8">
                  <div className="w-12 h-12 mb-4 text-[#3B82F6]">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#2C2B28] mb-3">Join as Soldier</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Sign up instantly and become a DAG Soldier. No payment, no approval needed - just join and start.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="relative z-10 bg-white p-8 rounded-3xl border-2 border-gray-100 hover:border-[#3B82F6] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="absolute -top-6 left-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#3B82F6] to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50 transition-transform">
                    <span className="text-white text-2xl font-bold">02</span>
                  </div>
                </div>
                <div className="mt-8">
                  <div className="w-12 h-12 mb-4 text-[#3B82F6]">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#2C2B28] mb-3">Climb Ranks</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Contribute to the ecosystem and unlock Lieutenant and General ranks through merit and value.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="relative z-10 bg-white p-8 rounded-3xl border-2 border-gray-100 hover:border-[#3B82F6] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="absolute -top-6 left-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#3B82F6] to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50 transition-transform">
                    <span className="text-white text-2xl font-bold">03</span>
                  </div>
                </div>
                <div className="mt-8">
                  <div className="w-12 h-12 mb-4 text-[#3B82F6]">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#2C2B28] mb-3">Earn Rewards</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Receive weekly airdrops based on your rank and contribution level to the DAG ecosystem.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative group">
              <div className="relative z-10 bg-white p-8 rounded-3xl border-2 border-gray-100 hover:border-[#3B82F6] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="absolute -top-6 left-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#3B82F6] to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50 transition-transform">
                    <span className="text-white text-2xl font-bold">04</span>
                  </div>
                </div>
                <div className="mt-8">
                  <div className="w-12 h-12 mb-4 text-[#3B82F6]">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#2C2B28] mb-3">Grow Together</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Your success is merit-based. The more you contribute, the more you earn - no shortcuts, just value.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 relative">
          <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 p-12 md:p-16 rounded-3xl relative overflow-hidden border-2 border-blue-100">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6] rounded-full blur-3xl opacity-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl opacity-10" />
            
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold text-[#2C2B28] mb-4">
                Rewards Scale with Participation
              </h3>
              <p className="text-xl text-gray-600 whitespace-nowrap mb-8">
                Your contribution determines your success in DAG ARMY - not hype, not luck, just real value.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="bg-white px-6 py-3 rounded-full border-2 border-[#3B82F6] shadow-sm">
                  <span className="text-[#2C2B28] font-semibold">Merit-Based</span>
                </div>
                <div className="bg-white px-6 py-3 rounded-full border-2 border-[#3B82F6] shadow-sm">
                  <span className="text-[#2C2B28] font-semibold">Transparent</span>
                </div>
                <div className="bg-white px-6 py-3 rounded-full border-2 border-[#3B82F6] shadow-sm">
                  <span className="text-[#2C2B28] font-semibold">Fair Distribution</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
