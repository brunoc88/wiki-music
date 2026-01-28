# Password Recovery – Start Endpoint

## Schema de validación (Zod)

```ts
import { z } from "zod"

const userPasswordRecoverySchema = z.object({
  email: z
    .string()
    .email()
    .nonempty('Ingrese un email'),

  securityQuestion: z
    .string()
    .nonempty('Debe seleccionar una pregunta'),

  securityAnswer: z
    .string()
    .nonempty('Debe escribir una respuesta')
    .min(10, 'Min 10 caracteres')
})

export default userPasswordRecoverySchema
```

### Explicación
- **email**: valida formato correcto y evita strings vacíos.
- **securityQuestion**: obliga a que el usuario seleccione una pregunta válida.
- **securityAnswer**: exige un mínimo de 10 caracteres para evitar respuestas triviales.

Este schema se usa en el controlador para **cortar temprano** requests inválidas antes de llegar al service.
