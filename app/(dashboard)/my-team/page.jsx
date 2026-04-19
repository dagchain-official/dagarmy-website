"use client";
import React, { useState, useEffect, useLayoutEffect } from "react";
import ReferralContent from "@/components/dashboard/ReferralContent";
import RewardsContent from "@/components/dashboard/RewardsContent";
import MyBusinessContent from "@/components/dashboard/MyBusinessContent";
import UpgradesBenefitsContent from "@/components/dashboard/UpgradesBenefitsContent";
import { Users, Award, Briefcase, TrendingUp } from "lucide-react";

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

export default function StudentMyTeamPage() {
  const [activeTab, setActiveTab] = useState('referral');
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const [mobile, setMobile] = useState(true);
  useLayoutEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const tabs = [
    { id: 'referral',   label: 'Referral',          mobileLabel: 'Referral',  icon: <Users size={13} /> },
    { id: 'rewards',    label: 'Rewards',            mobileLabel: 'Rewards',   icon: <Award size={13} /> },
    { id: 'mybusiness', label: 'My Business',        mobileLabel: 'Business',  icon: <Briefcase size={13} /> },
    { id: 'upgrades',   label: 'Upgrades & Benefits',mobileLabel: 'Benefits',  icon: <TrendingUp size={13} /> },
  ];

  return (
    <div style={{ flex: 1, padding: mobile ? '16px 14px' : '32px 36px', background: '#f0f2f5', minHeight: '100vh' }}>

      <style>{`
        .myteam-tabs::-webkit-scrollbar { display: none; }
        .myteam-tabs { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

        {/* Page Header */}
        <div style={{ marginBottom: mobile ? '16px' : '24px', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(-8px)', transition: 'all 0.5s ease' }}>
          <h1 style={{ fontSize: mobile ? '20px' : '28px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: mobile ? '32px' : '40px', height: mobile ? '32px' : '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Users size={mobile ? 17 : 22} color="#fff" />
            </div>
            My Team
          </h1>
          {!mobile && <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 0 52px', fontWeight: '450' }}>Manage your referrals and track your rewards</p>}
        </div>

        {/* Tab Bar — scrollable on mobile */}
        <div
          className="myteam-tabs"
          style={{
            display: 'flex', gap: '6px',
            marginBottom: mobile ? '16px' : '28px',
            background: 'rgba(0,0,0,0.05)', borderRadius: '14px', padding: '5px',
            boxShadow: 'inset 3px 3px 7px rgba(0,0,0,0.1), inset -2px -2px 5px rgba(255,255,255,0.8)',
            overflowX: mobile ? 'auto' : 'visible',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: mobile ? '4px' : '8px',
                padding: mobile ? '9px 4px' : '12px 0',
                minWidth: 0,
                borderRadius: '10px', border: 'none',
                fontSize: mobile ? '11px' : '15px', fontWeight: '700', cursor: 'pointer',
                transition: 'all 0.22s ease', letterSpacing: '0',
                background: activeTab === tab.id ? '#f0f2f5' : 'transparent',
                color: activeTab === tab.id ? '#4f46e5' : '#94a3b8',
                boxShadow: activeTab === tab.id ? '4px 4px 10px rgba(0,0,0,0.12), -3px -3px 8px rgba(255,255,255,0.9)' : 'none',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {tab.icon}
              {mobile ? tab.mobileLabel : tab.label}
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
