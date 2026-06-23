'use server'
import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server"

export const getCopyCount = async(data) =>{
    return serverMutation(`/api/prompts/${data.promptId}/copy`, {}, "PATCH");
    
}