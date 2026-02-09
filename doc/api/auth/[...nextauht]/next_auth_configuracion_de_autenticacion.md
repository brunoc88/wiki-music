# Autenticación – NextAuth

Este documento describe la configuración de **NextAuth** utilizada en el proyecto, explica el flujo de autenticación, los callbacks personalizados y el comportamiento por defecto de las **sesiones y expiración**, incluyendo un ejemplo de cómo personalizarlas.

---

## 1. Visión general

La autenticación del proyecto está implementada con **NextAuth** usando:

- **Credentials Provider** (email/usuario + password)
- **Google Provider** (OAuth)
- **Sesiones basadas en JWT** (sin adapter)

La sesión se maneja íntegramente en el cliente mediante JWT firmados por NextAuth.

---

## 2. Providers configurados

### 2.1 CredentialsProvider

Permite autenticar usuarios usando credenciales propias del sistema.

Flujo:
1. El usuario envía `user` (email o username) y `password`.
2. Las credenciales se validan con **Zod** (`LoginSchema`).
3. Se delega la autenticación real a `authorizeUser`.
4. Si las credenciales son válidas, se devuelve un objeto **user** que será persistido en el JWT.

Campos expuestos al token:
- `id`
- `email`
- `name` (username)
- `rol`

Si la validación falla en cualquier paso, se retorna `null` y la autenticación es rechazada.

---

### 2.2 GoogleProvider

Permite login mediante Google OAuth.

- Usa `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`.
- El manejo del usuario final se unifica luego en los callbacks (`jwt` / `session`).

---

## 3. Callbacks

Los callbacks permiten **controlar qué información vive en el JWT** y **qué se expone en la sesión**.

### 3.1 Callback `jwt`

Responsabilidad:
- Persistir datos del usuario dentro del **JWT**.
- Actualizar campos del token cuando se llama a `update()` desde el cliente.

Comportamiento:

- **Login inicial**
  - Cuando `user` existe, se hidrata el token con:
    - `id`
    - `email`
    - `name`
    - `picture`
    - `rol`

- **Actualización desde el cliente (`useSession().update`)**
  - Cuando `trigger === "update"`, se sincronizan cambios puntuales (ej: `name`).
  - Esto permite reflejar cambios como **username** sin forzar logout.

Este diseño evita inconsistencias entre backend, JWT y UI (navbar, header, etc.).

---

### 3.2 Callback `session`

Responsabilidad:
- Copiar los datos del JWT a `session.user`.

Resultado:
- El frontend accede a información consistente mediante `useSession()`:
  - `session.user.id`
  - `session.user.email`
  - `session.user.name`
  - `session.user.image`
  - `session.user.rol`

La sesión **no consulta al backend**: todo proviene del JWT.

---

## 4. Estrategia de sesión

### Estrategia utilizada

- **JWT-based session** (`strategy: "jwt"`)
- No se utiliza adapter ni base de datos para sesiones.

Esto implica:
- La sesión vive en una cookie firmada.
- No hay lookup a DB en cada request.
- El control de seguridad se basa en invalidaciones lógicas (logout, cambios críticos, etc.).

---

## 5. Expiración de sesión (default)

Aunque no esté configurado explícitamente, **NextAuth aplica valores por defecto**.

### Valores por defecto

- **Duración del JWT**: 30 días
- **Sliding session**: sí
  - Cada request válida renueva el `exp` del token.

Esto significa:
- Si el usuario usa la app regularmente → la sesión se mantiene activa.
- Si el usuario no interactúa durante 30 días → la sesión expira automáticamente.

Este comportamiento es adecuado para la mayoría de aplicaciones estándar.

---

## 6. Invalidación de sesión por lógica de negocio

Independientemente de la expiración temporal, el proyecto implementa **invalidaciones explícitas**:

- Cambio de password → `signOut`
- Eliminación de cuenta → `signOut`
- Cuenta suspendida / inexistente → `401 / 403` → `signOut`

Este enfoque es más importante que el timeout, ya que garantiza seguridad inmediata ante eventos críticos.

---

## 7. Personalizar expiración de sesión (opcional)

Si en el futuro se requiere mayor control (ej: app sensible), se puede personalizar.

### Ejemplo conceptual

- Reducir duración total de sesión
- Controlar frecuencia de refresh

Parámetros disponibles:

- `session.maxAge` → duración total de la sesión
- `jwt.maxAge` → duración del token JWT

Ejemplo típico:
- Sesión válida por **1 hora**
- Refresh cada **15 minutos**

Este tipo de configuración es recomendable solo cuando el dominio lo requiere.

---

## 8. Conclusión

- La configuración actual es **correcta y segura** para el proyecto.
- Se aprovechan los defaults de NextAuth sin sobreconfigurar.
- Las invalidaciones manuales cubren los casos críticos.
- El diseño es consistente entre backend, JWT y UI.

Este setup es sólido, mantenible y listo para producción.

