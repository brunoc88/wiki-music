# Username Change – Controller (PATCH /api/user)

## Responsabilidad
El controlador orquesta el flujo del request:

1. Autenticación del usuario
2. Parseo del body
3. Validación del input con Zod
4. Delegación de la lógica de negocio al service
5. Manejo de errores centralizado

## Flujo

- Se obtiene el `userId` desde la sesión activa
- Se parsea el body del request
- Se valida contra `usernameChangeSchema`
- Si la validación falla:
  - Responde **400 Bad Request**
  - Devuelve errores de Zod estructurados
- Si la validación es correcta:
  - Se llama a `userService.changeUsername`
  - Se retorna **200 OK** con el resultado

## Respuesta exitosa
```json
{
  "username": "nuevo_username",
  "ok": true
}
```

## Manejo de errores
- Errores de validación → 400
- Errores de dominio (NotFound, Forbidden, etc.) → manejados por `errorHandler`

## Diseño
- El controller **no contiene lógica de negocio**
- Solo valida, delega y responde
