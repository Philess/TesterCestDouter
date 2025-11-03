/**
 * Album entity representing a music album in the store
 */
export interface Album {
  /** Unique album identifier */
  id: number;
  /** Album title */
  title: string;
  /** Artist name */
  artist: string;
  /** Album price in USD */
  price: number;
  /** URL to album cover image */
  image_url: string;
}

/**
 * Album data for creating a new album (without ID)
 */
export type CreateAlbumDto = Omit<Album, 'id'>;

/**
 * Album data for updating an existing album (all fields optional except ID)
 */
export type UpdateAlbumDto = Partial<Omit<Album, 'id'>>;
