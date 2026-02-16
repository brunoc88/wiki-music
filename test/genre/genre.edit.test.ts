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



afterAll(async () => {
    await prisma.$disconnect()
})