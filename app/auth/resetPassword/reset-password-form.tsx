"use client"
import FormPasswordInput from "@/components/ui/form/form-password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { resetPassword } from "./action";
import { z } from "zod"
import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(30, "La contraseña no debe tener más de 30 caracteres")
      .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
      .regex(/[0-9]/, "La contraseña debe contener al menos un número"),

    passwordConfirm: z.string()
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirm"],
  });


export default function ResetPasswordPage({ token }: { token: string }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  })


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const response = await resetPassword(values.password, token);
    if (response.status === 200) {
      setSuccess(true);
    } else {
      setError(response.message);
      setSuccess(false);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <ShieldCheck className="h-24 w-24 text-primary mb-4" />
        <p className="text-sm mb-4 text-center">
          Tu contraseña ha sido actualizada con éxito. Para mantener la seguridad de tu cuenta, te recomendamos cambiarla periódicamente.
        </p>
        <Button onClick={() => router.push('/auth/login')} className="mt-2 w-full">
          Volver al inicio de sesión
        </Button>
      </div>
    );
  }


  return (
    <React.Fragment>
      <div className='flex flex-col space-y-2 text-left pb-4'>
        <h1 className='text-2xl font-semibold tracking-tight'>Restablece tu contraseña</h1>
        <p className='text-sm text-muted-foreground'>
          Ingresa una nueva contraseña para restablecer el acceso a tu cuenta
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-4'>
            <FormPasswordInput name="password" label="Contraseña" control={form.control} props={{ disabled: loading, placeholder: "*********" }} />
            <FormPasswordInput name="passwordConfirm" label="Confirmar contraseña" control={form.control} props={{ disabled: loading, placeholder: "*********" }} />
            {error && <p className="text-sm mt-2 text-red-500">{error}</p>}
            <Button type="submit" loading={loading} className="mt-2">Cambiar Contraseña</Button>
          </div>
        </form>
      </Form>
      <p className='px-8 text-center text-sm text-muted-foreground pt-4'>
        <Link href='/auth/login' className='underline underline-offset-4 hover:text-primary'>
          Volver al inicio de sesión
        </Link>
      </p>
    </React.Fragment>
  );
}
