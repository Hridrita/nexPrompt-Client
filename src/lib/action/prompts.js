'use server'

import { serverMutation } from "../core/server"

export const createPrompt = async(newPromptData) =>{
    return serverMutation('/api/prompts',newPromptData);
}