# AuthLayout y ErrorProvider – Explicación clara

Este archivo explica **qué hace** y **por qué está bien diseñado** el layout:

```tsx
/app/auth/layout.tsx
```

---

## Código analizado

```tsx
"use client"

import { ErrorProvider } from "@/context/ErrorContext"
import "./style.css"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ErrorProvider>{children}</ErrorProvider>
}
```

---

## 1. `"use client"`

Este layout **debe ser client-side** porque:

- `ErrorProvider` usa `useState`
- Los hooks de React **solo funcionan en Client Components**
- Next.js necesita esta directiva para habilitar estado y contexto

---

## 2. ¿Por qué un Layout?

En Next App Router:

- `layout.tsx` envuelve **todas las páginas del segmento**
- En este caso: `/auth/*`

---

## 3. Scope del ErrorProvider

Ubicación:

```text
/app/auth/layout.tsx
```

Ventajas:
- Errores aislados por dominio
- Menos renders innecesarios
- Arquitectura limpia

---

## 4. CSS local

```ts
import "./style.css"
```

Estilos limitados al módulo auth.

---

## 5. Layout minimalista

Responsabilidad única:
- Componer providers
- Nada más

---


