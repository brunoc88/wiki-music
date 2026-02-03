# ¿Por qué en un mock usamos `importActual` y en otro no?

Esta diferencia es muy común al trabajar con **Vitest** y mocks de módulos, y entenderla te ahorra muchos bugs raros en tests.

---

## Mock completo: sin `importActual`

```ts
vi.mock("@/lib/cloudinary", () => {
    return {
        uploadImage: vi.fn(async (file: File, folder: string) => {
            return {
                url: "https://res.cloudinary.com/fake/image.png",
                publicId: "users/fake-id"
            }
        }),
        deleteImage: vi.fn(async (publicId: string) => {
            return
        })
    }
})
```

### ¿Qué está pasando aquí?

- Estás **reemplazando todo el módulo**
- `@/lib/cloudinary` es un módulo propio
- Sabes exactamente qué exporta
- No quieres que se ejecute **nada real** (ni red, ni SDKs externos)

📌 **Resultado:**  
Todo lo que se importe desde `@/lib/cloudinary` será falso y controlado por el test.

👉 No tiene sentido usar `importActual` porque:
- Introduciría lógica real innecesaria
- Haría los tests más lentos y frágiles
- Rompería el aislamiento del test

---

## Mock parcial: usando `importActual`

```ts
vi.mock('next-auth', async () => {
    const actual = await vi.importActual<any>('next-auth')
    return {
        ...actual,
        getServerSession: vi.fn()
    }
})
```

### ¿Por qué aquí sí usamos `importActual`?

- `next-auth` es una librería **grande**
- Exporta muchas cosas (helpers, tipos, constantes, providers, etc.)
- Tu aplicación probablemente usa más cosas además de `getServerSession`

Si no importaras el módulo real:

```ts
return {
    getServerSession: vi.fn()
}
```

💥 **Problema:**  
Todo lo demás de `next-auth` quedaría como `undefined`, rompiendo imports que no esperabas.

📌 **Resultado con `importActual`:**
- Conservas todo el comportamiento real del módulo
- Sobrescribes solo la función que necesitas controlar en el test

---

## Regla mental rápida 🧠

### Mock completo (sin `actual`)
Úsalo cuando:
- Es tu propio módulo
- Tiene pocas funciones
- No quieres nada real

```ts
vi.mock('mi-modulo', () => ({ ... }))
```

### Mock parcial (con `actual`)
Úsalo cuando:
- Es una librería externa
- Tiene muchas exportaciones
- Solo necesitas mockear una parte

```ts
vi.mock('lib-grande', async () => {
    const actual = await vi.importActual('lib-grande')
    return { ...actual, algoMockeado: vi.fn() }
})
```

---

## En una frase 🎯

**Usas `importActual` cuando quieres conservar el módulo real y cambiar solo una parte.  
No lo usas cuando quieres reemplazar el módulo entero.**
