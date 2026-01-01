# Custom Hooks - Complete Interview Guide

## 🎯 Key Concepts

### 1. What are Custom Hooks?

**Core Understanding:**

- Custom hooks are **JavaScript functions** that use React hooks
- Their names **must start with "use"** (convention enforced by React)
- Allow you to **extract and reuse stateful logic** between components
- Can call other hooks (built-in or custom)
- Share **logic**, not **state** (each usage has independent state)

**The Basic Pattern:**

```javascript
// Custom hook
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => c - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}

// Usage in components
function ComponentA() {
  const counter = useCounter(0);
  return <button onClick={counter.increment}>{counter.count}</button>;
}

function ComponentB() {
  const counter = useCounter(10); // Independent state!
  return <button onClick={counter.increment}>{counter.count}</button>;
}
```

**Key Insight:**

```javascript
// ❌ This is NOT a custom hook (doesn't use hooks)
function getWindowSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

// ✅ This IS a custom hook (uses useState and useEffect)
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}
```

---

### 2. Hook Naming Conventions (use prefix)

**The "use" Prefix Rule:**

- **MUST** start with "use" (lowercase)
- Tells React and linters this function follows Hook rules
- Without "use", React won't check Hook rules
- Convention, but also tooling requirement

**Good Names:**

```javascript
✅ useCounter
✅ useFetch
✅ useLocalStorage
✅ useAuth
✅ useWindowSize
✅ useDebounce
✅ useToggle
✅ usePrevious
```

**Bad Names:**

```javascript
❌ counter (not a hook)
❌ Counter (looks like component)
❌ getCounter (regular function pattern)
❌ fetchData (doesn't indicate it's a hook)
❌ handleAuth (event handler pattern)
❌ UseCounter (wrong case)
```

**Why This Matters:**

```javascript
// ❌ ESLint won't check Hook rules
function getUser(id) {
  const [user, setUser] = useState(null); // Warning not caught!
  // ... conditional hooks, etc
  return user;
}

// ✅ ESLint checks Hook rules
function useUser(id) {
  const [user, setUser] = useState(null); // Properly checked!
  // ... ESLint warns about violations
  return user;
}
```

---

### 3. Extracting Reusable Logic

**Problem: Duplicated Logic**

```javascript
// ❌ BAD - Logic duplicated in multiple components
function ComponentA() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/data")
      .then((res) => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return <div>{/* render */}</div>;
}

function ComponentB() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/other-data")
      .then((res) => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return <div>{/* render */}</div>;
}
```

**Solution: Extract to Custom Hook**

```javascript
// ✅ GOOD - Logic extracted and reusable
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setData(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setError(error);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}

// Usage - clean and simple!
function ComponentA() {
  const { data, loading, error } = useFetch("/api/data");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{/* render data */}</div>;
}

function ComponentB() {
  const { data, loading, error } = useFetch("/api/other-data");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{/* render data */}</div>;
}
```

---

### 4. Composing Hooks Together

**Custom Hooks Can Use Other Hooks:**

```javascript
// Simple custom hook
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Composed custom hook - uses useLocalStorage + others
function useAuth() {
  const [user, setUser] = useLocalStorage("user", null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(
    async (credentials) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          body: JSON.stringify(credentials),
        });
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [setUser]
  );

  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  return { user, loading, error, login, logout };
}
```

**Complex Composition Example:**

```javascript
// 1. Base hook - debounce value
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// 2. Composed hook - debounced fetch
function useDebouncedSearch(searchTerm) {
  const debouncedTerm = useDebounce(searchTerm, 500);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!debouncedTerm) {
      setResults([]);
      return;
    }

    setLoading(true);
    fetch(`/api/search?q=${debouncedTerm}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        setLoading(false);
      });
  }, [debouncedTerm]);

  return { results, loading };
}

