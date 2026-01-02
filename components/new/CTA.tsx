export default function CTA() {
  return (
    <section id="join" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl border-2 border-blue-100 p-12 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#3B82F6] rounded-full blur-3xl opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-10"></div>
          
          <div className="relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2C2B28] mb-6">
              Your Journey Starts Here
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">
              Join DAG ARMY today and become part of the force shaping the future of AI-powered decentralized infrastructure
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
              <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="text-5xl font-bold text-[#3B82F6] mb-3">Every</div>
                <div className="text-2xl font-semibold mb-2 text-[#2C2B28]">Soldier</div>
                <div className="text-gray-600">matters</div>
              </div>

              <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="text-5xl font-bold text-[#3B82F6] mb-3">Every</div>
                <div className="text-2xl font-semibold mb-2 text-[#2C2B28]">Lieutenant</div>
                <div className="text-gray-600">builds</div>
              </div>

              <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="text-5xl font-bold text-[#3B82F6] mb-3">Every</div>
                <div className="text-2xl font-semibold mb-2 text-[#2C2B28]">General</div>
                <div className="text-gray-600">leads</div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <a 
                href="https://dagchain.network" 
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#3B82F6] text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-[#2C2B28] transition-all transform hover:scale-105 shadow-2xl inline-flex items-center space-x-2"
              >
                <span>Join DAGCHAIN Now</span>
                <svg 
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a 
                href="https://daggpt.network" 
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-[#2C2B28] text-[#2C2B28] px-10 py-5 rounded-full text-xl font-bold hover:bg-[#2C2B28] hover:text-white transition-all inline-flex items-center space-x-2"
              >
                <span>Explore DAGGPT</span>
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <div className="mt-16 pt-16 border-t border-gray-200">
              <p className="text-gray-600 text-sm">Start your journey as a DAG Soldier today - no payment required</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
