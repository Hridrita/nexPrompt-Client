const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getPromptsFromCreators = async() =>{
    const res = await fetch(`${baseUrl}/api/prompts`, {
        cache: 'no-store'
    });

    if(!res.ok) return null;
    return res.json();
}

export const getPromptsByCreators = async(userId) =>{
    const res = await fetch(`${baseUrl}/api/prompts/${userId}`)
    if(!res.ok) return null;
    return res.json();
}