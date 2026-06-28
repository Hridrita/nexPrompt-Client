'use server'

import { getAuthToken } from "../authAction";
import { serverMutation } from "../core/server"

export const createPrompt = async(newPromptData) =>{
  const token = await getAuthToken();
  console.log("TOKEN:", token);
     try {
    const result = await serverMutation('/api/prompts', newPromptData,"POST",{
      headers: {
        authorization: `Bearer ${token}`
      }
    });
    return result;
  } catch (error) {
    console.error("Create Prompt Error:", error);
    return { 
      error: error.message || "Failed to create prompt",
      insertedId: null 
    };
  }
}