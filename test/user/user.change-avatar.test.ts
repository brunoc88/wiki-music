import { describe, it, expect, beforeEach, afterAll, vi, afterEach } from "vitest"
import { prisma } from "@/lib/prisma"
import fs from "fs"
import path from "path"
import { PATCH } from "@/app/api/user/avatar/router"
import { getServerSession } from "next-auth"
import { getUsers, loadUsers } from "../fake.user"

let users: any[]

//  Mockear Cloudinary
vi.mock("@/lib/cloudinary", () => {
    return {
        uploadImage: vi.fn(async (file: File, folder: string) => {
            return {
                url: "https://res.cloudinary.com/fake/image.png",
                publicId: "users/fake-id"
            }
        }),
        deleteImage: vi.fn(async (publicId: string) => {
            return
        })
    }
})

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

//  limpiar DB antes de cada test
beforeEach(async () => {
    process.env.DEFAULT_USER_IMAGE_URL = "https://res.cloudinary.com/fake/default.png"
    await prisma.user.deleteMany()
    await loadUsers()
    users = await getUsers()
})

describe('PATCH /api/user/avatar', () => {
    it('Cambiar avatar', async () => {
        await mockAuthenticatedSession()

        const formData = new FormData()

        // imagen desde fixtures
        const filePath = path.resolve(__dirname, "../fixtures/default.png")
        const buffer = fs.readFileSync(filePath)
        const file = new File([buffer], "default.png", { type: "image/png" })
        formData.append("file", file)

        const req = new Request("http://localhost/api/user/avatar", {
            method: "PATCH",
            body: formData
        })


        const res = await PATCH(req)
        const body = await res.json()

        expect(res.status).toBe(200)
        expect(body.ok).toBeDefined()
        expect(body.ok).toBe(true)

    })
    it('Falla si no se envía imagen', async () => {
        await mockAuthenticatedSession()

        const formData = new FormData()
        // ❌ no append file

        const req = new Request("http://localhost/api/user/avatar", {
            method: "PATCH",
            body: formData,
        })

        const res = await PATCH(req)
        const body = await res.json()

        expect(res.status).toBe(400)
        expect(body.error).toBe('Imagen requerida')
    })

})

afterEach(() => {
    vi.resetAllMocks()
})

afterAll(async () => {
    await prisma.$disconnect()
})