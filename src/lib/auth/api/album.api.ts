export const createAlbum = async (data: FormData) => {
    const res = await fetch('/api/album', {
        method: 'POST',
        body: data
    })

    const body = await res.json()
    console.log('body', body)

    if (!res.ok) {
        return {
            ok: false,
            status: res.status,
            error: body.error ?? "Error del servidor"
        }
    }
    return {
        ok: true,
        album: body.album
    }
}

export const getAlbumById = async (id: number) => {
    const res = await fetch(`/api/album/${id}`)

    const body = await res.json()

    if (res.ok) {
        return {
            album: body,
            ok: true
        }
    }
    else {
        return {
            ok: false,
            status: res.status,
            error: body.error ?? "Server error"
        }
    }
}

export const toggleAlbumById = async (id: number) => {
    const res = await fetch(`/api/album/${id}`, {
        method: 'PATCH'
    })

    const body = await res.json()

    if (res.ok) {
        return {
            ok: true
        }
    }
    else {
        return {
            ok: false,
            error: body.error,
            status: res.status
        }
    }
}

export const getAllActiveAlbums = async () => {
    const res = await fetch('/api/album', {
        method: 'GET'
    })

    const body = await res.json()

    if (!res.ok) return {
        ok: false,
        error: 'Server Error'
    }
    return {
        ok: true,
        albums: body.albums
    }

}