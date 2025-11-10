export enum GameState {
  Start = 'START',
  Learning = 'LEARNING',
  Finished = 'FINISHED',
}

export enum RobotState {
  Idle = 'IDLE',
  Thinking = 'THINKING',
  Happy = 'HAPPY',
  Sad = 'SAD',
  Celebrating = 'CELEBRATING',
}

export enum DifficultyLevel {
  Easy = 'EASY',
  Medium = 'MEDIUM',
  Hard = 'HARD',
}

export enum ActivityType {
  StoryQuestion = 'STORY_QUESTION',
  FillInTheBlank = 'FILL_IN_THE_BLANK',
}

export interface LearningActivity {
  activityType: ActivityType;
  story?: string;
  question?: string;
  sentence?: string; // e.g., "A lion is a big __."
  options: string[];
  correctAnswer: string;
}


export interface PreviousAttempt {
  promptText: string;
  userAnswer: string;
  correctAnswer: string;
}

export enum AnswerStatus {
    Unanswered = 'UNANSWERED',
    Correct = 'CORRECT',
    Incorrect = 'INCORRECT'
}