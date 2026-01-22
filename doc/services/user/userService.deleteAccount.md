# userService.deleteAccount

Servicio encargado de la eliminación lógica de la cuenta de un usuario autenticado.

---

## Descripción

`deleteAccount` implementa la lógica de negocio para eliminar una cuenta de usuario.
La eliminación es **lógica**, no física: el usuario pasa a estado `state = false`.

Este método asume que el ID del usuario ya fue autenticado y validado previamente (por sesión).

---

## Firma

```ts
deleteAccount(password: string, id: number): Promise<void>
```

---

## Flujo de ejecución

1. Busca el usuario por ID.
2. Verifica que el usuario exista.
3. Verifica que el usuario esté activo.
4. Valida el password ingresado contra el hash almacenado.
5. Ejecuta la eliminación lógica del usuario.

---

## Implementación

```ts
deleteAccount: async (password: string, id: number) => {
  let user = await userRepo.findUser(id)

  if (!user) throw new NotFoundError()
  if (!user.state) throw new ForbiddenError('Usuario inactivo')

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) throw new UnAuthorizedError('Credenciales inválidas')

  return await userRepo.deleteAccount(id)
}
```

---

## Errores lanzados

| Error | Código HTTP | Motivo |
|-----|------------|-------|
| `NotFoundError` | 404 | El usuario no existe |
| `ForbiddenError` | 403 | El usuario está inactivo |
| `UnAuthorizedError` | 401 | Password incorrecto |

Estos errores son capturados y formateados por el `errorHandler` global.

---

## Dependencias

- `userRepo.findUser` → Obtiene el usuario desde la base de datos
- `userRepo.deleteAccount` → Aplica la eliminación lógica (`state = false`)
- `bcrypt.compare` → Verificación segura del password
- Clases de error personalizadas (`AppError`)

---

## Notas de diseño

- El service **no valida el input** (eso se realiza en el controller con Zod).
- El service **no maneja respuestas HTTP**.
- La lógica está aislada y es fácilmente testeable.
- El método confía en la capa de persistencia para lanzar errores de consistencia.

---

## Seguridad

- El password nunca se expone ni se devuelve.
- Se valida contra el hash almacenado.
- No se permite eliminar cuentas inactivas.
- No se permite eliminar cuentas ajenas (ID obtenido por sesión).

---

## Consideraciones futuras

- Auditoría de eliminación (timestamps, logs)
- Rate limit adicional para intentos fallidos
- Reautenticación fuerte para cuentas sensibles
