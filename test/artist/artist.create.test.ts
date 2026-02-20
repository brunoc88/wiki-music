import { describe, it, expect, beforeEach, afterAll, vi, afterEach } from "vitest"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import * as cloudinaryLib from "@/lib/cloudinary"
import fs from "fs"
import path from "path"
import { getUsers, loadUsers } from "../fake.user"
import { getGenres, loadGenres } from "../dummyGenre"
import { POST } from "@/app/api/artist/route"

let users: any[]
let genres: any[]

//  limpiar DB antes de cada test
beforeEach(async () => {
    process.env.DEFAULT_USER_IMAGE_URL = "https://res.cloudinary.com/fake/default.png"
    await prisma.artist.deleteMany()
    await prisma.gender.deleteMany()
    await prisma.user.deleteMany()

    // Cargamos usuarios & generos
    await loadUsers()
    await loadGenres()

    // Guardamos 
    users = await getUsers()
    genres = await getGenres()
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

const makeRequest = (formData: FormData) => {
    return new Request("http://localhost/api/artist", {
        method: "POST",
        body: formData
    })
}

describe('POST /api/artist', () => {

  it('Crear artista correctamente', async () => {

    mockAuthenticatedSession(0)

    const formData = new FormData()
    formData.append('name', 'Led Zeppelin')
    formData.append('bio', 'Considerada una de las mejores bandas del rock de los 70')

    // multiselect
    formData.append('genres', String(genres[0].id))
    formData.append('genres', String(genres[1].id))

    

    const response = await POST(makeRequest(formData))

    expect(response.status).toBe(201)

    const data = await response.json()

    expect(data.name).toBe('led zeppelin') 
    expect(data.genres.length).toBe(2)

    // verificar en DB
    const artistInDb = await prisma.artist.findFirst({
      where: { name: 'led zeppelin' },
      include: { genres: true }
    })

    expect(artistInDb).not.toBeNull()
    expect(artistInDb?.genres.length).toBe(2)
  })
})

afterEach(() => {
    vi.resetAllMocks()
})

afterAll(async () => {
    await prisma.$disconnect()
})