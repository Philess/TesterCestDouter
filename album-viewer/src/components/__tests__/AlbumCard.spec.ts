import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AlbumCard from '../AlbumCard.vue'
import type { Album } from '../../types/album'

// Mock the useCart composable
vi.mock('../../composables/useCart', () => ({
  useCart: vi.fn(),
}))

import { useCart } from '../../composables/useCart'

describe('AlbumCard.vue', () => {
  const mockAlbum: Album = {
    id: 1,
    title: 'Abbey Road',
    artist: 'The Beatles',
    price: 19.99,
    image_url: 'https://example.com/abbey-road.jpg',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render the album card', () => {
      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart: vi.fn().mockReturnValue(false),
        getItemQuantity: vi.fn().mockReturnValue(0),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: mockAlbum,
        },
      })

      expect(wrapper.find('.album-card').exists()).toBe(true)
    })

    it('should display album image', () => {
      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart: vi.fn().mockReturnValue(false),
        getItemQuantity: vi.fn().mockReturnValue(0),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: mockAlbum,
        },
      })

      const img = wrapper.find('.album-image img')
      expect(img.exists()).toBe(true)
      expect(img.attributes('src')).toBe(mockAlbum.image_url)
      expect(img.attributes('alt')).toBe(mockAlbum.title)
    })

    it('should display album title', () => {
      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart: vi.fn().mockReturnValue(false),
        getItemQuantity: vi.fn().mockReturnValue(0),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: mockAlbum,
        },
      })

      expect(wrapper.find('.album-title').text()).toBe(mockAlbum.title)
    })

    it('should display album artist', () => {
      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart: vi.fn().mockReturnValue(false),
        getItemQuantity: vi.fn().mockReturnValue(0),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: mockAlbum,
        },
      })

      expect(wrapper.find('.album-artist').text()).toBe(mockAlbum.artist)
    })

    it('should display album price with correct formatting', () => {
      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart: vi.fn().mockReturnValue(false),
        getItemQuantity: vi.fn().mockReturnValue(0),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: mockAlbum,
        },
      })

      const priceBadge = wrapper.find('.price')
      expect(priceBadge.exists()).toBe(true)
      expect(priceBadge.text()).toBe(`$${mockAlbum.price.toFixed(2)}`)
    })

    it('should display price badge', () => {
      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart: vi.fn().mockReturnValue(false),
        getItemQuantity: vi.fn().mockReturnValue(0),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: mockAlbum,
        },
      })

      expect(wrapper.find('.price-badge').exists()).toBe(true)
    })

    it('should have lazy loading on image', () => {
      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart: vi.fn().mockReturnValue(false),
        getItemQuantity: vi.fn().mockReturnValue(0),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: mockAlbum,
        },
      })

      const img = wrapper.find('.album-image img')
      expect(img.attributes('loading')).toBe('lazy')
    })
  })

  describe('add to cart button', () => {
    it('should display "Add to Cart" when album is not in cart', () => {
      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart: vi.fn().mockReturnValue(false),
        getItemQuantity: vi.fn().mockReturnValue(0),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: mockAlbum,
        },
      })

      const addButton = wrapper.find('.btn-primary')
      expect(addButton.text()).toContain('Add to Cart')
    })

    it('should display "In Cart" when album is in cart', () => {
      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart: vi.fn().mockReturnValue(true),
        getItemQuantity: vi.fn().mockReturnValue(2),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: mockAlbum,
        },
      })

      const addButton = wrapper.find('.btn-primary')
      expect(addButton.text()).toContain('In Cart (2)')
    })

    it('should display cart icon when not in cart', () => {
      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart: vi.fn().mockReturnValue(false),
        getItemQuantity: vi.fn().mockReturnValue(0),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: mockAlbum,
        },
      })

      const icon = wrapper.find('.btn-primary .btn-icon')
      expect(icon.text()).toBe('🛒')
    })

    it('should display checkmark icon when in cart', () => {
      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart: vi.fn().mockReturnValue(true),
        getItemQuantity: vi.fn().mockReturnValue(1),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: mockAlbum,
        },
      })

      const icon = wrapper.find('.btn-primary .btn-icon')
      expect(icon.text()).toBe('✓')
    })

    it('should have "in-cart" class when album is in cart', () => {
      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart: vi.fn().mockReturnValue(true),
        getItemQuantity: vi.fn().mockReturnValue(1),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: mockAlbum,
        },
      })

      const addButton = wrapper.find('.btn-primary')
      expect(addButton.classes()).toContain('in-cart')
    })

    it('should not have "in-cart" class when album is not in cart', () => {
      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart: vi.fn().mockReturnValue(false),
        getItemQuantity: vi.fn().mockReturnValue(0),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: mockAlbum,
        },
      })

      const addButton = wrapper.find('.btn-primary')
      expect(addButton.classes()).not.toContain('in-cart')
    })

    it('should call addToCart when add to cart button is clicked', async () => {
      const addToCart = vi.fn()

      vi.mocked(useCart).mockReturnValue({
        addToCart,
        isInCart: vi.fn().mockReturnValue(false),
        getItemQuantity: vi.fn().mockReturnValue(0),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: mockAlbum,
        },
      })

      await wrapper.find('.btn-primary').trigger('click')

      expect(addToCart).toHaveBeenCalledWith(mockAlbum)
      expect(addToCart).toHaveBeenCalledTimes(1)
    })

    it('should allow adding to cart multiple times', async () => {
      const addToCart = vi.fn()

      vi.mocked(useCart).mockReturnValue({
        addToCart,
        isInCart: vi.fn().mockReturnValue(false),
        getItemQuantity: vi.fn().mockReturnValue(0),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: mockAlbum,
        },
      })

      const button = wrapper.find('.btn-primary')
      await button.trigger('click')
      await button.trigger('click')
      await button.trigger('click')

      expect(addToCart).toHaveBeenCalledTimes(3)
      expect(addToCart).toHaveBeenCalledWith(mockAlbum)
    })

    it('should call addToCart even when album is already in cart', async () => {
      const addToCart = vi.fn()

      vi.mocked(useCart).mockReturnValue({
        addToCart,
        isInCart: vi.fn().mockReturnValue(true),
        getItemQuantity: vi.fn().mockReturnValue(2),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: mockAlbum,
        },
      })

      await wrapper.find('.btn-primary').trigger('click')

      expect(addToCart).toHaveBeenCalledWith(mockAlbum)
    })
  })

  describe('preview button', () => {
    it('should display preview button', () => {
      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart: vi.fn().mockReturnValue(false),
        getItemQuantity: vi.fn().mockReturnValue(0),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: mockAlbum,
        },
      })

      const previewBtn = wrapper.find('.btn-secondary')
      expect(previewBtn.exists()).toBe(true)
      expect(previewBtn.text()).toContain('Preview')
    })

    it('should display play icon on preview button', () => {
      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart: vi.fn().mockReturnValue(false),
        getItemQuantity: vi.fn().mockReturnValue(0),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: mockAlbum,
        },
      })

      const icon = wrapper.find('.btn-secondary .btn-icon')
      expect(icon.text()).toBe('▶')
    })
  })

  describe('play overlay', () => {
    it('should render play overlay', () => {
      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart: vi.fn().mockReturnValue(false),
        getItemQuantity: vi.fn().mockReturnValue(0),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: mockAlbum,
        },
      })

      expect(wrapper.find('.play-overlay').exists()).toBe(true)
    })

    it('should render play button in overlay', () => {
      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart: vi.fn().mockReturnValue(false),
        getItemQuantity: vi.fn().mockReturnValue(0),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: mockAlbum,
        },
      })

      expect(wrapper.find('.play-button').exists()).toBe(true)
    })
  })

  describe('image error handling', () => {
    it('should handle image load error', async () => {
      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart: vi.fn().mockReturnValue(false),
        getItemQuantity: vi.fn().mockReturnValue(0),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: mockAlbum,
        },
      })

      const img = wrapper.find('.album-image img')
      await img.trigger('error')

      expect(img.element.getAttribute('src')).toBe(
        'https://via.placeholder.com/300x300/667eea/white?text=Album+Cover'
      )
    })

    it('should set placeholder image on error', async () => {
      const albumWithBadImage: Album = {
        ...mockAlbum,
        image_url: 'https://example.com/broken-image.jpg',
      }

      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart: vi.fn().mockReturnValue(false),
        getItemQuantity: vi.fn().mockReturnValue(0),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: albumWithBadImage,
        },
      })

      const img = wrapper.find('.album-image img')
      expect(img.attributes('src')).toBe(albumWithBadImage.image_url)

      await img.trigger('error')

      expect(img.element.getAttribute('src')).toBe(
        'https://via.placeholder.com/300x300/667eea/white?text=Album+Cover'
      )
    })
  })

  describe('integration with useCart', () => {
    it('should call isInCart with correct album ID', () => {
      const isInCart = vi.fn().mockReturnValue(false)

      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart,
        getItemQuantity: vi.fn().mockReturnValue(0),
      } as any)

      mount(AlbumCard, {
        props: {
          album: mockAlbum,
        },
      })

      expect(isInCart).toHaveBeenCalledWith(mockAlbum.id)
    })

    it('should call getItemQuantity with correct album ID', () => {
      const getItemQuantity = vi.fn().mockReturnValue(2)
      const isInCart = vi.fn().mockReturnValue(true) // Must return true for getItemQuantity to be called

      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart,
        getItemQuantity,
      } as any)

      mount(AlbumCard, {
        props: {
          album: mockAlbum,
        },
      })

      // Both isInCart and getItemQuantity are called during render when item is in cart
      expect(isInCart).toHaveBeenCalledWith(mockAlbum.id)
      expect(getItemQuantity).toHaveBeenCalledWith(mockAlbum.id)
    })
  })

  describe('edge cases', () => {
    it('should handle album with zero price', () => {
      const freeAlbum: Album = {
        ...mockAlbum,
        price: 0,
      }

      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart: vi.fn().mockReturnValue(false),
        getItemQuantity: vi.fn().mockReturnValue(0),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: freeAlbum,
        },
      })

      expect(wrapper.find('.price').text()).toBe('$0.00')
    })

    it('should handle album with large price', () => {
      const expensiveAlbum: Album = {
        ...mockAlbum,
        price: 999.99,
      }

      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart: vi.fn().mockReturnValue(false),
        getItemQuantity: vi.fn().mockReturnValue(0),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: expensiveAlbum,
        },
      })

      expect(wrapper.find('.price').text()).toBe('$999.99')
    })

    it('should handle album with long title', () => {
      const longTitleAlbum: Album = {
        ...mockAlbum,
        title: 'This Is An Extremely Long Album Title That Should Be Displayed Correctly',
      }

      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart: vi.fn().mockReturnValue(false),
        getItemQuantity: vi.fn().mockReturnValue(0),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: longTitleAlbum,
        },
      })

      expect(wrapper.find('.album-title').text()).toBe(longTitleAlbum.title)
    })

    it('should handle album with long artist name', () => {
      const longArtistAlbum: Album = {
        ...mockAlbum,
        artist: 'The Very Long And Complicated Artist Name Band',
      }

      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart: vi.fn().mockReturnValue(false),
        getItemQuantity: vi.fn().mockReturnValue(0),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: longArtistAlbum,
        },
      })

      expect(wrapper.find('.album-artist').text()).toBe(longArtistAlbum.artist)
    })

    it('should handle high quantity in cart', () => {
      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart: vi.fn().mockReturnValue(true),
        getItemQuantity: vi.fn().mockReturnValue(99),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: mockAlbum,
        },
      })

      expect(wrapper.find('.btn-primary').text()).toContain('In Cart (99)')
    })

    it('should render correctly with different album data', () => {
      const differentAlbum: Album = {
        id: 42,
        title: 'The Wall',
        artist: 'Pink Floyd',
        price: 29.99,
        image_url: 'https://example.com/the-wall.jpg',
      }

      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart: vi.fn().mockReturnValue(false),
        getItemQuantity: vi.fn().mockReturnValue(0),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: differentAlbum,
        },
      })

      expect(wrapper.find('.album-title').text()).toBe(differentAlbum.title)
      expect(wrapper.find('.album-artist').text()).toBe(differentAlbum.artist)
      expect(wrapper.find('.price').text()).toBe('$29.99')
      expect(wrapper.find('.album-image img').attributes('src')).toBe(differentAlbum.image_url)
    })
  })

  describe('CSS classes', () => {
    it('should have correct CSS classes for structure', () => {
      vi.mocked(useCart).mockReturnValue({
        addToCart: vi.fn(),
        isInCart: vi.fn().mockReturnValue(false),
        getItemQuantity: vi.fn().mockReturnValue(0),
      } as any)

      const wrapper = mount(AlbumCard, {
        props: {
          album: mockAlbum,
        },
      })

      expect(wrapper.find('.album-card').exists()).toBe(true)
      expect(wrapper.find('.album-image').exists()).toBe(true)
      expect(wrapper.find('.album-info').exists()).toBe(true)
      expect(wrapper.find('.album-actions').exists()).toBe(true)
    })
  })
})
