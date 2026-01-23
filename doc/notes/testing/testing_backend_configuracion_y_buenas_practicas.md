# Testing Backend: Configuración y Buenas Prácticas

## 1. Aislamiento total del test

Un test **define su propio universo**.

Por eso puede pisar envs aunque existan en `.env.test`:

```ts
beforeEach(() => {
  process.env.DEFAULT_USER_IMAGE_URL = "https://res.cloudinary.com/fake/default.png"
})
```

✔️ El test no depende de archivos externos
✔️ Cambios en `.env.test` no rompen tests

---

## 2. Tests de integración bien hechos

Características:
- DB real de test
- Infraestructura externa mockeada (Cloudinary)
- Flujo real end-to-end

Esto **no es unit test**, es integración real.

---

## 3. Simulación de archivos (Next.js / Web APIs)

```ts
const filePath = path.resolve(__dirname, "../fixtures/default.png")
const buffer = fs.readFileSync(filePath)
const file = new File([buffer], "default.png", { type: "image/png" })
```

- `__dirname` asegura rutas estables
- `File` simula exactamente lo que manda el browser

```ts
formData.append("file", file)
```

El controller recibe un `File` real.

---

## 4. Por qué este enfoque es correcto

- No mockeás `FormData`
- No mockeás `File`
- Mockeás solo infraestructura

👉 Esto es testing serio de backend moderno.

