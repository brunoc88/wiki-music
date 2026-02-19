import {prisma} from "@/lib/prisma"

export const activeGenres = async (genreIds: number[]) => {
  return await prisma.gender.findMany({
    where: {
      id: { in: genreIds },
      state: true
    }
  })
}




