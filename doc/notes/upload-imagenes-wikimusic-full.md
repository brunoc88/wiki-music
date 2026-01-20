
# Manejo de Imágenes en WikiMusic  
## Next.js + TypeScript + Cloudinary (sin Multer)

---

## 1. Problema real a resolver

Queremos subir imágenes para:
- usuarios
- artistas
- álbumes

Requisitos reales:
- deploy en **Vercel**
- persistencia de imágenes
- arquitectura limpia (controller / service / repo)
- manejo correcto de errores
- imagen default
- escalable

---

## 2. Por qué Multer NO es la opción correcta

### Multer funciona bien cuando:
- usás Express tradicional
- tenés un servidor persistente
- filesystem local disponible

### En Next.js + Vercel:
- las funciones son **serverless**
- el filesystem es **temporal**
- `public/uploads` se borra entre requests
- no escala horizontalmente
- rompe en producción

👉 Conclusión clara:
**Multer solo sirve para desarrollo local, NO para producción en Vercel.**

---

## 3. Enfoque correcto: Upload Provider externo

Usamos un servicio externo para manejar archivos.

Ejemplos:
- Cloudinary
- S3 + CloudFront
- Supabase Storage

Elegimos **Cloudinary** porque:
- simple
- CDN incluido
- SDK maduro
- borrado por ID
- optimización automática

Cloudinary es **infraestructura**, no dominio.

---

## 4. Qué hace Cloudinary exactamente

Cloudinary:
- recibe un archivo (buffer / stream / base64)
- lo guarda de forma persistente
- lo expone vía CDN
- devuelve:
  - `secure_url`
  - `public_id`

Cloudinary **NO sabe**:
- qué es un usuario
- qué es un artista
- qué es un álbum

Solo maneja archivos.

---

## 5. Arquitectura limpia (responsabilidades)

### Controller
- recibe request
- extrae body / params / file
- delega al service

Nunca:
- sube imágenes
- borra imágenes
- decide reglas

---

### Service (capa clave)
- reglas de negocio
- decide si hay imagen
- decide usar default
- coordina:
  - upload
  - delete
  - persistencia
- maneja rollbacks

---

### Upload Provider (Cloudinary adapter)
- función pura
- recibe archivo
- devuelve `{ url, publicId }`
- no conoce la app

---

### Repository
- persiste datos
- guarda URLs
- no sabe de Cloudinary

---

## 6. Flujo completo

1. Request llega (imagen opcional)
2. Controller delega
3. Service:
   - valida
   - sube imagen si existe
   - usa default si no
4. Repo guarda
5. Response OK

---

## 7. Imagen default (patrón profesional)

Estrategia correcta:
- subir **una sola imagen default**
- guardar su URL en config/env
- NO duplicar uploads

Ventajas:
- menos costos
- menos complejidad
- consistencia

---

## 8. Casos borde importantes

- crear sinC sin imagen
- crear con imagen
- editar sin imagen
- editar con imagen nueva
- error subiendo imagen
- error guardando en DB (rollback)

---

## 9. Resultado final

- deployable en Vercel
- sin filesystem
- arquitectura limpia
- escalable
- nivel mid/senior

