'use server'
import { serverMutation } from "../core/server"

export const submitReport = async (data) => {
  return serverMutation('/api/reports', data, "POST");
}