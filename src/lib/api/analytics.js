import { serverFetch } from "../core/server";

// Get analytics data
export const getAnalytics = async () => {
  try {
    const result = await serverFetch("/api/admin/analytics");
    console.log("Analytics Response:", result);
    
    
    if (!result) {
      return getDefaultAnalytics();
    }
    
    return result;
  } catch (error) {
    console.error("Analytics Error:", error);
    return getDefaultAnalytics();
  }
};

// Get analytics 
export const getAnalyticsOverTime = async (period = "weekly") => {
  return serverFetch(`/api/admin/analytics/over-time?period=${period}`);
};