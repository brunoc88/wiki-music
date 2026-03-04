import { requireActiveUserById } from "@/domain/user/userAccess"
import { BadRequestError, NotFoundError } from "@/error/appError"
import { artistRepo } from "@/repositories/artist.repository"
import { CreateAlbum, RegisterAlbum } from "@/types/album.types"
import { activeGenres } from "@/domain/artist/activeGenres"
import { uploadImage, deleteImage } from "@/lib/cloudinary"
import { albumRepo } from "@/repositories/album.repository"

export const albumService = {
    createAlbum: async (userId: number, data: RegisterAlbum, imageFile?: File | null): Promise<{ ok: true }> => {
        const user = await requireActiveUserById(userId)

        let imageUrl = process.env.DEFAULT_USER_IMAGE_URL!

        let imagePublicId: string | null = null
        try {
            const artist = await artistRepo.findArtist(data.artistId)
            if (!artist) throw new NotFoundError()
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

            await albumRepo.createAlbum(albumToCreate)
            return { ok: true }

        } catch (error) {
            if (imagePublicId) {
                await deleteImage(imagePublicId)
            }
            throw error
        }

    }
}