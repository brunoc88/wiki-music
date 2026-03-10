import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { vi, describe, expect, it, beforeEach, afterAll } from "vitest"
import { getUsers } from "../fake.user"
import { loadArtists } from "../fakeArtist"
import { PATCH } from "@/app/api/album/[id]/route"
import { getAlbums, loadAlbums } from "../dummyAlbums"

let users: any[]
let albums: any[]

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

const makeRequest = (id: string) => {
    return new Request(`http://localhost/api/album/${id}`, {
        method: "PATCH"
    })
}

describe('PATCH /api/album/:id', () => {
    it('Desactivar album', async () => {
        mockAuthenticatedSession(0)

        const albumBefore = albums[0].state

        const res = await PATCH(makeRequest(String(albums[0].id)), { params: { id: String(albums[0].id) } })
        const body = await res.json()

        const albumAfter = await prisma.album.findUnique({ where: { id: albums[0].id } })

        expect(res.status).toBe(200)
        expect(body).toHaveProperty('ok')
        expect(body.ok).toBe(true)
        expect(albumBefore).toBe(true)
        expect(albumAfter?.state).toBe(false)

    })

    it('Activar album', async () => {
        mockAuthenticatedSession(0)

        const albumBefore = albums[1].state

        const res = await PATCH(makeRequest(String(albums[1].id)), { params: { id: String(albums[1].id) } })
        const body = await res.json()

        const albumAfter = await prisma.album.findUnique({ where: { id: albums[1].id } })

        expect(res.status).toBe(200)
        expect(body).toHaveProperty('ok')
        expect(body.ok).toBe(true)
        expect(albumAfter?.state).not.toBe(albumBefore)

    })

    it('Activar album siendo usuario rol comun', async () => {
        mockAuthenticatedSession(3)

        const res = await PATCH(makeRequest(String(albums[1].id)), { params: { id: String(albums[1].id) } })

        expect(res.status).toBe(403)

    })
})


afterAll(async () => await prisma.$disconnect())