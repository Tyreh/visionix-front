"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { login } from "./action";
import { redirect } from "next/navigation";

export function LoginForm({ className, ...props }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);

    setIsLoading(true);
    const response = await login({
      username: data.get("username"),
      password: data.get("password"),
    });

    if (response?.status === 200) {
      redirect("/");
    } else {
      const fieldErrors = response.errors?.reduce((acc, error) => {
        acc[error.field] = error.message;
        return acc;
      }, {});
      setErrors(fieldErrors || {});
    }
    setIsLoading(false);
  };

  return (
    <form className={`flex flex-col gap-6 ${className}`} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Inicio de Sesión</h1>
        <p className="text-sm text-muted-foreground">
          Ingresa tus credenciales para acceder a tu cuenta
        </p>
      </div>
      <div className="grid gap-6">
        {/* Campo Usuario */}
        <div className="grid gap-2">
          <Label htmlFor="username">Usuario</Label>
          <Input id="username" name="username" placeholder="Usuario" required />
          {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
        </div>
        
        {/* Campo Contraseña */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <Link href="/auth/forgot-password" className="text-sm underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input id="password" name="password" type="password" placeholder="********" required />
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>

        {/* Botón de envío */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Cargando..." : "Iniciar Sesión"}
        </Button>
      </div>
    </form>
  );
}
