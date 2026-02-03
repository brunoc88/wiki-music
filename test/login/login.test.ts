import { describe, it, beforeEach, afterAll, expect } from "vitest"
import { prisma } from "@/lib/prisma"
import { getUsers, loadUsers } from "../fake.user"
import { authorizeUser } from "@/app/api/auth/credentials-authorize"

let users: any[] = []

beforeEach(async () => {
    await prisma.user.deleteMany()
    await loadUsers()
    users = await getUsers()
})

describe('POST login', () => {
    it('Validaciones', async () => {
        //let user = users[0]
        const res = await authorizeUser({ user: '', password: '' })
        expect(res).toBeNull()
    })

    it('Login exitoso', async () => {
        let user = users[0]
        const res = await authorizeUser({ user: user.email, password: 'sekrets' })
        expect(res).not.toBeNull()
        
    })
})

afterAll(async () => {
    await prisma.$disconnect()
})

