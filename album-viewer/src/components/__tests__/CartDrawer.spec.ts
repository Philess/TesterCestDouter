import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import CartDrawer from '../CartDrawer.vue'
import type { Album } from '../../types/album'
import type { CartItem } from '../../types/cart'

// Mock the useCart composable
vi.mock('../../composables/useCart', () => ({
  useCart: vi.fn(),
}))

import { useCart } from '../../composables/useCart'

describe('CartDrawer.vue', () => {
  const mockAlbum1: Album = {
    id: 1,
    title: 'Abbey Road',
    artist: 'The Beatles',
    price: 19.99,
    image_url: 'https://example.com/abbey-road.jpg',
  }

  const mockAlbum2: Album = {
    id: 2,
    title: 'Dark Side of the Moon',
    artist: 'Pink Floyd',
    price: 24.99,
    image_url: 'https://example.com/dark-side.jpg',
  }

  const mockCartItem1: CartItem = {
    album: mockAlbum1,
    quantity: 2,
    addedAt: new Date(),
  }

  const mockCartItem2: CartItem = {
    album: mockAlbum2,
    quantity: 1,
    addedAt: new Date(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render the cart drawer', () => {
      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([]),
        itemCount: ref(0),
        formattedTotal: ref('0.00'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: false,
        },
      })

      expect(wrapper.find('.cart-drawer').exists()).toBe(true)
      expect(wrapper.find('.cart-header').exists()).toBe(true)
    })

    it('should have correct title', () => {
      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([]),
        itemCount: ref(0),
        formattedTotal: ref('0.00'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: false,
        },
      })

      expect(wrapper.find('.cart-header h2').text()).toBe('Shopping Cart')
    })

    it('should have close button with aria-label', () => {
      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([]),
        itemCount: ref(0),
        formattedTotal: ref('0.00'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: false,
        },
      })

      const closeButton = wrapper.find('.close-button')
      expect(closeButton.exists()).toBe(true)
      expect(closeButton.attributes('aria-label')).toBe('Close cart')
    })
  })

  describe('open/close state', () => {
    it('should apply "open" class when isOpen is true', () => {
      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([]),
        itemCount: ref(0),
        formattedTotal: ref('0.00'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      expect(wrapper.find('.cart-drawer-overlay').classes()).toContain('open')
      expect(wrapper.find('.cart-drawer').classes()).toContain('open')
    })

    it('should not apply "open" class when isOpen is false', () => {
      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([]),
        itemCount: ref(0),
        formattedTotal: ref('0.00'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: false,
        },
      })

      expect(wrapper.find('.cart-drawer-overlay').classes()).not.toContain('open')
      expect(wrapper.find('.cart-drawer').classes()).not.toContain('open')
    })
  })

  describe('empty cart state', () => {
    it('should display empty cart message when cart is empty', () => {
      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([]),
        itemCount: ref(0),
        formattedTotal: ref('0.00'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      const emptyCart = wrapper.find('.empty-cart')
      expect(emptyCart.exists()).toBe(true)
      expect(emptyCart.find('h3').text()).toBe('Your cart is empty')
      expect(emptyCart.find('p').text()).toBe('Add some albums to get started!')
    })

    it('should display empty cart icon', () => {
      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([]),
        itemCount: ref(0),
        formattedTotal: ref('0.00'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      expect(wrapper.find('.empty-icon').text()).toBe('🛒')
    })

    it('should not display cart footer when cart is empty', () => {
      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([]),
        itemCount: ref(0),
        formattedTotal: ref('0.00'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      expect(wrapper.find('.cart-footer').exists()).toBe(false)
    })
  })

  describe('cart items rendering', () => {
    it('should render cart items when cart has items', () => {
      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([mockCartItem1, mockCartItem2]),
        itemCount: ref(3),
        formattedTotal: ref('64.97'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      const items = wrapper.findAll('.cart-item')
      expect(items).toHaveLength(2)
    })

    it('should display album image', () => {
      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([mockCartItem1]),
        itemCount: ref(2),
        formattedTotal: ref('39.98'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      const img = wrapper.find('.item-image')
      expect(img.exists()).toBe(true)
      expect(img.attributes('src')).toBe(mockAlbum1.image_url)
      expect(img.attributes('alt')).toBe(mockAlbum1.title)
    })

    it('should display album details', () => {
      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([mockCartItem1]),
        itemCount: ref(2),
        formattedTotal: ref('39.98'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      expect(wrapper.find('.item-title').text()).toBe(mockAlbum1.title)
      expect(wrapper.find('.item-artist').text()).toBe(mockAlbum1.artist)
      expect(wrapper.find('.item-price').text()).toBe(`$${mockAlbum1.price.toFixed(2)}`)
    })

    it('should display quantity for each item', () => {
      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([mockCartItem1]),
        itemCount: ref(2),
        formattedTotal: ref('39.98'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      expect(wrapper.find('.quantity').text()).toBe('2')
    })

    it('should handle image load error', () => {
      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([mockCartItem1]),
        itemCount: ref(2),
        formattedTotal: ref('39.98'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      const img = wrapper.find('.item-image')
      img.trigger('error')

      expect(img.element.getAttribute('src')).toBe(
        'https://via.placeholder.com/80x80/667eea/white?text=Album'
      )
    })
  })

  describe('quantity controls', () => {
    it('should render increase and decrease buttons', () => {
      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([mockCartItem1]),
        itemCount: ref(2),
        formattedTotal: ref('39.98'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      const quantityBtns = wrapper.findAll('.quantity-btn')
      expect(quantityBtns).toHaveLength(2)
      expect(quantityBtns[0].attributes('aria-label')).toBe('Decrease quantity')
      expect(quantityBtns[1].attributes('aria-label')).toBe('Increase quantity')
    })

    it('should call decreaseQuantity when decrease button is clicked', async () => {
      const decreaseQuantity = vi.fn()

      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([mockCartItem1]),
        itemCount: ref(2),
        formattedTotal: ref('39.98'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity,
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      const decreaseBtn = wrapper.findAll('.quantity-btn')[0]
      await decreaseBtn.trigger('click')

      expect(decreaseQuantity).toHaveBeenCalledWith(mockAlbum1.id)
    })

    it('should call addToCart when increase button is clicked', async () => {
      const addToCart = vi.fn()

      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([mockCartItem1]),
        itemCount: ref(2),
        formattedTotal: ref('39.98'),
        addToCart,
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      const increaseBtn = wrapper.findAll('.quantity-btn')[1]
      await increaseBtn.trigger('click')

      expect(addToCart).toHaveBeenCalledWith(mockAlbum1)
    })
  })

  describe('remove button functionality', () => {
    it('should render remove button for each item', () => {
      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([mockCartItem1]),
        itemCount: ref(2),
        formattedTotal: ref('39.98'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      const removeBtn = wrapper.find('.remove-btn')
      expect(removeBtn.exists()).toBe(true)
      expect(removeBtn.attributes('aria-label')).toBe('Remove from cart')
    })

    it('should call removeFromCart when remove button is clicked', async () => {
      const removeFromCart = vi.fn()

      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([mockCartItem1]),
        itemCount: ref(2),
        formattedTotal: ref('39.98'),
        addToCart: vi.fn(),
        removeFromCart,
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      await wrapper.find('.remove-btn').trigger('click')

      expect(removeFromCart).toHaveBeenCalledWith(mockAlbum1.id)
    })

    it('should call removeFromCart with correct album ID for multiple items', async () => {
      const removeFromCart = vi.fn()

      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([mockCartItem1, mockCartItem2]),
        itemCount: ref(3),
        formattedTotal: ref('64.97'),
        addToCart: vi.fn(),
        removeFromCart,
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      const removeBtns = wrapper.findAll('.remove-btn')
      await removeBtns[1].trigger('click')

      expect(removeFromCart).toHaveBeenCalledWith(mockAlbum2.id)
    })
  })

  describe('cart summary', () => {
    it('should display cart summary when cart has items', () => {
      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([mockCartItem1]),
        itemCount: ref(2),
        formattedTotal: ref('39.98'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      expect(wrapper.find('.cart-summary').exists()).toBe(true)
    })

    it('should display item count in summary', () => {
      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([mockCartItem1, mockCartItem2]),
        itemCount: ref(3),
        formattedTotal: ref('64.97'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      const summaryRows = wrapper.findAll('.summary-row')
      expect(summaryRows[0].text()).toContain('Items:')
      expect(summaryRows[0].text()).toContain('3')
    })

    it('should display total in summary', () => {
      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([mockCartItem1]),
        itemCount: ref(2),
        formattedTotal: ref('39.98'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      const totalRow = wrapper.find('.summary-row.total')
      expect(totalRow.text()).toContain('Total:')
      expect(totalRow.find('.total-amount').text()).toBe('$39.98')
    })
  })

  describe('cart actions', () => {
    it('should display clear cart button when cart has items', () => {
      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([mockCartItem1]),
        itemCount: ref(2),
        formattedTotal: ref('39.98'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      const clearBtn = wrapper.find('.clear-btn')
      expect(clearBtn.exists()).toBe(true)
      expect(clearBtn.text()).toBe('Clear Cart')
    })

    it('should call clearCart when clear button is clicked', async () => {
      const clearCart = vi.fn()

      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([mockCartItem1]),
        itemCount: ref(2),
        formattedTotal: ref('39.98'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart,
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      await wrapper.find('.clear-btn').trigger('click')

      expect(clearCart).toHaveBeenCalled()
    })

    it('should display checkout button when cart has items', () => {
      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([mockCartItem1]),
        itemCount: ref(2),
        formattedTotal: ref('39.98'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      const checkoutBtn = wrapper.find('.checkout-btn')
      expect(checkoutBtn.exists()).toBe(true)
      expect(checkoutBtn.text()).toContain('Checkout')
    })
  })

  describe('close event', () => {
    it('should emit close event when close button is clicked', async () => {
      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([]),
        itemCount: ref(0),
        formattedTotal: ref('0.00'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      await wrapper.find('.close-button').trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('should emit close event when overlay is clicked', async () => {
      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([]),
        itemCount: ref(0),
        formattedTotal: ref('0.00'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      await wrapper.find('.cart-drawer-overlay').trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should not emit close event when drawer content is clicked', async () => {
      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([]),
        itemCount: ref(0),
        formattedTotal: ref('0.00'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      await wrapper.find('.cart-drawer').trigger('click')

      expect(wrapper.emitted('close')).toBeFalsy()
    })
  })

  describe('edge cases', () => {
    it('should handle cart with single item at quantity 1', () => {
      const singleItem: CartItem = {
        album: mockAlbum1,
        quantity: 1,
        addedAt: new Date(),
      }

      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([singleItem]),
        itemCount: ref(1),
        formattedTotal: ref('19.99'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      expect(wrapper.findAll('.cart-item')).toHaveLength(1)
      expect(wrapper.find('.quantity').text()).toBe('1')
    })

    it('should handle large quantities', () => {
      const largeQuantityItem: CartItem = {
        album: mockAlbum1,
        quantity: 99,
        addedAt: new Date(),
      }

      vi.mocked(useCart).mockReturnValue({
        cartItems: ref([largeQuantityItem]),
        itemCount: ref(99),
        formattedTotal: ref('1979.01'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      expect(wrapper.find('.quantity').text()).toBe('99')
    })

    it('should handle many different items', () => {
      const manyItems: CartItem[] = Array.from({ length: 10 }, (_, i) => ({
        album: {
          id: i + 1,
          title: `Album ${i + 1}`,
          artist: `Artist ${i + 1}`,
          price: 19.99,
          image_url: `https://example.com/album-${i + 1}.jpg`,
        },
        quantity: 1,
        addedAt: new Date(),
      }))

      vi.mocked(useCart).mockReturnValue({
        cartItems: ref(manyItems),
        itemCount: ref(10),
        formattedTotal: ref('199.90'),
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        decreaseQuantity: vi.fn(),
        clearCart: vi.fn(),
      } as any)

      const wrapper = mount(CartDrawer, {
        props: {
          isOpen: true,
        },
      })

      expect(wrapper.findAll('.cart-item')).toHaveLength(10)
    })
  })
})
