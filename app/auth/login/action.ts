'use server'
import { cookies } from "next/headers";

export async function login(username: string, password: string) {
    try {
        const response = await fetch(`${process.env.API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            const { access_token, refresh_token } = data;
            const cookieStore = await cookies();
            cookieStore.set({
                name: 'accessToken',
                value: access_token,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            });

            cookieStore.set({
                name: 'refreshToken',
                value: refresh_token,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            });
        }

        return {
            status: response.status,
            message: data.message
        };

    } catch (error: any) {
        return {
            status: 500,
            message: error.message || "Ocurrió un error al intentar iniciar sesión",
        };
    }
}