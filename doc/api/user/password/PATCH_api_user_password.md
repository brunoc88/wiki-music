
# PATCH /api/user/password

## Descripción

Endpoint encargado de **actualizar la contraseña del usuario autenticado**.
El usuario debe tener una sesión activa para poder acceder a este recurso.

El endpoint **no recibe un ID por parámetro**, ya que el usuario se identifica
a partir de la sesión (`getServerSession`).

---

## Importaciones

```ts
import requireSessionUserId from "@/lib/auth/requireSessionUserId"
import ChangePasswordSchema from "@/lib/schemas/user/user.editpassword.schema"
import errorHandler from "@/error/errorHandler"
import { userService } from "@/services/user.service"
import { NextResponse } from "next/server"
```

- **requireSessionUserId**: Valida que exista una sesión activa y devuelve el `userId`.
- **ChangePasswordSchema**: Validación con `zod` para el cambio de contraseña.
- **errorHandler**: Centraliza el manejo de errores de dominio y base de datos.
- **userService**: Contiene la lógica de negocio relacionada al usuario.
- **NextResponse**: Utilizado para devolver respuestas HTTP.

---

## Flujo de la API

```ts
export const PATCH = async (req: Request)
```

### Paso 1: Validación de sesión

```ts
const userId = await requireSessionUserId()
```

- Verifica que el usuario esté autenticado.
- Extrae el `userId` desde la sesión.
- Errores posibles:
  - **401 – Unauthorized**: Usuario sin sesión.
  - **400 – Bad Request**: ID de usuario inválido.

---

### Paso 2: Lectura del body

```ts
const data = await req.json()
```

- Se obtiene el body en formato JSON.

---

### Paso 3: Validación de datos

```ts
const parsed = await ChangePasswordSchema.safeParseAsync(data)

if (!parsed.success) {
  return NextResponse.json(
    { error: parsed.error.flatten().fieldErrors },
    { status: 400 }
  )
}
```

- Se valida el body utilizando `zod`.
- Si la validación falla, se devuelven los errores por campo.
- Código de estado: **400 – Bad Request**.

Campos esperados:

- `password`: string (mínimo 6 caracteres, sin espacios)
- `password2`: string (debe coincidir con `password`)

---

### Paso 4: Cambio de contraseña

```ts
await userService.changePassword(parsed.data, userId)
```

- El service se encarga de:
  - Hashear la nueva contraseña.
  - Verificar que el usuario exista.
  - Verificar que la cuenta esté activa.
  - Persistir el cambio en la base de datos.

---

### Paso 5: Respuesta exitosa

```ts
return NextResponse.json(res, { status: 200 })
```

- Indica que la contraseña fue actualizada correctamente.
- Código de estado: **200 – OK**.

---

## Manejo de Errores

Los siguientes errores son capturados por el `errorHandler`:

- **400 – Bad Request**
  - Datos inválidos.
  - ID de usuario inválido.

- **401 – Unauthorized**
  - Usuario sin sesión activa.

- **403 – Forbidden**
  - Cuenta inactiva.

- **404 – Not Found**
  - Usuario no encontrado.

- **500 – Internal Server Error**
  - Error inesperado del servidor.

En todos los casos, se devuelve un mensaje claro al cliente.

---

## Notas

- El endpoint solo permite modificar la contraseña del **usuario autenticado**.
- No es posible cambiar la contraseña de otro usuario.
- La contraseña nunca se devuelve en la respuesta.
- El diseño sigue una arquitectura por capas:
  **Controller → Service → Repository**.
