# userService.deleteProfilePic

Servicio encargado de **eliminar la imagen de perfil** del usuario activo y restaurar la imagen por defecto.

---

## ✨ Responsabilidad

- Validar que el usuario exista y esté activo.
- Eliminar la imagen del almacenamiento externo.
- Actualizar la base de datos con la imagen por defecto.
- Mantener idempotencia (si no hay imagen, no falla).

---

## 🧾 Firma

```ts
deleteProfilePic(
  userId: number
): Promise<{ ok: true }>
```

---

## 📥 Parámetros

| Nombre | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `userId` | number | ✅ | ID del usuario autenticado |

---

## ⚙️ Flujo interno

1. Se valida que el usuario esté activo.
2. Si no tiene imagen personalizada, retorna `{ ok: true }`.
3. Se elimina la imagen del storage (`deleteImage`).
4. Se actualiza la DB con la imagen por defecto.
5. Se retorna `{ ok: true }`.

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
| 404 / 401 | Usuario inexistente o inactivo |
| Error externo | Fallo al eliminar imagen |

---

## 🧩 Dependencias

- `requireActiveUserById`
- `deleteImage`
- `userRepo.deleteProfilePic`
- `DEFAULT_USER_IMAGE_URL`

---

## 📝 Notas

- El servicio es **idempotente**.
- Siempre deja al usuario con una imagen válida.
- No elimina imágenes por defecto compartidas.

---

✅ Servicio simple, robusto y seguro.
