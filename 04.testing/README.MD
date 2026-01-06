# Testing - Complete Interview Preparation Guide

### Comprehensive guide for Senior Frontend Engineer role

---

## 📋 Table of Contents

1. [Testing Fundamentals](#1-testing-fundamentals) - ⭐⭐⭐ CRITICAL
2. [Jest & Testing Library](#2-jest--testing-library) - ⭐⭐⭐ CRITICAL
3. [React Testing](#3-react-testing) - ⭐⭐⭐ CRITICAL
4. [Integration Testing](#4-integration-testing) - ⭐⭐ IMPORTANT
5. [End-to-End Testing](#5-end-to-end-testing) - ⭐⭐ IMPORTANT
6. [Test Design Patterns](#6-test-design-patterns) - ⭐⭐ IMPORTANT
7. [Advanced Testing Concepts](#7-advanced-testing-concepts) - ⭐ GOOD TO KNOW

---

## 1. Testing Fundamentals

> ⭐⭐⭐ **CRITICAL**

### 1.1 Testing Philosophy & Principles

#### Topics to Master:

- Testing pyramid (unit, integration, E2E)
- Testing trophy (focus on integration)
- Test-Driven Development (TDD)
- Behavior-Driven Development (BDD)
- Test coverage vs test quality
- Testing implementation vs behavior
- AAA pattern (Arrange, Act, Assert)
- Given-When-Then pattern
- Testing best practices

#### Key Understanding Points:

- Tests document code behavior
- Test behavior, not implementation details
- Good tests are maintainable and readable
- Integration tests provide most value
- 100% coverage doesn't mean bug-free code
- Tests should fail for the right reasons
- Fast feedback loop is crucial
- Tests enable refactoring confidence

#### Common Interview Questions:

- What's the testing pyramid vs testing trophy?
- What's the difference between unit and integration tests?
- How do you decide what to test?
- What's TDD and its benefits?
- How do you measure test quality (not just coverage)?
- When should you write tests: before or after code?

---

### 1.2 Types of Tests

#### Topics to Master:

- Unit tests (isolated, single function/component)
- Integration tests (multiple units working together)
- End-to-End tests (full user flows)
- Acceptance tests
- Smoke tests
- Regression tests
- Visual regression tests
- Performance tests
- Accessibility tests

#### Key Understanding Points:

- Each test type serves different purpose
- Unit tests: fast, isolated, many
- Integration tests: confident, realistic, moderate speed
- E2E tests: full confidence, slow, few
- Mix all types for comprehensive coverage
- Most value in integration tests
- E2E tests for critical user paths only

#### Common Interview Questions:

- Explain the difference between unit, integration, and E2E tests
- When would you use each type of test?
- What's the ideal ratio of unit:integration:E2E tests?
- What are smoke tests?
- How do visual regression tests work?

---

### 1.3 Test Anatomy

#### Topics to Master:

- describe/test/it blocks
- beforeEach/afterEach hooks
- beforeAll/afterAll hooks
- Test setup and teardown
- Test isolation
- Test naming conventions
- Test organization
- Only/skip for debugging

#### Key Understanding Points:

- Each test should be independent
- Setup/teardown ensures clean state
- Descriptive names explain what's tested
- Group related tests with describe
- beforeEach runs before each test
- beforeAll runs once before all tests
- Use only/skip temporarily for debugging

#### Common Interview Questions:

- How do you structure test files?
- What's the difference between beforeEach and beforeAll?
- How do you ensure test isolation?
- What makes a good test name?
- How do you organize tests in large projects?

```javascript
describe("Calculator", () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  afterEach(() => {
    calculator.clear();
  });

  describe("addition", () => {
    test("adds two positive numbers", () => {
      expect(calculator.add(2, 3)).toBe(5);
    });

    test("adds negative numbers", () => {
      expect(calculator.add(-2, -3)).toBe(-5);
    });
  });
});
```

---

### 1.4 Assertions & Matchers

#### Topics to Master:

- expect() API
- Common matchers (toBe, toEqual, toBeTruthy)
- Negation with .not
- Async matchers (resolves, rejects)
- Array matchers (toContain, toHaveLength)
- Object matchers (toHaveProperty, toMatchObject)
- String matchers (toMatch, toContain)
- Number matchers (toBeGreaterThan, toBeCloseTo)
- Custom matchers

#### Key Understanding Points:

- toBe for primitives (===)
- toEqual for objects (deep equality)
- toBeTruthy vs toBe(true)
- toHaveBeenCalled for spies/mocks
- Use specific matchers for better errors
- Async matchers with await
- Custom matchers for domain logic

#### Common Interview Questions:

- What's the difference between toBe and toEqual?
- How do you test async code?
- What matchers would you use for arrays?
- How do you create custom matchers?
- When would you use toBeTruthy vs toBe(true)?

```javascript
// Primitives
expect(1 + 1).toBe(2);

// Objects
expect(user).toEqual({ name: "John", age: 30 });
expect(user).toHaveProperty("name");

// Arrays
expect(items).toHaveLength(3);
expect(items).toContain("apple");

// Async
await expect(fetchUser()).resolves.toEqual({ name: "John" });
await expect(fetchUser()).rejects.toThrow("Not found");
```

---

### 1.5 Mocking Fundamentals

#### Topics to Master:

- Why mock?
- Mock vs Stub vs Spy
- jest.fn() for mock functions
- jest.spyOn() for existing functions
- Mock implementations
- Mock return values
- Mock timers (jest.useFakeTimers)
- Mock modules
- Partial mocks
- Clearing/resetting mocks

#### Key Understanding Points:

- Mocks isolate code under test
- Replace dependencies with controlled versions
- Verify function calls and arguments
- Stub: returns fixed values
- Spy: records calls to real function
- Mock: fully controlled replacement
- Clear mocks between tests
- Don't over-mock (test reality)

#### Common Interview Questions:

- What's the difference between mock, stub, and spy?
- When should you mock?
- When should you NOT mock?
- How do you mock external APIs?
- How do you verify mock calls?

```javascript
// Mock function
const mockFn = jest.fn();
mockFn("hello");
expect(mockFn).toHaveBeenCalledWith("hello");

// Mock return value
mockFn.mockReturnValue(42);
expect(mockFn()).toBe(42);

// Mock implementation
mockFn.mockImplementation((x) => x * 2);

// Spy on method
const spy = jest.spyOn(object, "method");
object.method();
expect(spy).toHaveBeenCalled();
spy.mockRestore();

// Mock timers
jest.useFakeTimers();
setTimeout(() => callback(), 1000);
jest.advanceTimersByTime(1000);
expect(callback).toHaveBeenCalled();
jest.useRealTimers();
```

---

## 2. Jest & Testing Library

> ⭐⭐⭐ **CRITICAL**

### 2.1 Jest Configuration

#### Topics to Master:

- jest.config.js setup
- Test environment (jsdom, node)
- Transform configuration
- Coverage configuration
- Module name mapping (path aliases)
- Setup files (setupFilesAfterEnv)
- Test match patterns
- Globals and test timeout
- Watch mode options

#### Key Understanding Points:

- jest.config.js controls Jest behavior
- jsdom simulates browser environment
- Transform handles TypeScript/JSX
- setupFilesAfterEnv for global test setup
- moduleNameMapper resolves import paths
- Coverage thresholds enforce minimum coverage
- Watch mode for fast feedback

#### Common Interview Questions:

- How do you configure Jest for React?
- What's the difference between jsdom and node environment?
- How do you handle path aliases in tests?
- Where do you put global test setup code?
- How do you configure code coverage thresholds?

```javascript
// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

---

### 2.2 Testing Library Philosophy

#### Topics to Master:

- Guiding principles (test like users)
- Query priority (getBy, queryBy, findBy)
- Accessibility-first queries
- Avoiding implementation details
- User-centric testing
- Semantic queries vs test IDs
- waitFor and async utilities
- User events vs fireEvent

#### Key Understanding Points:

- Test from user's perspective
- Prefer accessible queries (getByRole, getByLabelText)
- getBy: throws if not found (assertions)
- queryBy: returns null if not found (existence checks)
- findBy: async version (waits for element)
- Avoid testID unless necessary
- Use userEvent over fireEvent
- Don't test implementation details

#### Common Interview Questions:

- What are Testing Library's guiding principles?
- When would you use getBy vs queryBy vs findBy?
- Why prefer getByRole over getByTestId?
- What's the difference between fireEvent and userEvent?
- How do you test async behavior?

```javascript
// Query priority
// 1. getByRole (accessibility)
const button = getByRole("button", { name: /submit/i });

// 2. getByLabelText (forms)
const input = getByLabelText(/username/i);

// 3. getByPlaceholderText
const search = getByPlaceholderText(/search/i);

// 4. getByText
const heading = getByText(/welcome/i);

// 5. getByTestId (last resort)
const element = getByTestId("custom-element");

// Async queries
const loading = queryByText(/loading/i); // null if not found
const data = await findByText(/data loaded/i); // waits
```

---

### 2.3 Queries and Selectors

#### Topics to Master:

- getBy\* queries (single, throws)
- queryBy\* queries (single, null)
- findBy\* queries (async, single)
- getAllBy*, queryAllBy*, findAllBy\* (multiple)
- ByRole query options (name, level, etc.)
- TextMatch options (string, regex, function)
- within() for scoped queries
- screen vs container queries
- Custom queries

#### Key Understanding Points:

- Single queries throw/return null
- Multiple queries return arrays
- getBy for assertions
- queryBy for existence checks
- findBy for async elements
- TextMatch accepts string/regex/function
- within() limits query scope
- screen recommended over container

#### Common Interview Questions:

- When would you use getAllBy vs findAllBy?
- How do you query nested elements?
- What are TextMatch options?
- How do you query by accessible name?
- When would you write a custom query?

```javascript
// Single queries
getByRole("button"); // throws if not found
queryByRole("button"); // returns null
await findByRole("button"); // async, waits

// Multiple queries
getAllByRole("listitem"); // throws if none
queryAllByRole("listitem"); // returns []
await findAllByRole("listitem"); // async

// ByRole with options
getByRole("heading", { level: 1, name: /title/i });
getByRole("button", { name: /submit/i });

// TextMatch variants
getByText("Hello"); // exact string
getByText(/hello/i); // regex, case-insensitive
getByText((content, element) => content.startsWith("Hello"));

// Scoped queries
const form = getByRole("form");
const input = within(form).getByLabelText(/email/i);
```

---

### 2.4 User Interactions

#### Topics to Master:

- userEvent library (preferred)
- click(), type(), clear()
- keyboard(), hover(), unhover()
- selectOptions(), upload()
- Tab navigation
- fireEvent (legacy, less realistic)
- Async user events
- Setup and cleanup

#### Key Understanding Points:

- userEvent simulates real user behavior
- More realistic than fireEvent
- Handles focus, blur, hover properly
- Keyboard events fire in correct order
- Type() types character by character
- Always await userEvent calls
- Use userEvent.setup() for v14+

#### Common Interview Questions:

- Why use userEvent over fireEvent?
- How do you simulate keyboard interactions?
- How do you test file uploads?
- How do you test form submissions?
- What's the difference between click and fireEvent.click?

```javascript
import userEvent from "@testing-library/user-event";

test("form interaction", async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  // Type into input
  await user.type(getByLabelText(/username/i), "john");

  // Click button
  await user.click(getByRole("button", { name: /submit/i }));

  // Keyboard navigation
  await user.keyboard("{Enter}");
  await user.tab(); // Tab to next element

  // Select dropdown
  await user.selectOptions(getByRole("combobox"), ["option1", "option2"]);

  // File upload
  const file = new File(["hello"], "hello.png", { type: "image/png" });
  await user.upload(getByLabelText(/upload/i), file);
});
```

---

### 2.5 Async Testing

#### Topics to Master:

- waitFor() utility
- findBy\* queries (built-in waiting)
- waitForElementToBeRemoved()
- act() warnings and resolution
- Fake timers with async
- Testing loading states
- Testing error states
- Timeout configuration

#### Key Understanding Points:

- findBy automatically waits
- waitFor for complex conditions
- Default timeout 1000ms
- waitForElementToBeRemoved for disappearing elements
- act() warnings mean state updates outside React
- Fake timers need special handling with async
- Test loading AND loaded states

#### Common Interview Questions:

- How do you test async data fetching?
- When would you use waitFor vs findBy?
- What causes act() warnings?
- How do you test loading states?
- How do you handle timeouts in tests?

```javascript
// Using findBy (preferred for single elements)
const heading = await findByText(/data loaded/i);

// Using waitFor for complex conditions
await waitFor(() => {
  expect(getByText(/success/i)).toBeInTheDocument();
});

// Wait for element removal
await waitForElementToBeRemoved(() => queryByText(/loading/i));

// Custom timeout
await findByText(/slow data/i, {}, { timeout: 5000 });

// Testing loading state
test("shows loading then data", async () => {
  render(<DataComponent />);

  // Check loading state
  expect(getByText(/loading/i)).toBeInTheDocument();

  // Wait for data
  await waitForElementToBeRemoved(() => queryByText(/loading/i));
  expect(getByText(/data loaded/i)).toBeInTheDocument();
});
```

---

### 2.6 Custom Render Functions

#### Topics to Master:

- Wrapper components (providers)
- Custom render with providers
- Router testing setup
- Redux store setup
- Theme provider setup
- Query client setup
- Reusable test utilities
- Custom queries

#### Key Understanding Points:

- Wrap components with needed providers
- Create custom render function
- Include all providers app uses
- Export both render and screen
- Re-export everything from Testing Library
- Centralize test setup
- Makes tests cleaner and DRYer

#### Common Interview Questions:

- Why create custom render functions?
- How do you test components that need providers?
- How do you test Redux-connected components?
- How do you test components using React Router?

```javascript
// test-utils.jsx
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";

function AllTheProviders({ children }) {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
}

function customRender(ui, options) {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };

// Usage in tests
import { render, screen } from "./test-utils";

test("my test", () => {
  render(<MyComponent />); // Automatically wrapped!
});
```

---

## 3. React Testing

> ⭐⭐⭐ **CRITICAL**

### 3.1 Component Testing Basics

#### Topics to Master:

- Rendering components
- Testing props
- Testing conditional rendering
- Testing default props
- Testing component output
- Snapshot testing (use sparingly)
- Testing children
- Isolated vs integrated component tests

#### Key Understanding Points:

- Test component from user perspective
- Pass props and verify output
- Test all prop variations
- Avoid testing implementation
- Snapshot tests break easily
- Test behavior over structure
- Integration tests often better than isolated

#### Common Interview Questions:

- How do you test React components?
- When would you use snapshot tests?
- How do you test props?
- Should you test every component in isolation?

```javascript
// Component
function Greeting({ name, isAdmin }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      {isAdmin && <span>Admin</span>}
    </div>
  );
}

// Tests
test("renders user name", () => {
  render(<Greeting name="John" />);
  expect(screen.getByText(/hello, john/i)).toBeInTheDocument();
});

test("shows admin badge for admins", () => {
  render(<Greeting name="Admin" isAdmin />);
  expect(screen.getByText(/admin/i)).toBeInTheDocument();
});

test("does not show admin badge for regular users", () => {
  render(<Greeting name="User" isAdmin={false} />);
  expect(screen.queryByText(/admin/i)).not.toBeInTheDocument();
});
```

---

### 3.2 Testing Hooks

#### Topics to Master:

- @testing-library/react-hooks (legacy)
- renderHook from @testing-library/react (modern)
- Testing custom hooks
- Testing hook return values
- Testing hook updates
- Testing hooks with providers
- Testing async hooks
- Testing hook dependencies

#### Key Understanding Points:

- Test hooks in isolation with renderHook
- Modern: renderHook built into Testing Library
- Access hook return with result.current
- Use act() for updates
- rerender() to change props
- Test hooks with real components when possible
- Integration tests often better

#### Common Interview Questions:

- How do you test custom hooks?
- When should you test hooks in isolation?
- How do you test useEffect dependencies?
- How do you test async hooks?

```javascript
import { renderHook, act } from "@testing-library/react";

// Custom hook
function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const increment = () => setCount((c) => c + 1);
  return { count, increment };
}

// Test
test("increments counter", () => {
  const { result } = renderHook(() => useCounter());

  expect(result.current.count).toBe(0);

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});

// Test with initial value
test("uses initial value", () => {
  const { result } = renderHook(() => useCounter(5));
  expect(result.current.count).toBe(5);
});

// Test with providers
test("hook with context", () => {
  const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

  const { result } = renderHook(() => useTheme(), { wrapper });
  expect(result.current.theme).toBeDefined();
});
```

---

### 3.3 Testing Events and Interactions

#### Topics to Master:

- Click events
- Form submissions
- Input changes
- Keyboard events
- Focus/blur events
- Hover events
- Drag and drop
- Touch events
- Custom events

#### Key Understanding Points:

- Use userEvent for realistic interactions
- Test complete user workflows
- Verify state changes after events
- Test event handlers are called
- Test with actual user behavior
- Combine multiple interactions
- Test accessibility (keyboard navigation)

#### Common Interview Questions:

- How do you test button clicks?
- How do you test form submissions?
- How do you test keyboard navigation?
- How do you verify event handlers are called?

```javascript
test("form submission", async () => {
  const handleSubmit = jest.fn();
  const user = userEvent.setup();

  render(<Form onSubmit={handleSubmit} />);

  // Fill form
  await user.type(screen.getByLabelText(/username/i), "john");
  await user.type(screen.getByLabelText(/password/i), "secret");

  // Submit
  await user.click(screen.getByRole("button", { name: /submit/i }));

  // Verify handler called
  expect(handleSubmit).toHaveBeenCalledWith({
    username: "john",
    password: "secret",
  });
});

test("keyboard navigation", async () => {
  const user = userEvent.setup();
  render(<Menu />);

  const firstItem = screen.getByRole("menuitem", { name: /home/i });
  firstItem.focus();

  await user.keyboard("{ArrowDown}");
  expect(screen.getByRole("menuitem", { name: /about/i })).toHaveFocus();
});
```

---

### 3.4 Testing Async Components

#### Topics to Master:

- Data fetching components
- Loading states
- Error states
- Suspense boundaries
- Error boundaries
- Retry logic
- Polling/intervals
- Debouncing/throttling

#### Key Understanding Points:

- Test all states: loading, success, error
- Mock API calls
- Use waitFor/findBy for async
- Test error handling
- Test loading indicators
- Test retry mechanisms
- Fake timers for intervals
- Test edge cases

#### Common Interview Questions:

- How do you test data fetching in React?
- How do you test loading states?
- How do you test error boundaries?
- How do you mock API calls?

```javascript
test("loads and displays data", async () => {
  // Mock API
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ name: "John" }),
    })
  );

  render(<UserProfile userId="123" />);

  // Check loading
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // Wait for data
  expect(await screen.findByText(/john/i)).toBeInTheDocument();

  // Verify API called correctly
  expect(fetch).toHaveBeenCalledWith("/api/users/123");
});

