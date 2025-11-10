import type { Album } from './album'

/**
 * Represents an item in the shopping cart
 */
export interface CartItem {
  album: Album
  quantity: number
  addedAt: Date
}

/**
 * Cart state interface
 */
export interface CartState {
  items: CartItem[]
  total: number
}
