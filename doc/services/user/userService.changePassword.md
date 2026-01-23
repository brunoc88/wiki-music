
# userService.changePassword

## Descripción

Método del **service de usuario** encargado de **cambiar la contraseña del usuario autenticado**.
Contiene la lógica de negocio necesaria antes de persistir el cambio en la base de datos.

Este método:
- Hashea la nueva contraseña.
- Verifica que el usuario exista.
- Verifica que la cuenta esté activa.
- Delegá la persistencia al repository correspondiente.

---

## Implementación

```ts
changePassword: async (
  data: { password: string; password2: string },
  userId: number
): Promise<{ ok: true }> => {
  const password = await bcrypt.hash(data.password, 10)

  const user = await userRepo.findUser(userId)
  if (!user) {
    throw new NotFoundError()
  }

  if (!user.state) {
    throw new ForbiddenError("Usuario inactivo")
  }

  await userRepo.changePassword(password, userId)

  return { ok: true }
}

```

---

## Flujo de Ejecución

1. Recibe la nueva contraseña validada desde el controller.
2. Hashea el password utilizando `bcrypt`.
3. Busca el usuario por `userId`.
4. Verifica que el usuario exista.
5. Verifica que la cuenta esté activa.
6. Actualiza la contraseña mediante el repository.

---

## Errores Lanzados

### NotFoundError — 404
- Se lanza cuando:
  - El usuario no existe en la base de datos.

---

### ForbiddenError — 403
- Se lanza cuando:
  - El usuario existe pero su cuenta está inactiva.

---

## Responsabilidades

- Contener reglas de negocio.
- Decidir **cuándo** se puede cambiar una contraseña.
- No devolver respuestas HTTP.
- No acceder directamente al request o session.
- Definir el contrato de salida del caso de uso (`{ ok: true }`).

---

## Notas

- El service **asume que el usuario ya está autenticado**.
- La validación del body se realiza previamente con Zod.
- El hashing se realiza antes de cualquier operación en base de datos.
- Facilita testing aislado del controller.
