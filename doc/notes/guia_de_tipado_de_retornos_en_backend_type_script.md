# Guía clara de Tipado de Retornos en Backend (TypeScript)

> Esta guía existe porque **nadie suele explicar bien qué DEVUELVE cada capa**.
> Y no: no es ignorancia no haberlo preguntado. Es experiencia acumulándose.

---

## 1. Idea clave (la que cambia todo)

En TypeScript **todo devuelve algo**.

- Aunque vos no lo declares
- Aunque conceptualmente digas “esto solo crea” o “esto solo borra”

👉 **La diferencia no es si devuelve algo, sino *qué elegís devolver*.**

---

## 2. ¿Por qué pensábamos que CREATE y DELETE no devolvían nada?

Porque a nivel **conceptual**:
- *Create* → “ya está, se creó”
- *Delete* → “listo, se borró”

Pero a nivel **técnico y de dominio**:

| Operación | Qué realmente pasa |
|---------|------------------|
| CREATE | Se crea una entidad nueva |
| DELETE | Se elimina una entidad existente |

Y esa entidad **existía en memoria / DB**, por lo tanto **puede devolverse**.

---

## 3. Lo que hacen realmente los ORMs

### Ejemplo Prisma

```ts
const user = await prisma.user.create({ data })
```

👉 **Devuelve el usuario creado**

```ts
const user = await prisma.user.delete({ where: { id } })
```

👉 **Devuelve el usuario eliminado**

Esto no es casualidad:
- Sirve para logs
- auditoría
- devolver info al cliente
- encadenar operaciones

---

## 4. Entonces… ¿qué debería devolver cada capa?

### 🧠 Repository

- Devuelve **entidades del dominio**
- No piensa en HTTP

```ts
createUser(data: CreateUserInput): Promise<User>

deleteUser(id: number): Promise<User>
```

✔️ Correcto

---

### 🧠 Service (la capa más importante)

Acá **VOS decidís el contrato**.

Tenés 3 opciones válidas:

---

### Opción A – Devolver DTO (lo más común)

```ts
createUser(data: CreateUserInput): Promise<PublicUserDTO>
```

✔️ Ideal para APIs
✔️ No exponés el modelo

---

### Opción B – Devolver solo confirmación

```ts
deleteUser(id: number): Promise<{ success: true }>
```

✔️ Perfecto si no necesitás el objeto
✔️ Muy común en DELETE

---

### Opción C – No devolver nada (menos común)

```ts
deleteUser(id: number): Promise<void>
```

⚠️ Válido, pero:
- perdés información
- no sirve para logs ni chaining

---

## 5. Controller: el que NO decide nada

El controller:
- No modela datos
- No inventa tipos
- Solo pasa info

```ts
async deleteUser(req: Request, res: Response) {
  const result = await userService.deleteUser(+req.params.id)
  res.json(result)
}
```

👉 El tipo ya está definido en el service

---

## 6. ¿Cuándo usar modelo vs DTO vs inline?

### ✅ Usar MODELO (`User`)

- Repository
- Lógica interna

---

### ✅ Usar DTO

- Services
- Respuestas HTTP
- Casos de uso

```ts
interface PublicUserDTO {
  id: number
  email: string
  username: string
}
```

---

### ✅ Usar tipo inline

- Respuestas simples
- No reutilizables

```ts
Promise<{ success: boolean }>
```

---

## 7. Regla mental definitiva (guardala)

> **Todo devuelve algo**
>
> Vos elegís:
> - si lo devolvés
> - qué forma tiene
> - y quién lo ve

Eso **es diseño**, no sintaxis.

---

## 8. ¿Por qué CREATE, READ, UPDATE y DELETE devuelven **Promise**?

Esta es una de las preguntas más importantes de backend.
La respuesta corta es: **sí, es porque hay una base de datos**, pero vamos a hacerlo bien claro.

---

### 8.1 Qué significa realmente una Promise

Una `Promise<T>` significa:

> “Este valor **no lo tengo ahora**, pero **lo voy a tener después**.”

TypeScript no está hablando de bases de datos.
Está hablando de **tiempo**.

---

### 8.2 Por qué una operación con DB NO puede ser síncrona

Cuando hacés esto:

```ts
prisma.user.findUnique({ where: { id } })
```

Pasan cosas que llevan tiempo:

1. Se abre una conexión
2. Se envía la query
3. La DB la procesa
4. Se arma la respuesta
5. Vuelve por red / socket

👉 Eso **no es instantáneo**
👉 Node.js **no puede bloquear el hilo** esperando

Por eso devuelve una `Promise<User | null>`.

---

### 8.3 ¿Es solo por la base de datos?

No.

También son Promises:

- Llamadas HTTP (`fetch`, `axios`)
- Lectura de archivos
- Envío de emails
- Subidas a Cloudinary

Regla simple:

> Si depende de algo externo → **Promise**

---

### 8.4 ¿Por qué CREATE también es Promise?

Crear **también consulta**:

```ts
await prisma.user.create({ data })
```

La DB:
- valida constraints
- genera IDs
- escribe en disco
- devuelve el registro creado

Todo eso lleva tiempo.

Por eso:

```ts
createUser(...): Promise<User>
```

---

### 8.5 ¿Y si fuera síncrono?

Si Node hiciera esto de forma síncrona:

```ts
const user = prisma.user.findUnique(...)
```

🔴 El servidor quedaría bloqueado
🔴 Ningún otro request entraría
🔴 El backend moriría con 2 usuarios

Las Promises **permiten concurrencia sin bloquear**.

---

### 8.6 async / await NO hace la función síncrona

Esto es clave:

```ts
async function getUser(): Promise<User> {
  return await repo.findUser()
}
```

`await`:
- NO bloquea el event loop
- Solo pausa **esa función**

El servidor sigue vivo.

---

### 8.7 Regla mental definitiva

> Síncrono → CPU / memoria
> 
> Asíncrono (Promise) → DB / red / disco

Si hay I/O, hay Promise.

---

## 9. Tranquilidad (esto es importante)

No haber tipado retornos antes:
- ❌ no es mala práctica
- ❌ no es ignorancia
- ❌ no es falta de nivel

Es exactamente el punto **previo** a escribir backend profesional.

Y vos ya estás del lado correcto.

---

Si querés, próximo paso:
- adaptar esta guía a **tu proyecto real**
- definir **convenciones fijas** para todos tus services
- o armar una **checklist de entrevistas backend**

