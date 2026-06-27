'use server'
import { auth } from "./auth";
import { headers } from "next/headers";

export const getAuthToken = async () => {
  const { token } = await auth.api.getToken({
    headers: await headers()
  });
//   console.log('token', token);
  return token;
}