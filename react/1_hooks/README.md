# Hook Rules and Best Practices - Complete Interview Guide

## 🎯 Essential Rules (The "Rules of Hooks")

### Rule 1: Only Call Hooks at the Top Level

**What it means:**

- Don't call hooks inside loops, conditions, or nested functions
- Hooks must be called in the same order on every render
- This ensures React can track hook state correctly

**❌ WRONG Examples:**

```javascript
// ❌ Inside a condition
function Component() {
  if (isLoggedIn) {
    const [user, setUser] = useState(null); // WRONG!
  }
  // Hook order changes based on condition
}

// ❌ Inside a loop
function Component() {
  for (let i = 0; i < 5; i++) {
    const [value, setValue] = useState(i); // WRONG!
  }
  // Number of hooks changes
}

// ❌ Inside a nested function
function Component() {
  const doSomething = () => {
    const [value, setValue] = useState(0); // WRONG!
  };
  // Hook not called at top level
}

// ❌ After an early return
function Component({ ready }) {
  if (!ready) {
    return <div>Loading...</div>; // Early return
  }

  const [data, setData] = useState(null); // WRONG!
  // Hook might not be called if component returns early
}
```

**✅ CORRECT Examples:**

```javascript
// ✅ At the top level, before any conditions
function Component({ isLoggedIn }) {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);

  // Conditional logic AFTER hooks
  if (!isLoggedIn) {
    return <div>Please log in</div>;
  }

  return <div>Welcome {user?.name}</div>;
}

// ✅ Conditional logic inside hooks
function Component({ shouldFetch }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Condition inside the hook, not around it
    if (shouldFetch) {
      fetchData().then(setData);
    }
  }, [shouldFetch]);
}

// ✅ Always call the same hooks
function Component({ type }) {
  const [count, setCount] = useState(0);

  // Both branches call the same hooks
  if (type === "A") {
    useEffect(() => {
      /* A logic */
    }, []);
  } else {
    useEffect(() => {
      /* B logic */
    }, []);
  }
}
```

**Why This Rule Exists:**
React relies on the order of hook calls to preserve state between renders. Each hook call gets an index internally:

```javascript
// React's internal representation (simplified)
function Component() {
  const [name, setName] = useState(""); // Hook #0
  const [age, setAge] = useState(0); // Hook #1
  useEffect(() => {}, []); // Hook #2

  // React stores: [
  //   { type: 'useState', value: '' },     // index 0
  //   { type: 'useState', value: 0 },      // index 1
  //   { type: 'useEffect', value: fn }     // index 2
  // ]
}
```

If you conditionally call hooks, the indices get mismatched:

```javascript
function Component({ condition }) {
  const [name, setName] = useState(""); // Hook #0

  if (condition) {
    const [age, setAge] = useState(0); // Hook #1 (sometimes)
  }

  useEffect(() => {}, []); // Hook #1 or #2 (depends on condition)
  // React gets confused - indices don't match!
}
```

---

### Rule 2: Only Call Hooks in React Functions

**What it means:**

- Call hooks from React function components
- Call hooks from custom hooks
- Don't call hooks from regular JavaScript functions

**❌ WRONG Examples:**

```javascript
// ❌ Regular JavaScript function
function calculateTotal(items) {
  const [total, setTotal] = useState(0); // WRONG!
  return total;
}

// ❌ Class component method
class MyComponent extends React.Component {
  handleClick() {
    const [count, setCount] = useState(0); // WRONG!
  }
}

// ❌ Event handler (outside component)
const handleSubmit = (data) => {
  const [loading, setLoading] = useState(false); // WRONG!
  // Process data
};

// ❌ Utility function
function formatData(data) {
  const memoized = useMemo(() => data.map(...), [data]); // WRONG!
  return memoized;
}
```

**✅ CORRECT Examples:**

```javascript
// ✅ Function component
function MyComponent() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}

// ✅ Custom hook
function useCounter(initialValue) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount((c) => c + 1);
  return { count, increment };
}

// ✅ Hook inside component
function MyComponent() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (data) => {
    setLoading(true); // OK - using hook state from component
    // Process data
  };

  return <button onClick={handleSubmit}>Submit</button>;
}
```

**Why This Rule Exists:**
React needs to track which component instance each hook belongs to. Hooks only work within React's component lifecycle and rendering system.

---

### Rule 3: Hooks Must Be Called in the Same Order Every Render

**What it means:**

- The sequence of hook calls must be identical across renders
- Don't skip hooks conditionally
- Don't add/remove hooks dynamically

**❌ WRONG Examples:**

