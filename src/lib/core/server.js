import { getToken } from "./session";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const authHeader = async() =>{
  const token = await getToken();
  console.log("cookies:", h.get("cookie"));
  const header = token ?  {
    authorization: `Bearer ${token}`
  } : {};

  return header;
}

export const serverFetch = async (path, options = {}) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      // ...await authHeader(),
      ...options.headers,
    };

    const res = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`API Error (${res.status}):`, errorText);
      return null;
    }

    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("Server Fetch Error:", error);
    return null;
  }
};

export const serverMutation = async (path, data, method = "POST", options = {}) => {
  try {
    // console.log(`API Call: ${method} ${baseUrl}${path}`);
    // console.log(` Payload:`, data);

    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(data),
    });

    //Response text 
    const responseText = await res.text();
    console.log(`Response:`, responseText);

    //JSON parse
    let jsonData;
    try {
      jsonData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      throw new Error(`Server returned non-JSON response: ${responseText.substring(0, 100)}`);
    }

    if (!res.ok) {
      throw new Error(jsonData.error || jsonData.message || "Something went wrong!");
    }

    return jsonData;
  } catch (error) {
    console.error("Mutation Error:", error.message);
    throw error;
  }
};