// 3. Usage - super clean!
function SearchComponent() {
  const [query, setQuery] = useState("");
  const { results, loading } = useDebouncedSearch(query);

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {loading && <Spinner />}
      <Results data={results} />
    </>
  );
}
```

---

### 5. Hook Rules and Best Practices

**Rules of Hooks (Apply to Custom Hooks Too):**

1. **Only call at the top level** (no loops, conditions, nested functions)
2. **Only call from React functions** (components or custom hooks)
3. **Call in the same order every time**

```javascript
// ❌ WRONG - Conditional hook call
function useBadHook(condition) {
  if (condition) {
    const [value, setValue] = useState(0); // Breaks rules!
  }
  return value;
}

// ✅ CORRECT - Hook at top level
function useGoodHook(condition) {
  const [value, setValue] = useState(0);

  // Logic can be conditional, not the hook call
  useEffect(() => {
    if (condition) {
      // do something
    }
  }, [condition]);

  return value;
}
```

**Best Practices:**

```javascript
// 1. Start with "use"
function useCounter() {
  /* ... */
}

// 2. Return values in consistent format
function useCounter() {
  // ✅ Good - object for named returns
  return { count, increment, decrement };

  // ✅ Good - array for positional returns
  return [count, increment, decrement];
}

// 3. Accept configuration objects
function useFetch(url, options = {}) {
  const { method = "GET", headers = {} } = options;
  // ...
}

// 4. Include all dependencies in useEffect/useMemo/useCallback
function useData(id) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData(id).then(setData);
  }, [id]); // ✅ Includes all dependencies

  return data;
}

// 5. Document your hooks
/**
 * Custom hook for fetching data from an API
 * @param {string} url - The API endpoint
 * @param {Object} options - Fetch options
 * @returns {{ data, loading, error, refetch }}
 */
function useFetch(url, options) {
  // ...
}

// 6. Make hooks flexible and composable
function useUser(userId) {
  // Can be used independently
  const { data, loading, error } = useFetch(`/api/users/${userId}`);

  // Or composed with other hooks
  const cachedUser = useCache(`user-${userId}`, data);

  return { user: cachedUser, loading, error };
}
```

---

### 6. Return Values (Arrays vs Objects)

**Array Pattern (Positional):**

```javascript
// Like useState - position matters
function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);

  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => c - 1);

  return [count, { increment, decrement }];
}

// Usage
const [count, actions] = useCounter();
const [count, { increment }] = useCounter(); // Can rename
const [myCount, myActions] = useCounter(); // Easy to rename
```

**When to Use Arrays:**

- ✅ 2-3 return values maximum
- ✅ Values likely to be renamed by user
- ✅ Following conventions (like useState)
- ✅ Simple, commonly understood pattern

**Object Pattern (Named):**

```javascript
// Named properties - order doesn't matter
function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = () => {
    /* ... */
  };
  const update = (data) => {
    /* ... */
  };

  return {
    user,
    loading,
    error,
    refetch,
    update,
    isLoading: loading, // Can provide aliases
    hasError: !!error,
  };
}

// Usage
const { user, loading, error } = useUser(id);
const { user, loading: isLoading } = useUser(id); // Rename if needed
const { user, refetch } = useUser(id); // Pick only what you need
```

**When to Use Objects:**

- ✅ 4+ return values
- ✅ Clear property names
- ✅ Users need to pick specific values
- ✅ Future extensibility (can add properties without breaking)

**Comparison:**

```javascript
// Array - good for simple cases
const [count, setCount] = useState(0);
const [isOpen, toggle] = useToggle(false);
const [value, setValue, reset] = useInput("");

// Object - good for complex cases
const { data, loading, error, refetch } = useFetch(url);
const { user, login, logout, isAuthenticated } = useAuth();
const { items, addItem, removeItem, updateItem, total, isEmpty } = useCart();
```

---

### 7. Common Custom Hook Patterns

**Pattern 1: useToggle**

```javascript
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((v) => !v);
  }, []);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, { toggle, setTrue, setFalse }];
}

