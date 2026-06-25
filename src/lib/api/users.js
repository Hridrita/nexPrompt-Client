import { serverFetch, serverMutation } from "../core/server";


export const getAllUsers = async () => {
  return serverFetch("/api/admin/users");
};


export const updateUserRole = async (userId, role) => {
  return serverMutation(`/api/admin/users/${userId}/role`, { role }, "PATCH");
};


export const deleteUser = async (userId) => {
  return serverMutation(`/api/admin/users/${userId}`, {}, "DELETE");
};


export const getUserStats = async () => {
  return serverFetch("/api/admin/users/stats");
};