'use server'
import { getAuthToken } from "../authAction";
import { serverMutation } from "../core/server";

export const updateUserPlan = async (data) => {
  const token = await getAuthToken();
  return await serverMutation('/api/users/plan', data, "PATCH",{
    headers: {
      authorization: `Bearer ${token}`
    }
  });
};