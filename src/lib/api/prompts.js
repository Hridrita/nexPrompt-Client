import { getAuthToken } from "../authAction";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getPrompts = async (filters = {}) => {
  const {
    search = "",
    category = "",
    aiTool = "",
    difficulty = "",
    sort = "latest",
    page = 1,
    limit = 12,
  } = filters;

  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (category) params.set("category", category);
  if (aiTool) params.set("aiTool", aiTool);
  if (difficulty) params.set("difficulty", difficulty);
  if (sort) params.set("sort", sort);
  params.set("page", page);
  params.set("limit", limit);

  try {
    const res = await fetch(`${baseUrl}/api/prompts?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        prompts: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: limit,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }

    return res.json();
  } catch (error) {
    console.error("Fetch prompts error:", error);
    return {
      prompts: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: limit,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
};

export const getPromptsFromCreators = async() =>{
    const res = await fetch(`${baseUrl}/api/prompts`, {
        cache: 'no-store'
    });

    if(!res.ok) return null;
    return res.json();
}

export const getPromptsByCreators = async(userId) =>{
  const token = await getAuthToken();
    const res = await fetch(`${baseUrl}/api/prompts/creator/${userId}`,{
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    if(!res.ok) return null;
    return res.json();
}

// export const getPromptById = async(id) =>{
//   const token = await getAuthToken();
//   console.log('token', token);

//     const res = await fetch(`${baseUrl}/api/prompts/${id}`,{
//         headers: {
//             authorization: `Bearer ${token}`
//         }
//     })
//     if(!res.ok) return null;
//     const data = await res.json();
//     // console.log("prompt data:", data);
//     return data;
// }





export const getPromptById = async (id) => {
  const token = await getAuthToken();

  try {
    const res = await fetch(`${baseUrl}/api/prompts/${id}`, {
      headers: {
        authorization: `Bearer ${token}`
      },
      cache: 'no-store'
    });
    
   
    if (res.status === 403) {
      const errorData = await res.json();
      
      return {
        error: true,
        isLocked: true,
        status: 403,
        message: errorData.message || "Premium subscription required",
        visibility: "private",
        _id: id
      };
    }
    
    if (!res.ok) {
      return null;
    }
    
    const data = await res.json();
    return {
      ...data,
      isLocked: false
    };
  } catch (error) {
    console.error("Error fetching prompt:", error);
    return null;
  }
};