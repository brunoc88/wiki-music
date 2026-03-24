export const createArtist = async (formData: FormData) => {
    const res = await fetch('/api/artist', {
        method: 'POST',
        body: formData
    })

    const body = await res.json()

    if (!res.ok) {
        return {
            ok: false,
            error: body.error ?? "Error del servidor",
            status: res.status
        }
    }

    return {
        ok: true,
        body
    }

}

export const getArtistById = async (id: number) => {
   
    const res = await fetch(`/api/artist/${id}`, {
        method: 'GET'
    })

    const body = await res.json()

    if (!res.ok) {
        return {
            ok: false,
            error: body.error ?? "Error del servidor",
            status:res.status
        }
    }

    return {
        ok:true,
        artist: body
    }
}