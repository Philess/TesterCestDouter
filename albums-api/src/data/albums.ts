import type { Album, CreateAlbumDto, UpdateAlbumDto } from '../types/album.js';

/**
 * In-memory album data store
 */
let albums: Album[] = [
  {
    id: 1,
    title: "You, Me and an App Id",
    artist: "Daprize",
    price: 10.99,
    image_url: "https://aka.ms/albums-daprlogo"
  },
  {
    id: 2,
    title: "Seven Revision Army",
    artist: "The Blue-Green Stripes",
    price: 13.99,
    image_url: "https://aka.ms/albums-containerappslogo"
  },
  {
    id: 3,
    title: "Scale It Up",
    artist: "KEDA Club",
    price: 13.99,
    image_url: "https://aka.ms/albums-kedalogo"
  },
  {
    id: 4,
    title: "Lost in Translation",
    artist: "MegaDNS",
    price: 12.99,
    image_url: "https://aka.ms/albums-envoylogo"
  },
  {
    id: 5,
    title: "Lock Down Your Love",
    artist: "V is for VNET",
    price: 12.99,
    image_url: "https://aka.ms/albums-vnetlogo"
  },
  {
    id: 6,
    title: "Sweet Container O' Mine",
    artist: "Guns N Probeses",
    price: 14.99,
    image_url: "https://aka.ms/albums-containerappslogo"
  }
];

/**
 * Get all albums from the in-memory store
 * @returns Array of all albums
 */
export function getAllAlbums(): Album[] {
  return albums;
}

/**
 * Get album by ID from the in-memory store
 * @param id - Album ID to retrieve
 * @returns Album object or undefined if not found
 */
export function getAlbumById(id: number): Album | undefined {
  return albums.find(album => album.id === id);
}

/**
 * Add a new album to the in-memory store
 * @param albumData - Album data without ID
 * @returns The newly created album with generated ID
 */
export function addAlbum(albumData: CreateAlbumDto): Album {
  const newId = albums.length > 0 ? Math.max(...albums.map(a => a.id)) + 1 : 1;
  const newAlbum: Album = {
    id: newId,
    ...albumData
  };
  albums.push(newAlbum);
  return newAlbum;
}

/**
 * Update an existing album in the in-memory store
 * @param id - Album ID to update
 * @param updates - Fields to update (partial)
 * @returns Updated album or null if not found
 */
export function updateAlbum(id: number, updates: UpdateAlbumDto): Album | null {
  const index = albums.findIndex(album => album.id === id);
  if (index === -1) {
    return null;
  }
  
  albums[index] = {
    ...albums[index],
    ...updates,
    id // Ensure ID cannot be changed
  };
  
  return albums[index];
}

/**
 * Delete an album from the in-memory store
 * @param id - Album ID to delete
 * @returns True if deleted successfully, false if not found
 */
export function deleteAlbum(id: number): boolean {
  const index = albums.findIndex(album => album.id === id);
  if (index === -1) {
    return false;
  }
  
  albums.splice(index, 1);
  return true;
}
