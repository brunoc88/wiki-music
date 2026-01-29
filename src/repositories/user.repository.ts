import { prisma } from "@/lib/prisma"
import { CreateUser } from "@/types/user.types"
import { User } from "@prisma/client"

export const userRepo = {
    create: async (data: CreateUser): Promise<User> => await prisma.user.create({ data }),

    findUser: async (id: number): Promise<User | null> => await prisma.user.findUnique({ where: { id } }),

    findByEmail: async (email: string) => await prisma.user.findUnique({ where: { email } }),

    changePassword: async (password: string, userId: number): Promise<User> => {
        return await prisma.user.update({ where: { id: userId }, data: { password } })
    },

    deleteAccount: async (id: number): Promise<User> => await prisma.user.update({ where: { id }, data: { state: false } }),

    securityQuestionUpdate: async (data: { securityQuestion?: string, securityAnswer: string }, userId: number): Promise<User> => {
        return await prisma.user.update({ where: { id: userId }, data })
    },

    changeUsername: async (data: { username: string }, userId: number): Promise<User> => await prisma.user.update({ where: { id: userId }, data: { username: data.username } }),

    setRecoveryToken: async (data: { id: number, token: string, expires: Date }): Promise<void> => {
        await prisma.user.update({
            where: { id: data.id }, data: {
                recoveryToken: data.token,
                recoveryExpires: data.expires
            }
        })
    },

    getUserByRecoveryToken: async (token: string) => {
        return prisma.user.findFirst({
            where: {
                recoveryToken: token,
                recoveryExpires: {
                    gt: new Date()
                },
                state: true
            }
        })
    },

    resetPasswordByRecovery: async (data: {
        userId: number
        hashedPassword: string
    }) => {
        await prisma.user.update({
            where: { id: data.userId },
            data: {
                password: data.hashedPassword,
                recoveryToken: null,
                recoveryExpires: null
            }
        })
    },

    updateProfilePic: async (userId: number, data: { pic: string, picPublicId: string }): Promise<User> => {
        return await prisma.user.update({ where: { id: userId }, data })
    },

    deleteProfilePic: async (
        userId: number,
        data: {
            pic: string
            picPublicId: string | null
        }
    ): Promise<User> => {
        return prisma.user.update({
            where: { id: userId },
            data,
        })
    }


}