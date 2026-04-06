export const createAlbum = async (data:FormData) => {
    const res = await fetch('/api/album', {
        method:'POST',
        body:data
    })

    const body = await res.json()

    if(!res.ok) {
        return {
            ok:false,
            status:res.status,
            error:body.error ?? "Error del servidor"
        }
    }
    return {ok: true}
}

export const getAlbumById = async (id:number) => {
    const res = await fetch(`/api/album/${id}`)

    const body = await res.json()

    if(res.ok) return {
        ok:true,
        album: body
    }
    else return {
        ok:false,
        error: body.error ?? "Error del servidor",
        status: res.status
    }
}