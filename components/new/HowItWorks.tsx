export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Join as Soldier',
      description: 'Sign up instantly and become a DAG Soldier. No payment, no approval needed - just join and start contributing.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      number: '02',
      title: 'Climb Ranks',
      description: 'Contribute to the ecosystem and unlock Lieutenant and General ranks through merit and real value.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      number: '03',
      title: 'Earn Rewards',
      description: 'Receive weekly airdrops and mystery boxes based on your rank and contribution level to the DAG ecosystem.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      number: '04',
      title: 'Grow Together',
      description: 'Your success is merit-based. The more you contribute, the more you earn - no shortcuts, just value.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 mb-4">
            <span className="w-2 h-2 bg-[#3B82F6] rounded-full"></span>
            <span className="text-[#3B82F6] font-semibold uppercase tracking-wide text-sm">How It Works</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2C2B28] mb-6">
            Your Journey in<br />Four Simple Steps
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From joining to earning rewards, here's how DAG ARMY works for you
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative group"
            >
              <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 hover:border-[#3B82F6] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full">
                <div className="absolute -top-6 left-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#3B82F6] to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50">
                    <span className="text-white text-2xl font-bold">{step.number}</span>
                  </div>
                </div>
                <div className="mt-8">
                  <div className="text-[#3B82F6] mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-[#2C2B28] mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-gradient-to-br from-blue-50 via-white to-blue-50 p-12 md:p-16 rounded-3xl border-2 border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6] rounded-full blur-3xl opacity-10"></div>
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-[#2C2B28] mb-4">
              Rewards Scale with Participation
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              Your contribution determines your success in DAG ARMY - not hype, not luck, just real value.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {['Merit-Based', 'Transparent', 'Fair Distribution'].map((tag, index) => (
                <div key={index} className="bg-white px-6 py-3 rounded-full border-2 border-[#3B82F6] shadow-sm">
                  <span className="text-[#2C2B28] font-semibold">{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
