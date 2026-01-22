import { z } from 'zod'

const userDeleteAccountSchema = z.object({
    password: z
        .string()
        .nonempty('Debe ingresar un password')
        .min(6, 'Min 6 caracteres')
        .refine(v => !v.includes(' '), {
            message: 'El password no puede contener espacios',
        })
})

export default userDeleteAccountSchema