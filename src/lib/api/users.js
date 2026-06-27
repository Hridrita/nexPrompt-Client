import { getAuthToken } from "../authAction";
import { serverFetch, serverMutation } from "../core/server";


export const getAllUsers = async () => {
  const token = await getAuthToken();
  return serverFetch("/api/admin/users",{
    headers: {
      authorization: `Bearer ${token}`
    }
  });
};


export const updateUserRole = async (userId, role) => {
  const token = await getAuthToken();
  return serverMutation(`/api/admin/users/${userId}/role`, { role }, "PATCH",{
    headers: {
      authorization: `Bearer ${token}`
    }
  });
};


export const deleteUser = async (userId) => {
  const token = await getAuthToken();
  return serverMutation(`/api/admin/users/${userId}`, {}, "DELETE",{
     headers: {
      authorization: `Bearer ${token}`
    }
  });
};


export const getUserStats = async () => {
  const token = await getAuthToken();
  return serverFetch("/api/admin/users/stats",{
     headers: {
      authorization: `Bearer ${token}`
    }
  });
};