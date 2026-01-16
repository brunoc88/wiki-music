import { userRepo } from "@/repositories/user.repository"
import { RegisterUser } from "@/types/user.types"
import bcrypt from "bcryptjs"


export const userService = {
    create: async (data: RegisterUser) => {

        const hashpassword = await bcrypt.hash(data.password,10)
        const hashSecurityAnswer = await bcrypt.hash(data.securityAnswer,10)

        let userToCreate = {
            email:data.email,
            username: data.username,
            password: hashpassword,
            securityQuestion: data.securityQuestion,
            securityAnswer: hashSecurityAnswer,
            pic: data.pic? data.pic : 'default.png'
        }

        
        return userRepo.create({ ...userToCreate, rol:"comun"})
    }
}