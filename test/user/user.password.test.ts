import { describe, it, beforeEach, afterAll,afterEach, expect, vi } from 'vitest'
import { PATCH } from "@/app/api/user/password/route"
import { loadUsers, getUsers } from '../fake.user'
import { prisma } from "@/lib/prisma"
import { getServerSession } from 'next-auth'


vi.mock('next-auth', async () => {
    const actual = await vi.importActual<any>('next-auth')
    return {
        ...actual,
        getServerSession: vi.fn()
    }
})

let users: any[]

const makeRequest = (body: { oldpassword: string, password: string, password2: string }) => {
    return new Request('http://localhost/api/user/password', {
        method: 'PATCH',
        body: JSON.stringify(body)
    })
}


beforeEach(async () => {
    await prisma.user.deleteMany()
    await loadUsers()
    users = await getUsers()
})

describe('PATCH /api/user/password', () => {
    describe('Cambiar Password', () => {
        it('Cambiar password con exito', async () => {
            (getServerSession as any).mockResolvedValue({
                user: {
                    id: users[0].id,
                    email: users[0].email,
                    name: users[0].username
                }
            })

            let res = await PATCH(makeRequest({
                oldpassword: 'sekrets',
                password: '123123',
                password2: '123123'
            }))

            const body = await res.json()

            expect(res.status).toBe(200)
            expect(body).toHaveProperty('ok')
            expect(body.ok).toBe(true)
        })
    })

    describe('Validaciones: Cambio de password', () => {
        it('Sin autorizacion', async () => {
            (getServerSession as any).mockResolvedValue(null)

            let res = await PATCH(makeRequest({
                oldpassword: 'sekrets',
                password: '123123',
                password2: '123123'
            }))

            const body = await res.json()

            expect(res.status).toBe(401)
            expect(body).toHaveProperty('error')
            expect(body.error).toBe('Sin autorizacion')

        })

        it('Password & password2 diferentes', async () => {
            (getServerSession as any).mockResolvedValue({
                user: {
                    id: users[0].id,
                    email: users[0].email,
                    name: users[0].username
                }
            })

            let res = await PATCH(makeRequest({
                oldpassword: 'sekrets',
                password: '123123',
                password2: '1231237'
            }))

            const body = await res.json()

            expect(res.status).toBe(400)
            expect(body).toHaveProperty('error')
            expect(body.error).toHaveProperty('password2')
            expect(body.error.password2).toContain('Las contraseñas no coinciden')
        })

        it('Password vacio', async () => {
            (getServerSession as any).mockResolvedValue({
                user: {
                    id: users[0].id,
                    email: users[0].email,
                    name: users[0].username
                }
            })

            let res = await PATCH(makeRequest({
                oldpassword: 'sekrets',
                password: '',
                password2: '1231237'
            }))

            const body = await res.json()

            expect(res.status).toBe(400)
            expect(body).toHaveProperty('error')
            expect(body.error).toHaveProperty('password2')
            expect(body.error).toHaveProperty('password2')
            expect(body.error.password).toContain('Debe ingresar un password')
            expect(body.error.password2).toContain('Las contraseñas no coinciden')

        })

        it('Password viejo incorrecto', async () => {
            (getServerSession as any).mockResolvedValue({
                user: {
                    id: users[0].id,
                    email: users[0].email,
                    name: users[0].username
                }
            })

            let res = await PATCH(makeRequest({
                oldpassword: 'secretos',
                password: '1231237',
                password2: '1231237'
            }))

            const body = await res.json()

            expect(res.status).toBe(403)
            expect(body).toHaveProperty('error')
            expect(body.error).toBe('Credenciales inválidas')

        })

        it('Password viejo como nuevo password', async () => {
            (getServerSession as any).mockResolvedValue({
                user: {
                    id: users[0].id,
                    email: users[0].email,
                    name: users[0].username
                }
            })

            let res = await PATCH(makeRequest({
                oldpassword: 'sekrets',
                password: 'sekrets',
                password2: 'sekrets'
            }))

            const body = await res.json()

            expect(res.status).toBe(403)
            expect(body).toHaveProperty('error')
            expect(body.error).toBe('El nuevo password no puede ser igual al anterior')

        })
    })
})


afterEach(() => {
  vi.resetAllMocks()
})

afterAll(async () => {
    await prisma.$disconnect()
})

