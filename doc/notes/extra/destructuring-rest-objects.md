# Uso de `rest` en destructuring de objetos (JavaScript)

Este patrón se usa para **excluir propiedades de un objeto** y obtener un **nuevo objeto** con el resto de los campos.

---

## Ejemplo básico

```js
const { password, securityAnswer, ...publicUser } = user
```

### ¿Qué hace esta línea?

- Extrae (`saca`) las propiedades:
  - `password`
  - `securityAnswer`
- Agrupa **todas las demás propiedades** en un nuevo objeto llamado `publicUser`.

---

## Ejemplo completo

```js
const user = {
  id: 1,
  username: "bruno",
  email: "bruno@mail.com",
  password: "hashed",
  securityAnswer: "hashedAnswer",
  role: "user"
}

const { password, securityAnswer, ...publicUser } = user

console.log(publicUser)
```

### Resultado

```js
{
  id: 1,
  username: "bruno",
  email: "bruno@mail.com",
  role: "user"
}
```

---

## Puntos importantes

- `publicUser` **NO es una propiedad**, es un **objeto nuevo**
- El objeto original `user` **no se modifica**
- Es un patrón **inmutable y seguro**
- Muy usado para:
  - DTOs
  - Responses de API
  - Ocultar campos sensibles

---

## Cómo leerlo mentalmente

> “De `user`, sacá `password` y `securityAnswer`,  
> y guardá todo lo demás en un nuevo objeto llamado `publicUser`.”

---

## Nombre del patrón

Este uso del operador `...` se llama:

> **Rest Properties en Object Destructuring**

No es spread de copia, es **agrupación de lo restante**.

---

## Cuándo usarlo

✔ Limpiar objetos antes de devolverlos  
✔ Excluir campos sensibles  
✔ Transformar datos sin mutarlos  

---

## Resumen

```js
const { campo1, campo2, ...resto } = objeto
```
➡️ `resto` es un **nuevo objeto** con todo lo que no fue extraído.
