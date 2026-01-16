# Configurar Prisma con MySQL usando XAMPP

Guía paso a paso para proyectos **Node.js** usando **Prisma ORM** y **MySQL** con **XAMPP**.

---

## 1. Requisitos previos

- Node.js >= 18
- XAMPP instalado
- MySQL corriendo desde XAMPP
- npm o pnpm
- Proyecto Node.js inicializado

```bash
node -v
npm -v
```

---

## 2. Crear proyecto Node.js (si no existe)

```bash
mkdir prisma-mysql
cd prisma-mysql
npm init -y
```

Instala dependencias básicas:

```bash
npm install prisma @prisma/client
```

---

## 3. Iniciar Prisma

```bash
npx prisma init
```

Esto crea:

```
prisma/
 └── schema.prisma
.env
```

---

## 4. Configurar MySQL en XAMPP

1. Abre **XAMPP Control Panel**
2. Inicia **Apache** y **MySQL**
3. Entra a **phpMyAdmin**
4. Crea una base de datos (ejemplo):

```
nombre: myapp_db
collation: utf8mb4_general_ci
```

---

## 5. Configurar `.env`

Edita el archivo `.env`:

```env
DATABASE_URL="mysql://usuario:password@localhost:3306/myapp_db"
```

Ejemplo común en XAMPP (Windows):

```env
DATABASE_URL="mysql://root:@localhost:3306/myapp_db"
```

> ⚠️ Si usás contraseña en MySQL, reemplazá el campo correspondiente.

---

## 6. Configurar `schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}
```

---

## 7. Migrar la base de datos

```bash
npx prisma migrate dev --name init
```

Esto:
- Crea las tablas
- Genera Prisma Client
- Guarda migraciones

---

## 8. Usar Prisma Client en Node.js

```js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "test@mail.com",
      name: "Bruno"
    }
  });

  console.log(user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Ejecutar:

```bash
node index.js
```

---

## 9. Prisma Studio (opcional)

```bash
npx prisma studio
```

Abre una UI web para ver y editar datos.

---

## 10. Errores comunes

### ❌ `Can't reach database server`

- MySQL no está iniciado en XAMPP
- Puerto incorrecto (default: 3306)

### ❌ `Access denied for user 'root'@'localhost'`

- Verificar usuario/password
- Probar conexión en phpMyAdmin

---

## 11. Buenas prácticas

- Nunca subir `.env` a git
- Usar migraciones, no modificar DB manualmente
- Un PrismaClient por app (singleton)

---

## 12. Comandos útiles

```bash
npx prisma generate
npx prisma migrate reset
npx prisma db pull
npx prisma db push
```

---

✅ Prisma + MySQL + XAMPP configurado correctamente.
