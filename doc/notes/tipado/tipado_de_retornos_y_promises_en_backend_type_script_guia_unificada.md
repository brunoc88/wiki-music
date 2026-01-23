# Tipado de Retornos y Promises en Backend con TypeScript

## 1. Idea clave (la que cambia todo)

En TypeScript **todo devuelve algo**.

- Aunque no lo declares
- Aunque conceptualmente digas “esto solo crea” o “esto solo borra”

👉 La diferencia no es *si* devuelve algo, sino **qué elegís devolver y desde qué capa**.

---

## 2. Capas y responsabilidades

### Repository

- Devuelve **entidades del dominio**
- No piensa en HTTP ni en contratos públicos

```ts
findUser(id: number): Promise<User | null>
createUser(data: CreateUserInput): Promise<User>
deleteUser(id: number): Promise<User>
```

---

### Service (la capa clave)

El service **define el contrato del caso de uso**.
Decide qué se expone hacia afuera.

Opciones válidas:

```ts
Promise<PublicUserDTO>
Promise<{ success: true }>
Promise<void>
```

No hay una única correcta: hay **decisión de diseño**.

---

### Controller

- No inventa tipos
- No decide contratos
- Solo conecta request ↔ service ↔ response

```ts
const result = await userService.deleteUser(id)
res.json(result)
```

---

## 3. CREATE y DELETE sí devuelven algo

A nivel conceptual:
- CREATE → “se creó”
- DELETE → “se borró”

A nivel técnico:

| Operación | Qué pasa realmente |
|---------|-------------------|
| CREATE | Se crea una entidad nueva |
| DELETE | Se elimina una entidad existente |

Esa entidad **existía en DB**, por lo tanto **puede devolverse**.

Los ORMs lo confirman:

```ts
const user = await prisma.user.create({ data })
const user = await prisma.user.delete({ where: { id } })
```

---

## 4. Qué debería devolver cada capa

### Repository

```ts
createUser(...): Promise<User>
deleteUser(id: number): Promise<User>
```

✔️ Correcto

---

### Service – opciones reales

#### Opción A – Devolver DTO (la más común)

```ts
createUser(...): Promise<PublicUserDTO>
```

✔️ Ideal para APIs
✔️ No expone el modelo

---

#### Opción B – Devolver confirmación

```ts
deleteUser(id: number): Promise<{ success: true }>
```

✔️ Muy común en DELETE
✔️ Simple y claro

---

#### Opción C – No devolver nada

```ts
deleteUser(id: number): Promise<void>
```

⚠️ Válido, pero perdés información (logs, chaining, auditoría)

---

## 5. Modelo vs DTO vs tipo inline

### Usar MODELO (`User`)

- Repository
- Lógica interna

---

### Usar DTO

- Services
- Respuestas HTTP
- Contratos de API

```ts
interface PublicUserDTO {
  id: number
  email: string
  username: string
}
```

---

### Usar tipo inline

- Respuestas simples
- No reutilizables

```ts
Promise<{ success: boolean }>
```

---

## 6. Por qué todo esto devuelve Promise

### Qué significa una Promise

Una `Promise<T>` significa:

> “Este valor no lo tengo ahora, lo voy a tener después.”

TypeScript habla de **tiempo**, no de bases de datos.

---

### Por qué DB, red y disco son asíncronos

Cuando hacés una consulta:

1. Se abre conexión
2. Se envía la query
3. La DB procesa
4. Se arma la respuesta
5. Vuelve por red / socket

Nada de eso es instantáneo.

---

### No es solo la DB

También devuelven Promise:
- Llamadas HTTP
- Lectura de archivos
- Envío de emails
- Subidas a Cloudinary

**Regla simple:**

```
CPU / memoria        → síncrono
DB / red / disco     → Promise
```

---

## 7. async / await no bloquea Node

```ts
const user = await repo.findUser(id)
```

- ❌ No bloquea el event loop
- ✅ Pausa solo esa función
- ✅ El servidor sigue atendiendo requests

---

## 8. Regla mental definitiva

> **Todo devuelve algo**
>
> Vos elegís:
> - si lo devolvés
> - qué forma tiene
> - quién lo ve

Eso es **diseño de backend**, no sintaxis.

---

## 9. Tranquilidad (importante)

No haber tipado retornos antes:
- ❌ no es ignorancia
- ❌ no es mala práctica
- ❌ no es falta de nivel

Es el paso natural previo a escribir backend profesional.

Y ya estás ahí.

