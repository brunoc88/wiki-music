import { requireActiveUserById } from "@/domain/user/userAccess"
import { PublicGenderDTO } from "@/dtos/gender.dto"
import { ForbiddenError, NotFoundError } from "@/error/appError"
import { genreRepo } from "@/repositories/genre.repository"

export const genreService = {
    createGenre: async (data: { name: string }, userId: number): Promise<{ ok: true, gender:PublicGenderDTO }> => {
        const user = await requireActiveUserById(userId)
        const isAdminOrSuperAdmin = user.rol === 'admin' || user.rol === 'super'

        if (!isAdminOrSuperAdmin) throw new ForbiddenError()
        
        const res = await genreRepo.createGender(data)
        
        let gender = {
            id: res.id,
            name: res.name,
            state: res.state
        }
        return { ok: true , gender}
    },

    toggleActive: async (userId:number, genderId:number): Promise<{ ok: true }> => {
        let user = await requireActiveUserById(userId)

        let isSuperAdmin = user.rol === 'super'
        if(!isSuperAdmin) throw new ForbiddenError()

        let genre = await genreRepo.findGenrer(genderId)
        if(!genre) throw new NotFoundError()
        
        if(genre.state) return await genreRepo.deactivateGenre(genre.id)
        else return await genreRepo.activateGenre(genre.id)
        
    },

    editGenre: async (userId:number, genderId:number) => {

    }
}