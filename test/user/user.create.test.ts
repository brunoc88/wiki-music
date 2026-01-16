import { describe, it, expect, beforeEach, afterAll } from "vitest"
import { prisma } from "@/lib/prisma"
import { POST } from "@/api/user/route"

beforeEach(async () => {
    await prisma.user.deleteMany()
})

const makeRequest = (body: any) => {
    return new Request('http://localhost/api/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
}

describe('POST /api/user', () => {
    describe('Registro exito', () => {
        it('Crear usuario sin imagen', async () => {
            const user = {
                email: 'bruno88@gmail.com',
                username: 'bruno88',
                password: '123456',
                password2: '123456',
                securityQuestion: 'lenguaje favorito?',
                securityAnswer: 'javascript',
                pic: '' // o directamente no mandarlo
            }

            const res = await POST(makeRequest(user))
            const body = await res.json()

            console.log("body", body)

            expect(res.status).toBe(201)
            expect(body.user).toBeDefined()
            expect(body.user.email).toBe(user.email)
        })
    })

    describe('Validaciones', () => {
        it('Campos vacios', async () => {
            const user = {
                email: '',
                username: '',
                password: '',
                password2: '',
                securityQuestion: '',
                securityAnswer: '',
                pic: '' // o directamente no mandarlo
            }
            const res = await POST(makeRequest(user))
            const body = await res.json()


            expect(res.status).toBe(400)
            expect(body.error).toBeDefined()
            expect(body.error).toHaveProperty('email')
            expect(body.error.email).toContain('Debe ingresar un email')
            expect(body.error.username).toContain('Debe ingresar un nombre de usuario')
            expect(body.error.password).toContain('Debe ingresar un password')
            expect(body.error.securityQuestion).toContain('Debe seleccionar una pregunta')
            expect(body.error.securityAnswer).toContain('Debe escribir una respuesta')
        })

        it('duplicado', async () =>{
            const user = {
                email: 'bruno88@gmail.com',
                username: 'bruno88',
                password: '123456',
                password2: '123456',
                securityQuestion: 'lenguaje favorito?',
                securityAnswer: 'javascript',
                pic: '' // o directamente no mandarlo
            }

            await POST(makeRequest(user))
            const res = await POST(makeRequest(user))
            const body = await res.json()

            expect(res.status).toBe(409)
            expect(body).toHaveProperty('error')
            expect(body.error).toBe(`El campo email ya está en uso`)
        })
    })
})

afterAll(async () => {
    await prisma.$disconnect()
})
