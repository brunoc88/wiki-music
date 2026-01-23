# dotenv-cli y Manejo de Entornos

## 1. Qué hace dotenv-cli

`dotenv-cli` carga un archivo `.env` **antes** de ejecutar un comando.

```bash
dotenv -e .env.test vitest
```

Sin imports
Sin setup files
Sin magia

---

## 2. Scripts recomendados

```json
{
  "scripts": {
    "dev": "dotenv -e .env nodemon src/index.ts",
    "test": "dotenv -e .env.test vitest",
    "prisma:generate": "dotenv -e .env prisma generate",
    "prisma:migrate:test": "dotenv -e .env.test prisma migrate deploy"
  }
}
```

✔️ Claro
✔️ Explícito
✔️ Funciona en Windows

---

## 3. dotenv-cli vs otras opciones

| Enfoque | Complejidad | Recomendado |
|------|-----------|-------------|
| setupFiles | media | solo tests |
| dotenv/config | media | apps simples |
| cross-env | media | flags |
| dotenv-cli | ⭐ | ✔️ sí |

---

## 4. Prisma y dotenv-cli

- Prisma lee envs en runtime
- dotenv-cli las carga antes

👉 Match perfecto para monorepos y CI/CD

---

## 5. Regla backend

> El código no decide el entorno
> Los scripts sí

