import { ref, computed, watch } from 'vue'
import type { Album } from '../types/album'
import type { CartItem } from '../types/cart'

const CART_STORAGE_KEY = 'music-store-cart'

// Global cart state (shared across all component instances)
const cartItems = ref<CartItem[]>([])

/**
 * Load cart from localStorage
 */
const loadCartFromStorage = (): void => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Convert date strings back to Date objects
      cartItems.value = parsed.map((item: CartItem) => ({
        ...item,
        addedAt: new Date(item.addedAt)
      }))
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error)
    cartItems.value = []
  }
}

/**
 * Save cart to localStorage
 */
const saveCartToStorage = (): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems.value))
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error)
  }
}

// Initialize cart from localStorage on first load
if (cartItems.value.length === 0) {
  loadCartFromStorage()
}

/**
 * Composable for managing shopping cart state
 */
export const useCart = () => {
  /**
   * Find a cart item by album ID
   */
  const findCartItem = (albumId: number): CartItem | undefined => {
    return cartItems.value.find(item => item.album.id === albumId)
  }

  /**
   * Add an album to the cart
   * If the album already exists, increase its quantity
   */
  const addToCart = (album: Album): void => {
    if (!album || !album.id) {
      console.error('Invalid album data:', album)
      return
    }

    const existingItem = findCartItem(album.id)

    if (existingItem) {
      // Increase quantity if album already in cart
      existingItem.quantity += 1
    } else {
      // Add new item to cart
      cartItems.value.push({
        album,
        quantity: 1,
        addedAt: new Date()
      })
    }
  }

  /**
   * Remove an album from the cart completely
   */
  const removeFromCart = (albumId: number): void => {
    const index = cartItems.value.findIndex(item => item.album.id === albumId)
    if (index !== -1) {
      cartItems.value.splice(index, 1)
    }
  }

  /**
   * Update the quantity of a cart item
   * If quantity is 0 or less, remove the item
   */
  const updateQuantity = (albumId: number, quantity: number): void => {
    if (quantity <= 0) {
      removeFromCart(albumId)
      return
    }

    const item = findCartItem(albumId)
    if (item) {
      item.quantity = quantity
    }
  }

  /**
   * Decrease quantity of an item by 1
   * If quantity becomes 0, remove the item
   */
  const decreaseQuantity = (albumId: number): void => {
    const item = findCartItem(albumId)
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1
      } else {
        removeFromCart(albumId)
      }
    }
  }

  /**
   * Clear all items from the cart
   */
  const clearCart = (): void => {
    cartItems.value = []
  }

  /**
   * Check if an album is in the cart
   */
  const isInCart = (albumId: number): boolean => {
    return findCartItem(albumId) !== undefined
  }

  /**
   * Get the quantity of a specific album in the cart
   */
  const getItemQuantity = (albumId: number): number => {
    const item = findCartItem(albumId)
    return item ? item.quantity : 0
  }

  /**
   * Computed: Total number of items in cart
   */
  const itemCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  /**
   * Computed: Total price of all items in cart
   */
  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + (item.album.price * item.quantity)
    }, 0)
  })

  /**
   * Computed: Formatted cart total with 2 decimal places
   */
  const formattedTotal = computed(() => {
    return cartTotal.value.toFixed(2)
  })

  // Watch cart changes and sync to localStorage
  watch(
    cartItems,
    () => {
      saveCartToStorage()
    },
    { deep: true }
  )

  return {
    // State
    cartItems: computed(() => cartItems.value),
    itemCount,
    cartTotal,
    formattedTotal,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    decreaseQuantity,
    clearCart,

    // Utilities
    isInCart,
    getItemQuantity,
    findCartItem
  }
}
