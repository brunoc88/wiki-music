import { prisma } from "@/lib/prisma"

export const loadGenres = async () => {
    await prisma.$transaction([
        prisma.gender.createMany({
            data:[
                {
                    name:'rock'
                },
                {
                    name:'pop'
                },
                {
                    name:'country'
                },
                {
                    name:'jazz',
                    state:false
                }
            ]
        })
    ])
}

export const getGenres = async () => {
    return await prisma.gender.findMany()
}