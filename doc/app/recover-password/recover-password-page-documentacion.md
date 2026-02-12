# Documentación - Componente RecoverPasswordPage

## 📍 Ubicación

`/app/auth/recover-password/RecoverPasswordPage.tsx`

------------------------------------------------------------------------

## 🧩 Descripción General

El componente `RecoverPasswordPage` gestiona la confirmación del proceso
de recuperación de contraseña mediante un token recibido por URL.

Permite al usuario:

-   Ingresar una nueva contraseña.
-   Validar la existencia del token.
-   Enviar la nueva contraseña junto con el token al backend.
-   Mostrar errores en caso de fallo.
-   Confirmar el éxito de la operación y redirigir al login.

------------------------------------------------------------------------

## 🏗 Estructura del Componente

### 1️⃣ Hooks Utilizados

``` ts
const router = useRouter()
const searchParams = useSearchParams()
const token = searchParams.get("token")
```

-   `useRouter`: permite redirigir programáticamente.
-   `useSearchParams`: obtiene parámetros de la URL.
-   `token`: se extrae desde la query string (`?token=...`).

------------------------------------------------------------------------

### 2️⃣ Estado Local

``` ts
const [password, setPassword] = useState<string>("")
const [error, setError] = useState<string | null>(null)
const [ok, setOk] = useState<boolean>(false)
```

Estados gestionados:

-   `password`: nueva contraseña ingresada.
-   `error`: mensaje de error a mostrar.
-   `ok`: indica si la recuperación fue exitosa.

------------------------------------------------------------------------

## 🔄 Manejo del Formulario

### 📤 handleSubmit

``` ts
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!token) {
    setError("Token inválido o ausente")
    return
  }

  const res = await handleForm(
    { newPassword: password, token },
    "recovery-confirm"
  )

  if (!res?.ok) {
    if (res.status === 403)
      setError("Token inválido o credenciales inválidas")
    else
      setError(res.error.newPassword)
    return
  }

  setOk(true)
}
```

### Flujo:

1.  Previene el envío tradicional del formulario.
2.  Verifica que el token exista.
3.  Llama a `handleForm` con:
    -   `newPassword`
    -   `token`
    -   modo `"recovery-confirm"`
4.  Maneja errores según el resultado.
5.  Si la operación es exitosa, actualiza `ok` a `true`.

------------------------------------------------------------------------

## ✅ Renderizado Condicional

### Cuando `ok === true`

``` tsx
<div>
  <p>Recuperacion de password Exitoso</p>
  <button onClick={()=>router.push('/auth/login')}>Salir</button>
</div>
```

Se muestra un mensaje de éxito y un botón para volver al login.

------------------------------------------------------------------------

### Cuando `ok === false`

Se renderiza:

-   Información sobre vencimiento del token.
-   Campo para ingresar nueva contraseña.
-   Botón de envío.
-   Mensajes de error si existen.
-   Botón para volver al login.

------------------------------------------------------------------------

## 🔐 Flujo General

1.  El usuario accede mediante un enlace con token.
2.  El token se extrae desde la URL.
3.  El usuario ingresa una nueva contraseña.
4.  Se envía la información al backend.
5.  El sistema:
    -   Muestra errores si existen.
    -   Confirma el éxito si la operación es válida.
    -   Permite volver al login.

------------------------------------------------------------------------

## 📌 Dependencias Utilizadas

-   `useState` (React)
-   `useRouter` (Next.js)
-   `useSearchParams` (Next.js)
-   `handleForm` (Capa de orquestación)

------------------------------------------------------------------------

**Autor:** Bruno\
**Contexto:** Confirmación de Recuperación de Contraseña -- Proyecto
WikiMusic