test("displays error message", async () => {
  // Mock failed API call
  global.fetch = jest.fn(() => Promise.reject(new Error("Failed to fetch")));

  render(<UserProfile userId="123" />);

  expect(await screen.findByText(/error loading/i)).toBeInTheDocument();
});

test("retry on error", async () => {
  const user = userEvent.setup();
  global.fetch = jest.fn(() => Promise.reject());

  render(<UserProfile userId="123" />);

  await screen.findByText(/error/i);

  // Click retry
  await user.click(screen.getByRole("button", { name: /retry/i }));

  // Verify called again
  expect(fetch).toHaveBeenCalledTimes(2);
});
```

---

### 3.5 Testing Context and State Management

#### Topics to Master:

- React Context testing
- Redux testing (connected components)
- Redux async actions
- Zustand/Jotai testing
- React Query testing
- Provider mocking
- Testing context updates
- Testing selectors

#### Key Understanding Points:

- Wrap components with providers
- Mock store state for Redux
- Use custom render with providers
- Test context changes
- Mock query client for React Query
- Test integration with state
- Don't test library internals

#### Common Interview Questions:

- How do you test components using Context?
- How do you test Redux-connected components?
- How do you test React Query components?
- Should you test Redux actions/reducers separately?

```javascript
// Testing Context
const ThemeContext = createContext();

