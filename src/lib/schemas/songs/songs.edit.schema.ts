import { z } from "zod"

export const EditSongsSchema = z.object({
  songs: z.array(
    z.object({
      name: z
        .string()
        .trim()
        .toLowerCase()
        .min(2, "La canción debe tener mínimo 2 caracteres")
    })
  ).min(1)
})