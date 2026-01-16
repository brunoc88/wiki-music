import { prisma } from "@/lib/prisma"
import { CreateUser } from "@/types/user.types"

export const userRepo = {
    create: async (data: CreateUser) => await prisma.user.create({ data })
}