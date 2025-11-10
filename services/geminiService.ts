
import { GoogleGenAI, Type } from "@google/genai";
import { LearningActivity, PreviousAttempt, DifficultyLevel, ActivityType } from '../types';

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        activityType: {
            type: Type.STRING,
            enum: ['STORY_QUESTION', 'FILL_IN_THE_BLANK'],
            description: "The type of learning activity."
        },
        story: {
            type: Type.STRING,
            description: "A short story snippet. ONLY for 'STORY_QUESTION' type."
        },
        question: {
            type: Type.STRING,
            description: "A multiple-choice question. ONLY for 'STORY_QUESTION' type."
        },
        sentence: {
            type: Type.STRING,
            description: "A sentence with a blank represented by '__'. ONLY for 'FILL_IN_THE_BLANK' type."
        },
        options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of 4 possible answers."
        },
        correctAnswer: {
            type: Type.STRING,
            description: "The correct answer from the options array."
        },
    },
    required: ["activityType", "options", "correctAnswer"],
};

function createPrompt(topic: string, difficulty: DifficultyLevel, previousAttempt?: PreviousAttempt | null) {
  const baseIntro = `You are an AI creating content for an adaptive learning app for a 6-year-old. The current topic is '${topic}'. 
  
You can generate one of two types of learning activities:
1. 'STORY_QUESTION': A short story snippet followed by a multiple-choice question about it. For this type, you MUST provide the 'story' and 'question' fields.
2. 'FILL_IN_THE_BLANK': A sentence with a blank space ('__') for the child to fill in. For this type, you MUST provide the 'sentence' field.

Randomly choose one of the activity types. The activity difficulty should be ${difficulty}.
Return the response in the specified JSON format. ONLY include fields relevant to the chosen activityType.`;
  
  if (previousAttempt) {
    return `${baseIntro}

The child just answered the following question incorrectly:
Previous Prompt: "${previousAttempt.promptText}"
Their Answer: "${previousAttempt.userAnswer}"
Correct Answer: "${previousAttempt.correctAnswer}"

Generate a new, simpler learning activity to help them understand the concept better. The new activity should be easier. Return the JSON.`;
  }

  return `${baseIntro} Generate a learning activity. Return the JSON.`;
}

export async function generateLearningActivity(topic: string, difficulty: DifficultyLevel, previousAttempt?: PreviousAttempt | null): Promise<LearningActivity> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const prompt = createPrompt(topic, difficulty, previousAttempt);
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.8,
        },
    });

    const text = response.text.trim();
    if (!text) {
        throw new Error("API returned an empty response.");
    }
    const parsed = JSON.parse(text);
    return parsed as LearningActivity;
  } catch (error) {
    console.error("Error generating learning activity:", error);

    // Per guidelines, check for specific API key error and re-throw
    if (error instanceof Error && error.message.includes("Requested entity was not found.")) {
        throw error; // Re-throw to be caught by the UI layer
    }
    
    // Fallback to a simple activity in case of API error
    return {
        activityType: ActivityType.StoryQuestion,
        story: "Oh no! Sparky seems to have lost his signal. Let's try a default question.",
        question: "What color is the sky on a sunny day?",
        options: ["Blue", "Green", "Red", "Purple"],
        correctAnswer: "Blue"
    };
  }
}
