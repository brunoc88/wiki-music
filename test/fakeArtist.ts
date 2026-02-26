import { prisma } from "@/lib/prisma"
import { loadGenres, getGenres } from "./dummyGenre"
import { loadUsers, getUsers } from "./fake.user"

let genres: any[]
let users: any[]

export const loadArtists = async () => {
    await loadUsers()
    await loadGenres()

    users = await getUsers()
    genres = await getGenres()

    await prisma.artist.create({
        data: {
            name: 'Led Zeppelin',
            bio: 'Banda de rock formada en los 70',
            createdById: users[0].id,
            pic: 'fakepic',
            picPublicId: 'fakepicId',
            genres: {
                connect: [{ id: genres[0].id }]
            }
        }
    })

    await prisma.artist.create({
        data: {
            name: 'Pink Floyd',
            bio: 'Banda británica de rock progresivo',
            createdById: users[3].id,
            pic: 'fakepic',
            picPublicId: 'fakepicId',
            genres: {
                connect: [{ id: genres[1].id }]
            }
        }
    })

    await prisma.artist.create({
        data: {
            name: 'The Beatles',
            bio: 'Banda icónica de Liverpool',
            createdById: users[6].id,
            pic: 'fakepic',
            picPublicId: 'fakepicId',
            genres: {
                connect: [{ id: genres[0].id }, { id: genres[2].id }]
            }
        }
    })

    await prisma.artist.create({
        data: {
            name: 'Nirvana',
            bio: 'Banda referente del grunge',
            createdById: users[0].id,
            pic: 'fakepic',
            picPublicId: 'fakepicId',
            genres: {
                connect: [{ id: genres[0].id }]
            }
        }
    })

    await prisma.artist.create({
        data: {
            name: 'Daft Punk',
            bio: 'Dúo francés de música electrónica',
            state: false, 
            createdById: users[0].id,
            pic: 'fakepic',
            picPublicId: 'fakepicId',
            genres: {
                connect: [{ id: genres[1].id }]
            }
        }
    })
}

export const getArtists = async () => {
  return await prisma.artist.findMany({
    include: {
      genres: true
    }
  })
}