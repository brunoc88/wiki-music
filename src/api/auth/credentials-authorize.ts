import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authorizeUser = async ({ user, password }: { user: string, password: string }) => {
    const userDB = await prisma.user.findFirst({
        where: {
            OR: [
                { email: user },
                { username: user }
            ]
        }
    })

    if(!userDB) return null
    
    const isValid = await bcrypt.compare(password, userDB.password)
    if(!isValid) return null

    return { id: userDB.id, email: userDB.email, username:userDB.username }
}