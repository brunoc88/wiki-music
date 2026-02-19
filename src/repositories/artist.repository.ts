import {prisma} from "@/lib/prisma"
import { ArtistToCreate } from "@/types/artist.types"


export const artistRepo = {
  createArtist: async (
    data: ArtistToCreate,
    genres: number[]
  ) => {
    return await prisma.artist.create({
      data: {
        ...data,
        genres: {
          connect: genres.map(id => ({ id }))
        }
      }
    })
  }
}
