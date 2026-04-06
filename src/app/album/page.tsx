"use client"

import AlbumInputs from "@/components/AlbumInputs"
import { getActiveGenres } from "@/lib/auth/api/genre.api"
import { getAllActiveArtist } from "@/lib/auth/api/artist.api"
import React, { useState, useEffect } from "react"
import { useError } from "@/context/ErrorContext"
import { RegisterAlbum } from "@/types/album.types"
import { createAlbum } from "@/lib/auth/api/album.api"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const AlbumForm = () => {

    const [genres, setGenres] = useState([])
    const [artists, setArtists] = useState([])
    const [loading, setLoading] = useState(true)
    const [showSongs, setShowSongs] = useState(false)
    const [songs, setSongs] = useState([""])
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

        if (!session) {
            router.push("/auth/login")
        }
    }, [session, status])

    useEffect(() => {
        const loadData = async () => {
            const resGenres = await getActiveGenres()
            if (resGenres.ok) setGenres(resGenres.genres)

            const resArtists = await getAllActiveArtist()
            if (resArtists.ok) setArtists(resArtists.artists)

            setLoading(false)
        }

        loadData()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('name', album.name)
        formData.append('artistId', String(album.artistId))

        album.genres.forEach(g => {
            formData.append("genres", String(g))
        })

        formData.append(
            "songs",
            JSON.stringify(
                songs
                    .filter(s => s.trim() !== "")
                    .map(s => ({ name: s }))
            )
        )
        if (file) {
            formData.append("file", file) 
        }

        const res = await createAlbum(formData)
        if (res.ok) {
            console.log('exito')
        } else if (res.status === 409) {
            setErrors({ duplicado: ['Ya existe un album registrado a este artista'] })
        }
        else setErrors(res.error)
    }

    const handleSongChange = (index: number, value: string) => {
        const updated = [...songs]
        updated[index] = value
        setSongs(updated)
    }

    const addSongInput = () => {
        setSongs([...songs, ""])
    }

    const removeSong = (index: number) => {
        const updated = songs.filter((_, i) => i !== index)
        setSongs(updated)
    }

    const handleSelectArtist = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target

        setAlbum(prev => ({
            ...prev,
            [name]: Number(value) //
        }))
    }

    const handleGenres = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions)

        const values = selectedOptions.map(option => Number(option.value))

        setAlbum(prev => ({
            ...prev,
            genres: values
        }))
    }

     //  file
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleAlbumName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value
        setAlbum(prev => ({ ...prev, name }))
    }
    if (loading) return <p>Loading...</p>

    return (
        <div>
            <h1>Registro de album</h1>
            {errors.duplicado &&
                <p>{errors.duplicado}</p>}
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
                />
            </form>
        </div>
    )
}

export default AlbumForm