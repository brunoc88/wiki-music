# Login con NextAuth (CredentialsProvider)

## Descripción

Este documento explica **cómo funciona el flujo de login en NextAuth**
cuando se utiliza `CredentialsProvider`, y por qué **no se devuelven errores
específicos** como en un backend tradicional (Express, Nest, etc.).

El objetivo de este diseño es mejorar la **seguridad** y la **experiencia de usuario (UX)**.

---

## Diferencia clave con un backend tradicional

### Backend clásico (Express / Nest)

En un login tradicional, el backend suele devolver distintos códigos HTTP:

- `400` → Datos inválidos
- `404` → Usuario no encontrado
- `403` → Usuario inactivo
- `401` → Password incorrecto

Esto **no es recomendable en autenticación**, ya que permite inferir información
sensible (user enumeration).

---

### NextAuth (CredentialsProvider)

NextAuth **no expone el motivo exacto del fallo de autenticación**.

En su lugar:
- Devuelve **`null`** cuando las credenciales no son válidas.
- El frontend recibe una respuesta genérica.

Esto es **intencional y correcto**.

---

## CredentialsProvider — authorize

```ts
async authorize(credentials) {
  if (!credentials) return null
  if (!user) return null
  if (!passwordMatch) return null

  return user
}
```

### Significado de `return null`

`return null` indica:

> "La autenticación falló, sin especificar el motivo"

No diferencia entre:
- Usuario inexistente
- Password incorrecto
- Credenciales inválidas

---

## Uso de signIn en el frontend

```ts
const res = await signIn("credentials", {
  redirect: false,
  user,
  password
})
```

### Respuesta de signIn

```ts
{
  ok: boolean
  error: string | null
  status: number
  url: string | null
}
```

---

## Manejo de errores en el frontend

### Login fallido

```ts
if (!res?.ok) {
  setError("Usuario o contraseña inválidos")
  return
}
```

- `res.ok === false`
- `res.error === "CredentialsSignin"`
- El mensaje al usuario debe ser **genérico**.

---

### Login exitoso

```ts
if (res?.ok) {
  router.push("/dashboard")
}
```

- Se crea la sesión.
- Se redirige al usuario.

---

## Códigos HTTP implícitos

Aunque no se ve explícitamente:

- Fallo de autenticación → **401 Unauthorized**
- Login exitoso → **200 OK**

NextAuth abstrae estos detalles para simplificar el flujo.

---

## Casos especiales

### Usuario inactivo / bloqueado

En estos casos **sí se puede diferenciar**:

```ts
throw new Error("Cuenta inactiva")
```

Esto permite mostrar un mensaje específico:

> "Tu cuenta está deshabilitada"

⚠️ No usar esto para:
- Usuario inexistente
- Password incorrecto

---

## Buenas prácticas

- Usar mensajes genéricos en login.
- No revelar si un usuario existe.
- No diferenciar errores de credenciales.
- Delegar la gestión de sesión a NextAuth.

---

## Resumen

- NextAuth devuelve `user` o `null`, no errores detallados.
- `signIn()` indica éxito o fallo con `ok`.
- El frontend decide el mensaje genérico.
- Este enfoque mejora seguridad y UX.

---

## Nota final

Este diseño puede resultar confuso al venir de backend tradicional,
pero es el **estándar recomendado para autenticación moderna**.
