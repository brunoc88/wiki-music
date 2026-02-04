# LoginPage – Documentación

## Descripción general

`LoginPage` es un **componente cliente** de Next.js encargado de manejar el proceso de autenticación de usuarios.  
Soporta dos flujos de login:

- Autenticación tradicional (usuario + contraseña)
- Autenticación mediante **Google OAuth** usando NextAuth

---

## Responsabilidades

- Gestionar el estado del formulario de login
- Enviar credenciales al backend para validación
- Manejar errores de autenticación
- Redirigir al usuario tras login exitoso
- Iniciar sesión mediante proveedor externo (Google)

---

## Dependencias

```ts
import UserInputs from "@/components/UserInputs"
import { AuthorizeInput } from "@/types/user.types"
import React, { useState } from "react"
import { handleLogin } from "./handleLogin"
import { useError } from "@/context/ErrorContext"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
```

### Dependencias clave

- **UserInputs**: componente reutilizable de inputs
- **AuthorizeInput**: contrato de datos para login
- **handleLogin**: función que valida credenciales contra backend
- **useError**: contexto global de errores
- **useRouter**: navegación programática
- **signIn**: autenticación con NextAuth

---

## Estado local

```ts
const [user, setUser] = useState<AuthorizeInput>({
  user: "",
  password: ""
})
```

Representa las **credenciales de autenticación** ingresadas por el usuario.

---

## Funciones internas

### handleUser

```ts
const handleUser = (
  e: React.ChangeEvent<HTMLInputElement>
) => { ... }
```

**Responsabilidad**:
- Actualiza el estado `user` dinámicamente según el input

**Patrón**:
- Controlled components
- Actualización inmutable del estado

---

### handleGoogleLogin

```ts
const handleGoogleLogin = () => {
  signIn("google", { callbackUrl: "/welcome" })
}
```

**Objetivo**:
- Iniciar sesión mediante Google OAuth
- Delegar autenticación a NextAuth
- Redirigir al usuario tras login exitoso

---

### handleForm

```ts
const handleForm = async (e: React.FormEvent) => { ... }
```

**Flujo**:

1. Previene el submit por defecto
2. Limpia errores previos
3. Llama a `handleLogin` con las credenciales
4. Maneja errores devueltos por el backend
5. Redirige al usuario si el login es exitoso

---

## Manejo de errores

```ts
const { setErrors } = useError()
```

- Los errores se centralizan en `ErrorContext`
- Permite mostrar mensajes consistentes en la UI
- Compatible con validaciones backend / frontend

---

## Navegación

```ts
router.push("/welcome")
```

- Se usa navegación programática
- Se ejecuta solo tras autenticación exitosa

---

## Renderizado

```tsx
<form onSubmit={handleForm}>
  <UserInputs handleUser={handleUser} mode="login" />
  <button type="button">Continuar con Google</button>
</form>
```

- El formulario delega inputs a `UserInputs`
- El botón de Google es explícitamente `type="button"` para evitar submit accidental

---

## Observaciones técnicas

- El login tradicional y OAuth conviven en la misma vista
- NextAuth maneja la sesión global
- La vista se mantiene enfocada en **flujo**, no en lógica de autenticación

---


## Ubicación

```
/app/(auth)/login/LoginPage.tsx
```

---

