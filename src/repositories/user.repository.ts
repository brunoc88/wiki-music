import { prisma } from "@/lib/prisma"
import { CreateUser } from "@/types/user.types"

export const userRepo = {
    create: async (data: CreateUser) => await prisma.user.create({ data }),

    findUser: async (id: number) => await prisma.user.findUnique({ where: { id } }),

    changePassword: async (password: string, userId: number) => {
        return await prisma.user.update({ where: { id: userId }, data: { password } })
    },

    deleteAccount: async (id: number) => await prisma.user.update({ where: { id }, data: { state: false } })
}