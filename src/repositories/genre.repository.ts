import { prisma } from "@/lib/prisma"
import { Gender } from "@prisma/client"

export const genreRepo = {
    createGender: async (data: { name: string }): Promise<Gender> => {
        return await prisma.gender.create({ data })
    },

    findGenrer: async (genrerId: number): Promise<Gender | null> => await prisma.gender.findUnique({ where: { id: genrerId } })
    ,

    deactivateGenre: async (genderId: number): Promise<{ ok: true }> => {
        await prisma.gender.update({ where: { id: genderId }, data: { state: false } })
        return { ok: true }
    },

    activateGenre: async (genderId: number): Promise<{ ok: true }> => {
        await prisma.gender.update({ where: { id: genderId }, data: { state: true } })
        return { ok: true }
    },

    editGenre: async (genderId:number, data:{name:string}) : Promise<Gender> => await prisma.gender.update({where:{id:genderId},data}),

    getGenres: async () : Promise<Gender []| null>=> await prisma.gender.findMany()

}