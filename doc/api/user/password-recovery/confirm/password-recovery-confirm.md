# Confirmación de recuperación de contraseña

## Endpoint
**POST** `/api/user/password-recovery/confirm`

## Descripción
Este endpoint confirma el proceso de recuperación de contraseña utilizando un **token de recuperación** previamente enviado por email al usuario.

Si el token es válido, no está expirado y el usuario sigue activo, se actualiza la contraseña y se invalida el token.

---

## Flujo general

1. El frontend envía el `token` y la `newPassword`.
2. Se valida el body con Zod.
3. El service busca un usuario activo asociado al token.
4. Se valida expiración del token.
5. Se hashea la nueva contraseña.
6. Se actualiza la contraseña y se limpia el token.
7. Se responde `{ ok: true }`.

---

## Controlador

```ts
export const POST = async (req: Request) => {
  try {
    const data = await req.json()

    const parsed = userPasswordRecoveryConfirmSchema.safeParse(data)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const res = await userService.confirmPasswordRecovery(parsed.data)

    return NextResponse.json(res, { status: 200 })
  } catch (error) {
    return errorHandler(error)
  }
}
```

---

## Validaciones
- Token requerido
- Nueva contraseña requerida
- Longitud mínima y reglas definidas por el schema

---

## Respuestas

### 200 OK
```json
{ "ok": true }
```

### 400 Bad Request
Errores de validación (Zod).

### 403 Forbidden
- Token inválido
- Token expirado
- Usuario inactivo

---

## Seguridad
- El token **no se devuelve nunca al frontend**
- El token se invalida tras usarse
- El endpoint es POST (no PATCH) para evitar idempotencia accidental

---

## Nota profesional
Este flujo es el estándar utilizado en aplicaciones reales:  
✔ token efímero  
✔ validación server-side  
✔ comunicación vía email  

Implementación sólida para producción y entrevistas técnicas.
