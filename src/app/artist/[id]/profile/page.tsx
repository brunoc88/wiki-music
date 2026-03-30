"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getArtistById } from "@/lib/auth/api/artist.api"
import { ArtistDescription } from "@/types/artist.types"
import { useError } from "@/context/ErrorContext"

const ArtistProfile = () => {

    const [artist, setArtist] = useState<ArtistDescription>()
    const [loading, setLoading] = useState(true)
    const { id } = useParams()
    const { errors, setErrors } = useError()

    useEffect(() => {
        if (!id) return

        const loadArtistProfile = async () => {

            const res = await getArtistById(Number(id))

            if (!res.ok) setErrors(res.error)
            else setArtist(res.artist)
            setLoading(false)
        }

        loadArtistProfile()

    }, [id])

    if (loading) return <p>Loading...</p>
    //if(errors) return <p>Artista no encontrado</p>

    return (
        <div>
            <h2>{artist?.name}</h2>

            <img
                src={artist?.pic}
                alt={artist?.name}
                style={{ width: 200, height: 200, objectFit: "cover" }}
            />

            <p>{artist?.bio}</p>

            {artist?.genres?.length > 0 &&
                artist.genres.map((g) => (
                    <li key={g.id}>{g.name}</li>
                ))
            }
        </div>
    )
}

export default ArtistProfile 