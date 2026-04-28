"use client"

import { getAllActiveArtist } from "@/lib/auth/api/artist.api"
import { useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import styles from "./style.module.css"

type Artist = {
  id: number
  name: string
  state: boolean
  pic: string
}

const ITEMS_PER_PAGE = 8

const ArtistsIndex = () => {
  const [artists, setArtists] = useState<Artist[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    const loadArtists = async () => {
      try {
        const res = await getAllActiveArtist()
        setArtists(res?.artists ?? [])
      } finally {
        setLoading(false)
      }
    }

    loadArtists()
  }, [])

  const filteredArtists = useMemo(() => {
    return (artists ?? []).filter((artist) =>
      artist.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [artists, search])

  const totalPages = Math.ceil(
    filteredArtists.length / ITEMS_PER_PAGE
  )

  const paginatedArtists = filteredArtists.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>
        Artistas recientes
      </h1>

      {session?.user?.id ? (
        <div className={styles.banner}>
          <p>
            No te quedes atrás y crea un artista.
          </p>

          <button
            className={styles.button}
            onClick={() => router.push("/artist")}
          >
            Crear Artista
          </button>
        </div>
      ) : (
        <div className={styles.banner}>
          <p>
            ¿Quieres crear artistas? Registrate
            y compartí tus favoritos.
          </p>

          <button
            className={styles.button}
            onClick={() =>
              router.push("/auth/register")
            }
          >
            Registrarse
          </button>
        </div>
      )}

      {artists.length > 0 && (
        <input
          type="text"
          placeholder="Buscar artista..."
          value={search}
          onChange={handleSearch}
          className={styles.search}
        />
      )}

      {filteredArtists.length === 0 ? (
        <p className={styles.empty}>
          No se encontraron artistas.
        </p>
      ) : (
        <>
          <div className={styles.grid}>
            {paginatedArtists.map((artist) => (
              <Link
                key={artist.id}
                href={`/artist/${artist.id}/profile`}
              >
                <div className={styles.card}>
                  <img
                    src={artist.pic}
                    alt={artist.name}
                    className={styles.image}
                  />

                  <p className={styles.name}>
                    {artist.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((p) => p - 1)
                }
              >
                Anterior
              </button>

              <span>
                Página {currentPage} de {totalPages}
              </span>

              <button
                className={styles.pageBtn}
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage((p) => p + 1)
                }
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ArtistsIndex