import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Album List page
 * Provides methods and locators for interacting with album cards and the main page
 */
export class AlbumListPage {
  readonly page: Page;
  readonly albumCards: Locator;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  readonly cartTotal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.albumCards = page.locator('.album-card');
    this.cartIcon = page.locator('.cart-icon-button');
    this.cartBadge = page.locator('.cart-badge');
    this.cartTotal = page.locator('.cart-total');
  }

  /**
   * Navigate to the album list page
   */
  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for albums to load
   */
  async waitForAlbumsToLoad() {
    await this.albumCards.first().waitFor({ timeout: 10000 });
  }

  /**
   * Get an album card by index (0-based)
   */
  getAlbumCardByIndex(index: number): Locator {
    return this.albumCards.nth(index);
  }

  /**
   * Get an album card by title
   */
  getAlbumCardByTitle(title: string): Locator {
    return this.albumCards.filter({ has: this.page.locator(`.album-title:has-text("${title}")`) });
  }

  /**
   * Get album details from a card
   */
  async getAlbumDetails(albumCard: Locator) {
    const title = await albumCard.locator('.album-title').textContent();
    const artist = await albumCard.locator('.album-artist').textContent();
    const priceText = await albumCard.locator('.price').textContent();
    const price = parseFloat(priceText?.replace('$', '') || '0');

    return {
      title: title?.trim() || '',
      artist: artist?.trim() || '',
      price,
      priceText: priceText?.trim() || ''
    };
  }

  /**
   * Add an album to cart by index
   */
  async addAlbumToCartByIndex(index: number) {
    const albumCard = this.getAlbumCardByIndex(index);
    await albumCard.locator('button.btn-primary').click();
  }

  /**
   * Add an album to cart by title
   */
  async addAlbumToCartByTitle(title: string) {
    const albumCard = this.getAlbumCardByTitle(title);
    await albumCard.locator('button.btn-primary').click();
  }

  /**
   * Check if an album is in the cart by checking the button state
   */
  async isAlbumInCart(albumCard: Locator): Promise<boolean> {
    const button = albumCard.locator('button.btn-primary');
    const text = await button.textContent();
    return text?.includes('In Cart') || false;
  }

  /**
   * Get the cart badge count
   */
  async getCartBadgeCount(): Promise<number> {
    if (await this.cartBadge.isVisible()) {
      const text = await this.cartBadge.textContent();
      return parseInt(text || '0');
    }
    return 0;
  }

  /**
   * Get the cart total from the icon
   */
  async getCartTotalFromIcon(): Promise<string> {
    if (await this.cartTotal.isVisible()) {
      return await this.cartTotal.textContent() || '$0.00';
    }
    return '$0.00';
  }

  /**
   * Open the cart drawer
   */
  async openCartDrawer() {
    await this.cartIcon.click();
  }

  /**
   * Verify cart badge count
   */
  async expectCartBadgeCount(expectedCount: number) {
    if (expectedCount === 0) {
      await expect(this.cartBadge).not.toBeVisible();
    } else {
      await expect(this.cartBadge).toBeVisible();
      await expect(this.cartBadge).toHaveText(expectedCount.toString());
    }
  }

  /**
   * Get all album titles currently displayed
   */
  async getAllAlbumTitles(): Promise<string[]> {
    const titles: string[] = [];
    const count = await this.albumCards.count();
    
    for (let i = 0; i < count; i++) {
      const title = await this.albumCards.nth(i).locator('.album-title').textContent();
      if (title) {
        titles.push(title.trim());
      }
    }
    
    return titles;
  }

  /**
   * Get number of albums displayed
   */
  async getAlbumCount(): Promise<number> {
    return await this.albumCards.count();
  }
}
