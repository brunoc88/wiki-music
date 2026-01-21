
# requireSessionUserId

## Descripción

Helper encargado de **validar la existencia de una sesión activa** y obtener el
`userId` del usuario autenticado.

Se utiliza para **proteger endpoints** que requieren autenticación, evitando
duplicar lógica de sesión en los controllers.

---

## Implementación

```ts
import { authOptions } from "@/api/auth/[...nextauth]/route"
import { BadRequestError, UnAuthorizedError } from "@/error/appError"
import { getServerSession } from "next-auth"

const requireSessionUserId = async () => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new UnAuthorizedError()

  const id = Number(session.user.id)
  if (isNaN(id)) throw new BadRequestError()

  return id
}

export default requireSessionUserId
```

---

## Flujo de Ejecución

1. Obtiene la sesión mediante `getServerSession(authOptions)`.
2. Verifica que exista un usuario autenticado.
3. Convierte el `id` de sesión a `number`.
4. Devuelve el `userId` válido para su uso en services.

---

## Errores Lanzados

### UnAuthorizedError — 401
- Se lanza cuando:
  - No existe sesión.
  - La sesión no contiene un `user.id`.

### BadRequestError — 400
- Se lanza cuando:
  - El `user.id` no puede convertirse a número.

---

## Casos de Uso

- Proteger endpoints del tipo:
  - Cambio de contraseña
  - Edición de perfil
  - Eliminación de cuenta
- Evitar pasar el `userId` por parámetros.
- Centralizar validaciones de sesión.

Ejemplo:

```ts
const userId = await requireSessionUserId()
await userService.changePassword(data, userId)
```

---

## Buenas Prácticas

- Usar este helper **al inicio del controller**.
- No capturar los errores aquí; dejar que el `errorHandler` los procese.
- Mantener el helper enfocado solo en autenticación (no roles).

---

## Notas

- Este helper **no valida permisos ni roles**.
- Para control de acceso por rol, se recomienda un helper o middleware separado.
- Facilita el testing al poder mockear `getServerSession`.
