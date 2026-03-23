export const getActiveGenres = async () => {
    const res = await fetch('/api/gender/all', {
        method: 'GET'
    })

    const body = await res.json()

    
    if (!res.ok) {
        return {
            ok: false,
            error: body.error ?? "Error del servidor"
        }
    }

    return {
        ok:true,
        genres: body
    }
}