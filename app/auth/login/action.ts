'use server'
import { cookies } from "next/headers";

function decodeJWT(token: string) {
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

export async function login(username: string, password: string) {
    try {
        const response = await fetch(`${process.env.API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const responseData = await response.json();
        if (responseData.status === 200) {
            const { accessToken, refreshToken } = responseData.data;
            const cookieStore = await cookies();

            const accessPayload = decodeJWT(accessToken);
            const refreshPayload = decodeJWT(refreshToken);

            const accessExpires = accessPayload?.exp
                ? new Date(accessPayload.exp * 1000)  // Convertir UNIX timestamp a Date
                : new Date(Date.now() + 15 * 60 * 1000); // Valor por defecto (15 min)

            const refreshExpires = refreshPayload?.exp
                ? new Date(refreshPayload.exp * 1000)
                : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días por defecto

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
        }

        return responseData;
    } catch (error: any) {
        return {
            status: 500,
            message: error.message || "Ocurrió un error al intentar iniciar sesión",
        };
    }
}