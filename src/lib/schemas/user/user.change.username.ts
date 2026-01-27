import { z } from "zod"

const usernameChangeSchema = z.object({
    username: z
        .string()
        .nonempty('Debe ingresar un nombre de usuario')
        .min(5, 'Min 5 caracteres')
        .max(20, 'Max 20 caracteres')
        .trim()
        .toLowerCase()
        .refine(v => !v.includes(' '), {
            message: 'El username no puede contener espacios',
        })
})

export default usernameChangeSchema