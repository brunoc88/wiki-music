"use client"

import AlbumInputs from "@/components/AlbumInputs"
import { useError } from "@/context/ErrorContext"
import { getAlbumById } from "@/lib/auth/api/album.api"
import { getAllActiveArtist } from "@/lib/auth/api/artist.api"
import { getActiveGenres } from "@/lib/auth/api/genre.api"
import { RegisterAlbum } from "@/types/album.types"
import { ArtistSelection } from "@/types/artist.types"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"

const EditAlbumForm = () => {
    const { id } = useParams()
    const albumId = Number(id)

    const [genres, setGenres] = useState([])
    const [artists, setArtists] = useState<ArtistSelection>([])
    const [loading, setLoading] = useState(true)
    const [showSongs, setShowSongs] = useState(false)
    const [songs, setSongs] = useState([""])
    const { errors, setErrors } = useError()
    const [album, setAlbum] = useState<RegisterAlbum>({
        name: "",
        genres: [],
        artistId: 0,
        songs: []
    })
    const [file, setFile] = useState<File | null>(null)
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "loading") return

        if (!session) {
            router.push("/auth/login")
        }
    }, [session, status])

    useEffect(() => {
        const loadData = async () => {
            const resGenres = await getActiveGenres()
            if (resGenres.ok) setGenres(resGenres.genres)

            const resArtists = await getAllActiveArtist()
            if (resArtists.ok) {
                const allArtist: ArtistSelection = resArtists.artists.map(a => ({
                    id: a.id,
                    name: a.name
                }))

                setArtists(allArtist)
            }
            
            const resAlbum = await getAlbumById(albumId)
            if(resAlbum.ok) setAlbum(resAlbum.album)

            if(!resAlbum.ok) setErrors(resAlbum.error)
            
            setLoading(false)
        }

        loadData()
    }, [])

    return (
        <div>
            <form action="">
                <AlbumInputs 
                genres={genres} 
                album={album}
                artists={artists}
                />
            </form>
        </div>
    )
}

export default EditAlbumForm