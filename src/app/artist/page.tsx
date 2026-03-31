"use client"

import { useError } from "@/context/ErrorContext"
import { getActiveGenres } from "@/lib/auth/api/genre.api"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { RegisterArtist } from "@/types/artist.types"
import { createArtist } from "@/lib/auth/api/artist.api"
import ArstistInpust from "@/components/ArtistInputs"

const ArtistForm = () => {
    const [genres, setGenres] = useState<{ id: number, name: string, state: boolean }[]>([])
    const [artist, setArtist] = useState<RegisterArtist>({
        name: "",
        bio: "",
        genres: []
    })
    const [file, setFile] = useState<File | null>(null)

    const { setErrors, errors } = useError()
    const { status } = useSession()
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

    //  submit
    const handleForm = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        const formData = new FormData()

        formData.append("name", artist.name)
        formData.append("bio", artist.bio)

        artist.genres.forEach(g => {
            formData.append("genres", String(g))
        })

        if (file) {
            formData.append("file", file) // 👈 importante
        }

        const res = await createArtist(formData)

        if (!res.ok) {
            if (res.status === 409) {
                setErrors({
                    duplicado: ["El artista ya se encuentra creado"]
                })
            } else {
                setErrors(res.error ?? {})
            }
        } else {
            setArtist({ name: "", bio: "", genres: [] })
            router.push('/welcome')
        }


    }

    if (status === "loading") return <p>loading...</p>

    return (
        <div>
            <h2>Registro de Artista</h2>
            <p>{errors.duplicado}</p>
            <form onSubmit={handleForm}>
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

export default ArtistForm