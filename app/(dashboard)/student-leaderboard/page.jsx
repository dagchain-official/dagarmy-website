"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardNav2 from "@/components/dashboard/DashboardNav2";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import { 
  Trophy, Award, Crown, Zap, Star, Medal, 
  ArrowUp, ArrowDown, Minus, Rocket, 
  Flame, Target, ShieldCheck, Cpu
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function StudentLeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState('all-time');

  const leaderboardData = [
    { rank: 1, name: "Alex Chen", avatar: "AC", points: 15420, courses: 12, badges: 28, trend: "up", change: 2, level: 45, xp: 95 },
    { rank: 2, name: "Sarah Johnson", avatar: "SJ", points: 14890, courses: 11, badges: 25, trend: "up", change: 1, level: 42, xp: 88 },
    { rank: 3, name: "Michael Brown", avatar: "MB", points: 13750, courses: 10, badges: 22, trend: "down", change: -1, level: 38, xp: 75 },
    { rank: 4, name: "Emma Wilson", avatar: "EW", points: 12980, courses: 9, badges: 20, trend: "same", change: 0, level: 35, xp: 60 },
    { rank: 5, name: "David Lee", avatar: "DL", points: 12340, courses: 10, badges: 19, trend: "up", change: 3, level: 33, xp: 55 },
    { rank: 6, name: "Vinod Kumar", avatar: "VK", points: 11850, courses: 8, badges: 18, trend: "same", change: 0, isCurrentUser: true, level: 31, xp: 45 },
    { rank: 7, name: "Lisa Anderson", avatar: "LA", points: 11200, courses: 8, badges: 16, trend: "down", change: -2, level: 30, xp: 40 },
    { rank: 8, name: "James Taylor", avatar: "JT", points: 10890, courses: 7, badges: 15, trend: "up", change: 1, level: 28, xp: 35 },
    { rank: 9, name: "Maria Garcia", avatar: "MG", points: 10450, courses: 7, badges: 14, trend: "same", change: 0, level: 27, xp: 30 },
    { rank: 10, name: "Robert Martinez", avatar: "RM", points: 9980, courses: 6, badges: 13, trend: "up", change: 2, level: 25, xp: 25 },
  ];

  const topThree = [leaderboardData[1], leaderboardData[0], leaderboardData[2]]; // Order for podium: 2, 1, 3

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500/30">
      <Header2 />
      <div className="flex w-full">
        {/* Sidebar - Integrated with the new dark aesthetic */}
        <aside className="hidden lg:block w-64 border-r border-slate-800/50 bg-[#020617]/50 backdrop-blur-xl sticky top-0 h-screen overflow-y-auto">
          <div className="p-6">
            <DashboardNav2 />
          </div>
        </aside>

        <main className="flex-1 px-4 py-8 lg:px-12 lg:py-12 max-w-7xl mx-auto overflow-x-hidden">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
                <Flame size={14} className="animate-pulse" />
                Live Standings
              </div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-white mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500">
                Hall of <span className="text-indigo-500">Legends</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-xl font-medium leading-relaxed">
                Celebrating the elite operators of the DAGARMY network. Rank up, earn badges, and dominate the arena.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800"
            >
              {['all-time', 'this-month', 'this-week'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                    timeFilter === filter 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  )}
                >
                  {filter.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Podium Section */}
          <div className="relative mb-32 pt-20">
            {/* Background Aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/10 blur-[120px] -z-10 rounded-full" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto">
              <PodiumPlace student={topThree[0]} place={2} />
              <PodiumPlace student={topThree[1]} place={1} isMain />
              <PodiumPlace student={topThree[2]} place={3} />
            </div>
          </div>

          {/* Ranking List Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-indigo-500/30" />
                <h2 className="text-2xl font-black text-white uppercase tracking-widest">Global Rankings</h2>
                <div className="h-px w-12 bg-indigo-500/30" />
              </div>
              <div className="hidden md:flex items-center gap-8 text-slate-500 text-xs font-bold uppercase tracking-widest px-8">
                <span className="w-24 text-center">Courses</span>
                <span className="w-24 text-center">Level</span>
                <span className="w-24 text-center">DAG Points</span>
                <span className="w-16 text-right">Trend</span>
              </div>
            </div>

            <div className="space-y-4">
              {leaderboardData.slice(3).map((student, idx) => (
                <RankingRow key={student.rank} student={student} index={idx} />
              ))}
            </div>
          </motion.div>
        </main>
      </div>
      <Footer1 />

      <style jsx global>{`
        @keyframes shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .text-shine {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 200% 100%;
          animation: shine 3s infinite;
        }
      `}</style>
    </div>
  );
}

function PodiumPlace({ student, place, isMain = false }) {
  const configs = {
    1: { 
      color: "from-yellow-400 via-amber-500 to-yellow-600", 
      icon: <Crown size={48} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />,
      height: "h-[320px]",
      shadow: "shadow-yellow-500/10",
      border: "border-yellow-500/30",
      glow: "bg-yellow-500/5"
    },
    2: { 
      color: "from-slate-300 via-slate-400 to-slate-500", 
      icon: <Medal size={38} className="text-slate-300 drop-shadow-[0_0_15px_rgba(203,213,225,0.5)]" />,
      height: "h-[240px]",
      shadow: "shadow-slate-500/5",
      border: "border-slate-500/20",
      glow: "bg-slate-500/5"
    },
    3: { 
      color: "from-orange-400 via-orange-500 to-orange-700", 
      icon: <Award size={38} className="text-orange-400 drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]" />,
      height: "h-[200px]",
      shadow: "shadow-orange-500/5",
      border: "border-orange-500/20",
      glow: "bg-orange-500/5"
    }
  };

  const config = configs[place];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 + (place * 0.1) }}
      className={cn(
        "relative group flex flex-col items-center",
        isMain ? "z-20 scale-110" : "z-10"
      )}
    >
      {/* Rank Icon */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="mb-8"
      >
        {config.icon}
      </motion.div>

      {/* Avatar Glass */}
      <div className="relative mb-6">
        <div className={cn(
          "absolute -inset-4 rounded-full blur-2xl transition-opacity duration-500",
          place === 1 ? "bg-yellow-500/20 opacity-100" : "bg-indigo-500/10 opacity-0 group-hover:opacity-100"
        )} />
        <div className={cn(
          "w-24 h-24 rounded-full p-1 bg-gradient-to-tr",
          config.color
        )}>
          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center border-4 border-slate-900 overflow-hidden">
            <span className="text-3xl font-black text-white">{student.avatar}</span>
          </div>
        </div>
        {place === 1 && (
          <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-1.5 rounded-lg shadow-lg">
            <ShieldCheck size={18} />
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-black text-white tracking-tight mb-1">{student.name}</h3>
        <div className="flex items-center justify-center gap-2">
          <Target size={14} className="text-indigo-400" />
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Level {student.level}</span>
        </div>
      </div>

      {/* Pedestal */}
      <div className={cn(
        "w-full rounded-t-[32px] border-t border-x overflow-hidden transition-all duration-500 bg-slate-900/40 backdrop-blur-xl",
        config.height,
        config.border,
        config.shadow,
        "group-hover:bg-slate-800/60"
      )}>
        <div className={cn("w-full h-1 bg-gradient-to-r", config.color)} />
        <div className="p-8 flex flex-col items-center justify-start h-full">
          <div className="text-4xl font-black text-white mb-2 tabular-nums">
            {student.points.toLocaleString()}
          </div>
          <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">DAG Points</div>
          
          <div className="mt-8 flex gap-4">
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-white">{student.badges}</span>
              <span className="text-[8px] font-bold text-slate-500 uppercase">Badges</span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-white">{student.courses}</span>
              <span className="text-[8px] font-bold text-slate-500 uppercase">Courses</span>
            </div>
          </div>

          {place === 1 && (
            <div className="mt-auto mb-8 py-2 px-4 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-widest">
              Grand Champion
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function RankingRow({ student, index }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.01, x: 10 }}
      className={cn(
        "group relative grid grid-cols-1 md:grid-cols-[60px_1fr_auto] items-center gap-6 p-4 md:p-6 rounded-2xl transition-all duration-300",
        student.isCurrentUser 
          ? "bg-indigo-600/10 border border-indigo-500/30 shadow-[0_0_30px_rgba(79,70,229,0.1)]" 
          : "bg-slate-900/30 border border-slate-800/50 hover:bg-slate-800/50 hover:border-slate-700"
      )}
    >
      {/* Rank Number */}
      <div className="flex items-center justify-center">
        <span className={cn(
          "text-2xl font-black italic",
          student.isCurrentUser ? "text-indigo-400" : "text-slate-700 group-hover:text-slate-500"
        )}>
          #{student.rank}
        </span>
      </div>

      {/* Profile Info */}
      <div className="flex items-center gap-4 md:gap-6">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold border",
          student.isCurrentUser ? "bg-indigo-500 text-white border-indigo-400" : "bg-slate-800 text-slate-300 border-slate-700"
        )}>
          {student.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
              {student.name}
            </h4>
            {student.isCurrentUser && (
              <span className="px-2 py-0.5 rounded-md bg-indigo-500 text-[10px] font-black text-white uppercase tracking-widest">You</span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-1.5">
              <Star size={12} className="text-yellow-500" />
              <span className="text-xs font-bold text-slate-400">{student.badges} Badges</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <div className="flex items-center gap-1.5">
              <Cpu size={12} className="text-indigo-400" />
              <span className="text-xs font-bold text-slate-400">Level {student.level}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats - Desktop */}
      <div className="hidden md:flex items-center gap-8">
        <div className="w-24 text-center">
          <span className="text-sm font-bold text-slate-300">{student.courses}</span>
        </div>
        
        <div className="w-24 flex flex-col items-center">
          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${student.xp}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-indigo-500"
            />
          </div>
          <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase">XP {student.xp}%</span>
        </div>

        <div className="w-24 text-center">
          <span className="text-lg font-black text-white tabular-nums group-hover:text-indigo-400 transition-colors">
            {student.points.toLocaleString()}
          </span>
        </div>

        <div className="w-16 flex justify-end">
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black",
            student.trend === 'up' ? "bg-emerald-500/10 text-emerald-500" : 
            student.trend === 'down' ? "bg-rose-500/10 text-rose-500" : "bg-slate-800 text-slate-500"
          )}>
            {student.trend === 'up' ? <ArrowUp size={12} /> : 
             student.trend === 'down' ? <ArrowDown size={12} /> : <Minus size={12} />}
            {student.change !== 0 && Math.abs(student.change)}
          </div>
        </div>
      </div>

      {/* Stats - Mobile */}
      <div className="flex md:hidden items-center justify-between pt-4 mt-4 border-t border-slate-800/50">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Points</span>
          <span className="text-lg font-black text-white">{student.points.toLocaleString()}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Level</span>
          <span className="text-lg font-black text-indigo-400">{student.level}</span>
        </div>
      </div>
    </motion.div>
  );
}