test("uses theme from context", () => {
  render(
    <ThemeContext.Provider value={{ color: "blue" }}>
      <ThemedButton />
    </ThemeContext.Provider>
  );

  expect(screen.getByRole("button")).toHaveStyle({
    backgroundColor: "blue",
  });
});

// Testing Redux
test("dispatches action on click", () => {
  const store = createStore(reducer);

  render(
    <Provider store={store}>
      <Counter />
    </Provider>
  );

  userEvent.click(screen.getByRole("button", { name: /increment/i }));

  expect(store.getState().count).toBe(1);
});

// Testing React Query
test("loads data with React Query", async () => {
  const queryClient = new QueryClient();

  render(
    <QueryClientProvider client={queryClient}>
      <UserList />
    </QueryClientProvider>
  );

  expect(await screen.findByText(/user 1/i)).toBeInTheDocument();
});
```

---

### 3.6 Testing Routing

#### Topics to Master:

- React Router testing
- Route parameters
- Navigation testing
- Protected routes
- Redirects
- Query parameters
- History manipulation
- Memory router for tests

#### Key Understanding Points:

- Use MemoryRouter for tests
- Set initial entries for routes
- Test navigation between routes
- Verify URL changes
- Test route guards
- Mock useNavigate/useLocation
- Test dynamic routes

#### Common Interview Questions:

- How do you test React Router components?
- How do you test navigation?
- How do you test protected routes?
- How do you test route parameters?

```javascript
import { MemoryRouter, Route, Routes } from "react-router-dom";

