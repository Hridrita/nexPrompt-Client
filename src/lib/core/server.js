const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const serverFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;

  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

export const serverMutation = async (path, data, method="POST") => {
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Something went wrong!");
    }

    return await res.json();
  } catch (error) {
    console.error("Mutation Error:", error.message);
    throw error;
  }
};
