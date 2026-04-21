"use client"

import { getAllActiveArtist } from "@/lib/auth/api/artist.api"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const ArtistsIndex = () => {
    const [artists, setArtists] = useState<{ id: number, name: string, state: boolean, pic: string }[]>([])
    const [filterArtists, setFilterArtists] = useState<{ id: number, name: string, state: boolean, pic: string }[]>([])
    const [loading, setLoading] = useState(true)
    const { data: session } = useSession()
    const router = useRouter()

    useEffect(() => {
        const loadArtists = async () => {
            const res = await getAllActiveArtist()
            setArtists(res.artists)
            setFilterArtists(res.artists)
        }
        loadArtists()
        setLoading(false)
    }, [])

    const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const result = artists.filter(a => a.name.toLowerCase().includes(e.target.value.toLowerCase()))
        if (result.length > 0) setFilterArtists(result)
        else setFilterArtists(artists)
    }

    if (loading) return <p>Loading...</p>
    return (
        <div>
            <div>
                <h2>Artistas recientes</h2>
                {session?.user.id ? (
                    <div>
                        <p>No te quedes atras y crea un artista!</p>
                        <button onClick={() => router.push('/artist')}>Crear Artista!</button>
                    </div>
                ) : (
                    <div>
                        <p>Quieres crear un artista?. Registrate y disfruta de crear contenido de tus artistas favoritos!.
                        </p>
                        <button onClick={() => router.push('/auth/register')}>Registrarse</button>
                    </div>
                )}
                {filterArtists.length > 0 &&
                    <div>
                        <input
                            type="text"
                            placeholder="ingrese nombre del artista..."
                            onChange={handleOnchange}
                            name="serching"
                        />
                    </div>
                }

                <div
                    style={{
                        display: "flex",
                        gap: "16px",
                        overflowX: "auto",
                        padding: "10px 0"
                    }}
                >
                    {filterArtists.map(a => (
                        <Link
                            key={a.id}
                            href={`/artist/${a.id}/profile`}
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
                </div>
            </div>
            {session?.user.id && artists.length === 0 &&
                <div>
                    <p>No hay artistas, crea el primero!</p>
                    <button onClick={() => router.push('/artist')}>Crear Artista!</button>
                </div>
            }
        </div>
    )
}

export default ArtistsIndex