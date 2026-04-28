"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  deactivateArtisById,
  getArtistById,
  reactiveArtistById,
} from "@/lib/auth/api/artist.api"
import { ArtistDescription } from "@/types/artist.types"
import { useError } from "@/context/ErrorContext"
import { useSession } from "next-auth/react"
import Link from "next/link"
import styles from "./../profile/profile.module.css"

const ArtistProfile = () => {
  const [artist, setArtist] =
    useState<ArtistDescription>()
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const { id } = useParams()
  const router = useRouter()
  const { errors, setErrors } = useError()
  const { data: session } = useSession()

  const isAdmin = ["admin", "super"].includes(
    session?.user?.rol
  )

  useEffect(() => {
    if (!id) return

    const loadArtist = async () => {
      try {
        const res = await getArtistById(Number(id))

        if (!res.ok) {
          setErrors(res.error)
        } else {
          setArtist(res.artist)
          setErrors({})
        }
      } finally {
        setLoading(false)
      }
    }

    loadArtist()
  }, [id])

  const toggleArtist = async () => {
    if (!artist) return

    const confirmText = artist.state
      ? "Deseas desactivar este artista?"
      : "Deseas activar este artista?"

    if (!confirm(confirmText)) return

    const res = artist.state
      ? await deactivateArtisById(artist.id)
      : await reactiveArtistById(artist.id)

    if (res.ok) {
      setArtist((prev) =>
        prev
          ? {
              ...prev,
              state: !prev.state,
            }
          : prev
      )
    } else {
      setErrors(res.error)
    }
  }

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <p>Cargando...</p>
      </div>
    )
  }

  if (errors?.length) {
    return (
      <div className={styles.wrapper}>
        <p>Artista no encontrado.</p>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        <img
          src={artist?.pic}
          alt={artist?.name}
          className={styles.cover}
        />

        <div className={styles.info}>
          <div className={styles.topRow}>
            <h1 className={styles.name}>
              {artist?.name}
            </h1>

            <span
              className={
                artist?.state
                  ? styles.active
                  : styles.inactive
              }
            >
              {artist?.state
                ? "Activo"
                : "Inactivo"}
            </span>
          </div>

          <div className={styles.genres}>
            {artist?.genres.map((genre) => (
              <span
                key={genre.id}
                className={styles.genre}
              >
                {genre.name}
              </span>
            ))}
          </div>

          <p className={styles.bio}>
            {artist?.bio}
          </p>

          <p className={styles.author}>
            Creado/editado por:{" "}
            {artist?.updatedBy?.username ||
              artist?.createdBy?.username}
          </p>

          {session?.user?.id && (
            <div className={styles.actions}>
              {!open ? (
                <button
                  className={styles.button}
                  onClick={() =>
                    setOpen(true)
                  }
                >
                  Opciones
                </button>
              ) : (
                <>
                  <button
                    className={styles.button}
                    onClick={() =>
                      router.push(
                        `/artist/${artist?.id}/edit`
                      )
                    }
                  >
                    Editar
                  </button>

                  {isAdmin && (
                    <button
                      className={styles.buttonSecondary}
                      onClick={
                        toggleArtist
                      }
                    >
                      {artist?.state
                        ? "Desactivar"
                        : "Activar"}
                    </button>
                  )}

                  <button
                    className={styles.cancel}
                    onClick={() =>
                      setOpen(false)
                    }
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Albums
        </h2>

        {artist?.albums.length === 0 ? (
          <div className={styles.empty}>
            <p>
              No tiene albums, crea el
              primero.
            </p>

            <button
              className={styles.button}
              onClick={() =>
                router.push("/album")
              }
            >
              Crear Album
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {artist?.albums.map((album) => (
              <Link
                key={album.id}
                href={`/album/${album.id}`}
              >
                <div className={styles.card}>
                  <img
                    src={album.pic}
                    alt={album.name}
                    className={styles.cardImage}
                  />

                  <p className={styles.cardName}>
                    {album.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default ArtistProfile