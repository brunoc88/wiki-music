# Cloudinary y Variables de Entorno (Dev / Test)

## 1. Imagen default y credenciales fake

- La URL demo de Cloudinary **existe**, es pública y se usa como placeholder.
- En **tests**, NO se deben borrar las variables de entorno de Cloudinary.
- Aunque no se use la función, **los imports se ejecutan igual**.

👉 Si faltan envs al importar el adapter, la app puede romper.

### Patrón correcto en `.env.test`

```env
DATABASE_URL=...
DEFAULT_USER_IMAGE_URL=https://res.cloudinary.com/demo/image/upload/default.png
CLOUDINARY_CLOUD_NAME=test
CLOUDINARY_API_KEY=test
CLOUDINARY_API_SECRET=test
```

✔️ No autentican
✔️ No llaman a Cloudinary
✔️ No rompen el adapter
✔️ Permiten mockear

---

## 2. Dev / Prod: manejo de imágenes

### Imagen default

- Se sube **una sola vez** (o se usa una URL pública)
- No se genera dinámicamente
- Es estable y simple

### Imagen del usuario

- Multer / Web API recibe el archivo
- Cloudinary lo sube
- Se guarda `secure_url` en DB

Si no hay archivo → se usa `DEFAULT_USER_IMAGE_URL`

---

## 3. Non-null assertion (`!`) en env vars

```ts
process.env.CLOUDINARY_API_KEY!
```

- Es TypeScript, no Cloudinary
- Le dice al compilador: *esto existe*
- Evita `string | undefined`

✔️ Correcto en envs requeridas
❌ Peligroso en inputs de usuario

### Alternativa más profesional

```ts
function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing env: ${name}`)
  return value
}
```

---

## Regla de oro

Las env vars existen para que el código **cargue**.

En test:
- El comportamiento lo define el **mock**
- No las credenciales

