# userService.changeProfilePic

Servicio encargado de **actualizar la imagen de perfil (avatar)** de un usuario activo.

---

## ✨ Responsabilidad

- Validar que el usuario exista y esté activo.
- Validar que se haya enviado una imagen válida.
- Subir la nueva imagen a almacenamiento externo.
- Actualizar la base de datos con la nueva imagen.
- Eliminar la imagen anterior si existía.
- Ejecutar **rollback** del upload si ocurre un error.

---

## 🧾 Firma

```ts
changeProfilePic(
  imageFile: File,
  userId: number
): Promise<{ ok: true }>
```

---

## 📥 Parámetros

| Nombre | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `imageFile` | File | ✅ | Archivo de imagen a subir |
| `userId` | number | ✅ | ID del usuario autenticado |

---

## ⚙️ Flujo interno

1. Se valida que el usuario exista y esté activo (`requireActiveUserById`).
2. Se valida que `imageFile` sea una instancia de `File`.
3. Se sube la nueva imagen (`uploadImage`).
4. Se actualiza la base de datos con la nueva URL y `publicId`.
5. Si existía una imagen previa, se elimina del storage.
6. Se retorna `{ ok: true }`.

---

## 🔁 Manejo de errores y rollback

- Si ocurre un error **después del upload**, se elimina la imagen recién subida.
- El rollback **no revierte la DB**, solo el storage.
- El error se relanza para ser manejado por capas superiores.

---

## 📤 Respuesta

```json
{
  "ok": true
}
```

---

## ❌ Errores posibles

| Error | Motivo |
|------|--------|
| BadRequestError | No se envió una imagen válida |
| 404 / 401 | Usuario inexistente o inactivo |
| Error externo | Fallo en upload o delete de imagen |

---

## 🧩 Dependencias

- `requireActiveUserById`
- `uploadImage`
- `deleteImage`
- `userRepo.updateProfilePic`

---

## 📝 Notas

- El orden **upload → DB → delete viejo** evita dejar al usuario sin avatar.
- Implementa un patrón de **rollback parcial**.
- No se recomienda usar en operaciones batch.

---

✅ Servicio seguro, transaccional a nivel lógico y alineado con arquitectura por capas.
