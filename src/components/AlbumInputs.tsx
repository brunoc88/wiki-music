const AlbumInputs = ({
    genres,
    artists,
    addSongs,
    setAddSongs,
    plus,
    setPlus

}) => {
    return (
        <div>
            Titulo:
            <input type="text" />
            Artista/Banda:
            <select name="" id="">{artists?.length > 0 ?
                (artists.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                ))) :
                (<p>No hay artistas disponibles</p>)
            }</select>
            Genero/s:
            <select multiple name="" id="">
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
            imagen:
            <input type="file" />
            {!addSongs && <div>
                <button onClick={() => setAddSongs(true)}>Agregar Canciones</button>
            </div>}
            {addSongs && 
            <div>
                <p>Ingrese canciones</p>
                

                <button onClick={() => setAddSongs(false)}>Cancelar</button>
            </div>
            
            }
            
            <button>Enviar</button>
            <button>Volver</button>
        </div>
    )
}
export default AlbumInputs