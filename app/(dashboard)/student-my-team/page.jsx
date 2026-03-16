"use client";
import React, { useState, useEffect } from "react";
import ReferralContent from "@/components/dashboard/ReferralContent";
import RewardsContent from "@/components/dashboard/RewardsContent";
import MyBusinessContent from "@/components/dashboard/MyBusinessContent";
import UpgradesBenefitsContent from "@/components/dashboard/UpgradesBenefitsContent";
import { Users, Award, Briefcase, TrendingUp } from "lucide-react";

export default function StudentMyTeamPage() {
  const [activeTab, setActiveTab] = useState('referral');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const tabs = [
    { id: 'referral',   label: 'Referral',             icon: <Users size={16} /> },
    { id: 'rewards',    label: 'Rewards',               icon: <Award size={16} /> },
    { id: 'mybusiness', label: 'My Business',           icon: <Briefcase size={16} /> },
    { id: 'upgrades',   label: 'Upgrades & Benefits',  icon: <TrendingUp size={16} /> },
  ];

  return (
    <div style={{ flex: 1, padding: '32px 36px', background: '#f0f2f5', minHeight: '100vh' }}>

        {/* Page Header */}
        <div style={{ marginBottom: '24px', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(-8px)', transition: 'all 0.5s ease' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.6px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={22} color="#fff" />
            </div>
            My Team
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 0 52px', fontWeight: '450' }}>
            Manage your referrals and track your rewards
          </p>
        </div>

        {/* Tab Bar */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '28px', background: 'rgba(0,0,0,0.05)', borderRadius: '14px', padding: '5px', boxShadow: 'inset 3px 3px 7px rgba(0,0,0,0.1), inset -2px -2px 5px rgba(255,255,255,0.8)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '12px 0', borderRadius: '10px', border: 'none',
                fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                transition: 'all 0.22s ease', letterSpacing: '0.2px',
                background: activeTab === tab.id ? '#f0f2f5' : 'transparent',
                color: activeTab === tab.id ? '#4f46e5' : '#94a3b8',
                boxShadow: activeTab === tab.id ? '4px 4px 10px rgba(0,0,0,0.12), -3px -3px 8px rgba(255,255,255,0.9)' : 'none',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ display: activeTab === 'referral' ? 'block' : 'none' }}>
          <ReferralContent mounted={mounted} />
        </div>
        <div style={{ display: activeTab === 'rewards' ? 'block' : 'none' }}>
          <RewardsContent mounted={mounted} />
        </div>
        <div style={{ display: activeTab === 'mybusiness' ? 'block' : 'none' }}>
          <MyBusinessContent mounted={mounted} />
        </div>
        <div style={{ display: activeTab === 'upgrades' ? 'block' : 'none' }}>
          <UpgradesBenefitsContent mounted={mounted} />
        </div>

    </div>
  );
}
