"use client";
import React, { useState } from 'react';

const AnimatedDownloadButton = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleClick = () => {
    if (isChecked) return;
    setIsChecked(true);
    setTimeout(() => {
      setIsChecked(false);
    }, 4000);
  };

  return (
    <>
      <div style={{
        padding: 0,
        margin: 0,
        boxSizing: 'border-box',
        fontFamily: 'Arial, Helvetica, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <a
          href={isChecked ? undefined : "/api/download/rewards-pdf"}
          download="DAG-Army-Reward-System.pdf"
          onClick={handleClick}
          style={{
            textDecoration: 'none',
            backgroundColor: 'transparent',
            border: '2px solid rgba(0, 0, 0, 1)',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '50px',
            width: isChecked ? '57px' : '160px',
            cursor: isChecked ? 'not-allowed' : 'pointer',
            transition: 'all 0.4s ease',
            padding: '5px',
            position: 'relative',
            animation: isChecked ? 'installed 0.4s ease 3.5s forwards' : 'none',
            pointerEvents: isChecked ? 'none' : 'auto',
          }}
        >
          <span 
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              margin: 'auto',
              opacity: 0,
              visibility: 'hidden',
              transition: 'all 0.4s ease',
              boxShadow: `
                0 0 12px rgba(124, 92, 255, 0.25),
                0 0 22px rgba(124, 92, 255, 0.18)
              `,
              animation: isChecked ? 'rotate 3s ease-in-out 0.4s forwards' : 'none'
            }}
          />
          
          <span 
            style={{
              height: '45px',
              width: '45px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'all 0.4s ease',
              position: 'relative',
              boxShadow: '0 0 0 0 rgb(255, 255, 255)',
              overflow: 'hidden',
              rotate: isChecked ? '180deg' : '0deg',
              animation: isChecked ? 'pulse 1s forwards, circleDelete 0.2s ease 3.5s forwards' : 'none'
            }}
          >
            <svg 
              aria-hidden="true" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
              style={{
                color: '#fff',
                width: '30px',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                transition: 'all 0.4s ease',
                opacity: isChecked ? 0 : 1,
                visibility: isChecked ? 'hidden' : 'visible'
              }}
            >
              <path 
                stroke="currentColor" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="1.5" 
                d="M12 19V5m0 14-4-4m4 4 4-4" 
              />
            </svg>
            <div 
              style={{
                aspectRatio: '1',
                width: '15px',
                borderRadius: '2px',
                backgroundColor: '#fff',
                opacity: isChecked ? 1 : 0,
                visibility: isChecked ? 'visible' : 'hidden',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                transition: 'all 0.4s ease'
              }}
            />
            <div 
              style={{
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                background: 'linear-gradient(180deg, #0066FF 55%, #8B5CF6 75%)',
                width: '100%',
                height: 0,
                transition: 'all 0.4s ease',
                animation: isChecked ? 'installing 3s ease-in-out forwards' : 'none'
              }}
            />
          </span>
          
          <p 
            style={{
              fontSize: '17.5px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              transition: 'all 0.4s ease',
              position: 'absolute',
              right: '20px',
              bottom: '14px',
              textAlign: 'center',
              margin: 0,
              opacity: isChecked ? 0 : 1,
              visibility: isChecked ? 'hidden' : 'visible'
            }}
          >
            Download
          </p>
     <p 
  style={{
    fontSize: '17px',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '0.4px',
    transition: 'all 0.4s ease',
    position: 'absolute',
    right: '18px',
    bottom: '14px',
    textAlign: 'center',
    margin: 0,
    opacity: 0,
    visibility: 'hidden',
    animation: isChecked 
      ? 'showInstalledMessage 0.4s ease 3.5s forwards' 
      : 'none'
  }}
>
  Open
</p>

        </a>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            scale: 0.95;
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
          }
          70% {
            scale: 1;
            box-shadow: 0 0 0 16px rgba(255, 255, 255, 0);
          }
          100% {
            scale: 0.95;
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          }
        }

        @keyframes installing {
          from {
            height: 0;
          }
          to {
            height: 100%;
          }
        }

        @keyframes rotate {
          0% {
            transform: rotate(-90deg) translate(27px) rotate(0);
            opacity: 1;
            visibility: visible;
          }
          99% {
            transform: rotate(270deg) translate(27px) rotate(270deg);
            opacity: 1;
            visibility: visible;
          }
          100% {
            opacity: 0;
            visibility: hidden;
          }
        }

        @keyframes installed {
          100% {
            width: 150px;
            border-color: rgb(35, 174, 35);
          }
        }

        @keyframes circleDelete {
          100% {
            opacity: 0;
            visibility: hidden;
          }
        }

        @keyframes showInstalledMessage {
          100% {
            opacity: 1;
            visibility: visible;
            right: 56px;
          }
        }
      `}</style>
    </>
  );
};

export default AnimatedDownloadButton;
