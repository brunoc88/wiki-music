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
    cleanSongs
}) => {
    return (
        <div>

            <p>Titulo:</p>
            <input type="text" onChange={handleAlbumName}/>
            {errors?.name && <p className="error">{errors.name[0]}</p>}
            <p>Artista/Banda:</p>
            <select name="artistId" onChange={handleSelectArtist}>
                <option value="">Seleccionar artista</option>
                {artists?.length > 0 ? (
                    artists.map((a) => (
                        <option key={a.id} value={a.id}>
                            {a.name}
                        </option>
                    ))
                ) : (
                    <option disabled>No hay artistas disponibles</option>
                )}
            </select>
            {errors?.artistId && <p className="error">{errors?.artistId[0]}</p>}
            <p>Genero/s:</p>
            <select multiple name="genres" onChange={handleGenres}>
                {genres?.length > 0 ? (
                    genres.map((g) => (
                        <option key={g.id} value={g.id}>
                            {g.name}
                        </option>
                    ))
                ) : (
                    <option disabled>No hay géneros</option>
                )}
            </select>
            {errors?.genres && <p className="error">Debe seleccionar un genero</p>}

            <p>Imagen:</p>
            <input type="file" onChange={handleFile}/>

            {!showSongs && (
                <div>
                    <button type="button" onClick={() => {setShowSongs(true)}}>
                        Agregar Canciones
                    </button>
                </div>
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
                    <button onClick={()=>{
                        setShowSongs(false)
                        cleanSongs()
                    }
                    }>Cancelar</button>
                </div>
            )}
            {errors?.songs && <span>{errors.songs[0]}</span>}

            <br />

            <button type="submit">Enviar</button>
            <button type="button">Volver</button>
        </div>
    )
}

export default AlbumInputs