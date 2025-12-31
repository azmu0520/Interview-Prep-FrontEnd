# useEffect - Complete Interview Guide

## 🎯 Key Concepts You Must Understand

### 1. Effect Execution Timing

**What it means:**

- `useEffect` runs **AFTER** the component renders and the browser paints
- It's asynchronous and non-blocking
- DOM updates are visible to the user before effects run

**The Execution Flow:**

```
1. React renders component (JSX → Virtual DOM)
2. React updates real DOM
3. Browser paints screen (user sees update)
4. useEffect runs
```

**Key Points:**

- Effects don't block the browser from updating the screen
- This is why React is fast - visual updates happen first
- For effects that need to run before paint, use `useLayoutEffect`

**Common Pitfall:**

```javascript
useEffect(() => {
  console.log("Effect runs");
});
// Logs AFTER the component is visible on screen
```

---

### 2. Dependency Array Behavior (CRITICAL!)

**Three Patterns:**

#### Pattern 1: No Dependency Array

```javascript
useEffect(() => {
  console.log("Runs after EVERY render");
});
// Runs on mount AND after every update
```

#### Pattern 2: Empty Dependency Array

```javascript
useEffect(() => {
  console.log("Runs only once on mount");
}, []);
// Runs only once - component mount
```

#### Pattern 3: With Dependencies

```javascript
useEffect(() => {
  console.log("Runs when count or name changes");
}, [count, name]);
// Runs on mount + when dependencies change
```

**How React Compares Dependencies:**

- Uses `Object.is()` comparison (similar to `===`)
- **Shallow comparison** - only checks reference equality
- New object/array reference = dependency changed

**Critical Understanding:**

```javascript
// ❌ INFINITE LOOP - new object every render
useEffect(() => {
  console.log("Effect runs");
}, [{ id: 1 }]); // New object reference each time!

// ✅ CORRECT - stable primitive value
useEffect(() => {
  console.log("Effect runs");
}, [userId]); // Primitive value, stable reference
```

---

### 3. Cleanup Functions (Purpose and Timing)

**What it means:**

- Return a function from useEffect to "clean up" side effects
- Cleanup runs **before** the next effect and on unmount

**When Cleanup Runs:**

```javascript
useEffect(() => {
  console.log("Effect runs");

  return () => {
    console.log("Cleanup runs");
  };
}, [dependency]);

// Order of execution:
// 1. Effect runs (first render)
// 2. Dependency changes
// 3. Cleanup runs (before next effect)
// 4. Effect runs again (with new dependency)
// 5. Component unmounts
// 6. Cleanup runs (final cleanup)
```

**Common Use Cases:**

```javascript
// Subscriptions
useEffect(() => {
  const subscription = api.subscribe();
  return () => subscription.unsubscribe();
}, []);

// Event listeners
useEffect(() => {
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

// Timers
useEffect(() => {
  const timer = setTimeout(() => console.log("Hello"), 1000);
  return () => clearTimeout(timer);
}, []);

// Abort fetch requests
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal });
  return () => controller.abort();
}, [url]);
```

**Why Cleanup Matters:**

- Prevents memory leaks
- Avoids bugs from stale subscriptions
- Cancels outdated async operations

---

### 4. Effect Execution Order

**Multiple Effects in One Component:**

```javascript
useEffect(() => {
  console.log("Effect 1");
}, []);

useEffect(() => {
  console.log("Effect 2");
}, []);

useEffect(() => {
  console.log("Effect 3");
}, []);

// Output: Effect 1, Effect 2, Effect 3
// Effects run in the order they're defined
```

**Parent vs Child Effects:**

```javascript
function Parent() {
  useEffect(() => console.log("Parent effect"), []);
  return <Child />;
}

function Child() {
  useEffect(() => console.log("Child effect"), []);
  return <div>Child</div>;
}

// Output: Child effect, Parent effect
// Child effects run before parent effects (bottom-up)
```

---

### 5. Running Effects Once (Empty Dependency Array)

**The Pattern:**

```javascript
useEffect(() => {
  // Runs only once on mount
  fetchData();
  setupSubscription();
  initializeApp();
}, []); // Empty array = run once
```

**Common Uses:**

- Initial data fetching
- Setting up subscriptions
- Initializing third-party libraries
- One-time setup operations

**Important Note:**

- In React 18 Strict Mode (development), effects run **twice**
- This is intentional - helps catch bugs
- Only happens in development, not production

```javascript
useEffect(() => {
  console.log("Mounting");
  return () => console.log("Unmounting");
}, []);

// In Strict Mode (dev) you'll see:
// Mounting
// Unmounting
// Mounting
// This tests that your cleanup works correctly!
```

---

