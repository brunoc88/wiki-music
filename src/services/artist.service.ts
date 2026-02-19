import { requireActiveUserById } from "@/domain/user/userAccess"
import { artistRepo } from "@/repositories/artist.repository"
import { RegisterArtist } from "@/types/artist.types"
import { uploadImage, deleteImage } from "@/lib/cloudinary"
import { activeGenres } from "@/domain/artist/activeGenres"
import { BadRequestError } from "@/error/appError"


export const artistService = {
    createArtist: async (
        artist: RegisterArtist,
        userId: number,
        imageFile?: File | null
    ) => {
        const user = await requireActiveUserById(userId)

        let imageUrl = process.env.DEFAULT_USER_IMAGE_URL!
        let imagePublicId: string | null = null

        try {
            if (imageFile) {
                const uploadResult = await uploadImage(imageFile, "artist")
                imageUrl = uploadResult.url
                imagePublicId = uploadResult.publicId
            }

            const active = await activeGenres(artist.genres)

            if (active.length !== artist.genres.length) {
                throw new BadRequestError(
                    "Uno o más géneros no están disponibles"
                )
            }

            const artistToCreate = {
                name: artist.name,
                bio: artist.bio,
                pic: imageUrl,
                picPublicId: imagePublicId,
                createdById: user.id
            }

            return await artistRepo.createArtist(
                artistToCreate,
                artist.genres
            )

        } catch (error) {
            if (imagePublicId) {
                await deleteImage(imagePublicId)
            }
            throw error
        }
    }

}