import { prisma } from "@/lib/prisma"
import { vi, describe, beforeEach, afterAll, it, expect } from "vitest"
import { getArtists, loadArtists } from "../fakeArtist"
import { getServerSession } from "next-auth"
import { PUT } from "@/app/api/artist/route"
import { getUsers } from "../fake.user"
import { getGenres } from "../dummyGenre"

let artists: any[]
let users: any[]
let genres: any[]

beforeEach(async () => {
    await prisma.artist.deleteMany()
    await prisma.gender.deleteMany()
    await prisma.user.deleteMany()

    await loadArtists()
    artists = await getArtists()
    users = await getUsers()
    genres = await getGenres()
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

const makeRequest = (formData: FormData, id: number) => {
    return new Request(`http://localhost/api/artist/${id}`, {
        method: 'PUT',
        body: formData
    })
}

describe('PUT /api/artist/:id', () => {
    it('Mandar lo mismo', async () => {
        mockAuthenticatedSession(1)

        const formData = new FormData()

        formData.append('name', artists[0].name)
        formData.append('bio', artists[0].bio)
        formData.append('genres', String(genres[0].id))

        const res = await PUT(makeRequest(formData, artists[0].id), { params: { id: String(artists[0].id) } })
        const body = await res.json()

        const artist = await prisma.artist.findUnique({ where: { id: artists[0].id } })

        expect(res.status).toBe(200)
        expect(body).toHaveProperty('ok')
        expect(body.ok).toBe(true)
        expect(artist).toHaveProperty('updatedById')
        expect(artist?.updatedById).toEqual(users[1].id)
    })

    it('Cambiar name, bio, genres', async () => {
        mockAuthenticatedSession(1)

        const formData = new FormData()

        const artistBefore = artists[0]

        formData.append('name', 'bruno mars')
        formData.append('bio', 'artista muy popular por sus diversas influencias musicales')
        formData.append('genres', String(genres[1].id))

        const res = await PUT(makeRequest(formData, artists[0].id), { params: { id: String(artists[0].id) } })
        const body = await res.json()

        const artistAfter = await prisma.artist.findUnique({
            where: { id: artists[0].id },
            include: { genres: true }
        })
        
        expect(res.status).toBe(200)
        expect(body).toHaveProperty('ok')
        expect(body.ok).toBe(true)
        expect(artistAfter).toHaveProperty('updatedById')
        expect(artistAfter?.updatedById).toEqual(users[1].id)
        expect(artistAfter?.createdById).toEqual(artistBefore.createdById)
        expect(artistAfter?.bio).not.toEqual(artistBefore.bio)
        expect(artistAfter?.name).not.toEqual(artistBefore.name)
        expect(artistAfter?.genres[0].name).not.toEqual(artistBefore.genres[0].name)
    })

    it('Mandar form vacio', async () => {
        mockAuthenticatedSession(1)

        const formData = new FormData()

        formData.append('name','')
        formData.append('bio', '')
        formData.append('genres', String(""))

        const res = await PUT(makeRequest(formData, artists[0].id), { params: { id: String(artists[0].id) } })
        const body = await res.json()

        expect(res.status).toBe(400)
        expect(body.error.name).toContain('Debe ingresar un nombre')
        expect(body.error.bio).toContain('Debe ingresar biografia')
        expect(body.error.genres).toContain('Debe seleccionar al menos un género')
    })

    it('Genero inactivo', async () => {
        mockAuthenticatedSession(1)

        const formData = new FormData()

        formData.append('name', artists[0].name)
        formData.append('bio', artists[0].bio)
        formData.append('genres', String(genres[3].id))

        const res = await PUT(makeRequest(formData, artists[0].id), { params: { id: String(artists[0].id) } })
        const body = await res.json()

        const artist = await prisma.artist.findUnique({ where: { id: artists[0].id } })

        expect(res.status).toBe(400)
        expect(body.error).toBe('Uno o más géneros no están disponibles')
       
    })
})


afterAll(async () => {
    await prisma.$disconnect()
})