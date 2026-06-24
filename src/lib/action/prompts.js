'use server'

import { serverMutation } from "../core/server"

export const createPrompt = async(newPromptData) =>{
     try {
    const result = await serverMutation('/api/prompts', newPromptData);
    return result;
  } catch (error) {
    console.error("Create Prompt Error:", error);
    return { 
      error: error.message || "Failed to create prompt",
      insertedId: null 
    };
  }
}