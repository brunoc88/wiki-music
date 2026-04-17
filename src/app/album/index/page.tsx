"use client"

import { ActiveAlbums } from "@/types/album.types"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { getAllActiveAlbums } from "@/lib/auth/api/album.api"
import Link from "next/link"

const AlbumsIndex = () => {
    const [albums, setAlbums] = useState<ActiveAlbums>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [status, setStatus] = useState<number>(0)
    const { data: session } = useSession()
    const router = useRouter()

    useEffect(() => {
        const loadAlbums = async () => {
            const res = await getAllActiveAlbums()
            if (res.ok) setAlbums(res.albums)
            else setStatus(res.status)
            setLoading(false)
        }

        loadAlbums()
    }, [])

    if (loading) return <p>Loading...</p>
    if (status === 500) <p>Error de servidor</p>

    return (
        <div>
            <div>
                <h2>Albums recientes</h2>
                {session?.user.id?(
                    <div>
                        <p>No te quedes atras y crea un album!</p>
                        <button onClick={()=>router.push('/album')}>Crear Album!</button>
                    </div>
                ):(
                    <div>
                        <p>Quieres crear un album?. Registrate y disfruta de crear contenido de tus artistas favoritos!.
                        </p>
                        <button onClick={()=>router.push('/auth/register')}>Registrarse</button>
                    </div>
                )}                
                <div
                    style={{
                        display: "flex",
                        gap: "16px",
                        overflowX: "auto",
                        padding: "10px 0"
                    }}
                >
                    {albums.map(a => (
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
                </div>
            </div>
            {session?.user.id && albums.length === 0 &&
                <div>
                    <p>No hay albums, crea el primero!</p>
                    <button onClick={() => router.push('/album')}>Crear Album!</button>
                </div>
            }
        </div>
    )
}

export default AlbumsIndex