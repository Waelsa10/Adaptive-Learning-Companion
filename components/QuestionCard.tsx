import React from 'react';
import { LearningActivity, AnswerStatus, ActivityType } from '../types';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface QuestionCardProps {
  activity: LearningActivity;
  onAnswerSelect: (answer: string) => void;
  selectedAnswer: string | null;
  answerStatus: AnswerStatus;
}

export default function QuestionCard({ activity, onAnswerSelect, selectedAnswer, answerStatus }: QuestionCardProps) {
  const getButtonClass = (option: string) => {
    let baseClass = "w-full text-left p-4 rounded-xl border-2 font-bold text-lg transition-all duration-300 flex items-center justify-between";
    if (answerStatus === AnswerStatus.Unanswered) {
      return `${baseClass} bg-white border-slate-200 text-slate-700 hover:bg-sky-100 hover:border-sky-400 cursor-pointer`;
    }
    
    const isSelected = selectedAnswer === option;
    const isCorrect = activity.correctAnswer === option;
    
    if (isCorrect) {
      return `${baseClass} bg-green-100 border-green-500 text-green-800 cursor-not-allowed`;
    }
    if (isSelected && !isCorrect) {
      return `${baseClass} bg-red-100 border-red-500 text-red-800 cursor-not-allowed`;
    }
    return `${baseClass} bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed opacity-70`;
  };

  const getIcon = (option: string) => {
    if (answerStatus === AnswerStatus.Unanswered) return null;

    const isCorrect = activity.correctAnswer === option;
    const isSelected = selectedAnswer === option;

    if (isCorrect) {
      return <div className="text-green-500"><CheckCircleIcon /></div>;
    }
    if (isSelected && !isCorrect) {
      return <div className="text-red-500"><XCircleIcon /></div>;
    }
    return null;
  }
  
  const promptText = () => {
    if (activity.activityType === ActivityType.FillInTheBlank && activity.sentence) {
      const parts = activity.sentence.split('__');
      return (
        <>
          {parts[0]}
          <span className="inline-block bg-slate-200 rounded-md px-4 py-1 mx-2 text-slate-400 font-normal">...</span>
          {parts[1]}
        </>
      )
    }
    if (activity.activityType === ActivityType.StoryQuestion && activity.question) {
      return activity.question;
    }
    return "What is the correct answer?"; // Fallback
  };


  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">{promptText()}</h3>
      <div className="space-y-3">
        {activity.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswerSelect(option)}
            disabled={answerStatus !== AnswerStatus.Unanswered}
            className={getButtonClass(option)}
          >
            <span>{option}</span>
            {getIcon(option)}
          </button>
        ))}
      </div>
    </div>
  );
}