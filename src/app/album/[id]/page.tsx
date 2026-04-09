"use client"

import { useState, useEffect } from "react"
import { getAlbumById, toggleAlbumById } from "@/lib/auth/api/album.api"
import { useParams, useRouter } from "next/navigation"
import { AlbumInfo as AlbumType } from "@/types/album.types"
import { useSession } from "next-auth/react"
import Link from "next/link"

const AlbumInfo = () => {
    const [album, setAlbum] = useState<AlbumType>({
        id: 0,
        name: "",
        state: false,
        genres: [],
        createdBy: { username: "" },
        updatedBy: { username: "" },
        songs: [],
        pic: "",
        artist: { id: 0, name: "" }
    })

    const [loading, setLoading] = useState(true)
    const [empty, setEmpty] = useState(false)
    const [open, setOpen] = useState(false)

    const { id } = useParams()
    const albumId = Number(id)

    const { data: session } = useSession()
    const isAdmin = ["admin", "super"].includes(session?.user?.rol)
    const router = useRouter()

    const canView = album.state || isAdmin

    useEffect(() => {
        if (!id) return

        const loadAlbum = async () => {
            const res = await getAlbumById(albumId)

            if (res?.ok && res?.album) {
                setAlbum(res.album)
            } else {
                setEmpty(true)
            }

            setLoading(false)
        }

        loadAlbum()
    }, [id])

    const toggleStateAlbum = async () => {
        const message = album.state
            ? "¿Seguro que querés desactivar el álbum?"
            : "¿Seguro que querés activar el álbum?"

        if (!confirm(message)) return

        const res = await toggleAlbumById(album.id)

        if (res.ok) {
            setAlbum(prev => ({
                ...prev,
                state: !prev.state
            }))
        }
    }


    if (loading) return <p>Loading...</p>

    if (empty || !canView) {
        return (
            <div>
                <p>Álbum no disponible o inexistente</p>
                <button onClick={() => router.push('/home')}>Volver</button>
            </div>
        )
    }


    return (
        <div>
            <h2>{album.name}</h2>

            <img
                src={album.pic}
                alt={album.name}
                style={{ width: 200, height: 200, objectFit: "cover" }}
            />

            {/* Menú */}
            {session?.user?.id && !open && (
                <button onClick={() => setOpen(true)} style={{ fontSize: "20px" }}>
                    ⋮
                </button>
            )}

            {session?.user?.id && open && (
                <div>
                    <button>Editar</button>

                    {isAdmin && (
                        <button onClick={toggleStateAlbum}>
                            {album.state ? "Desactivar álbum" : "Activar álbum"}
                        </button>
                    )}

                    <button onClick={() => setOpen(false)}>Cancelar</button>
                </div>
            )}

            <Link href={`/artist/${album.artist.id}/profile`}>
                Artista/Banda: {album.artist.name}
            </Link>

            <p>
                Géneros: {album.genres.map(g => g.name).join(", ")}
            </p>

            {album.updatedBy ? (
                <p>Creado/Editado por {album?.updatedBy.username}</p>
            ) : (
                <p>Creado/Editado por {album?.createdBy.username}</p>
            )}
            {album.songs.length > 0 ? (
                <div>
                    <p>Canciones:</p>
                    <ol style={{ paddingLeft: "20px" }}>
                        {album.songs.map(song => (
                            <li key={song.id}>{song.name}</li>
                        ))}
                    </ol>
                </div>
            ) : (
                <p>Agregar canciones</p>
            )}
        </div>
    )
}

export default AlbumInfo