// Usage
function Modal() {
  const [isOpen, { toggle, setTrue, setFalse }] = useToggle();

  return (
    <>
      <button onClick={toggle}>Toggle Modal</button>
      <button onClick={setTrue}>Open Modal</button>
      {isOpen && <ModalContent onClose={setFalse} />}
    </>
  );
}
```

**Pattern 2: useLocalStorage**

```javascript
function useLocalStorage(key, initialValue) {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function
  const setValue = useCallback(
    (value) => {
      try {
        // Allow value to be a function
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

// Usage
function UserSettings() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const [language, setLanguage] = useLocalStorage("language", "en");

  return (
    <>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </>
  );
}
```

**Pattern 3: usePrevious**

```javascript
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

// Usage
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <p>Changed by: {count - (prevCount || 0)}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}
```

**Pattern 4: useDebounce**

```javascript
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function SearchInput() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // API call here
      searchAPI(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

**Pattern 5: useWindowSize**

```javascript
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Call on mount

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

// Usage
function ResponsiveComponent() {
  const { width, height } = useWindowSize();

  return <div>{width < 768 ? <MobileLayout /> : <DesktopLayout />}</div>;
}
```

**Pattern 6: useAsync**

```javascript
function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState("idle");
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(() => {
    setStatus("pending");
    setValue(null);
    setError(null);

    return asyncFunction()
      .then((response) => {
        setValue(response);
        setStatus("success");
      })
      .catch((error) => {
        setError(error);
        setStatus("error");
      });
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error };
}

// Usage
function UserProfile({ userId }) {
  const {
    execute: fetchUser,
    status,
    value: user,
    error,
  } = useAsync(() => fetch(`/api/users/${userId}`).then((r) => r.json()));

  if (status === "pending") return <div>Loading...</div>;
  if (status === "error") return <div>Error: {error.message}</div>;
  if (status === "success") return <div>{user.name}</div>;

  return null;
}
```

---

## 🎤 Top Interview Questions & Model Answers

### Q1: What are custom hooks and why would you create one?

**Model Answer:**

> "Custom hooks are JavaScript functions that use React hooks and follow the naming convention of starting with 'use'. They allow you to extract and reuse stateful logic between components without changing the component hierarchy. I create custom hooks when I find myself duplicating the same logic across multiple components - things like data fetching, form handling, subscriptions, or animations. The key insight is that custom hooks share logic, not state - each component that uses a custom hook gets its own independent state. For example, if I have multiple components fetching data with the same loading and error handling patterns, I'd extract that into a useFetch hook. This makes the code more maintainable, testable, and follows the DRY principle. Custom hooks are one of React's most powerful features for code reuse."

---

### Q2: What are the rules for custom hooks?

**Model Answer:**

> "Custom hooks must follow the same Rules of Hooks as built-in hooks. First, they must start with 'use' - this isn't just convention, it's required for React and ESLint to enforce the rules. Second, they can only be called at the top level - no loops, conditions, or nested functions. Third, they can only be called from React function components or other custom hooks, not from regular JavaScript functions. Fourth, all hooks must be called in the same order on every render. Additionally, custom hooks should include all necessary dependencies in useEffect, useMemo, and useCallback dependency arrays. These rules ensure React can properly track state and effects. The 'use' prefix is particularly important because without it, ESLint won't check for rule violations, making bugs much harder to catch."

---

### Q3: How do you decide between returning an array vs an object from a custom hook?

**Model Answer:**

> "I use arrays when the custom hook returns 2-3 values and follows a pattern similar to useState, where users are likely to rename the values. Arrays work well because of destructuring - users can name the values whatever they want. I use objects when returning 4 or more values, or when the values have clear, descriptive names that shouldn't be positional. Objects are better for extensibility - I can add new properties later without breaking existing code. For example, useState returns an array [value, setValue] because it's simple and users want to name it themselves. But a useFetch hook should return an object {data, loading, error, refetch} because there are multiple values with specific meanings, and users can pick only what they need. The key is considering the API from the consumer's perspective - what's most intuitive and flexible?"

---

### Q4: Can you explain how custom hooks share logic but not state?

**Model Answer:**

> "This is a crucial concept - each time you call a custom hook, you get completely independent state. Think of a custom hook as a function that returns fresh state and logic each time it's called, similar to calling useState multiple times. For example, if I have a useCounter custom hook and call it in two components, each component gets its own separate count state. They're not sharing the count - they're sharing the logic for how to manage a counter. This is different from something like Context, which does share state. If you want to share state between components, you'd combine custom hooks with Context - the custom hook could consume a context, or you could create a Provider component that uses custom hooks internally. The composability is powerful - custom hooks for logic reuse, Context for state sharing."

---

### Q5: What's the difference between a custom hook and a regular helper function?

**Model Answer:**

> "The key difference is that custom hooks can use React hooks, while regular functions cannot. A custom hook can call useState, useEffect, useContext, and other hooks to manage state, side effects, and context. A regular helper function is just for pure logic without state or effects. For example, a function that formats a date is a regular helper - it doesn't need hooks. But a function that fetches data and manages loading/error states needs useState and useEffect, so it must be a custom hook. Another difference is the naming - custom hooks must start with 'use' so React can enforce the Rules of Hooks. I use custom hooks when I need stateful logic that's reusable across components. I use regular functions for pure computations, transformations, or utilities that don't involve React state or side effects."

---

### Q6: How do you test custom hooks?

**Model Answer:**

> "Testing custom hooks requires special handling because hooks can only be called inside React components. I use React Testing Library's renderHook utility from @testing-library/react-hooks. It lets you render a hook in a test component and interact with it. For example, to test a useCounter hook, I'd use renderHook, then call act() to trigger updates, and assert on the result. Here's the pattern: renderHook returns a result object that contains the current return value of the hook. When I call result.current.increment wrapped in act(), I can then assert that result.current.count increased. For hooks that use effects, I need to use waitFor or waitForNextUpdate to handle asynchronous updates. I also test that the hook properly cleans up effects on unmount. The key is testing the hook's behavior as a black box - verify the API works correctly without testing implementation details."

**Example:**

```javascript
import { renderHook, act } from "@testing-library/react-hooks";

test("useCounter increments", () => {
  const { result } = renderHook(() => useCounter(0));

  expect(result.current.count).toBe(0);

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

---

### Q7: When should you NOT create a custom hook?

**Model Answer:**

> "I don't create a custom hook when the logic is used in only one place - that's premature abstraction. Extract hooks when you find duplication, not before. I also don't create hooks for logic that doesn't involve React hooks - if it's just pure functions or calculations, a regular helper function is better. Another time to avoid custom hooks is when the abstraction would hide too much complexity or make debugging harder. Sometimes inline code is clearer than an abstraction. Finally, I don't create hooks for every single piece of state management - sometimes just useState is fine. The rule I follow is: start simple with built-in hooks, refactor to custom hooks when you see patterns repeated across 2-3 components. Custom hooks should make code more readable and maintainable, not more abstract and complex."

---

## 🚨 Common Mistakes to Avoid

### 1. Not Starting with "use"

```javascript
// ❌ WRONG - ESLint won't check Hook rules
function counter(initial) {
  const [count, setCount] = useState(initial);
  return { count, setCount };
}

// ✅ CORRECT - Follows convention
function useCounter(initial) {
  const [count, setCount] = useState(initial);
  return { count, setCount };
}
```

### 2. Conditional Hook Calls

```javascript
// ❌ WRONG - Conditional hook call
function useBadHook(shouldUseState) {
  if (shouldUseState) {
    const [value, setValue] = useState(0); // Breaks rules!
  }

  return value;
}

// ✅ CORRECT - Hook at top level
function useGoodHook(shouldUseState) {
  const [value, setValue] = useState(0);

  // Conditional logic, not conditional hook
  const displayValue = shouldUseState ? value : null;

  return displayValue;
}
```

### 3. Missing Dependencies

```javascript
// ❌ WRONG - Missing dependency
function useFetch(url) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((r) => r.json())
      .then(setData);
  }, []); // Missing 'url' dependency!

  return data;
}

