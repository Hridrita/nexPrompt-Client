'use server'
import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server"

export const addBookmark = async(bookmarkData) =>{
    await serverMutation('/api/bookmark', bookmarkData);
    return serverMutation(`/api/prompts/${bookmarkData.promptId}/bookmark`,{}, "PATCH");
}

export const removeBookmark = async (data) => {
    try {
        await serverMutation('/api/bookmark/remove', data, "DELETE");
        await serverMutation(`/api/prompts/${data.promptId}/bookmark/decrement`, {}, "PATCH");
        
        revalidatePath('/dashboard/user/saved-prompts');
        
        
        return { ok: true };
    } catch (error) {
        console.error("Error removing bookmark:", error);
        return { ok: false };
    }
}