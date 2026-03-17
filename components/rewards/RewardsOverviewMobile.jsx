"use client";
import React from 'react';

// Philosophy Cards for Mobile Slider
export const PhilosophyCards = [
  {
    tag: "MERIT PRINCIPLE",
    title: "No Free Rides",
    description: "You don't get rewarded just for signing up. You get recognized for learning, building, and leading."
  },
  {
    tag: "EQUAL ENTRY FRAMEWORK",
    title: "Equal Ground",
    description: "It doesn't matter who you know. Everyone starts at the exact same rank: DAG Soldier."
  },
  {
    tag: "SUSTAINABLE VALUE MODEL",
    title: "Real Value",
    description: "Our rewards come from actual ecosystem growth, not speculative bubbles."
  }
];

export const PhilosophyCard = ({ tag, title, description }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '28px 20px',
    textAlign: 'center',
    minHeight: '280px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }}>
    <p style={{
      fontSize: '9px',
      fontWeight: '700',
      color: '#6366f1',
      textTransform: 'uppercase',
      letterSpacing: '1.2px',
      marginBottom: '12px'
    }}>
      {tag}
    </p>
    <h3 style={{
      fontFamily: 'Georgia, serif',
      fontSize: '24px',
      fontWeight: '700',
      color: '#000000',
      marginBottom: '12px',
      letterSpacing: '-0.01em',
      lineHeight: '1.2'
    }}>
      {title}
    </h3>
    <div style={{
      width: '40px',
      height: '2px',
      background: '#6366f1',
      margin: '0 auto 14px'
    }} />
    <p style={{
      fontSize: '14px',
      color: '#4b5563',
      lineHeight: '1.65',
      margin: 0,
      padding: '0 8px'
    }}>
      {description}
    </p>
  </div>
);

// Burn to Rise Cards
export const BurnCards = [
  {
    title: "The Commitment",
    description: "Burning wipes your point balance to zero."
  },
  {
    title: "The Reward",
    description: "In exchange, you permanently unlock a higher Rank."
  },
  {
    title: "The Benefit",
    description: "Higher ranks unlock significantly higher privileges and reward efficiency."
  }
];

export const BurnCard = ({ title, description }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '28px 20px',
    textAlign: 'center',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }}>
    <div style={{
      width: '36px',
      height: '3px',
      background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
      margin: '0 auto 16px'
    }} />
    <h5 style={{
      fontSize: '20px',
      fontWeight: '700',
      color: '#000000',
      marginBottom: '12px',
      letterSpacing: '-0.01em'
    }}>
      {title}
    </h5>
    <p style={{
      fontSize: '14px',
      color: '#6b7280',
      lineHeight: '1.65',
      margin: 0,
      padding: '0 8px'
    }}>
      {description}
    </p>
  </div>
);

// Choose Your Path Cards
export const PathCards = [
  {
    badge: "/images/dagbadges/DAG SOLDIER.svg",
    title: "DAG Soldier",
    focus: "Skill Development",
    description: "The foundational entry point for members building practical AI capability. Access the ecosystem to understand business logic and automation.",
    features: [
      "Open Learning Sessions",
      "AI Business & Automation Fundamentals",
      "Contribution-Based Reputation Growth"
    ],
    footer: "Transition from Learner to Builder through consistent action."
  },
  {
    badge: "/images/dagbadges/DAG LIEUTENANT.svg",
    title: "DAG Lieutenant",
    focus: "Building & Contribution",
    description: "The advanced operating mode for builders ready to launch, execute, and lead within the ecosystem.",
    features: [
      "Launch & Validate Real AI Projects",
      "Access to Structured Builder Sprints",
      "Eligible for Demo Day & Startup Tracks"
    ],
    footer: "Lieutenant status reflects commitment to execution, not entitlement. Advancement is earned through real-world output.",
    isPremium: true
  }
];

