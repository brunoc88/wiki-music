export const createArtist = async (formData:FormData) => {
    const res = await fetch('/api/artist', {
        method:'POST',
        body: formData
    })

    const body = await res.json()

    if(!res.ok) {
        return {
            ok:false,
            error: body.error ?? "Error del servidor"
        }
    }

    return {
        ok:true,
        body
    }

}