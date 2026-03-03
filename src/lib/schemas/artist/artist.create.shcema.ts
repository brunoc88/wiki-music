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
        .union([z.string(), z.array(z.string())])
        .transform(val => {
            if (!val) return []
            return Array.isArray(val) ? val : [val]
        })
        .refine(arr => arr.length > 0, {
            message: "Debe seleccionar al menos un género"
        })
        .transform(arr => arr.map(Number))


})

export default ArtistRegisterSchema