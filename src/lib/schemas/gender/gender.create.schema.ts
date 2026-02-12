import {z} from "zod"

const genderCreateSchema = z.object({
    name: z
    .string()
    .nonempty('Debe escribir un genero')
    .min(2, 'Min 2 caracteres')
    .trim()
    .toLowerCase()
})


export default genderCreateSchema