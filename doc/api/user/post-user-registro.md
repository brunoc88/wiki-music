# POST /api/user — Registro de usuario

## Descripción

Endpoint encargado del **registro de usuarios comunes** dentro del sistema.
Permite crear un nuevo usuario validando los datos de entrada y asignando el rol
correspondiente de forma automática.

El rol **NO** es enviado por el cliente, sino que se **hardcodea en el service de User**.

---

## Importaciones

```ts
import UserRegisterSchema from "@/lib/schemas/user/user.schema"
import errorHandler from "@/middlewares/errorHandler"
import { userService } from "@/services/user.service"
import { NextResponse } from "next/server"
```

- **UserRegisterSchema**: Validación con `zod` para comprobar datos válidos al momento de registrar un usuario.
- **errorHandler**: Función centralizada para el manejo de errores de la API.
- **userService**: Servicio de User donde se implementa la lógica de negocio.
- **NextResponse**: Utilizado para devolver la respuesta HTTP y su correspondiente estado.

---

## Flujo de la API

```ts
export const POST = async (req: Request)
```

### Paso 1: Lectura de formData

```ts
const formData = await req.formData()
```

- Se obtiene el valor de todos los campos del formData.

```ts
let data = {
      email: formData.get("email")?.toString() || "",
      username: formData.get("username")?.toString() || "",
      password: formData.get("password")?.toString() || "",
      password2: formData.get("password2")?.toString() || "",
      securityQuestion: formData.get("securityQuestion")?.toString() || "",
      securityAnswer: formData.get("securityAnswer")?.toString() || ""
    }
    
```

- Se obtiene el archivo (imagen de perfil), si fue enviado.

```ts
const file: File | null = formData.get('file') as File
```

---

### Paso 2: Validación de datos

```ts
const parsed = await UserRegisterSchema.safeParseAsync(data)

if (!parsed.success) {
  return NextResponse.json(
    { error: parsed.error.flatten().fieldErrors },
    { status: 400 }
  )
}
```

- Se valida el body utilizando `zod`.
- Si la validación falla, se devuelve un JSON con los errores por campo.
- Código de estado: **400 – Bad Request**.

---

### Paso 3: Creación del usuario

```ts
const res = await userService.create(parsed.data, file)

const user = {
  id: res.id,
  email: res.email,
  username: res.username,
  pic: res.pic
}

return NextResponse.json(
  { message: "Usuario creado correctamente", user },
  { status: 201 }
)
```

- Si la validación es exitosa, los datos se envían al `userService`.
- El service se encarga de:
  - Hashear el password.
  - Hashear la respuesta de seguridad.
  - Asignar el rol por defecto (comun).
- Se devuelve únicamente la información pública del usuario.
- Código de estado: **201 – Created**.

---

## Manejo de Errores

Los siguientes errores son capturados por el `errorHandler`:

- **409 – Conflict**  
  Usuario duplicado (email o username ya existente).

- **500 – Internal Server Error**  
  Error inesperado del servidor.

En todos los casos, se devuelve un mensaje claro al cliente.

---

## Notas

- El password y la respuesta de seguridad **nunca** se devuelven en las respuestas.
- El endpoint está preparado para integrarse con autenticación (NextAuth / JWT) y control de acceso por roles.
