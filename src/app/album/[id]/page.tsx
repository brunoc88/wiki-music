"use client"

import { useState, useEffect } from "react"
import { getAlbumById } from "@/lib/auth/api/album.api"
import { useParams } from "next/navigation"
import { useError } from "@/context/ErrorContext"
import { AlbumInfo } from "@/types/album.types"
import { useSession } from "next-auth/react"

const AlbumInfo = () => {
    const [album, setAlbum] = useState<AlbumInfo>({
        name: '',
        state: false,
        genres: [],
        createdBy: { username: "" },
        updatedBy: { username: "" },
        songs: [],
        pic: "",
        artist: { name: "" }
    })
    const [loading, setLoading] = useState<Boolean>(true)
    const { errors, setErrors } = useError()
    const { id } = useParams()
    const albumId = Number(id)
    const [status, setStatus] = useState<Number>()
    const [open, setOpen] = useState<Boolean>(false)
    const { data: session } = useSession()
    const isAdmin = ['admin', 'super'].includes(session?.user?.rol)

    useEffect(() => {
        if (!id) return

        const loadAlbum = async () => {
            const res = await getAlbumById(albumId)
            setStatus(res.status)
            if (res.ok) setAlbum(res.album)
            else setErrors(res?.error)
            setLoading(false)
        }
        loadAlbum()
    }, [loading])

    if (loading) return <p>loading...</p>
    if (status === 404) return (
        <div>
            <p>{errors}</p>
            <button>Volver</button>
        </div>
    )
    return (
        <div>
            {!album.state && isAdmin || (album.state) &&
                <div>

                    <h2>{album?.name}</h2>
                    <img
                        src={album?.pic}
                        alt={album?.name}
                        style={{ width: 200, height: 200, objectFit: "cover" }}
                    />
                    {session?.user.id && !open && <button onClick={() => setOpen(true)} style={{ fontSize: "20px" }}>
                        ⋮
                    </button>}
                    {session?.user.id && open &&
                        <li>
                            <button>Editar</button>
                            {isAdmin && (
                                <div>
                                    {album.state ? (
                                        <button>Desactivar Album</button>
                                    ) : (
                                        <button>Activar Album</button>
                                    )}
                                </div>
                            )}
                            <button onClick={() => setOpen(false)}>Cancelar</button>
                        </li>
                    }
                    <p>Artista/Banda: {album?.artist.name}</p>
                    <p>
                        Géneros: {album.genres.map(g => g.name).join(", ")}
                    </p>
                    {album?.songs && album.songs.length > 0 ? (
                        <div>
                            Canciones:
                            <ol style={{ listStyle: "decimal", paddingLeft: "20px" }}>
                                {album.songs.map(s => (
                                    <li key={s.id}>{s.name}</li>
                                ))}
                            </ol>
                        </div>
                    ) : (
                        <div>
                            <p>Agregar Canciones</p>
                        </div>
                    )}
                </div>
            }
            {!album.state && (!isAdmin) &&
                <div>
                    <p>Album no disponible</p>
                    <button>Volver</button>
                </div>
            }
        </div >
    )
}

export default AlbumInfo