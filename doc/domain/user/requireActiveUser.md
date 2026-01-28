# requireActiveUser

Este módulo centraliza la validación de **existencia** y **estado activo** de un usuario dentro del dominio.

Su objetivo es evitar duplicación de lógica en los services y garantizar reglas de negocio consistentes
cuando una acción requiere que el usuario esté habilitado.

---

## 📍 Ubicación

```text
domain/user/requireActiveUser.ts
```

Pertenece a la **capa de dominio**, no a `utils` ni a `repositories`.

---

## 🎯 Responsabilidad

Este módulo se encarga de:

- Verificar que el usuario exista
- Verificar que el usuario esté activo (`state === true`)
- Lanzar errores de dominio claros y consistentes
- Retornar el usuario validado para evitar consultas duplicadas

---

## 🚫 Qué NO hace

- No valida sesión ni autenticación
- No decide permisos complejos
- No contiene lógica de infraestructura
- No accede a request / response

---

## 📦 Dependencias

- `userRepo`: acceso a datos
- `NotFoundError`: cuando el usuario no existe
- `ForbiddenError`: cuando el usuario está inactivo
- `User`: tipo de dominio (Prisma)

---

## 🧩 Funciones

### `requireActiveUserById(id: number): Promise<User>`

Valida que exista un usuario con el ID provisto y que esté activo.

#### Flujo:
1. Busca el usuario por ID
2. Si no existe → lanza `NotFoundError`
3. Si está inactivo → lanza `ForbiddenError`
4. Devuelve el usuario validado

#### Uso típico:
- Edición de perfil
- Cambio de username / email
- Creación de contenido persistente

---

### `requireActiveUserByEmail(email: string): Promise<User>`

Valida que exista un usuario con el email provisto y que esté activo.

#### Flujo:
1. Busca el usuario por email
2. Si no existe → lanza `NotFoundError`
3. Si está inactivo → lanza `ForbiddenError`
4. Devuelve el usuario validado

#### Uso típico:
- Flujos de autenticación
- Recuperación de cuenta
- Validaciones previas a login

---

## 🧠 Regla de diseño aplicada

> **Si una acción crea o modifica información relevante del sistema,
> el usuario debe existir y estar activo.**

Este módulo encapsula esa regla.

---

## ✅ Beneficios

- Evita lógica duplicada
- Mejora la legibilidad de los services
- Centraliza reglas de negocio
- Facilita testing
- Reduce errores por estados inconsistentes

---

## ⚠️ Buenas prácticas

- Usar este módulo solo en acciones que realmente lo requieren
- No convertirlo en un "god guard"
- Agregar nuevas validaciones solo si aplican a todos los casos

---

## 📌 Ejemplo de uso (conceptual)

```ts
await requireActiveUserById(userId)
// lógica del caso de uso
```

---

## 🧭 Nivel de diseño

Este patrón corresponde a un enfoque **Domain-Oriented / Service Guard**,
común en backends de nivel **mid a senior**.

---

Fin del documento.
