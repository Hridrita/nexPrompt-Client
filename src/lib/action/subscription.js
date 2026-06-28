'use server'

import { getAuthToken } from "../authAction";
import { serverMutation } from "../core/server";


export const addSubscription = async (data) => {
  const token = await getAuthToken();
  return await serverMutation('/api/subscription', data, "POST", {
    headers: {
      'x-internal-secret': process.env.INTERNAL_SECRET
    }
  });
};