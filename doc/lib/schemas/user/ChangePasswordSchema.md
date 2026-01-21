
# ChangePasswordSchema (Zod)

## Descripción

Esquema de validación utilizado para el **cambio de contraseña del usuario autenticado**.
Se encarga de validar las reglas mínimas de seguridad antes de que la lógica de negocio
actualice la contraseña en la base de datos.

Este esquema:
- Valida formato y reglas básicas del password.
- Verifica la coincidencia entre ambas contraseñas.
- Evita datos inválidos antes de llegar al service.

---

## Esquema

```ts
import { z } from "zod"

const ChangePasswordSchema = z.object({
  password: z
    .string()
    .min(6, "Min 6 caracteres")
    .nonempty("Debe ingresar un password")
    .refine(v => !v.includes(" "), {
      message: "El password no puede contener espacios",
    }),

  password2: z
    .string()
    .nonempty("Debe ingresar un password")
    .min(6, "Min 6 caracteres")
})
.refine(data => data.password === data.password2, {
  message: "Las contraseñas no coinciden",
  path: ["password2"],
})

export default ChangePasswordSchema
```

---

## Validaciones por Campo

### password
- Obligatorio
- Mínimo: 6 caracteres
- No permite espacios en blanco

### password2
- Obligatorio
- Mínimo: 6 caracteres
- Debe coincidir con `password`

---

## Validaciones Cruzadas

```ts
.refine(data => data.password === data.password2)
```

- Verifica que ambas contraseñas coincidan.
- El error se asigna explícitamente al campo `password2`.

---

## Notas

- El esquema **no valida** si el password es igual al anterior.
- No contiene lógica de autenticación ni autorización.
- Está diseñado para ser utilizado únicamente por usuarios autenticados.
- Centraliza reglas de validación y mantiene limpio el controller.
