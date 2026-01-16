# UserRegisterSchema (Zod)

## Descripción

Esquema de validación utilizado para el **registro de usuarios**.
Se encarga de validar, normalizar y sanitizar los datos recibidos antes de ser
enviados al service de User.

Este esquema:
- Valida formato y reglas de negocio básicas.
- Verifica la coincidencia de contraseñas.
- Normaliza el `username`.
- Elimina campos innecesarios antes de llegar al service.

---

## Esquema

```ts
import { z } from "zod"

const UserRegisterSchema = z.object({
  email: z
    .string()
    .nonempty("Debe ingresar un email")
    .email("Email inválido"),

  username: z
    .string()
    .nonempty("Debe ingresar un nombre de usuario")
    .min(5, "Min 5 caracteres")
    .max(20, "Max 20 caracteres")
    .refine(v => !v.includes(" "), {
      message: "El username no puede contener espacios",
    })
    .transform(v => v.trim().toLowerCase()),

  password: z
    .string()
    .nonempty("Debe ingresar un password")
    .min(6, "Min 6 caracteres")
    .refine(v => !v.includes(" "), {
      message: "El password no puede contener espacios",
    }),

  password2: z
    .string()
    .nonempty("Debe ingresar un password")
    .min(6, "Min 6 caracteres"),

  securityQuestion: z
    .string()
    .nonempty("Debe seleccionar una pregunta"),

  securityAnswer: z
    .string()
    .nonempty("Debe escribir una respuesta")
    .min(10, "Min 10 caracteres"),

  pic: z.string().optional()
}).refine(data => data.password === data.password2, {
  message: "Las contraseñas no coinciden",
  path: ["password2"],
})

export default UserRegisterSchema.transform(({ password2, ...data }) => data)
```

---

## Validaciones por Campo

### email
- Obligatorio
- Debe ser un email válido

### username
- Obligatorio
- Mínimo: 5 caracteres
- Máximo: 20 caracteres
- No permite espacios
- Se normaliza:
  - `trim()`
  - `toLowerCase()`

### password
- Obligatorio
- Mínimo: 6 caracteres
- No permite espacios

### password2
- Obligatorio
- Mínimo: 6 caracteres
- Debe coincidir con `password`

### securityQuestion
- Obligatoria
- Se utiliza para recuperación de contraseña

### securityAnswer
- Obligatoria
- Mínimo: 10 caracteres
- Se almacenará hasheada en el backend

### pic
- Opcional
- Imagen de perfil del usuario

---

## Validaciones Cruzadas

```ts
.refine(data => data.password === data.password2)
```

- Verifica que ambas contraseñas coincidan.
- El error se asigna al campo `password2`.

---

## Transformaciones

### Normalización del username
```ts
.transform(v => v.trim().toLowerCase())
```
- Evita diferencias por mayúsculas o espacios.

### Eliminación de password2
```ts
.transform(({ password2, ...data }) => data)
```

- `password2` se utiliza solo para validación.
- No se envía al service ni se persiste en la base de datos.

---

## Notas

- Este esquema protege al backend de datos inválidos desde el primer punto de entrada.
- Centraliza reglas de validación y evita duplicación de lógica.
- Está diseñado para integrarse directamente con services y controladores.
