const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getBookmarkedPromptByUser = async(userId) =>{
    const res = await fetch(`${baseUrl}/api/bookmark/user/${userId}`)
    if(!res.ok) return null;
    return res.json();
}