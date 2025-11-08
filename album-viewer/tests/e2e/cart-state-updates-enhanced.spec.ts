import { test, expect } from '@playwright/test';
import { AlbumListPage } from '../page-objects/AlbumListPage';
import { CartDrawerPage } from '../page-objects/CartDrawerPage';
import { clearCartStorage, formatPrice } from '../helpers/cart-helpers';

/**
 * Integration Tests: Cart State Updates - Enhanced with Page Object Model
 * 
 * These tests verify cart functionality across components based on Gherkin scenarios.
 * Tests cover AlbumCard, CartDrawer, and CartIcon components interaction.
 * 
 * Uses Page Object Model pattern for maintainability and reusability.
 */

test.describe('Cart State Updates - Enhanced', () => {
  let albumListPage: AlbumListPage;
  let cartDrawerPage: CartDrawerPage;

  // Setup: Clear cart and initialize page objects before each test
  test.beforeEach(async ({ page }) => {
    albumListPage = new AlbumListPage(page);
    cartDrawerPage = new CartDrawerPage(page);

    // Navigate to the app and clear cart state
    await albumListPage.goto();
    await clearCartStorage(page);
    await page.reload();
    await page.waitForLoadState('networkidle');
    await albumListPage.waitForAlbumsToLoad();
  });

  test('Scenario: Adding an album from AlbumCard updates cart state', async ({ page }) => {
    // Given I am viewing an album card
    const firstAlbumCard = albumListPage.getAlbumCardByIndex(0);
    const albumDetails = await albumListPage.getAlbumDetails(firstAlbumCard);

    // Verify cart is initially empty
    await albumListPage.expectCartBadgeCount(0);

    // When I click the "Add to Cart" button
    await albumListPage.addAlbumToCartByIndex(0);

    // Then the cart should contain 1 item
    await albumListPage.expectCartBadgeCount(1);

    // And the cart icon should display count "1"
    const badgeCount = await albumListPage.getCartBadgeCount();
    expect(badgeCount).toBe(1);

    // And the cart total should be updated
    const cartTotal = await albumListPage.getCartTotalFromIcon();
    expect(cartTotal).toContain('$');
    expect(cartTotal).toBe(`$${formatPrice(albumDetails.price)}`);
  });

  test('Scenario: Adding multiple albums updates cart count', async ({ page }) => {
    // Given I am viewing the album list
    const albumCount = await albumListPage.getAlbumCount();
    expect(albumCount).toBeGreaterThan(1);

    // When I add first album to the cart
    const firstAlbumDetails = await albumListPage.getAlbumDetails(albumListPage.getAlbumCardByIndex(0));
    await albumListPage.addAlbumToCartByIndex(0);

    // Verify first item added
    await albumListPage.expectCartBadgeCount(1);

    // And I add second album to the cart
    const secondAlbumDetails = await albumListPage.getAlbumDetails(albumListPage.getAlbumCardByIndex(1));
    await albumListPage.addAlbumToCartByIndex(1);

    // Then the cart should contain 2 items
    await albumListPage.expectCartBadgeCount(2);

    // And the cart icon should display count "2"
    const badgeCount = await albumListPage.getCartBadgeCount();
    expect(badgeCount).toBe(2);

    // Verify total is sum of both prices
    const expectedTotal = firstAlbumDetails.price + secondAlbumDetails.price;
    const cartTotal = await albumListPage.getCartTotalFromIcon();
    expect(cartTotal).toBe(`$${formatPrice(expectedTotal)}`);
  });

  test('Scenario: Removing an item from CartDrawer updates cart state', async ({ page }) => {
    // Given the cart contains two albums
    const firstAlbumDetails = await albumListPage.getAlbumDetails(albumListPage.getAlbumCardByIndex(0));
    const secondAlbumDetails = await albumListPage.getAlbumDetails(albumListPage.getAlbumCardByIndex(1));

    await albumListPage.addAlbumToCartByIndex(0);
    await albumListPage.addAlbumToCartByIndex(1);

    // Verify 2 items in cart
    await albumListPage.expectCartBadgeCount(2);

    // When I open the cart drawer
    await albumListPage.openCartDrawer();
    await expect(cartDrawerPage.drawer.locator('&.open, .cart-drawer.open')).toBeVisible();

    // And I remove the first album from the cart
    const itemCount = await cartDrawerPage.getCartItemCount();
    expect(itemCount).toBe(2);

    await cartDrawerPage.removeItemByIndex(0);

    // Then the cart should contain 1 item
    await albumListPage.expectCartBadgeCount(1);

    // And the cart icon should display count "1"
    const badgeCount = await albumListPage.getCartBadgeCount();
    expect(badgeCount).toBe(1);

    // And the cart drawer should show only one item
    await cartDrawerPage.expectItemCount(1);
  });

  test('Scenario: Removing all items empties the cart', async ({ page }) => {
    // Given the cart contains one album
    const albumDetails = await albumListPage.getAlbumDetails(albumListPage.getAlbumCardByIndex(0));
    await albumListPage.addAlbumToCartByIndex(0);

    // Verify cart has 1 item
    await albumListPage.expectCartBadgeCount(1);

    // When I open the cart drawer
    await albumListPage.openCartDrawer();
    await expect(cartDrawerPage.drawer.locator('&.open, .cart-drawer.open')).toBeVisible();

    // And I remove the album from the cart
    await cartDrawerPage.removeItemByIndex(0);

    // Then the cart should be empty
    await albumListPage.expectCartBadgeCount(0);

    // And the cart icon should display count "0"
    const badgeCount = await albumListPage.getCartBadgeCount();
    expect(badgeCount).toBe(0);

    // And the cart drawer should show no items
    await cartDrawerPage.expectEmptyCart();
  });

  test('Scenario: Cart drawer content reflects added items', async ({ page }) => {
    // Given the cart is empty
    await albumListPage.expectCartBadgeCount(0);

    // Get album details
    const albumCard = albumListPage.getAlbumCardByIndex(0);
    const albumDetails = await albumListPage.getAlbumDetails(albumCard);

    // When I add an album to the cart
    await albumListPage.addAlbumToCartByIndex(0);

    // And I open the cart drawer
    await albumListPage.openCartDrawer();
    await expect(cartDrawerPage.drawer.locator('&.open, .cart-drawer.open')).toBeVisible();

    // Then the cart drawer should display the album
    const cartItem = cartDrawerPage.getCartItemByIndex(0);
    const cartItemDetails = await cartDrawerPage.getCartItemDetails(cartItem);

    expect(cartItemDetails.title).toBe(albumDetails.title);
    expect(cartItemDetails.artist).toBe(albumDetails.artist);

    // And the cart drawer should show the correct price
    expect(cartItemDetails.price).toBe(albumDetails.price);
    expect(cartItemDetails.priceText).toBe(`$${formatPrice(albumDetails.price)}`);
  });

  test('Scenario: Cart total calculation updates when items are added', async ({ page }) => {
    // Given the cart is empty
    await albumListPage.expectCartBadgeCount(0);

    // Get prices from first two albums
    const firstAlbumDetails = await albumListPage.getAlbumDetails(albumListPage.getAlbumCardByIndex(0));
    const secondAlbumDetails = await albumListPage.getAlbumDetails(albumListPage.getAlbumCardByIndex(1));

    const expectedTotal = firstAlbumDetails.price + secondAlbumDetails.price;

    // When I add first album to the cart
    await albumListPage.addAlbumToCartByIndex(0);

    // And I add second album to the cart
    await albumListPage.addAlbumToCartByIndex(1);

    // Open cart drawer to see total
    await albumListPage.openCartDrawer();
    await expect(cartDrawerPage.drawer.locator('&.open, .cart-drawer.open')).toBeVisible();

    // Then the cart total should be the sum of both prices
    await cartDrawerPage.expectTotalAmount(expectedTotal);
  });

  test('Scenario: Cart total calculation updates when items are removed', async ({ page }) => {
    // Given the cart contains two albums
    const firstAlbumDetails = await albumListPage.getAlbumDetails(albumListPage.getAlbumCardByIndex(0));
    const secondAlbumDetails = await albumListPage.getAlbumDetails(albumListPage.getAlbumCardByIndex(1));

    // Add both albums
    await albumListPage.addAlbumToCartByIndex(0);
    await albumListPage.addAlbumToCartByIndex(1);

    // When I open the cart drawer
    await albumListPage.openCartDrawer();
    await expect(cartDrawerPage.drawer.locator('&.open, .cart-drawer.open')).toBeVisible();

    // Verify initial total
    const initialTotal = firstAlbumDetails.price + secondAlbumDetails.price;
    await cartDrawerPage.expectTotalAmount(initialTotal);

    // And I remove the second album
    await cartDrawerPage.removeItemByIndex(1);

    // Then the cart total should be the price of the first album
    await cartDrawerPage.expectTotalAmount(firstAlbumDetails.price);
  });

  test('Scenario: Cart state persists across component unmount and remount', async ({ page }) => {
    // Given I have added an album to the cart
    const albumCard = albumListPage.getAlbumCardByIndex(0);
    const albumDetails = await albumListPage.getAlbumDetails(albumCard);

    await albumListPage.addAlbumToCartByIndex(0);

    // Verify item added
    await albumListPage.expectCartBadgeCount(1);

    // When I reload the page (simulating component unmount/remount)
    await page.reload();
    await page.waitForLoadState('networkidle');
    await albumListPage.waitForAlbumsToLoad();

    // Then the cart should still contain the album
    await albumListPage.expectCartBadgeCount(1);

    // And the cart icon should still display count "1"
    const badgeCount = await albumListPage.getCartBadgeCount();
    expect(badgeCount).toBe(1);

    // Verify the item is still in the cart drawer
    await albumListPage.openCartDrawer();
    await expect(cartDrawerPage.drawer.locator('&.open, .cart-drawer.open')).toBeVisible();

    const cartItem = cartDrawerPage.getCartItemByIndex(0);
    const cartItemDetails = await cartDrawerPage.getCartItemDetails(cartItem);
    expect(cartItemDetails.title).toBe(albumDetails.title);
  });

  test('Scenario: Cart icon updates immediately when item is added', async ({ page }) => {
    // Given I am viewing an album card
    const albumCard = albumListPage.getAlbumCardByIndex(0);

    // And the cart icon shows count "0"
    await albumListPage.expectCartBadgeCount(0);

    // When I add the album to the cart
    await albumListPage.addAlbumToCartByIndex(0);

    // Then the cart icon count should update to "1" immediately
    await expect(albumListPage.cartBadge).toBeVisible({ timeout: 1000 });
    await expect(albumListPage.cartBadge).toHaveText('1');
  });

  test('Scenario: Cart icon updates immediately when item is removed', async ({ page }) => {
    // Given the cart contains 2 items
    await albumListPage.addAlbumToCartByIndex(0);
    await albumListPage.addAlbumToCartByIndex(1);

    // And the cart icon shows count "2"
    await albumListPage.expectCartBadgeCount(2);

    // When I open the cart drawer
    await albumListPage.openCartDrawer();
    await expect(cartDrawerPage.drawer.locator('&.open, .cart-drawer.open')).toBeVisible();

    // And I remove one item
    await cartDrawerPage.removeItemByIndex(0);

    // Then the cart icon count should update to "1" immediately
    await expect(albumListPage.cartBadge).toHaveText('1', { timeout: 1000 });
  });

  test('Scenario: Multiple components reflect same cart state', async ({ page }) => {
    // Given I have the cart drawer open
    await albumListPage.openCartDrawer();
    await expect(cartDrawerPage.drawer.locator('&.open, .cart-drawer.open')).toBeVisible();

    // And the cart is empty
    await cartDrawerPage.expectEmptyCart();

    // Get album details
    const albumCard = albumListPage.getAlbumCardByIndex(0);
    const albumDetails = await albumListPage.getAlbumDetails(albumCard);

    // When I add an album from an album card
    await albumListPage.addAlbumToCartByIndex(0);

    // Then the cart drawer should immediately show the album
    await expect(cartDrawerPage.emptyCartMessage).not.toBeVisible();
    const cartItem = cartDrawerPage.getCartItemByIndex(0);
    await expect(cartItem).toBeVisible();

    const cartItemDetails = await cartDrawerPage.getCartItemDetails(cartItem);
    expect(cartItemDetails.title).toBe(albumDetails.title);

    // And the cart icon should show count "1"
    await albumListPage.expectCartBadgeCount(1);

    // And all components should reflect the same cart state
    // Verify AlbumCard shows "In Cart"
    const isInCart = await albumListPage.isAlbumInCart(albumCard);
    expect(isInCart).toBe(true);
  });
});
