'use server'
import { cookies } from 'next/headers'
export async function secureFetch(url, options = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken');
  if (!token.value) throw new Error(`Error: Auth token value is not defined!`);

  const headers = {
    ...options.headers,
    "Authorization": `Bearer ${token.value}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });


  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Error ${error.status}: ${error.message}`);
  }

  return response.json();
}