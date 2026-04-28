import { useParams } from "next/navigation"
import styles from "./AlbumInputs.module.css"

const AlbumInputs = ({
    genres,
    artists,
    songs,
    showSongs,
    setShowSongs,
    handleSongChange,
    addSongInput,
    removeSong,
    errors,
    handleAlbumName,
    handleSelectArtist,
    handleGenres,
    handleFile,
    cleanSongs,
    album,
    router
}) => {
    const { id } = useParams()
    const albumId = Number(id)

    const goBack = () => {
        if (albumId) {
            router.push(`/album/${albumId}`)
        } else {
            router.push("/album/index")
        }
    }

    return (
        <>
            <div className={styles.group}>
                <label>Título</label>

                <input
                    type="text"
                    value={album?.name || ""}
                    onChange={handleAlbumName}
                    placeholder="Nombre del álbum"
                />

                {errors?.name && (
                    <p className={styles.error}>
                        {errors.name[0]}
                    </p>
                )}
            </div>

            <div className={styles.group}>
                <label>Artista / Banda</label>

                <select
                    name="artistId"
                    onChange={handleSelectArtist}
                    value={album?.artistId || ""}
                >
                    <option value="">
                        Seleccionar artista
                    </option>

                    {artists?.map(a => (
                        <option
                            key={a.id}
                            value={a.id}
                        >
                            {a.name}
                        </option>
                    ))}
                </select>

                {errors?.artistId && (
                    <p className={styles.error}>
                        {errors.artistId[0]}
                    </p>
                )}
            </div>

            <div className={styles.group}>
                <label>Género/s</label>

                <select
                    multiple
                    value={album.genres.map(String)}
                    onChange={handleGenres}
                >
                    {genres.map(g => (
                        <option
                            key={g.id}
                            value={String(g.id)}
                        >
                            {g.name}
                        </option>
                    ))}
                </select>

                {errors?.genres && (
                    <p className={styles.error}>
                        {errors.genres[0]}
                    </p>
                )}
            </div>

            <div className={styles.group}>
                <label>Imagen</label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                />
            </div>

            <div className={styles.group}>
                {!showSongs ? (
                    <button
                        type="button"
                        className={styles.secondary}
                        onClick={() => {
                            if (songs.length === 0) {
                                addSongInput()
                            }
                            setShowSongs(true)
                        }}
                    >
                        Agregar canciones
                    </button>
                ) : (
                    <div
                        className={
                            styles.songBox
                        }
                    >
                        <label>
                            Canciones
                        </label>

                        {songs.map(
                            (
                                song,
                                index
                            ) => (
                                <div
                                    key={
                                        index
                                    }
                                    className={
                                        styles.songRow
                                    }
                                >
                                    <input
                                        type="text"
                                        value={
                                            song
                                        }
                                        placeholder={`Canción ${index +
                                            1
                                            }`}
                                        onChange={e =>
                                            handleSongChange(
                                                index,
                                                e
                                                    .target
                                                    .value
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        className={
                                            styles.remove
                                        }
                                        onClick={() =>
                                            removeSong(
                                                index
                                            )
                                        }
                                    >
                                        −
                                    </button>

                                    {index ===
                                        songs.length -
                                        1 && (
                                            <button
                                                type="button"
                                                className={
                                                    styles.add
                                                }
                                                onClick={
                                                    addSongInput
                                                }
                                            >
                                                +
                                            </button>
                                        )}
                                </div>
                            )
                        )}

                        <button
                            type="button"
                            className={
                                styles.cancel
                            }
                            onClick={() => {
                                setShowSongs(
                                    false
                                )
                                cleanSongs()
                            }}
                        >
                            Cancelar canciones
                        </button>
                    </div>
                )}

                {errors?.songs && (
                    <p className={styles.error}>
                        {errors.songs[0]}
                    </p>
                )}
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

export default AlbumInputs

