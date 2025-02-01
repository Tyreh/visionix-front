'use server'

export async function validateToken(recoveryToken: string) {
    const response = await fetch(`${process.env.API_URL}/auth/validate-recovery-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: recoveryToken }),
        cache: "no-store"
    });

    if (response.ok) {
        return {
            status: response.status
        }
    }

    const data = await response.json();
    return {
        status: response.status,
        message: data.message
    }
}

export async function resetPassword(rawPassword: string, recoveryToken: string) {
    try {
        const response = await fetch(`${process.env.API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rawPassword, recoveryToken }),
        });

        if (response.ok) {
            return {
                status: 200,
                message: response.text()
            }
        }

        const data = await response.json();
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