import { prisma } from "@/lib/prisma"
import { CreateAlbum } from "@/types/album.types"
import { Album } from "@prisma/client"
import { UploadAlbum } from "@/types/album.types"

export const albumRepo = {
  createAlbum: async (album: CreateAlbum): Promise<{ ok: true }> => {

    await prisma.album.create({
      data: {
        name: album.name,
        artistId: album.artistId,
        pic: album.pic,
        picPublicId: album.picPublicId,
        createdById: album.createdById,

        genres: {
          connect: album.genres.map(id => ({ id }))
        },

        ...(album.songs && album.songs.length > 0 && {
          songs: {
            create: album.songs.map(song => ({
              name: song.name
            }))
          }
        })
      }
    })
    return { ok: true }
  },

  findAlbum: async (albumId: number): Promise<Album | null> => {
    return await prisma.album.findUnique({ where: { id: albumId } })
  },

  activeAlbum: async (albumId: number): Promise<{ ok: true }> => {
    await prisma.album.update({
      where: { id: albumId },
      data: { state: true }
    })

    return { ok: true }
  },

  desactiveAlbum: async (albumId: number): Promise<{ ok: true }> => {
    await prisma.album.update({
      where: { id: albumId },
      data: { state: false }
    })

    return { ok: true }
  },

  updateAlbum: async (data: UploadAlbum, albumId: number): Promise<{ ok: true }> => {
    const { genres, ...rest } = data

    await prisma.album.update({
      where: { id: albumId },
      data: {
        ...rest,
        genres: {
          set: genres.map(id => ({ id }))
        }
      }
    })

    return { ok: true }
  }

}