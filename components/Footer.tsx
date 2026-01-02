export default function Footer() {
  return (
    <footer className="bg-white py-20">
      {/* Main Footer Content - Full Width */}
      <div className="px-12 mb-12">
        <div className="grid md:grid-cols-4 gap-12 max-w-7xl mx-auto">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-full flex items-center justify-center"
                style={{
                  boxShadow: '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,1), inset 2px 2px 4px rgba(255,255,255,0.3)'
                }}
              >
                <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L2 7l8 5 8-5-8-5zM2 17l8 5 8-5M2 12l8 5 8-5"/>
                </svg>
              </div>
              <span className="text-4xl font-bold text-[#2C2B28]">DAG ARMY</span>
            </div>
            <p className="text-gray-700 mb-4 text-base leading-relaxed max-w-2xl">
              The official community growth and contribution program of DAGCHAIN and DAGGPT.
            </p>
            <p className="text-sm text-gray-600">
              Building the future of AI-powered decentralized infrastructure.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-[#2C2B28]">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-600 hover:text-[#3B82F6] transition-colors text-sm">About</a></li>
              <li><a href="#ranks" className="text-gray-600 hover:text-[#3B82F6] transition-colors text-sm">Ranks</a></li>
              <li><a href="#airdrops" className="text-gray-600 hover:text-[#3B82F6] transition-colors text-sm">Airdrops</a></li>
              <li><a href="#join" className="text-gray-600 hover:text-[#3B82F6] transition-colors text-sm">Join Now</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-[#2C2B28]">Ecosystem</h3>
            <ul className="space-y-2">
              <li><a href="https://dagchain.network" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#3B82F6] transition-colors text-sm">DAGCHAIN</a></li>
              <li><a href="https://daggpt.network" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#3B82F6] transition-colors text-sm">DAGGPT</a></li>
            </ul>
            <p className="text-gray-600 text-xs mt-6">
              © {new Date().getFullYear()} DAG ARMY. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
