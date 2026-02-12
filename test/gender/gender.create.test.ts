import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { describe, expect, it, beforeEach, afterAll, vi } from "vitest"
import { getUsers, loadUsers } from "../fake.user"
import { POST } from "@/app/api/gender/page"


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

const makeRequest = (data: { name: string }) => {
  return new Request('http://localhost/api/gender', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json' // ⚠ esto es clave
    },
    body: JSON.stringify(data)
  })
}


let users: any[]

beforeEach(async () => {
    await prisma.user.deleteMany()
    await prisma.gender.deleteMany()

    await loadUsers()
    users = await getUsers()
})

describe('POST /api/gender', () => {
    describe('Probando validaciones', () => {
        it('enviar genero sin nombre', async () => {
            mockAuthenticatedSession(0)

            const res = await POST(makeRequest({ name: '' }))

            const body = await res.json()

            expect(res.status).toBe(400)
            expect(body).toHaveProperty('error')
            expect(body.error).toHaveProperty('name')
            expect(body.error.name).toContain('Debe escribir un genero')
        })

        it('enviar genero con 1 caracter', async () => {
            mockAuthenticatedSession(0)

            const res = await POST(makeRequest({ name: 'a' }))

            const body = await res.json()

            expect(res.status).toBe(400)
            expect(body).toHaveProperty('error')
            expect(body.error).toHaveProperty('name')
            expect(body.error.name).toContain('Min 2 caracteres')
        })

    })

    describe('Validaciones de usuario', () => {
        it('Falta de session', async () => {
            mockUnauthenticatedSession()
            const res = await POST(makeRequest({ name: 'rock' }))
            const body = await res.json()

            expect(res.status).toBe(401)
            expect(body.error).toBe('Sin autorizacion')

        })

        it('Cuenta suspendia', async () => {
            mockAuthenticatedSession(0)

            await prisma.user.update({ where: { id: users[0].id }, data: { state: false } })

            const res = await POST(makeRequest({ name: 'rock' }))
            const body = await res.json()

            expect(res.status).toBe(403)
            expect(body.error).toBe('Usuario inactivo')

        })

        it('Usuario que no es admin o super admin', async () => {
            mockAuthenticatedSession(3)

            const res = await POST(makeRequest({ name: 'rock' }))
            const body = await res.json()

            expect(res.status).toBe(403)
            expect(body.error).toBe('Acceso prohibido')

        })
    })

    it.only('Creacion exitosa', async () => {
        mockAuthenticatedSession(0)
        
        const res = await POST(makeRequest({ name: 'ro' }))

        const body = await res.json()

        expect(res.status).toBe(201)
        expect(body).toHaveProperty('ok')
        expect(body).toHaveProperty('gender')
    })
})

afterAll(async () => {
    await prisma.$disconnect()
})