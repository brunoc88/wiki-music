# ErrorContext – Documentación

## Descripción general

`ErrorContext` es un **contexto global de React** diseñado para centralizar y compartir errores de validación y autenticación entre distintas vistas del frontend.

Su objetivo es evitar el **prop drilling** y mantener un manejo de errores consistente en todo el flujo de la aplicación.

---

## Responsabilidades

- Almacenar errores globales de la aplicación
- Proveer una API simple para leer y actualizar errores
- Garantizar que los errores estén disponibles solo dentro de su Provider
- Unificar el formato de errores provenientes de frontend y backend

---

## Tipos

### ErrorContextType

```ts
type ErrorContextType = {
  errors: Record<string, string[]>
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
}
```

#### Descripción de campos

- **errors**  
  Objeto que mapea nombres de campos a una lista de mensajes de error.

- **setErrors**  
  Función para actualizar el estado de errores de forma controlada.

---

## Creación del contexto

```ts
const ErrorContext = createContext<ErrorContextType | null>(null)
```

- Se inicializa con `null` para forzar el uso correcto del Provider
- Permite detectar errores de configuración en tiempo de ejecución

---

## ErrorProvider

```tsx
export const ErrorProvider = ({ children }: { children: ReactNode }) => { ... }
```

### Responsabilidad

- Encapsular el estado global de errores
- Proveer `errors` y `setErrors` a toda la aplicación

### Estado interno

```ts
const [errors, setErrors] = useState<Record<string, string[]>>({})
```

- Inicialmente no hay errores
- El estado se puede resetear fácilmente con `setErrors({})`

---

## useError (Custom Hook)

```ts
export const useError = () => { ... }
```

### Función

- Acceder al contexto de errores de forma segura
- Simplificar el consumo del contexto en componentes

### Protección de uso incorrecto

```ts
if (!context) {
  throw new Error("useError must be used within an ErrorProvider")
}
```

- Evita bugs silenciosos
- Fuerza a envolver los componentes con `ErrorProvider`

---

## Ejemplo de uso

```tsx
const { errors, setErrors } = useError()

setErrors({ email: ["Email inválido"] })
```

---

## Formato de errores

```ts
{
  email: ["Email inválido"],
  password: ["Debe tener al menos 8 caracteres"]
}
```

Este formato es compatible con:
- Zod (`flatten().fieldErrors`)
- Errores de backend
- Renderizado directo en formularios

---

## Observaciones técnicas

- El contexto es deliberadamente simple
- No incluye lógica de negocio
- Facilita la reutilización entre login, register y otros formularios

---


## Ubicación

```
/context/ErrorContext.tsx
```


