"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useSession } from "next-auth/react"
import { createGenre, getAllGenres, toggleStateGenre, updateGenreById } from "@/lib/auth/api/genre.api"
import { useRouter } from "next/navigation"
import { useError } from "@/context/ErrorContext"
import "./style.css"

const GenresIndex = () => {
    const [genres, setGenres] = useState<{ id: number, name: string, state: boolean }[]>([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    const [genre, setGenre] = useState("")
    const [resStatus, setResStatus] = useState<number>()
    const [editMode, setEditMode] = useState<{ state: boolean, id: number }>()
    const [idGenreToEdit, setIdGenreToEdit] = useState<number>(0)
    const { errors, setErrors } = useError()
    const { data: session, status } = useSession()
    const router = useRouter()

    const isAdmin = ["admin", "super"].includes(session?.user?.rol)

    useEffect(() => {
        if (status === "loading") return
        if (!session || !isAdmin) router.push("/auth/login")
    }, [status, session])

    useEffect(() => {
        const loadGenres = async () => {
            const res = await getAllGenres()
            if (res.ok) setGenres(res.genres)
            setLoading(false)
        }
        loadGenres()
    }, [])

    const filteredGenres = useMemo(() => {
        if (!search) return genres
        return genres.filter(g =>
            g.name.toLowerCase().includes(search.toLowerCase())
        )
    }, [search, genres])

    const handleToggleGenreState = async (id: number) => {
        const res = await toggleStateGenre(id)
        if (res.ok) {
            setGenres(prev =>
                prev.map(g =>
                    g.id === id ? { ...g, state: !g.state } : g
                )
            )
        } else {
            setErrors(res.error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        const res = await createGenre({ name: genre })

        if (res.ok) {
            setGenres(prev => [...prev, res.genre])
            setGenre("")
        } else {
            setErrors(res.error)
            setResStatus(res.status)
            setTimeout(() => {
                setErrors({})
                setResStatus(0)
            }, 5000);

        }
    }

    const handleSunmitEditGenre = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        const res = await updateGenreById({ name: genre }, idGenreToEdit)

        if (res.ok) {
            setGenres(prev =>
                prev.map(g =>
                    g.id === idGenreToEdit ? res.genre : g
                )
            )
            setEditMode({ state: false, id: 0 })
            setGenre("")
        } else {
            setErrors(res.error)
            setResStatus(res.status)
        }
    }

    const handleEditGenre = (id: number) => {
        setEditMode({ state: true, id })
        genres.filter(g => {
            if (g.id === id) {
                setGenre(g.name)
                setIdGenreToEdit(g.id)
            }
            return
        })

    }

    if (loading) return <p className="loading">Loading...</p>
    if (!session || !isAdmin) return null

    return (
        <div className="container">
            <h1 className="title">Listado de generos musicales</h1>

            {errors.name && <p className="error">{errors.name[0]}</p>}
            {resStatus === 409 && <p className="error">El género ya existe</p>}

            <div className="controls">
                <form onSubmit={editMode?.state ? handleSunmitEditGenre : handleSubmit} className="form">
                    <label>{editMode?.state ? 'Editar:' : 'Crear:'}</label>
                    <input
                        type="text"
                        value={genre}
                        onChange={(e) => { setGenre(e.target.value) }
                        }
                    />
                    <button type="submit">Enviar</button>
                </form>

                <input
                    type="text"
                    placeholder="Buscar"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {genres.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGenres.length > 0 ? (
                            filteredGenres.map(g => (
                                <tr key={g.id}>
                                    <td>{g.id}</td>
                                    <td>{g.name}</td>
                                    <td>
                                        <span className={g.state ? "badge active" : "badge inactive"}>
                                            {g.state ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                    <td>
                                        {!editMode?.state && <button onClick={() => handleEditGenre(g.id)}>Editar</button>}
                                        {editMode?.state && editMode.id === g.id && <button onClick={() => {
                                            setEditMode({ state: false, id: 0 })
                                        }}>Cancelar</button>}
                                        {session.user.rol === "super" && (
                                            <button onClick={() => handleToggleGenreState(g.id)}>
                                                {g.state ? "Desactivar" : "Activar"}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="no-results">Sin resultados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            ) : (
                <p className="empty">No existen géneros</p>
            )}
        </div>
    )
}

export default GenresIndex