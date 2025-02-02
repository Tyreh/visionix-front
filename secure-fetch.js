'use server'
import { cookies } from 'next/headers'
export async function secureFetch(url, options = {}) {
  const cookieStore = await cookies();
  let currentAccessToken = cookieStore.get('accessToken');
  let currentRefreshToken = cookieStore.get('refreshToken');

  if (!currentAccessToken) {
    const refreshTokensResponse = await fetch(`${process.env.API_URl}/auth/refresh-token`, {
      "method": "POST",
      "Authorization": `Bearer ${currentRefreshToken.value}`
    })

    const data = await refreshTokensResponse.json();
    const { accessToken, refreshToken } = data;

    const accessPayload = decodeJWT(accessToken);
    const refreshPayload = decodeJWT(refreshToken);

    cookieStore.set({
      name: 'accessToken',
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: accessPayload
    })

    cookieStore.set({
      name: 'refreshToken',
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: refreshPayload
    })

    currentAccessToken = cookieStore.get('accessToken');
  }


  // if (!token.value) throw new Error(`Error: Auth token value is not defined!`);

  const headers = {
    ...options.headers,
    "Authorization": `Bearer ${currentAccessToken.value}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();
  return data;
}