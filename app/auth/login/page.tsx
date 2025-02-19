import { LoginForm } from "@/app/auth/login/login-form"
import Link from "next/link"
import React from "react"

export default function LoginPage() {
  return (
    <React.Fragment>
      <div className='flex flex-col space-y-2 text-left pb-4'>
        <h1 className='text-2xl font-semibold tracking-tight'>Login</h1>
        <p className='text-sm text-muted-foreground'>
          Ingresa tus credenciales para acceder a tu cuenta
        </p>
      </div>
      <LoginForm />
      <p className='px-8 text-center text-sm text-muted-foreground pt-4'>
        <Link href='/auth/forgotPassword' className='underline underline-offset-4 hover:text-primary'>
          ¿Olvidaste tu contraseña?
        </Link>
      </p>
    </React.Fragment>
  )
}
