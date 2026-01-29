import { prisma } from "@/lib/prisma"
import { getUsers, loadUsers } from "../fake.user"
import { vi, describe, expect, it, beforeEach, afterAll, afterEach } from "vitest"
import { getServerSession } from "next-auth"


vi.mock('@/lib/cloudinary', () => ({
  deleteImage: vi.fn().mockResolvedValue(undefined),
}))



import { DELETE } from "@/api/user/avatar/router"


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



beforeEach(async () => {
    await prisma.user.deleteMany()
    await loadUsers()
    users = await getUsers()
})

describe('DELETE /api/user/avatar', () => {

  it('elimina avatar custom y vuelve a imagen default', async () => {
    // Arrange
    const user = users[0]

    await prisma.user.update({
      where: { id: user.id },
      data: {
        pic: 'https://res.cloudinary.com/demo/custom.png',
        picPublicId: 'user/custom-avatar',
      },
    })

    mockAuthenticatedSession()

    const req = new Request('http://localhost/api/user/avatar', {
      method: 'DELETE',
    })

    // Act
    const res = await DELETE(req)
    const body = await res.json()
    

    // Assert
    expect(res.status).toBe(200)
    expect(body.ok).toBe(true)

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
    })

    expect(updatedUser?.pic).toBe(process.env.DEFAULT_USER_IMAGE_URL)
    expect(updatedUser?.picPublicId).toBeNull()

  
  })


  it('no hace nada si el usuario ya tiene imagen default', async () => {
    const user = users[0]

    // aseguramos estado default
    await prisma.user.update({
      where: { id: user.id },
      data: {
        pic: process.env.DEFAULT_USER_IMAGE_URL!,
        picPublicId: null,
      },
    })

    mockAuthenticatedSession()


    const req = new Request('http://localhost/api/user/avatar', {
      method: 'DELETE',
    })

    const res = await DELETE(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.ok).toBe(true)

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
    })

    expect(updatedUser?.pic).toBe(process.env.DEFAULT_USER_IMAGE_URL)
    expect(updatedUser?.picPublicId).toBeNull()

  })

})


afterEach(() => {
    vi.resetAllMocks()
})

afterAll(async () => {
    await prisma.$disconnect()
})