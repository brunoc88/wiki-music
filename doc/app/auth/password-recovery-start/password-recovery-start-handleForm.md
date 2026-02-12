# Password Recovery Start - Documentación de handleForm

## 📍 Ubicación

`/app/auth/password-recovery-start`

------------------------------------------------------------------------

## 🧩 Descripción General

La función `handleForm` actúa como una capa de orquestación entre:

-   La lógica de validación en frontend (`validateAccion` usando
    esquemas Zod)
-   La capa de comunicación con la API (`passwordRecoveryStart` usando
    fetch)

Su objetivo es garantizar la integridad de los datos antes de realizar
la petición al servidor y normalizar la respuesta para la capa de UI.

------------------------------------------------------------------------

## 🔄 Explicación del Flujo

### 1️⃣ Validación en el Cliente

``` ts
const isValid = validateAccion(data, mode)
```

-   La validación se ejecuta según el `mode` recibido.
-   Cada modo corresponde a un esquema Zod específico.
-   Si la validación falla, la función corta la ejecución y devuelve los
    errores estructurados.

``` ts
if (!isValid.ok) {
  return { ok: false, error: isValid.error }
}
```

Esto evita llamadas innecesarias al servidor y mejora la experiencia del
usuario.

------------------------------------------------------------------------

### 2️⃣ Llamado a la API

``` ts
const res = await passwordRecoveryStart(data)
```

Si la validación es exitosa, se realiza la petición al backend mediante
`passwordRecoveryStart`, que internamente utiliza `fetch`.

------------------------------------------------------------------------

### 3️⃣ Normalización de la Respuesta

``` ts
if (res.ok) return { ok: true }
else return { ok: false, error: res.error, status: res.status }
```

La función estandariza la estructura de la respuesta para que la UI
pueda manejar consistentemente:

-   Éxito → `{ ok: true }`
-   Error → `{ ok: false, error, status }`

------------------------------------------------------------------------

## 🛡 ¿Por qué Validación Doble?

La validación se realiza tanto en:

-   Frontend (Zod)
-   Backend (validación del servidor)

### Motivos:

1.  **Experiencia de Usuario (UX)** -- Feedback inmediato sin esperar la
    respuesta del servidor.
2.  **Seguridad** -- El frontend puede ser manipulado, por lo que el
    backend debe validar siempre.
3.  **Integridad de Datos** -- Garantiza consistencia en el contrato
    entre cliente y servidor.
4.  **Optimización** -- Reduce requests innecesarias.

------------------------------------------------------------------------

## 🧱 Responsabilidad Arquitectónica

  Capa                      Responsabilidad
  ------------------------- --------------------------------------------
  `validateAccion`          Validar datos según el modo
  `passwordRecoveryStart`   Comunicación con la API
  `handleForm`              Orquestación y normalización de respuestas

------------------------------------------------------------------------

## 🧠 Patrón Aplicado

Se observa un patrón ligero de service layer:

-   UI → llama a `handleForm`
-   `handleForm` → valida + llama a la API
-   API → se comunica con el servidor

Esto promueve:

-   Separación de responsabilidades
-   Mantenibilidad
-   Testabilidad
-   Flujo de control claro

------------------------------------------------------------------------

## ✅ Resumen

La función `handleForm`:

-   Evita llamadas innecesarias al servidor
-   Estructura los errores de forma consistente
-   Separa validación de transporte
-   Normaliza respuestas
-   Mejora la experiencia del usuario sin comprometer la seguridad

------------------------------------------------------------------------

**Autor:** Bruno\
**Contexto:** Flujo de Recuperación de Contraseña -- Proyecto WikiMusic
