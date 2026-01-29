# Service: deleteProfilePic

## Descripción
Restablece la imagen del usuario a la imagen por defecto.

## Responsabilidad
- Actualiza la imagen por defecto.
- Elimina el publicId asociado.

## Firma
```ts
deleteProfilePic(userId: number, data: { pic: string; picPublicId: string | null }): Promise<User>
```

## Notas
No realiza operaciones externas.
