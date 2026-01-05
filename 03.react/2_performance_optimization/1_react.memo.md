# React.memo - Complete Interview Guide

## 🎯 Key Concepts

### 1. Component Memoization Concept

**What it means:**

- `React.memo` is a Higher-Order Component (HOC) that memoizes functional components
- It prevents re-renders when props haven't changed
- Uses shallow comparison to check if props changed
- Similar to `PureComponent` for class components

**The Problem React.memo Solves:**

```javascript
// WITHOUT React.memo
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <Child name="John" />
      {/* Child re-renders EVERY time Parent re-renders, even though name didn't change */}
    </div>
  );
}

// WITH React.memo
const Child = React.memo(function Child({ name }) {
  console.log("Child rendered");
  return <div>Hello {name}</div>;
});

// Now Child only re-renders when 'name' prop changes!
```

---

### 2. Shallow Prop Comparison

**How React.memo Compares Props:**

React.memo uses `Object.is()` comparison (like `===`) for each prop:

```javascript
// React.memo checks each prop:
Object.is(prevProps.name, nextProps.name);
Object.is(prevProps.age, nextProps.age);
// etc.

// Primitives - compared by value ✅
Object.is(5, 5); // true
Object.is("hello", "hello"); // true

// Objects/Arrays - compared by reference ⚠️
Object.is({ a: 1 }, { a: 1 }); // false (different objects!)
Object.is([1, 2], [1, 2]); // false (different arrays!)
```

**Example:**

```javascript
const MemoizedChild = React.memo(Child);

function Parent() {
  const [count, setCount] = useState(0);

  // ❌ PROBLEM - new object every render
  const config = { theme: "dark" };

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <MemoizedChild config={config} />
      {/* Child re-renders because config is always new reference */}
    </div>
  );
}

// ✅ SOLUTION - stable reference with useMemo
function Parent() {
  const [count, setCount] = useState(0);
  const config = useMemo(() => ({ theme: "dark" }), []);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <MemoizedChild config={config} />
      {/* Now child only re-renders when config actually changes */}
    </div>
  );
}
```

---

### 3. Custom Comparison Function

**When Shallow Comparison Isn't Enough:**

You can provide a custom comparison function as the second argument:

```javascript
const MyComponent = React.memo(
  function MyComponent({ user }) {
    return <div>{user.name}</div>;
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (should NOT re-render)
    // Return false if props are different (should re-render)
    return prevProps.user.id === nextProps.user.id;
  }
);
```

**Important:** The comparison function works **opposite** to `shouldComponentUpdate`:

- Return `true` = props are equal = **don't re-render**
- Return `false` = props changed = **do re-render**

**Example with Deep Comparison:**

```javascript
import isEqual from "lodash/isEqual";

const DeepMemoComponent = React.memo(
  function Component({ data }) {
    return <div>{JSON.stringify(data)}</div>;
  },
  (prevProps, nextProps) => {
    // Deep comparison - checks nested values
    return isEqual(prevProps.data, nextProps.data);
  }
);
```

---

### 4. When React.memo Helps vs Doesn't Help

**✅ Use React.memo when:**

#### Scenario 1: Component Renders Often with Same Props

```javascript
const ExpensiveList = React.memo(function ExpensiveList({ items }) {
  console.log("Rendering 1000 items...");
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
});

function Parent() {
  const [unrelatedState, setUnrelatedState] = useState(0);
  const items = useMemo(() => generateItems(), []); // Stable reference

  return (
    <div>
      <button onClick={() => setUnrelatedState((s) => s + 1)}>
        Unrelated: {unrelatedState}
      </button>
      <ExpensiveList items={items} />
      {/* List doesn't re-render when unrelated state changes! */}
    </div>
  );
}
```

#### Scenario 2: Pure Presentational Components

```javascript
// This component only depends on props, perfect for memo
const UserCard = React.memo(function UserCard({ name, email, avatar }) {
  return (
    <div className="card">
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
});
```

