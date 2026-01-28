import { prisma } from "@/lib/prisma"
import { vi, beforeEach, afterEach, describe, it, expect, afterAll } from "vitest"
import { POST } from "@/api/user/password-recovery/confirm/route"
import { getUsers, loadUsers } from "../fake.user"

let users: any[]


const makeRequest = (body: { token: string, newPassword: string }) => {
    return new Request("http://localhost/api/users/password-recovery/confirm", {
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

describe('POST /api/user/password-recovery/confirm', () => {
    it('Solicitud de recuperacion correcta', async () => {
        const user = users[0]

        const token = crypto.randomUUID()

        await prisma.user.update({
            where: { id: user.id },
            data: {
                recoveryToken: token,
                recoveryExpires: new Date(Date.now() + 15 * 60 * 1000)
            }
        })

        const res = await POST(makeRequest({
            token,
            newPassword: 'jillvalentine'
        }))

        const body = await res.json()
       
        expect(res.status).toBe(200)
        expect(body).toHaveProperty('ok')
        expect(body.ok).toBe(true)
    })
})


afterEach(() => {
    vi.resetAllMocks()
})

afterAll(async () => {
    await prisma.$disconnect()
})