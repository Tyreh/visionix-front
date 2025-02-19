"use client"
import FormInput from "@/components/ui/form/form-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod"
import { forgotPassword } from "./action";
import { MailCheck } from "lucide-react";
import React from "react";
import Link from "next/link";

const formSchema = z.object({
  username: z.string({ required_error: "Este campo es obligatorio" }).min(1, "Este campo es obligatorio").max(25, "El usuario ingresado no es válido"),
});

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const response = await forgotPassword(values.username);
    if (response.status === 429) {
      setError(response.message);
      setSuccess(false);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <MailCheck className="h-24 w-24 text-green-500 mb-4" />
        <p className="text-sm mb-4 text-center">
          Hemos enviado un correo electrónico a la dirección asociada a tu cuenta con las instrucciones para recuperar el acceso.
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
        <h1 className='text-2xl font-semibold tracking-tight'>¿Olvidaste tu contraseña?</h1>
        <p className='text-sm text-muted-foreground'>
          Ingresa tu usuario y recupera el acceso a tu cuenta mediante el correo electrónico asociado
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-4'>
            <FormInput name="username" label="Usuario" control={form.control} props={{ disabled: loading, placeholder: "Nombre de usuario" }} />
            {error && <p className="text-sm mt-2 text-red-500">{error}</p>}
            <Button type="submit" loading={loading} className="mt-2">Restablecer Contraseña</Button>
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
