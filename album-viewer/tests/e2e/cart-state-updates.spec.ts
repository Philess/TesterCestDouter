import { test, expect, Page } from '@playwright/test';

/**
 * Integration Tests: Cart State Updates
 * 
 * These tests verify cart functionality across components based on Gherkin scenarios.
 * Tests cover AlbumCard, CartDrawer, and CartIcon components interaction.
 */

// Helper function to clear localStorage before each test
test.beforeEach(async ({ page }) => {
  // Navigate to the app and clear cart state
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForLoadState('networkidle');
});

test.describe('Cart State Updates', () => {
  
  test('Adding an album from AlbumCard updates cart state', async ({ page }) => {
    // Given I am viewing an album card
    await page.goto('/');
    
    // Wait for albums to load
    await page.waitForSelector('.album-card', { timeout: 10000 });
    
    // Get the first album card
    const firstAlbumCard = page.locator('.album-card').first();
    const albumTitle = await firstAlbumCard.locator('.album-title').textContent();
    
    // Get initial cart count (should be 0)
    const cartBadgeBeforeAdd = page.locator('.cart-badge');
    await expect(cartBadgeBeforeAdd).not.toBeVisible();
    
    // When I click the "Add to Cart" button
    await firstAlbumCard.locator('button.btn-primary').click();
    
    // Then the cart should contain 1 item
    await expect(cartBadgeBeforeAdd).toBeVisible();
    await expect(cartBadgeBeforeAdd).toHaveText('1');
    
    // And the cart icon should display count "1"
    const cartIcon = page.locator('.cart-icon-button');
    await expect(cartIcon).toContainText('1');
    
    // And the cart total should be updated
    const cartTotal = page.locator('.cart-total');
    await expect(cartTotal).toBeVisible();
  });

  test('Adding multiple albums updates cart count', async ({ page }) => {
    // Given I am viewing the album list
    await page.goto('/');
    await page.waitForSelector('.album-card');
    
    // Get first two album cards
    const albumCards = page.locator('.album-card');
    await expect(albumCards).toHaveCount(await albumCards.count());
    
    // When I add first album to the cart
    await albumCards.nth(0).locator('button.btn-primary').click();
    
    // Verify first item added
    const cartBadge = page.locator('.cart-badge');
    await expect(cartBadge).toHaveText('1');
    
    // And I add second album to the cart
    await albumCards.nth(1).locator('button.btn-primary').click();
    
    // Then the cart should contain 2 items
    await expect(cartBadge).toHaveText('2');
    
    // And the cart icon should display count "2"
    await expect(page.locator('.cart-icon-button')).toContainText('2');
  });

  test('Removing an item from CartDrawer updates cart state', async ({ page }) => {
    // Given the cart contains two albums
    await page.goto('/');
    await page.waitForSelector('.album-card');
    
    const albumCards = page.locator('.album-card');
    
    // Add two albums
    const firstAlbumTitle = await albumCards.nth(0).locator('.album-title').textContent();
    const secondAlbumTitle = await albumCards.nth(1).locator('.album-title').textContent();
    
    await albumCards.nth(0).locator('button.btn-primary').click();
    await albumCards.nth(1).locator('button.btn-primary').click();
    
    // Verify 2 items in cart
    await expect(page.locator('.cart-badge')).toHaveText('2');
    
    // When I open the cart drawer
    await page.locator('.cart-icon-button').click();
    
    // Wait for drawer to open
    await expect(page.locator('.cart-drawer.open')).toBeVisible();
    
    // And I remove the first album from the cart
    const cartItems = page.locator('.cart-item');
    await expect(cartItems).toHaveCount(2);
    
    // Click remove button on first item
    await cartItems.first().locator('.remove-btn').click();
    
    // Then the cart should contain 1 item
    await expect(page.locator('.cart-badge')).toHaveText('1');
    
    // And the cart icon should display count "1"
    await expect(page.locator('.cart-icon-button')).toContainText('1');
    
    // And the cart drawer should show only one item
    await expect(page.locator('.cart-item')).toHaveCount(1);
  });

  test('Removing all items empties the cart', async ({ page }) => {
    // Given the cart contains one album
    await page.goto('/');
    await page.waitForSelector('.album-card');
    
    const albumCard = page.locator('.album-card').first();
    await albumCard.locator('button.btn-primary').click();
    
    // Verify cart has 1 item
    await expect(page.locator('.cart-badge')).toHaveText('1');
    
    // When I open the cart drawer
    await page.locator('.cart-icon-button').click();
    await expect(page.locator('.cart-drawer.open')).toBeVisible();
    
    // And I remove the album from the cart
    await page.locator('.cart-item .remove-btn').click();
    
    // Then the cart should be empty
    await expect(page.locator('.cart-badge')).not.toBeVisible();
    
    // And the cart icon should display count "0"
    await expect(page.locator('.cart-icon-button')).not.toContainText(/\d/);
    
    // And the cart drawer should show no items
    await expect(page.locator('.empty-cart')).toBeVisible();
    await expect(page.locator('.empty-cart h3')).toHaveText('Your cart is empty');
  });

  test('Cart drawer content reflects added items', async ({ page }) => {
    // Given the cart is empty
    await page.goto('/');
    await page.waitForSelector('.album-card');
    
    // Get album details
    const albumCard = page.locator('.album-card').first();
    const albumTitle = await albumCard.locator('.album-title').textContent();
    const albumArtist = await albumCard.locator('.album-artist').textContent();
    const albumPriceText = await albumCard.locator('.price').textContent();
    
    // When I add an album to the cart
    await albumCard.locator('button.btn-primary').click();
    
    // And I open the cart drawer
    await page.locator('.cart-icon-button').click();
    await expect(page.locator('.cart-drawer.open')).toBeVisible();
    
    // Then the cart drawer should display the album
    const cartItem = page.locator('.cart-item').first();
    await expect(cartItem.locator('.item-title')).toHaveText(albumTitle || '');
    await expect(cartItem.locator('.item-artist')).toHaveText(albumArtist || '');
    
    // And the cart drawer should show the correct price
    await expect(cartItem.locator('.item-price')).toContainText('$');
  });

  test('Cart total calculation updates when items are added', async ({ page }) => {
    // Given the cart is empty
    await page.goto('/');
    await page.waitForSelector('.album-card');
    
    const albumCards = page.locator('.album-card');
    
    // Get prices from first two albums
    const firstPrice = await albumCards.nth(0).locator('.price').textContent();
    const secondPrice = await albumCards.nth(1).locator('.price').textContent();
    
    const price1 = parseFloat(firstPrice?.replace('$', '') || '0');
    const price2 = parseFloat(secondPrice?.replace('$', '') || '0');
    const expectedTotal = (price1 + price2).toFixed(2);
    
    // When I add first album to the cart
    await albumCards.nth(0).locator('button.btn-primary').click();
    
    // And I add second album to the cart
    await albumCards.nth(1).locator('button.btn-primary').click();
    
    // Open cart drawer to see total
    await page.locator('.cart-icon-button').click();
    await expect(page.locator('.cart-drawer.open')).toBeVisible();
    
    // Then the cart total should be the sum of both prices
    const totalAmount = page.locator('.total-amount');
    await expect(totalAmount).toHaveText(`$${expectedTotal}`);
  });

  test('Cart total calculation updates when items are removed', async ({ page }) => {
    // Given the cart contains two albums
    await page.goto('/');
    await page.waitForSelector('.album-card');
    
    const albumCards = page.locator('.album-card');
    
    // Get prices
    const firstPrice = await albumCards.nth(0).locator('.price').textContent();
    const secondPrice = await albumCards.nth(1).locator('.price').textContent();
    
    const price1 = parseFloat(firstPrice?.replace('$', '') || '0');
    const price2 = parseFloat(secondPrice?.replace('$', '') || '0');
    
    // Add both albums
    await albumCards.nth(0).locator('button.btn-primary').click();
    await albumCards.nth(1).locator('button.btn-primary').click();
    
    // When I open the cart drawer
    await page.locator('.cart-icon-button').click();
    await expect(page.locator('.cart-drawer.open')).toBeVisible();
    
    // Verify initial total
    const totalAmount = page.locator('.total-amount');
    const initialTotal = (price1 + price2).toFixed(2);
    await expect(totalAmount).toHaveText(`$${initialTotal}`);
    
    // And I remove the second album
    const cartItems = page.locator('.cart-item');
    await cartItems.nth(1).locator('.remove-btn').click();
    
    // Then the cart total should be the price of the first album
    const expectedTotal = price1.toFixed(2);
    await expect(totalAmount).toHaveText(`$${expectedTotal}`);
  });

  test('Cart state persists across component unmount and remount', async ({ page }) => {
    // Given I have added an album to the cart
    await page.goto('/');
    await page.waitForSelector('.album-card');
    
    const albumCard = page.locator('.album-card').first();
    const albumTitle = await albumCard.locator('.album-title').textContent();
    
    await albumCard.locator('button.btn-primary').click();
    
    // Verify item added
    await expect(page.locator('.cart-badge')).toHaveText('1');
    
    // When I reload the page (simulating component unmount/remount)
    await page.reload();
    await page.waitForSelector('.album-card');
    
    // Then the cart should still contain the album
    await expect(page.locator('.cart-badge')).toHaveText('1');
    
    // And the cart icon should still display count "1"
    await expect(page.locator('.cart-icon-button')).toContainText('1');
    
    // Verify the item is still in the cart drawer
    await page.locator('.cart-icon-button').click();
    await expect(page.locator('.cart-drawer.open')).toBeVisible();
    
    const cartItem = page.locator('.cart-item').first();
    await expect(cartItem.locator('.item-title')).toHaveText(albumTitle || '');
  });

  test('Cart icon updates immediately when item is added', async ({ page }) => {
    // Given I am viewing an album card
    await page.goto('/');
    await page.waitForSelector('.album-card');
    
    const albumCard = page.locator('.album-card').first();
    
    // And the cart icon shows count "0"
    const cartBadge = page.locator('.cart-badge');
    await expect(cartBadge).not.toBeVisible();
    
    // When I add the album to the cart
    await albumCard.locator('button.btn-primary').click();
    
    // Then the cart icon count should update to "1" immediately
    await expect(cartBadge).toBeVisible({ timeout: 1000 });
    await expect(cartBadge).toHaveText('1');
  });

  test('Cart icon updates immediately when item is removed', async ({ page }) => {
    // Given the cart contains 2 items
    await page.goto('/');
    await page.waitForSelector('.album-card');
    
    const albumCards = page.locator('.album-card');
    await albumCards.nth(0).locator('button.btn-primary').click();
    await albumCards.nth(1).locator('button.btn-primary').click();
    
    // And the cart icon shows count "2"
    const cartBadge = page.locator('.cart-badge');
    await expect(cartBadge).toHaveText('2');
    
    // When I open the cart drawer
    await page.locator('.cart-icon-button').click();
    await expect(page.locator('.cart-drawer.open')).toBeVisible();
    
    // And I remove one item
    await page.locator('.cart-item').first().locator('.remove-btn').click();
    
    // Then the cart icon count should update to "1" immediately
    await expect(cartBadge).toHaveText('1', { timeout: 1000 });
  });

  test('Multiple components reflect same cart state', async ({ page }) => {
    // Given I have the cart drawer open
    await page.goto('/');
    await page.waitForSelector('.album-card');
    
    // Open cart drawer
    await page.locator('.cart-icon-button').click();
    await expect(page.locator('.cart-drawer.open')).toBeVisible();
    
    // And the cart is empty
    await expect(page.locator('.empty-cart')).toBeVisible();
    
    // Get album details
    const albumCard = page.locator('.album-card').first();
    const albumTitle = await albumCard.locator('.album-title').textContent();
    
    // When I add an album from an album card
    await albumCard.locator('button.btn-primary').click();
    
    // Then the cart drawer should immediately show the album
    await expect(page.locator('.empty-cart')).not.toBeVisible();
    const cartItem = page.locator('.cart-item').first();
    await expect(cartItem).toBeVisible();
    await expect(cartItem.locator('.item-title')).toHaveText(albumTitle || '');
    
    // And the cart icon should show count "1"
    const cartBadge = page.locator('.cart-badge');
    await expect(cartBadge).toHaveText('1');
    
    // And all components should reflect the same cart state
    // Verify AlbumCard shows "In Cart"
    await expect(albumCard.locator('button.btn-primary')).toContainText('In Cart');
  });
});
