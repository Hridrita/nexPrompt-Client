import { getAuthToken } from "../authAction";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getAllReviewsByUser = async (email) => {
  const token = await getAuthToken();
  const res = await fetch(`${baseUrl}/api/reviews/user?email=${email}`,{
    headers: {
      authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) return [];
  return res.json();
};