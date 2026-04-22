"use client"

import ArstistInpust from "@/components/ArtistInputs"
import { useError } from "@/context/ErrorContext"
import React, { useState, useEffect } from "react"
import { getActiveGenres } from "@/lib/auth/api/genre.api"
import { useSession } from "next-auth/react"
import { RegisterArtist } from "@/types/artist.types"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { getArtistById, updateArtist } from "@/lib/auth/api/artist.api"
import "../../style.css"

const EditArtistForm = () => {
    const [genres, setGenres] = useState<{ id: number, name: string, state: boolean }[]>([])
    const [artist, setArtist] = useState<RegisterArtist>({
        name: "",
        bio: "",
        genres: []
    })
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(true)
    const { setErrors, errors } = useError()
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login")
        }
    }, [status, router])

    useEffect(() => {
        const loadGenres = async () => {
            const res = await getActiveGenres()
            setGenres(res.genres ?? [])
        }
        loadGenres()
    }, [])

    const { id } = useParams()
    const artistId = Number(id)


    useEffect(() => {
        if (!id) return

        const loadArtist = async () => {
            setLoading(true)

            const res = await getArtistById(Number(id))

            if (res.ok) {
                setArtist({
                    name: res.artist.name,
                    bio: res.artist.bio,
                    genres: res.artist.genres.map((g: any) => g.id)
                })
            } else if (res.status === 400 || res.status === 404) {
                setErrors({
                    notFound: ['Artista no encontrado o inactivo']
                })
            } else {
                setErrors({
                    server: ['Error inesperado']
                })
            }

            setLoading(false)
        }

        loadArtist()
    }, [id])

    //  inputs normales
    const handleArtist = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setArtist(prev => ({ ...prev, [name]: value }))
    }

    //  multi-select
    const handleGenres = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions).map(opt =>
            Number(opt.value)
        )

        setArtist(prev => ({
            ...prev,
            genres: selected
        }))
    }

    //  file
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        const formData = new FormData()

        formData.append('name', artist.name)

        formData.append("bio", artist.bio)

        artist.genres.forEach(g => {
            formData.append("genres", String(g))
        })

        if (file) {
            formData.append("file", file) // 👈 importante
        }


        const res = await updateArtist(formData, artistId)
        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
                router.push('/auth/login')
            } else {
                setErrors(res.error)
            }

        }
        else {
            router.push(`/artist/${id}/profile`)
        }

    }
    // ⏳ Loading
    if (loading) {
        return <p>Cargando artista...</p>
    }

    // ❌ Error
    if (errors.notFound) {
        return (
            <div>
                <p>{errors.notFound[0]}</p>
                <button onClick={() => router.push("/artist")}>
                    Volver
                </button>
            </div>
        )
    }

    // ❌ Error server
    if (errors.server) {
        return <p>{errors.server[0]}</p>
    }

    return (
        <div className="container">
            <form className="form-card" onSubmit={handleSubmit}>
                <ArstistInpust
                    errors={errors}
                    genres={genres}
                    handleArtist={handleArtist}
                    handleGenres={handleGenres}
                    handleFile={handleFile}
                    router={router}
                    artist={artist}
                />
            </form>
        </div>
    )
}

export default EditArtistForm