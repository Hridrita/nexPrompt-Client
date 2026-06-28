import { getAuthToken } from "../authAction";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getBookmarkedPromptByUser = async(userId) =>{
    const token = await getAuthToken();
    const res = await fetch(`${baseUrl}/api/bookmark/user/${userId}`,{
        headers: {
            authorization: `Bearer ${token}`
        }
    })
    if(!res.ok) return null;
    return res.json();
}