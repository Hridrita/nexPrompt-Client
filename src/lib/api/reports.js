import { serverFetch, serverMutation } from "../core/server";

// Get all reports with prompt and user details
export const getAllReports = async () => {
  return serverFetch("/api/admin/reports");
};

// Remove prompt 
export const removePromptAndReports = async (promptId) => {
  return serverMutation(`/api/admin/reports/${promptId}/remove`, {}, "DELETE");
};

// Warn creator
export const warnCreator = async (promptId, warningMessage) => {
  return serverMutation(`/api/admin/reports/${promptId}/warn`, { warningMessage }, "PATCH");
};

// Dismiss report (not harmful)
export const dismissReport = async (reportId) => {
  return serverMutation(`/api/admin/reports/${reportId}/dismiss`, {}, "PATCH");
};

// Get report stats
export const getReportStats = async () => {
  return serverFetch("/api/admin/reports/stats");
};