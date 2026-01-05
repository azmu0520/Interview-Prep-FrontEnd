# useState

## 🎯 Key Concepts

### 1. State Updates Are Asynchronous

**What it means:**

- React batches state updates for performance optimization
- When you call `setState`, the value doesn't change immediately
- The state update is scheduled, and the component re-renders with the new value

**Why it matters:**

```javascript
const [count, setCount] = useState(0);

const handleClick = () => {
  setCount(5);
  console.log(count); // ❌ Still 0, not 5!
};
```

**Key Points:**

- State updates are queued and processed together
- You can't access the new state value in the same function execution
- Use `useEffect` to react to state changes
- React 18 automatically batches updates everywhere (events, promises, timeouts)

---

### 2. Functional Updates (CRITICAL!)

**What it means:**

- When new state depends on previous state, use the updater function pattern
- Pass a function to `setState` instead of a direct value

**The Problem:**

```javascript
// ❌ BAD - Stale closure problem
const handleClick = () => {
  setCount(count + 1);
  setCount(count + 1); // Both use same 'count' value
  setCount(count + 1); // Result: count + 1, NOT count + 3
};
```

**The Solution:**

```javascript
// ✅ GOOD - Each update gets latest state
const handleClick = () => {
  setCount((prev) => prev + 1);
  setCount((prev) => prev + 1); // Uses updated value
  setCount((prev) => prev + 1); // Result: count + 3 ✓
};
```

**When to use:**

- ✅ Incrementing/decrementing counters
- ✅ Adding items to arrays
- ✅ Toggling booleans
- ✅ Any time new state depends on old state
- ✅ Inside loops or async callbacks

**Interview Gold:** This is the #1 useState mistake! Always mention this pattern.

---

### 3. Lazy Initialization

**What it means:**

- For expensive initial state calculations, pass a function instead of calling it directly
- The function runs **only once** on component mount, not on every render

**The Problem:**

```javascript
// ❌ BAD - Runs on EVERY render
const expensiveComputation = () => {
  let sum = 0;
  for (let i = 0; i < 1000000; i++) sum += i;
  return sum;
};

const [value, setValue] = useState(expensiveComputation());
// Function executes on every render! 🔥
```

**The Solution:**

```javascript
// ✅ GOOD - Runs only once on mount
const [value, setValue] = useState(() => expensiveComputation());
// Function only executes on initial render ✓
```

**Use cases:**

- Reading from localStorage
- Complex calculations
- Parsing large data structures
- Any expensive synchronous operation

**Performance tip:** This is a real optimization, not premature optimization!

---

### 4. Immutable Updates for Objects and Arrays

**What it means:**

- React detects state changes by comparing references
- You must create new objects/arrays, not mutate existing ones

**Array Operations:**

```javascript
const [items, setItems] = useState(["a", "b", "c"]);

// ❌ WRONG - Mutations don't trigger re-render
items.push("d"); // Mutates array
items[0] = "x"; // Mutates array
items.sort(); // Mutates array

// ✅ CORRECT - Create new arrays
setItems([...items, "d"]); // Add item
setItems(items.filter((item) => item !== "b")); // Remove item
setItems(items.map((item) => item.toUpperCase())); // Transform
setItems([...items].sort()); // Sort
```

**Object Operations:**

```javascript
const [user, setUser] = useState({ name: "John", age: 25 });

// ❌ WRONG - Mutation
user.age = 26;
setUser(user); // Same reference, no re-render!

// ✅ CORRECT - New object
setUser({ ...user, age: 26 });
```

**Nested Object Updates:**

```javascript
const [user, setUser] = useState({
  name: "John",
  address: { city: "NYC", zip: "10001" },
});

// ✅ Update nested object immutably
setUser((prev) => ({
  ...prev,
  address: {
    ...prev.address,
    city: "LA",
  },
}));
```

---

### 5. Multiple State Variables vs Single Object

**The Question:** Should I use multiple `useState` calls or one with an object?

**Multiple States (Preferred when independent):**

```javascript
// ✅ GOOD - States are independent
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [isLoading, setIsLoading] = useState(false);
```

**Advantages:**

- Updates only what changes
- Cleaner updates
- No need to spread previous state
- Better for simple, independent values

**Single Object (Preferred when related):**

```javascript
// ✅ GOOD - States are related/updated together
const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  email: "",
});

// Update one field
setFormData((prev) => ({ ...prev, email: "new@email.com" }));
```

**Advantages:**

- Logical grouping
- Pass entire object to API
- Easier to reset all fields
- Better for related data

**Decision Framework:**

- **Independent data** → Multiple `useState`
- **Related data that updates together** → Single object
- **Complex nested data** → Consider `useReducer`

---

### 6. State Batching Behavior

**React 18 Automatic Batching:**

