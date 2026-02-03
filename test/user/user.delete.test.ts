import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { vi, beforeEach, afterEach, describe, it, expect, afterAll } from "vitest"
import { getUsers, loadUsers } from "../fake.user"
import { DELETE } from "@/app/api/user/route"

let users: any[]

vi.mock('next-auth', async () => {
    const actual = await vi.importActual<any>('next-auth')
    return {
        ...actual,
        getServerSession: vi.fn()
    }
})

const makeRequest = (body: any) => {
    return new Request("http://localhost/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })
}

const mockAuthenticatedSession = () => {
    (getServerSession as any).mockResolvedValue({
        user: {
            id: users[0].id,
            email: users[0].email,
            name: users[0].username
        }
    })
}

const mockUnauthenticatedSession = () => {
    (getServerSession as any).mockResolvedValue(null)
}

beforeEach(async () => {
    await prisma.user.deleteMany()
    await loadUsers()
    users = await getUsers()
})



describe('DELETE /api/user', () => {
    it('Eliminacion exitosa', async () => {
        mockAuthenticatedSession()

        const res = await DELETE(makeRequest({ password: 'sekrets' }))
        const body = await res.json()

        const userAfter = await prisma.user.findUnique({ where: { id: users[0].id } })

        expect(res.status).toBe(200)
        expect(body.ok).toBe(true)
        expect(userAfter?.state).toBe(false)

    })

    it('Eliminar cuenta inactiva', async () => {

        // me autentico
        mockAuthenticatedSession()

        // inactivo la cuenta autenticada
        await prisma.user.update({ where: { id: users[0].id }, data: { state: false } })

        const res = await DELETE(makeRequest({ password: 'sekrets' }))
        const body = await res.json()

        expect(res.status).toBe(403)
        expect(body.error).toBe('Usuario inactivo')
    })

    it('Password incorrecto', async () => {
        mockAuthenticatedSession()

        const res = await DELETE(makeRequest({ password: 'secretos' }))
        const body = await res.json()

        expect(res.status).toBe(401)
        expect(body.error).toBe('Credenciales inválidas')
    })

    it('Password vacio', async () => {
        mockAuthenticatedSession()

        const res = await DELETE(makeRequest({ password: '' }))
        const body = await res.json()

        expect(res.status).toBe(400)
        expect(body).toHaveProperty('error')
        expect(body.error.password).toContain('Debe ingresar un password')
    })

    it('Password con espacios', async () => {
        mockAuthenticatedSession()

        const res = await DELETE(makeRequest({ password: 'se krets' }))
        const body = await res.json()

        expect(res.status).toBe(400)
        expect(body).toHaveProperty('error')
        expect(body.error.password).toContain('El password no puede contener espacios')
    })

    it('Sin autenticar', async () => {
        mockUnauthenticatedSession()

        const res = await DELETE(makeRequest({ password: 'sekrets' }))
        const body = await res.json()

        expect(res.status).toBe(401)
        expect(body).toHaveProperty('error')
        expect(body.error).toBe('Sin autorizacion')
    })
})

afterEach(() => {
  vi.resetAllMocks()
})

afterAll(async () => {
    await prisma.$disconnect()
})