"use client"

import AlbumInputs from "@/components/AlbumInputs"
import { getActiveGenres } from "@/lib/auth/api/genre.api"
import { RegisterAlbum } from "@/types/album.types"
import { EnableGenres } from "@/types/genre.types"
import React, { useState, useEffect } from "react"
import { useError } from "@/context/ErrorContext"
import { getAllActiveArtist } from "@/lib/auth/api/artist.api"

const AlbumForm = () => {

    const [genres, setGenres] = useState<EnableGenres>()
    const [album, setAlbum] = useState<RegisterAlbum>()
    const [artists, setArtists] = useState<{id:number, name:string, state:boolean}[]>()
    const [loading, setLoading] = useState(true)
    //const {errors, setErrors} = useError()
    const [addSongs, setAddsongs] = useState(false)
    const [plus, setPlus] = useState<number[]>([])

    useEffect(()=>{
        const loadingGenres = async() =>{
            const res = await getActiveGenres()
            if(res.ok) setGenres(res.genres)
        }

        if(loading)loadingGenres()
    },[loading])

    useEffect(()=>{
        const loadingArtists = async () => {
            const res = await getAllActiveArtist()
            if(res.ok) setArtists(res.artists)
            setLoading(false)
        }
        loadingArtists()
    },[loading])

    const handleSUbmit = (e: React.FormEvent) => {
        e.preventDefault()
    }

    if(loading) return <p>Loading...</p>
    return (
        <div>
            <h1>Registro de album</h1>
            <form onSubmit={handleSUbmit}>
                <AlbumInputs
                genres={genres}
                artists= {artists}
                addSongs = {addSongs}
                setAddSongs = {setAddsongs}
                plus={plus}
                setPlus={setPlus}
                />
            </form>
        </div>
    )
}

export default AlbumForm