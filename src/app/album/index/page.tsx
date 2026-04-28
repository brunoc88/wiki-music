"use client"

import { getAllActiveAlbums } from "@/lib/auth/api/album.api"
import { ActiveAlbums } from "@/types/album.types"
import { useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import styles from "./style.module.css"

const ITEMS_PER_PAGE = 8

const AlbumsIndex = () => {
  const [albums, setAlbums] = useState<ActiveAlbums>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    const loadAlbums = async () => {
      try {
        const res = await getAllActiveAlbums()

        if (res.ok) {
          setAlbums(res.albums)
        } else {
          setStatus(res.status)
        }
      } catch (error) {
        setStatus(500)
      } finally {
        setLoading(false)
      }
    }

    loadAlbums()
  }, [])

  const filteredAlbums = useMemo(() => {
    return albums.filter((album) =>
      album.name
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [albums, search])

  const totalPages = Math.ceil(
    filteredAlbums.length / ITEMS_PER_PAGE
  )

  const paginatedAlbums = filteredAlbums.slice(
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

  if (status === 500) {
    return (
      <div className={styles.wrapper}>
        <p>Error de servidor.</p>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>
        Albums recientes
      </h1>

      {session?.user?.id ? (
        <div className={styles.banner}>
          <p>
            No te quedes atrás y crea un album.
          </p>

          <button
            className={styles.button}
            onClick={() => router.push("/album")}
          >
            Crear Album
          </button>
        </div>
      ) : (
        <div className={styles.banner}>
          <p>
            ¿Quieres crear albums?
            Registrate y compartí tus
            favoritos.
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

      {albums.length > 0 && (
        <input
          type="text"
          placeholder="Buscar album..."
          value={search}
          onChange={handleSearch}
          className={styles.search}
        />
      )}

      {filteredAlbums.length === 0 ? (
        <p className={styles.empty}>
          No se encontraron albums.
        </p>
      ) : (
        <>
          <div className={styles.grid}>
            {paginatedAlbums.map((album) => (
              <Link
                key={album.id}
                href={`/album/${album.id}`}
              >
                <div className={styles.card}>
                  <img
                    src={album.pic}
                    alt={album.name}
                    className={styles.image}
                  />

                  <p className={styles.name}>
                    {album.name}
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
                Página {currentPage} de{" "}
                {totalPages}
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

export default AlbumsIndex