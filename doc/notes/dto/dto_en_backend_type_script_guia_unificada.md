# DTO (Data Transfer Object) en Backend con TypeScript

## 1. Qué es un DTO

Un **DTO (Data Transfer Object)** es un **contrato de datos**.
Define **qué información entra o sale** entre las capas de una aplicación (controller, service, frontend).

Características clave:
- No contiene lógica de negocio
- No accede a base de datos
- No tiene métodos ni estado
- Solo define **forma de datos**

> DTO = contrato explícito entre capas

---

## 2. El problema real que resuelve

En un backend típico:

Repository → Entity (DB)  
Service → reglas de negocio  
Controller → respuesta HTTP

Sin DTOs:
- Se exponen campos sensibles (`password`, `hash`, `securityAnswer`)
- El frontend queda acoplado al modelo de la DB
- Cambios en la base rompen la API
- No queda claro qué datos son públicos

DTO soluciona esto definiendo **qué datos se pueden transferir**.

---

## 3. DTO vs Entity vs Type

| Concepto | Qué representa |
|--------|----------------|
| Entity | Modelo interno de base de datos (Prisma) |
| Type / Interface | Forma de datos interna |
| DTO | Datos que entran o salen de la API |

**DTO ≠ Entity**

---

## 4. Por qué usar interfaces para DTOs

En TypeScript, los DTOs suelen definirse como `interface` porque:

- Describen solo estructura
- No existen en runtime
- No generan JavaScript
- Son livianos y claros

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

## 5. Tipos de DTO

### Request DTO (entrada)
Datos que recibe el backend desde el cliente.

```ts
export interface CreateUserDTO {
  email: string
  username: string
  password: string
}
```

### Response DTO (salida)
Datos que el backend devuelve al cliente.

```ts
export interface UserResponseDTO {
  id: number
  email: string
  username: string
  rol: string
  pic: string
}
```

---

## 6. Flujo correcto usando DTO

Cliente  
→ Controller (Request DTO)  
→ Service  
→ Repository (Entity)  
→ Service (transforma Entity → DTO)  
→ Controller  
→ Response DTO

El **service decide el DTO**, el controller solo responde.

---

## 7. DTO en el Service

El service **nunca devuelve entidades**.
Devuelve DTOs.

```ts
return {
  id: user.id,
  email: user.email,
  username: user.username,
  rol: user.rol,
  pic: user.pic
}
```

---

## 8. Controller limpio

```ts
const result = await userService.create(data)
return NextResponse.json(result)
```

Sin lógica.
Sin filtros.
Sin magia.

---

## 9. Qué NO es un DTO

- No es una entidad de base de datos
- No valida datos en runtime
- No tiene métodos
- No tiene lógica

---

## 10. Dónde viven los DTOs

Estructura recomendada:

```
src/
 ├─ dtos/
 │   └─ user/
 │       ├─ create-user.dto.ts
 │       ├─ user-response.dto.ts
```

Separados de repositorios y services.

---

## 11. ¿Es obligatorio usar DTO?

❌ No es obligatorio  
✅ Es buena práctica profesional

Usar DTO demuestra:
- Conciencia de arquitectura
- Claridad mental
- Código escalable
- Nivel profesional

---

## 12. Regla mental final

> **DTO = contrato de datos**  
> **Interface = forma**  
> **Service = decisión**

---

## 13. Conclusión

Usar DTO significa:
- Diseñar APIs claras
- Proteger el dominio
- Desacoplar la base de datos
- Escribir código mantenible

> Código claro > código rápido

