import { serverFetch } from "../core/server";


export const getAllSubscriptions = async () => {
  return serverFetch("/api/admin/subscriptions");
};


export const getSubscriptionStats = async () => {
  return serverFetch("/api/admin/subscriptions/stats");
};