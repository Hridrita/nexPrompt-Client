import { serverFetch } from "../core/server";


export const getFeaturedPrompts = async () => {
  return serverFetch("/api/prompts/featured");
};