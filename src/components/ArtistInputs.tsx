import { useParams } from "next/navigation"
import styles from "./ArtistInputs.module.css"

type Props = {
  errors: any
  genres: {
    id: number
    name: string
    state: boolean
  }[]
  handleArtist: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => void
  handleGenres: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void
  handleFile: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void
  router: any
  artist: {
    name: string
    bio: string
    genres: number[]
  }
}

const ArtistInputs = ({
  errors,
  genres,
  handleArtist,
  handleGenres,
  handleFile,
  router,
  artist,
}: Props) => {
  const { id } = useParams()

  const artistId = Number(id)

  const goBack = () => {
    if (artistId) {
      router.push(
        `/artist/${artistId}/profile`
      )
    } else {
      router.push("/artist/index")
    }
  }

  return (
    <>
      <div className={styles.group}>
        <label>
          Nombre
        </label>

        <input
          type="text"
          name="name"
          value={artist.name}
          onChange={
            handleArtist
          }
          placeholder="Nombre del artista"
        />

        {errors?.name && (
          <p
            className={
              styles.error
            }
          >
            {
              errors.name[0]
            }
          </p>
        )}
      </div>

      <div className={styles.group}>
        <label>
          Género/s
        </label>

        <select
          multiple
          value={
            artist.genres
          }
          onChange={
            handleGenres
          }
        >
          {genres.length >
          0 ? (
            genres.map(
              (
                genre
              ) => (
                <option
                  key={
                    genre.id
                  }
                  value={
                    genre.id
                  }
                >
                  {
                    genre.name
                  }
                </option>
              )
            )
          ) : (
            <option disabled>
              No hay géneros
            </option>
          )}
        </select>

        {errors?.genres && (
          <p
            className={
              styles.error
            }
          >
            Debe seleccionar al menos un género.
          </p>
        )}
      </div>

      <div className={styles.group}>
        <label>
          Biografía
        </label>

        <textarea
          name="bio"
          value={artist.bio}
          onChange={
            handleArtist
          }
          placeholder="Biografía del artista"
        />

        {errors?.bio && (
          <p
            className={
              styles.error
            }
          >
            {
              errors.bio[0]
            }
          </p>
        )}
      </div>

      <div className={styles.group}>
        <label>
          Imagen
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={
            handleFile
          }
        />
      </div>

      <div
        className={
          styles.actions
        }
      >
        <button
          type="submit"
          className={
            styles.primary
          }
        >
          Guardar
        </button>

        <button
          type="button"
          className={
            styles.secondary
          }
          onClick={goBack}
        >
          Volver
        </button>
      </div>
    </>
  )
}

export default ArtistInputs