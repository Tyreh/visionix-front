'use server'
import { cookies } from "next/headers";
import { LoginSchema } from "../login/login-schema";

function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
    }
}

export async function login(formData: LoginSchema) {
    const response = await fetch(`${process.env.API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, password: formData.password }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message);
    }

    const { access_token, refresh_token } = data;


    try {
        const response = await fetch(`${process.env.API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: formData.username,
                password: formData.password,
            }),
        }).catch(() => {
            throw new Error("Could not establish a connection to the API!");
        });

        if (response.ok) {
            const data = await response.json();
            const { token } = data;
            const decodedToken = parseJwt(token);

            if (decodedToken && decodedToken.exp) {
                const cookieStore = await cookies();
                const maxAge = decodedToken.exp - Math.floor(Date.now() / 1000); // Tiempo en segundos hasta la expiración

                cookieStore.set({
                    name: 'token',
                    value: token,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge, // Expiración en segundos
                });
            }
        }

        return {
            status: response.status,
            message: response.status === 403 ? "Las credenciales ingresadas son incorrectas" : `Error (${response.status})`,
        };
    } catch (error) {
        console.error(error);
        return { status: 500, message: 'Hubo un error' };
    }
}