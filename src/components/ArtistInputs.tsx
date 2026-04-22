import { useParams } from "next/navigation"

const ArstistInpust = ({
    errors,
    genres,
    handleArtist,
    handleGenres,
    handleFile,
    router,
    artist
}) => {
    const {id} = useParams()
    let artistId: number = Number(id)

    return (
        <>
            <label>Nombre:</label>
            <input
                type="text"
                name="name"
                onChange={handleArtist}
                value={artist.name}
            />
            {errors?.name && <p className="error">{errors.name[0]}</p>}

            <label>Género/s:</label>
            <select
                multiple
                value={artist.genres}
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

            <label>Biografía:</label>
            <textarea
                name="bio"
                onChange={handleArtist}
                value={artist.bio}
            />
            {errors?.bio && <p className="error">{errors.bio[0]}</p>}

            <label>Imagen:</label>
            <input type="file" onChange={handleFile} />

            <div className="form-actions">
                <button type="submit">Enviar</button>
                <button type="button" onClick={() => router.push(`/artist/${artistId}/profile`)}>
                    Volver
                </button>
            </div>
        </>
    )
}

export default ArstistInpust