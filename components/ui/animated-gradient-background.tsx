"use client";

import React from "react";

interface AnimatedGradientBackgroundProps {
  color?: string;
  opacity?: number;
}

export const AnimatedGradientBackground: React.FC<AnimatedGradientBackgroundProps> = ({
  color = "#6366f1",
  opacity = 0.15,
}) => {
  return (
    <div
      className="w-full h-full absolute inset-0"
      style={{
        background: `
          radial-gradient(circle at 20% 50%, ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 50%),
          radial-gradient(circle at 40% 20%, ${color}${Math.round(opacity * 0.7 * 255).toString(16).padStart(2, '0')} 0%, transparent 50%)
        `,
        animation: 'gradientShift 15s ease infinite',
      }}
    >
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(10%, -10%) scale(1.1);
          }
          66% {
            transform: translate(-10%, 10%) scale(0.9);
          }
        }
      `}</style>
    </div>
  );
};
