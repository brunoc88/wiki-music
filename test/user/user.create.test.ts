import { describe, it, expect, beforeEach, afterAll, vi, afterEach } from "vitest"
import { prisma } from "@/lib/prisma"
import { POST } from "@/api/user/route"
import * as cloudinaryLib from "@/lib/cloudinary"
import fs from "fs"
import path from "path"

//  limpiar DB antes de cada test
beforeEach(async () => {
  process.env.DEFAULT_USER_IMAGE_URL = "https://res.cloudinary.com/fake/default.png"
  await prisma.user.deleteMany()
})

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
// simple json
const makeJsonRequest = (body: any) => {
  return new Request("http://localhost/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
}

describe("POST /api/users", () => {
  describe("Registro exitoso", () => {
    it("Crear usuario sin imagen (usa default)", async () => {
      const formData = new FormData()
      formData.append("email", "user2@test.com")
      formData.append("username", "user2")
      formData.append("password", "123456")
      formData.append("password2", "123456")
      formData.append("securityQuestion", "pregunta?")
      formData.append("securityAnswer", "respuesta10") // 10 caracteres


      const req = new Request("http://localhost/api/users", {
        method: "POST",
        body: formData
      })

      const res = await POST(req)
      const body = await res.json()

      expect(res.status).toBe(201)
      expect(body.user).toBeDefined()
      expect(body.user.pic).toBe("https://res.cloudinary.com/fake/default.png")
    })

    it("Crear usuario con imagen (mock Cloudinary)", async () => {
      const formData = new FormData()
      formData.append("email", "user2@test.com")
      formData.append("username", "user2")
      formData.append("password", "123456")
      formData.append("password2", "123456")
      formData.append("securityQuestion", "pregunta?")
      formData.append("securityAnswer", "respuesta10") // 10 caracteres

      // imagen desde fixtures
      const filePath = path.resolve(__dirname, "../fixtures/default.png")
      const buffer = fs.readFileSync(filePath)
      const file = new File([buffer], "default.png", { type: "image/png" })
      formData.append("file", file)

      const req = new Request("http://localhost/api/users", {
        method: "POST",
        body: formData
      })


      const res = await POST(req)
      const body = await res.json()

      expect(res.status).toBe(201)
      expect(body.user).toBeDefined()
      expect(body.user.pic).toBe("https://res.cloudinary.com/fake/image.png")
    })
  })

  describe("Validaciones", () => {
    it("Campos vacíos & otros errores", async () => {
      const formData = new FormData()
      formData.append("email", "")
      formData.append("username", "")
      formData.append("password", "")
      formData.append("password2", "")
      formData.append("securityQuestion", "")
      formData.append("securityAnswer", "")

      const req = new Request("http://localhost/api/users", {
        method: "POST",
        body: formData
      })

      const res = await POST(req)
      const body = await res.json()

      expect(res.status).toBe(400)
      expect(body.error).toBeDefined()
      expect(body.error).toHaveProperty("email")
      expect(body.error.email).toContain("Debe ingresar un email")
      expect(body.error.username).toContain("Debe ingresar un nombre de usuario")
      expect(body.error.password).toContain("Debe ingresar un password")
      expect(body.error.securityQuestion).toContain("Debe seleccionar una pregunta")
      expect(body.error.securityAnswer).toContain("Debe escribir una respuesta")
    })

    it("Duplicado", async () => {
      const makeFormData = () => {
        const fd = new FormData()
        fd.append("email", "user2@test.com")
        fd.append("username", "user2")
        fd.append("password", "123456")
        fd.append("password2", "123456")
        fd.append("securityQuestion", "pregunta?")
        fd.append("securityAnswer", "respuesta10")
        return fd
      }

      // primer usuario
      await POST(new Request("http://localhost/api/users", {
        method: "POST",
        body: makeFormData()
      }))

      // segundo (duplicado)
      const res = await POST(new Request("http://localhost/api/users", {
        method: "POST",
        body: makeFormData()
      }))

      const body = await res.json()

      expect(res.status).toBe(409)
      expect(body).toHaveProperty("error")
    })

    it("No coinciden los password", async () => {
      const formData = new FormData()
      formData.append("email", "bruno88@gmail.com")
      formData.append("username", "brunoc88")
      formData.append("password", "123456")
      formData.append("password2", "1234567")
      formData.append("securityQuestion", "pregunta?")
      formData.append("securityAnswer", "respuesta10")

      const req = new Request("http://localhost/api/users", {
        method: "POST",
        body: formData
      })

      const res = await POST(req)
      const body = await res.json()

      expect(res.status).toBe(400)
      expect(body).toHaveProperty("error")
      expect(body.error).toHaveProperty("password2")
      expect(body.error.password2).toContain("Las contraseñas no coinciden")
    })
  })
})

afterEach(() => {
  vi.resetAllMocks()
})

afterAll(async () => {
  await prisma.$disconnect()
})
