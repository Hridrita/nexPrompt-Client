import { serverFetch } from "../core/server";

// Get all reviews
export const getAllReviews = async () => {
  return serverFetch("/api/reviews/all");
};

// Get review stats
export const getReviewStats = async () => {
  return serverFetch("/api/reviews/stats");
};