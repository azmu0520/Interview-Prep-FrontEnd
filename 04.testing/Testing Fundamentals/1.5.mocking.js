// ==========================================
// 1.5 MOCKING FUNDAMENTALS - PRACTICAL EXAMPLES
// ==========================================

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ==========================================
// 1. BASIC jest.fn() - Mock Functions
// ==========================================

describe("jest.fn() basics", () => {
  test("creates a mock function", () => {
    const mockFn = jest.fn();

    // Call it
    mockFn("hello", "world");

    // Verify it was called
    expect(mockFn).toHaveBeenCalled();
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("hello", "world");
  });

  test("mock with return value", () => {
    const mockFn = jest.fn(() => 42);

    const result = mockFn();

    expect(result).toBe(42);
    expect(mockFn).toHaveBeenCalled();
  });

  test("mock with different implementations", () => {
    const mockAdd = jest.fn((a, b) => a + b);

    expect(mockAdd(2, 3)).toBe(5);
    expect(mockAdd(10, 20)).toBe(30);
    expect(mockAdd).toHaveBeenCalledTimes(2);
  });

  test("mockReturnValue for simple returns", () => {
    const mockFn = jest.fn().mockReturnValue("default value");

    expect(mockFn()).toBe("default value");
  });

  test("mockReturnValueOnce for sequential values", () => {
    const mockFn = jest
      .fn()
      .mockReturnValueOnce("first")
      .mockReturnValueOnce("second")
      .mockReturnValue("default");

    expect(mockFn()).toBe("first");
    expect(mockFn()).toBe("second");
    expect(mockFn()).toBe("default");
    expect(mockFn()).toBe("default");
  });

  // Real-world example
  test("button onClick handler", async () => {
    const handleClick = jest.fn();

    render(<button onClick={handleClick}>Click me</button>);

    await userEvent.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("form submission with data", async () => {
    const handleSubmit = jest.fn();

    render(
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit({ email: e.target.email.value });
        }}
      >
        <input name="email" />
        <button type="submit">Submit</button>
      </form>
    );

    await userEvent.type(screen.getByRole("textbox"), "test@example.com");
    await userEvent.click(screen.getByRole("button"));

    expect(handleSubmit).toHaveBeenCalledWith({
      email: "test@example.com",
    });
  });
});

// ==========================================
// 2. jest.spyOn() - Spying on Methods
// ==========================================

describe("jest.spyOn() for spying", () => {
  test("spy on object method", () => {
    const calculator = {
      add: (a, b) => a + b,
      subtract: (a, b) => a - b,
    };

    const spy = jest.spyOn(calculator, "add");

    // Call real method
    const result = calculator.add(2, 3);

    // Real result
    expect(result).toBe(5);

    // Verify it was called
    expect(spy).toHaveBeenCalledWith(2, 3);

    spy.mockRestore();
  });

  test("spy and override implementation", () => {
    const calculator = {
      add: (a, b) => a + b,
    };

    const spy = jest.spyOn(calculator, "add").mockImplementation(() => 999);

    // Mocked result
    expect(calculator.add(2, 3)).toBe(999);
    expect(spy).toHaveBeenCalled();

    // Restore original
    spy.mockRestore();
    expect(calculator.add(2, 3)).toBe(5);
  });

  test("spy on console methods", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {}); // Suppress output

    console.log("Hello", "World");

    expect(consoleSpy).toHaveBeenCalledWith("Hello", "World");

    consoleSpy.mockRestore();
  });

  test("spy on console.error to suppress warnings", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    // Code that logs errors
    console.error("Warning: deprecated API");

    expect(errorSpy).toHaveBeenCalledWith("Warning: deprecated API");

    errorSpy.mockRestore();
  });
});

// ==========================================
// 3. MOCKING MODULES
// ==========================================

// Mock entire API module
jest.mock("./api", () => ({
  fetchUser: jest.fn(),
  fetchPosts: jest.fn(),
  createPost: jest.fn(),
}));

import { fetchUser, fetchPosts, createPost } from "./api";

describe("Mocking modules", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("mock API call", async () => {
    fetchUser.mockResolvedValue({
      id: 1,
      name: "John Doe",
      email: "john@example.com",
    });

    render(<UserProfile userId={1} />);

    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(fetchUser).toHaveBeenCalledWith(1);
  });

  test("handle API error", async () => {
    fetchUser.mockRejectedValue(new Error("User not found"));

    render(<UserProfile userId={999} />);

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  test("multiple API calls", async () => {
    fetchUser.mockResolvedValue({ id: 1, name: "John" });
    fetchPosts.mockResolvedValue([
      { id: 1, title: "Post 1" },
      { id: 2, title: "Post 2" },
    ]);

    render(<UserDashboard userId={1} />);

    await waitFor(() => {
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("Post 1")).toBeInTheDocument();
    });

    expect(fetchUser).toHaveBeenCalledWith(1);
    expect(fetchPosts).toHaveBeenCalledWith(1);
  });
});

