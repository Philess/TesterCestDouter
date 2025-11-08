# E2E Tests for Album Viewer Cart Functionality

This directory contains comprehensive end-to-end (E2E) integration tests for the Vue.js music store application's cart functionality using Playwright.

## Test Structure

### Test Files

- **`cart-state-updates.spec.ts`** - Original comprehensive test suite covering all Gherkin scenarios
- **`cart-state-updates-enhanced.spec.ts`** - Enhanced version using Page Object Model pattern
- **`cart-quantity-management.spec.ts`** - Tests for quantity increase/decrease functionality
- **`cart-clear-functionality.spec.ts`** - Tests for the Clear Cart button

### Page Objects

Located in `/tests/page-objects/`:

- **`AlbumListPage.ts`** - Page object for the main album list view
  - Methods for interacting with album cards
  - Cart icon interactions
  - Helper methods for getting album details
  
- **`CartDrawerPage.ts`** - Page object for the cart drawer component
  - Methods for interacting with cart items
  - Quantity controls
  - Total calculations
  - Clear cart functionality

### Helpers

Located in `/tests/helpers/`:

- **`cart-helpers.ts`** - Utility functions for cart operations
  - localStorage management
  - Price calculations
  - Wait utilities

## Test Coverage

The test suite covers the following Gherkin scenarios:

### Cart State Updates
1. ✅ Adding an album from AlbumCard updates cart state
2. ✅ Adding multiple albums updates cart count
3. ✅ Removing an item from CartDrawer updates cart state
4. ✅ Removing all items empties the cart
5. ✅ Cart drawer content reflects added items
6. ✅ Cart total calculation updates when items are added
7. ✅ Cart total calculation updates when items are removed
8. ✅ Cart state persists across component unmount and remount
9. ✅ Cart icon updates immediately when item is added
10. ✅ Cart icon updates immediately when item is removed
11. ✅ Multiple components reflect same cart state

### Quantity Management
1. ✅ Increasing quantity when adding the same album multiple times
2. ✅ Increasing quantity using the + button
3. ✅ Decreasing quantity using the - button
4. ✅ Removing item when decreasing quantity from 1 to 0
5. ✅ Quantity persistence across page reloads
6. ✅ Total calculation with multiple albums at different quantities

### Clear Cart
1. ✅ Clearing all items
2. ✅ AlbumCard button state updates after clearing
3. ✅ Handling empty cart gracefully
4. ✅ Adding items after clearing cart
5. ✅ Clearing cart with items at different quantities
6. ✅ Cleared state persists across page reload

## Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run tests in UI mode (recommended for development)
```bash
npm run test:e2e:ui
```

### Run tests in debug mode
```bash
npm run test:e2e:debug
```

### Run specific test file
```bash
npx playwright test cart-state-updates.spec.ts
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

### View test report
```bash
npm run test:e2e:report
```

## Prerequisites

Before running tests, ensure:

1. **Dependencies are installed**:
   ```bash
   npm install
   ```

2. **Playwright browsers are installed**:
   ```bash
   npx playwright install
   ```

3. **Backend API is running** on `http://localhost:3000`:
   ```bash
   cd ../albums-api
   npm run dev
   ```

4. **Frontend app is running** on `http://localhost:3001`:
   ```bash
   npm run dev
   ```

> **Note**: The Playwright configuration automatically starts both servers if they're not running.

## Test Architecture

### Page Object Model (POM)

The tests use the Page Object Model pattern for better maintainability:

- **Encapsulation**: UI interactions are encapsulated in page objects
- **Reusability**: Common operations are extracted into reusable methods
- **Maintainability**: Changes to UI only require updates to page objects
- **Readability**: Tests read like user scenarios

### Example Usage

```typescript
import { AlbumListPage } from '../page-objects/AlbumListPage';
import { CartDrawerPage } from '../page-objects/CartDrawerPage';

test('Add album to cart', async ({ page }) => {
  const albumListPage = new AlbumListPage(page);
  const cartDrawerPage = new CartDrawerPage(page);

  await albumListPage.goto();
  await albumListPage.addAlbumToCartByIndex(0);
  await albumListPage.expectCartBadgeCount(1);
  
  await albumListPage.openCartDrawer();
  await cartDrawerPage.expectItemCount(1);
});
```

## Best Practices

1. **Test Isolation**: Each test starts with a clean cart state
2. **Setup/Teardown**: `beforeEach` hook clears localStorage and reloads the page
3. **Descriptive Names**: Test names describe the scenario and expected outcome
4. **AAA Pattern**: Tests follow Arrange-Act-Assert structure
5. **Wait Strategies**: Proper use of `waitForLoadState` and element visibility checks
6. **Assertions**: Multiple assertions to verify complete state changes
7. **Error Messages**: Clear error messages for debugging failures

## Configuration

Tests are configured in `playwright.config.ts`:

- Base URL: `http://localhost:3001`
- Browser: Chromium (can be extended to Firefox, WebKit)
- Retries: 2 on CI, 0 locally
- Screenshot: On failure
- Trace: On first retry
- Web Servers: Auto-starts both backend and frontend

## Debugging Tests

### Using Playwright UI Mode
```bash
npm run test:e2e:ui
```
This provides:
- Time travel debugging
- Watch mode
- Trace viewer
- Screenshot comparison

### Using Debug Mode
```bash
npm run test:e2e:debug
```
This opens Playwright Inspector with:
- Step-through debugging
- Selector playground
- Console logs

### Using VS Code Extension
Install the [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) extension for:
- Running tests from the editor
- Setting breakpoints
- Inline test results

## Continuous Integration

Tests are designed to run in CI environments:

- Automatic retry on failure (2 retries)
- Headless mode by default
- Screenshot and trace capture on failure
- HTML report generation

## Maintenance

When updating components:

1. Update the corresponding page object if selectors change
2. Run affected tests to verify changes
3. Update test expectations if behavior changes intentionally
4. Add new tests for new features

## Known Issues / Limitations

- Tests assume a specific set of albums is loaded from the API
- Some tests use index-based selection which may be fragile if album order changes
- Tests require both frontend and backend to be running

## Contributing

When adding new tests:

1. Follow the existing Page Object Model pattern
2. Use meaningful test names that describe the scenario
3. Add comments for complex logic
4. Ensure tests are independent and repeatable
5. Update this README if adding new test files or features
