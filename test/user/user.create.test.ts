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

    expect(res.status).toBe(201)
    expect(body.user).toBeDefined()
    expect(body.user.email).toBe(user.email)
  })
})

afterAll(async () => {
  await prisma.$disconnect()
})
