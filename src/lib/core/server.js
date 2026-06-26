const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const serverFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;

  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

export const serverMutation = async (path, data, method = "POST") => {
  try {
    // console.log(`API Call: ${method} ${baseUrl}${path}`);
    // console.log(` Payload:`, data);

    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    //Response text 
    const responseText = await res.text();
    console.log(`📨 Response:`, responseText);

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