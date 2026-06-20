const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getPrompts = async() =>{
    const res = await fetch(`${baseUrl}/api/prompts`, {
        cache: 'no-store'
    });

    if(!res.ok) return null;
    return res.json();
}