import { prisma } from "@/lib/prisma"
import { ArtistToCreate } from "@/types/artist.types"
import { Artist } from "@prisma/client"

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
  },

  findArtist: async (artistId: number): Promise<Artist | null> => await prisma.artist.findUnique({ where: { id: artistId } }),

  deleteArtist: async (artistId: number): Promise<{ ok: true }> => {
    await prisma.artist.update({
      where: { id: artistId },
      data: { state: false },
    })
    return { ok: true }
  },

  reactiveArtist: async (artistId: number) : Promise<{ ok: true }> => {
    await prisma.artist.update({where:{id:artistId}, data:{state:true}})
    return {ok:true}
  }
}
