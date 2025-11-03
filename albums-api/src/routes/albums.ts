import express, { type Request, type Response } from 'express';
import {
  getAllAlbums,
  getAlbumById,
  addAlbum,
  updateAlbum,
  deleteAlbum
} from '../data/albums.js';
import type { CreateAlbumDto, UpdateAlbumDto } from '../types/album.js';

const router = express.Router();

/**
 * @route GET /albums
 * @description Get all albums
 * @returns {Album[]} 200 - Array of albums
 */
router.get('/', (_req: Request, res: Response) => {
  try {
    const albums = getAllAlbums();
    res.status(200).json(albums);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve albums' });
  }
});

/**
 * @route GET /albums/:id
 * @description Get a single album by ID
 * @param {number} id - Album ID
 * @returns {Album} 200 - Album object
 * @returns {Object} 404 - Album not found
 */
router.get('/:id', (req: Request, res: Response): void => {
  try {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid album ID' });
      return;
    }
    
    const album = getAlbumById(id);
    
    if (!album) {
      res.status(404).json({ error: 'Album not found' });
      return;
    }
    
    res.status(200).json(album);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve album' });
  }
});

/**
 * @route POST /albums
 * @description Create a new album
 * @param {Object} body - Album data (title, artist, price, image_url)
 * @returns {Album} 201 - Created album
 * @returns {Object} 400 - Validation error
 */
router.post('/', (req: Request, res: Response): void => {
  try {
    const { title, artist, price, image_url } = req.body;
    
    // Validate required fields
    if (!title || !artist || price === undefined || !image_url) {
      res.status(400).json({
        error: 'Missing required fields: title, artist, price, image_url'
      });
      return;
    }
    
    // Validate price is a number
    if (typeof price !== 'number' || price < 0) {
      res.status(400).json({
        error: 'Price must be a non-negative number'
      });
      return;
    }
    
    const albumData: CreateAlbumDto = { title, artist, price, image_url };
    const newAlbum = addAlbum(albumData);
    res.status(201).json(newAlbum);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create album' });
  }
});

/**
 * @route PUT /albums/:id
 * @description Update an existing album
 * @param {number} id - Album ID
 * @param {Object} body - Fields to update (title, artist, price, image_url)
 * @returns {Album} 200 - Updated album
 * @returns {Object} 404 - Album not found
 */
router.put('/:id', (req: Request, res: Response): void => {
  try {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid album ID' });
      return;
    }
    
    const { title, artist, price, image_url } = req.body;
    
    // Validate price if provided
    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      res.status(400).json({
        error: 'Price must be a non-negative number'
      });
      return;
    }
    
    const updates: UpdateAlbumDto = {};
    if (title !== undefined) updates.title = title;
    if (artist !== undefined) updates.artist = artist;
    if (price !== undefined) updates.price = price;
    if (image_url !== undefined) updates.image_url = image_url;
    
    const updatedAlbum = updateAlbum(id, updates);
    
    if (!updatedAlbum) {
      res.status(404).json({ error: 'Album not found' });
      return;
    }
    
    res.status(200).json(updatedAlbum);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update album' });
  }
});

/**
 * @route DELETE /albums/:id
 * @description Delete an album
 * @param {number} id - Album ID
 * @returns {Object} 204 - No content
 * @returns {Object} 404 - Album not found
 */
router.delete('/:id', (req: Request, res: Response): void => {
  try {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid album ID' });
      return;
    }
    
    const deleted = deleteAlbum(id);
    
    if (!deleted) {
      res.status(404).json({ error: 'Album not found' });
      return;
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete album' });
  }
});

export default router;
