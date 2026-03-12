import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { vi, describe, expect, it, beforeEach, afterAll } from "vitest"
import { getUsers } from "../fake.user"
import { loadArtists, getArtists } from "../fakeArtist"
import { POST } from "@/app/api/album/route"
import { getGenres } from "../dummyGenre"
import fs from "fs"
import path from "path"

let artists: any[]
let users: any[]
let genres: any[]

beforeEach(async () => {
    await prisma.song.deleteMany()
    await prisma.album.deleteMany()
    await prisma.artist.deleteMany()
    await prisma.gender.deleteMany()
    await prisma.user.deleteMany()
    await loadArtists()

    artists = await getArtists()
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
    return new Request("http://localhost/api/album", {
        method: "POST",
        body: formData
    })
}


describe('POST /api/album', () => {
    describe('Validaciones de schema', () => {
        it('Album sin nombre, sin genero, sin artista, sin canciones', async () => {
            mockAuthenticatedSession(0)

            const formData = new FormData()

            formData.append('name', '')
            formData.append('artistId', '')
            formData.append('genres', '')


            const res = await POST(makeRequest(formData))
            const body = await res.json()

            expect(res.status).toBe(400)
            expect(body).toHaveProperty('error')

            expect(body.error).toHaveProperty('name')
            expect(body.error).toHaveProperty('artistId')
            expect(body.error).toHaveProperty('genres')



            expect(body.error.name).toContain('Debe escribir nombre')
            expect(body.error.artistId).toContain('Debe seleccionar un artista')
            expect(body.error.genres).toContain('Debe seleccionar al menos un género')


        })

        it('Crear album con artista no registrado', async () => {
            mockAuthenticatedSession(0)

            const formData = new FormData()

            formData.append('artistId', String(10))
            formData.append('genres', String(genres[0].id))
            formData.append('name', 'the dark side of the moon')

            const res = await POST(makeRequest(formData))
            const body = await res.json()


            expect(res.status).toBe(404)
            expect(body).toHaveProperty('error')
            expect(body.error).toBe('Artist not found')
        })

        it('Crear album con artista inactivo', async () => {
            mockAuthenticatedSession(0)

            const formData = new FormData()

            formData.append('artistId', String(artists[4].id))
            formData.append('genres', String(genres[0].id))
            formData.append('name', 'the dark side of the moon')

            const res = await POST(makeRequest(formData))
            const body = await res.json()


            expect(res.status).toBe(400)
            expect(body).toHaveProperty('error')

        })


        it('Crear album sin imagen', async () => {
            mockAuthenticatedSession(0)

            const formData = new FormData()

            formData.append('artistId', String(artists[1].id))
            formData.append('genres', String(genres[1].id))
            formData.append('name', 'the dark side of the moon')

            const res = await POST(makeRequest(formData))
            const body = await res.json()


            expect(res.status).toBe(201)
            expect(body).toHaveProperty('ok')
            expect(body.ok).toBe(true)

        })


        it('Crear album con imagen', async () => {
            mockAuthenticatedSession(0)

            const formData = new FormData()

            formData.append('artistId', String(artists[0].id))
            formData.append('genres', String(genres[1].id))
            formData.append('name', 'the dark side of the moon')

            // imagen desde fixtures
            const filePath = path.resolve(__dirname, "../fixtures/default.png")
            const buffer = fs.readFileSync(filePath)
            const file = new File([buffer], "default.png", { type: "image/png" })
            formData.append("file", file)

            const res = await POST(makeRequest(formData))
            const body = await res.json()


            expect(res.status).toBe(201)
            expect(body).toHaveProperty('ok')
            expect(body.ok).toBe(true)

        })

        it('Crear album con imagen y canciones', async () => {
            mockAuthenticatedSession(0)

            const formData = new FormData()

            formData.append('artistId', String(artists[0].id))
            formData.append('genres', String(genres[1].id))
            formData.append('name', 'the dark side of the moon')
            formData.append(
                "songs",
                JSON.stringify([
                    { name: "speak to me" },
                    { name: "time" },
                    { name: "breathe" }
                ])
            )

            // imagen desde fixtures
            const filePath = path.resolve(__dirname, "../fixtures/default.png")
            const buffer = fs.readFileSync(filePath)
            const file = new File([buffer], "default.png", { type: "image/png" })
            formData.append("file", file)

            const res = await POST(makeRequest(formData))
            const body = await res.json()


            expect(res.status).toBe(201)
            expect(body).toHaveProperty('ok')
            expect(body.ok).toBe(true)

        })

        it('Crear album sin imagen y una cancion con 1 caracter', async () => {
            mockAuthenticatedSession(0)

            const formData = new FormData()

            formData.append('artistId', String(artists[1].id))
            formData.append('genres', String(genres[1].id))
            formData.append('name', 'the dark side of the moon')
            formData.append(
                "songs",
                JSON.stringify([
                    { name: "s" }
                ])
            )

            const res = await POST(makeRequest(formData))
            const body = await res.json()


            expect(res.status).toBe(400)
            expect(body).toHaveProperty('error')
            expect(body.error.songs).toContain("La canción debe tener mínimo 2 caracteres")

        })

        it('Crear album sin imagen y sin canciones', async () => {
            mockAuthenticatedSession(0)

            const formData = new FormData()

            formData.append('artistId', String(artists[1].id))
            formData.append('genres', String(genres[1].id))
            formData.append('name', 'the dark side of the moon')

            const res = await POST(makeRequest(formData))
            const body = await res.json()


            expect(res.status).toBe(201)
            expect(body).toHaveProperty('ok')
            expect(body.ok).toBe(true)

        })
    })
})

afterAll(async () => await prisma.$disconnect())
