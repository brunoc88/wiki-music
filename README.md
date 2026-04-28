# WikiMusic

Aplicación fullstack centrada en música donde los usuarios pueden explorar artistas y álbumes, crear contenido y administrarlo mediante sistema de roles.

---

## Demo Online

👉 [Ver WikiMusic en vivo](PEGAR_LINK_VERCEL_AQUI)

---

## Funcionalidades

## Público

- Explorar artistas activos
- Explorar álbumes activos
- Buscar artistas y álbumes
- Ver perfiles musicales

## Usuario (`user`)

- Registro con email
- Login con credenciales
- Login con Google OAuth
- Crear artistas
- Editar artistas
- Crear álbumes
- Editar álbumes
- Recuperar contraseña por email

## Admin (`admin`)

Todo lo anterior más:

- Desactivar / activar artistas
- Desactivar / activar álbumes
- Ver contenido inactivo
- Gestionar géneros

## Super Admin (`super`)

Todo lo anterior más:

- Activar / desactivar géneros

---

## Stack Tecnológico

### Frontend

- Next.js
- React
- TypeScript
- CSS Modules
- CSS Vanilla
- Responsive Design

### Backend

- Next.js Fullstack
- Prisma ORM
- PostgreSQL

### Auth

- NextAuth
- Credentials Provider
- Google OAuth

### Validaciones

- Zod schemas
- Validación backend tipada
- Manejo consistente de errores

### Testing

- Vitest
- Tests unitarios de endpoints y lógica

### Servicios externos

- Nodemailer (emails de recuperación)

---

## Seguridad

- Variables de entorno
- Roles y permisos
- Validación de sesiones
- Protección de rutas privadas

---

## Base de datos

Modelado relacional con:

- Users
- Artists
- Albums
- Genres
- Songs

Relaciones many-to-many y one-to-many mediante Prisma.

---

## Objetivo del proyecto

Proyecto creado para profundizar conocimientos en:

- Next.js fullstack
- Prisma
- PostgreSQL
- TypeScript
- Testing
- Autenticación moderna
- Arquitectura real de producto

Además de unir desarrollo con una temática personal: la música.

---

## Futuras mejoras

- Panel de usuarios
- Asignar / remover admins
- Suspensión de cuentas
- Avatar editable
- Favoritos
- Comentarios
- Buscador avanzado

---

## Instalación local

```bash
git clone TU_REPO
npm install
npm run dev
```

--- 
## Example .env

```
# Data Base url 
DATABASE_URL=

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Cloudinary url image
DEFAULT_USER_IMAGE_URL=

# Password-Recovery
EMAIL_USER=
# Password creado en app password
FRONT_URL=
EMAIL_PASS=
```
