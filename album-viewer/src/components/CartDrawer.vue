<template>
  <div class="cart-drawer-overlay" :class="{ open: isOpen }" @click="$emit('close')">
    <div class="cart-drawer" :class="{ open: isOpen }" @click.stop>
      <div class="cart-header">
        <h2>Shopping Cart</h2>
        <button class="close-button" @click="$emit('close')" aria-label="Close cart">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="cart-content">
        <div v-if="cartItems.length === 0" class="empty-cart">
          <div class="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some albums to get started!</p>
        </div>

        <div v-else class="cart-items">
          <div 
            v-for="item in cartItems" 
            :key="item.album.id" 
            class="cart-item"
          >
            <img 
              :src="item.album.image_url" 
              :alt="item.album.title"
              class="item-image"
              @error="handleImageError"
            />
            <div class="item-details">
              <h4 class="item-title">{{ item.album.title }}</h4>
              <p class="item-artist">{{ item.album.artist }}</p>
              <p class="item-price">${{ item.album.price.toFixed(2) }}</p>
            </div>
            <div class="item-actions">
              <div class="quantity-controls">
                <button 
                  @click="decreaseQuantity(item.album.id)"
                  class="quantity-btn"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span class="quantity">{{ item.quantity }}</span>
                <button 
                  @click="addToCart(item.album)"
                  class="quantity-btn"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button 
                @click="removeFromCart(item.album.id)"
                class="remove-btn"
                aria-label="Remove from cart"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="cartItems.length > 0" class="cart-footer">
        <div class="cart-summary">
          <div class="summary-row">
            <span>Items:</span>
            <span>{{ itemCount }}</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span class="total-amount">${{ formattedTotal }}</span>
          </div>
        </div>
        <div class="cart-actions">
          <button @click="clearCart" class="clear-btn">Clear Cart</button>
          <button class="checkout-btn">
            Checkout
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCart } from '../composables/useCart'

interface Props {
  isOpen: boolean
}

defineProps<Props>()

defineEmits<{
  close: []
}>()

const { 
  cartItems, 
  itemCount, 
  formattedTotal, 
  addToCart, 
  removeFromCart, 
  decreaseQuantity,
  clearCart 
} = useCart()

const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/80x80/667eea/white?text=Album'
}
</script>

<style scoped>
.cart-drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.cart-drawer-overlay.open {
  opacity: 1;
  visibility: visible;
}

.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 450px;
  background: var(--card-bg);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  z-index: 1001;
}

.cart-drawer.open {
  transform: translateX(0);
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.cart-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.close-button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--text-secondary);
  transition: all 0.3s ease;
  border-radius: 4px;
}

.close-button:hover {
  background: rgba(220, 38, 38, 0.1);
  color: var(--primary-red);
}

.close-button svg {
  width: 24px;
  height: 24px;
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-cart h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.empty-cart p {
  margin: 0;
  color: var(--text-secondary);
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--light-bg);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-title {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-artist {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-price {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--primary-blue);
}

.item-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.25rem;
}

.quantity-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: var(--text-primary);
  transition: all 0.2s ease;
  border-radius: 2px;
}

.quantity-btn:hover {
  background: var(--primary-blue);
  color: white;
}

.quantity {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
  color: var(--text-primary);
}

.remove-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  cursor: pointer;
  padding: 0.5rem;
  color: var(--text-secondary);
  transition: all 0.3s ease;
  border-radius: 4px;
}

.remove-btn:hover {
  background: rgba(220, 38, 38, 0.1);
  border-color: var(--primary-red);
  color: var(--primary-red);
}

.remove-btn svg {
  width: 18px;
  height: 18px;
}

.cart-footer {
  border-top: 2px solid var(--border-color);
  padding: 1.5rem;
  background: var(--light-bg);
}

.cart-summary {
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.summary-row.total {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--text-primary);
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.total-amount {
  color: var(--primary-blue);
}

.cart-actions {
  display: flex;
  gap: 0.75rem;
}

.clear-btn {
  flex: 1;
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 0.875rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.clear-btn:hover {
  background: rgba(220, 38, 38, 0.1);
  border-color: var(--primary-red);
  color: var(--primary-red);
}

.checkout-btn {
  flex: 2;
  background: var(--primary-blue);
  border: none;
  color: white;
  padding: 0.875rem 1.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.checkout-btn:hover {
  background: #274a6b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(49, 89, 129, 0.4);
}

.checkout-btn svg {
  width: 18px;
  height: 18px;
}

@media (max-width: 768px) {
  .cart-drawer {
    max-width: 100%;
  }

  .cart-item {
    flex-direction: column;
  }

  .item-actions {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
}
</style>
