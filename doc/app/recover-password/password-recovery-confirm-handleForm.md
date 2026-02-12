# Documentación - handleForm (Confirmación de Recuperación de Contraseña)

## 📍 Ubicación

`/app/auth/recover-password/handleForm.ts`

------------------------------------------------------------------------

## 🧩 Descripción General

La función `handleForm` gestiona la lógica de confirmación del proceso
de recuperación de contraseña.

Su responsabilidad es:

-   Validar los datos recibidos según el modo.
-   Ejecutar la confirmación de recuperación mediante la API.
-   Normalizar la respuesta para que pueda ser consumida por la capa de
    UI.

------------------------------------------------------------------------

## 🏗 Estructura de la Función

``` ts
const handleForm = async (data: any, mode: string) => {
    const isValid = validateAccion(data, mode)

    if (!isValid.ok)
        return { ok: false, error: isValid.error }

    const res = await passwordRecoveryConfirm(data)

    if (res.ok)
        return { ok: true }
    else
        return { ok: false, error: res.error, status: res.status }
}
```

------------------------------------------------------------------------

## 🔄 Flujo de Ejecución

### 1️⃣ Validación de Datos

``` ts
const isValid = validateAccion(data, mode)
```

-   Se ejecuta la validación utilizando `validateAccion`.
-   El esquema aplicado depende del `mode` recibido.
-   Si la validación falla, la función retorna inmediatamente los
    errores correspondientes.

------------------------------------------------------------------------

### 2️⃣ Llamado a la API

``` ts
const res = await passwordRecoveryConfirm(data)
```

Si la validación es exitosa:

-   Se invoca la función `passwordRecoveryConfirm`.
-   Esta función se encarga de comunicarse con el backend.
-   Se envían los datos necesarios para confirmar la recuperación de
    contraseña (por ejemplo, token y nueva contraseña).

------------------------------------------------------------------------

### 3️⃣ Normalización de la Respuesta

La función devuelve una estructura estandarizada:

-   En caso de éxito:

``` ts
{ ok: true }
```

-   En caso de error:

``` ts
{ ok: false, error: res.error, status: res.status }
```

Esto permite que el componente que consume esta función maneje la
respuesta de forma uniforme.

------------------------------------------------------------------------

## 🧱 Responsabilidades

  Elemento                    Responsabilidad
  --------------------------- ------------------------------------------------------
  `validateAccion`            Validar los datos según el modo
  `passwordRecoveryConfirm`   Ejecutar la llamada al backend
  `handleForm`                Orquestar validación + API y normalizar la respuesta

------------------------------------------------------------------------

## 🔐 Rol en el Flujo de Recuperación

Esta función forma parte del segundo paso del proceso de recuperación:

1.  Usuario solicita recuperación.
2.  Recibe un token por correo electrónico.
3.  Ingresa nueva contraseña junto con el token.
4.  `handleForm` valida y confirma la operación.
5.  Se informa el resultado al usuario.

------------------------------------------------------------------------

## 📌 Dependencias

-   `validateAccion`
-   `passwordRecoveryConfirm`

------------------------------------------------------------------------

**Autor:** Bruno\
**Contexto:** Confirmación de Recuperación de Contraseña -- Proyecto
WikiMusic
