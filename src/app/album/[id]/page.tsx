"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"

import {
  getAlbumById,
  toggleAlbumById,
} from "@/lib/auth/api/album.api"

import { AlbumInfo as AlbumType } from "@/types/album.types"
import styles from "./AlbumInfo.module.css"

const AlbumInfo = () => {
  const [album, setAlbum] =
    useState<AlbumType>({
      id: 0,
      name: "",
      state: false,
      genres: [],
      createdBy: {
        username: "",
      },
      updatedBy: {
        username: "",
      },
      songs: [],
      pic: "",
      artist: {
        id: 0,
        name: "",
      },
    })

  const [loading, setLoading] =
    useState(true)

  const [empty, setEmpty] =
    useState(false)

  const [open, setOpen] =
    useState(false)

  const { id } = useParams()
  const router = useRouter()

  const albumId = Number(id)

  const { data: session } =
    useSession()

  const isAdmin = [
    "admin",
    "super",
  ].includes(session?.user?.rol ?? "")

  const canView =
    album.state || isAdmin

  useEffect(() => {
    if (!id) return

    const loadAlbum =
      async () => {
        try {
          const res =
            await getAlbumById(
              albumId
            )

          if (
            res?.ok &&
            res?.album
          ) {
            setAlbum(
              res.album
            )
          } else {
            setEmpty(true)
          }
        } finally {
          setLoading(false)
        }
      }

    loadAlbum()
  }, [id])

  const toggleStateAlbum =
    async () => {
      const message =
        album.state
          ? "¿Seguro que querés desactivar el álbum?"
          : "¿Seguro que querés activar el álbum?"

      if (
        !confirm(message)
      )
        return

      const res =
        await toggleAlbumById(
          album.id
        )

      if (res.ok) {
        setAlbum(
          (
            prev
          ) => ({
            ...prev,
            state:
              !prev.state,
          })
        )
      }
    }

  if (loading) {
    return (
      <div
        className={
          styles.wrapper
        }
      >
        <p>
          Cargando...
        </p>
      </div>
    )
  }

  if (empty || !canView) {
    return (
      <div
        className={
          styles.wrapper
        }
      >
        <div
          className={
            styles.empty
          }
        >
          <p>
            Álbum no disponible o inexistente.
          </p>

          <button
            className={
              styles.button
            }
            onClick={() =>
              router.push(
                "/home"
              )
            }
          >
            Volver
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={
        styles.wrapper
      }
    >
      <section
        className={
          styles.hero
        }
      >
        <img
          src={album.pic}
          alt={album.name}
          className={
            styles.cover
          }
        />

        <div
          className={
            styles.info
          }
        >
          <div
            className={
              styles.topRow
            }
          >
            <h1
              className={
                styles.title
              }
            >
              {album.name}
            </h1>

            <span
              className={
                album.state
                  ? styles.active
                  : styles.inactive
              }
            >
              {album.state
                ? "Activo"
                : "Inactivo"}
            </span>
          </div>

          <Link
            href={`/artist/${album.artist.id}/profile`}
            className={
              styles.artist
            }
          >
            {album.artist.name}
          </Link>

          <div
            className={
              styles.genres
            }
          >
            {album.genres.map(
              (
                genre
              ) => (
                <span
                  key={
                    genre.id
                  }
                  className={
                    styles.genre
                  }
                >
                  {
                    genre.name
                  }
                </span>
              )
            )}
          </div>

          <p
            className={
              styles.author
            }
          >
            Creado/Editado por{" "}
            {album
              .updatedBy
              ?.username ||
              album
                .createdBy
                ?.username}
          </p>

          {session?.user
            ?.id && (
              <div
                className={
                  styles.actions
                }
              >
                {!open ? (
                  <button
                    className={
                      styles.button
                    }
                    onClick={() =>
                      setOpen(
                        true
                      )
                    }
                  >
                    Opciones
                  </button>
                ) : (
                  <>
                    <button
                      className={
                        styles.button
                      }
                      onClick={() =>
                        router.push(
                          `/album/${album.id}/edit`
                        )
                      }
                    >
                      Editar
                    </button>

                    {isAdmin && (
                      <button
                        className={
                          styles.buttonSecondary
                        }
                        onClick={
                          toggleStateAlbum
                        }
                      >
                        {album.state
                          ? "Desactivar"
                          : "Activar"}
                      </button>
                    )}

                    <button
                      className={
                        styles.cancel
                      }
                      onClick={() =>
                        setOpen(
                          false
                        )
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

      <section
        className={
          styles.section
        }
      >
        <h2
          className={
            styles.sectionTitle
          }
        >
          Canciones
        </h2>

        {album.songs
          .length >
          0 ? (
          <ol
            className={
              styles.tracklist
            }
          >
            {album.songs.map(
              (
                song,
                index
              ) => (
                <li
                  key={
                    song.id
                  }
                  className={
                    styles.track
                  }
                >
                  <span>
                    {String(
                      index +
                      1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <span>
                    {
                      song.name
                    }
                  </span>
                </li>
              )
            )}
          </ol>
        ) : (
          <div
            className={
              styles.empty
            }
          >
            <p>
              No hay canciones cargadas.
            </p>

            {session?.user
              ?.id && (
                <button
                  className={
                    styles.button
                  }
                  onClick={() =>
                    router.push(
                      `/album/${album.id}/edit`
                    )
                  }
                >
                  Agregar canciones
                </button>
              )}
          </div>
        )}
      </section>
    </div>
  )
}

export default AlbumInfo