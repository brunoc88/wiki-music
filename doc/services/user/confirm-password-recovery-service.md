# Servicio: confirmPasswordRecovery

## Descripción
Confirma la recuperación de contraseña a partir de un token válido.  
Valida que el token exista, no esté expirado y que el usuario esté activo.  
Si todo es correcto, actualiza la contraseña y anula el token de recuperación.

## Firma
```ts
confirmPasswordRecovery(data: {
  token: string
  newPassword: string
}): Promise<{ ok: true }>
```

## Flujo interno
1. Se recibe el `token` y la nueva contraseña.
2. Se busca el usuario asociado al token.
3. Se valida que el usuario exista y esté activo.
4. Se hashea la nueva contraseña.
5. Se actualiza la contraseña y se invalida el token.
6. Se devuelve `{ ok: true }`.

## Código
```ts
confirmPasswordRecovery: async (data: {
  token: string
  newPassword: string
}): Promise<{ ok: true }> => {
  const { token, newPassword } = data

  const user = await userRepo.getUserByRecoveryToken(token)

  if (!user || !user.state) {
    throw new ForbiddenError('Token inválido o usuario inactivo')
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await userRepo.resetPasswordByRecovery({
    userId: user.id,
    hashedPassword
  })

  return { ok: true }
}
```

## Seguridad
- El token es de un solo uso.
- El token tiene expiración.
- La contraseña nunca se guarda en texto plano.
- No se filtra información sensible en la respuesta.

## Respuesta exitosa
```json
{
  "ok": true
}
```

## Posibles errores
- `403 Forbidden`: Token inválido, expirado o usuario inactivo.
- `500 Internal Server Error`: Error inesperado.
