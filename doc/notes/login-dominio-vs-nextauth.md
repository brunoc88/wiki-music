# Login como Dominio vs NextAuth

## Introducción

En aplicaciones modernas con Next.js es común usar **NextAuth** para
manejar la autenticación. Sin embargo, es importante entender que
**NextAuth no reemplaza la lógica de dominio del login**, sino que
cumple un rol diferente.

Este documento explica claramente la diferencia y por qué separar ambas
responsabilidades es una buena práctica backend.

------------------------------------------------------------------------

## 1. ¿Qué es el login como parte del dominio?

El **login como dominio** es la lógica que define:

-   Cómo se valida un usuario
-   Cómo se compara una contraseña
-   Qué pasa si el usuario no existe
-   Qué pasa si la contraseña es incorrecta
-   Si el usuario está activo o bloqueado
-   Qué información mínima representa a un usuario autenticado

Ejemplo típico:

``` ts
authorizeUser(email, password)
```

Esta función pertenece al **core de la aplicación**, no al framework.

### Características

-   Independiente de NextAuth
-   Totalmente testeable
-   Reutilizable
-   Devuelve resultados claros (éxito o motivo de error)
-   Puede evolucionar con reglas de negocio

------------------------------------------------------------------------

## 2. ¿Qué es NextAuth?

NextAuth es una **capa de infraestructura** que se encarga de:

-   Manejar sesiones
-   Cookies
-   CSRF
-   Providers (OAuth, Credentials, etc.)
-   Persistencia de sesión

NextAuth **NO decide**:

-   Si el usuario existe
-   Si la contraseña es válida
-   Qué reglas de negocio aplicar

Solo acepta o rechaza un usuario.

------------------------------------------------------------------------

## 3. Limitación clave de NextAuth (Credentials)

El método `authorize` solo permite:

-   Retornar un usuario válido
-   O retornar `null`

No permite:

-   Mensajes de error
-   Tipos de error
-   Distinción entre causas de fallo

Esto limita la capacidad de dar feedback o testear lógica de negocio.

------------------------------------------------------------------------

## 4. Cómo conviven correctamente

La forma correcta es:

1.  El dominio valida credenciales
2.  NextAuth solo consume el resultado

Ejemplo conceptual:

``` ts
const result = await authorizeUser(email, password)

if (!result.ok) return null
return result.user
```

NextAuth maneja la sesión. El dominio maneja la verdad.

------------------------------------------------------------------------

## 5. Testing correcto

### Testear dominio (recomendado)

-   Rápido
-   Sin HTTP
-   Sin cookies
-   Sin mocks complejos

Se testea la función de login directamente.

### Testear NextAuth

-   Opcional
-   Lento
-   Frágil
-   Generalmente innecesario

Para endpoints protegidos se mockea la sesión.

------------------------------------------------------------------------

## 6. Regla mental final

> NextAuth es transporte, no lógica de negocio.

Separar login de NextAuth es una señal de backend maduro y escalable.

------------------------------------------------------------------------

## Conclusión

Tener el login como parte del dominio **no es redundante**. Es una
decisión correcta de arquitectura que mejora:

-   Testabilidad
-   Claridad
-   Mantenibilidad
-   Evolución del sistema

NextAuth complementa, no reemplaza.
