'use server'

export async function validateToken(recoveryToken: string) {
    const response = await fetch(`${process.env.API_URL}/auth/validateRecoveryToken`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: recoveryToken }),
        cache: "no-store"
    });
    const data = await response.json();
    return data;
}

export async function resetPassword(rawPassword: string, recoveryToken: string) {
    try {
        const response = await fetch(`${process.env.API_URL}/auth/resetPassword`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rawPassword, recoveryToken }),
        });

        const data = await response.json();
        return data;
    } catch (error: any) {
        return {
            status: 500,
            message: error.message || "Ocurrió un error al intentar iniciar sesión",
        };
    }
}