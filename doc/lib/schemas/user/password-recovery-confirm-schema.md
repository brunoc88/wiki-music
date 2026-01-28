# Esquema de Confirmación de Recuperación de Contraseña

## Descripción

Este esquema valida los datos enviados al endpoint de **confirmación de recuperación de contraseña**.  
Se utiliza cuando el usuario ya recibió el email con el token y desea establecer una nueva contraseña.

---

## Esquema (Zod)

```ts
import { z } from 'zod'

const userPasswordRecoveryConfirmSchema = z.object({
  token: z.string().nonempty(),
  newPassword: z.string().min(8)
})

export default userPasswordRecoveryConfirmSchema
```

---

## Campos

### `token`
- Tipo: `string`
- Obligatorio
- Token de recuperación enviado por email
- Debe existir y no estar vacío

### `newPassword`
- Tipo: `string`
- Longitud mínima: **8 caracteres**
- Será hasheada antes de persistirse

---

## Validaciones

- Si falta algún campo → **400 Bad Request**
- Si no cumple las reglas → errores detallados por campo
- El esquema **no valida**:
  - expiración del token
  - estado del usuario
  - reutilización del token  

Estas validaciones corresponden al **service layer**.

---

## Nota de diseño

Separar validación sintáctica (schema) de validación de negocio (service) mantiene:
- código más limpio
- tests más simples
- responsabilidades bien definidas

---

✔ Nivel producción  
✔ Alineado con arquitectura backend limpia
