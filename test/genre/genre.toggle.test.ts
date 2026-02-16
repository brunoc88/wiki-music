import { describe, beforeEach, afterAll, vi, it, expect } from "vitest"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { loadUsers, getUsers } from "../fake.user"
import { PATCH } from "@/app/api/gender/toggle/[id]/route"

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



let users: any[]

beforeEach(async () => {
    await prisma.user.deleteMany()
    await prisma.gender.deleteMany()

    await loadUsers()
    users = await getUsers()
})

describe('PATCH /api/gender/:id/toggle', () => {
    it('Usuario sin session', async () => {
        mockUnauthenticatedSession()

        const req = new Request("http://localhost/api/gender/1/toggle", {
            method: "PATCH"
        })

        const response = await PATCH(req, {
            params: { id: "1" }
        })

        const body = await response.json()

        expect(response.status).toBe(401)
        expect(body).toHaveProperty('error')
        expect(body.error).toBe('Sin autorizacion')

    })

    it('Usuario desactivado', async () => {
        // user comun activo
        mockAuthenticatedSession(3)

        // desactivo user
        await prisma.user.update({ where: { id: users[3].id }, data: { state: false } })

        const req = new Request("http://localhost/api/gender/1/toggle", {
            method: "PATCH"
        })

        const response = await PATCH(req, {
            params: { id: "1" }
        })

        const body = await response.json()

        expect(response.status).toBe(403)
        expect(body).toHaveProperty('error')
        expect(body.error).toBe('Usuario inactivo')

    })

    it('Usuario rol admin o comun', async () => {
        // user comun activo
        mockAuthenticatedSession(3)


        const req = new Request("http://localhost/api/gender/1/toggle", {
            method: "PATCH"
        })

        const response = await PATCH(req, {
            params: { id: "1" }
        })

        const body = await response.json()

        expect(response.status).toBe(403)
        expect(body).toHaveProperty('error')
        expect(body.error).toBe('Acceso prohibido')

    })

    it('Genero no encontraro', async () => {
        mockAuthenticatedSession(7)
        const req = new Request("http://localhost/api/gender/1/toggle", {
            method: "PATCH"
        })

        const response = await PATCH(req, {
            params: { id: "1" }
        })

        const body = await response.json()

        expect(response.status).toBe(404)
        expect(body).toHaveProperty('error')
        expect(body.error).toBe('Recurso no encontrado')
    })

    it('Desactivar genero', async () => {
        mockAuthenticatedSession(7)

        // Crear género activo
        const createdGenre = await prisma.gender.create({
            data: {
                name: 'rock',
                state: true
            }
        })

        // Verificamos estado inicial
        expect(createdGenre.state).toBe(true)

        const req = new Request(
            `http://localhost/api/gender/${createdGenre.id}/toggle`,
            { method: "PATCH" }
        )

        const response = await PATCH(req, {
            params: { id: String(createdGenre.id) }
        })

        const body = await response.json()

        const genreAfter = await prisma.gender.findUnique({
            where: { id: createdGenre.id }
        })

        expect(response.status).toBe(200)
        expect(body).toHaveProperty('ok')
        expect(body.ok).toBe(true)

        expect(genreAfter?.state).toBe(false)
    })

    it('Volver a activar genero', async () => {
        mockAuthenticatedSession(7)

        const createdGenre = await prisma.gender.create({
            data: {
                name: 'rock',
                state: false
            }
        })

        expect(createdGenre.state).toBe(false)

        const req = new Request(
            `http://localhost/api/gender/${createdGenre.id}/toggle`,
            { method: "PATCH" }
        )

        const response = await PATCH(req, {
            params: { id: String(createdGenre.id) }
        })

        const genreAfter = await prisma.gender.findUnique({
            where: { id: createdGenre.id }
        })

        expect(response.status).toBe(200)
        expect(genreAfter?.state).toBe(true)
    })


})

afterAll(async () => {
    await prisma.$disconnect()
})