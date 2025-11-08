import { test, expect } from '@playwright/test';
import { AlbumListPage } from '../page-objects/AlbumListPage';
import { CartDrawerPage } from '../page-objects/CartDrawerPage';
import { clearCartStorage, getCartFromStorage } from '../helpers/cart-helpers';

/**
 * Integration Tests: Clear Cart Functionality
 * 
 * Tests for the Clear Cart button functionality:
 * - Clearing cart with multiple items
 * - Verifying state updates across all components
 * - Confirming localStorage is cleared
 */

test.describe('Clear Cart Functionality', () => {
  let albumListPage: AlbumListPage;
  let cartDrawerPage: CartDrawerPage;

  test.beforeEach(async ({ page }) => {
    albumListPage = new AlbumListPage(page);
    cartDrawerPage = new CartDrawerPage(page);

    await albumListPage.goto();
    await clearCartStorage(page);
    await page.reload();
    await page.waitForLoadState('networkidle');
    await albumListPage.waitForAlbumsToLoad();
  });

  test('Should clear all items when Clear Cart button is clicked', async ({ page }) => {
    // Given the cart contains multiple items
    await albumListPage.addAlbumToCartByIndex(0);
    await albumListPage.addAlbumToCartByIndex(1);
    await albumListPage.addAlbumToCartByIndex(2);

    await albumListPage.expectCartBadgeCount(3);

    // When I open the cart drawer and click Clear Cart
    await albumListPage.openCartDrawer();
    await expect(cartDrawerPage.drawer.locator('&.open, .cart-drawer.open')).toBeVisible();

    // Verify items are present
    await cartDrawerPage.expectItemCount(3);

    // Click Clear Cart button
    await cartDrawerPage.clearCart();

    // Then the cart should be empty
    await cartDrawerPage.expectEmptyCart();

    // And the cart badge should not be visible
    await albumListPage.expectCartBadgeCount(0);

    // And localStorage should be cleared
    const cartData = await getCartFromStorage(page);
    expect(cartData).toEqual([]);
  });

  test('Should update AlbumCard buttons after clearing cart', async ({ page }) => {
    // Given albums are in the cart
    await albumListPage.addAlbumToCartByIndex(0);
    await albumListPage.addAlbumToCartByIndex(1);

    // Verify albums show "In Cart"
    const album1Card = albumListPage.getAlbumCardByIndex(0);
    const album2Card = albumListPage.getAlbumCardByIndex(1);

    expect(await albumListPage.isAlbumInCart(album1Card)).toBe(true);
    expect(await albumListPage.isAlbumInCart(album2Card)).toBe(true);

    // When I clear the cart
    await albumListPage.openCartDrawer();
    await expect(cartDrawerPage.drawer.locator('&.open, .cart-drawer.open')).toBeVisible();
    await cartDrawerPage.clearCart();

    // Close the drawer
    await cartDrawerPage.close();

    // Then the AlbumCard buttons should show "Add to Cart"
    expect(await albumListPage.isAlbumInCart(album1Card)).toBe(false);
    expect(await albumListPage.isAlbumInCart(album2Card)).toBe(false);
  });

  test('Should handle clearing an empty cart gracefully', async ({ page }) => {
    // Given the cart is already empty
    await albumListPage.expectCartBadgeCount(0);

    // When I open the cart drawer
    await albumListPage.openCartDrawer();
    await expect(cartDrawerPage.drawer.locator('&.open, .cart-drawer.open')).toBeVisible();

    // Then the Clear Cart button should not be visible
    await expect(cartDrawerPage.clearCartButton).not.toBeVisible();

    // And the empty cart message should be displayed
    await cartDrawerPage.expectEmptyCart();
  });

  test('Should allow adding items after clearing cart', async ({ page }) => {
    // Given the cart had items that were cleared
    await albumListPage.addAlbumToCartByIndex(0);
    await albumListPage.expectCartBadgeCount(1);

    await albumListPage.openCartDrawer();
    await expect(cartDrawerPage.drawer.locator('&.open, .cart-drawer.open')).toBeVisible();
    await cartDrawerPage.clearCart();

    await albumListPage.expectCartBadgeCount(0);

    // Close the drawer
    await cartDrawerPage.close();

    // When I add an album again
    const albumDetails = await albumListPage.getAlbumDetails(albumListPage.getAlbumCardByIndex(1));
    await albumListPage.addAlbumToCartByIndex(1);

    // Then the cart should contain the new item
    await albumListPage.expectCartBadgeCount(1);

    // And the cart drawer should show the new item
    await albumListPage.openCartDrawer();
    await expect(cartDrawerPage.drawer.locator('&.open, .cart-drawer.open')).toBeVisible();

    await cartDrawerPage.expectItemCount(1);
    
    const cartItem = cartDrawerPage.getCartItemByIndex(0);
    const cartItemDetails = await cartDrawerPage.getCartItemDetails(cartItem);
    expect(cartItemDetails.title).toBe(albumDetails.title);
  });

  test('Should clear cart with items at different quantities', async ({ page }) => {
    // Given the cart contains items with different quantities
    const album1Details = await albumListPage.getAlbumDetails(albumListPage.getAlbumCardByIndex(0));
    
    // Add album 0 three times (quantity 3)
    await albumListPage.addAlbumToCartByIndex(0);
    await albumListPage.addAlbumToCartByIndex(0);
    await albumListPage.addAlbumToCartByIndex(0);

    // Add album 1 twice (quantity 2)
    await albumListPage.addAlbumToCartByIndex(1);
    await albumListPage.addAlbumToCartByIndex(1);

    // Total count should be 5
    await albumListPage.expectCartBadgeCount(5);

    // When I clear the cart
    await albumListPage.openCartDrawer();
    await expect(cartDrawerPage.drawer.locator('&.open, .cart-drawer.open')).toBeVisible();
    await cartDrawerPage.clearCart();

    // Then all items should be removed
    await cartDrawerPage.expectEmptyCart();
    await albumListPage.expectCartBadgeCount(0);

    // And localStorage should be empty
    const cartData = await getCartFromStorage(page);
    expect(cartData).toEqual([]);
  });

  test('Should persist cleared state across page reload', async ({ page }) => {
    // Given the cart was cleared
    await albumListPage.addAlbumToCartByIndex(0);
    await albumListPage.expectCartBadgeCount(1);

    await albumListPage.openCartDrawer();
    await expect(cartDrawerPage.drawer.locator('&.open, .cart-drawer.open')).toBeVisible();
    await cartDrawerPage.clearCart();

    await albumListPage.expectCartBadgeCount(0);

    // When I reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    await albumListPage.waitForAlbumsToLoad();

    // Then the cart should still be empty
    await albumListPage.expectCartBadgeCount(0);

    // And localStorage should be empty
    const cartData = await getCartFromStorage(page);
    expect(cartData).toEqual([]);
  });
});
