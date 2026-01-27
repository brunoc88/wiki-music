# Username Change – Service

## Responsabilidad
Contener la lógica de negocio para el cambio de nombre de usuario.

## Flujo interno

1. Buscar el usuario por `userId`
2. Verificar que el usuario exista
3. Verificar que el usuario esté activo
4. Ejecutar el cambio de username en el repositorio
5. Retornar el resultado normalizado

## Validaciones de dominio

- **Usuario inexistente**
  - Lanza `NotFoundError`
- **Usuario inactivo**
  - Lanza `ForbiddenError`

Estas validaciones **no pertenecen al controller**, ya que representan reglas de negocio.

## Respuesta del service
```json
{
  "username": "nuevo_username",
  "ok": true
}
```

## Diseño
- El service **confía en que el input ya fue validado**
- No conoce HTTP ni Zod
- Solo reglas de negocio y coordinación con el repositorio

## Beneficios
- Alta reutilización
- Fácil testeo unitario
- Separación clara de responsabilidades
