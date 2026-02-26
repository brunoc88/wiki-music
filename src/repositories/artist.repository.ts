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

  findArtist: async (artistId: number) => {
    return await prisma.artist.findUnique({
      where: { id: artistId },
      include: {
        genres: true
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

  updateArtist: async (artistId: number, data: {
    pic: string
    picPublicId: string
    name: string
    bio: string
    genres: number[]
  }): Promise<{ ok: true }> => {
    await prisma.artist.update({ where: { id: artistId }, data })
    return { ok: true }
  }
}
