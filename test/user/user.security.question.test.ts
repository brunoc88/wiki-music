import { prisma } from "@/lib/prisma"
import { getUsers, loadUsers } from "../fake.user"
import { vi, describe, expect, it, beforeEach, afterAll } from "vitest"
import { getServerSession } from "next-auth"
import { PATCH } from "@/api/user/security-question/route"

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

const makeRequest = (body: { securityQuestion?: string, securityAnswer: string }) => {
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


describe('PATCH /api/user/security-question', () => {

    describe('Update exitoso', () => {
        it('Cambiar respuesta', async () => {
            await mockAuthenticatedSession()


            let userTo = {
                securityAnswer: 'residentevil123'
            }

            const res = await PATCH(makeRequest(userTo))
            const body = await res.json()


            expect(res.status).toBe(200)
            expect(body).toHaveProperty('ok')
            expect(body.ok).toBe(true)

        })

        it('cambiar pregunta', async () => {
            await mockAuthenticatedSession()

            const questionBefore = users[0].securityQuestion

            let userTo = {
                securityQuestion: 'banda favorita?',
                securityAnswer: 'led zeppelind'
            }

            const res = await PATCH(makeRequest(userTo))
            const body = await res.json()

            const user = await prisma.user.findUnique({ where: { id: users[0].id } })
            const questionAfter = user?.securityQuestion


            expect(res.status).toBe(200)
            expect(body).toHaveProperty('ok')
            expect(body.ok).toBe(true)
            expect(questionAfter).toBe('banda favorita?')
            expect(questionAfter).not.toBe(questionBefore)
        })
    })

    describe('Validaciones & Exepciones', () => {
        it('Actualizar con misma pregunta', async () => {
            await mockAuthenticatedSession()

            const res = await PATCH(makeRequest({
                securityQuestion: users[0].securityQuestion,
                securityAnswer: 'led zeppelin'
            }))

            const body = await res.json()

            expect(res.status).toBe(403)
            expect(body).toHaveProperty('error')
            expect(body).not.toHaveProperty('ok')
            expect(body.error).toBe('La pregunta no puede ser la misma')
        })

        it('Actualizar con diferente pregunta pero misma respuesta', async () => {
            await mockAuthenticatedSession()

            const res = await PATCH(makeRequest({
                securityQuestion: 'banda favorita?',
                securityAnswer: 'resident evil 2'
            }))

            const body = await res.json()

            expect(res.status).toBe(403)
            expect(body).toHaveProperty('error')
            expect(body).not.toHaveProperty('ok')
            expect(body.error).toBe('La respuesta no puede ser la misma')
        })

        it('Actualizar solo respuesta pero misma respuesta', async () => {
            await mockAuthenticatedSession()

            const res = await PATCH(makeRequest({
                securityAnswer: 'resident evil 2'
            }))

            const body = await res.json()

            expect(res.status).toBe(403)
            expect(body).toHaveProperty('error')
            expect(body).not.toHaveProperty('ok')
            expect(body.error).toBe('La respuesta no puede ser la misma')
        })

        it('Enviar respuesta vacia', async () => {
            await mockAuthenticatedSession()

            const res = await PATCH(makeRequest({
                securityAnswer: ''
            }))

            const body = await res.json()

            expect(res.status).toBe(400)
            expect(body).toHaveProperty('error')
            expect(body.error.securityAnswer).toContain('Debe escribir una respuesta')
        })
    })
})


afterAll(async () => {
    await prisma.$disconnect()
})

