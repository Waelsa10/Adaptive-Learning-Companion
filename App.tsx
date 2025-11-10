
import React, { useState, useEffect } from 'react';
import LearningEngine from './components/LearningEngine';
import StartScreen from './components/StartScreen';
import { GameState } from './types';
import { StarIcon, RobotIcon } from './components/icons';

// FIX: Define the AIStudio type to match other declarations and resolve the TypeScript error.
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

// Assume window.aistudio is available for API key selection
declare global {
  interface Window {
    aistudio?: AIStudio;
  }
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [topic, setTopic] = useState<string>('Animals');
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'ready' | 'needed'>('checking');

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeyStatus(hasKey ? 'ready' : 'needed');
      } else {
        console.warn('aistudio context not found, assuming API key is ready.');
        setApiKeyStatus('ready');
      }
    };
    checkApiKey();
  }, []);

  const handleStart = (selectedTopic: string) => {
    setTopic(selectedTopic);
    setGameState(GameState.Learning);
  };

  const handleEndSession = () => {
    setGameState(GameState.Start);
  };
  
  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Optimistically assume key is selected and ready to use.
      setApiKeyStatus('ready');
    }
  };

  const handleApiKeyError = () => {
    // The service reported a key error, so we need to ask the user to select one again.
    setApiKeyStatus('needed');
    // Also reset the game state
    setGameState(GameState.Start);
  };

  const renderContent = () => {
    switch (apiKeyStatus) {
      case 'checking':
        return (
          <div className="flex flex-col items-center justify-center h-96">
            <p className="text-slate-500">Checking API Key status...</p>
          </div>
        );
      case 'needed':
        return (
          <div className="text-center flex flex-col items-center p-8">
            <div className="text-sky-500 mb-4">
              <RobotIcon />
            </div>
            <h2 className="text-3xl font-bold text-sky-700 mb-2">Welcome!</h2>
            <p className="text-lg text-slate-600 mb-6 max-w-md">
              To start your learning adventure, please select a Gemini API key.
            </p>
            <button
              onClick={handleSelectKey}
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-full text-xl transition-transform transform hover:scale-105"
            >
              Select API Key
            </button>
            <p className="text-xs text-slate-500 mt-4 max-w-sm">
                This project uses the Gemini API. For more information, see the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-sky-700">billing documentation</a>.
            </p>
          </div>
        );
      case 'ready':
        return (
          <>
            {gameState === GameState.Start && <StartScreen onStart={handleStart} />}
            {gameState === GameState.Learning && <LearningEngine topic={topic} onEndSession={handleEndSession} onApiKeyError={handleApiKeyError} />}
          </>
        );
    }
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
          {renderContent()}
        </main>
      </div>
    </div>
  );
}