import { prisma } from "@/lib/prisma"
import { CreateAlbum } from "@/types/album.types"

export const albumRepo = {
  createAlbum: async (album: CreateAlbum) : Promise<{ok:true}> => {
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
    return {ok:true}
  }
}