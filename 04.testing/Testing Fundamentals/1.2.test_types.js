// ==========================================
// 1.2 TYPES OF TESTS - PRACTICAL EXAMPLES
// ==========================================
// Copy these into your test files to see each type in action

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";

// ==========================================
// EXAMPLE COMPONENTS (Imagine these exist)
// ==========================================

// Simple utility function
function calculateDiscount(price, discountPercent) {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error("Discount must be between 0 and 100");
  }
  return price * (1 - discountPercent / 100);
}

// Example components would be imported:
// import { ShoppingCart, ProductCard, CheckoutForm } from './components';

// ==========================================
// 1. UNIT TESTS - Test in isolation
// ==========================================

describe("UNIT TESTS - calculateDiscount", () => {
  // Test individual function with no dependencies

  test("calculates 10% discount correctly", () => {
    expect(calculateDiscount(100, 10)).toBe(90);
  });

  test("calculates 50% discount correctly", () => {
    expect(calculateDiscount(200, 50)).toBe(100);
  });

  test("returns original price with 0% discount", () => {
    expect(calculateDiscount(100, 0)).toBe(100);
  });

  test("handles decimal prices", () => {
    expect(calculateDiscount(19.99, 20)).toBeCloseTo(15.99, 2);
  });

  test("throws error for negative discount", () => {
    expect(() => calculateDiscount(100, -10)).toThrow(
      "Discount must be between 0 and 100"
    );
  });

  test("throws error for discount over 100", () => {
    expect(() => calculateDiscount(100, 150)).toThrow(
      "Discount must be between 0 and 100"
    );
  });
});

// ✅ Perfect for unit tests:
// - Pure functions
// - No side effects
// - No dependencies
// - Predictable output

// ==========================================
// 2. INTEGRATION TESTS - Multiple units working together
// ==========================================

describe("INTEGRATION TESTS - Shopping Cart Feature", () => {
  // Tests multiple components and state working together

  test("user can add product to cart and see count update", async () => {
    const user = userEvent.setup();

    // Render connected components
    render(<ShoppingApp />);

    // Initial state: cart is empty
    expect(screen.getByText(/cart: 0 items/i)).toBeInTheDocument();

    // Find product and add to cart
    const laptop = screen.getByRole("article", { name: /laptop/i });
    const addButton = within(laptop).getByRole("button", {
      name: /add to cart/i,
    });

    await user.click(addButton);

    // Verify cart count updated across app
    expect(screen.getByText(/cart: 1 item/i)).toBeInTheDocument();

    // Verify badge on cart icon updated
    const cartBadge = screen.getByLabelText(/items in cart/i);
    expect(cartBadge).toHaveTextContent("1");
  });

  test("adding multiple products updates cart correctly", async () => {
    const user = userEvent.setup();
    render(<ShoppingApp />);

    // Add laptop
    await user.click(
      within(screen.getByRole("article", { name: /laptop/i })).getByRole(
        "button",
        { name: /add to cart/i }
      )
    );

    // Add mouse
    await user.click(
      within(screen.getByRole("article", { name: /mouse/i })).getByRole(
        "button",
        { name: /add to cart/i }
      )
    );

    // Verify total count
    expect(screen.getByText(/cart: 2 items/i)).toBeInTheDocument();
  });

  test("removing item from cart updates count", async () => {
    const user = userEvent.setup();
    render(<ShoppingApp />);

    // Add item
    await user.click(
      screen.getAllByRole("button", { name: /add to cart/i })[0]
    );
    expect(screen.getByText(/cart: 1 item/i)).toBeInTheDocument();

    // Go to cart page
    await user.click(screen.getByRole("link", { name: /cart/i }));

    // Remove item
    await user.click(screen.getByRole("button", { name: /remove/i }));

    // Verify count updated
    expect(screen.getByText(/cart: 0 items/i)).toBeInTheDocument();
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });
});

// ✅ Perfect for integration tests:
// - Multiple components interacting
// - State management across components
// - User workflows
// - Most of your tests should be like this!

// ==========================================
// 3. END-TO-END TESTS (with Playwright)
// ==========================================

// These run in real browser, testing entire app
// Put these in separate e2e/ folder

// e2e/checkout.spec.js
import { test, expect } from "@playwright/test";

