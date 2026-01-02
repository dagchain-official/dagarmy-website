export default function Brands() {
  const partners = [
    'DAGCHAIN',
    'DAGGPT',
    'Constellation Network',
    'Metagraph',
    'Lattice',
    'Hypergraph'
  ];

  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <p className="text-gray-600 font-medium">Powered by the DAG Ecosystem</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {partners.map((partner, index) => (
            <div 
              key={index}
              className="text-xl md:text-2xl font-bold text-gray-400 hover:text-[#3B82F6] transition-colors cursor-default"
            >
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
