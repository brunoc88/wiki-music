# userService.create — Registro de usuario

## Descripción

Servicio encargado de **crear un nuevo usuario común** en el sistema.
Centraliza la lógica de negocio asociada al registro, incluyendo:

- Hasheo de credenciales sensibles.
- Gestión opcional de imagen de perfil.
- Asignación automática del rol **comun**.
- Rollback manual de recursos externos en caso de error.

Este service **no valida datos de entrada**; asume que la información recibida
ya fue validada previamente (por ejemplo, mediante Zod en la capa de API).

---

## Firma del método

```ts
create(
  data: RegisterUser,
  imageFile?: File | null
): Promise<User>
```

---

## Parámetros

### data (`RegisterUser`)

Objeto con los datos necesarios para crear el usuario.

Campos esperados:

- `email`: string  
- `username`: string  
- `password`: string (en texto plano, se hashea en el service)  
- `securityQuestion`: string  
- `securityAnswer`: string (en texto plano, se hashea en el service)

> El rol **NO** forma parte de este objeto y se asigna internamente.

---

### imageFile (`File | null | undefined`)

- Archivo opcional de imagen de perfil.
- Si no se envía, se utiliza una imagen por defecto definida en variables de entorno.

---

## Flujo interno

### 1. Hasheo de credenciales

```ts
const hashpassword = await bcrypt.hash(data.password, 10)
const hashSecurityAnswer = await bcrypt.hash(data.securityAnswer, 10)
```

- El password y la respuesta de seguridad **nunca** se almacenan en texto plano.
- Se utiliza `bcrypt` con salt de 10 rondas.

---

### 2. Inicialización de imagen

```ts
let imageUrl = process.env.DEFAULT_USER_IMAGE_URL!
let imagePublicId: string | null = null
```

- Se define una imagen por defecto.
- `imagePublicId` se utiliza para rollback en caso de error.

---

### 3. Subida opcional de imagen

```ts
if (imageFile) {
  const uploadResult = await uploadImage(imageFile, "users")
  imageUrl = uploadResult.url
  imagePublicId = uploadResult.publicId
}
```

- Si se envía una imagen:
  - Se sube al servicio externo (ej: Cloudinary).
  - Se guarda la URL pública.
  - Se conserva el `publicId` para posible rollback.

---

### 4. Construcción del usuario

```ts
const userToCreate = {
  email: data.email,
  username: data.username,
  password: hashpassword,
  securityQuestion: data.securityQuestion,
  securityAnswer: hashSecurityAnswer,
  pic: imageUrl,
  picPublicId: imagePublicId
}
```

- Se construye el objeto final que será persistido.
- Las credenciales ya están transformadas.

---

### 5. Persistencia en base de datos

```ts
return userRepo.create({
  ...userToCreate,
  rol: "comun"
})
```

- Se delega la creación al repositorio.
- El rol **se hardcodea en el service**, nunca proviene del cliente.

---

## Manejo de errores y rollback

```ts
catch (error) {
  if (imagePublicId) {
    await deleteImage(imagePublicId)
  }
  throw error
}
```

- Si ocurre un error luego de subir la imagen:
  - Se elimina la imagen subida.
  - Se evita dejar recursos huérfanos.
- El error se propaga para ser manejado por el `errorHandler` global.

---

## Responsabilidades del service

✔️ Aplicar reglas de negocio  
✔️ Proteger datos sensibles  
✔️ Gestionar recursos externos  
✔️ Asignar valores por defecto críticos  

---

## Notas

- Este service **no depende de Zod** ni de la capa HTTP.
- Puede ser reutilizado desde:
  - API routes
  - Seeds
  - Scripts
  - Tests
- Mantiene una separación clara entre:
  **Controller → Service → Repository**
