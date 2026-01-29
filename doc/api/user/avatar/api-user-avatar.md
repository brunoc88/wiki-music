# `/api/user/avatar`

Endpoint para **gestionar el avatar (foto de perfil) del usuario autenticado**.  
Permite **actualizar** o **eliminar** la imagen de perfil asociada a la cuenta.

---

## 🔐 Autenticación

Todos los métodos requieren que el usuario esté **autenticado**.

- Autenticación basada en sesión (ej. cookies / JWT).
- Internamente se utiliza `requireSessionUserId()` para obtener el `userId`.
- Si no hay sesión válida, se devuelve un error de autorización.

---

## 📌 Ruta

```
/api/user/avatar
```

---

## ✏️ PATCH — Actualizar avatar

Actualiza la foto de perfil del usuario autenticado.

### 📥 Request

- **Method:** `PATCH`
- **Content-Type:** `multipart/form-data`
- **Body:** FormData

| Campo | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `file` | File | ✅ | Archivo de imagen que se usará como avatar |

### 📄 Ejemplo (Frontend)

```ts
const formData = new FormData()
formData.append("file", file)

await fetch("/api/user/avatar", {
  method: "PATCH",
  body: formData
})
```

### ⚙️ Flujo interno

1. Se valida la sesión del usuario.
2. Se extrae el archivo desde `formData`.
3. Se delega la lógica a `userService.changeProfilePic(file, userId)`.
4. Se retorna la respuesta del servicio.

### 📤 Response — 200 OK

```json
{
  "ok":true
}
```

> El contenido exacto depende de la implementación del `userService`.

---

## 🗑️ DELETE — Eliminar avatar

Elimina la foto de perfil actual del usuario autenticado.

### 📥 Request

- **Method:** `DELETE`
- **Body:** vacío

### ⚙️ Flujo interno

1. Se valida la sesión del usuario.
2. Se llama a `userService.deleteProfilePic(userId)`.
3. Se elimina la referencia al avatar (y opcionalmente el archivo físico).
4. Se devuelve la respuesta del servicio.

### 📤 Response — 200 OK

```json
{
  "ok":true
}
```

---

## ❌ Manejo de errores

Todos los errores son capturados y procesados por `errorHandler`.

Posibles errores comunes:

| Código | Motivo |
|------|--------|
| 401 | Usuario no autenticado |
| 400 | Archivo inválido o faltante |
| 404 | Usuario no encontrado |
| 500 | Error interno del servidor |

---

## 🧩 Dependencias clave

- `requireSessionUserId` → Validación de sesión
- `userService` → Lógica de negocio
- `errorHandler` → Normalización de errores
- `NextResponse` → Respuestas HTTP

---

## 📝 Notas

- El endpoint **no permite** modificar avatars de otros usuarios.
- El backend asume que la validación de tipo/tamaño del archivo se realiza en el servicio.
- Idealmente, el frontend debería validar tipo (`image/*`) y tamaño antes de enviar.

---

✅ **Endpoint seguro, desacoplado y alineado con arquitectura por capas.**