test("complete purchase flow", async ({ page }) => {
  // Navigate to app
  await page.goto("http://localhost:3000");

  // Browse products
  await page.click("text=Shop Now");
  await expect(page).toHaveURL(/.*products/);

  // Add product to cart
  await page.click('button:has-text("Add to Cart")');
  await expect(page.locator(".cart-badge")).toHaveText("1");

  // Go to cart
  await page.click('a:has-text("Cart")');
  await expect(page.locator("h1")).toHaveText("Shopping Cart");

  // Proceed to checkout
  await page.click('button:has-text("Checkout")');

  // Fill shipping information
  await page.fill('input[name="fullName"]', "John Doe");
  await page.fill('input[name="email"]', "john@example.com");
  await page.fill('input[name="address"]', "123 Main St");
  await page.fill('input[name="city"]', "New York");
  await page.fill('input[name="zipCode"]', "10001");

  // Fill payment info (test card)
  await page.fill('input[name="cardNumber"]', "4242424242424242");
  await page.fill('input[name="expiry"]', "12/25");
  await page.fill('input[name="cvv"]', "123");

  // Submit order
  await page.click('button:has-text("Place Order")');

  // Verify success page
  await expect(page.locator("h1")).toHaveText("Order Confirmed!");
  await expect(page.locator(".order-number")).toBeVisible();

  // Take screenshot for proof
  await page.screenshot({ path: "order-success.png" });
});

test("handles payment failure gracefully", async ({ page }) => {
  // Mock payment failure
  await page.route("**/api/payment", (route) => {
    route.fulfill({
      status: 400,
      body: JSON.stringify({ error: "Payment declined" }),
    });
  });

  await page.goto("http://localhost:3000/checkout");

  // Fill form and submit
  await page.fill('input[name="cardNumber"]', "4000000000000002"); // Decline card
  await page.click('button:has-text("Place Order")');

  // Verify error message
  await expect(page.locator(".error-message")).toHaveText(
    "Payment declined. Please try another card."
  );
});

// ✅ Perfect for E2E tests:
// - Critical user flows (checkout, signup, login)
// - Testing with real backend
// - Cross-browser testing
// - Production-like environment

// ==========================================
// 4. SMOKE TESTS
// ==========================================

describe("SMOKE TESTS - Basic functionality", () => {
  // Quick checks that nothing is on fire

  test("app renders without crashing", () => {
    render(<App />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  test("main navigation links are present", () => {
    render(<App />);

    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /products/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cart/i })).toBeInTheDocument();
  });

  test("can navigate to products page", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("link", { name: /products/i }));

    // Just verify page loaded, don't test everything
    expect(
      screen.getByRole("heading", { name: /products/i })
    ).toBeInTheDocument();
  });
});

// ✅ Run after deployment to verify:
// - App loads
// - Basic navigation works
// - No critical errors

// ==========================================
// 5. REGRESSION TESTS
// ==========================================

describe("REGRESSION TESTS - Bug fixes", () => {
  // Tests that prevent bugs from coming back

  test("bug #123: quantity cannot be negative", async () => {
    const user = userEvent.setup();
    render(<ProductCard product={{ id: 1, name: "Laptop", price: 999 }} />);

    const quantityInput = screen.getByLabelText(/quantity/i);

    // Try to enter negative number
    await user.clear(quantityInput);
    await user.type(quantityInput, "-5");

    // Should prevent negative
    expect(quantityInput).toHaveValue(0);

    // Or show error
    expect(screen.getByText(/quantity must be positive/i)).toBeInTheDocument();
  });

  test("bug #456: empty cart shows correct message", () => {
    render(<ShoppingCart items={[]} />);

    // This bug: used to show "undefined items" instead of proper message
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.queryByText(/undefined/i)).not.toBeInTheDocument();
  });

  test("bug #789: discount applied before tax, not after", () => {
    const price = 100;
    const discount = 10; // 10%
    const taxRate = 0.08; // 8%

    // Bug was: (price - discount) * tax
    // Correct: (price * tax) - (discount * tax)

    const discountedPrice = calculateDiscount(price, discount); // 90
    const total = discountedPrice * (1 + taxRate); // 97.20

    expect(total).toBeCloseTo(97.2, 2);
  });
});

// ✅ Every bug gets a regression test:
// - Prevents bug from coming back
// - Documents the issue
// - Reference bug number in test name