#### Scenario 3: Components in Lists

```javascript
const ListItem = React.memo(function ListItem({ item, onDelete }) {
  return (
    <div>
      {item.name}
      <button onClick={() => onDelete(item.id)}>Delete</button>
    </div>
  );
});

function List({ items }) {
  const handleDelete = useCallback((id) => {
    // Delete logic
  }, []);

  return (
    <div>
      {items.map((item) => (
        <ListItem key={item.id} item={item} onDelete={handleDelete} />
      ))}
    </div>
  );
}
```

**❌ Don't use React.memo when:**

#### Scenario 1: Props Change on Every Render

```javascript
// ❌ USELESS - props always change
const Component = React.memo(function Component({ timestamp }) {
  return <div>Time: {timestamp}</div>;
});

function Parent() {
  return <Component timestamp={Date.now()} />;
  // timestamp is always new, memo does nothing!
}
```

#### Scenario 2: Component is Fast to Render

```javascript
// ❌ OVERKILL - simple component
const Greeting = React.memo(function Greeting({ name }) {
  return <h1>Hello {name}</h1>;
});

// This component renders in microseconds, memo overhead not worth it
```

#### Scenario 3: Component Always Re-renders with Parent

```javascript
// ❌ POINTLESS - will re-render anyway
const Child = React.memo(function Child() {
  const context = useContext(MyContext); // Context changes trigger re-render
  return <div>{context.value}</div>;
});

// Context updates will cause re-render regardless of memo
```

---

### 5. Trade-offs and Overhead

**React.memo Has Costs:**

```javascript
// Cost of React.memo:
// 1. Props comparison on every parent render
// 2. Extra function call overhead
// 3. Memory to store previous props
// 4. Increased complexity

// When overhead is worth it:
// Component render time > Comparison time
```

**Measuring the Trade-off:**

```javascript
// WITHOUT React.memo
function Child({ data }) {
  console.time("render");
  // Expensive render logic
  console.timeEnd("render");
  return <div>{data}</div>;
}
// If this shows > 5-10ms, memo might help

// WITH React.memo
const Child = React.memo(function Child({ data }) {
  console.time("render");
  // Expensive render logic
  console.timeEnd("render");
  return <div>{data}</div>;
});
// Now only renders when data changes
```

**Performance Impact:**

| Scenario                        | Without memo | With memo                              | Benefit        |
| ------------------------------- | ------------ | -------------------------------------- | -------------- |
| Fast component                  | 0.1ms render | 0.05ms compare + 0.1ms render = 0.15ms | ❌ Slower      |
| Slow component (same props)     | 10ms render  | 0.05ms compare, skip render            | ✅ Much faster |
| Slow component (changing props) | 10ms render  | 0.05ms compare + 10ms render = 10.05ms | ≈ Same         |

---

### 6. React.memo with useCallback/useMemo

**The Holy Trinity of Optimization:**

React.memo works best when combined with `useCallback` and `useMemo`:

```javascript
const ExpensiveChild = React.memo(function ExpensiveChild({ data, onUpdate }) {
  console.log("Child rendered");
  return (
    <div>
      {data.items.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
      <button onClick={onUpdate}>Update</button>
    </div>
  );
});

function Parent() {
  const [count, setCount] = useState(0);

  // ❌ WITHOUT optimization - child re-renders always
  const data = {
    items: [
      /* ... */
    ],
  };
  const handleUpdate = () => console.log("update");

  // ✅ WITH optimization - child only re-renders when dependencies change
  const data = useMemo(
    () => ({
      items: [
        /* ... */
      ],
    }),
    []
  );
  const handleUpdate = useCallback(() => console.log("update"), []);

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Parent: {count}</button>
      <ExpensiveChild data={data} onUpdate={handleUpdate} />
    </div>
  );
}
```

---

## 🎤 Top Interview Questions & Model Answers

### Q1: What is React.memo and when should you use it?

