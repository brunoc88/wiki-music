import { prisma } from "@/lib/prisma"
import {Gender} from "@prisma/client"

export const genderRepo = {
    createGender: async (data:{name:string}) : Promise<Gender>=> {
        return await prisma.gender.create({data})
    }
}