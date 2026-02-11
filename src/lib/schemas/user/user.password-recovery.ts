import { z } from "zod"

const userPasswordRecoverySchema = z.object({
    email: z
        .string()
        .nonempty('Ingrese un email')
        .email('Email inválido'),

    securityQuestion: z
        .string()
        .nonempty('Debe seleccionar una pregunta'),

    securityAnswer: z
        .string()
        .nonempty('Debe escribir una respuesta')
        .min(10, 'Min 10 caracteres')
})

export default userPasswordRecoverySchema