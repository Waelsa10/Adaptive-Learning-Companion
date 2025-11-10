
import React, { useState } from 'react';
import LearningEngine from './components/LearningEngine';
import StartScreen from './components/StartScreen';
import { GameState } from './types';
import { StarIcon } from './components/icons';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [topic, setTopic] = useState<string>('Animals');

  const handleStart = (selectedTopic: string) => {
    setTopic(selectedTopic);
    setGameState(GameState.Learning);
  };

  const handleEndSession = () => {
    setGameState(GameState.Start);
  };

  return (
    <div className="bg-sky-100 min-h-screen text-slate-800 antialiased flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-6">
          <div className="inline-flex items-center bg-white rounded-full px-6 py-2 shadow-md">
            <div className="text-yellow-400">
                <StarIcon className="h-8 w-8" />
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-sky-600 ml-3">
              Adaptive Learning Companion
            </h1>
          </div>
        </header>
        
        <main className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-8">
          {gameState === GameState.Start && <StartScreen onStart={handleStart} />}
          {gameState === GameState.Learning && <LearningEngine topic={topic} onEndSession={handleEndSession} />}
        </main>
      </div>
    </div>
  );
}
