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

  findArtist: async (artistId: number): Promise<Artist | null> => {
    return await prisma.artist.findUnique({
      where: { id: artistId },
      include: {
        genres: true,
        createdBy:true,
        updatedBy:true
      }
    })
  },

  deleteArtist: async (artistId: number): Promise<{ ok: true }> => {
    await prisma.artist.update({
      where: { id: artistId },
      data: { state: false },
    })
    return { ok: true }
  },

  reactiveArtist: async (artistId: number): Promise<{ ok: true }> => {
    await prisma.artist.update({ where: { id: artistId }, data: { state: true } })
    return { ok: true }
  },

  updateArtist: async (
    artistId: number,
    data: {
      name?: string
      bio?: string
      genres?: number[]
      pic?: string
      picPublicId?: string,
      updatedById: number
    }
  ): Promise<{ ok: true }> => {

    const { genres, ...rest } = data

     await prisma.artist.update({
      where: { id: artistId },
      data: {
        ...rest,
        ...(genres && {
          genres: {
            set: genres.map(id => ({ id }))
          }
        })
      }
    })

    
    return { ok: true }
  },

  getAllActiveArtist: async () : Promise<Artist[] | null>=> {
    return await prisma.artist.findMany({where:{state:true}})
  }
}