export const PathCard = ({ badge, title, focus, description, features, footer, isPremium }) => (
  <div style={{
    background: isPremium ? 'rgba(239, 246, 255, 0.5)' : '#ffffff',
    border: isPremium ? '2px solid #a855f7' : '1px solid #e5e7eb',
    borderRadius: '16px',
    padding: '24px 18px',
    minHeight: '480px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: isPremium ? '0 8px 24px rgba(124, 92, 255, 0.12)' : '0 4px 12px rgba(0, 0, 0, 0.05)'
  }}>
    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
      <img 
        src={badge}
        alt={`${title} Badge`}
        style={{ width: '100px', height: '100px', objectFit: 'contain', margin: '0 auto' }}
      />
    </div>
    
    <h3 style={{
      fontFamily: 'Georgia, serif',
      fontSize: '26px',
      fontWeight: '700',
      color: '#000000',
      textAlign: 'center',
      marginBottom: '8px'
    }}>
      {title}
    </h3>
    
    <p style={{
      textAlign: 'center',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '12px'
    }}>
      <span style={{ color: '#9ca3af' }}>Focus:</span>{' '}
      <span style={{ color: isPremium ? '#a855f7' : '#3b82f6' }}>{focus}</span>
    </p>
    
    <p style={{
      fontSize: '13px',
      color: '#6b7280',
      textAlign: 'center',
      lineHeight: '1.6',
      marginBottom: '16px',
      padding: '0 4px'
    }}>
      {description}
    </p>
    
    <ul style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      marginBottom: '16px',
      padding: 0,
      listStyle: 'none'
    }}>
      {features.map((feature, idx) => (
        <li key={idx} style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          padding: '8px 10px',
          background: isPremium ? 'rgba(243, 232, 255, 0.3)' : 'rgba(249, 250, 251, 0.8)',
          borderRadius: '8px',
          border: `1px solid ${isPremium ? 'rgba(168, 85, 247, 0.2)' : 'rgba(229, 231, 235, 0.6)'}`
        }}>
          <svg style={{ width: '18px', height: '18px', color: '#10b981', marginTop: '1px', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
          </svg>
          <span style={{ fontSize: '13px', color: '#374151', fontWeight: '500', lineHeight: '1.5' }}>
            {feature}
          </span>
        </li>
      ))}
    </ul>
    
    <div style={{
      marginTop: 'auto',
      padding: '14px 16px',
      background: isPremium ? 'rgba(124, 92, 255, 0.06)' : 'rgba(0, 0, 0, 0.02)',
      borderTop: `1px solid ${isPremium ? 'rgba(124, 92, 255, 0.2)' : 'rgba(0, 0, 0, 0.06)'}`,
      borderRadius: '0 0 14px 14px',
      margin: '0 -18px -24px'
    }}>
      <p style={{
        fontSize: '12px',
        color: '#374151',
        textAlign: 'center',
        fontWeight: '500',
        lineHeight: '1.5',
        margin: 0
      }}>
        {footer}
      </p>
    </div>
  </div>
);

// Ecosystem Grants Cards
export const EcosystemCards = [
  {
    tag: "RESOURCE ACCESS FRAMEWORK",
    title: "Meritocratic Efficiency",
    description: "Your rank dictates your resource access. As you progress from Starter to Mythic, the ecosystem unlocks higher efficiency tiers, ensuring that long-term contributors receive a larger share of the value they generate."
  },
  {
    tag: "IMPACT RECOGNITION SYSTEM",
    title: "Performance Fellowships",
    description: "Consistency is the primary metric we reward. Contributors who demonstrate sustained, monthly impact are eligible for the Discretionary Excellence Fund—a resource pool reserved specifically for those actively driving ecosystem stability."
  },
  {
    tag: "LEADERSHIP SUPPORT INFRASTRUCTURE",
    title: "Ambassador Logistics Program",
    description: "For our most dedicated leaders, support extends beyond the digital platform. High-impact contributors can qualify for the Lifestyle Support Tier, which provides assistance for real-world logistical needs—such as travel and operational costs—to facilitate their leadership duties."
  }
];

export const EcosystemCard = ({ tag, title, description }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '28px 20px',
    textAlign: 'center',
    minHeight: '320px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }}>
    <p style={{
      fontSize: '9px',
      fontWeight: '700',
      color: '#6366f1',
      textTransform: 'uppercase',
      letterSpacing: '1.2px',
      marginBottom: '10px'
    }}>
      {tag}
    </p>
    <h3 style={{
      fontFamily: 'Georgia, serif',
      fontSize: '22px',
      fontWeight: '700',
      color: '#000000',
      marginBottom: '12px',
      letterSpacing: '-0.01em',
      lineHeight: '1.2'
    }}>
      {title}
    </h3>
    <div style={{
      width: '40px',
      height: '2px',
      background: '#d1d5db',
      margin: '0 auto 14px'
    }} />
    <p style={{
      fontSize: '13px',
      color: '#6b7280',
      lineHeight: '1.65',
      margin: 0,
      padding: '0 8px'
    }}>
      {description}
    </p>
  </div>
);
