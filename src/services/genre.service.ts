import { requireActiveUserById } from "@/domain/user/userAccess"
import { PublicGenderDTO } from "@/dtos/gender.dto"
import { ForbiddenError, NotFoundError } from "@/error/appError"
import { genreRepo } from "@/repositories/genre.repository"
import { Gender } from "@prisma/client"

export const genreService = {
    createGenre: async (data: { name: string }, userId: number): Promise<{ ok: true, gender: PublicGenderDTO }> => {
        const user = await requireActiveUserById(userId)
        const isAdminOrSuperAdmin = user.rol === 'admin' || user.rol === 'super'

        if (!isAdminOrSuperAdmin) throw new ForbiddenError()

        const res = await genreRepo.createGender(data)

        let gender = {
            id: res.id,
            name: res.name,
            state: res.state
        }
        return { ok: true, gender }
    },

    toggleActive: async (userId: number, genreId: number): Promise<{ ok: true }> => {
        let user = await requireActiveUserById(userId)

        let isSuperAdmin = user.rol === 'super'
        if (!isSuperAdmin) throw new ForbiddenError()

        let genre = await genreRepo.findGenrer(genreId)
        if (!genre) throw new NotFoundError()

        if (genre.state) return await genreRepo.deactivateGenre(genre.id)
        else return await genreRepo.activateGenre(genre.id)

    },

    editGenre: async (userId: number, genreId: number, data: { name: string }): Promise<Gender> => {
        let user = await requireActiveUserById(userId)
    
        const isAdminOrSuperAdmin = user.rol === 'admin' || user.rol === 'super'
        if(!isAdminOrSuperAdmin) throw new ForbiddenError()

        let genre = await genreRepo.findGenrer(genreId)
        if(!genre) throw new NotFoundError()

        return await genreRepo.editGenre(genreId, data)

    },

    getGenres: async (userId: number): Promise<Gender []| null> => {
        const user = await requireActiveUserById(userId)
        
        const isAdminOrSuperAdmin = user.rol === 'admin' || user.rol === 'super'
        if(!isAdminOrSuperAdmin) throw new ForbiddenError()
        
        return await genreRepo.getGenres()
    }
}