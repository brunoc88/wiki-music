# DELETE /api/user

Elimina (desactiva) la cuenta del usuario autenticado.

---

## Descripción

Este endpoint permite que un usuario autenticado elimine su propia cuenta.
La eliminación **no es física**, sino lógica: el usuario pasa a estado `state = false`.

El ID del usuario **no se recibe por parámetros**, sino que se obtiene exclusivamente desde la sesión activa (NextAuth).

---

## Autenticación

🔐 Requiere sesión válida.

La autenticación se valida mediante la función:

- `requireSessionUserId()`

Si no existe sesión o el usuario no está autenticado, se devuelve **401 Unauthorized**.

---

## Request

### Método
`DELETE`

### Ruta
`/api/user`

### Body (JSON)

```json
{
  "password": "string"
}
```

### Validación

El body se valida con `userDeleteAccountSchema` (Zod):

- `password` es obligatorio
- Debe ser un string válido

Si la validación falla, se devuelve **400 Bad Request** con los errores correspondientes.

---

## Lógica de negocio

1. Se obtiene el `userId` desde la sesión.
2. Se valida el body del request.
3. Se verifica que:
   - El usuario exista.
   - El usuario esté activo (`state === true`).
   - El password coincida con el almacenado en la base de datos.
4. Se realiza la desactivación de la cuenta (`state = false`).

---

## Respuestas

### ✅ 200 OK

Cuenta eliminada correctamente.

```json
{
  "ok": true
}
```

---

### ❌ 400 Bad Request

- Body inválido
- Password faltante o malformado

```json
{
  "error": {
    "password": ["Password requerido"]
  }
}
```

---

### ❌ 401 Unauthorized

- Sesión inexistente
- Credenciales inválidas

```json
{
  "error": "Credenciales inválidas"
}
```

---

### ❌ 403 Forbidden

- Usuario inactivo

```json
{
  "error": "Usuario inactivo"
}
```

---

### ❌ 404 Not Found

- Usuario no encontrado

```json
{
  "error": "Recurso no encontrado"
}
```

---

## Notas de diseño

- El endpoint **no confía en datos del cliente** para identificar al usuario.
- Toda la lógica de autorización se basa en la sesión.
- El manejo de errores se centraliza en `errorHandler`.
- El uso de eliminación lógica permite auditoría y recuperación futura.

---

## Ejemplo de uso

```http
DELETE /api/user
Content-Type: application/json
Authorization: session-cookie

{
  "password": "sekrets"
}
```
