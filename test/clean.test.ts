import {prisma} from "@/lib/prisma"
import {beforeEach, describe, it, afterAll, expect} from "vitest"

beforeEach(async () => {
    await prisma.song.deleteMany()
    await prisma.album.deleteMany()
    await prisma.artist.deleteMany()
})

it('Vaciar db exepto users', async () => {
    const artists = await prisma.artist.findMany()
    const albums = await prisma.album.findMany()
    const songs = await prisma.song.findMany()

    expect(artists.length).toBe(0)
    expect(albums.length).toBe(0)
    expect(songs.length).toBe(0)
})
afterAll(async () => {
    await prisma.$disconnect()
})