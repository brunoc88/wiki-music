import { userRepo } from "@/repositories/user.repository"
import { RegisterUser } from "@/types/user.types"
import bcrypt from "bcryptjs"


export const userService = {
    create: async (data: RegisterUser) => {
        if(!data.pic) data.pic = 'default.png'

        const hashpassword = await bcrypt.hash(data.password,10)
        const hashSecurityAnswer = await bcrypt.hash(data.securityAnswer,10)

        data.password = hashpassword
        data.securityAnswer = hashSecurityAnswer
        
        return userRepo.create({ ...data, rol:"comun"})
    }
}