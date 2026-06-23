'use server'

import { serverMutation } from "../core/server";


export const addSubscription = async (data) => {
  return await serverMutation('/api/subscription', data, "POST");
};