### 6. Conditional Effect Execution

**Pattern 1: Condition Inside Effect**

```javascript
useEffect(() => {
  if (userId) {
    fetchUserData(userId);
  }
}, [userId]);
// Effect always runs, but logic is conditional
```

**Pattern 2: Early Return**

```javascript
useEffect(() => {
  if (!isReady) return;

  doSomething();
}, [isReady]);
```

**Pattern 3: Multiple Effects**

```javascript
// Run only when user logs in
useEffect(() => {
  if (user) {
    fetchUserData();
  }
}, [user]);

// Run only when settings change
useEffect(() => {
  if (settings) {
    updatePreferences();
  }
}, [settings]);
```

---

### 7. Effects with Async Operations

**The Problem:**

```javascript
// ❌ WRONG - useEffect cannot be async
useEffect(async () => {
  const data = await fetchData();
  setData(data);
}, []);
// Error: useEffect must return a cleanup function or nothing
```

**Solution 1: Async Function Inside**

```javascript
// ✅ CORRECT - async function inside effect
useEffect(() => {
  const fetchData = async () => {
    const data = await fetch(url);
    setData(data);
  };

  fetchData();
}, [url]);
```

**Solution 2: IIFE (Immediately Invoked Function Expression)**

```javascript
// ✅ CORRECT - IIFE pattern
useEffect(() => {
  (async () => {
    const data = await fetch(url);
    setData(data);
  })();
}, [url]);
```

**Solution 3: .then() Chain**

```javascript
// ✅ CORRECT - promise chain
useEffect(() => {
  fetch(url)
    .then((res) => res.json())
    .then((data) => setData(data));
}, [url]);
```

**With Cleanup (Abort Controller):**

```javascript
// ✅ BEST PRACTICE - with cancellation
useEffect(() => {
  const controller = new AbortController();

  const fetchData = async () => {
    try {
      const response = await fetch(url, {
        signal: controller.signal,
      });
      const data = await response.json();
      setData(data);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      }
    }
  };

  fetchData();

  return () => controller.abort();
}, [url]);
```

---

### 8. Dependency Array Best Practices

**Rule 1: Include ALL values used inside effect**

```javascript
// ❌ WRONG - missing dependency
useEffect(() => {
  console.log(count);
}, []); // ESLint will warn you!

// ✅ CORRECT - include all dependencies
useEffect(() => {
  console.log(count);
}, [count]);
```

**Rule 2: Objects/Arrays in Dependencies**

```javascript
// ❌ PROBLEM - new object every render
const user = { id: userId, name: userName };
useEffect(() => {
  fetchData(user);
}, [user]); // New reference every render!

// ✅ SOLUTION 1 - destructure primitives
useEffect(() => {
  fetchData({ id: userId, name: userName });
}, [userId, userName]);

// ✅ SOLUTION 2 - useMemo for stable reference
const user = useMemo(
  () => ({ id: userId, name: userName }),
  [userId, userName]
);
useEffect(() => {
  fetchData(user);
}, [user]);
```

**Rule 3: Functions in Dependencies**

```javascript
// ❌ PROBLEM - new function every render
const fetchUser = () => {
  fetch(`/api/users/${userId}`);
};

useEffect(() => {
  fetchUser();
}, [fetchUser]); // Runs every render!

// ✅ SOLUTION 1 - useCallback
const fetchUser = useCallback(() => {
  fetch(`/api/users/${userId}`);
}, [userId]);

useEffect(() => {
  fetchUser();
}, [fetchUser]);

// ✅ SOLUTION 2 - define function inside effect
useEffect(() => {
  const fetchUser = () => {
    fetch(`/api/users/${userId}`);
  };
  fetchUser();
}, [userId]);
```

---

### 9. Common Infinite Loop Causes

**Cause 1: Missing Dependency Array**

```javascript
// ❌ INFINITE LOOP
useEffect(() => {
  setCount(count + 1);
});
// Runs after every render → triggers render → runs again → ∞
```

**Cause 2: Object/Array in Dependencies**

```javascript
// ❌ INFINITE LOOP
useEffect(() => {
  const data = fetchData();
  setData(data);
}, [data]); // 'data' is new object each render!
```

**Cause 3: Setting State Unconditionally**

```javascript
// ❌ INFINITE LOOP
useEffect(() => {
  setData(fetchData()); // Always sets state
}, [data]); // Causes re-render → runs again → ∞
```

**Solutions:**

```javascript
// ✅ Add dependency array
useEffect(() => {
  setCount(count + 1);
}, []); // Run once only

// ✅ Use primitive dependencies
useEffect(() => {
  const fetchedData = fetchData();
  setData(fetchedData);
}, [userId]); // Track primitive value

// ✅ Conditional state update
useEffect(() => {
  const newData = fetchData();
  if (newData !== data) {
    setData(newData);
  }
}, [userId]);
```

