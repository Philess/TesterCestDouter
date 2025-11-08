import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import CartIcon from '../CartIcon.vue'
import { useCart } from '../../composables/useCart'

// Mock the useCart composable
vi.mock('../../composables/useCart', () => ({
  useCart: vi.fn(),
}))

describe('CartIcon.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render the cart icon', () => {
      vi.mocked(useCart).mockReturnValue({
        itemCount: ref(0),
        formattedTotal: ref('0.00'),
      } as any)

      const wrapper = mount(CartIcon)

      const svg = wrapper.find('svg')
      expect(svg.exists()).toBe(true)
      expect(wrapper.find('.cart-icon').exists()).toBe(true)
    })

    it('should have accessible aria-label', () => {
      vi.mocked(useCart).mockReturnValue({
        itemCount: ref(0),
        formattedTotal: ref('0.00'),
      } as any)

      const wrapper = mount(CartIcon)

      const button = wrapper.find('button')
      expect(button.attributes('aria-label')).toBe('Shopping cart')
    })
  })

  describe('item count badge', () => {
    it('should not display badge when cart is empty', () => {
      vi.mocked(useCart).mockReturnValue({
        itemCount: ref(0),
        formattedTotal: ref('0.00'),
      } as any)

      const wrapper = mount(CartIcon)

      expect(wrapper.find('.cart-badge').exists()).toBe(false)
    })

    it('should display badge with item count when cart has items', () => {
      vi.mocked(useCart).mockReturnValue({
        itemCount: ref(3),
        formattedTotal: ref('59.97'),
      } as any)

      const wrapper = mount(CartIcon)

      const badge = wrapper.find('.cart-badge')
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe('3')
    })

    it('should update badge when item count changes', async () => {
      const itemCount = ref(1)
      vi.mocked(useCart).mockReturnValue({
        itemCount,
        formattedTotal: ref('19.99'),
      } as any)

      const wrapper = mount(CartIcon)

      expect(wrapper.find('.cart-badge').text()).toBe('1')

      // Simulate item count change
      itemCount.value = 5
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.cart-badge').text()).toBe('5')
    })

    it('should display correct count for large numbers', () => {
      vi.mocked(useCart).mockReturnValue({
        itemCount: ref(99),
        formattedTotal: ref('1999.99'),
      } as any)

      const wrapper = mount(CartIcon)

      const badge = wrapper.find('.cart-badge')
      expect(badge.text()).toBe('99')
    })
  })

  describe('cart total display', () => {
    it('should not display total when cart is empty', () => {
      vi.mocked(useCart).mockReturnValue({
        itemCount: ref(0),
        formattedTotal: ref('0.00'),
      } as any)

      const wrapper = mount(CartIcon)

      expect(wrapper.find('.cart-total').exists()).toBe(false)
    })

    it('should display formatted total when cart has items', () => {
      vi.mocked(useCart).mockReturnValue({
        itemCount: ref(2),
        formattedTotal: ref('44.98'),
      } as any)

      const wrapper = mount(CartIcon)

      const total = wrapper.find('.cart-total')
      expect(total.exists()).toBe(true)
      expect(total.text()).toBe('$44.98')
    })

    it('should update total when cart changes', async () => {
      const formattedTotal = ref('19.99')
      const itemCount = ref(1)

      vi.mocked(useCart).mockReturnValue({
        itemCount,
        formattedTotal,
      } as any)

      const wrapper = mount(CartIcon)

      expect(wrapper.find('.cart-total').text()).toBe('$19.99')

      // Simulate cart total change
      formattedTotal.value = '39.98'
      itemCount.value = 2
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.cart-total').text()).toBe('$39.98')
    })

    it('should display large totals correctly', () => {
      vi.mocked(useCart).mockReturnValue({
        itemCount: ref(50),
        formattedTotal: ref('1234.56'),
      } as any)

      const wrapper = mount(CartIcon)

      expect(wrapper.find('.cart-total').text()).toBe('$1234.56')
    })
  })

  describe('toggle event', () => {
    it('should emit toggle event when clicked', async () => {
      vi.mocked(useCart).mockReturnValue({
        itemCount: ref(0),
        formattedTotal: ref('0.00'),
      } as any)

      const wrapper = mount(CartIcon)

      await wrapper.find('button').trigger('click')

      expect(wrapper.emitted('toggle')).toBeTruthy()
      expect(wrapper.emitted('toggle')).toHaveLength(1)
    })

    it('should emit toggle event multiple times', async () => {
      vi.mocked(useCart).mockReturnValue({
        itemCount: ref(3),
        formattedTotal: ref('59.97'),
      } as any)

      const wrapper = mount(CartIcon)

      const button = wrapper.find('button')

      await button.trigger('click')
      await button.trigger('click')
      await button.trigger('click')

      expect(wrapper.emitted('toggle')).toHaveLength(3)
    })

    it('should emit toggle event regardless of cart state', async () => {
      // Test with empty cart
      vi.mocked(useCart).mockReturnValue({
        itemCount: ref(0),
        formattedTotal: ref('0.00'),
      } as any)

      let wrapper = mount(CartIcon)
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted('toggle')).toBeTruthy()

      // Test with items in cart
      vi.mocked(useCart).mockReturnValue({
        itemCount: ref(5),
        formattedTotal: ref('99.95'),
      } as any)

      wrapper = mount(CartIcon)
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted('toggle')).toBeTruthy()
    })
  })

  describe('styling and CSS classes', () => {
    it('should have correct CSS classes', () => {
      vi.mocked(useCart).mockReturnValue({
        itemCount: ref(1),
        formattedTotal: ref('19.99'),
      } as any)

      const wrapper = mount(CartIcon)

      expect(wrapper.find('.cart-icon-button').exists()).toBe(true)
      expect(wrapper.find('.cart-icon').exists()).toBe(true)
      expect(wrapper.find('.cart-badge').exists()).toBe(true)
      expect(wrapper.find('.cart-total').exists()).toBe(true)
    })

    it('should render as a button element', () => {
      vi.mocked(useCart).mockReturnValue({
        itemCount: ref(0),
        formattedTotal: ref('0.00'),
      } as any)

      const wrapper = mount(CartIcon)

      expect(wrapper.element.tagName).toBe('BUTTON')
    })
  })

  describe('integration with useCart', () => {
    it('should use values from useCart composable', () => {
      const mockCart = {
        itemCount: ref(7),
        formattedTotal: ref('139.93'),
      }

      vi.mocked(useCart).mockReturnValue(mockCart as any)

      const wrapper = mount(CartIcon)

      expect(wrapper.find('.cart-badge').text()).toBe('7')
      expect(wrapper.find('.cart-total').text()).toBe('$139.93')
    })
  })

  describe('edge cases', () => {
    it('should handle zero item count correctly', () => {
      vi.mocked(useCart).mockReturnValue({
        itemCount: ref(0),
        formattedTotal: ref('0.00'),
      } as any)

      const wrapper = mount(CartIcon)

      expect(wrapper.find('.cart-badge').exists()).toBe(false)
      expect(wrapper.find('.cart-total').exists()).toBe(false)
    })

    it('should handle transition from empty to non-empty cart', async () => {
      const itemCount = ref(0)
      const formattedTotal = ref('0.00')

      vi.mocked(useCart).mockReturnValue({
        itemCount,
        formattedTotal,
      } as any)

      const wrapper = mount(CartIcon)

      expect(wrapper.find('.cart-badge').exists()).toBe(false)
      expect(wrapper.find('.cart-total').exists()).toBe(false)

      // Add item to cart
      itemCount.value = 1
      formattedTotal.value = '19.99'
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.cart-badge').exists()).toBe(true)
      expect(wrapper.find('.cart-total').exists()).toBe(true)
    })

    it('should handle transition from non-empty to empty cart', async () => {
      const itemCount = ref(1)
      const formattedTotal = ref('19.99')

      vi.mocked(useCart).mockReturnValue({
        itemCount,
        formattedTotal,
      } as any)

      const wrapper = mount(CartIcon)

      expect(wrapper.find('.cart-badge').exists()).toBe(true)
      expect(wrapper.find('.cart-total').exists()).toBe(true)

      // Clear cart
      itemCount.value = 0
      formattedTotal.value = '0.00'
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.cart-badge').exists()).toBe(false)
      expect(wrapper.find('.cart-total').exists()).toBe(false)
    })
  })
})
