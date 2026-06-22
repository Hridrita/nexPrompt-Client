'use server'
import { serverMutation } from "../core/server"

export const addBookmark = async(bookmarkData) =>{
    await serverMutation('/api/bookmark', bookmarkData);
    return serverMutation(`/api/prompts/${bookmarkData.promptId}/bookmark`,{}, "PATCH");
}

export const removeBookmark = async(data) =>{
    await serverMutation('/api/bookmark/remove', data, "DELETE");
    return serverMutation(`/api/prompts/${data.promptId}/bookmark/decrement`,{},"PATCH");
}