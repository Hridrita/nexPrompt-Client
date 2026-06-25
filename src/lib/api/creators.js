import { serverFetch } from "../core/server";


export const getTopCreators = async (limit = 4) => {
  return serverFetch(`/api/creators/top?limit=${limit}`);
};