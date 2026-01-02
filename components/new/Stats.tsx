export default function Stats() {
  const stats = [
    { number: '10,000+', label: 'Active Contributors' },
    { number: '$2M+', label: 'Rewards Distributed' },
    { number: '150+', label: 'Countries' },
    { number: '24/7', label: 'Community Support' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[#2C2B28] to-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#3B82F6] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Growing Stronger Every Day
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join a thriving community of builders and contributors
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="text-5xl md:text-6xl font-bold text-[#3B82F6] mb-2">
                {stat.number}
              </div>
              <div className="text-lg text-gray-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