// ✅ CORRECT - All dependencies included
function useFetch(url) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((r) => r.json())
      .then(setData);
  }, [url]); // Includes url

  return data;
}
```

### 4. Not Cleaning Up Effects

```javascript
// ❌ WRONG - No cleanup
function useInterval(callback, delay) {
  useEffect(() => {
    const id = setInterval(callback, delay);
    // No cleanup!
  }, [callback, delay]);
}

// ✅ CORRECT - Proper cleanup
function useInterval(callback, delay) {
  useEffect(() => {
    const id = setInterval(callback, delay);

    return () => {
      clearInterval(id); // Cleanup!
    };
  }, [callback, delay]);
}
```

### 5. Returning Inconsistent Values

```javascript
// ❌ CONFUSING - Inconsistent return format
function useBadCounter(initial) {
  const [count, setCount] = useState(initial);

  if (count > 10) {
    return { count }; // Object
  }

  return [count, setCount]; // Array - inconsistent!
}

// ✅ CORRECT - Consistent return format
function useGoodCounter(initial) {
  const [count, setCount] = useState(initial);

  const increment = () => setCount((c) => c + 1);
  const reset = () => setCount(initial);

  // Always returns object
  return { count, increment, reset };
}
```

### 6. Thinking Custom Hooks Share State

```javascript
// ❌ MISUNDERSTANDING - These don't share state!
function ComponentA() {
  const { count } = useCounter(0);
  // count is independent
  return <div>{count}</div>;
}

