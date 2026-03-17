import { AlbumSchema } from "./album.create.schema"

export const UpdateAlbumSchema = AlbumSchema.omit({
  songs: true
})