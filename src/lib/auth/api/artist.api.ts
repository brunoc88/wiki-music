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
        artist: body.artist
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
            status: res.status
        }
    }

    return {
        ok: true,
        artist: body
    }
}

export const updateArtist = async (formData: FormData, id: number) => {
    const res = await fetch(`/api/artist/${id}/edit`, {
        method: 'PUT',
        body: formData
    })

    const body = await res.json()

    if (!res.ok) return {
        ok: false,
        error: body.error ?? "Error del servidor",
        status:res.status
    }

    return {
        ok: true
    }
}

export const getAllActiveArtist = async () => {
    const res = await fetch('/api/artist', {
        method: 'GET'
    })

    const body = await res.json()

    if (res.ok) return {
        ok: true,
        artists: body
    }
    else return {
        ok: false,
        error: 'Error Server'
    }
}

export const deactivateArtisById = async (id: number) => {
    const res = await fetch(`/api/artist/${id}/delete`, {
        method: 'DELETE'
    })

    const body = await res.json()

    if (res.ok) {
        return {
            ok: true
        }
    }
    else return {
        ok: false,
        error: body.error ?? "Server Error",
        status: res.status
    }
}

export const reactiveArtistById = async (id:number) => {
    const res = await fetch(`/api/artist/${id}/active`, {
        method:'PATCH'  
    })

    const body = await res.json()

    if(res.ok) return {
        ok:true
    }
    else {
        return {
            ok:false,
            error:body.error ?? "error server",
            status:res.status
        }
    }
}