# Servicio: startPasswordRecovery

## Descripción
Este método inicia el flujo de recuperación de contraseña de un usuario.

Valida las credenciales de recuperación (email, pregunta y respuesta),
genera un token temporal y envía un email con el link de recuperación.

---

## Flujo paso a paso

1. **Obtención de datos**
   - Se reciben: `email`, `securityQuestion`, `securityAnswer`.

2. **Validación de usuario activo**
   - Se busca el usuario por email.
   - Si el usuario no existe o está inactivo, se lanza un error.

3. **Validación de pregunta de seguridad**
   - Se compara la pregunta recibida con la registrada.
   - Si no coincide → error 403.

4. **Validación de respuesta**
   - Se compara la respuesta usando `bcrypt.compare`.
   - Si no coincide → error 403.

5. **Generación del token**
   - Se genera un UUID como token.
   - Se define una expiración de 15 minutos.

6. **Persistencia**
   - Se guarda el token y su expiración en la base de datos.

7. **Envío de email**
   - Se envía un correo con el link de recuperación.
   - El token solo viaja por email, nunca en la respuesta HTTP.

8. **Respuesta**
   - Se devuelve `{ ok: true }`.

---

## Consideraciones de seguridad

- El token nunca se expone al frontend directamente.
- El email es el único canal de entrega del token.
- El token tiene expiración corta.
- Se reutiliza el estado activo del usuario como control adicional.

---

## Responsabilidad de errores

- Errores de validación → 403.
- Errores de email → deben ser manejados en el controller o middleware.
