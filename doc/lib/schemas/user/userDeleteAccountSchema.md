# userDeleteAccountSchema

Esquema de validación utilizado para validar el request body del endpoint de eliminación de cuenta de usuario.

---

## Descripción

`userDeleteAccountSchema` es un esquema Zod que valida los datos necesarios para que un usuario autenticado pueda eliminar (desactivar) su cuenta.

Actualmente valida **un único campo**, pero de forma explícita y segura, garantizando:
- Presencia del campo
- Reglas mínimas de seguridad
- Mensajes de error claros para el cliente

---

## Definición del esquema

```ts
import { z } from 'zod'

const userDeleteAccountSchema = z.object({
  password: z
    .string()
    .nonempty('Debe ingresar un password')
    .min(6, 'Min 6 caracteres')
    .refine(v => !v.includes(' '), {
      message: 'El password no puede contener espacios',
    })
})

export default userDeleteAccountSchema
```

---

## Campos validados

### 🔐 password

| Regla | Descripción |
|-----|------------|
| Obligatorio | No puede ser `undefined` ni string vacío |
| Longitud mínima | 6 caracteres |
| Espacios | No se permiten espacios |
| Tipo | `string` |

---

## Errores posibles

Ejemplo de error de validación:

```json
{
  "error": {
    "password": [
      "Debe ingresar un password",
      "Min 6 caracteres"
    ]
  }
}
```

Los errores se devuelven en formato `fieldErrors` de Zod y son manejados por el controller.

---

## Uso en el controller

Este esquema se utiliza antes de ejecutar la lógica de negocio:

```ts
const parsed = await userDeleteAccountSchema.safeParseAsync(data)

if (!parsed.success) {
  return NextResponse.json(
    { error: parsed.error.flatten().fieldErrors },
    { status: 400 }
  )
}
```

Esto garantiza que:
- El service recibe datos válidos
- No se realizan consultas innecesarias a la base de datos
- La validación se mantiene fuera de la lógica de negocio

---

## Notas de diseño

- Se utiliza Zod para mantener validaciones declarativas y reutilizables.
- Aunque valida un solo campo, evita validaciones imperativas repetidas.
- Facilita testing y futura extensión (ej: confirmación adicional).

---

## Relación con seguridad

Validar el password en este nivel:
- Reduce inputs inválidos
- Evita lógica defensiva innecesaria en el service
- Mantiene el contrato del endpoint claro y predecible
