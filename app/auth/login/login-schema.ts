import { z } from "zod";

export const loginSchema = () => {
    return z.object({
        username: z.string({ required_error: "Por favor, ingresa tu usuario" }).min(1, "Por favor, ingresa tu usuario").max(80, "El usuario ingresado no es válido"),
        password: z.string({ required_error: "Por favor, ingresa tu contraseña" }).min(1, "Por favor, ingresa tu contraseña").max(30, "La contraseña ingresada no es válida"),
    });
};
export type LoginSchema = z.infer<ReturnType<typeof loginSchema>>;