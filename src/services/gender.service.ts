import { requireActiveUserById } from "@/domain/user/userAccess"
import { PublicGenderDTO } from "@/dtos/gender.dto"
import { ForbiddenError } from "@/error/appError"
import { genderRepo } from "@/repositories/gender.repository"

export const genderService = {
    createGender: async (data: { name: string }, userId: number): Promise<{ ok: true, gender:PublicGenderDTO }> => {
        const user = await requireActiveUserById(userId)
        const isAdminOrSuperAdmin = user.rol === 'admin' || user.rol === 'super'

        if (!isAdminOrSuperAdmin) throw new ForbiddenError()
        
        const res = await genderRepo.createGender(data)
        
        let gender = {
            id: res.id,
            name: res.name,
            state: res.state
        }
        return { ok: true , gender}
    }
}