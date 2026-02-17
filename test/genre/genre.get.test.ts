import { describe, beforeEach, afterAll, vi, it, expect } from "vitest"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { loadUsers, getUsers } from "../fake.user"
import { getGenres, loadGenres } from "../dummyGenre"
import { GET } from "@/app/api/gender/route"



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

const mockUnauthenticatedSession = () => {
    (getServerSession as any).mockResolvedValue(null)
}

const makeRequest = () => {
    return new Request(`http://localhost/api/gender`,
        {
            method: "GET",
        })
}

let users: any[]
let genres: any[]

beforeEach(async () => {
    await prisma.user.deleteMany()
    await prisma.gender.deleteMany()

    await loadUsers()
    await loadGenres()

    users = await getUsers()
    genres = await getGenres()

})


describe('GET /api/gender', () => {
    it('Obtener generos', async () => {
        mockAuthenticatedSession(0)
        const res = await GET(makeRequest())
        const body = await res.json()

        expect(res.status).toBe(200)
        expect(body).not.toBeNull()
    })

    it('Obtener generos sin session', async () => {

        const res = await GET(makeRequest())
        const body = await res.json()

        expect(res.status).toBe(401)
        expect(body).toHaveProperty('error')
        expect(body.error).toBe('Sin autorizacion')
    })

    it('Obtener generos siendo usuario rol comun', async () => {

        mockAuthenticatedSession(3)
        const res = await GET(makeRequest())
        const body = await res.json()

        expect(res.status).toBe(403)
        expect(body).toHaveProperty('error')
        expect(body.error).toBe('Acceso prohibido')
    })
})

afterAll(async () => {
    await prisma.$disconnect()
})