# User Model Documentation

## Descripción

El modelo **User** representa a los usuarios del sistema y es la entidad central para la autenticación,
autorización y gestión de perfiles dentro de la API.

Permite a los usuarios:
- Registrarse
- Autenticarse
- Editar sus datos personales
- Eliminar su cuenta (borrado lógico)
- Recuperar su contraseña
- Consultar su perfil

---

## Aclaraciones Importantes

### Asignación de Rol

- El campo `rol` **no se recibe desde el cliente**.
- El rol se **hardcodea en el service de User**, según el endpoint utilizado:
  - `POST /user/registro` → rol `comun`
  - `POST /user/registro/admin` → rol `admin`
- El rol **no es editable** por el usuario bajo ninguna circunstancia.

Esta decisión evita problemas de seguridad y escaladas de privilegios.

### Seguridad

- El campo `password` se almacena **hasheado**.
- El campo `securityAnswer` también se almacena **hasheado**.
- Ninguno de estos campos se devuelve en las respuestas de la API.

### Imagen de Perfil

- El usuario puede elegir una imagen de perfil.
- Si no se proporciona una imagen, se asigna por defecto `default.png`.

### Eliminación de Cuenta

- La eliminación de usuarios es **lógica**.
- Un usuario eliminado tendrá el campo `state` en `false`.

---

## Modelo Prisma

```ts
model User {
  id               Int     @id @default(autoincrement())
  email            String  @unique
  username         String  @unique
  password         String
  rol              String
  securityQuestion String
  securityAnswer   String
  pic              String  @default("default.png")
  state            Boolean @default(true)
}
```

---

## Descripción de Campos

- **id**
  - Tipo: Int
  - Autoincremental
  - Clave primaria

- **email**
  - Tipo: String
  - Único
  - Email del usuario

- **username**
  - Tipo: String
  - Único
  - Nombre de usuario

- **password**
  - Tipo: String
  - Almacenado de forma segura (hash)

- **rol**
  - Tipo: String
  - Valores posibles: `comun`, `admin`
  - Asignado automáticamente en el service

- **securityQuestion**
  - Tipo: String
  - Pregunta de seguridad para recuperación de contraseña

- **securityAnswer**
  - Tipo: String
  - Respuesta hasheada para recuperación de contraseña

- **pic**
  - Tipo: String
  - Imagen de perfil
  - Valor por defecto: `default.png`

- **state**
  - Tipo: Boolean
  - Indica si el usuario está activo
  - Valor por defecto: `true`

---

## Notas

Este modelo está pensado para ser escalable y seguro, y puede integrarse con:
- JWT / Refresh Tokens
- Control de acceso basado en roles
- Middleware de autorización
