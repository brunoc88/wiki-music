"use client"

import AlbumInputs from "@/components/AlbumInputs"
import { useError } from "@/context/ErrorContext"
import {
    editAlbumById,
    getAlbumById,
    updateSongsById
} from "@/lib/auth/api/album.api"
import { getAllActiveArtist } from "@/lib/auth/api/artist.api"
import { getActiveGenres } from "@/lib/auth/api/genre.api"
import { RegisterAlbum } from "@/types/album.types"
import { ArtistSelection } from "@/types/artist.types"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"

const EditAlbumForm = () => {
    const { id } = useParams()
    const albumId = Number(id)

    const [genres, setGenres] = useState([])
    const [artists, setArtists] = useState<ArtistSelection>([])
    const [loading, setLoading] = useState(true)

    const [showSongs, setShowSongs] = useState(false)
    const [songs, setSongs] = useState<string[]>([""])
    const [originalSongs, setOriginalSongs] = useState<string[]>([])

    const { errors, setErrors } = useError()

    const [album, setAlbum] = useState<RegisterAlbum>({
        name: "",
        genres: [],
        artistId: 0,
        songs: []
    })

    const [file, setFile] = useState<File | null>(null)

    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "loading") return
        if (!session) router.push("/auth/login")
    }, [session, status])

    useEffect(() => {
        const loadData = async () => {
            const resGenres = await getActiveGenres()
            if (resGenres.ok) setGenres(resGenres.genres)

            const resArtists = await getAllActiveArtist()
            if (resArtists.ok) {
                setArtists(
                    resArtists.artists.map(a => ({
                        id: a.id,
                        name: a.name
                    }))
                )
            }

            const resAlbum = await getAlbumById(albumId)

            if (resAlbum.ok) {
                const albumData = resAlbum.album

                setAlbum({
                    ...albumData,
                    genres: albumData.genres.map((g: any) => g.id)
                })

                const existingSongs =
                    albumData.songs?.map((s: any) => s.name) || [""]

                setSongs(existingSongs)
                setOriginalSongs(existingSongs)

                if (existingSongs.length > 0) {
                    setShowSongs(true)
                }
            } else {
                setErrors(resAlbum.error)
            }

            setLoading(false)
        }

        loadData()
    }, [albumId])

    // handlers
    const handleSelectArtist = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setAlbum(prev => ({ ...prev, [name]: Number(value) }))
    }

    const handleGenres = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions)
            .map(opt => parseInt(opt.value))
            .filter(Number.isFinite)

        setAlbum(prev => ({ ...prev, genres: selected }))
    }

    const handleAlbumName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAlbum(prev => ({ ...prev, name: e.target.value }))
    }

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleSongChange = (index: number, value: string) => {
        const updated = [...songs]
        updated[index] = value
        setSongs(updated)
    }

    const addSongInput = () => {
        setSongs(prev => [...prev, ""])
    }

    const removeSong = (index: number) => {
        const updated = songs.filter((_, i) => i !== index)
        setSongs(updated.length ? updated : [""])
    }

    const cleanSongs = () => {
        setSongs(originalSongs)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        const formData = new FormData()
        formData.append("name", album.name)
        formData.append("artistId", String(album.artistId))

        album.genres.forEach(g => {
            formData.append("genres", String(g))
        })

        if (file) {
            formData.append("file", file)
        }

        const resAlbum = await editAlbumById(formData, albumId)

        if (!resAlbum.ok) {
            if (resAlbum.status === 409) {
                setErrors({ duplicado: ['Ya existe un album registrado a este artista'] })
            } else if (album.artistId === 0) {
                setErrors(prev => ({
                    ...resAlbum.error,
                    artistId: ['Debe seleccionar artista']
                }))
            } else {
                setErrors(resAlbum.error)
            }

            return
        }

        const validSongs = songs.filter(s => s.trim() !== "")

        if (validSongs.length > 0) {
            const formData2 = new FormData()

            formData2.append(
                "songs",
                JSON.stringify(validSongs.map(s => ({ name: s })))
            )

            const resSongs = await updateSongsById(formData2, albumId)

            if (!resSongs.ok) {
                setErrors(resSongs.error)
                return
            }

            // sync nuevo estado
            setOriginalSongs(validSongs)
        }

        router.push(`/album/${albumId}`)
    }

    if (loading) return <p>Loading...</p>

    return (
        <form onSubmit={handleSubmit}>
            <AlbumInputs
                genres={genres}
                artists={artists}
                songs={songs}
                showSongs={showSongs}
                setShowSongs={setShowSongs}
                handleSongChange={handleSongChange}
                addSongInput={addSongInput}
                removeSong={removeSong}
                errors={errors}
                handleAlbumName={handleAlbumName}
                handleSelectArtist={handleSelectArtist}
                handleGenres={handleGenres}
                handleFile={handleFile}
                cleanSongs={cleanSongs}
                album={album}
            />
        </form>
    )
}

export default EditAlbumForm