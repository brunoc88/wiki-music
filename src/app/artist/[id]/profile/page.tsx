"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { deactivateArtisById, getArtistById, reactiveArtistById } from "@/lib/auth/api/artist.api"
import { ArtistDescription } from "@/types/artist.types"
import { useError } from "@/context/ErrorContext"
import Link from "next/link"
import { useSession } from "next-auth/react"

const ArtistProfile = () => {

    const [artist, setArtist] = useState<ArtistDescription>()
    const [loading, setLoading] = useState(true)
    const { id } = useParams()
    const { errors, setErrors } = useError()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const { data: session } = useSession()
    const isAdmin = ["admin", "super"].includes(session?.user?.rol)

    useEffect(() => {
        if (!id) return

        const loadArtistProfile = async () => {

            const res = await getArtistById(Number(id))

            if (!res.ok) {
                setErrors(res.error)
            }
            else {
                setArtist(res.artist)
                setErrors({})
            }
            setLoading(false)
        }

        loadArtistProfile()

    }, [id])

    const toggleArtist = async () => {
        let msj = ""

        if (artist?.state) {
            msj = 'Deseas desactivar este artista?'
            if (confirm(msj)) {
                const res = await deactivateArtisById(artist.id)
                if (res.ok) setArtist(prev => ({ ...prev, state: !prev?.state }))
                else setErrors(res.error)
            }
            return
        }
        else {
            msj = 'Deseas activar este artista?'
            if (confirm(msj)) {
                const res = await reactiveArtistById(artist.id)
                if (res.ok) setArtist(prev => ({ ...prev, state: !prev?.state }))
                else setErrors(res.error)
            }
            return
        }
    }

    if (loading) return <p>Loading...</p>
    if (errors?.length) return <p>Artista no encontrado</p>

    return (
        <div>
            <h2>{artist?.name}</h2>

            <img
                src={artist?.pic}
                alt={artist?.name}
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
                        <button onClick={() => toggleArtist()}>
                            {artist?.state ? "Desactivar Artista" : "Activar Artista"}
                        </button>
                    )}

                    <button onClick={() => setOpen(false)}>Cancelar</button>
                </div>
            )}
            <p>{artist?.bio}</p>

            <p>
                Géneros: {artist?.genres.map(g => g.name).join(", ")}
            </p>

            {artist?.updatedBy?.username ? (
                <p>Creado/editado por: {artist.updatedBy.username}</p>
            ) : (
                <p>Creado/editado por: {artist?.createdBy?.username}</p>
            )}

            <h3>Albums:</h3>
            {artist?.albums.length === 0 ? (
                <div>
                    <p>No tiene albums, crea el primero!</p>
                    <button onClick={() => router.push('/album')}>Crear Album</button>
                </div>
            ) : (
                <div
                    style={{
                        display: "flex",
                        gap: "16px",
                        overflowX: "auto",
                        padding: "10px 0"
                    }}
                >
                    {artist?.albums.map(a => (
                        <Link
                            key={a.id}
                            href={`/album/${a.id}`}
                            style={{
                                textDecoration: "none",
                                color: "inherit"
                            }}
                        >
                            <div
                                style={{
                                    minWidth: "200px",
                                    border: "1px solid #ccc",
                                    borderRadius: "12px",
                                    padding: "10px",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                    background: "#fff",
                                    cursor: "pointer",
                                    transition: "transform 0.2s, box-shadow 0.2s"
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = "scale(1.03)"
                                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)"
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = "scale(1)"
                                    e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)"
                                }}
                            >
                                <img
                                    src={a.pic}
                                    alt={a.name}
                                    style={{
                                        width: "100%",
                                        height: "150px",
                                        objectFit: "cover",
                                        borderRadius: "8px"
                                    }}
                                />

                                <p
                                    style={{
                                        marginTop: "8px",
                                        fontWeight: "bold",
                                        textAlign: "center"
                                    }}
                                >
                                    {a.name}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>)}
        </div>
    )
}

export default ArtistProfile 