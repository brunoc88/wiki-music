"use client"

import { getAllActiveAlbums } from "@/lib/auth/api/album.api"
import { getAllActiveArtist } from "@/lib/auth/api/artist.api"
import { ActiveAlbums } from "@/types/album.types"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import styles from "./page.module.css"

type Artist = {
  id: number
  name: string
  state: boolean
  pic: string
}

const HomePage = () => {
  const [albums, setAlbums] = useState<ActiveAlbums>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        const [albumsRes, artistsRes] = await Promise.all([
          getAllActiveAlbums(),
          getAllActiveArtist(),
        ])

        setAlbums(albumsRes.albums)
        setArtists(artistsRes.artists)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Agregados recientemente</h1>

      {/* Albums */}
      <section className={styles.section}>
        {albums.length === 0 && artists.length > 0 ? (
          <div className={styles.empty}>
            <p>No hay albums, sé el primero.</p>

            <button className={styles.button}>
              Crear Album
            </button>
          </div>
        ) : (
          <>
            {albums.length > 0 && (
              <>
                <h2 className={styles.sectionTitle}>Albums</h2>

                <div className={styles.row}>
                  {albums.map((album) => (
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
              </>
            )}
          </>
        )}
      </section>

      {/* Artists */}
      <section className={styles.section}>
        {artists.length === 0 ? (
          <div className={styles.empty}>
            <p>No hay artistas creados, sé el primero.</p>

            <button
              className={styles.button}
              onClick={() => router.push("/artist")}
            >
              Crear Artista
            </button>
          </div>
        ) : (
          <>
            <h2 className={styles.sectionTitle}>Artistas</h2>

            <div className={styles.row}>
              {artists.map((artist) => (
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
          </>
        )}
      </section>
    </div>
  )
}

export default HomePage