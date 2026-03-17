import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { vi, describe, expect, it, beforeEach, afterAll } from "vitest"
import { getUsers } from "../fake.user"
import { loadArtists, getArtists } from "../fakeArtist"
import { PATCH } from "@/app/api/album/edit/[id]/route"
import { getAlbums, loadAlbums } from "../dummyAlbums"
import { getGenres } from "../dummyGenre"


let users: any[]
let artists: any[]
let albums: any[]
let genres: any[]

beforeEach(async () => {
    await prisma.song.deleteMany()
    await prisma.album.deleteMany()
    await prisma.artist.deleteMany()
    await prisma.gender.deleteMany()
    await prisma.user.deleteMany()
    await loadArtists()
    await loadAlbums()

    users = await getUsers()
    albums = await getAlbums()
    genres = await getGenres()
    artists = await getArtists()
})


vi.mock('next-auth', async () => {
    const actual = await vi.importActual<any>('next-auth')
    return {
        ...actual,
        getServerSession: vi.fn()
    }
})

const mockAuthenticatedSession = (i: number) => {
    (getServerSession as any).mockResolvedValue({
        user: {
            id: users[i].id,
            email: users[i].email,
            name: users[i].username,
            rol: users[i].rol
        }
    })
}

const makeRequest = (formData: FormData, id: string) => {
    return new Request(`http://localhost/api/album/edit/${id}`, {
        method: "PATCH",
        body: formData
    })
}

describe('PATCH /api/album/edit/id', () => {
    it('cambiar nombre de album & genero, artista', async () => {
        mockAuthenticatedSession(0)

        const albumBefore = await prisma.album.findUnique({
            where: { id: albums[0].id },
            include: {
                genres: true
            }
        })
        const formData = new FormData()

        formData.append('name', 'The Wall')
        formData.append('genres', String(genres[1].id))
        formData.append('artistId', String(artists[0].id))

        const res = await PATCH(makeRequest(formData, albums[0].id), { params: { id: albums[0].id } })

        const albumAfter = await prisma.album.findUnique({
            where: { id: albums[0].id },
            include: {
                genres: true
            }
        })

        expect(res.status).toBe(200)
        expect(albumAfter?.updatedById).not.toBeNull()
        expect(albumAfter?.name).not.toEqual(albumBefore?.name)
        expect(albumAfter?.name).toBe('The Wall')
        expect(albumAfter?.genres[0].name).toBe(genres[1].name)
        expect(albumAfter?.artistId).not.toEqual(albumBefore?.artistId)
    })
})


afterAll(async () => await prisma.$disconnect())