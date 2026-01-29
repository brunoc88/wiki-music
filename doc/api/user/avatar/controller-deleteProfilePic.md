# Controller: deleteProfilePic

## Endpoint
`DELETE /api/user/avatar`

## Descripción
Elimina la imagen de perfil del usuario y restaura la imagen por defecto.

## Flujo
1. Verifica que el usuario exista y esté activo.
2. Si no tiene imagen personalizada, retorna OK.
3. Elimina la imagen del proveedor externo.
4. Actualiza la base de datos con la imagen por defecto.

## Respuesta
```json
{ "ok": true }
```
