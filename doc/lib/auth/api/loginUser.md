# loginUser API

## Ubicación
`/src/lib/auth/api/loginUser.ts`

## Propósito
La función `loginUser` se encarga de autenticar al usuario utilizando NextAuth con el proveedor de credenciales.

## Firma
```ts
loginUser(data: AuthorizeInput): Promise<{
  ok?: true
  error?: string
}>
```

## Parámetros

### data: AuthorizeInput
Objeto que contiene las credenciales ingresadas por el usuario.

Campos esperados:
- `user`: string
- `password`: string

## Flujo de ejecución

1. Se extraen los valores `user` y `password` del objeto recibido.
2. Se invoca la función `signIn` de NextAuth con el provider `"credentials"`.
3. Se deshabilita la redirección automática (`redirect: false`).
4. Se define una URL de callback (`/home`) en caso de autenticación exitosa.
5. Se evalúa la respuesta retornada por `signIn`.

## Valores de retorno

### Caso error
Cuando la autenticación falla o la respuesta no es válida:
```ts
{
  error: "credenciales invalidas"
}
```

### Caso éxito
Cuando la autenticación es exitosa:
```ts
{
  ok: true
}
```

## Dependencias

- `next-auth/react`: utilizada para manejar la autenticación.
- `AuthorizeInput`: tipo importado desde `@/types/user.types`.
