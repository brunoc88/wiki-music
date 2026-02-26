import { vi, describe, expect, it, beforeEach, afterAll } from "vitest";
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth";
import { getUsers } from "../fake.user";
import { getArtists, loadArtists } from "../fakeArtist";
import { PATCH } from "@/app/api/artist/[id]/active/route";


let users: any[]
let artists: any[]

vi.mock('next-auth', async () => {
    const actual = await vi.importActual<any>('next-auth')
    return {
        ...actual,
        getServerSession: vi.fn(),
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

const makeRequest = (id: number) => {
    mockAuthenticatedSession(0)
    return new Request(`http://localhost/api/artist/${id}/active`, {
        method: 'PATCH'
    })
}

beforeEach(async () => {
    await prisma.artist.deleteMany()
    await prisma.user.deleteMany()
    await prisma.gender.deleteMany()

    await loadArtists()

    users = await getUsers()
    artists = await getArtists()
})

describe('PATCH /api/artist/:id/active', () => {
    it('activar artista', async () => {
        const res = await PATCH(makeRequest(artists[4].id),{
            params:{id:String(artists[4].id)}
        })

        const body = await res.json()

        expect(res.status).toBe(200)
        expect(body).toHaveProperty('ok')
        expect(body.ok).toBe(true)
    })
})


afterAll(async () => {
    await prisma.$disconnect()
})