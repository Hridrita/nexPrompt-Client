'use server'
import { serverMutation } from "../core/server";

export const updateUserPlan = async (data) => {
  return await serverMutation('/api/users/plan', data, "PATCH");
};