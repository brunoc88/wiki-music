# Dispatch, SetStateAction y Record – Explicación clara

Este documento explica **qué significan realmente** algunos tipos comunes de React + TypeScript, sin Redux, sin librerías extra y sin humo.

---

## 1️⃣ ¿Qué es `Dispatch`?

En React con TypeScript, `Dispatch` **es solo un tipo** que describe una función.

Forma general:

```ts
type Dispatch<A> = (value: A) => void
```

Se lee como:

> “Una función que recibe un valor del tipo `A` y no devuelve nada”.

No ejecuta lógica, no maneja estado por sí sola.  
Solo **tipa** una función.

---

## 2️⃣ `Dispatch` en `useState`

Cuando usás `useState`:

```ts
const [errors, setErrors] = useState<Record<string, string[]>>({})
```

TypeScript infiere que:

```ts
setErrors: Dispatch<SetStateAction<Record<string, string[]>>>
```

Es decir:

> `setErrors` es una función que recibe un nuevo estado (o una función que lo calcula) y no devuelve nada.

Ejemplos válidos:

```ts
setErrors({})
```

```ts
setErrors(prev => ({
  ...prev,
  email: ["Email inválido"]
}))
```

---

## 3️⃣ ¿Qué es `SetStateAction<T>`?

Es un tipo que modela **las dos formas válidas de actualizar estado** en React.

Definición simplificada:

```ts
type SetStateAction<T> =
  | T
  | ((prevState: T) => T)
```

Significa que podés pasar:

1. El valor directo
2. Una función basada en el estado anterior

Por eso `setErrors` acepta ambas formas.

---

## 4️⃣ ¿Por qué se llama “Dispatch”?

El nombre viene de la idea de “despachar” algo a un manejador de estado.

En `useState`:
- No hay reducer
- No hay acciones
- No hay complejidad

👉 Es simplemente el **setter del estado**, con un nombre histórico.

Pensalo como:

```ts
setErrors: (nuevoEstado) => void
```

---

## 5️⃣ ¿Qué es `Record<string, string[]>`?

`Record` es un tipo genérico de TypeScript:

```ts
Record<K, V>
```

Significa:

> “Un objeto cuyas claves son de tipo `K` y cuyos valores son de tipo `V`”.

En tu caso:

```ts
Record<string, string[]>
```

Se lee como:

> “Un objeto donde las claves son strings y los valores son arrays de strings”.

Ejemplo real:

```ts
{
  email: ["Email inválido"],
  password: ["Debe tener al menos 8 caracteres"],
  credentials: ["Credenciales inválidas"]
}
```

---

## 6️⃣ ¿Por qué este tipo es ideal para errores?

- Las claves coinciden con nombres de campos
- Permite múltiples errores por campo
- Es compatible directamente con Zod:

```ts
zodError.flatten().fieldErrors
```

También es más legible que:

```ts
{ [key: string]: string[] }
```

---

## 7️⃣ Cómo explicarlo en una entrevista (versión corta)

> “`Dispatch` tipa una función que envía un nuevo estado.  
`SetStateAction` permite que ese setter reciba un valor directo o una función basada en el estado previo.  
`Record<string, string[]>` modela errores por campo y encaja bien con validaciones.”

Respuesta clara, sin buzzwords.

---

## Conclusión

- `Dispatch` → función setter
- `SetStateAction` → valor o función
- `Record` → objeto tipado por claves y valores

Nada mágico. Solo TypeScript describiendo cómo funciona React.

---

## Autor

Bruno  
Proyecto: **WikiMusic**
