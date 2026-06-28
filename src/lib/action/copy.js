'use server'

import { serverMutation } from "../core/server"
import { getAuthToken } from "../authAction";

export const getCopyCount = async(data) =>{
    const token = await getAuthToken();
    return serverMutation(`/api/prompts/${data.promptId}/copy`, {}, "PATCH",{
        headers: {
            authorization: `Bearer ${token}`
        }
    });
    
}