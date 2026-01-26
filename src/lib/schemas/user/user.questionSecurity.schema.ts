import { z } from "zod"

const userSecurtiyQuestionSchema = z.object({
    securityQuestion: z
        .string()
        .trim()
        .optional(),

    securityAnswer: z
        .string()
        .trim()
        .nonempty('Debe escribir una respuesta')
        .min(10, 'Min 10 caracteres')
})

export default userSecurtiyQuestionSchema
