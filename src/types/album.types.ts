export type RegisterAlbum = {
    name: string
    genres: number[]
    artistId: number,
    songs?: { name: string }[]
}

export type CreateAlbum = {
    name: string;
    genres: number[];
    artistId: number;
    pic: string;
    picPublicId: string | null;
    createdById: number;
    songs?: { name: string }[]
}

export type EditAlbum = {
    name: string,
    genres:number[],
    artistId:number
}

export type UploadAlbum = {
    name: string,
    genres:number[],
    artistId:number
    pic?: string ;
    picPublicId?: string;
    updatedById: number
}