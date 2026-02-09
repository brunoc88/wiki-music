# authorizeUser – Autenticación por Credenciales

Este documento describe el funcionamiento y las decisiones de diseño de la función `authorizeUser`, utilizada por **NextAuth CredentialsProvider** para autenticar usuarios contra la base de datos.

---

## 1. Responsabilidad de la función

`authorizeUser` implementa la **autenticación real** del usuario.

Su rol es:

- Buscar al usuario en la base de datos
- Verificar que la cuenta esté activa
- Validar la contraseña ingresada
- Devolver un objeto de usuario normalizado
- Retornar `null` ante cualquier fallo

NextAuth **requiere explícitamente** este comportamiento para permitir o denegar el login.

---

## 2. Firma y tipos

### Input – `AuthorizeInput`

- `user: string`
  - Puede ser email o username
- `password: string`
  - Password plano ingresado por el usuario

### Output – `AuthorizedUser | null`

- `null` → autenticación fallida
- Objeto → autenticación exitosa

Este contrato es clave para el flujo del `CredentialsProvider`.

---

## 3. Búsqueda del usuario

El usuario se busca por **email o username**:

- Permite login flexible
- Evita duplicar lógica en frontend
- Simplifica UX sin comprometer seguridad

Se utiliza un `OR` para cubrir ambos casos en una sola query.

---

## 4. Validación de existencia y estado

```ts
if (!userDB || !userDB.state) return null
```

Este paso es crítico:

- Bloquea usuarios inexistentes
- Impide login de cuentas:
  - Suspendidas
  - Desactivadas
  - Dadas de baja por un admin

La validación del estado ocurre **antes** de verificar la contraseña, lo cual:

- Reduce trabajo innecesario
- Evita filtrar información sensible

---

## 5. Validación de contraseña

La contraseña se valida usando hashing seguro:

- `bcrypt.compare(password, userDB.password)`
- Nunca se desencripta el password
- Nunca se devuelve información sobre qué falló

Esto previene:

- User enumeration
- Filtrado de credenciales
- Ataques de fuerza bruta con feedback detallado

---

## 6. Normalización del usuario autenticado

Si la autenticación es exitosa, se devuelve **solo la información mínima necesaria**:

- `id`
- `email`
- `username`
- `rol`

No se exponen:

- Password
- Estado interno
- Metadata sensible

Esto mantiene el JWT liviano y seguro.

---

## 7. Relación con NextAuth

El objeto retornado por `authorizeUser`:

- Se inyecta en el callback `jwt`
- Se persiste dentro del token
- Se replica luego en `session.user`

Si la función retorna `null`, NextAuth:

- Cancela el login
- Devuelve error genérico de credenciales

---

## 8. Decisiones de diseño

- Validar estado antes que password
- No diferenciar mensajes de error
- Devolver el mínimo de datos posibles
- Centralizar la lógica de autenticación en backend

Estas decisiones fortalecen la seguridad y la mantenibilidad del sistema.

---

## 9. Conclusión

`authorizeUser` es una pieza crítica del sistema de autenticación:

- Simple
- Segura
- Predecible
- Fácil de testear

Cumple correctamente con las expectativas de NextAuth y con buenas prácticas de seguridad.
