# userService.changePassword

## Descripción

Método del **service de usuario** encargado de **cambiar la contraseña del usuario autenticado**.
Contiene la lógica de negocio y las validaciones de seguridad necesarias antes de persistir el cambio en la base de datos.

Este método:
- Verifica que el usuario exista y esté activo.
- Valida la contraseña actual del usuario.
- Impide reutilizar la contraseña anterior.
- Hashea la nueva contraseña.
- Delegá la persistencia al repository correspondiente.

---

## Implementación

```ts
changePassword: async (
  data: {
    oldpassword: string
    password: string
    password2: string
  },
  userId: number
): Promise<{ ok: true }> => {

  let user = await requireActiveUserById(userId)

  const isValidOldPassword = await bcrypt.compare(
    data.oldpassword,
    user.password
  )
  if (!isValidOldPassword) {
    throw new ForbiddenError('Credenciales inválidas')
  }

  const isSamePassword = await bcrypt.compare(
    data.password,
    user.password
  )
  if (isSamePassword) {
    throw new ForbiddenError(
      'El nuevo password no puede ser igual al anterior'
    )
  }

  const hashedPassword = await bcrypt.hash(data.password, 10)
  await userRepo.changePassword(hashedPassword, userId)

  return { ok: true }
}
```

---

## Flujo de Ejecución

1. Recibe el request validado desde el controller (vía Zod).
2. Busca el usuario por `userId`.
3. Verifica que el usuario exista.
4. Verifica que la cuenta esté activa.
5. Compara la contraseña actual (`oldpassword`) con el hash almacenado.
6. Verifica que la nueva contraseña no sea igual a la anterior.
7. Hashea la nueva contraseña utilizando `bcrypt`.
8. Actualiza la contraseña mediante el repository.
9. Retorna `{ ok: true }`.

---

## Errores Lanzados

### NotFoundError — 404
- Se lanza cuando:
  - El usuario no existe en la base de datos.

---

### ForbiddenError — 403
- Se lanza cuando:
  - El usuario existe pero su cuenta está inactiva.
  - La contraseña actual es incorrecta.
  - El nuevo password es igual al anterior.

---

## Responsabilidades

- Contener reglas de negocio y seguridad.
- Decidir **cuándo** se permite cambiar una contraseña.
- Validar credenciales del usuario autenticado.
- No devolver respuestas HTTP.
- No acceder directamente al request o session.
- Definir el contrato de salida del caso de uso (`{ ok: true }`).

---

## Relación con Otras Capas

- **Controller**: maneja request / response y aplica el schema Zod.
- **Schema (Zod)**: valida formato y consistencia de los datos de entrada.
- **Service**: aplica reglas de negocio y validaciones de seguridad.
- **Repository**: persiste el cambio en la base de datos.

---

## Notas

- El service **asume que el usuario ya está autenticado**.
- No valida formato de inputs (responsabilidad del schema).
- Centraliza la lógica sensible de seguridad.
- Facilita testing unitario e integración.

