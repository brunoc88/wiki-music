# Validación de usuario activo en escenarios concurrentes

## Escenario planteado

Un usuario autenticado se encuentra editando sus datos mientras, en el
mismo instante, un administrador desactiva su cuenta de forma lógica
(por ejemplo, cambiando un flag de estado). El usuario envía la
solicitud de actualización apenas milisegundos después.

Este escenario es **realista y común** en sistemas concurrentes.

------------------------------------------------------------------------

## Duda central

Si el sistema ya valida que el usuario tiene una sesión activa y obtiene
su identificador desde allí, ¿es realmente necesario volver a verificar
que el usuario siga activo dentro del servicio?

------------------------------------------------------------------------

## Sesión vs base de datos

La sesión (JWT, cookie, etc.) representa un **estado cacheado** en el
tiempo. Indica que el usuario fue autenticado correctamente en algún
momento previo.

La base de datos, en cambio, es la **fuente de verdad** actual del
sistema.

Un cambio en la base de datos (como desactivar un usuario) **no invalida
automáticamente** una sesión ya emitida.

------------------------------------------------------------------------

## Autenticación no es autorización

-   Autenticación: responde a la pregunta *"¿quién sos?"*.
-   Autorización: responde a la pregunta *"¿podés hacer esto ahora?"*.

Que un usuario esté autenticado no implica que esté autorizado a
ejecutar cualquier acción en todo momento.

------------------------------------------------------------------------

## Por qué validar el estado en el servicio

El servicio es el lugar donde viven las reglas de negocio y donde ocurre
el efecto real (modificación de datos). Validar allí que el usuario siga
activo garantiza que:

-   Un usuario desactivado no pueda modificar información.
-   No existan ventanas de tiempo donde una sesión válida permita
    acciones no autorizadas.
-   El sistema sea consistente frente a condiciones de carrera.

Confiar únicamente en la sesión dejaría una brecha de seguridad.

------------------------------------------------------------------------

## Responsabilidades claras

-   El controlador valida que la solicitud esté autenticada.
-   El servicio valida que la acción esté permitida en el estado actual
    del sistema.

Esta separación protege al sistema frente a concurrencia, cambios de
estado y decisiones administrativas.

------------------------------------------------------------------------

## Conclusión

Validar que el usuario siga activo dentro del servicio **es necesario y
correcto**.

No es redundancia: es una defensa explícita contra escenarios reales de
concurrencia. Esta práctica refleja un diseño backend robusto,
consciente de que el estado del sistema puede cambiar entre una
autenticación y una acción posterior.