test("navigates to user page", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:id" element={<User />} />
      </Routes>
    </MemoryRouter>
  );

  await user.click(screen.getByText(/view user/i));

  expect(screen.getByText(/user profile/i)).toBeInTheDocument();
});

test("handles route parameters", () => {
  render(
    <MemoryRouter initialEntries={["/user/123"]}>
      <Routes>
        <Route path="/user/:id" element={<User />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/user 123/i)).toBeInTheDocument();
});

test("redirects when not authenticated", () => {
  const isAuthenticated = false;

  render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/login page/i)).toBeInTheDocument();
});
```

---

## 4. Integration Testing

> ⭐⭐ **IMPORTANT**

### 4.1 Integration Testing Philosophy

#### Topics to Master:

- What is integration testing
- Integration vs unit testing
- Testing component composition
- Testing feature flows
- Real vs mocked dependencies
- Integration test scope
- When to integrate vs isolate

#### Key Understanding Points:

- Integration tests verify units work together
- More confidence than unit tests
- Test user flows and features
- Balance between unit and E2E
- Mock at boundaries (APIs, external services)
- Keep dependencies real when possible
- Focus on happy and error paths

#### Common Interview Questions:

- What's the difference between integration and unit tests?
- When should you write integration tests?
- What should be mocked in integration tests?
- How do integration tests differ from E2E tests?

---

### 4.2 API Mocking (MSW)

#### Topics to Master:

- Mock Service Worker (MSW) setup
- Request handlers
- REST API mocking
- GraphQL API mocking
- Response composition
- Error responses
- Delayed responses
- Request validation
- Server vs browser mocking

#### Key Understanding Points:

- MSW intercepts network requests
- Works in tests and browser
- Mocks at network level
- More realistic than jest.mock
- Define handlers once, use everywhere
- Test with actual fetch/axios
- Can delay responses for loading states

#### Common Interview Questions:

- What is MSW and why use it?
- How does MSW compare to mocking fetch?
- How do you test loading states with MSW?
- How do you test error responses?

```javascript
// handlers.js
import { rest } from "msw";

