const ArstistInpust = ({
    errors,
    genres,
    handleArtist,
    handleGenres,
    handleFile,
    router,
    artist
}) => {
    return (
        <div>
            Nombre:
            <input type="text" name="name" onChange={handleArtist} value={artist ? artist.name : ''} />
            {errors?.name && <p className="error">{errors.name[0]}</p>}

            Genero:
            <select
                multiple
                value={artist ? artist.genres : []}
                onChange={handleGenres}
            >
                {genres.length > 0 ? (
                    genres.map(g => (
                        <option key={g.id} value={g.id}>
                            {g.name}
                        </option>
                    ))
                ) : (
                    <option disabled>No hay géneros</option>
                )}
            </select>
            {errors?.genres && <p className="error">Debe seleccionar un genero</p>}

            Biografia:
            <textarea name="bio" onChange={handleArtist} value={artist ? artist.bio : ''}></textarea>
            {errors?.bio && <p className="error">{errors.bio[0]}</p>}

            Imagen:
            <input type="file" onChange={handleFile} />

            <button type="submit">Enviar</button>
            <button type="button" onClick={() => router.push('/welcome')}>Volver</button>
        </div>
    )



}

export default ArstistInpust