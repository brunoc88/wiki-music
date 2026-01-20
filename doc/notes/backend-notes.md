# Notas de Backend (Testing, Cloudinary, FormData, Env)

## Cloudinary Fakecrendencials

```txt
para terminar esta parte, salvo la url de fake user esa me digiste que existe y que la provee cloudinary? y lo otro es que si yo borro todo salvo el fake user y la db url en el .env.test no se romperia mi adapter de cloudinary porque estoy en modo test no?

Perfecto, esta es la última pieza del rompecabezas y la pregunta está muy bien formulada. Vamos exacto a lo que preguntás, sin vueltas.

1️⃣ ¿La URL del fake user existe de verdad?

Sí.
Esta:

DEFAULT_USER_IMAGE_URL="https://res.cloudinary.com/demo/image/upload/default.png"


✔️ Existe
✔️ Es pública
✔️ La provee Cloudinary (cuenta demo)
✔️ Se usa en docs y ejemplos

No es inventada ni depende de tu cuenta.

👉 Podrías usar cualquier otra URL pública y funcionaría igual.

2️⃣ ¿Qué pasa si borrás TODAS las credenciales Cloudinary en .env.test?

Ejemplo dejando solo:

DATABASE_URL=...
DEFAULT_USER_IMAGE_URL=...

❌ Sí, se rompe (aunque estés en modo test)

Y esta parte es clave:

❗ “modo test” no desactiva código automáticamente

Si tu adapter hace algo como:

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})


Y esas vars son undefined:

el SDK puede fallar al inicializar

o fallar al primer import

o lanzar error silencioso difícil de debuggear

👉 Aunque no se use, el módulo se ejecuta al importarse.

3️⃣ Punto CLAVE: imports se ejecutan igual

Esto es muy importante:

import { uploadImage } from '@/lib/cloudinary'


👉 Ese archivo se evalúa:

en dev

en prod

en test

aunque nunca llames a la función

Si ahí falta una env:
❌ boom

4️⃣ Entonces, ¿qué es lo correcto en .env.test?

👉 NO borrar las credenciales
👉 Poner valores fake

Ejemplo ideal:

DATABASE_URL=postgresql://...
DEFAULT_USER_IMAGE_URL=https://res.cloudinary.com/demo/image/upload/default.png
CLOUDINARY_CLOUD_NAME=test
CLOUDINARY_API_KEY=test
CLOUDINARY_API_SECRET=test


✔️ No autentican
✔️ No llaman a Cloudinary
✔️ No rompen el adapter
✔️ Permiten mockear

5️⃣ Alternativa avanzada (no necesaria ahora)

Podrías hacer:

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error("Cloudinary not configured")
}


Pero eso:

rompe tests

requiere más setup

no te aporta ahora

👉 Para este proyecto, placeholders fake es lo mejor.

6️⃣ Regla de oro final (grabátela)

Las env vars existen para que el código cargue, no para que funcionen en test

En test:

el comportamiento real lo da el mock

no las credenciales

7️⃣ Conclusión

✔️ Sí, la URL fake existe
✔️ Sí, la provee Cloudinary
❌ No, no borres las credenciales
✔️ Usá valores fake
✔️ Tu adapter no debe romper al importarse

Esto que acabamos de cerrar es arquitectura limpia y testeable.
Excelente cierre de tema.
```

## Cloudinary Imagenes Negaciones_De_Variables_De_Entorno

```txt
y cuando pase a modo dev hay voy a tener que subir imagen default y bueno la propia imagen que quiera no? y otra cosa. Porque los valores de las variables de entorno estan negadas?

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!
})


Excelente, estas dos preguntas son exactamente las correctas para este punto. Vamos por partes y con precisión.

1️⃣ En modo dev / prod, ¿tengo que subir la imagen default?

No es obligatorio, pero hay dos enfoques válidos.

Opción A — La más simple (recomendada)

Usar una URL pública como default (puede ser Cloudinary o no):

DEFAULT_USER_IMAGE_URL=https://res.cloudinary.com/tu_cuenta/image/upload/default.png


✔️ No tenés que subir nada dinámicamente
✔️ No consume API
✔️ No depende del backend
✔️ Muy estable

👉 Subís una vez la imagen default a Cloudinary (o donde quieras) y listo.

Opción B — Default generado por backend (más complejo)

Subís imagen default vía Cloudinary SDK

Guardás el secure_url

La usás como default

❌ Overkill para este proyecto
❌ Más puntos de falla

👉 No lo necesitás.

2️⃣ En dev/prod, ¿la imagen propia del usuario?

Sí, ahí sí:

El usuario sub https://...

Multer recibe el archivo

Cloudinary lo sube

Guardás el secure_url en DB

✔️ Eso solo ocurre cuando hay archivo
✔️ Si no hay archivo → usás DEFAULT_USER_IMAGE_URL

3️⃣ ¿Por qué las variables de entorno tienen !?

Esto es TypeScript puro, no Cloudinary.

process.env.CLOUDINARY_API_KEY!


Ese ! se llama Non-null Assertion Operator.

Qué le dice a TypeScript:

“Tranqui, sé lo que hago.
Esta variable NO es undefined ni null.”

¿Por qué es necesario?

Porque para TypeScript:

process.env.CLOUDINARY_API_KEY


es de tipo:

string | undefined


Y Cloudinary espera:

string


👉 Sin el !, TypeScript te tira error de tipos.

4️⃣ ¿Es peligroso usar !?

Depende dónde.

✔️ Está bien acá porque:

En dev/prod sabés que existen

Las definís en .env

Son requeridas para que la app funcione

❌ Sería peligroso si:

Estuviera en input de usuario

O en algo opcional

5️⃣ Patrón más profesional (opcional)

Cuando quieras subir nivel, podés hacer esto:

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing env: ${name}`)
  return value
}