export const handlers = [
  rest.get("/api/users/:id", (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.json({
        id,
        name: "John Doe",
      })
    );
  }),

  rest.post("/api/users", async (req, res, ctx) => {
    const { name } = await req.json();
    return res(ctx.status(201), ctx.json({ id: "123", name }));
  }),
];

// server.js (for tests)
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);

// jest.setup.js
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// test
test("fetches user data", async () => {
  render(<UserProfile userId="123" />);

  expect(await screen.findByText(/john doe/i)).toBeInTheDocument();
});

test("handles API errors", async () => {
  // Override handler for this test
  server.use(
    rest.get("/api/users/:id", (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ error: "Server error" }));
    })
  );

  render(<UserProfile userId="123" />);

  expect(await screen.findByText(/error/i)).toBeInTheDocument();
});

test("simulates loading", async () => {
  server.use(
    rest.get("/api/users/:id", (req, res, ctx) => {
      return res(ctx.delay(100), ctx.json({ name: "John" }));
    })
  );

  render(<UserProfile userId="123" />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  expect(await screen.findByText(/john/i)).toBeInTheDocument();
});
```

---

### 4.3 Testing Forms

#### Topics to Master:

- Form submission testing
- Form validation
- Multi-step forms
- Field dependencies
- Async validation
- File uploads
- Form state management
- Error messages
- Success states

#### Key Understanding Points:

- Test complete form flows
- Fill all fields realistically
- Test validation messages
- Test both client and server errors
- Test happy and unhappy paths
- Verify submission payload
- Test disabled states
- Test field interactions

#### Common Interview Questions:

- How do you test form validation?
- How do you test async form submission?
- How do you test multi-step forms?
- How do you verify form data?

```javascript
test("validates and submits form", async () => {
  const handleSubmit = jest.fn();
  const user = userEvent.setup();

  render(<RegistrationForm onSubmit={handleSubmit} />);

  // Submit empty form
  await user.click(screen.getByRole("button", { name: /submit/i }));

  // Validation errors appear
  expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  expect(screen.getByText(/password is required/i)).toBeInTheDocument();

  // Fill form correctly
  await user.type(screen.getByLabelText(/email/i), "test@example.com");
  await user.type(screen.getByLabelText(/password/i), "Password123!");
  await user.type(screen.getByLabelText(/confirm/i), "Password123!");

  // Submit
  await user.click(screen.getByRole("button", { name: /submit/i }));

  // Success
  expect(handleSubmit).toHaveBeenCalledWith({
    email: "test@example.com",
    password: "Password123!",
  });
});

test("shows server validation errors", async () => {
  server.use(
    rest.post("/api/register", (req, res, ctx) => {
      return res(
        ctx.status(400),
        ctx.json({ errors: { email: "Email already exists" } })
      );
    })
  );

  const user = userEvent.setup();
  render(<RegistrationForm />);

  await user.type(screen.getByLabelText(/email/i), "existing@test.com");
  await user.type(screen.getByLabelText(/password/i), "Password123!");
  await user.click(screen.getByRole("button", { name: /submit/i }));

  expect(await screen.findByText(/email already exists/i)).toBeInTheDocument();
});
```

---

### 4.4 Testing Feature Flows

#### Topics to Master:

- Multi-component workflows
- User journeys
- Cross-cutting concerns
- Feature integration
- Complex interactions
- State propagation
- Side effects testing

#### Key Understanding Points:

- Test complete user workflows
- Involve multiple components
- Test realistic scenarios
- Verify state across components
- Test component communication
- Higher confidence than unit tests
- Closer to real usage

#### Common Interview Questions:

- How do you test complex user workflows?
- When should you write feature flow tests?
- How do you test state sharing between components?

```javascript
test("complete shopping flow", async () => {
  const user = userEvent.setup();

  render(<App />);

  // Browse products
  expect(screen.getByText(/products/i)).toBeInTheDocument();

  // Add to cart
  await user.click(screen.getAllByRole("button", { name: /add to cart/i })[0]);

  // Check cart badge
  expect(screen.getByText(/1 item/i)).toBeInTheDocument();

  // Go to cart
  await user.click(screen.getByRole("link", { name: /cart/i }));

  // Proceed to checkout
  await user.click(screen.getByRole("button", { name: /checkout/i }));

  // Fill shipping info
  await user.type(screen.getByLabelText(/name/i), "John Doe");
  await user.type(screen.getByLabelText(/address/i), "123 Main St");

  // Place order
  await user.click(screen.getByRole("button", { name: /place order/i }));

  // Verify success
  expect(
    await screen.findByText(/order placed successfully/i)
  ).toBeInTheDocument();
});
```

---

## 5. End-to-End Testing

> ⭐⭐ **IMPORTANT**

### 5.1 E2E Testing Philosophy

#### Topics to Master:

- What is E2E testing
- E2E vs integration testing
- When to write E2E tests
- E2E test scope
- Critical user paths
- Test pyramid placement
- E2E test maintenance

#### Key Understanding Points:

- E2E tests entire application
- Tests from user's perspective
- Slow and expensive
- High confidence
- Focus on critical paths
- Fewer E2E tests than other types
- Run against real or staging environment

#### Common Interview Questions:

- What makes a good E2E test?
- How many E2E tests should you have?
- When would you choose E2E over integration?
- What are challenges with E2E tests?

---

### 5.2 Playwright Basics

#### Topics to Master:

- Playwright setup
- Browser launching
- Page navigation
- Element selectors
- Actions (click, type, etc.)
- Assertions
- Screenshots and videos
- Test isolation
- Browser contexts

#### Key Understanding Points:

- Playwright tests real browsers
- Supports multiple browsers
- Auto-waits for elements
- Built-in test runner
- Parallel execution
- Network interception
- Mobile emulation

#### Common Interview Questions:

- Why use Playwright?
- How does Playwright compare to Cypress?
- How does Playwright handle waiting?
- Can Playwright test mobile?

```javascript
import { test, expect } from "@playwright/test";

test("user can log in", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await page.fill('input[name="email"]', "test@example.com");
  await page.fill('input[name="password"]', "password123");
  await page.click('button[type="submit"]');

  await expect(page.locator("text=Welcome")).toBeVisible();
});