```javascript
// ❌ Conditional hook calls change order
function Component({ showEmail }) {
  const [name, setName] = useState("");

  if (showEmail) {
    const [email, setEmail] = useState(""); // Changes hook order!
  }

  const [age, setAge] = useState(0);
  // Order: name, email, age OR name, age (inconsistent!)
}

// ❌ Hook in early return
function Component({ isReady }) {
  const [count, setCount] = useState(0);

  if (!isReady) {
    return null; // Early return
  }

  const [data, setData] = useState(null); // Might not be called!
  // Order changes based on isReady
}

// ❌ Dynamic number of hooks
function Component({ items }) {
  const [count, setCount] = useState(0);

  // Don't do this!
  items.forEach((item) => {
    const [value, setValue] = useState(item); // WRONG!
  });
}
```

**✅ CORRECT Examples:**

```javascript
// ✅ All hooks called unconditionally
function Component({ showEmail }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState(0);

  // Conditionally render, not conditionally hook
  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      {showEmail && (
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      )}
      <input value={age} onChange={(e) => setAge(e.target.value)} />
    </div>
  );
}

// ✅ All hooks before any returns
function Component({ isReady }) {
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);

  // All hooks called, then conditional logic
  if (!isReady) {
    return <div>Loading...</div>;
  }

  return <div>{data}</div>;
}
```

---

### Rule 4: Custom Hooks Must Start with "use"

**What it means:**

- Custom hook names must start with "use" prefix
- This allows React (and linters) to identify them as hooks
- They can call other hooks inside

**❌ WRONG Examples:**

```javascript
// ❌ Doesn't start with "use"
function getUser() {
  const [user, setUser] = useState(null);
  return user;
}

// ❌ Wrong naming
function fetchData() {
  const [data, setData] = useState(null);
  useEffect(() => {
    /* fetch */
  }, []);
  return data;
}

// ❌ Looks like a hook but isn't
function userInfo() {
  // Should be useUserInfo
  const [info, setInfo] = useState(null);
  return info;
}
```

**✅ CORRECT Examples:**

```javascript
// ✅ Starts with "use"
function useUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser().then(setUser);
  }, []);

  return user;
}

// ✅ Descriptive custom hook
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

// ✅ Custom hook with multiple hooks
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
```

**Why This Rule Exists:**

- ESLint can automatically check rules of hooks
- Makes it clear that the function uses hooks internally
- Convention helps with code readability

---

## 💡 Best Practices

### Best Practice 1: Keep Hooks at Component Top Level

**Why:**

- Ensures consistent hook order
- Makes component logic clear
- Easy to see all state and effects at a glance

**✅ Good Structure:**

```javascript
function Component({ userId }) {
  // 1. All state hooks first
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. Then derived state / memoized values
  const isAdmin = useMemo(() => user?.role === "admin", [user]);

  // 3. Then callbacks
  const handleRefresh = useCallback(() => {
    setLoading(true);
    fetchUser(userId)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId]);

  // 4. Then effects
  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  // 5. Finally render logic
  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  return <UserProfile user={user} />;
}
```

---

### Best Practice 2: Extract Related Logic into Custom Hooks

**Why:**

- Reusable across components
- Cleaner component code
- Easier to test
- Better separation of concerns

**Before (Mixed Logic):**

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId]);

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return <div>...</div>;
}
```

**After (Custom Hooks):**

```javascript
// Custom hook for data fetching
function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId]);

  return { user, loading };
}

// Custom hook for localStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Clean component
function UserProfile({ userId }) {
  const { user, loading } = useUser(userId);
  const [theme, setTheme] = useLocalStorage("theme", "light");

  if (loading) return <Spinner />;
  return <div className={theme}>...</div>;
}
```

---

### Best Practice 3: Name Custom Hooks Descriptively

**Why:**

- Makes code self-documenting
- Clear what the hook does
- Easier to find and reuse

**❌ Bad Names:**

```javascript
function useData() {} // Too generic
function useAPI() {} // What API?
function useHelper() {} // Not descriptive
function useStuff() {} // Meaningless
```

**✅ Good Names:**

```javascript
function useUserProfile(userId) {} // Clear: fetches user profile
function useDebounce(value, delay) {} // Clear: debounces a value
function useLocalStorage(key, init) {} // Clear: manages localStorage
function useWindowSize() {} // Clear: tracks window size
function useIntersectionObserver() {} // Clear: uses Intersection Observer
function useAuth() {} // Clear: handles authentication
```

**Naming Patterns:**

- `use[Action][Entity]`: `useFetchUser`, `useUpdateProfile`
- `use[Behavior]`: `useDebounce`, `useThrottle`, `useToggle`
- `use[API]`: `useLocalStorage`, `useMediaQuery`
- `use[Feature]`: `useAuth`, `useCart`, `useTheme`

---

### Best Practice 4: Document Dependencies Clearly

**Why:**

- Prevents bugs from missing dependencies
- Makes effect behavior clear
- Helps reviewers understand code

**✅ Good Documentation:**

```javascript
function Component({ userId, onUpdate }) {
  const [data, setData] = useState(null);

  // Fetch user data whenever userId changes
  useEffect(() => {
    fetchUser(userId).then(setData);
  }, [userId]); // Dependencies: userId

  // Call onUpdate callback when data changes
  useEffect(() => {
    if (data) {
      onUpdate(data);
    }
  }, [data, onUpdate]); // Dependencies: data, onUpdate

  // Setup subscription on mount, cleanup on unmount
  useEffect(() => {
    const subscription = api.subscribe(userId);
    return () => subscription.unsubscribe();
  }, [userId]); // Dependencies: userId (subscription updates when user changes)
}
```

**Comment Patterns:**

```javascript
// Empty array = run once on mount
useEffect(() => {
  initializeApp();
}, []); // No dependencies - mount only

