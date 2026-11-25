# Historias de Usuario - BarrioShop

Alcance del taller: **HU01 a HU05**. Cada historia lista sus criterios de
aceptación y la evidencia que la demuestra en la aplicación.

## HU01 - Registro e inicio de sesión

Como visitante quiero crear una cuenta como cliente o comerciante y volver a
entrar después, para publicar mi tienda o guardar mi actividad.

- CA1: registro con correo y contraseña, eligiendo rol (cliente o comerciante).
- CA2: el directorio y el perfil de una tienda se pueden ver sin cuenta.
- CA3: la contraseña se guarda cifrada y el formulario exige aceptar la política
  de tratamiento de datos.
- CA4: si las credenciales fallan, el error se muestra en pantalla.
- CA5: la sesión se mantiene en cookies y el header refleja el usuario.

## HU02 - Perfil de la tienda

Como comerciante quiero registrar y editar el perfil de mi tienda para que los
vecinos sepan dónde está y cómo contactarme.

- CA1: nombre, tipo de comercio, dirección, barrio, UPZ y referencia opcional,
  WhatsApp y horario.
- CA2: la ubicación se marca en el mapa y se guarda como coordenadas.
- CA3: el perfil público muestra foto, dirección, referencia, horario, mapa y
  contacto por WhatsApp.
- CA4: el dueño solo edita su propia tienda (aislamiento por RLS).
- CA5: la tienda publicada se puede ocultar y volver a publicar.

## HU03 - Catálogo de productos

Como comerciante quiero administrar mi catálogo para mostrar qué vendo, a qué
precio y qué está agotado.

- CA1: alta, edición y eliminación de productos con nombre, precio, categoría,
  descripción y foto.
- CA2: la foto se comprime en el navegador antes de subirse.
- CA3: el comerciante solo administra los productos de su tienda (RLS).
- CA4: un producto agotado sigue visible pero marcado como "Agotado".
- CA5: se muestra la última actualización de precio.

## HU04 - Directorio con filtros

Como vecino quiero buscar tiendas publicadas por categoría o barrio para
encontrar lo que necesito cerca.

- CA1: el directorio solo lista tiendas en estado "publicada".
- CA2: filtros por categoría y por barrio, y búsqueda por texto.
- CA3: cada tarjeta muestra foto (o marca del tipo de comercio), nombre, tipo y
  barrio, y enlaza al perfil.
- CA4: el directorio es público y no exige iniciar sesión.

## HU05 - Mapa de tiendas

Como vecino quiero ver las tiendas sobre un mapa para ubicarlas en el barrio.

- CA1: el directorio muestra un mapa con las tiendas publicadas.
- CA2: cada marcador abre una tarjeta con el nombre y el enlace al perfil.
- CA3: el mapa está acotado al polígono real del barrio Kennedy.
- CA4: el perfil de una tienda muestra su propio marcador en el mapa.
