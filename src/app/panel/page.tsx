import { Suspense } from "react";
import type { Metadata } from "next";
import { requirePanelUser } from "@/lib/auth";
import { roleLabel } from "@/lib/auth-roles";
import {
  StoreForm,
  type StoreEditorRecord,
} from "@/components/stores/store-form";
import { StoreVisibilityControl } from "@/components/stores/store-visibility-control";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  parseStorePoint,
  type StoreStatus,
  type VerificationDocumentType,
} from "@/lib/store-form-model";
import Link from "next/link";

type StoreRow = {
  id: string;
  name: string;
  store_type: string;
  address: string;
  barrio: string;
  upz: string | null;
  reference_place: string | null;
  whatsapp: string;
  opening_hours: string;
  location: unknown;
  photo_url: string | null;
  status: StoreStatus;
  rejection_note: string | null;
};

export const metadata: Metadata = {
  title: "Mi panel - BarrioShop",
};

export default function PanelPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <Suspense
        fallback={<p className="text-muted-foreground">Entrando al panel...</p>}
      >
        <PanelBody />
      </Suspense>
    </main>
  );
}

async function PanelBody() {
  const user = await requirePanelUser();

  const supabase = await createSupabaseServerClient();
  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select(
      "id, name, store_type, address, barrio, upz, reference_place, whatsapp, opening_hours, location, photo_url, status, rejection_note",
    )
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle<StoreRow>();

  if (storeError) {
    return <p role="alert">No pudimos cargar el perfil de tu tienda.</p>;
  }

  if (!store) {
    return (
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Hola, {user.fullName ?? user.email}
          </h1>
          <p className="text-muted-foreground">
            Registra el perfil de tu tienda.
          </p>
        </div>
        <StoreForm ownerId={user.id} />
      </section>
    );
  }

  const { data: documents, error: documentsError } = await supabase
    .from("store_verifications")
    .select("doc_type")
    .eq("store_id", store.id);

  if (documentsError) {
    return <p role="alert">No pudimos cargar los soportes de verificación.</p>;
  }

  const point = parseStorePoint(store.location);
  const editorStore: StoreEditorRecord = {
    id: store.id,
    name: store.name,
    storeType: store.store_type,
    address: store.address,
    barrio: store.barrio,
    upz: store.upz ?? "",
    referencePlace: store.reference_place ?? "",
    whatsapp: store.whatsapp,
    openingHours: store.opening_hours,
    point,
    photoUrl: store.photo_url,
    status: store.status,
  };
  const verificationDocuments = (documents ?? []).map(
    (document) => document.doc_type as VerificationDocumentType,
  );

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Hola, {user.fullName ?? user.email}
          </h1>
          <p className="text-muted-foreground">
            Perfil de la tienda · {roleLabel(user.role)}
          </p>
        </div>
        <StoreVisibilityControl storeId={store.id} status={store.status} />
        <Link
          href="/panel/productos"
          className="w-fit text-sm font-medium text-primary underline"
        >
          Gestionar catálogo
        </Link>
      </div>
      {store.rejection_note ? (
        <p
          role="alert"
          className="break-words rounded-md border border-destructive/40 p-3 text-sm"
        >
          Revisa estos cambios solicitados: {store.rejection_note}
        </p>
      ) : null}
      <StoreForm
        ownerId={user.id}
        initialStore={editorStore}
        verificationDocuments={verificationDocuments}
      />
      <Link
        href="/directorio"
        className="text-sm text-muted-foreground underline"
      >
        Volver al directorio
      </Link>
    </section>
  );
}
