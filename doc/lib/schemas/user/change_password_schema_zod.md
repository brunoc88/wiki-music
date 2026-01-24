# ChangePasswordSchema (Zod)

## Descripción

Esquema de validación utilizado para el **cambio de contraseña del usuario autenticado**.
Se encarga de validar las reglas mínimas de formato y consistencia antes de que la lógica
de negocio (service) ejecute el cambio en la base de datos.

Este esquema:
- Valida formato y reglas básicas de seguridad de las contraseñas.
- Verifica la coincidencia entre la nueva contraseña y su confirmación.
- Evita datos inválidos antes de llegar al service.

> ⚠️ **Importante:** este esquema **no autentica** al usuario ni valida el password actual.
> Esa responsabilidad pertenece exclusivamente a la capa de servicio.

---

## Esquema

```ts
import { z } from 'zod'

const ChangePasswordSchema = z.object({
  oldpassword: z
    .string()
    .trim()
    .min(6, 'Min 6 caracteres')
    .nonempty('Debe ingresar un password')
    .refine(v => !v.includes(' '), {
      message: 'El password no puede contener espacios',
    }),

  password: z
    .string()
    .trim()
    .min(6, 'Min 6 caracteres')
    .nonempty('Debe ingresar un password')
    .refine(v => !v.includes(' '), {
      message: 'El password no puede contener espacios',
    }),

  password2: z
    .string()
    .trim()
    .nonempty('Debe ingresar un password')
    .min(6, 'Min 6 caracteres'),
})
.refine(data => data.password === data.password2, {
  message: 'Las contraseñas no coinciden',
  path: ['password2'],
})

export default ChangePasswordSchema
```

---

## Validaciones por Campo

### oldpassword
- Obligatorio
- Mínimo: 6 caracteres
- Se normaliza con `trim()`
- No permite espacios en blanco

> Representa la **contraseña actual** del usuario y se utiliza luego en el service
> para validar credenciales mediante comparación con el hash almacenado.

---

### password
- Obligatorio
- Mínimo: 6 caracteres
- Se normaliza con `trim()`
- No permite espacios en blanco

> Representa la **nueva contraseña** que el usuario desea establecer.

---

### password2
- Obligatorio
- Mínimo: 6 caracteres
- Se normaliza con `trim()`
- Debe coincidir con `password`

> Campo de confirmación para evitar errores de tipeo.

---

## Validaciones Cruzadas

```ts
.refine(data => data.password === data.password2)
```

- Verifica que la nueva contraseña y su confirmación coincidan.
- El error se asigna explícitamente al campo `password2`.

---

## Responsabilidades del Schema

✔️ Validar formato y consistencia de datos
✔️ Normalizar inputs del usuario
✔️ Evitar requests inválidas en el controller

❌ No autentica al usuario
❌ No compara passwords con la base de datos
❌ No valida si el nuevo password es igual al anterior

---

## Relación con la Capa de Servicio

Las siguientes validaciones **no pertenecen** al schema y se realizan en el service:

1. Verificar que el usuario exista
2. Verificar que el usuario esté activo
3. Comparar `oldpassword` con el hash almacenado (`bcrypt.compare`)
4. Evitar reutilizar el mismo password
5. Hashear y persistir la nueva contraseña

Esta separación mantiene una arquitectura clara y predecible:
- **Schema** → validación de entrada
- **Service** → reglas de negocio y seguridad

---

## Notas Finales

- Este esquema está diseñado para endpoints de **usuarios autenticados**.
- Centraliza reglas de validación y mantiene el controller limpio.
- Facilita testing y mantenimiento a largo plazo.
