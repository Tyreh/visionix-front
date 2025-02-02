import { cookies } from 'next/headers'

function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export async function POST(req) {
  const cookieStore = cookies();
  const currentRefreshToken = cookieStore.get('refreshToken')?.value;

  if (!currentRefreshToken) {
    return Response.json({ error: "No refresh token" }, { status: 401 });
  }

  const refreshTokensResponse = await fetch(`${process.env.API_URL}/auth/refresh-token`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${currentRefreshToken}`,
      "Content-Type": "application/json"
    }
  });

  if (!refreshTokensResponse.ok) {
    return Response.json({ error: "Failed to refresh token" }, { status: 401 });
  }

  const data = await refreshTokensResponse.json();
  const { accessToken, refreshToken } = data;

  const accessPayload = decodeJWT(accessToken);
  const refreshPayload = decodeJWT(refreshToken);

  const accessExpires = accessPayload?.exp
    ? new Date(accessPayload.exp * 1000)
    : new Date(Date.now() + 15 * 60 * 1000);

  const refreshExpires = refreshPayload?.exp
    ? new Date(refreshPayload.exp * 1000)
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  cookieStore.set({
    name: 'accessToken',
    value: accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: accessExpires
  });

  cookieStore.set({
    name: 'refreshToken',
    value: refreshToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: refreshExpires
  });

  return Response.json({ accessToken, refreshToken });
}
