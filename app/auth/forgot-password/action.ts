'use server'

export async function forgotPassword(username: string) {
    try {
        const response = await fetch(`${process.env.API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        });

        if (response.status === 429) {
            const data = await response.json();
            return {
                status: response.status,
                message: data.message
            }
        } else {
            return {
                status: response.status
            };
        }
    } catch (error: any) {
        return {
            status: 500,
            message: error.message || "Ocurrió un error inesperado",
        };
    }
}