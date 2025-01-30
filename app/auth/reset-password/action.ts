'use server'
import { cookies } from "next/headers";

export async function validateToken(recoveryToken: string) {
    const response = await fetch(`${process.env.API_URL}/auth/validate-recovery-token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: recoveryToken }),
    });

    return response.ok;
}

export async function login(rawPassword: string, recoveryToken: string) {
    try {
        const response = await fetch(`${process.env.API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rawPassword, recoveryToken }),
        });

        const data = await response.json();
        if (response.ok) {
            const { access_token, refresh_token } = data;
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