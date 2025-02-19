'use server'
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

export async function secureFetch(url, options = {}) {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get('accessToken');
  let refreshToken = cookieStore.get('refreshToken');


  let headers = {};
  if (refreshToken?.value && !accessToken) {
    console.log("RENOVANDO TOKEN....")
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/auth/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        refreshToken: refreshToken.value
      })
    });
    const data = await response.json();
  
    headers = {
      ...options.headers,
      "Authorization": `Bearer ${data.accessToken}`,
      "Content-Type": "application/json",
    };
  } else {
    headers = {
      ...options.headers,
      "Authorization": `Bearer ${accessToken.value}`,
      "Content-Type": "application/json",
    };
  }


  const response = await fetch(url, {
    ...options,
    headers,
  });

  // if (!response.ok) {
  //   throw new Error(`Error in fetch: ${response.status}`);
  // }

  return await response.json();
}
