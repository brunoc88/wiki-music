import { z } from "zod"

const ArtistRegisterSchema = z.object({
    name: z
        .string()
        .nonempty('Debe ingresar un nombre')
        .min(2, 'Min 2 caracteres')
        .trim()
        .toLowerCase(),

    bio: z
        .string()
        .nonempty('Debe ingresar biografia')
        .trim()
        .min(10, 'Min 10 caracteres'),

    genres: z
    .array(z.coerce.number()) // 👈 convierte string → number
    .nonempty('Seleccione un genero')


})

export default ArtistRegisterSchema