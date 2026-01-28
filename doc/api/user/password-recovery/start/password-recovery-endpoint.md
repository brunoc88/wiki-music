# Password Recovery – Start Flow (POST)

Este endpoint inicia el proceso de recuperación de contraseña de un usuario.
Su única responsabilidad es **validar credenciales secundarias** y **disparar la generación del token de recuperación**.

No devuelve el token al cliente por razones de seguridad.

---

## Endpoint

**POST** `/api/auth/password-recovery`

---

## Responsabilidad del Endpoint

- Validar el payload recibido.
- Delegar la lógica de negocio al `userService`.
- Responder únicamente con un estado de éxito o error.
- No exponer información sensible (token de recuperación).

---

## Implementación

```ts
import errorHandler from "@/error/errorHandler";
import { NextResponse } from "next/server";
import userPasswordRecoverySchema from "@/lib/schemas/user/user.password-recovery";
import { userService } from "@/services/user.service";

export const POST = async (req: Request) => {
  try {
    const data = await req.json();

    const parsed = await userPasswordRecoverySchema.safeParseAsync(data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const res = await userService.startPasswordRecovery(parsed.data);

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
};
```

---

## Validaciones

Las validaciones se realizan mediante **Zod** antes de ejecutar cualquier lógica de negocio.

---

## Decisiones Técnicas

### ¿Por qué POST y no PATCH?

- No se está modificando directamente un recurso existente.
- Se está iniciando un proceso.
- POST representa mejor una acción transaccional.

### ¿Por qué no se devuelve el token?

- El token es secreto y de un solo uso.
- Se envía exclusivamente por email.
- Evita filtraciones y ataques.

---

## Manejo de Errores

- `400` para errores de validación.
- Errores de dominio manejados por `errorHandler`.
- No se filtra información sensible.

---

## Flujo General

1. Cliente envía email y credenciales secundarias.
2. Endpoint valida.
3. Service genera token y envía email.
4. Cliente recibe `{ ok: true }`.

---

## Seguridad

- No se revela si un email existe.
- Token con expiración.
- Estado del usuario validado en cada paso.

---

## Estado

✔ Endpoint funcional  
✔ Tests cubiertos  
✔ Listo para integración de email
