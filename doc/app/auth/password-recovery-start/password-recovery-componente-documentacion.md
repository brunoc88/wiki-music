# Documentación - Componente PasswordRecovery

## 📍 Ubicación

`/app/auth/password-recovery-start/PasswordRecovery.tsx`

------------------------------------------------------------------------

## 🧩 Descripción General

El componente `PasswordRecovery` gestiona el flujo de recuperación de
contraseña desde el frontend.

Se encarga de:

-   Manejar el estado del formulario
-   Ejecutar la validación y solicitud al servidor mediante `handleForm`
-   Gestionar errores a través del `ErrorContext`
-   Redirigir al usuario en caso de éxito

------------------------------------------------------------------------

## 🏗 Estructura del Componente

### 1️⃣ Estado Local

``` ts
const [user, setUser] = useState<{
  email: string,
  securityQuestion: string,
  securityAnswer: string
}>({
  email: "",
  securityQuestion: "",
  securityAnswer: ""
})
```

Se almacena la información ingresada por el usuario en un objeto con
tres campos:

-   `email`
-   `securityQuestion`
-   `securityAnswer`

------------------------------------------------------------------------

### 2️⃣ Contexto de Errores

``` ts
const { errors, setErrors } = useError()
```

Se utiliza un contexto global para:

-   Acceder a los errores actuales
-   Actualizar los errores según el resultado del envío del formulario

------------------------------------------------------------------------

### 3️⃣ Modo de Operación

``` ts
let mode = 'recover'
```

Define el modo de validación que será utilizado por la función
`handleForm`.

------------------------------------------------------------------------

## 🔄 Manejo de Eventos

### ✏️ handleUser

``` ts
const handleUser = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target
  setUser(prev => ({ ...prev, [name]: value }))
}
```

Actualiza dinámicamente el estado `user` en función del campo
modificado.

------------------------------------------------------------------------

### 📤 handleSubmit

``` ts
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setErrors({})

  const res = await handleForm(user, mode)

  if (!res.ok) {
    if (res.status === 404)
      setErrors({ 'securityAnswer': ['usuario no encontrado'] })
    else if (res.status === 403)
      setErrors({ 'securityAnswer': ['credenciales invalidas'] })
    else
      setErrors(res.error ?? "error de servidor")
  } else {
    router.push('/auth/login')
  }
}
```

Flujo:

1.  Previene el comportamiento por defecto del formulario.
2.  Limpia errores previos.
3.  Ejecuta `handleForm`.
4.  Maneja errores según el código de estado HTTP.
5.  Redirige al login en caso de éxito.

------------------------------------------------------------------------

## 🧱 Renderizado

``` tsx
<form onSubmit={handleSubmit}>
  <UserInputs handleUser={handleUser} mode={'recover'} />
  {errors.service && <p>{errors.service[0]}</p>}
</form>
```

El formulario:

-   Utiliza el componente `UserInputs` para los campos.
-   Muestra errores del servicio si existen.
-   Ejecuta `handleSubmit` al enviarse.

------------------------------------------------------------------------

## 🔐 Flujo General

1.  El usuario completa los campos.
2.  Se actualiza el estado local.
3.  Al enviar el formulario:
    -   Se valida y consulta el servidor mediante `handleForm`.
    -   Se muestran errores si existen.
    -   Se redirige al login si la operación es exitosa.

------------------------------------------------------------------------

## 📌 Dependencias Utilizadas

-   `useState` (React)
-   `useRouter` (Next.js)
-   `useError` (Context API personalizado)
-   `handleForm` (Capa de orquestación)
-   `UserInputs` (Componente de inputs reutilizable)

------------------------------------------------------------------------

**Autor:** Bruno\
**Contexto:** Flujo de Recuperación de Contraseña -- Proyecto WikiMusic
