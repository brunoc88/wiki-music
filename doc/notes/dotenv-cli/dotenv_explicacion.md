# dotenv vs dotenv-cli (Explicación clara)

## 🔹 dotenv

-   Es una **librería de Node.js**.
-   Se usa dentro del código.
-   Carga las variables del `.env` en `process.env` **durante el
    runtime**.

### Ejemplo

``` js
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.DB_URL);
```

👉 Vos controlás cuándo se cargan las variables.

------------------------------------------------------------------------

## 🔹 dotenv-cli

-   Es una **herramienta de línea de comandos (CLI)**.
-   Se usa al ejecutar la app, no dentro del código.
-   Inyecta variables de entorno **antes de que arranque Node**.

### Ejemplo

``` bash
dotenv -e .env node index.js
```

👉 Node ya arranca con las variables cargadas.

------------------------------------------------------------------------

## 🔹 Diferencias clave

  -----------------------------------------------------------------------
  Concepto         dotenv                   dotenv-cli
  ---------------- ------------------------ -----------------------------
  Dónde actúa      Dentro del código        En la terminal (antes)

  Cuándo carga     Durante el runtime       Antes de ejecutar la app

  Necesita import  Sí                       No
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 🔹 Uso en la práctica

### Express (Node puro)

-   Node no carga `.env` automáticamente
-   Usás `dotenv` porque controlás el runtime

``` js
import dotenv from "dotenv";
dotenv.config();
```

------------------------------------------------------------------------

### Next.js

-   Next ya carga `.env` automáticamente
-   No necesitás `dotenv` en el código

------------------------------------------------------------------------

### Scripts externos (fuera de Next)

-   Usás `dotenv-cli`

``` bash
dotenv -e .env.local -- node script.js
```

------------------------------------------------------------------------

## 🧠 Resumen final

-   `dotenv` → runtime controlado por vos (Node/Express)
-   `Next.js` → ya maneja `.env` internamente
-   `dotenv-cli` → para ejecutar scripts o procesos externos
