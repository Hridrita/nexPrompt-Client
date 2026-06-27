import { getAuthToken } from "../authAction";
import { serverFetch } from "../core/server";


export const getAllSubscriptions = async () => {
  const token = await getAuthToken();
  return serverFetch("/api/admin/subscriptions",{
    headers: {
      authorization: `Bearer ${token}`
    }
  });
};


export const getSubscriptionStats = async () => {
  const token = await getAuthToken();
  return serverFetch("/api/admin/subscriptions/stats",{
    headers: {
      authorization: `Bearer ${token}`
    }
  });
};