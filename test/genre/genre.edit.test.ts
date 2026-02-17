import { describe, beforeEach, afterAll, vi, it, expect } from "vitest"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { loadUsers, getUsers } from "../fake.user"
import { getGenres, loadGenres } from "../dummyGenre"
import { PATCH } from "@/app/api/gender/[id]/route"


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

const makeRequest = (id: string, body: { name: string }) => {
    return new Request(`http://localhost/api/gender/${id}`,
        {
            method: "PATCH",
            body: JSON.stringify(body)
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

describe('PATCH /api/gender/:id', () => {
    it('Cambio valido', async () => {
        mockAuthenticatedSession(0)

        let genre = genres[0]

        const res = await PATCH(makeRequest(genre.id, { name: 'reggea' }), { params: { id: genre.id } })
        const body = await res.json()

        expect(res.status).toBe(200)
        expect(body).toHaveProperty('name')
        expect(body.name).not.toBe(genre.name)
    })

    it('Cambio invalido', async () => {
        mockAuthenticatedSession(0)

        let genre = genres[0]

        const res = await PATCH(makeRequest(genre.id, { name: 'r' }), { params: { id: genre.id } })
        const body = await res.json()

        expect(res.status).toBe(400)
        expect(body).toHaveProperty('error')
        expect(body.error).toHaveProperty('name')
        expect(body.error.name).toContain('Min 2 caracteres')
    })

    it('Usuario rol comun', async () => {
        mockAuthenticatedSession(3)

        let genre = genres[0]

        const res = await PATCH(makeRequest(genre.id, { name: 'rock & pop' }), { params: { id: genre.id } })
        const body = await res.json()

        expect(res.status).toBe(403)
        expect(body).toHaveProperty('error')
    })
})

afterAll(async () => {
    await prisma.$disconnect()
})