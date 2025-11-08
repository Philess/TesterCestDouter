<template>
  <div class="app">
    <header class="header">
      <div class="hero-content">
        <div class="japanese-text">音楽</div>
        <h1 class="main-title">ALBUM COLLECTION</h1>
        <p class="subtitle">Discover amazing music. Master your taste. Bushidō style.</p>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">{{ albums.length }}+</span>
            <span class="stat-label">Albums</span>
          </div>
          <div class="stat-divider">|</div>
          <div class="stat-item">
            <span class="stat-number">Premium</span>
            <span class="stat-label">Quality</span>
          </div>
          <div class="stat-divider">|</div>
          <div class="stat-item">
            <span class="stat-number">Music</span>
            <span class="stat-label">Collection</span>
          </div>
        </div>
      </div>
    </header>

    <main class="main">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading albums...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="fetchAlbums" class="retry-btn">Try Again</button>
      </div>

      <div v-else class="content-section">
        <div class="section-header">
          <h2>Featured Albums</h2>
          <p>Explore our curated music collection</p>
        </div>
        <div class="albums-grid">
          <AlbumCard 
            v-for="album in albums" 
            :key="album.id" 
            :album="album" 
          />
        </div>
      </div>
    </main>

    <footer class="footer">
      <div class="footer-content">
        <p class="motto">LISTEN WITH HONOR, DISCOVER WITH COURAGE.</p>
        <p class="copyright">© 2025 Album Collection. All rights reserved. | 音楽</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import AlbumCard from './components/AlbumCard.vue'
import type { Album } from './types/album'

const albums = ref<Album[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

const fetchAlbums = async (): Promise<void> => {
  try {
    loading.value = true
    error.value = null
    const response = await axios.get<Album[]>('/albums')
    albums.value = response.data
  } catch (err) {
    error.value = 'Failed to load albums. Please make sure the API is running.'
    console.error('Error fetching albums:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAlbums()
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--light-bg);
}

.header {
  background: linear-gradient(180deg, #e2dccf 0%, #d8d0bf 100%);
  padding: 4rem 2rem 6rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary-red), transparent);
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.japanese-text {
  font-size: 4rem;
  font-weight: bold;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--primary-red), #ef4444);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.main-title {
  font-size: 4rem;
  font-weight: 900;
  letter-spacing: 0.05em;
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle {
  font-size: 1.3rem;
  color: var(--text-secondary);
  margin: 0 0 3rem 0;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-red);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.stat-divider {
  color: var(--border-color);
  font-size: 1.5rem;
}

.main {
  flex: 1;
  padding: 3rem 2rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.content-section {
  margin-top: 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.section-header p {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  color: var(--text-primary);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(220, 38, 38, 0.2);
  border-top: 4px solid var(--primary-red);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 6rem 2rem;
  color: var(--text-primary);
}

.error p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: var(--text-secondary);
}

.retry-btn {
  background: transparent;
  color: var(--primary-red);
  border: 2px solid var(--primary-red);
  padding: 0.875rem 2.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.retry-btn:hover {
  background: var(--primary-red);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
}

.albums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  padding: 1rem 0;
}

.footer {
  background: #d8d0bf;
  border-top: 1px solid var(--border-color);
  padding: 2rem;
  margin-top: 4rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.motto {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
  letter-spacing: 0.1em;
}

.copyright {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

@media (max-width: 768px) {
  .header {
    padding: 3rem 1rem 4rem;
  }

  .japanese-text {
    font-size: 2.5rem;
  }
  
  .main-title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .hero-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .stat-divider {
    display: none;
  }

  .section-header h2 {
    font-size: 1.75rem;
  }
  
  .albums-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .main {
    padding: 2rem 1rem;
  }
}
</style>
