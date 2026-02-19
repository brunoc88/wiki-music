export type RegisterArtist = {
    name:string,
    bio:string,
    genres: number[]
}

export type ArtistToCreate = {
  name: string
  bio: string
  createdById: number
  pic: string
  picPublicId: string | null
}
