# PATCH /api/user/security-question

## Descripción

Este endpoint permite al usuario autenticado **actualizar su respuesta de seguridad** y, opcionalmente, **actualizar también su pregunta de seguridad**.

Está diseñado bajo un modelo de **actualización parcial**, con reglas de negocio claras y validaciones en capas.

---

## Autenticación

🔒 **Requiere sesión activa**

El endpoint solo puede ser utilizado por un usuario autenticado. El `userId` se obtiene desde la sesión del servidor.

Si no existe una sesión válida, el request será rechazado.

---

## Request

### Método

```
PATCH
```

### Content-Type

```
application/json
```

---

## Body

El cuerpo del request debe cumplir con el siguiente contrato:

### Schema

```ts
{
  securityQuestion?: string
  securityAnswer: string
}
```

### Reglas

- `securityAnswer` es **obligatorio** en todos los casos.
- `securityQuestion` es **opcional**.
- Si se envía `securityQuestion`, se actualizarán **ambos campos**.
- Si no se envía `securityQuestion`, se actualizará **solo la respuesta**.

---

## Ejemplos de Request

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

### ❌ Request inválido (falta la respuesta)

```json
{
  "securityQuestion": "¿En qué ciudad naciste?"
}
```

Respuesta:

```json
{
  "error": {
    "securityAnswer": ["Debe escribir una respuesta"]
  }
}
```

---

## Response

### ✅ Success — 200 OK

```json
{
  "ok": true
}
```

---

## Errores

### 400 Bad Request

- El body no cumple con el schema
- Tipos inválidos

```json
{
  "error": {
    "securityAnswer": ["Min 10 caracteres"]
  }
}
```

---

### 401 Unauthorized

- El usuario no posee una sesión válida

---

### 403 Forbidden

- El usuario se encuentra inactivo
- La respuesta de seguridad es igual a la anterior
- La pregunta de seguridad es igual a la anterior

---

### 404 Not Found

- El usuario no existe

---

## Flujo Interno (Resumen)

1. Se valida la sesión del usuario
2. Se parsea y valida el body contra el schema
3. Se ejecutan reglas de negocio:
   - Verificación de estado del usuario
   - Comparación de respuesta previa
   - Comparación de pregunta previa (si aplica)
4. La nueva respuesta se **hashea** antes de persistir
5. Se actualizan los datos en la base de datos

---

## Notas de Seguridad

- La respuesta de seguridad **nunca se almacena en texto plano**
- Todas las comparaciones se realizan mediante hashing seguro
- El endpoint no expone información sensible

---

## Ubicación

```
/api/user/security-question/route.ts
```

---

## Observaciones

Este endpoint centraliza la gestión de seguridad del usuario y mantiene una separación clara entre:

- Validación de datos (schema)
- Autenticación (sesión)
- Reglas de negocio (service)
- Persistencia (repository)

Diseñado para ser fácilmente testeable y mantenible.