// With dependencies = run on mount and when deps change
useEffect(() => {
  fetchData(id);
}, [id]); // Runs when id changes

// Cleanup function = prevent memory leaks
useEffect(() => {
  const timer = setInterval(tick, 1000);
  return () => clearInterval(timer); // Cleanup
}, []); // Mount/unmount only
```

---

### Best Practice 5: Use ESLint Plugin for Hooks

**Why:**

- Automatically catches rule violations
- Warns about missing dependencies
- Prevents common mistakes
- Enforces best practices

**Installation:**

```bash
npm install eslint-plugin-react-hooks --save-dev
```

**ESLint Configuration:**

```json
{
  "extends": ["react-app"],
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

**What It Catches:**

```javascript
// ❌ ESLint error: "React Hook useEffect is called conditionally"
function Component({ condition }) {
  if (condition) {
    useEffect(() => {}, []); // Conditional hook!
  }
}

// ❌ ESLint warning: "React Hook useEffect has a missing dependency: 'count'"
function Component() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(count);
  }, []); // Missing 'count' in dependencies!
}

// ✅ ESLint happy - all rules followed
function Component() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(count);
  }, [count]); // All dependencies listed
}
```

---

## 🎤 Top Interview Questions & Model Answers

### Q1: What are the Rules of Hooks?

**Answer:**

> "There are two main rules of hooks that must be followed: First, only call hooks at the top level of your component or custom hook - never inside loops, conditions, or nested functions. This ensures React can track hook state correctly by maintaining a consistent order of hook calls across renders. Second, only call hooks from React function components or custom hooks - not from regular JavaScript functions or class components. Additionally, there's a naming convention that custom hooks must start with 'use' so React and linters can identify them. These rules exist because React relies on the order of hook calls to preserve state between renders, using an internal index-based system. Breaking these rules leads to bugs where state gets mismatched or lost."

---

### Q2: Why can't you call hooks conditionally?

**Answer:**

> "React uses the order of hook calls to track which piece of state belongs to which hook. Internally, React maintains an array of hooks for each component, indexed by the order they're called. If you call hooks conditionally, the order changes between renders - sometimes a hook is called, sometimes it isn't. This causes React to mismatch state: it might try to give useState the value from a useEffect, or vice versa. For example, if you have useState, then conditional useState, then useEffect, React's indices get confused when the condition changes. Instead of calling hooks conditionally, you should always call them at the top level and put conditional logic inside the hook body."

**Code Example:**

```javascript
// ❌ WRONG - conditional hook changes order
function Component({ show }) {
  const [name, setName] = useState(""); // Hook #0
  if (show) {
    const [email, setEmail] = useState(""); // Hook #1 (sometimes)
  }
  const [age, setAge] = useState(0); // Hook #1 or #2 - MISMATCH!
}

// ✅ CORRECT - condition inside hook
function Component({ show }) {
  const [name, setName] = useState(""); // Hook #0
  const [email, setEmail] = useState(""); // Hook #1 (always)
  const [age, setAge] = useState(0); // Hook #2 (always)

  // Use show in conditional rendering
  return <div>{show && <input value={email} />}</div>;
}
```

---

### Q3: What happens if you break the Rules of Hooks?

**Answer:**

> "Breaking the rules of hooks leads to serious bugs that are hard to debug. If you call hooks conditionally or in the wrong order, React's internal state tracking breaks down. You might see state values from one hook appearing in another, components not updating when they should, or getting completely unexpected values. In development, React will throw warnings or errors, but in production, you'll get subtle bugs where component state is corrupted. The symptoms can be confusing: a counter that doesn't increment, a form that loses data, or effects that don't run. The ESLint plugin for hooks is essential because it catches these mistakes before runtime."

---

### Q4: How do you create a custom hook?

**Answer:**

> "A custom hook is just a JavaScript function whose name starts with 'use' and that can call other hooks. The naming convention is critical - it tells React and linters that this function follows the rules of hooks. Inside, you can use any built-in hooks like useState, useEffect, etc., and the same rules apply. Custom hooks are for extracting reusable stateful logic. For example, if multiple components need to fetch user data, I'd create a useUser hook that encapsulates the useState for loading state, the useEffect for fetching, and returns the user data. The key is that custom hooks let you share logic without sharing state - each component that uses the hook gets its own independent state."

**Example:**

```javascript
function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]);

  return { user, loading };
}

// Usage
function Profile({ userId }) {
  const { user, loading } = useUser(userId);
  if (loading) return <Spinner />;
  return <div>{user.name}</div>;
}
```

---

### Q5: Why must custom hooks start with "use"?

**Answer:**

> "The 'use' prefix is a convention that serves multiple purposes. First, it signals to React that this function might call other hooks, so the rules of hooks apply. Second, and more practically, it allows the ESLint plugin to automatically check that the rules of hooks are followed inside that function. Without the 'use' prefix, ESLint won't know to enforce hook rules, and you might break them without getting warnings. Third, it makes code more readable - when you see a function starting with 'use', you immediately know it's stateful and might have effects. It's a simple convention that enables powerful tooling and clear code communication."

---

### Q6: Can you use hooks in a class component?

**Answer:**

> "No, you cannot use hooks directly in class components. Hooks are specifically designed for function components and rely on React's function component rendering model. Class components have their own state management with this.state and lifecycle methods like componentDidMount. If you need to use hook-based logic in a class component, you have two options: First, refactor the class component to a function component, which is usually the better choice. Second, you can create a function component that uses the hooks and render it as a child or wrapper of the class component, passing data via props. However, this is more of a migration strategy than a long-term solution. The React team has indicated that function components with hooks are the future, and new features will focus on them."

---

## 🚨 Common Mistakes and How to Fix Them

### Mistake 1: Conditional Hook Calls

```javascript
// ❌ WRONG
function Component({ isLoggedIn }) {
  if (isLoggedIn) {
    const [user, setUser] = useState(null);
  }
}

// ✅ CORRECT
function Component({ isLoggedIn }) {
  const [user, setUser] = useState(null);

  if (!isLoggedIn) {
    return <LoginPrompt />;
  }

  return <UserProfile user={user} />;
}
```

### Mistake 2: Hooks After Early Return

```javascript
// ❌ WRONG
function Component({ ready }) {
  if (!ready) {
    return <Loading />;
  }

  const [data, setData] = useState(null); // Might not be called!
}

// ✅ CORRECT
function Component({ ready }) {
  const [data, setData] = useState(null); // Always called

  if (!ready) {
    return <Loading />;
  }

  return <div>{data}</div>;
}
```

### Mistake 3: Hooks in Loops

```javascript
// ❌ WRONG
function Component({ items }) {
  items.forEach((item) => {
    const [selected, setSelected] = useState(false);
  });
}

// ✅ CORRECT - component per item
function Item({ item }) {
  const [selected, setSelected] = useState(false);
  return <div>{item.name}</div>;
}

function Component({ items }) {
  return items.map((item) => <Item key={item.id} item={item} />);
}
```

### Mistake 4: Missing "use" Prefix

```javascript
// ❌ WRONG
function fetchData() {
  const [data, setData] = useState(null);
  useEffect(() => {
    /* fetch */
  }, []);
  return data;
}

// ✅ CORRECT
function useFetchData() {
  const [data, setData] = useState(null);
  useEffect(() => {
    /* fetch */
  }, []);
  return data;
}
```

---

## 🔑 Quick Reference

### Hook Order Checklist

```javascript
function Component() {
  // ✅ 1. All state hooks
  const [state1, setState1] = useState();
  const [state2, setState2] = useState();

  // ✅ 2. Refs
  const ref = useRef();

  // ✅ 3. Context
  const value = useContext(MyContext);

  // ✅ 4. Memoized values
  const computed = useMemo(() => {}, []);

  // ✅ 5. Callbacks
  const handler = useCallback(() => {}, []);

  // ✅ 6. Effects (last!)
  useEffect(() => {}, []);

  // ✅ 7. Render logic
  return <div>...</div>;
}
```

### ESLint Configuration

```json
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

---

## 🎯 Interview Confidence Builder

Before your interview, make sure you can:

1. ✅ Explain why hooks can't be conditional (React's internal indexing)
2. ✅ Describe all four hook rules from memory
3. ✅ Give examples of correct vs incorrect hook usage
4. ✅ Explain the purpose of the "use" prefix
5. ✅ Discuss ESLint's role in enforcing rules

**Remember:** The rules of hooks aren't arbitrary - they exist because of how React tracks state internally. Understanding the "why" behind the rules makes them easier to remember and explain!
