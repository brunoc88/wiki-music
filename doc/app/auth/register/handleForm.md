# handleForm – Documentación

## Descripción general

`handleForm` es una función **asíncrona de soporte al formulario de registro**.  
Actúa como capa intermedia entre la vista y la API, encargándose de:

- Normalizar datos provenientes de `FormData`
- Validar datos en frontend usando Zod
- Cortar el flujo si la validación falla
- Delegar el registro real al backend

---

## Responsabilidad principal

Garantizar que **solo datos válidos** lleguen a la función `registerUser`, evitando llamadas innecesarias a la API y unificando el formato de errores.

---

## Firma

```ts
export const handleForm = async (formData: FormData)
```

> El retorno no está tipado explícitamente, pero sigue un **contrato implícito** utilizado por la vista.

---

## Dependencias

```ts
import { registerUser } from "@/lib/auth/api/user.api"
import userSchema from "@/lib/schemas/user/user.schema"
```

### Dependencias clave

- **registerUser**: función que comunica con el backend
- **userSchema**: esquema Zod que valida el payload del registro

---

## Normalización de datos

```ts
const data = {
  email: formData.get("email")?.toString() || "",
  username: formData.get("username")?.toString() || "",
  password: formData.get("password")?.toString() || "",
  password2: formData.get("password2")?.toString() || "",
  securityQuestion: formData.get("securityQuestion")?.toString() || "",
  securityAnswer: formData.get("securityAnswer")?.toString() || ""
}
```

**Objetivo**:
- Extraer valores seguros desde `FormData`
- Garantizar strings para la validación
- Evitar `null` o `undefined`

---

## Validación con Zod

```ts
const parsed = userSchema.safeParse(data)
```

- Se usa `safeParse` para evitar excepciones
- Permite manejar errores de forma controlada

### Caso inválido

```ts
if (!parsed.success) {
  return {
    ok: false,
    error: parsed.error.flatten().fieldErrors
  }
}
```

**Formato del error**:
- Compatible con `ErrorContext`
- Ideal para mapear errores por campo en la UI

---

## Registro en backend

```ts
const res = await registerUser(formData)
return res
```

- Se envía el `FormData` original
- Permite incluir archivos sin reprocesarlos
- La función devuelve directamente la respuesta de la API

---

## Contrato implícito de retorno

```ts
{
  ok: boolean
  error?: Record<string, string[]>
  user?: {
    email: string
    ...
  }
}
```

> Este contrato es compartido con `UserRegisterForm`.

---

## Flujo completo

1. Vista envía `FormData`
2. `handleForm` normaliza los datos
3. Zod valida el payload
4. Si falla → devuelve errores
5. Si pasa → llama a `registerUser`
6. Retorna respuesta al componente

---

## Observaciones técnicas

- La validación frontend **duplica** la del backend (intencional)
- Evita viajes innecesarios a la API
- Centraliza reglas de negocio en `userSchema`

---


## Ubicación

```
/app/(auth)/register/handleForm.ts
```

---

## Autor

Bruno  
Proyecto: **WikiMusic**
