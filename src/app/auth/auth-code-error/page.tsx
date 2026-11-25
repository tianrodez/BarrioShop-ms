import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "No pudimos confirmar tu cuenta - BarrioShop",
};

/**
 * HU01 CA4: the confirmation link may be expired or already used. Say what
 * happened and send the user back to sign in instead of a blank screen.
 */
export default function AuthCodeErrorPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-4 px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">
        No pudimos confirmar tu cuenta
      </h1>
      <p className="text-muted-foreground">
        El enlace ya se usó o venció. Inicia sesión con tu correo y contraseña;
        si la cuenta sigue sin confirmar, pide un correo nuevo desde el
        registro.
      </p>
      <Link href="/login" className={buttonVariants({ className: "w-fit" })}>
        Ir a ingresar
      </Link>
    </main>
  );
}
