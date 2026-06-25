import { serverFetch } from "../core/server";

// Get creator dashboard stats
export const getCreatorStats = async (creatorId) => {
  return serverFetch(`/api/creator/stats/${creatorId}`);
};

// Get creator chart data
export const getCreatorCharts = async (creatorId, period = "weekly") => {
  return serverFetch(`/api/creator/charts/${creatorId}?period=${period}`);
};