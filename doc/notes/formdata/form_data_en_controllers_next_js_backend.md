# FormData en Controllers (Next.js / Backend)

## 1. Qué devuelve `formData.get()`

Según la spec:

```ts
formData.get(name): FormDataEntryValue | null
```

Y:

```ts
type FormDataEntryValue = string | File
```

👉 Resultado real:

```
string | File | null
```

---

## 2. El problema de tipos

Tu dominio espera:

```ts
email: string
```

Pero `formData.get("email")` puede ser `File` o `null`.

---

## 3. Solución común

```ts
formData.get("email")?.toString() || ""
```

Qué hace:
- `?.` evita crash si es `null`
- `.toString()` normaliza el tipo
- `|| ""` garantiza `string`

👉 Zod decide si es válido.

---

## 4. Alternativa más estricta

```ts
function getString(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === "string" ? value : ""
}
```

✔️ Más explícito
✔️ Mejor tipado

---

## 5. Regla mental

FormData devuelve *muchas cosas*.

Tu dominio quiere **una sola forma**.

Normalizás acá.
Validás después.

