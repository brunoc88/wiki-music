# securityQuestionUpdate Service

## Descripción

Este método implementa la **lógica de negocio** para actualizar la **respuesta de seguridad** del usuario y, opcionalmente, su **pregunta de seguridad**.

El servicio asume que los datos de entrada ya fueron validados por el schema correspondiente y se encarga de validar **estado**, **reglas de seguridad** y **persistencia**.

---

## Firma del método

```ts
securityQuestionUpdate: async (
  data: { securityQuestion?: string; securityAnswer: string },
  userId: number
): Promise<{ ok: true }>
```

---

## Reglas de negocio

- La **respuesta de seguridad es obligatoria** en todos los casos.
- La **pregunta de seguridad es opcional**.
- No se permite:
  - Reutilizar la misma respuesta de seguridad.
  - Reutilizar la misma pregunta de seguridad.
- Si se envía una nueva pregunta, se actualizan **ambos campos**.
- Si no se envía una pregunta, se actualiza **solo la respuesta**.
- La respuesta de seguridad se **hashea siempre** antes de persistirse.

---

## Implementación

```ts
securityQuestionUpdate: async (
  data: { securityQuestion?: string; securityAnswer: string },
  userId: number
): Promise<{ ok: true }> => {
  let { securityQuestion, securityAnswer } = data

  let user = await requireActiveUserById(userId)

  if (securityQuestion && securityQuestion === user.securityQuestion) {
    throw new ForbiddenError('La pregunta no puede ser la misma')
  }

  const isSameAnswer = await bcrypt.compare(securityAnswer, user.securityAnswer)
  if (isSameAnswer) {
    throw new ForbiddenError('La respuesta no puede ser la misma')
  }

  const hashedSecurityAnswer = await bcrypt.hash(securityAnswer, 10)

  const userToUpdate = {
    securityAnswer: hashedSecurityAnswer,
    ...(securityQuestion && { securityQuestion })
  }

  await userRepo.securityQuestionUpdate(userToUpdate, userId)

  return { ok: true }
}
```

---

## Construcción dinámica del objeto de actualización

La siguiente línea es clave en el diseño del método:

```ts
...(securityQuestion && { securityQuestion })
```

### ¿Qué hace?

> **Agrega la propiedad `securityQuestion` al objeto solo si existe un valor válido.**

---

### Funcionamiento simplificado

- `securityQuestion` proviene de la desestructuración del input.
- Se evalúa si tiene valor (no `undefined`).

#### Caso 1: no se envía `securityQuestion`

```ts
securityQuestion = undefined
```

Resultado:

```ts
{
  securityAnswer: hashedSecurityAnswer
}
```

No se agrega ninguna propiedad extra.

---

#### Caso 2: se envía `securityQuestion`

```ts
securityQuestion = "¿Cuál fue tu primera mascota?"
```

Resultado:

```ts
{
  securityAnswer: hashedSecurityAnswer,
  securityQuestion: "¿Cuál fue tu primera mascota?"
}
```

La propiedad se agrega dinámicamente.

---

### Equivalente en forma explícita

El patrón anterior es exactamente equivalente a escribir:

```ts
const userToUpdate = {
  securityAnswer: hashedSecurityAnswer
}

if (securityQuestion) {
  userToUpdate.securityQuestion = securityQuestion
}
```

Se utiliza la versión con spread por ser:

- Más concisa
- Más expresiva
- Muy común en actualizaciones parciales

---

## Responsabilidades del servicio

Este servicio se encarga de:

- Validar la existencia del usuario
- Validar el estado del usuario
- Aplicar reglas de negocio
- Hashear información sensible
- Preparar un objeto de actualización limpio

No es responsabilidad de este servicio:

- Validar formato del input (schema)
- Manejar autenticación
- Exponer datos al cliente

---

## Resultado

Si todas las validaciones se cumplen correctamente, el método retorna:

```json
{
  "ok": true
}
```

---

## Ubicación sugerida

```
/services/user.service.ts
```

---

## Observación final

El uso de construcción dinámica de objetos permite mantener el servicio:

- Flexible
- Seguro
- Fácil de mantener

Este patrón es especialmente útil en endpoints de **actualización parcial**.

