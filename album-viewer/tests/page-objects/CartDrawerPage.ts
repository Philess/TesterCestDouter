import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Cart Drawer component
 * Provides methods and locators for interacting with the shopping cart drawer
 */
export class CartDrawerPage {
  readonly page: Page;
  readonly drawer: Locator;
  readonly drawerOverlay: Locator;
  readonly closeButton: Locator;
  readonly cartItems: Locator;
  readonly emptyCartMessage: Locator;
  readonly totalAmount: Locator;
  readonly itemCountSummary: Locator;
  readonly checkoutButton: Locator;
  readonly clearCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.drawer = page.locator('.cart-drawer');
    this.drawerOverlay = page.locator('.cart-drawer-overlay');
    this.closeButton = page.locator('.close-button');
    this.cartItems = page.locator('.cart-item');
    this.emptyCartMessage = page.locator('.empty-cart');
    this.totalAmount = page.locator('.total-amount');
    this.itemCountSummary = page.locator('.summary-row').filter({ hasText: 'Items:' }).locator('span').last();
    this.checkoutButton = page.locator('.checkout-btn');
    this.clearCartButton = page.locator('.clear-btn');
  }

  /**
   * Wait for the cart drawer to be visible
   */
  async waitForDrawerToOpen() {
    await expect(this.drawer.locator('.cart-drawer.open, &.open')).toBeVisible({ timeout: 5000 });
  }

  /**
   * Check if the drawer is open
   */
  async isOpen(): Promise<boolean> {
    return await this.drawer.evaluate((el) => el.classList.contains('open'));
  }

  /**
   * Close the cart drawer
   */
  async close() {
    await this.closeButton.click();
  }

  /**
   * Get the number of items in the cart
   */
  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  /**
   * Get cart item by index
   */
  getCartItemByIndex(index: number): Locator {
    return this.cartItems.nth(index);
  }

  /**
   * Get cart item by album title
   */
  getCartItemByTitle(title: string): Locator {
    return this.cartItems.filter({ has: this.page.locator(`.item-title:has-text("${title}")`) });
  }

  /**
   * Get details of a cart item
   */
  async getCartItemDetails(cartItem: Locator) {
    const title = await cartItem.locator('.item-title').textContent();
    const artist = await cartItem.locator('.item-artist').textContent();
    const priceText = await cartItem.locator('.item-price').textContent();
    const quantity = await cartItem.locator('.quantity').textContent();

    return {
      title: title?.trim() || '',
      artist: artist?.trim() || '',
      priceText: priceText?.trim() || '',
      price: parseFloat(priceText?.replace('$', '') || '0'),
      quantity: parseInt(quantity?.trim() || '1')
    };
  }

  /**
   * Remove an item from the cart by index
   */
  async removeItemByIndex(index: number) {
    const item = this.getCartItemByIndex(index);
    await item.locator('.remove-btn').click();
  }

  /**
   * Remove an item from the cart by title
   */
  async removeItemByTitle(title: string) {
    const item = this.getCartItemByTitle(title);
    await item.locator('.remove-btn').click();
  }

  /**
   * Increase quantity of an item
   */
  async increaseQuantity(cartItem: Locator) {
    await cartItem.locator('.quantity-controls button').last().click();
  }

  /**
   * Decrease quantity of an item
   */
  async decreaseQuantity(cartItem: Locator) {
    await cartItem.locator('.quantity-controls button').first().click();
  }

  /**
   * Get the total amount displayed
   */
  async getTotalAmount(): Promise<number> {
    const text = await this.totalAmount.textContent();
    return parseFloat(text?.replace('$', '') || '0');
  }

  /**
   * Get the total amount as a formatted string
   */
  async getTotalAmountText(): Promise<string> {
    return await this.totalAmount.textContent() || '$0.00';
  }

  /**
   * Get item count from summary
   */
  async getItemCountFromSummary(): Promise<number> {
    const text = await this.itemCountSummary.textContent();
    return parseInt(text?.trim() || '0');
  }

  /**
   * Check if cart is empty
   */
  async isEmpty(): Promise<boolean> {
    return await this.emptyCartMessage.isVisible();
  }

  /**
   * Clear all items from cart
   */
  async clearCart() {
    await this.clearCartButton.click();
  }

  /**
   * Click checkout button
   */
  async checkout() {
    await this.checkoutButton.click();
  }

  /**
   * Verify cart is empty
   */
  async expectEmptyCart() {
    await expect(this.emptyCartMessage).toBeVisible();
    await expect(this.emptyCartMessage.locator('h3')).toHaveText('Your cart is empty');
  }

  /**
   * Verify cart contains specific number of items
   */
  async expectItemCount(expectedCount: number) {
    if (expectedCount === 0) {
      await this.expectEmptyCart();
    } else {
      await expect(this.cartItems).toHaveCount(expectedCount);
    }
  }

  /**
   * Verify total amount
   */
  async expectTotalAmount(expectedTotal: number) {
    await expect(this.totalAmount).toHaveText(`$${expectedTotal.toFixed(2)}`);
  }

  /**
   * Verify cart contains an item with specific title
   */
  async expectItemWithTitle(title: string) {
    const item = this.getCartItemByTitle(title);
    await expect(item).toBeVisible();
  }

  /**
   * Get all item titles in the cart
   */
  async getAllItemTitles(): Promise<string[]> {
    const titles: string[] = [];
    const count = await this.getCartItemCount();
    
    for (let i = 0; i < count; i++) {
      const item = this.getCartItemByIndex(i);
      const title = await item.locator('.item-title').textContent();
      if (title) {
        titles.push(title.trim());
      }
    }
    
    return titles;
  }
}
