// ==========================================
// 1.3 TEST ANATOMY - PRACTICAL EXAMPLES
// ==========================================

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ==========================================
// 1. BASIC TEST STRUCTURE
// ==========================================

describe("Counter Component", () => {
  // Individual test case
  test("starts at zero", () => {
    render(<Counter />);
    expect(screen.getByText(/count: 0/i)).toBeInTheDocument();
  });

  // 'it' is identical to 'test' - use one style consistently
  it("increments when button clicked", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    await user.click(screen.getByRole("button", { name: /increment/i }));

    expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
  });
});

// ==========================================
// 2. NESTED DESCRIBE BLOCKS
// ==========================================

describe("ShoppingCart", () => {
  // Group 1: Empty cart scenarios
  describe("when empty", () => {
    test("displays empty message", () => {
      render(<ShoppingCart items={[]} />);
      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    });

    test("disables checkout button", () => {
      render(<ShoppingCart items={[]} />);
      expect(screen.getByRole("button", { name: /checkout/i })).toBeDisabled();
    });

    test("shows zero total", () => {
      render(<ShoppingCart items={[]} />);
      expect(screen.getByText(/total: \$0\.00/i)).toBeInTheDocument();
    });
  });

  // Group 2: Cart with items
  describe("when has items", () => {
    const items = [
      { id: 1, name: "Laptop", price: 999, quantity: 1 },
      { id: 2, name: "Mouse", price: 29, quantity: 2 },
    ];

    test("displays item count", () => {
      render(<ShoppingCart items={items} />);
      expect(screen.getByText(/2 items/i)).toBeInTheDocument();
    });

    test("enables checkout button", () => {
      render(<ShoppingCart items={items} />);
      expect(
        screen.getByRole("button", { name: /checkout/i })
      ).not.toBeDisabled();
    });

    test("calculates total correctly", () => {
      render(<ShoppingCart items={items} />);
      // 999 + (29 * 2) = 1057
      expect(screen.getByText(/total: \$1,057\.00/i)).toBeInTheDocument();
    });
  });

  // Group 3: Item removal
  describe("removing items", () => {
    test("updates count when item removed", async () => {
      const user = userEvent.setup();
      render(<ShoppingCart items={[{ id: 1, name: "Laptop", price: 999 }]} />);

      await user.click(screen.getByRole("button", { name: /remove/i }));

      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    });
  });
});

// ==========================================
// 3. beforeEach and afterEach
// ==========================================

describe("LoginForm", () => {
  let mockOnSubmit;
  let user;

  // Setup before EACH test
  beforeEach(() => {
    // Create fresh mock function
    mockOnSubmit = jest.fn();

    // Setup userEvent
    user = userEvent.setup();

    // Clear any previous mocks
    jest.clearAllMocks();
  });

  // Cleanup after EACH test
  afterEach(() => {
    // Clear all timers if any were created
    jest.clearAllTimers();

    // Restore any mocked functions
    jest.restoreAllMocks();
  });

  test("submits with email and password", async () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  test("shows error for invalid email", async () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/email/i), "invalid");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});

// ==========================================
// 4. beforeAll and afterAll
// ==========================================

