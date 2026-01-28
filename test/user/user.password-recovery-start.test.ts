import { prisma } from "@/lib/prisma"
import { vi, beforeEach, afterEach, describe, it, expect, afterAll } from "vitest"
import { getUsers, loadUsers } from "../fake.user"
import { POST } from "@/api/user/password-recovery/start/route"
import { mailService } from "@/services/mail.service"

let users: any[]

vi.mock('@/services/mail.service', () => ({
    mailService: {
        sendPasswordRecovery: vi.fn()
    }
}))


const makeRequest = (body: { email: string, securityQuestion: string, securityAnswer: string }) => {
    return new Request("http://localhost/api/users/password-recovery/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })
}


beforeEach(async () => {
    await prisma.user.deleteMany()
    await loadUsers()
    users = await getUsers()
})

describe('POST /api/user/password-recovery/start', () => {
    it('Solicitud de recuperacion correcta', async () => {
        let obj = {
            email: users[0].email,
            securityQuestion: users[0].securityQuestion,
            securityAnswer: 'resident evil 2'
        }
        const res = await POST(makeRequest(obj))
        const body = await res.json()

        expect(res.status).toBe(200)
        expect(body).toHaveProperty('ok')
        expect(body.ok).toBe(true)
    })

    it('Mandar formulario vacio', async () => {
        let obj = {
            email: '',
            securityQuestion: '',
            securityAnswer: ''
        }
        const res = await POST(makeRequest(obj))
        const body = await res.json()

        expect(res.status).toBe(400)
        expect(body).toHaveProperty('error')
        expect(body.error).toHaveProperty('email')
        expect(body.error).toHaveProperty('securityQuestion')
        expect(body.error).toHaveProperty('securityAnswer')

    })

    it('Mandar respuesta incorrecta', async () => {
        let obj = {
            email: users[0].email,
            securityQuestion: users[0].securityQuestion,
            securityAnswer: 'resident evil 3'
        }
        const res = await POST(makeRequest(obj))
        const body = await res.json()

        expect(res.status).toBe(403)
        expect(body).toHaveProperty('error')
        expect(body.error).toBe('Credenciales invalidas')


    })

    it('Recuperar password con usuario inactivo', async () => {

        let obj = {
            email: users[2].email,
            securityQuestion: users[2].securityQuestion,
            securityAnswer: 'resident evil 2'
        }
        const res = await POST(makeRequest(obj))
        const body = await res.json()

        expect(res.status).toBe(403)
        expect(body).toHaveProperty('error')
        expect(body.error).toBe('Usuario inactivo')
    })

    describe('Envios de email', () => {
        it('envía el mail de recuperación correctamente', async () => {
            vi.mocked(mailService.sendPasswordRecovery).mockResolvedValue({
                accepted: ["test@mail.com"],
                rejected: [],
                response: "OK",
                messageId: "mock-id"
            } as any)


            const res = await POST(makeRequest({
                email: users[0].email,
                securityQuestion: users[0].securityQuestion,
                securityAnswer: 'resident evil 2'
            }))

            const body = await res.json()

            expect(res.status).toBe(200)
            expect(body.ok).toBe(true)

            expect(mailService.sendPasswordRecovery).toHaveBeenCalledOnce()
        })

        it('falla si no se puede enviar el mail', async () => {
            vi.mocked(mailService.sendPasswordRecovery).mockRejectedValue(
                new Error('SMTP error')
            )

            const res = await POST(makeRequest({
                email: users[0].email,
                securityQuestion: users[0].securityQuestion,
                securityAnswer: 'resident evil 2'
            }))

            const body = await res.json()

            expect(res.status).toBe(500)
            expect(body).toHaveProperty('error')

            expect(mailService.sendPasswordRecovery).toHaveBeenCalledOnce()
        })
    })

})



afterEach(() => {
    vi.resetAllMocks()
})

afterAll(async () => {
    await prisma.$disconnect()
})