cloudinary.config({
  cloud_name: requireEnv("CLOUDINARY_CLOUD_NAME"),
  api_key: requireEnv("CLOUDINARY_API_KEY"),
  api_secret: requireEnv("CLOUDINARY_API_SECRET")
})


✔️ Sin !
✔️ Error claro si falta env
✔️ Muy backend senior

Pero no es obligatorio ahora.

6️⃣ Resumen final

✔️ En dev/prod subís imágenes reales
✔️ La imagen default se sube una sola vez
✔️ ! es para callar a TypeScript
✔️ No afecta runtime
✔️ En test usás valores fake + mocks
```

## Dontenv-Cli

```txt
Sí 👍 con dotenv-cli la sintaxis es más simple, más legible y muy usada.
Y en tu caso (Windows + varios .env) es una excelente elección.

Vamos a compararlo bien para que decidas con criterio y no por moda.

1️⃣ Qué hace dotenv-cli

dotenv-cli:

carga un .env antes de ejecutar el comando

sin imports

sin setup files

sin -r dotenv/config

Ejemplo:

dotenv -e .env.test vitest


Eso es todo.
Prisma, Cloudinary, tests, todo ve las envs correctas.

2️⃣ Scripts con dotenv-cli (limpios y claros)

Instalación:

npm install -D dotenv-cli


Scripts recomendados:

{
  "scripts": {
    "dev": "dotenv -e .env nodemon src/index.ts",
    "test": "dotenv -e .env.test vitest",
    "test:u": "dotenv -e .env.test vitest test/user",
    "prisma:generate": "dotenv -e .env prisma generate",
    "prisma:migrate": "dotenv -e .env prisma migrate dev",
    "prisma:migrate:test": "dotenv -e .env.test prisma migrate deploy"
  }
}


✔️ Súper legible
✔️ Cada script deja claro qué env usa
✔️ No depende de NODE_ENV

3️⃣ ¿Sigue siendo necesario cross-env?

👉 No, si solo lo usabas para envs.

dotenv-cli:

funciona en Windows

no necesita cross-env

simplifica todo

Solo necesitarías cross-env si:

querés setear otras vars dinámicas (NODE_ENV, flags, etc.)

Ejemplo combinado (opcional):

"test": "cross-env NODE_ENV=test dotenv -e .env.test vitest"

4️⃣ Prisma + dotenv-cli = match perfecto

Prisma se lleva excelente con este enfoque porque:

Prisma lee envs en runtime

dotenv-cli las carga antes de arrancar

no hay lógica en el código

no hay sorpresas

Este patrón se usa mucho en:

monorepos

CI/CD

proyectos con múltiples DBs

5️⃣ Comparación rápida de enfoques
Enfoque	Complejidad	Limpieza	Recomendado
setupFiles Vitest	media	ok	solo para tests
dotenv/config	media	ok	apps simples
cross-env + dotenv	media	bien	Windows
dotenv-cli	⭐ simple	⭐⭐⭐	sí

👉 Para vos: dotenv-cli gana

6️⃣ Regla final (backend mindset)

El código no decide el entorno
Los scripts sí

Y dotenv-cli hace eso claro y explícito.

3️⃣ Next.js ya carga .env solo (detalle importante)

Next.js:

carga automáticamente:

.env.local

.env.development

.env.production

.env.test (en test)

👉 No necesitás dotenv-cli para next dev / build / start

Pero Prisma y Vitest sí.
```

## Explicacion Config_Test

```txt
1️⃣ “Las URLs fake… ¿por qué cambiamos la del DEFAULT si ya estaba en .env.test?”

👉 Muy buena observación.
La respuesta corta: aislamiento del test.

