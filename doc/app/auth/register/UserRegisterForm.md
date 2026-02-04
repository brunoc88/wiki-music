# UserRegisterForm – Documentación

## Descripción general

`UserRegisterForm` es un **componente cliente** de Next.js encargado de manejar el registro de usuarios desde el frontend.  
Su responsabilidad principal es:

- Gestionar el estado del formulario de registro
- Enviar los datos al backend usando `FormData`
- Manejar errores de validación provenientes del servidor
- Ejecutar **auto sign-in** del usuario tras un registro exitoso

---

## Responsabilidades

- Capturar los datos ingresados por el usuario
- Construir el `FormData`, incluyendo archivo opcional
- Invocar la función `handleForm` para enviar el registro
- Mostrar errores globales usando `ErrorContext`
- Autenticar automáticamente al usuario con `next-auth`

---

## Dependencias

```ts
import UserInputs from '@/components/UserInputs'
import { useState } from 'react'
import { RegisterUserFront } from '@/types/user.types'
import { handleForm } from './handleForm'
import { useError } from '@/context/ErrorContext'
import { signIn } from 'next-auth/react'
```

### Dependencias clave

- **UserInputs**: componente reutilizable de inputs
- **RegisterUserFront**: contrato de datos del formulario
- **handleForm**: función que envía el registro al backend
- **useError**: contexto global de errores
- **signIn**: autenticación vía NextAuth

---

## Estado local

```ts
const [user, setUser] = useState<RegisterUserFront>({
  email: '',
  username: '',
  securityQuestion: '',
  securityAnswer: '',
  password: '',
  password2: ''
})
```

Este estado representa el **modelo del formulario de registro** en el frontend.

---

## Funciones internas

### handleUser

```ts
const handleUser = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => { ... }
```

**Responsabilidad**:
- Actualiza dinámicamente el estado `user`
- Funciona para inputs y selects

**Patrón usado**:
- Controlled components
- Actualización inmutable del estado

---

### handleSubmit

```ts
const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => { ... }
```

**Flujo**:

1. Previene el submit por defecto
2. Limpia errores previos
3. Construye un `FormData` con los campos del usuario
4. Adjunta archivo si existe
5. Llama a `handleForm(formData)`
6. Maneja errores del backend
7. Ejecuta **sign-in automático** si el registro fue exitoso

---

## Auto Sign-in

```ts
signIn('credentials', {
  user: result.user?.email,
  password: user.password,
  callbackUrl: '/welcome'
})
```

**Objetivo**:
- Loguear automáticamente al usuario tras registrarse
- Evitar que tenga que volver al login manualmente

**Proveedor**:
- `credentials` (NextAuth)

---

## Manejo de errores

Los errores se manejan mediante un **ErrorContext global**:

```ts
const { setErrors } = useError()
```

Esto permite:
- Centralizar errores
- Mostrar mensajes consistentes en distintas vistas

---

## Renderizado

```tsx
<form onSubmit={handleSubmit}>
  <UserInputs handleUser={handleUser} mode="register" />
</form>
```

El formulario delega los inputs al componente `UserInputs`, manteniendo esta vista enfocada en **lógica y flujo**, no en detalles visuales.

---

## Observaciones técnicas

- El uso de `FormData` permite:
  - Envío de archivos
  - Compatibilidad con endpoints multipart
- Las promesas no están tipadas explícitamente:
  - No bloquea el funcionamiento actual
  - Puede refactorizarse más adelante sin romper el flujo



---

## Ubicación

```
/app/(auth)/register/UserRegisterForm.tsx
```

---

