import { getAuthToken } from "../authAction";
import { serverFetch } from "../core/server";

// Get analytics data
export const getAnalytics = async () => {
  const token = await getAuthToken();
  try {
    const result = await serverFetch("/api/admin/analytics",{
      headers: {
        authorization: `Bearer ${token}`
      }
    });
    // console.log("Analytics Response:", result);
    
    
    if (!result) {
      return getDefaultAnalytics();
    }
    
    return result;
  } catch (error) {
    // console.error("Analytics Error:", error);
    return getDefaultAnalytics();
  }
};

// Get analytics 
export const getAnalyticsOverTime = async (period = "weekly") => {
  const token = await getAuthToken();
  return serverFetch(`/api/admin/analytics/over-time?period=${period}`,{
    headers: {
      authorization: `Bearer ${token}`
    }
  });
};