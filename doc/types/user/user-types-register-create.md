# Tipos de Usuario – DTOs

## Descripción

Estos tipos TypeScript definen los **contratos de datos** utilizados durante el
proceso de creación de usuarios.  
Separan claramente los datos que provienen del cliente de los datos internos
que maneja el backend.

---

## RegisterUser

```ts
export type RegisterUser = {
  email: string
  username: string
  password: string
  securityQuestion: string
  securityAnswer: string
  pic?: string
}
```

### Uso

- Representa los **datos válidos provenientes del cliente**.
- Es el tipo resultante luego de validar el body con `UserRegisterSchema`.
- Se utiliza como **entrada de la función `create` del objeto `userService`**.

### Responsabilidad

- Garantiza que los datos enviados al service ya fueron:
  - Validados
  - Normalizados
  - Sanitizados

El `userService` **no vuelve a validar formato**, asumiendo que el contrato
`RegisterUser` ya es correcto.

---

## CreateUser

```ts
export type CreateUser = RegisterUser & {
  rol: "comun" | "admin"
}
```

### Uso

- Tipo utilizado **internamente en el backend**.
- Representa la estructura final del usuario que será persistida.

### Intercepción de Datos

- `CreateUser` **no proviene del cliente**.
- Se genera dentro del `userService`.
- El campo `rol` se **hardcodea en el service** según el endpoint utilizado.

---

## Relación con el Repository

- La función `create` del **service** recibe un `RegisterUser`.
- La función `create` del **repository** exige un `CreateUser`.

Esto permite que el repository:
- Compruebe en tiempo de compilación que el `rol` existe.
- Evite persistir usuarios sin rol.
- Mantenga un contrato fuerte y explícito.

---

## Beneficios de este Enfoque

- Separación clara de responsabilidades.
- Seguridad: el cliente nunca define el rol.
- Tipado fuerte end-to-end.
- Código más mantenible y fácil de escalar.

---

## Notas

Este patrón es equivalente a trabajar con:
- DTOs (Data Transfer Objects)
- Capa de aplicación bien definida
- Contratos claros entre controller, service y repository
