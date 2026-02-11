# 🧠 Function Naming Cheat Sheet (Backend & Frontend)

Guía práctica para elegir correctamente el nombre de tus funciones según
su intención.

------------------------------------------------------------------------

# 1️⃣ Funciones que responden preguntas (Boolean)

Usar cuando la función devuelve `true` o `false`.

## Prefijos recomendados:

-   `is`
-   `has`
-   `can`
-   `should`

## Ejemplos:

``` ts
isAdmin(user)
hasPermission(user, action)
canEditPost(user, post)
shouldRefreshToken(token)
```

📌 Regla:\
Si responde una pregunta → empieza con `is`, `has`, `can` o `should`.

------------------------------------------------------------------------

# 2️⃣ Validaciones formales

Usar cuando validás datos de entrada (formulario, request body, DTO).

## Prefijo:

-   `validate`

## Ejemplos:

``` ts
validateRegisterInput(data)
validatePasswordStrength(password)
validateUserUpdate(payload)
```

📌 Se usa cuando: - Puede devolver estructura de errores - Puede lanzar
excepción - Es validación estructural (ej: Zod)

------------------------------------------------------------------------

# 3️⃣ Reglas obligatorias (cortan ejecución)

Cuando algo es obligatorio y si falla debe interrumpir el flujo.

## Prefijo:

-   `require`

## Ejemplos:

``` ts
requireAuth(req)
requireRole(user, "ADMIN")
requireActiveSession(session)
```

📌 Muy común en middlewares.

------------------------------------------------------------------------

# 4️⃣ Guard (protección de flujo)

Más arquitectónico. Protege acceso a rutas o acciones.

## Ejemplos:

``` ts
authGuard()
adminGuard()
```

📌 Similar a `require`, pero más conceptual.\
Más común en Angular / NestJS.

------------------------------------------------------------------------

# 5️⃣ Afirmaciones internas (errores de programación)

Cuando si falla, es un bug del sistema, no error del usuario.

## Prefijo:

-   `assert`

## Ejemplos:

``` ts
assertUserExists(user)
assertNever(value)
```

📌 Se usa para garantizar invariantes internas.

------------------------------------------------------------------------

# 6️⃣ Verificaciones con posible efecto

Cuando verificás algo que puede lanzar error o hacer algo más.

## Prefijo:

-   `check`

## Ejemplos:

``` ts
checkRateLimit(req)
checkUserSuspended(user)
```

------------------------------------------------------------------------

# 7️⃣ Asegurar estado

Cuando la función garantiza que algo exista o esté listo.

## Prefijo:

-   `ensure`

## Ejemplos:

``` ts
ensureUserProfile(user)
ensureDirectoryExists(path)
```

------------------------------------------------------------------------

# 8️⃣ Manejo de eventos

Cuando la función es punto de entrada.

## Prefijo:

-   `handle`

## Ejemplos:

``` ts
handleLogin(req, res)
handleSubmit(formData)
handleError(error)
```

------------------------------------------------------------------------

# 9️⃣ Crear / Construir

## `create`

Crea algo nuevo (generalmente persistido)

``` ts
createUser(data)
createSession(userId)
```

## `build`

Construye algo complejo (no necesariamente persiste)

``` ts
buildUserResponse(user)
buildQueryFilters(params)
```

------------------------------------------------------------------------

# 🔟 Transformaciones

Cuando cambias estructura o formato.

## Prefijos:

-   `map`
-   `format`
-   `transform`

## Ejemplos:

``` ts
mapUserToDTO(user)
formatDate(date)
transformApiResponse(data)
```

------------------------------------------------------------------------

# 1️⃣1️⃣ Casos de uso (Nivel profesional)

Usar verbos del dominio del negocio.

❌ Malo:

``` ts
processUser()
doStuff()
manageData()
```

✅ Mejor:

``` ts
registerUser()
authorizeUser()
suspendUserAccount()
invalidateRefreshToken()
activateUserSession()
```

------------------------------------------------------------------------

# 🔥 Regla Mental Rápida

  Situación               Nombre recomendado
  ----------------------- ------------------------------
  Devuelve boolean        `is`, `has`, `can`
  Valida datos            `validate`
  Debe cortar ejecución   `require`
  Es regla interna        `assert`
  Asegura estado          `ensure`
  Maneja evento           `handle`
  Crea algo               `create`
  Transforma datos        `map`, `format`, `transform`
  Acción del negocio      Verbo de dominio

------------------------------------------------------------------------

# 🧩 Regla de Oro

El nombre debe responder:

> ¿Qué intención tiene esta función?

Si el nombre no comunica intención clara → está mal nombrada.
