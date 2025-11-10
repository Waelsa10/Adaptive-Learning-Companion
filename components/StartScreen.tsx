
import React, { useState } from 'react';
import { RobotIcon } from './icons';

interface StartScreenProps {
  onStart: (topic: string) => void;
}

const topics = ["Animals", "Space", "Oceans", "Dinosaurs", "History", "Science", "Art"];

export default function StartScreen({ onStart }: StartScreenProps) {
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);

  return (
    <div className="text-center flex flex-col items-center">
      <div className="text-sky-500 mb-4">
        <RobotIcon />
      </div>
      <h2 className="text-3xl font-bold text-sky-700 mb-2">Welcome, Explorer!</h2>
      <p className="text-lg text-slate-600 mb-8 max-w-md">
        Ready for a learning adventure? Pick a topic and let's get started!
      </p>
      
      <div className="mb-8">
        <label htmlFor="topic-select" className="block text-sm font-bold text-slate-500 mb-2">CHOOSE YOUR ADVENTURE</label>
        <div className="relative">
          <select
            id="topic-select"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="appearance-none w-64 bg-white border-2 border-sky-300 text-sky-700 font-bold py-3 px-4 pr-8 rounded-full focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-lg"
          >
            {topics.map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-sky-700">
            <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      <button
        onClick={() => onStart(selectedTopic)}
        className="bg-green-500 hover:bg-green-600 text-white font-black py-4 px-10 rounded-full text-2xl transition-transform transform hover:scale-105 shadow-lg"
      >
        Let's Go!
      </button>
    </div>
  );
}