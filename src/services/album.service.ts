import { requireActiveUserById } from "@/domain/user/userAccess"
import { BadRequestError, ForbiddenError, NotFoundError } from "@/error/appError"
import { artistRepo } from "@/repositories/artist.repository"
import { CreateAlbum, EditAlbum, EditSongs, RegisterAlbum} from "@/types/album.types"
import { activeGenres } from "@/domain/artist/activeGenres"
import { uploadImage, deleteImage } from "@/lib/cloudinary"
import { albumRepo } from "@/repositories/album.repository"
import { UploadAlbum } from "@/types/album.types"
import { Album } from "@prisma/client"


export const albumService = {
    createAlbum: async (userId: number, data: RegisterAlbum, imageFile?: File | null): Promise<Album> => {
        const user = await requireActiveUserById(userId)

        let imageUrl = process.env.DEFAULT_USER_IMAGE_URL!

        let imagePublicId: string | null = null
        try {
            const artist = await artistRepo.findArtist(data.artistId)
            if (!artist) throw new NotFoundError('Artist not found')
            if (!artist.state) throw new BadRequestError()

            const active = await activeGenres(data.genres)
            if (active.length !== data.genres.length) {
                throw new BadRequestError(
                    "Uno o más géneros no están disponibles"
                )
            }

            if (imageFile) {
                const uploadResult = await uploadImage(imageFile, "album")
                imageUrl = uploadResult.url
                imagePublicId = uploadResult.publicId
            }


            let albumToCreate: CreateAlbum = {
                name: data.name,
                genres: data.genres,
                artistId: data.artistId,
                pic: imageUrl,
                picPublicId: imagePublicId,
                createdById: user.id,
                songs: data.songs
            }

            const album = await albumRepo.createAlbum(albumToCreate)
            return album

        } catch (error) {
            if (imagePublicId) {
                await deleteImage(imagePublicId)
            }
            throw error
        }

    },

    toggleAlbum: async (userId: number, albumId: number): Promise<{ ok: true }> => {
        const user = await requireActiveUserById(userId)

        const isAdminOrSuper = user.rol === 'admin' || user.rol === 'super'
        if (!isAdminOrSuper) throw new ForbiddenError()

        const album = await albumRepo.findAlbum(albumId)
        if (!album) throw new NotFoundError()

        if (album.state) await albumRepo.desactiveAlbum(album.id)
        else await albumRepo.activeAlbum(album.id)

        return { ok: true }
    },

    updateAlbum: async (data: EditAlbum, albumId: number, userId: number, imageFile?: File | null): Promise<{ ok: true }> => {
        const user = await requireActiveUserById(userId)

        let imageUrl: string | undefined
        let imagePublicId: string | null = null

        try {
            const album = await albumRepo.findAlbum(albumId)
            if (!album) throw new NotFoundError('Album not found')
            if (!album.state) throw new BadRequestError()

            const artist = await artistRepo.findArtist(data.artistId)
            if (!artist) throw new NotFoundError('Artist not found')
            if (!artist.state) throw new BadRequestError()

            const active = await activeGenres(data.genres)
            if (active.length !== data.genres.length) {
                throw new BadRequestError(
                    "Uno o más géneros no están disponibles"
                )
            }

            let albumToUpdate: UploadAlbum = {
                name: data.name,
                artistId: artist.id,
                genres: data.genres,
                updatedById: user.id
            }

            if (imageFile) {
                const uploadResult = await uploadImage(imageFile, "album")
                imageUrl = uploadResult.url
                imagePublicId = uploadResult.publicId
                albumToUpdate.pic = imageUrl
                albumToUpdate.picPublicId = imagePublicId
            }

            await albumRepo.updateAlbum(albumToUpdate, album.id)
            return { ok: true }

        } catch (error) {
            if (imagePublicId) {
                await deleteImage(imagePublicId)
            }
            throw error
        }
    },

    updateSongs: async (
        data: EditSongs,
        albumId: number,
        userId: number
    ): Promise<{ ok: true }> => {

        const user = await requireActiveUserById(userId)

        const album = await albumRepo.findAlbum(albumId)
        if (!album) throw new NotFoundError()

        if (!album.state) throw new BadRequestError()

        await albumRepo.updateSongs(data.songs, album.id, user.id)

        return { ok: true }
    },

    getAlbumById: async (albumId:number) : Promise<Album | null>=> {
        const album = await albumRepo.findAlbumById(albumId)
        return album
    }
}