---

### 10. useEffect vs useLayoutEffect

**useEffect:**

- Runs **after** browser paint (asynchronous)
- Non-blocking
- Use for 99% of side effects

**useLayoutEffect:**

- Runs **before** browser paint (synchronous)
- Blocks painting
- Use only when you need to measure/mutate DOM before user sees it

**When to Use useLayoutEffect:**

```javascript
// ✅ Measuring DOM elements
useLayoutEffect(() => {
  const rect = ref.current.getBoundingClientRect();
  setHeight(rect.height);
}, []);

// ✅ Animations that must be set before paint
useLayoutEffect(() => {
  element.style.transform = "translateX(100px)";
}, []);

// ✅ Preventing visual flicker
useLayoutEffect(() => {
  // Adjust position before user sees it
  adjustTooltipPosition();
}, [isOpen]);
```

**Visual Difference:**

```
useEffect:
Render → Paint → Effect runs → (potential flicker if DOM changes)

useLayoutEffect:
Render → Effect runs → Paint → (no flicker)
```

---

## 🎤 Top Interview Questions & Model Answers

### Q1: When does the cleanup function run?

**Model Answer:**

> "The cleanup function runs in two scenarios: First, it runs before the effect executes again when dependencies change - this cleans up the previous effect before running the new one. Second, it runs when the component unmounts to clean up any subscriptions, timers, or listeners. This prevents memory leaks and ensures we don't have stale subscriptions active. A common example is cleaning up event listeners or canceling fetch requests."

**Code Example to Mention:**

```javascript
useEffect(() => {
  const timer = setInterval(() => console.log("tick"), 1000);
  return () => clearInterval(timer); // Cleanup
}, []);
```

---

### Q2: Why is my effect running infinitely?

**Model Answer:**

> "Infinite loops in useEffect usually happen for three reasons: First, you might be missing the dependency array, causing it to run after every render. Second, you might have an object or array in the dependency array that's being recreated each render, so React sees it as a new value. Third, you might be setting state inside the effect unconditionally, which triggers a re-render, which runs the effect again. The fix is to add a proper dependency array with primitive values, or use useMemo/useCallback for stable references."

---

### Q3: What happens if I omit the dependency array?

**Model Answer:**

> "Omitting the dependency array means the effect runs after every render - both the initial render and all subsequent updates. This is rarely what you want and can cause performance issues. It's different from an empty array `[]` which runs only once on mount. You should always include a dependency array - either empty for one-time effects, or with dependencies for effects that should re-run when specific values change."

**Three Patterns:**

- No array: `useEffect(() => {})` → Runs every render
- Empty array: `useEffect(() => {}, [])` → Runs once
- With deps: `useEffect(() => {}, [dep])` → Runs when dep changes

---

### Q4: How do you handle async operations in useEffect?

**Model Answer:**

> "You can't make useEffect itself async because it must return either nothing or a cleanup function. Instead, you define an async function inside the effect and call it immediately. For production code, you should also use an AbortController to cancel the request if the component unmounts or dependencies change, preventing state updates on unmounted components and race conditions."

**Best Practice Example:**

```javascript
useEffect(() => {
  const controller = new AbortController();

  const fetchData = async () => {
    try {
      const response = await fetch(url, {
        signal: controller.signal,
      });
      const data = await response.json();
      setData(data);
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error);
      }
    }
  };

  fetchData();
  return () => controller.abort();
}, [url]);
```

---

### Q5: What's the difference between useEffect and useLayoutEffect?

**Model Answer:**

> "useEffect runs asynchronously after the browser has painted, making it non-blocking and suitable for most side effects like data fetching or subscriptions. useLayoutEffect runs synchronously before the browser paints, blocking the paint until it completes. You should use useLayoutEffect only when you need to read layout from the DOM and make visual changes before the user sees them - like measuring element dimensions or preventing flicker. In 99% of cases, useEffect is the right choice."

---

### Q6: Why do effects run twice in React 18 development mode?

**Model Answer:**

> "In React 18 Strict Mode, effects intentionally run twice in development to help catch bugs related to missing cleanup functions. React mounts the component, runs the effect, then immediately unmounts it (running cleanup), and remounts it again (running the effect again). This helps ensure your cleanup logic works correctly and that your effects are properly idempotent. This only happens in development mode, not in production, so it doesn't affect real users."

---

### Q7: How do you fetch data on component mount?

**Model Answer:**