**Answer:**

> "React.memo is a higher-order component that memoizes functional components to prevent unnecessary re-renders. It does a shallow comparison of props - if they haven't changed, React skips rendering the component and reuses the last rendered output. You should use it when a component renders often with the same props, is expensive to render, or is a pure presentational component. However, it's not always beneficial - for components that render quickly or have frequently changing props, the overhead of comparison can outweigh the benefits. I always profile first before adding React.memo."

---

### Q2: How does React.memo compare props?

**Answer:**

> "React.memo uses shallow comparison with Object.is() for each prop. This means primitives like numbers and strings are compared by value, but objects and arrays are compared by reference. This is why you often need to combine React.memo with useMemo or useCallback - if you pass a new object or function on every render, React.memo won't prevent re-renders because it sees a different reference. You can also provide a custom comparison function as the second argument if you need different comparison logic, like deep equality checks."

---

### Q3: What's the difference between React.memo and useMemo?

**Answer:**

> "React.memo and useMemo are different tools for different purposes. React.memo memoizes an entire component - it wraps a component and prevents it from re-rendering when props haven't changed. useMemo memoizes a computed value within a component - it caches the result of an expensive calculation. You use React.memo on component definitions to optimize when components render. You use useMemo inside components to optimize what gets computed. They're often used together - you might use useMemo to create stable prop references for components wrapped in React.memo."

---

### Q4: Can you provide a custom comparison function to React.memo?

**Answer:**

> "Yes, React.memo accepts a second argument which is a custom comparison function. It receives prevProps and nextProps, and should return true if the props are equal (don't re-render) or false if they're different (do re-render). This is useful when you want to compare props more deeply than shallow comparison, or when you only care about specific prop values. For example, if you're passing a large user object but only care if the user ID changed, you could compare just the IDs. However, be careful with deep comparisons as they can be expensive themselves."

**Code Example:**

```javascript
const UserComponent = React.memo(
  function UserComponent({ user }) {
    return <div>{user.name}</div>;
  },
  (prevProps, nextProps) => {
    // Only re-render if user ID changed
    return prevProps.user.id === nextProps.user.id;
  }
);
```

---

### Q5: What are the performance trade-offs of React.memo?

**Answer:**

> "React.memo isn't free - it has overhead from comparing props on every render and storing the previous props in memory. For components that render quickly, this overhead can actually make performance worse. The benefit only outweighs the cost when the component is expensive to render and receives the same props frequently. I've seen cases where overusing React.memo made apps slower because most components changed their props on every render anyway. The key is to profile first, identify actual performance bottlenecks, and apply React.memo strategically rather than wrapping every component."

---

### Q6: Why doesn't React.memo work with my component even though props look the same?

**Answer:**

> "This is almost always a referential equality issue. Even though the props might have the same values, if you're passing objects, arrays, or functions, they have new references on every render. For example, creating an object like {theme: 'dark'} inline or defining a function inside render creates a new reference each time. React.memo sees different references and triggers a re-render. The solution is to use useMemo for objects and arrays, and useCallback for functions, to maintain stable references across renders. This is why React.memo works best when combined with these hooks."

---

### Q7: When should you NOT use React.memo?

**Answer:**

> "Don't use React.memo when the component is already fast to render - simple presentational components often render in under a millisecond, so the comparison overhead isn't worth it. Don't use it when props change on most renders anyway - you're just adding overhead without preventing re-renders. Avoid it when the component uses Context or has internal state that changes frequently, because those will trigger re-renders regardless of props. Also, don't use it as a premature optimization - start with clear code, profile to find real bottlenecks, then apply memo strategically."

---

## 🚨 Common Mistakes to Avoid

### 1. Wrapping Every Component

```javascript
// ❌ WRONG - memo everything reflexively
const Title = React.memo(({ text }) => <h1>{text}</h1>);
const Button = React.memo(({ onClick }) => (
  <button onClick={onClick}>Click</button>
));
const Icon = React.memo(({ name }) => <i className={name} />);

// These are too simple to benefit from memo
```

