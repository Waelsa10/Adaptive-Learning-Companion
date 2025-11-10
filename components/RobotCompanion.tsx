
import React from 'react';
import { RobotState } from '../types';

interface RobotCompanionProps {
  state: RobotState;
}

export default function RobotCompanion({ state }: RobotCompanionProps) {
  const getEyeContent = () => {
    switch (state) {
      case RobotState.Happy:
      case RobotState.Celebrating:
        return (
          <>
            <path d="M8 10 C 8 8, 10 8, 10 10" stroke="currentColor" strokeWidth="1.2" fill="none" />
            <path d="M14 10 C 14 8, 16 8, 16 10" stroke="currentColor" strokeWidth="1.2" fill="none" />
          </>
        );
      case RobotState.Sad:
        return (
          <>
            <line x1="8" y1="10" x2="10" y2="10" stroke="currentColor" strokeWidth="1.2" />
            <line x1="14" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="1.2" />
          </>
        );
      case RobotState.Thinking:
          return (
            <>
                <circle cx="9" cy="10" r="1.5" fill="currentColor" className="animate-pulse" />
                <circle cx="15" cy="10" r="1.5" fill="currentColor" className="animate-pulse delay-200" />
            </>
        );
      case RobotState.Idle:
      default:
        return (
          <>
            <circle cx="9" cy="10" r="1.5" fill="currentColor" />
            <circle cx="15" cy="10" r="1.5" fill="currentColor" />
          </>
        );
    }
  };

  const getMouthContent = () => {
    switch (state) {
      case RobotState.Happy:
        return <path d="M9 15 Q 12 18, 15 15" stroke="currentColor" strokeWidth="1.2" fill="none" />;
      case RobotState.Celebrating:
        return <path d="M9 15 Q 12 19, 15 15" stroke="currentColor" strokeWidth="1.2" fill="none" />;
        case RobotState.Sad:
        return <path d="M9 16 Q 12 13, 15 16" stroke="currentColor" strokeWidth="1.2" fill="none" />;
      case RobotState.Thinking:
      case RobotState.Idle:
      default:
        return <line x1="10" y1="15" x2="14" y2="15" stroke="currentColor" strokeWidth="1.2" />;
    }
  };
  
  const robotAnimationClass = state === RobotState.Celebrating ? 'animate-bounce' : 'animate-none';
  const robotColorClass = state === RobotState.Happy || state === RobotState.Celebrating ? 'text-green-500' : state === RobotState.Sad ? 'text-red-500' : 'text-sky-500';

  return (
    <div className={`transition-all duration-500 ${robotAnimationClass}`}>
      <svg
        width="150"
        height="150"
        viewBox="0 0 24 24"
        className={`w-48 h-48 transition-colors duration-300 ${robotColorClass}`}
      >
        <path
          d="M4 12 L4 18 C4 19.1046 4.89543 20 6 20 L18 20 C19.1046 20 20 19.1046 20 18 L20 12"
          stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d="M4 12 C4 8.68629 6.68629 6 10 6 L14 6 C17.3137 6 20 8.68629 20 12"
          stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"
        />
        <path d="M9 4 L10 6" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        {getEyeContent()}
        {getMouthContent()}
      </svg>
    </div>
  );
}
