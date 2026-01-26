# User Security Question Schema

## Descripción

Este schema valida los datos necesarios para permitir al usuario actualizar su **pregunta de seguridad** y/o su **respuesta de seguridad**.

El diseño responde a la siguiente regla de negocio:

- La **respuesta de seguridad es obligatoria** en todos los casos.
- La **pregunta de seguridad es opcional**.
- Si el usuario cambia la pregunta, **obligatoriamente debe cambiar la respuesta**.
- Si el usuario no cambia la pregunta, puede **actualizar únicamente la respuesta**.

Este schema **no valida estado previo ni datos persistidos**, solo la forma y consistencia del payload.

---

## Definición del Schema

```ts
import { z } from "zod"

const userSecurtiyQuestionSchema = z.object({
  securityQuestion: z
    .string()
    .trim()
    .optional(),

  securityAnswer: z
    .string()
    .trim()
    .nonempty('Debe escribir una respuesta')
    .min(10, 'Min 10 caracteres')
})

export default userSecurtiyQuestionSchema
```

---

## Campos

### `securityAnswer` (obligatorio)

- Tipo: `string`
- Reglas:
  - No puede estar vacío
  - Debe tener al menos **10 caracteres**

Este campo siempre es requerido, ya que cualquier modificación de la pregunta de seguridad exige una nueva respuesta.

---

### `securityQuestion` (opcional)

- Tipo: `string`
- Reglas:
  - Se normaliza con `trim()`
  - Puede omitirse

Si se envía este campo, la lógica de negocio del servicio se encarga de validar que la pregunta sea distinta a la actual.

---

## Ejemplos de Payload

### ✅ Cambiar solo la respuesta

```json
{
  "securityAnswer": "mi nueva respuesta segura"
}
```

---

### ✅ Cambiar pregunta y respuesta

```json
{
  "securityQuestion": "¿Cuál fue el nombre de tu primera mascota?",
  "securityAnswer": "respuesta totalmente nueva"
}
```

---

### ❌ Payload inválido (falta la respuesta)

```json
{
  "securityQuestion": "¿En qué ciudad naciste?"
}
```

Respuesta esperada:

```json
{
  "securityAnswer": ["Debe escribir una respuesta"]
}
```

---

## Responsabilidad del Schema

Este schema se encarga exclusivamente de:

- Validar la presencia de campos obligatorios
- Validar formato y longitud
- Definir el contrato de entrada del endpoint

Las siguientes validaciones **no pertenecen al schema** y se manejan en la capa de servicio:

- Comparar si la respuesta es igual a la anterior
- Comparar si la pregunta es igual a la anterior
- Hashear la respuesta de seguridad
- Verificar estado del usuario

---

## Ubicación Recomendada

```
/lib/schemas/user/user.securityQuestion.schema.ts
```

Este archivo puede ser reutilizado en controladores, tests y documentación del proyecto.