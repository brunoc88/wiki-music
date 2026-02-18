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
        .array(z.number())
        .min(1, 'Debe seleccionar al menos un género')

})

export default ArtistRegisterSchema