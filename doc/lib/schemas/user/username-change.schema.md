# Username Change – Zod Schema

## Objetivo
Validar el payload recibido para el endpoint de cambio de nombre de usuario.

## Estructura esperada
```json
{
  "username": "string"
}
```

## Reglas de validación

- **string obligatorio**
- No puede estar vacío
- Mínimo **5** caracteres
- Máximo **20** caracteres
- Se eliminan espacios al inicio y final (`trim`)
- Se normaliza a **lowercase**
- No se permiten espacios internos

## Mensajes de error
- `Debe ingresar un nombre de usuario`
- `Min 5 caracteres`
- `Max 20 caracteres`
- `El username no puede contener espacios`

## Responsabilidad
Este schema garantiza:
- Datos normalizados antes de llegar al service
- Reglas de formato centralizadas
- Respuesta clara ante errores de input
