# Tipado de Retornos y Promises en Backend (TypeScript)

## Idea central
En TypeScript **todo devuelve algo**.  
La diferencia no es *si* devuelve, sino **qué decidís devolver** y **desde qué capa**.

---

## Capas y responsabilidades

### Repository
- Devuelve **entidades del dominio**
- No piensa en HTTP

```ts
findUser(id: number): Promise<User | null>
createUser(data: CreateUserInput): Promise<User>
deleteUser(id: number): Promise<User>
```

---

### Service
- Define el **contrato del caso de uso**
- Decide **qué se expone**

Opciones válidas:

```ts
Promise<PublicUserDTO>
Promise<{ success: true }>
Promise<void>
```

---

### Controller
- No inventa tipos
- Solo pasa datos del request al service y responde

```ts
const result = await userService.deleteUser(id)
res.json(result)
```

---

## ¿Por qué CREATE / READ / UPDATE / DELETE devuelven Promise?

### La razón real: el tiempo
Una `Promise<T>` significa:
> “Este valor no lo tengo ahora, lo voy a tener después.”

No es solo por la base de datos, es por **I/O**.

---

### Qué pasa en una consulta a DB
1. Se abre conexión
2. Se envía la query
3. La DB procesa
4. Se arma la respuesta
5. Vuelve por red o socket

Nada de eso es instantáneo.

---

### No solo DB
También devuelven Promise:
- Llamadas HTTP
- Lectura de archivos
- Envío de mails
- Subidas a Cloudinary

**Regla mental:**
```
CPU / memoria        → síncrono
DB / red / disco     → Promise
```

---

## CREATE y DELETE también consultan

```ts
await prisma.user.create({ data })
```

La DB:
- valida constraints
- genera IDs
- escribe en disco
- devuelve el registro creado

Por eso devuelve `Promise<User>`.

---

## async / await no bloquea Node

```ts
const user = await repo.findUser(id)
```

- ❌ No bloquea el event loop
- ✅ Pausa solo esa función
- ✅ El servidor sigue atendiendo requests

---

## Regla final

> Todo devuelve algo.  
> Vos decidís:
> - si lo devolvés
> - qué forma tiene
> - quién lo ve

Eso es **diseño de backend**.
