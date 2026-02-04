# registerUser API

## Ubicación
`/src/lib/auth/api/registerUser.ts`

## Propósito
La función `registerUser` se encarga de enviar los datos de registro del usuario al backend y procesar la respuesta del servidor.

## Firma
```ts
registerUser(formData: FormData): Promise<{
  ok: boolean
  user?: userValid
  error?: string
}>
```

## Parámetros

### formData: FormData
Objeto `FormData` que contiene los datos del formulario de registro, incluyendo campos de texto y opcionalmente un archivo.

## Flujo de ejecución

1. Se realiza una petición HTTP `POST` a la ruta `/api/user`.
2. El cuerpo de la petición es el `FormData` recibido.
3. Se espera la respuesta del servidor y se convierte a JSON.
4. Si la respuesta HTTP no es exitosa (`res.ok === false`):
   - Se retorna un objeto con `ok: false`.
   - Se incluye el mensaje de error proveniente del backend o un mensaje genérico.
5. Si la respuesta es exitosa:
   - Se extrae el objeto `user` del cuerpo de la respuesta.
   - Se tipa como `userValid`.
   - Se retorna un objeto con `ok: true` y el usuario registrado.

## Valores de retorno

### Caso error
```ts
{
  ok: false,
  error: string
}
```

### Caso éxito
```ts
{
  ok: true,
  user: userValid
}
```

## Tipos involucrados

### userValid
Tipo importado desde `@/types/user.types`, representa la estructura del usuario válido retornado por el backend.
