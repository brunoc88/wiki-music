export type RegisterArtist = {
  name: string,
  bio: string,
  genres: number[]
}

export type ArtistToCreate = {
  name: string
  bio: string
  createdById: number
  pic: string
  picPublicId: string | null
}

export type UpdateArtistData = {
  name?: string
  bio?: string
  genres?: number[]
  pic?: string
  picPublicId?: string,
  updatedById: number
}

export type ArtistDescription = {
  name: string,
  bio: string,
  genres: { id: number, name: string }[],
  createdBy: {
    username: string
  },
  updatedBy?: {
    username: string
  }
}

export type ArtistOption = {
  id: number,
  name: string
}

export type ArtistSelection = ArtistOption[]