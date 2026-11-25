import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BarrioShop - las tiendas de tu barrio",
  description: "Descubre las tiendas y los productos de tu barrio.",
};

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-16">
      <h1 className="font-heading text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-5xl">
        Las tiendas de tu barrio,{" "}
        <span className="text-primary">a un mensaje.</span>
      </h1>
      <p className="max-w-md text-lg text-muted-foreground">
        Mira los productos y precios del dia de las tiendas de tu barrio.
      </p>
    </main>
  );
}
