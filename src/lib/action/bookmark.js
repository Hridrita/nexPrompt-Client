'use server'
import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server"
import { getAuthToken } from "../authAction";

export const addBookmark = async(bookmarkData) =>{
    const token = await getAuthToken();
    await serverMutation('/api/bookmark', bookmarkData,"POST",{
        headers: {
            authorization: `Bearer ${token}`
        }
    });
    return serverMutation(`/api/prompts/${bookmarkData.promptId}/bookmark`,{}, "PATCH",{
        headers: {
            authorization: `Bearer ${token}`
        }
    });
}

export const removeBookmark = async (data) => {
    const token = await getAuthToken();
    try {
        await serverMutation('/api/bookmark/remove', data, "DELETE",{
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        await serverMutation(`/api/prompts/${data.promptId}/bookmark/decrement`, {}, "PATCH",{
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        
        revalidatePath('/dashboard/user/saved-prompts');
        
        
        return { ok: true };
    } catch (error) {
        console.error("Error removing bookmark:", error);
        return { ok: false };
    }
}

