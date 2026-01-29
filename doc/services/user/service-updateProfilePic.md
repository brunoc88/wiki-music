# Service: updateProfilePic

## Descripción
Actualiza la imagen de perfil del usuario en la base de datos.

## Responsabilidad
- Persistencia de la URL de la imagen.
- Persistencia del publicId del proveedor externo.

## Firma
```ts
updateProfilePic(userId: number, data: { pic: string; picPublicId: string }): Promise<User>
```

## Notas
No contiene lógica de negocio ni validaciones.
