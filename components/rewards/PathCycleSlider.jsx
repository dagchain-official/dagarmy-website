"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PathCard } from './ChooseYourPathMobile';
import ProgressArrow from './ProgressArrow';

/**
 * Custom Cycle Slider for Choose Your Path Section
 * Professional 3-State Flow:
 * - State 1: DAG Soldier Card (5s)
 * - State 2: Arrow Animation (2s)
 * - State 3: DAG Lieutenant Card (5s)
 * Then loops back to State 1
 */
export default function PathCycleSlider() {
  const [currentCycle, setCurrentCycle] = useState(0); // 0: Soldier, 1: Arrow, 2: Lieutenant
  const [direction, setDirection] = useState(1);

  // Cycle timings in milliseconds
  const cycleDurations = [
    5000, // State 1: Soldier card - 5s
    3000, // State 2: Arrow animation - 2s
    5000  // State 3: Lieutenant card - 5s
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDirection(1);
      setCurrentCycle((prev) => (prev + 1) % 3); // Loop through 0, 1, 2
    }, cycleDurations[currentCycle]);

    return () => clearTimeout(timer);
  }, [currentCycle]);

  const variants = {
    enter: {
      opacity: 0,
      y: 30
    },
    center: {
      opacity: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      y: -30
    }
  };

  return (
    <div style={{ 
      position: 'relative',
      width: '100%',
      minHeight: '520px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <AnimatePresence mode="wait" custom={direction}>
        {/* State 1: DAG Soldier Card */}
        {currentCycle === 0 && (
          <motion.div
            key="soldier"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              opacity: { duration: 0.5 },
              y: { duration: 0.6, ease: "easeOut" }
            }}
            style={{ width: '100%' }}
          >
            <PathCard
              badgeImage="/images/dagbadges/DAG SOLDIER.svg"
              title="DAG Soldier"
              focus="Skill Development"
              focusColor="#3b82f6"
              description="The foundational entry point for members building practical AI capability. Access the ecosystem to understand business logic and automation."
              items={[
                "Open Learning Sessions",
                "AI Business & Automation Fundamentals",
                "Contribution-Based Reputation Growth"
              ]}
              footerText="Transition from Learner to Builder through consistent action."
              isPremium={false}
            />
          </motion.div>
        )}

        {/* State 2: Arrow Animation */}
        {currentCycle === 1 && (
          <motion.div
            key="arrow"
            custom={direction}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              opacity: { duration: 0.4 },
              scale: { duration: 0.5, ease: "easeOut" }
            }}
            style={{ 
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '300px'
            }}
          >
            <ProgressArrow delay={0} />
          </motion.div>
        )}

        {/* State 3: DAG Lieutenant Card */}
        {currentCycle === 2 && (
          <motion.div
            key="lieutenant"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              opacity: { duration: 0.5 },
              y: { duration: 0.6, ease: "easeOut" }
            }}
            style={{ width: '100%' }}
          >
            <PathCard
              badgeImage="/images/dagbadges/DAG LIEUTENANT.svg"
              title="DAG Lieutenant"
              focus="Building & Contribution"
              focusColor="#a855f7"
              description="The advanced operating mode for builders ready to launch, execute, and lead within the ecosystem."
              items={[
                "Launch & Validate Real AI Projects",
                "Access to Structured Builder Sprints",
                "Eligible for Demo Day & Startup Tracks"
              ]}
              footerText="Lieutenant status reflects commitment to execution, not entitlement. Advancement is earned through real-world output."
              isPremium={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
