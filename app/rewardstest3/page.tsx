"use client";
import React from "react";
import { motion } from "framer-motion";
import { Download, Shield, Target, Award, TrendingUp, DollarSign, Car, Plane } from "lucide-react";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
};

export default function RewardsTest3() {
  return (
    <>
      <Header2 />
      
      {/* 1. HERO SECTION - White Background */}
      <section className="bg-white pt-40 pb-20 lg:pt-48 lg:pb-28 min-h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text Left */}
            <motion.div {...fadeInUp} className="max-w-xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1f2937] leading-[1.1] mb-6 tracking-tight">
                AI That Works With You. A System That Rewards You.
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-[#6b7280] mb-8 leading-relaxed font-normal">
                We don't reward speculation. We reward consistency, contribution, and execution.
              </p>
              <button className="inline-flex items-center gap-3 bg-[#1f2937] text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-black hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl">
                <Download className="w-5 h-5" strokeWidth={2} />
                Download Full Reward Guide PDF
              </button>
            </motion.div>
            
            {/* Image Right */}
            <motion.div 
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative lg:ml-8"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-2 border-gray-200 flex items-center justify-center overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-sm">
                    <Award className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
                  </div>
                  <p className="text-gray-400 text-sm font-medium">PLACEHOLDER: Hero Image - Team/Dashboard</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. THE PHILOSOPHY - Light Gray Background */}
      <section className="bg-[#f9fafb] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div {...fadeInUp} className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1f2937] mb-4 tracking-tight">
              Why The Reward System Exists
            </h2>
            <p className="text-lg text-[#6b7280] max-w-2xl mx-auto">Built on principles of fairness, transparency, and measurable value</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: Shield,
                title: "Verified Intelligence",
                description: "We reward the 'Verified Intelligence' you bring, not hype."
              },
              {
                icon: Target,
                title: "Contribution Over Noise",
                description: "Measurable outcomes for regular producers."
              },
              {
                icon: Award,
                title: "Fair Play",
                description: "One individual, one account. Non-transferable points."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                {...fadeInUp}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 lg:p-10 border border-[#e5e7eb] shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-gray-300 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-[#f9fafb] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#1f2937] transition-colors duration-300">
                  <item.icon className="w-7 h-7 text-[#1f2937] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-[#1f2937] mb-3">{item.title}</h3>
                <p className="text-[#6b7280] leading-relaxed text-[15px]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CHOOSE YOUR ROLE - White Background */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <motion.div {...fadeInUp} className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1f2937] mb-4 tracking-tight">
              Choose Your Role
            </h2>
            <p className="text-lg text-[#6b7280] max-w-2xl mx-auto">Select the tier that aligns with your commitment level</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* DAG Soldier - Standard */}
            <motion.div
              {...fadeInUp}
              className="bg-white rounded-3xl p-8 lg:p-10 border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[#1f2937] mb-2">DAG Soldier</h3>
                <p className="text-sm text-[#9ca3af] font-medium uppercase tracking-wide">Standard</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-bold text-[#1f2937]">Free</span>
              </div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-[#1f2937]"></div>
                  </div>
                  <span className="text-[#4b5563] text-[15px] leading-relaxed">Receive <strong className="text-[#1f2937] font-semibold">500 DAG Points</strong> instantly</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-[#1f2937]"></div>
                  </div>
                  <span className="text-[#4b5563] text-[15px] leading-relaxed">Access to ecosystem tasks</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-[#1f2937]"></div>
                  </div>
                  <span className="text-[#4b5563] text-[15px] leading-relaxed">Referral rewards</span>
                </li>
              </ul>
              <button className="w-full py-4 px-6 border-2 border-[#1f2937] text-[#1f2937] rounded-xl font-semibold hover:bg-[#1f2937] hover:text-white transition-all duration-300">
                Start as Soldier
              </button>
            </motion.div>

            {/* DAG Lieutenant - Premium */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-[#1f2937] rounded-3xl p-8 lg:p-10 relative overflow-hidden shadow-2xl border-2 border-[#1f2937]"
            >
              <div className="absolute top-6 right-6">
                <span className="bg-white text-[#1f2937] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                  Recommended
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">DAG Lieutenant</h3>
                <p className="text-sm text-gray-400 font-medium uppercase tracking-wide">Premium/Pro</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-bold text-white">$149</span>
                <span className="text-gray-400 ml-2 text-lg">USD</span>
              </div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <span className="text-gray-200 text-[15px] leading-relaxed">Unlock <strong className="text-white font-semibold">3000 DAG Points</strong> potential</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <span className="text-gray-200 text-[15px] leading-relaxed"><strong className="text-white font-semibold">20% Bonus</strong> on all earning activities</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <span className="text-gray-200 text-[15px] leading-relaxed"><strong className="text-white font-semibold">Unlock Direct Sales</strong> (7-20% Commission)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <span className="text-gray-200 text-[15px] leading-relaxed">Priority support & exclusive perks</span>
                </li>
              </ul>
              <button className="w-full py-4 px-6 bg-white text-[#1f2937] rounded-xl font-semibold hover:bg-gray-100 hover:scale-[1.02] transition-all duration-300 shadow-lg">
                Upgrade to Lieutenant
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. HOW TO EARN - Light Gray Background */}
      <section className="bg-[#f9fafb] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div {...fadeInUp} className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1f2937] mb-4 tracking-tight">
              How to Earn Points
            </h2>
            <p className="text-lg text-[#6b7280] max-w-2xl mx-auto">Multiple pathways to grow your rewards and unlock opportunities</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                step: "01",
                title: "Ecosystem Tasks",
                description: "Engagement & Content creation. Participate in community activities and contribute valuable content."
              },
              {
                step: "02",
                title: "Responsible Referrals",
                description: "500-600 points per verified signup. Bring quality members who actively participate."
              },
              {
                step: "03",
                title: "Direct Sales",
                description: "(Lieutenant Only) Earn 7-20% commission on successful conversions and upgrades."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                {...fadeInUp}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 lg:p-10 border border-[#e5e7eb] shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 h-full">
                  <div className="text-7xl font-bold text-gray-50 mb-6 leading-none">{item.step}</div>
                  <h3 className="text-2xl font-bold text-[#1f2937] mb-4">{item.title}</h3>
                  <p className="text-[#6b7280] leading-relaxed text-[15px]">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. THE RANK LADDER - White Background */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <motion.div {...fadeInUp} className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1f2937] mb-4 tracking-tight">
              The Rank Ladder: "Burn to Rise"
            </h2>
            <p className="text-lg text-[#6b7280] max-w-2xl mx-auto leading-relaxed">
              Rank is unlocked by <strong className="text-[#1f2937] font-semibold">Burning</strong> points (Sacrifice). Invest in your growth to unlock higher commissions.
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#1f2937] hidden md:block"></div>
            
            <div className="space-y-5">
              {[
                { rank: "Initiator", burn: "700", commission: "7%" },
                { rank: "Vanguard", burn: "1,500", commission: "10%" },
                { rank: "Sentinel", burn: "3,000", commission: "12%" },
                { rank: "Commander", burn: "7,000", commission: "15%" },
                { rank: "Mythic", burn: "50,000", commission: "20%" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  {...fadeInUp}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="relative pl-0 md:pl-20"
                >
                  {/* Dot */}
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#1f2937] rounded-full border-4 border-white shadow-sm hidden md:block"></div>
                  
                  <div className="bg-white rounded-2xl p-6 lg:p-8 border-2 border-gray-200 hover:border-[#1f2937] hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="text-xl lg:text-2xl font-bold text-[#1f2937] mb-2">{item.rank}</h3>
                        <p className="text-[#6b7280] text-[15px]">Burn <strong className="text-[#1f2937] font-semibold">{item.burn}</strong> points</p>
                      </div>
                      <div className="text-left md:text-right">
                        <div className="inline-block bg-[#1f2937] text-white px-5 py-2.5 rounded-xl font-bold text-sm">
                          {item.commission} Commission
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINANCIAL INCENTIVES - Black Background */}
      <section className="bg-[#1f2937] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div {...fadeInUp} className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Financial Incentives
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Multiple revenue streams designed to reward your dedication and performance.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: DollarSign,
                title: "Direct Sales",
                value: "7% - 20%",
                description: "Commission on every successful conversion"
              },
              {
                icon: TrendingUp,
                title: "Monthly Pool",
                value: "3% Revenue",
                description: "Top performers share monthly revenue pool"
              },
              {
                icon: Car,
                title: "Lifestyle Bonus",
                value: "Vehicle & Travel",
                description: "Support for leaders who drive results"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                {...fadeInUp}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 lg:p-10 border border-white/10 hover:bg-white/[0.15] hover:border-white/20 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors duration-300">
                  <item.icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-4">{item.value}</div>
                <p className="text-gray-300 leading-relaxed text-[15px]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FOOTER CTA - White Background */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1f2937] mb-6 tracking-tight">
              Ready to Master the System?
            </h2>
            <p className="text-lg text-[#6b7280] mb-10 max-w-2xl mx-auto leading-relaxed">
              Download the complete official reward documentation and start your journey today.
            </p>
            <a 
              href="/finaldagarmy.pdf" 
              target="_blank"
              className="inline-flex items-center gap-3 bg-white text-[#1f2937] border-2 border-[#1f2937] px-8 py-4 rounded-xl font-semibold text-base hover:bg-[#1f2937] hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg"
            >
              <Download className="w-5 h-5" strokeWidth={2} />
              View & Download Official Reward PDF
            </a>
          </motion.div>
        </div>
      </section>

      <Footer1 />
    </>
  );
}