```javascript
const handleClick = () => {
  setCount1((c) => c + 1);
  setCount2((c) => c + 1);
  setCount3((c) => c + 1);
  // Only ONE re-render! React batches all updates
};

// Even works in async code now!
setTimeout(() => {
  setCount1((c) => c + 1);
  setCount2((c) => c + 1);
  // Still only ONE re-render in React 18!
}, 1000);
```

**What gets batched:**

- ✅ Event handlers
- ✅ Promises
- ✅ setTimeout/setInterval
- ✅ Native event handlers
- ✅ Basically everything in React 18

**Before React 18:**

- Only batched in event handlers
- Async code caused multiple renders

---

## 🎤 Top Interview Questions & Model Answers

### Q1: Why doesn't my state update immediately after calling setState?

**Answer:**

> "State updates in React are asynchronous and batched for performance. When you call `setState`, React schedules a re-render rather than updating immediately. This allows React to batch multiple state updates together and re-render once, which is much more efficient. If you need to perform an action after the state updates, you can use `useEffect` with that state in the dependency array."

---

### Q2: What's the difference between `setState(value)` and `setState(prev => value)`?

**Answer:**

> "The functional update form `setState(prev => newValue)` should be used when the new state depends on the previous state. This is critical because state updates are asynchronous and batched. If you have multiple updates in quick succession, using the direct form can lead to stale state bugs where all updates use the same old value. The functional form guarantees you're working with the latest state by providing the most recent value as the `prev` parameter."

**Example to mention:**

```javascript
// Direct form - all use same value, only increments by 1
setCount(count + 1);
setCount(count + 1);

// Functional form - each gets latest, increments by 2
setCount((prev) => prev + 1);
setCount((prev) => prev + 1);
```

---

### Q3: How do you update nested objects in state?

**Answer:**

> "You need to create a new object at each level of nesting using the spread operator. React uses shallow comparison to detect changes, so mutating a nested property won't trigger a re-render. For deeply nested state, I'd either carefully spread at each level, or consider using `useReducer` for more complex state logic, or even a library like Immer that handles immutable updates for you."

**Show code:**

```javascript
setUser((prev) => ({
  ...prev,
  address: {
    ...prev.address,
    city: "New York",
  },
}));
```

---

### Q4: When should you use multiple useState vs single useState with an object?

**Answer:**

> "I use multiple `useState` hooks when the state variables are independent and updated separately. This keeps updates simple and avoids unnecessary spreading. I use a single object when the values are related and often updated together, like form fields that get submitted as one payload. The key question is: do these values have a logical relationship? If yes, group them. If no, keep them separate. For complex state with many related values, I'd also consider `useReducer`."

---

### Q5: What is lazy initialization and when would you use it?

**Answer:**

> "Lazy initialization is when you pass a function to `useState` instead of calling it directly. The function only runs once during the initial render, not on every re-render. This is important for expensive operations like reading from localStorage, complex calculations, or parsing large data. Instead of `useState(expensiveFunc())` which runs on every render, you use `useState(() => expensiveFunc())` which only runs once."

---

### Q6: Can you explain state batching in React 18?

**Answer:**

> "React 18 introduced automatic batching for all state updates, not just those in event handlers. This means multiple `setState` calls—even in promises, setTimeout, or native event handlers—are batched together into a single re-render for better performance. Before React 18, only updates in React event handlers were batched. This is completely automatic and transparent to developers, but it's important to use functional updates when state depends on previous state to avoid stale closure issues."

---

## 🔑 Checklist

- ✅ Functional update pattern and when to use it
- ✅ Why state updates are asynchronous
- ✅ Immutable update patterns for objects/arrays
- ✅ When to split state vs combine in object

### ✅ Should Know (Often asked)

- ✅ Lazy initialization for performance
- ✅ State batching behavior (especially React 18)
- ✅ Common pitfalls (stale closures, mutations)
- ✅ How to update nested state

### ✅ Nice to Know (Senior level)

- [ ] When to use `useReducer` instead
- [ ] Performance implications of state structure
- [ ] State colocation principles
- [ ] Avoiding unnecessary re-renders

---

## 🚨 Common Mistakes to Avoid

### 1. Mutating State Directly

```javascript
// ❌ NEVER do this
state.push(item);
state.property = value;
```

### 2. Using Stale State in Closures

```javascript
// ❌ BAD
setTimeout(() => {
  setCount(count + 1); // 'count' is stale
}, 1000);

// ✅ GOOD
setTimeout(() => {
  setCount((prev) => prev + 1);
}, 1000);
```

### 3. Expecting Immediate Updates

```javascript
// ❌ Misunderstanding async nature
setCount(5);
console.log(count); // Still old value!
```

### 4. Unnecessary Object State

```javascript
// ❌ Overkill for independent values
const [state, setState] = useState({
  isLoading: false,
  error: null,
  data: null,
});

// ✅ Better - they're independent
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState(null);
```