function ComponentB() {
  const { count } = useCounter(0);
  // This is a DIFFERENT count, not shared!
  return <div>{count}</div>;
}

// ✅ TO SHARE STATE - Use Context
const CounterContext = createContext();

function CounterProvider({ children }) {
  const counter = useCounter(0);
  return (
    <CounterContext.Provider value={counter}>
      {children}
    </CounterContext.Provider>
  );
}

function useSharedCounter() {
  return useContext(CounterContext);
}
```

---

## 🔑 Interview Checklist

### ✅ Must Know (Will definitely be asked)

- ✅ What custom hooks are (functions that use hooks)
- ✅ Must start with "use" prefix
- ✅ Share logic, not state
- ✅ Follow Rules of Hooks
- ✅ Can use other hooks inside
- ✅ When to create custom hooks

### ✅ Should Know (Often asked)

- ✅ Array vs object return patterns
- ✅ Common custom hook patterns
- ✅ Composing hooks together
- ✅ Testing custom hooks
- ✅ When NOT to create custom hooks

### ✅ Nice to Know (Senior level)

- [ ] Advanced composition patterns
- [ ] TypeScript with custom hooks
- [ ] Performance considerations
- [ ] Custom hooks with Context
- [ ] Hook libraries (react-use, ahooks)

---

## 💡 Pro Tips for Interviews

1. **Show real examples**: Have 2-3 custom hooks you've created
2. **Explain the "why"**: Why extract logic into a hook?
3. **Know the rules**: Must start with "use", follow Hook rules
4. **State vs logic**: Clarify hooks share logic, not state
5. **Return patterns**: Explain array vs object choice

---

## 📚 Quick Reference

```javascript
// Basic structure
function useCustomHook(params) {
  // 1. Use built-in hooks
  const [state, setState] = useState(initial);

  useEffect(() => {
    // side effects
    return () => {
      // cleanup
    };
  }, [dependencies]);

  // 2. Define helper functions
  const helper = useCallback(() => {
    // logic
  }, [dependencies]);

  // 3. Return API (array or object)
  return { state, helper };
  // or return [state, helper];
}

// Usage
function Component() {
  const { state, helper } = useCustomHook(params);
  // or const [state, helper] = useCustomHook(params);

  return <div>...</div>;
}
```

---

## 🎯 The Golden Rules

1. **"Must start with use"** - Not optional, required for tooling
2. **"Follow Rules of Hooks"** - Same rules as built-in hooks
3. **"Share logic, not state"** - Each usage is independent
4. **"Extract when duplicated"** - Not before
5. **"Make it reusable"** - But not overly abstract

---

**Remember:** Custom hooks are about extracting reusable stateful logic. Start with built-in hooks, identify patterns of duplication, then extract to custom hooks. Keep them focused and composable - the best custom hooks do one thing well and can be combined to solve complex problems!