// ==========================================
// 4. MOCKING ASYNC FUNCTIONS
// ==========================================

describe("Mocking async functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("mockResolvedValue for successful promise", async () => {
    const mockFetch = jest.fn().mockResolvedValue({ data: "success" });

    const result = await mockFetch();

    expect(result).toEqual({ data: "success" });
  });

  test("mockRejectedValue for failed promise", async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error("Network error"));

    await expect(mockFetch()).rejects.toThrow("Network error");
  });

  test("sequential async responses", async () => {
    const mockFetch = jest
      .fn()
      .mockResolvedValueOnce({ data: "first" })
      .mockResolvedValueOnce({ data: "second" })
      .mockRejectedValue(new Error("Failed"));

    expect(await mockFetch()).toEqual({ data: "first" });
    expect(await mockFetch()).toEqual({ data: "second" });
    await expect(mockFetch()).rejects.toThrow("Failed");
  });

  // Real-world example: Mocking fetch
  test("fetch user data successfully", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 1,
          name: "John Doe",
          email: "john@example.com",
        }),
    });

    render(<UserProfile userId={1} />);

    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith("/api/users/1");
  });

  test("handle fetch error", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: "User not found" }),
    });

    render(<UserProfile userId={999} />);

    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });

  test("handle network error", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    render(<UserProfile userId={1} />);

    expect(await screen.findByText(/network error/i)).toBeInTheDocument();
  });
});

// ==========================================
// 5. MOCKING TIMERS
// ==========================================