test("handles login error", async ({ page }) => {
  await page.goto("http://localhost:3000/login");

  await page.fill('input[name="email"]', "wrong@example.com");
  await page.fill('input[name="password"]', "wrong");
  await page.click('button[type="submit"]');

  await expect(page.locator("text=Invalid credentials")).toBeVisible();
});
```

---

### 5.3 Cypress Basics

#### Topics to Master:

- Cypress setup and configuration
- Commands (cy.get, cy.visit, etc.)
- Cypress selectors
- Cypress assertions
- Custom commands
- Network stubbing (cy.intercept)
- Fixtures
- Cypress Studio

#### Key Understanding Points:

- Cypress runs in browser
- Automatic waiting
- Time travel debugging
- Real-time reloads
- Great developer experience
- Chrome/Edge/Firefox only
- Good documentation

#### Common Interview Questions:

- How does Cypress differ from Playwright?
- What are Cypress custom commands?
- How do you stub network requests in Cypress?
- What is Cypress's retry-ability?

```javascript
describe("Login", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("logs in successfully", () => {
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('button[type="submit"]').click();

    cy.contains("Welcome").should("be.visible");
    cy.url().should("include", "/dashboard");
  });

  it("shows error for invalid credentials", () => {
    cy.intercept("POST", "/api/login", {
      statusCode: 401,
      body: { error: "Invalid credentials" },
    });

    cy.get('input[name="email"]').type("wrong@example.com");
    cy.get('input[name="password"]').type("wrong");
    cy.get('button[type="submit"]').click();

    cy.contains("Invalid credentials").should("be.visible");
  });
});

// Custom command
Cypress.Commands.add("login", (email, password) => {
  cy.visit("/login");
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

// Usage
cy.login("test@example.com", "password123");
```

---

### 5.4 Selectors and Best Practices

#### Topics to Master:

- data-testid attributes
- Accessible selectors (role, label)
- CSS selectors (last resort)
- XPath selectors
- Text-based selectors
- Selector priorities
- Avoiding brittle selectors

#### Key Understanding Points:

- Prefer accessible selectors
- data-testid for unique elements
- Avoid CSS classes (implementation detail)
- Text content can break with i18n
- Balance specificity and maintainability
- Use page objects for complex apps

#### Common Interview Questions:

- What makes a good E2E selector?
- When should you use data-testid?
- Why avoid CSS class selectors?
- How do you make selectors maintainable?

---

### 5.5 Page Object Model

#### Topics to Master:

- Page Object pattern
- Encapsulating page interactions
- Reusable methods
- Locator management
- Test maintainability
- Page composition

#### Key Understanding Points:

- Abstract page interactions
- Reduce code duplication
- Easier to maintain
- Changes in one place
- Improves readability
- Not always necessary for simple apps

#### Common Interview Questions:

- What is the Page Object Model?
- When should you use Page Objects?
- How do Page Objects improve maintainability?

```javascript
// LoginPage.js
class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator(".error-message");
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
}

// test
test("user can log in", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login("test@example.com", "password123");

  await expect(page.locator("text=Welcome")).toBeVisible();
});
```

---

## 6. Test Design Patterns

> ⭐⭐ **IMPORTANT**

### 6.1 Test Organization

#### Topics to Master:

- File structure
- Test co-location vs separate folders
- Naming conventions
- Grouping tests (describe blocks)
- Test dependencies
- Test execution order
- Setup and teardown strategies

#### Key Understanding Points:

- Co-locate tests with components
- Use describe for grouping
- Clear, descriptive test names
- Independent tests
- Shared setup in beforeEach
- Keep tests flat when possible

#### Common Interview Questions:

- How do you organize test files?
- Should tests be co-located or separate?
- How do you name tests?
- How do you share setup between tests?

```
src/
  components/
    Button/
      Button.tsx
      Button.test.tsx
      Button.styles.ts
    Header/
      Header.tsx
      Header.test.tsx
  hooks/
    useAuth/
      useAuth.ts
      useAuth.test.ts
  utils/
    formatters/
      formatters.ts
      formatters.test.ts
```

---

### 6.2 Test Data Management

#### Topics to Master:

- Test fixtures
- Factory functions
- Test data builders
- Realistic vs minimal data
- Shared test data
- Data generation libraries (faker)
- Seeding databases

#### Key Understanding Points:

- Use factories for complex objects
- Keep test data minimal
- Make test data readable
- Avoid hardcoded IDs
- Generate realistic data when needed
- Share common fixtures

#### Common Interview Questions:

- How do you manage test data?
- What are test factories?
- When should you use fake data libraries?
- How do you avoid flaky tests from test data?

```javascript
// Test factory
function createUser(overrides = {}) {
  return {
    id: Math.random().toString(),
    name: "Test User",
    email: "test@example.com",
    role: "user",
    ...overrides,
  };
}

// Usage
test("displays user name", () => {
  const user = createUser({ name: "John Doe" });
  render(<UserProfile user={user} />);
  expect(screen.getByText(/john doe/i)).toBeInTheDocument();
});

// With faker
import { faker } from "@faker-js/faker";

