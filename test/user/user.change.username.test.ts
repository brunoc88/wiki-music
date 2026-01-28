import { prisma } from "@/lib/prisma"
import { getUsers, loadUsers } from "../fake.user"
import { vi, describe, expect, it, beforeEach, afterAll } from "vitest"
import { getServerSession } from "next-auth"
import { PATCH } from "@/api/user/route"

let users: any[]

vi.mock('next-auth', async () => {
    const actual = await vi.importActual<any>('next-auth')
    return {
        ...actual,
        getServerSession: vi.fn()
    }
})

const mockAuthenticatedSession = () => {
    (getServerSession as any).mockResolvedValue({
        user: {
            id: users[0].id,
            email: users[0].email,
            name: users[0].username
        }
    })
}

const makeRequest = (body: { username: string }) => {
    return new Request('http://localhost/api/user/security-question', {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })
}

beforeEach(async () => {
    await prisma.user.deleteMany()
    await loadUsers()
    users = await getUsers()
})

describe('PATCH /api/user', () => {
    it('Cambiar username exitoso', async () => {
        await mockAuthenticatedSession()

        const usernameBefore: string = users[0].username

        const res = await PATCH(makeRequest({ username: 'brunoc88' }))
        const body = await res.json()

        expect(res.status).toBe(200)
        expect(body).toHaveProperty('ok')
        expect(body).toHaveProperty('username')
        expect(body.ok).toBe(true)
        expect(body.username).toBe('brunoc88')
        expect(body.username).not.toBe(usernameBefore)

    })

    it('validaciones de zod: trim(), toLowerCase()', async () => {
        await mockAuthenticatedSession()

        const res = await PATCH(makeRequest({ username: ' BRUNOC88 ' }))
        const body = await res.json()

        expect(res.status).toBe(200)
        expect(body).toHaveProperty('ok')
        expect(body).toHaveProperty('username')
        expect(body.ok).toBe(true)
        expect(body.username).toBe('brunoc88')
    })

    it('Duplicado', async()=> {
        await mockAuthenticatedSession()

        const res = await PATCH(makeRequest({username:'admin2'}))
        expect(res.status).toBe(409)
    })
})

afterAll(async () => {
    await prisma.$disconnect()
})