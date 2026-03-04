import { z } from "zod"

export const AlbumSchema = z.object({
    name: z
        .string()
        .nonempty('Debe escribir nombre')
        .min(2, 'Min 2 caracteres')
        .trim()
        .toLowerCase(),

    genres: z
        .union([z.string(), z.array(z.string())])
        .transform(val => {
            if (!val) return []
            return Array.isArray(val) ? val : [val]
        })
        .refine(arr => arr.length > 0, {
            message: "Debe seleccionar al menos un género"
        })
        .transform(arr => arr.map(Number)),

    artistId: z
        .string()
        .nonempty('Debe seleccionar un artista')
        .transform(val => Number(val)),

    songs: z.array(
        z.object({
            name: z.string().min(1)
        })
    ).optional()
})