Lo que está pasando acá:
beforeEach(async () => {
  process.env.DEFAULT_USER_IMAGE_URL = "https://res.cloudinary.com/fake/default.png"
  await prisma.user.deleteMany()
})

¿Por qué redefinirla?

Aunque tengas esto en .env.test:

DEFAULT_USER_IMAGE_URL="https://res.cloudinary.com/demo/image/upload/default.png"


en tests NO confiamos en archivos externos.

Razones:

El test no debería depender de .env.test

Si mañana cambiás el .env.test, el test no debería romper

El test define su propio universo

👉 Esto es testing serio:

“El test controla TODO su contexto”

Por eso se redefine ahí mismo.

📌 Conclusión
✔️ Ambas URLs son falsas
✔️ La del test pisó a la del .env.test a propósito
✔️ Es buena práctica

3️⃣ Explicación profunda del bloque de imagen (esto es clave)
const filePath = path.resolve(__dirname, "../fixtures/default.png")


📌 Qué hace

Obtiene la ruta absoluta al archivo

__dirname = carpeta actual del test

../fixtures/default.png = imagen fake para tests

➡️ Evita rutas relativas frágiles.

const buffer = fs.readFileSync(filePath)


📌 Qué hace

Lee el archivo como binario

Devuelve un Buffer

Esto simula un archivo real.

const file = new File([buffer], "default.png", { type: "image/png" })


📌 Qué hace

Crea un objeto File compatible con Web API

Exactamente lo que formData.get("file") espera

👉 Esto es CRUCIAL:
Next.js no usa multer, usa Web APIs (File, FormData).

formData.append("file", file)


📌 Resultado
Tu controlador recibe:

const file = formData.get("file") as File


👉 Como si viniera del navegador.

4️⃣ ¿Por qué esto está muy bien hecho?

Porque:

No mockeás FormData

No mockeás File

Simulás flujo real end-to-end

Cloudinary está mockeado → infraestructura aislada

DB real de test → persistencia validada

Esto es integration test de verdad.
```


## Formdata.Get-Controller

```txt
disculpa y porque cuando usamos formdata tenemos que poner get("email")?.toString() || "" osea entiendo que el interrogante es para evitar null pero porque el union type es ""?

Excelente pregunta.
Esta es 100% de TypeScript + Web API, no de backend “porque sí”. Vamos fino.

1️⃣ Qué devuelve realmente formData.get()

Según la spec:

formData.get(name): FormDataEntryValue | null


Y FormDataEntryValue es:

type FormDataEntryValue = File | string


👉 O sea:

string | File | null

2️⃣ Entonces, ¿qué problema tenemos?

Cuando hacés:

formData.get("email")


TypeScript ve esto:

string | File | null


Pero:

Zod espera string

tu data.email es string

no puede ser File

no puede ser null

3️⃣ Por qué .toString()

Esto:

formData.get("email")?.toString()


Hace dos cosas:

?. → evita error si es null

.toString():

si es string → queda igual

si es File → devuelve "[object File]"

💡 Pero ojo:
Eso último NO debería pasar nunca para email.
Es solo para satisfacer el tipo.

4️⃣ Entonces… ¿por qué || ""?

Porque después de esto:

formData.get("email")?.toString()


el tipo es:

string | undefined


Si:

el campo no existe

o vino vacío

o get() devolvió null

👉 el resultado es undefined.

Pero tu objeto data exige:

email: string


Entonces:

|| ""


garantiza:

email: string

5️⃣ ¿Por qué no dejar undefined?

Porque:

Zod valida valores, no ausencia implícita

muchos schemas esperan string vacío para lanzar errores claros

undefined a veces salta validaciones distintas

Ejemplo:

z.string().min(1)


"" → ❌ “no puede estar vacío”

undefined → ❌ “required”

Ambos son válidos, pero:
👉 vos estás eligiendo una semántica clara.

6️⃣ Entonces, ¿esto es obligatorio?

❌ No obligatorio
✔️ Es defensivo y explícito

7️⃣ Alternativa más estricta (mejor tipada)

Si querés ser más purista:

const email = formData.get("email")

if (typeof email !== "string") {
  throw new Error("Email inválido")
}


O helper:

function getString(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === "string" ? value : ""
}


👉 Esto evita el .toString() silencioso.

8️⃣ ¿Entonces tu enfoque está mal?

❌ Para nada
✔️ Es común
✔️ Funciona
✔️ Es claro
✔️ Es seguro para APIs internas

Si esto fuera una lib pública, ahí sí conviene ser más estricto.

9️⃣ Resumen mental (importantísimo)

formData.get() → string | File | null

Tu dominio quiere → string

?. evita crash

|| "" normaliza

Zod decide si es válido o no
```
