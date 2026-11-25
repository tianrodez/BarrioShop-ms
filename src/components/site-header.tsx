import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex min-h-14 w-full max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2">
        <Link
          href="/"
          className="font-heading text-xl font-bold tracking-tight text-primary"
        >
          BarrioShop
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-2">
          <Link
            href="/directorio"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Directorio
          </Link>
          <Link
            href="/login"
            className={buttonVariants({ className: "rounded-full px-5" })}
          >
            Ingresar
          </Link>
        </nav>
      </div>
    </header>
  );
}
