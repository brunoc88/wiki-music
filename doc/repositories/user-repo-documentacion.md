# Documentación - userRepo (Repositorio de Usuario)

## 📍 Ubicación

`/lib/repositories/userRepo.ts`

------------------------------------------------------------------------

## 🧩 Descripción General

`userRepo` es una capa de acceso a datos (Repository Pattern) encargada
de interactuar con la base de datos a través de Prisma.

Centraliza todas las operaciones relacionadas con la entidad `User`,
permitiendo:

-   Encapsular la lógica de persistencia.
-   Separar la lógica de negocio del acceso a datos.
-   Mantener un punto único de interacción con la tabla `user`.

------------------------------------------------------------------------

## 🏗 Métodos Disponibles

### 1️⃣ create

``` ts
create: async (data: CreateUser): Promise<User>
```

Crea un nuevo usuario en la base de datos.

------------------------------------------------------------------------

### 2️⃣ findUser

``` ts
findUser: async (id: number): Promise<User | null>
```

Busca un usuario por su ID.

------------------------------------------------------------------------

### 3️⃣ findByEmail

``` ts
findByEmail: async (email: string)
```

Busca un usuario por su email.

------------------------------------------------------------------------

### 4️⃣ changePassword

``` ts
changePassword: async (password: string, userId: number): Promise<User>
```

Actualiza la contraseña de un usuario específico.

------------------------------------------------------------------------

### 5️⃣ deleteAccount

``` ts
deleteAccount: async (id: number): Promise<User>
```

Realiza un borrado lógico estableciendo `state: false`.

------------------------------------------------------------------------

### 6️⃣ securityQuestionUpdate

``` ts
securityQuestionUpdate: async (
  data: { securityQuestion?: string, securityAnswer: string },
  userId: number
): Promise<User>
```

Actualiza la pregunta y/o respuesta de seguridad.

------------------------------------------------------------------------

### 7️⃣ changeUsername

``` ts
changeUsername: async (
  data: { username: string },
  userId: number
): Promise<User>
```

Modifica el nombre de usuario.

------------------------------------------------------------------------

### 8️⃣ setRecoveryToken

``` ts
setRecoveryToken: async (
  data: { id: number, token: string, expires: Date }
): Promise<void>
```

Asigna un token de recuperación de contraseña junto con su fecha de
expiración.

------------------------------------------------------------------------

### 9️⃣ getUserByRecoveryToken

``` ts
getUserByRecoveryToken: async (token: string)
```

Obtiene un usuario válido según:

-   Coincidencia de `recoveryToken`
-   Token no expirado (`recoveryExpires > new Date()`)
-   Usuario activo (`state: true`)

------------------------------------------------------------------------

### 🔟 resetPasswordByRecovery

``` ts
resetPasswordByRecovery: async (
  data: { userId: number, hashedPassword: string }
)
```

Restablece la contraseña y limpia:

-   `recoveryToken`
-   `recoveryExpires`

------------------------------------------------------------------------

### 1️⃣1️⃣ updateProfilePic

``` ts
updateProfilePic: async (
  userId: number,
  data: { pic: string, picPublicId: string }
): Promise<User>
```

Actualiza la foto de perfil del usuario.

------------------------------------------------------------------------

### 1️⃣2️⃣ deleteProfilePic

``` ts
deleteProfilePic: async (
  userId: number,
  data: { pic: string, picPublicId: string | null }
): Promise<User>
```

Elimina la información asociada a la foto de perfil.

------------------------------------------------------------------------

## 🧱 Patrón Aplicado

Este módulo implementa el **Repository Pattern**, permitiendo:

-   Abstracción del ORM (Prisma).
-   Centralización de consultas.
-   Mayor mantenibilidad.
-   Facilidad para testing.

------------------------------------------------------------------------

## 🔐 Rol en la Arquitectura

`userRepo` forma parte de la capa de infraestructura/persistencia y es
utilizado por:

-   Servicios de autenticación.
-   Lógica de recuperación de contraseña.
-   Gestión de perfil.
-   Administración de cuenta.

------------------------------------------------------------------------

## 📌 Dependencias

-   Prisma Client
-   Tipos personalizados (`CreateUser`)
-   Modelo `User` de Prisma

------------------------------------------------------------------------

**Autor:** Bruno\
**Contexto:** Gestión de Usuario -- Proyecto WikiMusic
