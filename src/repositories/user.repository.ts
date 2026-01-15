import { prisma } from "@/lib/prisma"
import { User } from "@/types/user.types";

export const userRepo = {
    create: async (data:User) => await prisma.user.creata({data})
}