# Compile Time vs Runtime en TypeScript

## Compile Time (Tiempo de compilación)

Es el momento en que **TypeScript analiza el código**.

En este momento: - Existen `interface` y `type` - Se validan los tipos -
Se detectan errores antes de ejecutar

Ocurre cuando: - `npm run build` - `npm run dev` (mientras analiza) -
`npm run test` (antes de ejecutar)

------------------------------------------------------------------------

## Runtime (Tiempo de ejecución)

Es cuando **JavaScript ya está corriendo**.

En este momento: - Solo existe JavaScript - No existen interfaces ni
types - Node o el navegador ejecutan el código

Ocurre cuando: - El servidor está levantado - Los tests están
corriendo - El frontend está renderizando

------------------------------------------------------------------------

## Ejemplo claro

``` ts
interface UserDTO {
  email: string
}
```

Después de compilar:

``` js
// la interface desapareció
```

------------------------------------------------------------------------

## Punto clave

> **TypeScript no protege datos, protege desarrolladores**

Por eso: - Las interfaces NO validan datos - Necesitamos Zod, Joi, Yup
para runtime

------------------------------------------------------------------------

## Comparación rápida

  Concepto     Compile Time   Runtime
  ------------ -------------- ---------
  interface    ✅             ❌
  type         ✅             ❌
  class        ✅             ✅
  zod schema   ❌             ✅
  JS object    ❌             ✅

------------------------------------------------------------------------

## Regla final

> **Las interfaces existen solo mientras TypeScript analiza el código**