> "I use useEffect with an empty dependency array to fetch data once on mount. Inside the effect, I define an async function that fetches the data, handles errors, and updates state. I also use an AbortController to cancel the request if the component unmounts before the fetch completes, preventing the 'Can't perform a React state update on an unmounted component' warning."

**Complete Example:**

```javascript
useEffect(() => {
  let ignore = false; // Or use AbortController

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/data");
      const data = await response.json();

      if (!ignore) {
        setData(data);
      }
    } catch (error) {
      if (!ignore) {
        setError(error);
      }
    } finally {
      if (!ignore) {
        setLoading(false);
      }
    }
  };

  fetchData();
  return () => {
    ignore = true;
  };
}, []);
```

---

### Q8: Can you have multiple useEffect hooks in one component?

**Model Answer:**

> "Yes, absolutely! It's actually considered a best practice to separate concerns by using multiple useEffect hooks. Each effect should handle one specific side effect - one for data fetching, another for subscriptions, another for analytics, etc. This makes the code more readable and maintainable. The effects run in the order they're defined, and each can have its own dependencies and cleanup function."

---

## 🚨 Common Mistakes to Avoid

### 1. Making useEffect Async

```javascript
// ❌ NEVER do this
useEffect(async () => {
  const data = await fetchData();
}, []);
```

### 2. Missing Dependencies

```javascript
// ❌ ESLint will warn you
useEffect(() => {
  console.log(count); // Uses 'count'
}, []); // But doesn't list it!
```

### 3. Objects in Dependencies

```javascript
// ❌ New object every render
useEffect(() => {
  fetchData(filters);
}, [filters]); // If filters is an object
```

### 4. Not Cleaning Up Subscriptions

```javascript
// ❌ Memory leak!
useEffect(() => {
  socket.on("message", handleMessage);
  // Missing: return () => socket.off('message', handleMessage);
}, []);
```

### 5. Setting State in Effect Without Condition

```javascript
// ❌ Potential infinite loop
useEffect(() => {
  setData(expensiveCalculation());
}, [data]); // Sets data → triggers effect → sets data → ∞
```

---

## 🔑 Interview Checklist - What Interviewers Look For

### ✅ Must Know (Will definitely be asked)

- [ ] When effects run (after paint)
- [ ] How dependency array works (shallow comparison)
- [ ] Purpose and timing of cleanup functions
- [ ] How to handle async operations
- [ ] Common infinite loop causes

### ✅ Should Know (Often asked)

- [ ] Running effects once (empty array)
- [ ] Effect execution order
- [ ] Why effects run twice in Strict Mode
- [ ] Difference from useLayoutEffect
- [ ] Best practices for data fetching

### ✅ Nice to Know (Senior level)

- [ ] Race condition handling
- [ ] AbortController usage
- [ ] Performance optimization strategies
- [ ] Custom hooks with effects
- [ ] Effect dependency optimization

---

## 💡 Pro Tips for Interviews

1. **Always mention cleanup**: When discussing effects, show you understand cleanup prevents memory leaks

2. **Know the timing**: Be clear that useEffect runs after paint, not before

3. **Dependency array mastery**: Explain shallow comparison and why objects/arrays are tricky

4. **Real-world examples**: Have stories about debugging infinite loops or implementing data fetching

5. **Show best practices**: Mention AbortController, error handling, loading states

6. **Compare to class components**: If asked, mention componentDidMount, componentDidUpdate, componentWillUnmount

---

## 📚 Quick Reference - Common Patterns

```javascript
// Run once on mount
useEffect(() => {
  // Setup
  return () => {
    // Cleanup
  };
}, []);

// Run when dependency changes
useEffect(() => {
  // Effect
}, [dependency]);

// Data fetching with cleanup
useEffect(() => {
  const controller = new AbortController();

  fetch(url, { signal: controller.signal })
    .then((res) => res.json())
    .then(setData);

  return () => controller.abort();
}, [url]);

// Event listener with cleanup
useEffect(() => {
  const handler = () => console.log("clicked");
  window.addEventListener("click", handler);
  return () => window.removeEventListener("click", handler);
}, []);

// Timer with cleanup
useEffect(() => {
  const timer = setTimeout(() => console.log("Hello"), 1000);
  return () => clearTimeout(timer);
}, []);

// Subscription with cleanup
useEffect(() => {
  const subscription = observable.subscribe();
  return () => subscription.unsubscribe();
}, []);
```

---

## 🎯 Mental Model

Think of useEffect as: **"When something changes, do something, and clean up when done"**

- **When**: Dependencies change (or mount)
- **Do**: Your side effect
- **Clean up**: Prevent leaks and stale behavior

**Remember:** Effects are for synchronizing with external systems (APIs, DOM, subscriptions), not for transforming data (use regular functions or useMemo for that).
