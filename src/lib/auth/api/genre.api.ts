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
        ok: true,
        genres: body
    }
}

export const getAllGenres = async () => {
    const res = await fetch('/api/gender', {
        method: 'GET'
    })

    const body = await res.json()

    if (res.ok) {
        return {
            ok: true,
            genres: body
        }
    } else {
        return {
            ok: false,
            error: body.error ?? "server error"
        }
    }
}

export const toggleStateGenre = async (id: number) => {
    const res = await fetch(`/api/gender/toggle/${id}`, {
        method: 'PATCH'
    })

    const body = await res.json()

    if (res.ok) {
        return {
            ok: true
        }
    } else {
        return {
            ok: false,
            error: body.error,
            status: res.status
        }
    }
}

export const createGenre = async (data: { name: string }) => {
    const res = await fetch('/api/gender', {
        method: 'POST',
        body: JSON.stringify(data)
    })

    const body = await res.json()
    if (res.ok) return {
        ok: true,
        genre: body.gender
    }
    else {
        return {
            ok: false,
            error: body.error,
            status: res.status
        }
    }
}

export const updateGenreById = async (data:{name:string}, id:number) => {
    const res = await fetch (`/api/gender/${id}`, {
        method:'PATCH',
        body:JSON.stringify(data)
    })

    const body = await res.json()

    if(res.ok) {
        return {
            ok:true,
            genre: body
        }
    }else {
        return {
            ok:false,
            error: body.error,
            status:res.status
        }
    }


}