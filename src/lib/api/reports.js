import { getAuthToken } from "../authAction";
import { serverFetch, serverMutation } from "../core/server";

// Get all reports with prompt and user details
export const getAllReports = async () => {
  const token = await getAuthToken();
  return serverFetch("/api/admin/reports",{
    headers: {
      authorization: `Bearer ${token}`
    }
  });
};

// Remove prompt 
export const removePromptAndReports = async (promptId) => {
  const token = await getAuthToken();
  return serverMutation(`/api/admin/reports/${promptId}/remove`, {}, "DELETE",{
    headers: {
      authorization: `Bearer ${token}`
    }
  });
};

// Warn creator
export const warnCreator = async (promptId, warningMessage) => {
  const token = await getAuthToken();
  return serverMutation(`/api/admin/reports/${promptId}/warn`, { warningMessage }, "PATCH",{
    headers: {
      authorization: `Bearer ${token}`
    }
  });
};

// Dismiss report (not harmful)
export const dismissReport = async (reportId) => {
  const token = await getAuthToken();
  return serverMutation(`/api/admin/reports/${reportId}/dismiss`, {}, "PATCH",{
    headers: {
      authorization: `Bearer ${token}`
    }
  });
};

// Get report stats
export const getReportStats = async () => {
  const token = await getAuthToken();
  return serverFetch("/api/admin/reports/stats",{
    headers: {
      authorization: `Bearer ${token}`
    }
  });
};