export default function CTA() {
  return (
    <section id="join" className="py-20 px-6 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-[#2C2B28]">
            Your Journey Starts Here
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">
            Join DAG ARMY today and become part of the force shaping the future of AI-powered decentralized infrastructure
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border-2 border-gray-200 shadow-lg">
              <div className="text-5xl font-bold text-[#3B82F6] mb-3">Every</div>
              <div className="text-2xl font-semibold mb-2 text-[#2C2B28]">Soldier</div>
              <div className="text-gray-600">matters</div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border-2 border-gray-200 shadow-lg">
              <div className="text-5xl font-bold text-[#3B82F6] mb-3">Every</div>
              <div className="text-2xl font-semibold mb-2 text-[#2C2B28]">Lieutenant</div>
              <div className="text-gray-600">builds</div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border-2 border-gray-200 shadow-lg">
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
              className="bg-[#3B82F6] text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-[#2C2B28] hover:text-white transition-all transform hover:scale-105 shadow-2xl"
            >
              Join DAGCHAIN Now
            </a>
            <a 
              href="https://daggpt.network" 
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-[#2C2B28] text-[#2C2B28] px-10 py-5 rounded-full text-xl font-bold hover:bg-[#2C2B28] hover:text-white transition-all"
            >
              Explore DAGGPT
            </a>
          </div>

          <div className="mt-16 pt-16 border-t border-gray-200">
            <p className="text-gray-600 text-sm mb-4">Start your journey as a DAG Soldier today</p>
          </div>
        </div>
      </div>
    </section>
  );
}
