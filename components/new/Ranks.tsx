export default function Ranks() {
  const positions = [
    {
      name: 'DAG Soldier',
      badge: '🎖️',
      requirement: 'Default',
      airdrop: '20%',
      description: 'Start your journey as a DAG Soldier. No payment required - just join and contribute.',
      color: 'from-gray-400 to-gray-600'
    },
    {
      name: 'DAG Lieutenant',
      badge: '⚔️',
      requirement: '$149 spend',
      airdrop: '50%',
      description: 'Upgrade to Lieutenant by spending $149 or purchasing Validator/Storage nodes.',
      color: 'from-blue-400 to-blue-600'
    },
    {
      name: 'DAG General',
      badge: '👑',
      requirement: '50k points or $1k sales',
      airdrop: '80%',
      description: 'Reach General rank with 50,000 DAG points or $1,000 in sales. Get maximum rewards.',
      color: 'from-purple-400 to-purple-600'
    }
  ];

  const ranks = [
    { name: 'INITIATOR', sales: '$1,000', reward: '$100' },
    { name: 'VANGUARD', sales: '$2,000', reward: '$200' },
    { name: 'GUARDIAN', sales: '$5,000', reward: '$500' },
    { name: 'STRIKER', sales: '$7,500', reward: '$750' },
    { name: 'INVOKER', sales: '$10,000', reward: '$1,000' },
    { name: 'COMMANDER', sales: '$15,000', reward: '$1,500' },
    { name: 'CHAMPION', sales: '$20,000', reward: '$2,000' },
    { name: 'CONQUEROR', sales: '$30,000', reward: '$3,000' },
    { name: 'PARAGON', sales: '$40,000', reward: '$4,000' },
    { name: 'MYTHIC', sales: '$50,000', reward: '$5,000' }
  ];

  return (
    <section id="ranks" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Positions Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <span className="w-2 h-2 bg-[#3B82F6] rounded-full"></span>
            <span className="text-[#3B82F6] font-semibold uppercase tracking-wide text-sm">Positions</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2C2B28] mb-6">
            Three Positions,<br />Unlimited Potential
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose your path and earn weekly airdrops based on your position
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {positions.map((position, index) => (
            <div 
              key={index}
              className="group bg-white rounded-3xl border-2 border-gray-100 hover:border-[#3B82F6] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${position.color}`}></div>
              <div className="p-8">
                <div className="text-5xl mb-4">{position.badge}</div>
                <h3 className="text-2xl font-bold text-[#2C2B28] mb-2">{position.name}</h3>
                <div className="text-sm text-gray-500 mb-4">{position.requirement}</div>
                <div className="bg-blue-50 rounded-xl p-4 mb-4">
                  <div className="text-sm text-gray-600 mb-1">Weekly Airdrop</div>
                  <div className="text-3xl font-bold text-[#3B82F6]">{position.airdrop}</div>
                </div>
                <p className="text-gray-600 leading-relaxed">{position.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Ranks Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <span className="w-2 h-2 bg-[#3B82F6] rounded-full"></span>
            <span className="text-[#3B82F6] font-semibold uppercase tracking-wide text-sm">Achievement Ranks</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C2B28] mb-6">
            10 Ranks to Conquer
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock mystery boxes as you progress through sales milestones
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {ranks.map((rank, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-2xl border-2 border-gray-100 hover:border-[#3B82F6] transition-all duration-300 hover:shadow-lg text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6] to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg">
                {index + 1}
              </div>
              <h4 className="font-bold text-[#2C2B28] mb-2">{rank.name}</h4>
              <div className="text-sm text-gray-600 mb-2">{rank.sales} sales</div>
              <div className="text-lg font-bold text-[#3B82F6]">{rank.reward}</div>
              <div className="text-xs text-gray-500">Mystery Box</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
