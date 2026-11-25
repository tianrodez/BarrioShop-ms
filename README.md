# BarrioShop

Directorio digital de tiendas de barrio del barrio Kennedy (Bogotá). Permite a
los comerciantes publicar su tienda y su catálogo, y a los vecinos encontrarlas
por categoría o barrio y contactarlas por WhatsApp.

## Alcance de esta entrega

El taller cubre las historias de usuario **HU01 a HU05**:

| HU | Historia |
| --- | --- |
| HU01 | Registro e inicio de sesión (cliente y comerciante) |
| HU02 | Perfil de la tienda (datos, ubicación y visibilidad) |
| HU03 | Catálogo de productos (alta, edición, agotado y precio) |
| HU04 | Directorio con filtros (categoría y barrio) |
| HU05 | Mapa de tiendas |

## Stack

- Next.js 16 (App Router, TypeScript, Turbopack)
- Tailwind CSS v4 + shadcn/ui
- Supabase (Auth, Postgres, Storage) con RLS
- Leaflet para el mapa
- Vitest + Testing Library

## Rutas

| Ruta | Descripción |
| --- | --- |
| `/` | Portada |
| `/directorio` | Directorio de tiendas publicadas |
| `/tienda/[id]` | Perfil público de una tienda y su catálogo |
| `/login`, `/registro` | Autenticación |
| `/panel` | Panel del comerciante (perfil de la tienda) |
| `/panel/productos` | Gestión del catálogo |

## Cómo ejecutar

1. Crea `.env.hosted.local` con las credenciales del proyecto Supabase:
   `NEXT_PUBLIC_SUPABASE_URL` (HTTPS, dominio `.supabase.co`) y
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. Instala dependencias: `npm ci`
3. Desarrollo: `npm run dev`
4. Pruebas: `npm test`
5. Build: `npm run build`

## Estructura

```
src/app        rutas (App Router)
src/components componentes por dominio
src/lib        lógica y modelos
supabase/      migraciones y políticas RLS
```
