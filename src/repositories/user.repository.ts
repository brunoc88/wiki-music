import { prisma } from "@/lib/prisma"
import { CreateUser } from "@/types/user.types"
import { User } from "@prisma/client"

export const userRepo = {
    create: async (data: CreateUser): Promise<User> => await prisma.user.create({ data }),

    findUser: async (id: number): Promise<User | null> => await prisma.user.findUnique({ where: { id } }),

    changePassword: async (password: string, userId: number): Promise<User> => {
        return await prisma.user.update({ where: { id: userId }, data: { password } })
    },

    deleteAccount: async (id: number): Promise<User> => await prisma.user.update({ where: { id }, data: { state: false } }),

    securityQuestionUpdate: async (data: { securityQuestion?: string, securityAnswer: string }, userId: number): Promise<User> => {
        return await prisma.user.update({ where: { id: userId }, data })
    }
}