describe("API Integration Tests", () => {
  let server;

  // Setup ONCE before all tests
  beforeAll(() => {
    // Start mock server (expensive operation)
    server = setupServer(
      rest.get("/api/users", (req, res, ctx) => {
        return res(ctx.json([{ id: 1, name: "John" }]));
      })
    );
    server.listen();
  });

  // Cleanup ONCE after all tests
  afterAll(() => {
    server.close();
  });

  // Reset handlers before each test
  beforeEach(() => {
    server.resetHandlers();
  });

  test("fetches users successfully", async () => {
    render(<UserList />);
    expect(await screen.findByText("John")).toBeInTheDocument();
  });

  test("handles server error", async () => {
    // Override handler for this test
    server.use(
      rest.get("/api/users", (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<UserList />);
    expect(await screen.findByText(/error loading users/i)).toBeInTheDocument();
  });
});

// ==========================================
// 5. TEST ISOLATION - Good vs Bad
// ==========================================

// ❌ BAD EXAMPLE - Tests affect each other
describe("BAD: Non-isolated tests", () => {
  let cart = []; // Shared mutable state

  test("adds item to cart", () => {
    cart.push({ id: 1, name: "Laptop" });
    expect(cart).toHaveLength(1);
  });

  test("cart starts empty", () => {
    // This test FAILS because previous test mutated cart!
    expect(cart).toHaveLength(0); // ✗ Fails
  });
});

// ✅ GOOD EXAMPLE - Isolated tests
describe("GOOD: Isolated tests", () => {
  let cart;

  beforeEach(() => {
    cart = []; // Fresh state before each test
  });

  test("adds item to cart", () => {
    cart.push({ id: 1, name: "Laptop" });
    expect(cart).toHaveLength(1);
  });

  test("cart starts empty", () => {
    expect(cart).toHaveLength(0); // ✓ Passes
  });

  test("adds multiple items", () => {
    cart.push({ id: 1, name: "Laptop" });
    cart.push({ id: 2, name: "Mouse" });
    expect(cart).toHaveLength(2); // ✓ Always passes
  });
});

// ==========================================
// 6. TEST NAMING CONVENTIONS
// ==========================================

describe("Button Component", () => {
  // ❌ BAD NAMES - Too vague
  test("works", () => {}); // What works?
  test("button", () => {}); // What about the button?
  test("test 1", () => {}); // No meaning
  test("renders", () => {}); // Renders what?

  // ✅ GOOD NAMES - Specific and clear
  test("renders with primary variant by default", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn-primary");
  });

  test("disables button when loading prop is true", () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  test("shows spinner icon when loading", () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole("img", { name: /loading/i })).toBeInTheDocument();
  });

  test("calls onClick handler when clicked", async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

// ==========================================
// 7. USING .only() and .skip()
// ==========================================

describe("Feature under development", () => {
  test("completed feature 1", () => {
    expect(true).toBe(true);
  });

  // Skip test that's not ready yet
  test.skip("TODO: implement feature 2", () => {
    // Will implement later
  });

  // Skip flaky test temporarily
  test.skip("FLAKY: sometimes fails in CI", () => {
    // Need to investigate
  });

  test("completed feature 3", () => {
    expect(true).toBe(true);
  });
});

// Debug specific test
describe("Debugging", () => {
  test("this one passes", () => {
    expect(1 + 1).toBe(2);
  });

  // Run ONLY this test to debug it
  test.only("debugging this failing test", () => {
    // All other tests skipped, only this runs
    expect(2 + 2).toBe(4);
  });

  test("this is skipped", () => {
    expect(3 + 3).toBe(6);
  });
});

// Skip entire suite
describe.skip("Feature not ready", () => {
  test("test 1", () => {});
  test("test 2", () => {});
  // All tests in this suite are skipped
});

// ==========================================
// 8. PRACTICAL EXAMPLE - COMPLETE COMPONENT TEST
// ==========================================

describe("ProductCard Component", () => {
  const mockProduct = {
    id: 1,
    name: "Laptop",
    price: 999,
    description: "High-performance laptop",
    inStock: true,
  };

  // Setup before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    test("displays product name", () => {
      render(<ProductCard product={mockProduct} />);
      expect(screen.getByText("Laptop")).toBeInTheDocument();
    });

    test("displays formatted price", () => {
      render(<ProductCard product={mockProduct} />);
      expect(screen.getByText("$999.00")).toBeInTheDocument();
    });

    test("displays product description", () => {
      render(<ProductCard product={mockProduct} />);
      expect(screen.getByText(/high-performance laptop/i)).toBeInTheDocument();
    });
  });

  describe("Stock status", () => {
    test('shows "In Stock" badge when available', () => {
      render(<ProductCard product={{ ...mockProduct, inStock: true }} />);
      expect(screen.getByText(/in stock/i)).toBeInTheDocument();
    });

    test('shows "Out of Stock" badge when unavailable', () => {
      render(<ProductCard product={{ ...mockProduct, inStock: false }} />);
      expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
    });

    test("disables add to cart button when out of stock", () => {
      render(<ProductCard product={{ ...mockProduct, inStock: false }} />);
      expect(
        screen.getByRole("button", { name: /add to cart/i })
      ).toBeDisabled();
    });
  });

  describe("User interactions", () => {
    test("calls onAddToCart when button clicked", async () => {
      const mockOnAddToCart = jest.fn();
      render(
        <ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />
      );

      await userEvent.click(
        screen.getByRole("button", { name: /add to cart/i })
      );

      expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct);
    });

    test("shows success message after adding to cart", async () => {
      render(<ProductCard product={mockProduct} />);

      await userEvent.click(
        screen.getByRole("button", { name: /add to cart/i })
      );

      expect(screen.getByText(/added to cart/i)).toBeInTheDocument();
    });
  });
});

// ==========================================
// 9. CLEANUP EXAMPLE
// ==========================================

describe("Component with side effects", () => {
  beforeEach(() => {
    // Setup
    jest.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    // Cleanup - important!
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    localStorage.clear();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test("saves to localStorage after delay", () => {
    render(<AutoSaveForm />);

    userEvent.type(screen.getByLabelText(/notes/i), "test data");

    // Fast-forward timers
    jest.advanceTimersByTime(1000);

    expect(localStorage.getItem("notes")).toBe("test data");
  });
});

// ==========================================
// SUMMARY TEMPLATE - Copy this structure!
// ==========================================

describe("YourComponent", () => {
  // Shared test data
  let mockData;
  let mockCallback;

  // Setup before each test
  beforeEach(() => {
    mockData = createTestData();
    mockCallback = jest.fn();
    jest.clearAllMocks();
  });

  // Cleanup after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Group related tests
  describe("Scenario 1", () => {
    test("specific behavior 1", () => {
      // Arrange
      // Act
      // Assert
    });

    test("specific behavior 2", () => {
      // Arrange
      // Act
      // Assert
    });
  });

  describe("Scenario 2", () => {
    test("edge case 1", () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
