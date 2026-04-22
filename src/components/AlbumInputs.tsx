import { useParams } from "next/navigation"

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
    const {id} = useParams()
    let albumId = Number(id)

    return (
        <div>
            {errors?.duplicado && <p>{errors.duplicado[0]}</p>}
            <p>Titulo:</p>
            <input
                type="text"
                onChange={handleAlbumName}
                value={album?.name || ""}
            />
            {errors?.name && <p className="error">{errors.name[0]}</p>}

            <p>Artista/Banda:</p>
            <select
                name="artistId"
                onChange={handleSelectArtist}
                value={album?.artistId || ""}
            >
                <option value="">Seleccionar artista</option>
                {artists?.map(a => (
                    <option key={a.id} value={a.id}>
                        {a.name}
                    </option>
                ))}
            </select>
            {errors?.artistId && (
                <p className="error">{errors.artistId[0]}</p>
            )}

            <p>Genero/s:</p>
            <select
                multiple
                value={album.genres.map(String)}
                onChange={handleGenres}
            >
                {genres.map(g => (
                    <option key={g.id} value={String(g.id)}>
                        {g.name}
                    </option>
                ))}
            </select>
            {errors?.genres && (
                <p className="error">{errors.genres[0]}</p>
            )}

            <p>Imagen:</p>
            <input type="file" onChange={handleFile} />

            {!showSongs && (
                <button type="button" onClick={() => setShowSongs(true)}>
                    Agregar Canciones
                </button>
            )}

            {showSongs && (
                <div>
                    <p>Ingrese canciones</p>

                    {songs.map((song, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                value={song}
                                onChange={(e) =>
                                    handleSongChange(index, e.target.value)
                                }
                                placeholder={`Canción ${index + 1}`}
                            />

                            <button
                                type="button"
                                onClick={() => removeSong(index)}
                            >
                                -
                            </button>

                            {index === songs.length - 1 && (
                                <button
                                    type="button"
                                    onClick={addSongInput}
                                >
                                    +
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => {
                            setShowSongs(false)
                            cleanSongs()
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            )}

            {errors?.songs && <span>{errors.songs[0]}</span>}

            <br />

            <div className="form-actions">
                <button type="submit">Enviar</button>
                <button type="button" onClick={() => router.push(`/album/${albumId}`)}>
                    Volver
                </button>
            </div>
        </div>
    )
}

export default AlbumInputs