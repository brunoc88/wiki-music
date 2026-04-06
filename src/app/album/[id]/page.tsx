"use client"

import { useState, useEffect } from "react"
import { getAlbumById } from "@/lib/auth/api/album.api"
import { useParams } from "next/navigation"
import { useError } from "@/context/ErrorContext"
import { AlbumInfo } from "@/types/album.types"

const AlbumInfo = () => {
    const [album, setAlbum] = useState<AlbumInfo>({
        name: '',
        state: false,
        genres: [],
        createdBy: { username: "" },
        updatedBy: { username: "" },
        songs: [], 
        pic: "",
        artist:{name:""}
    })
    const [loading, setLoading] = useState<Boolean>(true)
    const { errors, setErrors } = useError()
    const { id } = useParams()
    const albumId = Number(id)


    useEffect(() => {
        if (!id) return

        const loadAlbum = async () => {
            const res = await getAlbumById(albumId)

            if (res.ok) setAlbum(res.album)
            else setErrors(res?.error)
        }
        loadAlbum()
    }, [loading])

    if (loading) <p>loading...</p>
    return (
        <div>
            
            <h2>{album?.name}</h2>
            <img
                src={album?.pic}
                alt={album?.name}
                style={{ width: 200, height: 200, objectFit: "cover" }}
            />
            <p>Artista/Banda: {album?.artist.name}</p>
            {album?.songs && album.songs.length > 0?(
                <div>
                    Canciones:
                    {album.songs.map(s=>(
                        <li key={s.id}>
                            {s.name}
                        </li>
                    ))}
                </div>
            ):(
                <div>
                    <p>Agregar Canciones</p>
                </div>
            )}
        </div>
    )
}

export default AlbumInfo