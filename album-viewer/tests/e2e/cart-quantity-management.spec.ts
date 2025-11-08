import { test, expect } from '@playwright/test';
import { AlbumListPage } from '../page-objects/AlbumListPage';
import { CartDrawerPage } from '../page-objects/CartDrawerPage';
import { clearCartStorage } from '../helpers/cart-helpers';

/**
 * Integration Tests: Cart Quantity Management
 * 
 * Tests for managing item quantities in the cart:
 * - Increasing quantity
 * - Decreasing quantity
 * - Quantity persistence
 * - Total recalculation based on quantity
 */

test.describe('Cart Quantity Management', () => {
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

  test('Should increase quantity when adding the same album multiple times', async ({ page }) => {
    // Given an album is in the cart
    const albumCard = albumListPage.getAlbumCardByIndex(0);
    const albumDetails = await albumListPage.getAlbumDetails(albumCard);

    await albumListPage.addAlbumToCartByIndex(0);
    await albumListPage.expectCartBadgeCount(1);

    // When I add the same album again
    await albumListPage.addAlbumToCartByIndex(0);

    // Then the cart should have 2 items (quantity = 2)
    await albumListPage.expectCartBadgeCount(2);

    // And the cart should still show only 1 unique album
    await albumListPage.openCartDrawer();
    await expect(cartDrawerPage.drawer.locator('&.open, .cart-drawer.open')).toBeVisible();

    const itemCount = await cartDrawerPage.getCartItemCount();
    expect(itemCount).toBe(1);

    // And the quantity should be 2
    const cartItem = cartDrawerPage.getCartItemByIndex(0);
    const cartItemDetails = await cartDrawerPage.getCartItemDetails(cartItem);
    expect(cartItemDetails.quantity).toBe(2);

    // And the total should reflect 2x the price
    const expectedTotal = albumDetails.price * 2;
    await cartDrawerPage.expectTotalAmount(expectedTotal);
  });

  test('Should increase quantity using the + button in cart drawer', async ({ page }) => {
    // Given an album is in the cart
    const albumDetails = await albumListPage.getAlbumDetails(albumListPage.getAlbumCardByIndex(0));
    await albumListPage.addAlbumToCartByIndex(0);

    await albumListPage.openCartDrawer();
    await expect(cartDrawerPage.drawer.locator('&.open, .cart-drawer.open')).toBeVisible();

    const cartItem = cartDrawerPage.getCartItemByIndex(0);

    // When I click the + button
    await cartDrawerPage.increaseQuantity(cartItem);

    // Then the quantity should be 2
    const cartItemDetails = await cartDrawerPage.getCartItemDetails(cartItem);
    expect(cartItemDetails.quantity).toBe(2);

    // And the cart badge should show 2
    await albumListPage.expectCartBadgeCount(2);

    // And the total should double
    const expectedTotal = albumDetails.price * 2;
    await cartDrawerPage.expectTotalAmount(expectedTotal);
  });

  test('Should decrease quantity using the - button in cart drawer', async ({ page }) => {
    // Given an album with quantity 2 is in the cart
    const albumDetails = await albumListPage.getAlbumDetails(albumListPage.getAlbumCardByIndex(0));
    
    await albumListPage.addAlbumToCartByIndex(0);
    await albumListPage.addAlbumToCartByIndex(0);
    await albumListPage.expectCartBadgeCount(2);

    await albumListPage.openCartDrawer();
    await expect(cartDrawerPage.drawer.locator('&.open, .cart-drawer.open')).toBeVisible();

    const cartItem = cartDrawerPage.getCartItemByIndex(0);
    let cartItemDetails = await cartDrawerPage.getCartItemDetails(cartItem);
    expect(cartItemDetails.quantity).toBe(2);

    // When I click the - button
    await cartDrawerPage.decreaseQuantity(cartItem);

    // Then the quantity should be 1
    cartItemDetails = await cartDrawerPage.getCartItemDetails(cartItem);
    expect(cartItemDetails.quantity).toBe(1);

    // And the cart badge should show 1
    await albumListPage.expectCartBadgeCount(1);

    // And the total should reflect single price
    await cartDrawerPage.expectTotalAmount(albumDetails.price);
  });

  test('Should remove item when decreasing quantity from 1 to 0', async ({ page }) => {
    // Given an album with quantity 1 is in the cart
    await albumListPage.addAlbumToCartByIndex(0);
    await albumListPage.expectCartBadgeCount(1);

    await albumListPage.openCartDrawer();
    await expect(cartDrawerPage.drawer.locator('&.open, .cart-drawer.open')).toBeVisible();

    const cartItem = cartDrawerPage.getCartItemByIndex(0);

    // When I click the - button
    await cartDrawerPage.decreaseQuantity(cartItem);

    // Then the item should be removed
    await cartDrawerPage.expectEmptyCart();

    // And the cart badge should not be visible
    await albumListPage.expectCartBadgeCount(0);
  });

  test('Should persist quantity across page reloads', async ({ page }) => {
    // Given an album with quantity 3 is in the cart
    const albumDetails = await albumListPage.getAlbumDetails(albumListPage.getAlbumCardByIndex(0));
    
    await albumListPage.addAlbumToCartByIndex(0);
    await albumListPage.addAlbumToCartByIndex(0);
    await albumListPage.addAlbumToCartByIndex(0);
    await albumListPage.expectCartBadgeCount(3);

    // When I reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    await albumListPage.waitForAlbumsToLoad();

    // Then the cart badge should still show 3
    await albumListPage.expectCartBadgeCount(3);

    // And the cart drawer should show quantity 3
    await albumListPage.openCartDrawer();
    await expect(cartDrawerPage.drawer.locator('&.open, .cart-drawer.open')).toBeVisible();

    const cartItem = cartDrawerPage.getCartItemByIndex(0);
    const cartItemDetails = await cartDrawerPage.getCartItemDetails(cartItem);
    expect(cartItemDetails.quantity).toBe(3);

    // And the total should be correct
    const expectedTotal = albumDetails.price * 3;
    await cartDrawerPage.expectTotalAmount(expectedTotal);
  });

  test('Should calculate total correctly with multiple albums at different quantities', async ({ page }) => {
    // Given multiple albums with different quantities
    const album1Details = await albumListPage.getAlbumDetails(albumListPage.getAlbumCardByIndex(0));
    const album2Details = await albumListPage.getAlbumDetails(albumListPage.getAlbumCardByIndex(1));

    // Add album 1 with quantity 2
    await albumListPage.addAlbumToCartByIndex(0);
    await albumListPage.addAlbumToCartByIndex(0);

    // Add album 2 with quantity 3
    await albumListPage.addAlbumToCartByIndex(1);
    await albumListPage.addAlbumToCartByIndex(1);
    await albumListPage.addAlbumToCartByIndex(1);

    // Then the cart badge should show 5 total items
    await albumListPage.expectCartBadgeCount(5);

    // And the total should be correct
    await albumListPage.openCartDrawer();
    await expect(cartDrawerPage.drawer.locator('&.open, .cart-drawer.open')).toBeVisible();

    const expectedTotal = (album1Details.price * 2) + (album2Details.price * 3);
    await cartDrawerPage.expectTotalAmount(expectedTotal);

    // Verify individual quantities
    const item1 = cartDrawerPage.getCartItemByIndex(0);
    const item1Details = await cartDrawerPage.getCartItemDetails(item1);
    expect(item1Details.quantity).toBe(2);

    const item2 = cartDrawerPage.getCartItemByIndex(1);
    const item2Details = await cartDrawerPage.getCartItemDetails(item2);
    expect(item2Details.quantity).toBe(3);
  });
});