describe("Mocking timers", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("setTimeout with fake timers", () => {
    const callback = jest.fn();

    setTimeout(callback, 1000);

    // Before time passes
    expect(callback).not.toHaveBeenCalled();

    // Fast-forward 1 second
    jest.advanceTimersByTime(1000);

    // Now callback should have fired
    expect(callback).toHaveBeenCalled();
  });

  test("multiple timers", () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    setTimeout(callback1, 100);
    setTimeout(callback2, 500);

    // Advance 100ms
    jest.advanceTimersByTime(100);
    expect(callback1).toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();

    // Advance another 400ms (total 500ms)
    jest.advanceTimersByTime(400);
    expect(callback2).toHaveBeenCalled();
  });

  test("runAllTimers executes all pending", () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    setTimeout(callback1, 100);
    setTimeout(callback2, 1000);

    // Run all timers immediately
    jest.runAllTimers();

    expect(callback1).toHaveBeenCalled();
    expect(callback2).toHaveBeenCalled();
  });

  // Real-world example: Debounced search
  test("debounced search input", () => {
    const onSearch = jest.fn();

    render(<DebouncedSearch onSearch={onSearch} delay={300} />);

    // Type quickly
    userEvent.type(screen.getByRole("textbox"), "test");

    // Before delay
    expect(onSearch).not.toHaveBeenCalled();

    // Fast-forward past delay
    jest.advanceTimersByTime(300);

    // Should be called once with final value
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith("test");
  });

  test("auto-save after inactivity", () => {
    const onSave = jest.fn();

    render(<AutoSaveEditor onSave={onSave} delay={5000} />);

    // Type something
    userEvent.type(screen.getByRole("textbox"), "Hello World");

    // Before auto-save
    expect(onSave).not.toHaveBeenCalled();

    // Fast-forward 5 seconds
    jest.advanceTimersByTime(5000);

    // Should auto-save
    expect(onSave).toHaveBeenCalledWith("Hello World");
  });

  test("setInterval with fake timers", () => {
    const callback = jest.fn();

    setInterval(callback, 1000);

    // Advance 3 seconds
    jest.advanceTimersByTime(3000);

    // Should be called 3 times
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

// ==========================================
// 6. CLEARING AND RESETTING MOCKS
// ==========================================

describe("Clearing and resetting mocks", () => {
  test("clearAllMocks clears call history", () => {
    const mockFn = jest.fn().mockReturnValue(42);

    mockFn();
    mockFn();
    expect(mockFn).toHaveBeenCalledTimes(2);

    jest.clearAllMocks();

    // History cleared
    expect(mockFn).toHaveBeenCalledTimes(0);

    // But implementation remains
    expect(mockFn()).toBe(42);
  });

  test("resetAllMocks removes implementation", () => {
    const mockFn = jest.fn().mockReturnValue(42);

    expect(mockFn()).toBe(42);

    jest.resetAllMocks();

    // Implementation gone
    expect(mockFn()).toBeUndefined();
  });

  test("restoreAllMocks restores originals", () => {
    const obj = {
      method: () => "original",
    };

    jest.spyOn(obj, "method").mockReturnValue("mocked");
    expect(obj.method()).toBe("mocked");

    jest.restoreAllMocks();

    // Original restored
    expect(obj.method()).toBe("original");
  });

  // Best practice: Clear in beforeEach
  describe("with cleanup", () => {
    const mockFn = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("test 1", () => {
      mockFn();
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test("test 2", () => {
      mockFn();
      // Still 1 because cleared in beforeEach
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});

// ==========================================
// 7. COMMON MOCKING PATTERNS
// ==========================================

describe("Common mocking patterns", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("mock localStorage", () => {
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    global.localStorage = localStorageMock;

    render(<UserPreferences />);

    expect(localStorageMock.getItem).toHaveBeenCalledWith("theme");
  });

  test("mock Date", () => {
    const mockDate = new Date("2024-01-01T00:00:00.000Z");
    jest.spyOn(global, "Date").mockImplementation(() => mockDate);

    const component = render(<CurrentDate />);

    expect(screen.getByText(/january 1, 2024/i)).toBeInTheDocument();

    global.Date.mockRestore();
  });

  test("mock Math.random for predictable randomness", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.5);

    expect(Math.random()).toBe(0.5);
    expect(Math.random()).toBe(0.5);

    Math.random.mockRestore();
  });

  test("mock window.alert", () => {
    global.alert = jest.fn();

    render(<AlertButton />);
    userEvent.click(screen.getByRole("button"));

    expect(alert).toHaveBeenCalledWith("Button clicked!");
  });

  test("mock window.confirm", () => {
    global.confirm = jest.fn().mockReturnValue(true);

    render(<DeleteButton />);
    userEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(confirm).toHaveBeenCalledWith("Are you sure?");
  });

  test("mock navigator.clipboard", async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(),
      },
    });

    render(<CopyButton text="Hello" />);
    await userEvent.click(screen.getByRole("button"));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("Hello");
  });
});

// ==========================================
// 8. REAL-WORLD COMPLETE EXAMPLE
// ==========================================

describe("UserDashboard - Complete mocking example", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("loads user and displays data", async () => {
    // Mock API calls
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            name: "John Doe",
            email: "john@example.com",
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            { id: 1, title: "Post 1", likes: 10 },
            { id: 2, title: "Post 2", likes: 5 },
          ]),
      });

    // Mock localStorage
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue("dark"),
      setItem: jest.fn(),
    };
    global.localStorage = mockLocalStorage;

    render(<UserDashboard userId={1} />);

    // Check loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for data
    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post 2")).toBeInTheDocument();

    // Verify API calls
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledWith("/api/users/1");
    expect(fetch).toHaveBeenCalledWith("/api/users/1/posts");

    // Verify localStorage
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith("theme");
  });

  test("handles errors gracefully", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    render(<UserDashboard userId={1} />);

    expect(await screen.findByText(/error loading/i)).toBeInTheDocument();
  });

  test("refreshes data on interval", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 1,
          name: "John",
          email: "john@example.com",
        }),
    });
    global.fetch = mockFetch;

    render(<UserDashboard userId={1} autoRefresh={true} />);

    // Initial load
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    // Fast-forward 30 seconds
    jest.advanceTimersByTime(30000);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });
});

// ==========================================
// SUMMARY: MOCKING CHECKLIST
// ==========================================

/*
✅ MOCKING CHECKLIST:

1. Create mocks:
   - jest.fn() for functions
   - jest.spyOn() for existing methods
   - jest.mock() for modules

2. Configure returns:
   - mockReturnValue() for sync
   - mockResolvedValue() for async success
   - mockRejectedValue() for async failure

3. Verify calls:
   - toHaveBeenCalled()
   - toHaveBeenCalledWith()
   - toHaveBeenCalledTimes()

4. Cleanup:
   - jest.clearAllMocks() in beforeEach
   - jest.restoreAllMocks() for spies
   - jest.useRealTimers() after fake timers

5. Common patterns:
   - Mock fetch/API calls
   - Mock localStorage
   - Mock timers (setTimeout, setInterval)
   - Mock console methods
   - Mock Date/Math.random

6. Best practices:
   - Only mock dependencies, not what you're testing
   - Keep mocks realistic
   - Don't over-mock
   - Clear between tests
*/
