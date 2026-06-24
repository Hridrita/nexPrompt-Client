const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getAllReviewsByUser = async (email) => {
  const res = await fetch(`${baseUrl}/api/reviews/user?email=${email}`);
  if (!res.ok) return [];
  return res.json();
};