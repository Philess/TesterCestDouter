<template>
  <div class="album-card">
    <div class="album-image">
      <img 
        :src="album.image_url" 
        :alt="album.title"
        @error="handleImageError"
        loading="lazy"
      />
      <div class="play-overlay">
        <div class="play-button">▶</div>
      </div>
      <div class="price-badge">
        <span class="price">${{ album.price.toFixed(2) }}</span>
      </div>
    </div>
    
    <div class="album-info">
      <h3 class="album-title">{{ album.title }}</h3>
      <p class="album-artist">{{ album.artist }}</p>
    </div>
    
    <div class="album-actions">
      <button class="btn btn-primary">
        <span class="btn-icon">🛒</span>
        Add to Cart
      </button>
      <button class="btn btn-secondary">
        <span class="btn-icon">▶</span>
        Preview
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Album } from '../types/album'

interface Props {
  album: Album
}

defineProps<Props>()

const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/300x300/667eea/white?text=Album+Cover'
}
</script>

<style scoped>
.album-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.album-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary-red), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.album-card:hover {
  transform: translateY(-8px);
  border-color: var(--primary-red);
  box-shadow: 0 12px 40px rgba(220, 38, 38, 0.2);
}

.album-card:hover::before {
  opacity: 1;
}

.album-image {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1;
  background: #d8d0bf;
}

.album-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.4s ease;
}

.album-card:hover .album-image img {
  transform: scale(1.08);
  filter: brightness(0.85);
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(4px);
}

.album-card:hover .play-overlay {
  opacity: 1;
}

.play-button {
  width: 70px;
  height: 70px;
  background: var(--primary-red);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  padding-left: 4px;
}

.play-button:hover {
  transform: scale(1.15);
  box-shadow: 0 0 20px rgba(220, 38, 38, 0.6);
}

.price-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid var(--primary-red);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.price {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--primary-red);
}

.album-info {
  padding: 1.5rem;
  flex: 1;
}

.album-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.album-artist {
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.album-actions {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  gap: 0.75rem;
}

.btn {
  flex: 1;
  padding: 0.875rem 1rem;
  border: none;
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

.btn-icon {
  font-size: 1rem;
}

.btn-primary {
  background: var(--primary-red);
  color: white;
}

.btn-primary:hover {
  background: #b91c1c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
}

.btn-secondary {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: rgba(220, 38, 38, 0.1);
  color: var(--primary-red);
  border-color: var(--primary-red);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .album-info {
    padding: 1rem;
  }
  
  .album-actions {
    padding: 0 1rem 1rem;
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }

  .price-badge {
    top: 0.75rem;
    right: 0.75rem;
    padding: 0.375rem 0.75rem;
  }

  .price {
    font-size: 1rem;
  }
}
</style>
