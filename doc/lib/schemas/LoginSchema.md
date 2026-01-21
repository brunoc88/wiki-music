
# LoginSchema (Zod)

## Descripción

Esquema de validación utilizado para el **login de usuarios**.
Se encarga de validar y normalizar las credenciales antes de ser procesadas por
NextAuth (`CredentialsProvider`).

Este esquema:
- Valida que existan credenciales.
- Normaliza el campo `user`.
- Garantiza un password con longitud mínima.
- Evita lógica innecesaria en el authorize.

---

## Esquema

```ts
import { z } from "zod"

const LoginSchema = z.object({
  user: z
    .string()
    .nonempty("Debe ingresar email o nombre de usuario")
    .transform(val => val.trim().toLowerCase()),

  password: z
    .string()
    .nonempty("Debe ingresar un password")
    .min(6, "Min 6 caracteres")
})

export default LoginSchema
```

---

## Validaciones por Campo

### user
- Obligatorio
- Puede ser:
  - Email
  - Nombre de usuario
- Se normaliza automáticamente:
  - `trim()`
  - `toLowerCase()`

> La validación específica (email vs username) se resuelve en el service / provider.

---

### password
- Obligatorio
- Mínimo: 6 caracteres

---

## Transformaciones

### Normalización del campo user
```ts
.transform(val => val.trim().toLowerCase())
```

- Evita errores por:
  - Espacios accidentales
  - Diferencias entre mayúsculas y minúsculas
- Permite búsquedas consistentes en base de datos.

---

## Notas

- El esquema está pensado para usarse en el `CredentialsProvider` de NextAuth.
- No valida si el usuario existe ni si el password es correcto.
- Toda la lógica de autenticación queda fuera del schema.
- Mantiene el authorize limpio y enfocado solo en la autenticación.
