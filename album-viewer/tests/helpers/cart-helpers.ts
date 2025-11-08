import { Page } from '@playwright/test';

/**
 * Test utility functions for cart-related operations
 */

/**
 * Clear localStorage cart state
 */
export async function clearCartStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.removeItem('music-store-cart');
  });
}

/**
 * Get cart state from localStorage
 */
export async function getCartFromStorage(page: Page): Promise<any> {
  return await page.evaluate(() => {
    const stored = localStorage.getItem('music-store-cart');
    return stored ? JSON.parse(stored) : null;
  });
}

/**
 * Set cart state in localStorage
 */
export async function setCartInStorage(page: Page, cartData: any): Promise<void> {
  await page.evaluate((data) => {
    localStorage.setItem('music-store-cart', JSON.stringify(data));
  }, cartData);
}

/**
 * Wait for a specific number of items to be in the cart
 */
export async function waitForCartItemCount(page: Page, expectedCount: number, timeout: number = 5000): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const cartData = await getCartFromStorage(page);
    if (cartData && Array.isArray(cartData)) {
      const totalItems = cartData.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
      if (totalItems === expectedCount) {
        return;
      }
    } else if (expectedCount === 0) {
      return;
    }
    
    await page.waitForTimeout(100);
  }
  
  throw new Error(`Cart did not reach expected item count of ${expectedCount} within ${timeout}ms`);
}

/**
 * Calculate total price from album details
 */
export function calculateTotal(prices: number[]): number {
  return prices.reduce((sum, price) => sum + price, 0);
}

/**
 * Format price to 2 decimal places
 */
export function formatPrice(price: number): string {
  return price.toFixed(2);
}

/**
 * Parse price string to number
 */
export function parsePrice(priceString: string): number {
  return parseFloat(priceString.replace('$', '').trim());
}
