import { requireActiveUserById } from "@/domain/user/userAccess"
import { artistRepo } from "@/repositories/artist.repository"
import { RegisterArtist, UpdateArtistData } from "@/types/artist.types"
import { uploadImage, deleteImage } from "@/lib/cloudinary"
import { activeGenres } from "@/domain/artist/activeGenres"
import { BadRequestError, ForbiddenError, NotFoundError } from "@/error/appError"



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
    },

    deleteArtist: async (artistId: number, userId: number) => {
        const user = await requireActiveUserById(userId)
        let isAdminOrSuper = user.rol === 'admin' || user.rol === 'super'
        if (!isAdminOrSuper) throw new ForbiddenError()

        const artist = await artistRepo.findArtist(artistId)
        if (!artist) throw new NotFoundError()

        return await artistRepo.deleteArtist(artistId)
    },

    reactiveArtist: async (artistId: number, userId: number): Promise<{ ok: true }> => {
        const user = await requireActiveUserById(userId)
        const isAdminOrSuper = user.rol === 'admin' || user.rol === 'super'
        if (!isAdminOrSuper) throw new ForbiddenError()

        const artist = await artistRepo.findArtist(artistId)
        if (!artist) throw new NotFoundError()

        return await artistRepo.reactiveArtist(artist.id)
    },

    updateArtist: async (
    data: RegisterArtist,
    imageFile: File | null | undefined,
    artistId: number,
    userId: number
) => {
    await requireActiveUserById(userId)

    const artist = await artistRepo.findArtist(artistId)
    if (!artist) throw new NotFoundError()
    if (!artist.state) throw new ForbiddenError("Artista inactivo")

    const active = await activeGenres(data.genres)
    if (active.length !== data.genres.length) {
        throw new BadRequestError(
            "Uno o más géneros no están disponibles"
        )
    }

    let updatedFields: UpdateArtistData = { ...data, updatedById:userId }

    if (imageFile instanceof File) {
        const uploadResult = await uploadImage(imageFile, "artist")

        updatedFields.pic = uploadResult.url
        updatedFields.picPublicId = uploadResult.publicId
    }

    
    await artistRepo.updateArtist(artistId, updatedFields)

    return { ok: true }
    },

    getArtistById: async (artistId:number) => {
        const artist = await artistRepo.findArtist(artistId)

        if(!artist) throw new NotFoundError('Artist Not Found')
        if(!artist.state) throw new BadRequestError()

        return artist
    }

}