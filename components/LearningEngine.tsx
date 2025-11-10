import React, { useState, useEffect, useCallback } from 'react';
import { generateLearningActivity } from '../services/geminiService';
import { LearningActivity, RobotState, PreviousAttempt, AnswerStatus, DifficultyLevel, ActivityType } from '../types';
import RobotCompanion from './RobotCompanion';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';
import { StarIcon } from './icons';

interface LearningEngineProps {
  topic: string;
  onEndSession: () => void;
}

const TOTAL_QUESTIONS = 5;
const RESPONSE_TIME_THRESHOLD_MS = 10000; // 10 seconds to be considered a "quick" answer
const STREAK_TO_LEVEL_UP = 2; // Number of consecutive correct & quick answers to increase difficulty

export default function LearningEngine({ topic, onEndSession }: LearningEngineProps) {
  const [activity, setActivity] = useState<LearningActivity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [robotState, setRobotState] = useState<RobotState>(RobotState.Idle);
  const [score, setScore] = useState<number>(0);
  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>(AnswerStatus.Unanswered);
  const [isFinished, setIsFinished] = useState(false);

  // --- Dynamic Difficulty State ---
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(DifficultyLevel.Easy);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);

  const fetchNextActivity = useCallback(async (previousAttempt: PreviousAttempt | null = null) => {
    setIsLoading(true);
    setRobotState(RobotState.Thinking);
    setSelectedAnswer(null);
    setAnswerStatus(AnswerStatus.Unanswered);

    // Add a small delay for better UX
    await new Promise(res => setTimeout(res, 500));
    
    const newActivity = await generateLearningActivity(topic, difficulty, previousAttempt);
    setActivity(newActivity);
    setQuestionNumber(prev => prev + 1);
    setQuestionStartTime(Date.now()); // Start timer for response
    setIsLoading(false);
    setRobotState(RobotState.Idle);
  }, [topic, difficulty]);

  useEffect(() => {
    fetchNextActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswerSelect = (answer: string) => {
    if (answerStatus !== AnswerStatus.Unanswered) return;
    
    const responseTimeMs = Date.now() - questionStartTime;
    setSelectedAnswer(answer);

    if (answer === activity?.correctAnswer) {
      setAnswerStatus(AnswerStatus.Correct);
      setRobotState(RobotState.Happy);
      setScore(prev => prev + 1);

      const newConsecutiveCorrect = consecutiveCorrect + 1;
      setConsecutiveCorrect(newConsecutiveCorrect);

      // --- Difficulty UP logic ---
      if (newConsecutiveCorrect >= STREAK_TO_LEVEL_UP && responseTimeMs < RESPONSE_TIME_THRESHOLD_MS) {
        if (difficulty === DifficultyLevel.Easy) {
          setDifficulty(DifficultyLevel.Medium);
        } else if (difficulty === DifficultyLevel.Medium) {
          setDifficulty(DifficultyLevel.Hard);
        }
        setConsecutiveCorrect(0); // Reset streak after leveling up
      }
    } else {
      setAnswerStatus(AnswerStatus.Incorrect);
      setRobotState(RobotState.Sad);
      setConsecutiveCorrect(0); // Reset streak

      // --- Difficulty DOWN logic ---
      if (difficulty === DifficultyLevel.Hard) {
        setDifficulty(DifficultyLevel.Medium);
      } else if (difficulty === DifficultyLevel.Medium) {
        setDifficulty(DifficultyLevel.Easy);
      }
    }

    setTimeout(() => {
      if (questionNumber >= TOTAL_QUESTIONS) {
        setIsFinished(true);
        setRobotState(RobotState.Celebrating);
      } else {
        let attempt: PreviousAttempt | null = null;
        if (answer !== activity?.correctAnswer && activity) {
            let promptText = '';
            if (activity.activityType === ActivityType.StoryQuestion && activity.question) {
                promptText = activity.question;
            } else if (activity.activityType === ActivityType.FillInTheBlank && activity.sentence) {
                promptText = activity.sentence;
            }
          
            if (promptText) {
                attempt = {
                    promptText: promptText,
                    userAnswer: answer,
                    correctAnswer: activity.correctAnswer
                };
            }
        }
        fetchNextActivity(attempt);
      }
    }, 2000);
  };
  
  const DifficultyDisplay = () => {
    const stars = {
      [DifficultyLevel.Easy]: 1,
      [DifficultyLevel.Medium]: 2,
      [DifficultyLevel.Hard]: 3,
    };
    const numStars = stars[difficulty];
    return (
      <div className="flex justify-center items-center mt-1" aria-label={`Current difficulty: ${difficulty}`}>
          <span className="text-sm font-bold text-slate-500 mr-2">Challenge Level:</span>
          <div className="flex">
            {Array.from({ length: 3 }).map((_, i) => (
              <StarIcon key={i} className={`h-5 w-5 transition-colors ${i < numStars ? 'text-yellow-400' : 'text-slate-300'}`} />
            ))}
          </div>
      </div>
    );
  };

  if (isFinished) {
    return (
      <div className="text-center flex flex-col items-center">
        <h2 className="text-3xl font-bold text-sky-700 mb-4">Great Job!</h2>
        <p className="text-xl text-slate-600 mb-6">You completed the {topic} adventure!</p>
        <div className="text-5xl font-black text-amber-500 mb-6">
          {score} / {TOTAL_QUESTIONS}
        </div>
        <RobotCompanion state={robotState} />
        <button
          onClick={onEndSession}
          className="mt-8 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-full text-xl transition-transform transform hover:scale-105"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
      <div className="w-full lg:w-1/3 flex flex-col items-center">
        <RobotCompanion state={robotState} />
        <div className="mt-4 text-center">
            <p className="text-lg font-bold text-sky-700">Score: {score}</p>
            <DifficultyDisplay />
        </div>
      </div>
      <div className="w-full lg:w-2/3">
        <ProgressBar current={questionNumber} total={TOTAL_QUESTIONS} />
        {isLoading || !activity ? (
          <div className="text-center p-8">
            <p className="text-slate-500">Sparky is thinking of a new adventure...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activity.activityType === ActivityType.StoryQuestion && activity.story && (
                <div className="bg-sky-50 p-4 rounded-xl shadow-inner">
                  <p className="text-slate-700 text-lg text-center italic">"{activity.story}"</p>
                </div>
            )}
            <QuestionCard
              activity={activity}
              onAnswerSelect={handleAnswerSelect}
              selectedAnswer={selectedAnswer}
              answerStatus={answerStatus}
            />
          </div>
        )}
      </div>
    </div>
  );
}