'use server'
import { getAuthToken } from "../authAction";
import { serverMutation } from "../core/server"

export const submitReport = async (data) => {
  const token = await getAuthToken();
  return serverMutation('/api/reports', data, "POST",{
    headers: {
      authorization: `Bearer ${token}`
    }
  });
}