# Controller: changeProfilePic

## Endpoint
`POST /api/user/avatar`

## Descripción
Cambia la imagen de perfil del usuario autenticado.

## Flujo
1. Verifica que el usuario exista y esté activo.
2. Valida que se haya enviado una imagen.
3. Sube la nueva imagen al proveedor externo.
4. Actualiza la base de datos con la nueva imagen.
5. Elimina la imagen anterior si existía.
6. Si ocurre un error, elimina la imagen recién subida (rollback).

## Respuesta
```json
{ "ok": true }
```

## Errores posibles
- 400 Imagen requerida
- 401 Usuario no autenticado
- 404 Usuario no encontrado
