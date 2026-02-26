import { vi, describe, expect, it, beforeEach, afterAll } from "vitest";
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth";
import { getUsers } from "../fake.user";
import { getArtists, loadArtists } from "../fakeArtist";
import { DELETE } from "@/app/api/artist/[id]/delete/route";

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
    return new Request(`http://localhost/api/artist/toggle/${id}`, {
        method: 'DELETE'
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

describe('DELETE /api/artist/:id/delete', () => {
    it('Crear artista sin session', async () => {
        const res = await DELETE(makeRequest(artists[0].id), {
            params: { id: String(artists[0].id) }
        })

        const body = await res.json()

        expect(res.status).toBe(401)
        expect(body).toHaveProperty('error')
        expect(body.error).toBe('Sin autorizacion')
    })

    it('Crear astista con cuenta inactiva', async () => {
        mockAuthenticatedSession(5)

        const res = await DELETE(makeRequest(artists[0].id), {
            params: { id: String(artists[0].id) }
        })

        expect(res.status).toBe(403)
    })

    it('Borrar artista teniendo rol comun', async () => {
        mockAuthenticatedSession(3)

        const res = await DELETE(makeRequest(artists[0].id), {
            params: { id: String(artists[0].id) }
        })

        const body = await res.json()

        expect(res.status).toBe(403)
    })

    it('Borrar artista que no existe', async () => {
        mockAuthenticatedSession(0)

        const res = await DELETE(makeRequest(10), {
            params: { id: String(10) }
        })

        const body = await res.json()

        expect(res.status).toBe(404)


    })


    it('borrar artista correctamente', async () => {
        mockAuthenticatedSession(0)

        const res = await DELETE(makeRequest(artists[0].id), {
            params: { id: String(artists[0].id) }
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