### 2. Not Stabilizing Object Props

```javascript
// ❌ WRONG - new object every render
const MemoChild = React.memo(Child);

function Parent() {
  return <MemoChild config={{ theme: "dark" }} />;
  // Memo is useless here!
}

// ✅ CORRECT - stable reference
function Parent() {
  const config = useMemo(() => ({ theme: "dark" }), []);
  return <MemoChild config={config} />;
}
```

### 3. Not Stabilizing Function Props

```javascript
// ❌ WRONG - new function every render
const MemoChild = React.memo(Child);

function Parent() {
  return <MemoChild onUpdate={() => console.log("update")} />;
  // Memo is useless!
}

// ✅ CORRECT - stable function reference
function Parent() {
  const handleUpdate = useCallback(() => console.log("update"), []);
  return <MemoChild onUpdate={handleUpdate} />;
}
```

### 4. Using Memo with Context Consumers

```javascript
// ❌ POINTLESS - context updates cause re-render anyway
const MemoComponent = React.memo(function Component() {
  const value = useContext(MyContext);
  return <div>{value}</div>;
});

// Context changes will trigger re-render regardless of memo
```

### 5. Complex Comparison Functions

```javascript
// ❌ BAD - expensive comparison defeats the purpose
const MemoComponent = React.memo(Component, (prev, next) => {
  // Deep equality check on large objects
  return JSON.stringify(prev) === JSON.stringify(next);
  // This might be slower than just re-rendering!
});
```

---

## 🔑 Interview Checklist

### ✅ Must Know

- ✅ What React.memo does (component memoization)
- ✅ When to use it (expensive components with stable props)
- ✅ When NOT to use it (fast components, changing props)
- ✅ Shallow comparison behavior
- ✅ Combining with useCallback/useMemo

### ✅ Should Know

- ✅ Custom comparison function
- ✅ Performance trade-offs
- ✅ Difference from useMemo
- ✅ Common pitfalls (object/function props)
- ✅ How to measure effectiveness

### ✅ Nice to Know

- [ ] Relationship to PureComponent
- [ ] When overhead outweighs benefits
- [ ] Profiling techniques
- [ ] Alternative optimization strategies

---

## 💡 Pro Tips for Interviews

1. **Profile First**: Always emphasize measuring before optimizing
2. **Know Referential Equality**: Explain object/array comparison clearly
3. **Practical Examples**: Have stories about when you used it effectively
4. **Know the Limits**: Show you understand it's not a silver bullet
5. **Combine with Hooks**: Demonstrate knowledge of useMemo/useCallback integration

---

## 📚 Quick Reference

```javascript
// Basic usage
const MyComponent = React.memo(function MyComponent({ name, age }) {
  return (
    <div>
      {name} - {age}
    </div>
  );
});

// With custom comparison
const MyComponent = React.memo(
  function MyComponent(props) {
    return <div>{props.data}</div>;
  },
  (prevProps, nextProps) => {
    return prevProps.data.id === nextProps.data.id;
  }
);

// Complete optimization pattern
const OptimizedChild = React.memo(function Child({ data, onUpdate }) {
  return <div>{data.value}</div>;
});

function Parent() {
  const data = useMemo(() => ({ value: "stable" }), []);
  const handleUpdate = useCallback(() => {}, []);

  return <OptimizedChild data={data} onUpdate={handleUpdate} />;
}
```

---

## 🎯 The Golden Rule

**"Use React.memo for expensive components that receive the same props frequently, and always stabilize object/function props with useMemo/useCallback"**

Ask yourself:

1. Is this component expensive to render? (>5-10ms) → Maybe memo
2. Does it receive the same props often? → Maybe memo
3. Are props objects/functions stabilized? → Required for memo to work
4. Have I profiled and confirmed the benefit? → Use memo
5. None of the above? → Don't use memo
