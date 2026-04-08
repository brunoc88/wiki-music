"use client"

import { getAllActiveAlbums } from "@/lib/auth/api/album.api"
import { Albums } from "@/types/album.types"
import { useState, useEffect } from "react"
import Link from "next/link"

const HomePage = () => {
    const [albums, setAlbums] = useState<Albums>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadAlbums = async () => {
            const res = await getAllActiveAlbums()
            setAlbums(res.albums)
            setLoading(false)
        }

        loadAlbums()
    }, [])

    if (loading) return <p>Loading...</p>

    return (
        <div style={{ padding: "20px" }}>
            {albums.length === 0 ? (
                <div>
                    <p>No hay albums, sé el primero!</p>
                    <button>Crear Album</button>
                </div>
            ) : (
                <div>
                    <h1>Albums</h1>
                    <h2>Agregados recientemente</h2>

                    {/* 🔥 Contenedor horizontal */}
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
            )}
        </div>
    )
}

export default HomePage