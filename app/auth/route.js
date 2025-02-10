import { cookies } from "next/headers";

function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1]; // Extraer el payload
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload); // Retorna el payload del token
  } catch (error) {
    return null;
  }
}

export async function POST(request) {
  const cookieStore = cookies();

  const { refreshToken } = await request.json();

  if (!refreshToken) {
    return new Response(JSON.stringify({ error: "No refresh token" }), { status: 401 });
  }

  const response = await fetch(`${process.env.API_URL}/auth/refresh-token`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${refreshToken}`,
      "Content-Type": "application/json"
    }
  });

  if (response.status !== 200) {
    return new Response(JSON.stringify({ error: "Invalid refresh token" }), { status: 401 });
  }

  const responseData = await response.json();
  const data = responseData.data;

  const accessPayload = decodeJWT(data.accessToken);
  const refreshPayload = decodeJWT(data.refreshToken);

  // Convertimos los tiempos de expiración
  const accessMaxAge = accessPayload?.exp
    ? accessPayload.exp - Math.floor(Date.now() / 1000) // Segundos restantes
    : 15 * 60; // 15 minutos por defecto

  const refreshMaxAge = refreshPayload?.exp
    ? refreshPayload.exp - Math.floor(Date.now() / 1000)
    : 7 * 24 * 60 * 60; // 7 días

  // Configurar cookies en la respuesta
  const headers = new Headers();
  headers.append("Set-Cookie", `accessToken=${data.accessToken}; HttpOnly; Path=/; Max-Age=${accessMaxAge}; Secure=${process.env.NODE_ENV === "production"}; SameSite=Strict`);
  headers.append("Set-Cookie", `refreshToken=${data.refreshToken}; HttpOnly; Path=/; Max-Age=${refreshMaxAge}; Secure=${process.env.NODE_ENV === "production"}; SameSite=Strict`);
  headers.append("Set-Cookie", `test=hola;`);
//   document.cookie = 'test2=hola;'

  return new Response(JSON.stringify(data), { status: 200, headers });
}
