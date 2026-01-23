
# DTO (Data Transfer Object) – Teoría completa aplicada a Backend

## 1. ¿Qué es un DTO?

Un **DTO (Data Transfer Object)** es un objeto cuya única responsabilidad es **definir la forma de los datos que se transfieren entre capas** de una aplicación.

No contiene lógica de negocio.
No accede a base de datos.
No sabe cómo se calculan los datos.

👉 Solo describe **qué datos entran o salen**.

---

## 2. El problema real que resuelve

En un backend típico:

- Repository → devuelve entidades de la DB (User, Post, etc)
- Service → aplica reglas de negocio
- Controller → responde al cliente

Si no usamos DTOs:

- El service devuelve directamente el modelo de Prisma
- El controller expone campos sensibles (`password`, `securityAnswer`)
- Cualquier cambio en DB rompe la API
- No queda claro qué se devuelve realmente

DTO = contrato explícito entre capas.

---

## 3. DTO vs Entity vs Type

| Concepto | Qué representa |
|--------|----------------|
| Entity | Modelo de base de datos (Prisma) |
| Type / Interface | Forma de datos interna |
| DTO | Forma de datos expuestos o recibidos |

DTO ≠ Entity

---

## 4. Tipos de DTO

### Request DTO
Datos que entran desde el cliente

```ts
export interface CreateUserDTO {
  email: string
  username: string
  password: string
}
```

### Response DTO
Datos que salen al cliente

```ts
export interface UserResponseDTO {
  id: number
  email: string
  username: string
  pic: string
  rol: string
}
```

---

## 5. Flujo correcto con DTO

Cliente  
→ Controller (Request DTO)  
→ Service  
→ Repository (Entity)  
→ Service (transforma a DTO)  
→ Controller  
→ Response DTO  

---

## 6. ¿Por qué NO devolver directamente el modelo?

Porque el modelo:

- Tiene campos sensibles
- Está acoplado a la DB
- Cambia con migraciones
- No representa la API pública

DTO protege y desacopla.

---

## 7. ¿Es obligatorio usar DTO?

❌ No  
✅ Es buena práctica profesional

Un recruiter ve:

- Conciencia de arquitectura
- Claridad mental
- Buen criterio
- Capacidad de escalar proyectos

No ve un novato.

---

## 8. ¿Dónde viven los DTOs?

Estructura recomendada:

```
src/
 ├─ dtos/
 │   └─ user/
 │       ├─ create-user.dto.ts
 │       ├─ user-response.dto.ts
```

Separados de repos y services.

---

## 9. Definamos tus DTOs reales (según TU código)

src/dtos/user.dto.ts

```ts
export interface PublicUserDTO {
  id: number
  email: string
  username: string
  rol: string
  pic: string
}
```
---

## 10. DTO en el Service

```ts
import { PublicUserDTO } from "@/dtos/user.dto"

create: async (
  data: RegisterUser,
  imageFile?: File | null
): Promise<PublicUserDTO> => {

  ...
  const user = await userRepo.create({
    ...userToCreate,
    rol: "comun"
  })

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    rol: user.rol,
    pic: user.pic
  }
}
```

El service devuelve DTO, no entidad.

---

## 11. Controller limpio

```ts
const result = await userService.create(data)
return NextResponse.json(result)
```

Sin lógica.
Sin filtros.
Sin magia.

---

## 12. Camino feliz

Sí, puedes hacer:

```ts
return NextResponse.json(res)
```

Pero solo si:
- `res` ya es DTO
- Está tipado
- Está filtrado

DTO garantiza eso.

---

## 13. Conclusión final

Usar DTO significa:

- Pensar en contratos
- Diseñar APIs claras
- Proteger tu dominio
- Escribir código profesional

Documentarlo demuestra **madurez**, no inseguridad.

---

> "Código claro > código rápido"
