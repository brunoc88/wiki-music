import { z } from 'zod'

const ChangePasswordSchema = z.object({
    oldpassword: z
        .string()
        .trim()
        .min(6, 'Min 6 caracteres')
        .nonempty('Debe ingresar su anterior password')
        .refine(v => !v.includes(' '), {
            message: 'El password no puede contener espacios',
        }),
    password: z
        .string()
        .trim()
        .min(6, 'Min 6 caracteres')
        .nonempty('Debe ingresar un password')
        .refine(v => !v.includes(' '), {
            message: 'El password no puede contener espacios',
        }),
    password2: z
        .string()
        .trim()
        .nonempty('Debe ingresar un password de confirmacion!')
        .min(6, 'Min 6 caracteres')
})
    .refine(data => data.password === data.password2, {
        message: 'Las contraseñas no coinciden',
        path: ['password2'],
    })

export default ChangePasswordSchema