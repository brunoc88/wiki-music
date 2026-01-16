import { z } from 'zod'

const UserRegisterSchema = z.object({
    email: z
        .string()
        .nonempty('Debe ingresar un email')
        .email('Email inválido'),

    username: z
        .string()
        .nonempty('Debe ingresar un nombre de usuario')
        .min(5, 'Min 5 caracteres')
        .max(20, 'Max 20 caracteres')
        .refine(v => !v.includes(' '), {
            message: 'El username no puede contener espacios',
        })
        .transform(v => v.trim().toLowerCase()),

    password: z
        .string()
        .nonempty('Debe ingresar un password')
        .min(6, 'Min 6 caracteres')
        .refine(v => !v.includes(' '), {
            message: 'El password no puede contener espacios',
        }),

    password2: z
        .string()
        .nonempty('Debe ingresar un password')
        .min(6, 'Min 6 caracteres'),

    securityQuestion: z
        .string()
        .nonempty('Debe seleccionar una pregunta'),

    securityAnswer: z
        .string()
        .min(10, 'Min 10 caracteres'),

    pic: z.string().optional()

}).refine(data => data.password === data.password2, {
    message: 'Las contraseñas no coinciden',
    path: ['password2'],
})

export default UserRegisterSchema.transform(({ password2, ...data }) => data)