function createRandomUser() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 80 }),
  };
}
```

---

### 6.3 Testing Edge Cases

#### Topics to Master:

- Boundary conditions
- Empty states
- Error conditions
- Loading states
- Large data sets
- Slow networks
- Race conditions
- Concurrent operations

#### Key Understanding Points:

- Test happy path first
- Then test edge cases
- Empty arrays/strings
- Null/undefined values
- Maximum values
- Error scenarios
- Network failures
- Concurrent updates

#### Common Interview Questions:

- What edge cases should you test?
- How do you test error conditions?
- How do you test race conditions?
- When is edge case testing overkill?

```javascript
describe("UserList", () => {
  test("displays users", async () => {
    // Happy path
    const users = [createUser(), createUser()];
    render(<UserList users={users} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  test("shows empty state", () => {
    // Empty edge case
    render(<UserList users={[]} />);
    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });

  test("handles loading state", () => {
    // Loading edge case
    render(<UserList users={null} loading={true} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("handles error state", () => {
    // Error edge case
    render(<UserList users={null} error="Failed to load" />);
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });

  test("handles large data sets", () => {
    // Boundary case
    const manyUsers = Array.from({ length: 1000 }, () => createUser());
    render(<UserList users={manyUsers} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(1000);
  });
});
```

---

### 6.4 Avoiding Flaky Tests

#### Topics to Master:

- Causes of flaky tests
- Async timing issues
- Test isolation
- Deterministic data
- Race conditions
- External dependencies
- Cleanup between tests

#### Key Understanding Points:

- Flaky tests hurt confidence
- Wait for elements properly
- Don't use arbitrary timeouts
- Ensure test isolation
- Mock time and randomness
- Clean up after tests
- Fix flaky tests immediately

#### Common Interview Questions:

- What causes flaky tests?
- How do you fix flaky tests?
- How do you prevent flaky tests?
- What's the impact of flaky tests?

```javascript
// ❌ BAD - Flaky
test("shows notification", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button"));
  setTimeout(() => {
    expect(screen.getByText(/saved/i)).toBeInTheDocument();
  }, 100); // Arbitrary timeout
});

// ✅ GOOD - Reliable
test("shows notification", async () => {
  render(<App />);
  await userEvent.click(screen.getByRole("button"));
  expect(await screen.findByText(/saved/i)).toBeInTheDocument();
});

// ❌ BAD - Tests affect each other
let user;
beforeAll(() => {
  user = createUser(); // Shared mutable state
});

test("test 1", () => {
  user.name = "Changed"; // Mutates shared state
});

test("test 2", () => {
  expect(user.name).toBe("Test User"); // Fails!
});

// ✅ GOOD - Isolated
beforeEach(() => {
  user = createUser(); // Fresh state each test
});
```

---

### 6.5 Performance Testing

#### Topics to Master:

- Render performance
- Measuring component re-renders
- Testing React.memo effectiveness
- Profiling in tests
- Performance assertions
- Load testing
- Memory leak detection

#### Key Understanding Points:

- Performance tests catch regressions
- Measure render times
- Test with realistic data sizes
- Profile in tests when needed
- Set performance budgets
- Not every component needs perf tests

#### Common Interview Questions:

- How do you test component performance?
- When should you write performance tests?
- How do you detect unnecessary re-renders?

---

## 7. Advanced Testing Concepts

> ⭐ **GOOD TO KNOW**

### 7.1 Accessibility Testing

#### Topics to Master:

- jest-axe for automated a11y
- Testing keyboard navigation
- Screen reader testing
- ARIA attributes testing
- Focus management
- Color contrast testing
- a11y best practices in tests

#### Key Understanding Points:

- Automated tools catch many issues
- Not all a11y issues caught by tools
- Test keyboard navigation
- Test focus management
- Use semantic HTML
- Test with accessibility queries

#### Common Interview Questions:

- How do you test accessibility?
- What tools help with a11y testing?
- Can you fully automate a11y testing?

```javascript
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

test("no accessibility violations", async () => {
  const { container } = render(<App />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test("keyboard navigation", async () => {
  const user = userEvent.setup();
  render(<Menu />);

  const firstItem = screen.getByRole("menuitem", { name: /home/i });
  firstItem.focus();

  await user.keyboard("{Tab}");
  expect(screen.getByRole("menuitem", { name: /about/i })).toHaveFocus();
});
```

---

### 7.2 Visual Regression Testing

#### Topics to Master:

- Snapshot testing concepts
- Visual diff tools (Percy, Chromatic)
- Storybook integration
- Screenshot comparison
- Handling visual changes
- Cross-browser visual testing

#### Key Understanding Points:

- Catches unintended UI changes
- Requires manual approval
- Integrates with CI/CD
- Works well with Storybook
- Can be noisy with frequent changes
- Most valuable for component libraries

#### Common Interview Questions:

- What is visual regression testing?
- When would you use visual tests?
- What tools exist for visual testing?
- How do you handle false positives?

---

### 7.3 Contract Testing

#### Topics to Master:

- Consumer-driven contracts
- Pact testing framework
- API contract testing
- Mock vs contract tests
- Provider verification
- Contract evolution

#### Key Understanding Points:

- Ensures API compatibility
- Tests integration points
- Consumer defines expectations
- Provider verifies contract
- Catches breaking changes early
- Useful for microservices

#### Common Interview Questions:

- What is contract testing?
- When would you use contract tests?
- How does Pact work?
- Contract testing vs integration testing?

---

### 7.4 Testing in CI/CD

#### Topics to Master:

- Running tests in CI
- Parallel test execution
- Test splitting
- Flaky test retries
- Test reporting
- Coverage reporting
- Failed test artifacts
- Test caching

#### Key Understanding Points:

- Tests run on every commit
- Fast feedback is crucial
- Parallelize for speed
- Retry flaky tests (temporarily)
- Block merges on test failures
- Track test trends
- Save screenshots/videos on failure

#### Common Interview Questions:

- How do you optimize tests in CI?
- How do you handle flaky tests in CI?
- What metrics do you track?
- How do you speed up test runs?

---

### 7.5 Mutation Testing

#### Topics to Master:

- Mutation testing concepts
- Stryker framework
- Mutation score
- Finding weak tests
- Test effectiveness
- Cost vs benefit

#### Key Understanding Points:

- Tests the tests
- Introduces bugs to see if tests catch them
- Finds weak test coverage
- Mutation score measures test quality
- Slow and resource intensive
- Use selectively

#### Common Interview Questions:

- What is mutation testing?
- When would you use mutation testing?
- What does mutation score indicate?

---

## Additional Study Resources

### Practice Projects:

1. **Todo App with Full Test Coverage**

   - Unit, integration, E2E tests
   - Practice all test types

2. **Dashboard with Data Fetching**

   - Test async operations
   - Loading/error states
   - MSW for API mocking

3. **Multi-Step Form**

   - Complex form validation
   - State management testing
   - User flow testing

4. **E-Commerce Checkout Flow**
   - Complete user journey
   - Integration testing
   - E2E critical paths

### Testing Practice:

- Testing Library challenges
- Refactor untested code with TDD
- Write tests for existing projects
- Practice test-first development
- Review open source test suites

### Books and Resources:

- "Testing JavaScript" by Kent C. Dodds
- Testing Library documentation
- Jest documentation
- Playwright/Cypress documentation
- Testing Principles and Practices

### Online Resources:

- Testing JavaScript (testingjavascript.com)
- Kent C. Dodds blog
- Testing Library Discord
- Epic React workshops

---

## Interview Preparation Checklist

### Fundamentals

- [ ] Understand testing pyramid/trophy
- [ ] Know when to write each test type
- [ ] Master AAA/Given-When-Then patterns
- [ ] Understand mocking concepts

### Jest & Testing Library

- [ ] Set up Jest configuration
- [ ] Master all query types
- [ ] Use userEvent for interactions
- [ ] Test async code confidently

### React Testing

- [ ] Test components from user perspective
- [ ] Test hooks properly
- [ ] Test forms and validation
- [ ] Test routing and navigation

### Integration & E2E

- [ ] Set up MSW for API mocking
- [ ] Write feature flow tests
- [ ] Learn one E2E tool well
- [ ] Understand Page Object Model

### Best Practices

- [ ] Write maintainable tests
- [ ] Avoid flaky tests
- [ ] Test edge cases
- [ ] Practice TDD

### Before Interview:

- [ ] Build project with comprehensive tests
- [ ] Review this guide's CRITICAL sections
- [ ] Practice explaining testing concepts
- [ ] Prepare examples from your experience
- [ ] Demo your test-writing process

---

## Key Testing Principles

1. **Test Behavior, Not Implementation**: Focus on what users see and do
2. **Confidence Over Coverage**: 100% coverage ≠ bug-free
3. **Fast Feedback**: Tests should run quickly
4. **Maintainable Tests**: Tests are code too
5. **Test Realistically**: Use real user interactions
6. **Integration Over Unit**: Integration tests provide most value
7. **Few E2E Tests**: Critical paths only
8. **Mock at Boundaries**: Keep tests realistic
9. **Independent Tests**: No shared state
10. **Readable Tests**: Tests document behavior

---

## Common Testing Anti-Patterns

### ❌ Testing Implementation Details

```javascript
// BAD
expect(wrapper.state().count).toBe(1);
expect(instance.handleClick).toHaveBeenCalled();
```

### ✅ Testing Behavior

```javascript
// GOOD
expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
expect(mockOnClick).toHaveBeenCalled();
```

### ❌ Too Many Unit Tests

```javascript
// Diminishing returns
test("add function", () => {
  expect(add(1, 2)).toBe(3);
});
```

### ✅ Integration Tests

```javascript
// More confidence
test("calculator works", () => {
  render(<Calculator />);
  // Test complete flow
});
```

### ❌ Brittle Selectors

```javascript
// Breaks easily
container.querySelector(".btn-primary-large");
```

### ✅ Accessible Selectors

```javascript
// Resilient
screen.getByRole("button", { name: /submit/i });
```

---

## Interview Questions Bank

### Fundamentals

1. Explain the testing pyramid vs testing trophy
2. What's the difference between unit and integration tests?
3. What is TDD and when would you use it?
4. How do you decide what to test?
5. What makes a test "good"?

### Jest Specific

6. How does Jest find and run tests?
7. What's the difference between beforeEach and beforeAll?
8. How do you mock modules in Jest?
9. Explain how Jest fake timers work
10. How do you test async code?

### Testing Library

11. What are Testing Library's guiding principles?
12. When would you use getBy vs queryBy vs findBy?
13. Why use userEvent instead of fireEvent?
14. How do you test accessibility?
15. What's the best way to select elements?

### React Testing

16. How do you test React hooks?
17. How do you test components with Context?
18. How do you test form submissions?
19. How do you test data fetching components?
20. Should you use React.FC in tests?

### Integration & E2E

21. What is MSW and why use it?
22. How do you structure integration tests?
23. When would you write E2E tests?
24. Cypress vs Playwright - differences?
25. What is the Page Object Model?

### Best Practices

26. How do you avoid flaky tests?
27. How do you organize test files?
28. What are common testing anti-patterns?
29. How do you test edge cases?
30. How do you make tests maintainable?

---

## Testing Cheat Sheet

### Common Queries

```javascript
// By role (preferred)
getByRole("button", { name: /submit/i });

// By label
getByLabelText(/username/i);

// By text
getByText(/hello world/i);

// By test ID (last resort)
getByTestId("custom-element");
```

### Async Testing

```javascript
// Wait for element
await findByText(/loaded/i);

// Wait for condition
await waitFor(() => {
  expect(mockFn).toHaveBeenCalled();
});

// Wait for removal
await waitForElementToBeRemoved(() => queryByText(/loading/i));
```

### User Events

```javascript
const user = userEvent.setup();

await user.click(button);
await user.type(input, "text");
await user.keyboard("{Enter}");
await user.tab();
await user.hover(element);
```

### Common Matchers

```javascript
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toHaveTextContent("text");
expect(element).toHaveAttribute("href");
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith(arg);
```

---

**Remember**: The goal of testing is confidence in your code. Write tests that give you that confidence without becoming a maintenance burden. Focus on testing behavior that matters to users!
