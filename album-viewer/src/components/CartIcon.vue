<template>
  <button class="cart-icon-button" @click="$emit('toggle')" aria-label="Shopping cart">
    <div class="cart-icon">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      <span v-if="itemCount > 0" class="cart-badge">{{ itemCount }}</span>
    </div>
    <span class="cart-total" v-if="itemCount > 0">${{ formattedTotal }}</span>
  </button>
</template>

<script setup lang="ts">
import { useCart } from '../composables/useCart'

defineEmits<{
  toggle: []
}>()

const { itemCount, formattedTotal } = useCart()
</script>

<style scoped>
.cart-icon-button {
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  color: var(--text-primary);
}

.cart-icon-button:hover {
  background: var(--card-bg);
  border-color: var(--primary-blue);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(49, 89, 129, 0.2);
}

.cart-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.cart-icon svg {
  width: 24px;
  height: 24px;
  color: var(--text-primary);
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--primary-red);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  animation: pop 0.3s ease;
}

@keyframes pop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.cart-total {
  font-size: 1rem;
  font-weight: 600;
  color: var(--primary-blue);
}

@media (max-width: 768px) {
  .cart-icon-button {
    padding: 0.5rem 1rem;
  }

  .cart-total {
    font-size: 0.875rem;
  }
}
</style>
