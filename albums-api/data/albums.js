/**
 * In-memory album data store
 * @type {Album[]}
 */
let albums = [
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
 * Get all albums
 * @returns {Album[]} Array of all albums
 */
export function getAllAlbums() {
  return albums;
}

/**
 * Get album by ID
 * @param {number} id - Album ID
 * @returns {Album | undefined} Album object or undefined if not found
 */
export function getAlbumById(id) {
  return albums.find(album => album.id === id);
}

/**
 * Add a new album
 * @param {Omit<Album, 'id'>} albumData - Album data without ID
 * @returns {Album} The newly created album
 */
export function addAlbum(albumData) {
  const newId = albums.length > 0 ? Math.max(...albums.map(a => a.id)) + 1 : 1;
  const newAlbum = {
    id: newId,
    ...albumData
  };
  albums.push(newAlbum);
  return newAlbum;
}

/**
 * Update an existing album
 * @param {number} id - Album ID
 * @param {Partial<Omit<Album, 'id'>>} updates - Fields to update
 * @returns {Album | null} Updated album or null if not found
 */
export function updateAlbum(id, updates) {
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
 * Delete an album
 * @param {number} id - Album ID
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteAlbum(id) {
  const index = albums.findIndex(album => album.id === id);
  if (index === -1) {
    return false;
  }
  
  albums.splice(index, 1);
  return true;
}

/**
 * @typedef {Object} Album
 * @property {number} id - Unique album identifier
 * @property {string} title - Album title
 * @property {string} artist - Artist name
 * @property {number} price - Album price
 * @property {string} image_url - URL to album cover image
 */
