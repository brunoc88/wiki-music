import { prisma } from "@/lib/prisma"
import { getArtists } from "./fakeArtist"
import { getGenres } from "./dummyGenre"
import { getUsers } from "./fake.user"

let artists: any[]
let genres: any[]
let users: any[]

export const loadAlbums = async () => {

    artists = await getArtists()
    genres = await getGenres()
    users = await getUsers()

    await prisma.album.create({
        data: {
            name: "The Dark Side of the Moon",
            pic: "fakepic",
            picPublicId: "fakepicId",
            artistId: artists[1].id,
            createdById: users[0].id,
            genres: {
                connect: [{ id: genres[0].id }]
            },
            songs: {
                create: [
                    { name: "Speak to Me" },
                    { name: "Breathe (In the Air)" },
                    { name: "On the Run" },
                    { name: "Time" },
                    { name: "The Great Gig in the Sky" },
                    { name: "Money" },
                    { name: "Us and Them" },
                    { name: "Any Colour You Like" },
                    { name: "Brain Damage" },
                    { name: "Eclipse" }
                ]
            }
        }
    })

    await prisma.album.create({
        data: {
            name: "Led Zeppelin IV",
            pic: "fakepic",
            picPublicId: "fakepicId",
            artistId: artists[0].id,
            createdById: users[0].id,
            state: false,
            genres: {
                connect: [{ id: genres[0].id }]
            },
            songs: {
                create: [
                    { name: "Black Dog" },
                    { name: "Rock and Roll" },
                    { name: "The Battle of Evermore" },
                    { name: "Stairway to Heaven" },
                    { name: "Misty Mountain Hop" },
                    { name: "Four Sticks" },
                    { name: "Going to California" },
                    { name: "When the Levee Breaks" }
                ]
            }
        }
    })

}

export const getAlbums = async () => prisma.album.findMany()