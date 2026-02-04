# handleLogin – Documentación

## Descripción general

`handleLogin` es una función **asíncrona** que actúa como capa intermedia entre la vista de login y la API de autenticación.  
Su objetivo es **validar credenciales en frontend** y delegar la autenticación real al backend.

---

## Responsabilidad principal

- Validar los datos de login usando Zod
- Evitar llamadas innecesarias a la API si los datos son inválidos
- Unificar el formato de errores para la UI
- Retornar un resultado simple consumible por la vista

---

## Firma

```ts
export const handleLogin = async (data: AuthorizeInput)
```

> El retorno no está tipado explícitamente, pero sigue un contrato claro usado por `LoginPage`.

---

## Dependencias

```ts
import { loginUser } from "@/lib/auth/api/login.api"
import LoginSchema from "@/lib/schemas/login.schema"
import { AuthorizeInput } from "@/types/user.types"
```

### Dependencias clave

- **loginUser**: función que comunica con el backend para autenticar
- **LoginSchema**: esquema Zod para validar credenciales
- **AuthorizeInput**: contrato de datos del formulario de login

---

## Validación de datos

```ts
const parsed = LoginSchema.safeParse(data)
```

- Se utiliza `safeParse` para evitar excepciones
- Permite controlar el flujo de errores manualmente

### Caso inválido

```ts
if (!parsed.success) {
  return { error: parsed.error.flatten().fieldErrors }
}
```

**Formato del error**:
- Compatible con `ErrorContext`
- Permite mapear errores por campo en el formulario

---

## Autenticación en backend

```ts
const res = await loginUser(data)
```

- Delegación completa del proceso de autenticación
- El backend decide validez de credenciales

### Credenciales inválidas

```ts
if (res?.error) {
  return {
    error: { credentials: "credenciales inválidas" }
  }
}
```

**Nota**:
- Se normaliza el error a un mensaje genérico
- Evita exponer detalles de seguridad

---

## Caso exitoso

```ts
return { ok: true }
```

- Indica autenticación válida
- La vista se encarga de la redirección

---

## Contrato implícito de retorno

```ts
{
  ok?: boolean
  error?: Record<string, string | string[]>
}
```

Este contrato es compartido con `LoginPage`.

---

## Flujo completo

1. Vista envía credenciales
2. Validación con Zod
3. Si falla → errores inmediatos
4. Si pasa → llamada a backend
5. Backend responde
6. Resultado normalizado para la UI

---

## Observaciones técnicas

- Validación frontend duplica reglas del backend (intencional)
- Centraliza reglas de login en `LoginSchema`
- Mantiene la vista simple y limpia

---


## Ubicación

```
/app/(auth)/login/handleLogin.ts
```

---