// ==========================================
// 6. VISUAL REGRESSION TESTS
// ==========================================

/*
// Run with Playwright or Percy

test('button has correct styling', async ({ page }) => {
  await page.goto('http://localhost:3000/styleguide');
  
  const button = page.locator('button.primary');
  
  // Take screenshot
  await expect(button).toHaveScreenshot('primary-button.png');
  
  // Hover state
  await button.hover();
  await expect(button).toHaveScreenshot('primary-button-hover.png');
  
  // Disabled state  
  await page.click('button:has-text("Toggle Disabled")');
  await expect(button).toHaveScreenshot('primary-button-disabled.png');
});

test('responsive layout on mobile', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:3000');
  
  await expect(page).toHaveScreenshot('homepage-mobile.png');
});

test('dark mode theme', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Enable dark mode
  await page.click('button[aria-label="Toggle dark mode"]');
  
  await expect(page).toHaveScreenshot('homepage-dark-mode.png');
});
*/

// ✅ Use visual tests for:
// - Component libraries
// - Design systems
// - Marketing pages
// - Cross-browser appearance

// ==========================================
// 7. ACCESSIBILITY TESTS
// ==========================================

describe("ACCESSIBILITY TESTS", () => {
  test("form has no a11y violations", async () => {
    const { container } = render(<CheckoutForm />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("keyboard navigation works", async () => {
    const user = userEvent.setup();
    render(<ProductGrid />);

    // Tab through products
    await user.tab();
    expect(
      screen.getAllByRole("button", { name: /add to cart/i })[0]
    ).toHaveFocus();

    await user.tab();
    expect(
      screen.getAllByRole("button", { name: /add to cart/i })[1]
    ).toHaveFocus();
  });

  test("screen reader labels are correct", () => {
    render(<ShoppingCart items={[{ id: 1, name: "Laptop", quantity: 2 }]} />);

    expect(screen.getByLabelText(/2 items in cart/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /remove laptop from cart/i })
    ).toBeInTheDocument();
  });

  test("color contrast is sufficient", async () => {
    const { container } = render(<Button>Submit</Button>);

    const results = await axe(container, {
      rules: {
        "color-contrast": { enabled: true },
      },
    });

    expect(results).toHaveNoViolations();
  });
});

// ✅ Accessibility testing catches:
// - Missing alt text
// - Missing labels
// - Keyboard navigation issues
// - Color contrast problems
// - ARIA issues

// ==========================================
// 8. PERFORMANCE TESTS
// ==========================================

describe("PERFORMANCE TESTS", () => {
  test("large list renders efficiently", () => {
    const startTime = performance.now();

    const items = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Product ${i}`,
      price: Math.random() * 100,
    }));

    render(<ProductList items={items} />);

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Should render 1000 items in under 100ms
    expect(renderTime).toBeLessThan(100);
  });

  test("component memoization prevents unnecessary renders", () => {
    const renderSpy = jest.fn();

    function ExpensiveComponent({ data }) {
      renderSpy();
      return <div>{data}</div>;
    }

    const MemoizedComponent = React.memo(ExpensiveComponent);

    const { rerender } = render(<MemoizedComponent data="test" />);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    // Rerender with same props
    rerender(<MemoizedComponent data="test" />);

    // Should NOT re-render
    expect(renderSpy).toHaveBeenCalledTimes(1);

    // Rerender with different props
    rerender(<MemoizedComponent data="changed" />);

    // Should re-render now
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });
});

// ==========================================
// SUMMARY: WHEN TO USE EACH TYPE
// ==========================================

/*
┌─────────────────────────────────────────────────────────┐
│  TEST TYPE         │  USE WHEN                           │
├─────────────────────────────────────────────────────────┤
│  Unit              │  Pure functions, utilities          │
│  Integration       │  User workflows (MOST TESTS)        │
│  E2E               │  Critical paths only                │
│  Smoke             │  Post-deployment checks             │
│  Regression        │  Every bug fix                      │
│  Visual            │  Component library, design system   │
│  A11y              │  All interactive components         │
│  Performance       │  Large lists, complex components    │
└─────────────────────────────────────────────────────────┘

DISTRIBUTION:
  70% Integration Tests  ████████████████████
  20% Unit Tests        ██████
  10% E2E Tests         ███
*/
