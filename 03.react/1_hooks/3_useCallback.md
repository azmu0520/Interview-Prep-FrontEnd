# useMemo - Complete Interview Guide

## 🎯 Key Concepts

### 1. What is useMemo?

**Core Understanding:**

- `useMemo` is a hook that **memoizes a computed value**
- Returns the **cached result** of an expensive calculation
- Only **recalculates** when dependencies change
- Used for **performance optimization**
- Similar to useCallback, but for **values instead of functions**

**The Basic Pattern:**

```javascript
const memoizedValue = useMemo(() => {
  return expensiveCalculation(a, b);
}, [a, b]);

// Without useMemo - recalculates on every render
const value = expensiveCalculation(a, b);

// With useMemo - only recalculates when a or b change
const value = useMemo(() => expensiveCalculation(a, b), [a, b]);
```

**Simple Example:**

```javascript
function SearchResults({ items, query }) {
  // ❌ WITHOUT useMemo - filters on every render
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  // ✅ WITH useMemo - only filters when items or query change
  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [items, query]);

  return (
    <ul>
      {filteredItems.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

---

### 2. Value Memoization Concept

**What is Memoization?**

Memoization is a caching technique where you store the result of expensive function calls and return the cached result when the same inputs occur again.

**How useMemo Works:**

```javascript
// First render with a=2, b=3
const result = useMemo(() => {
  console.log("Computing...");
  return a * b;
}, [a, b]);
// Output: "Computing..."
// result = 6

// Second render with same a=2, b=3
// Output: (nothing - uses cached value)
// result = 6 (from cache)

// Third render with a=2, b=4
// Output: "Computing..."
// result = 8 (recalculated because b changed)
```

**Memory vs Computation Trade-off:**

```javascript
// Without useMemo
function Component({ data }) {
  // Runs expensive operation on every render
  const processed = expensiveOperation(data); // 100ms

  return <Display data={processed} />;
}
// Every render: 100ms computation

// With useMemo
function Component({ data }) {
  // Only runs when data changes
  const processed = useMemo(() => expensiveOperation(data), [data]);

  return <Display data={processed} />;
}
// First render: 100ms computation + small memory overhead
// Subsequent renders: ~0ms (cached)
```

---

### 3. Expensive Computation Caching

**What Makes a Computation "Expensive"?**

- **Processing large arrays/objects** (10,000+ items)
- **Complex calculations** (sorting, filtering, mapping large datasets)
- **Recursive operations**
- **Heavy string operations**
- **Mathematical computations**

**Example: Expensive Sorting**

```javascript
function ProductList({ products, sortBy, filterBy }) {
  // Expensive: Sorting 10,000 products on every render
  const sortedAndFiltered = useMemo(() => {
    console.log("Processing products...");

    // Filter
    let result = products.filter(
      (p) => filterBy === "all" || p.category === filterBy
    );

    // Sort
    result.sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [products, sortBy, filterBy]);

  return (
    <div>
      {sortedAndFiltered.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

**Example: Complex Calculations**

```javascript
function DataVisualization({ data }) {
  // Expensive: Computing statistics on large dataset
  const statistics = useMemo(() => {
    console.log("Computing statistics...");

    const sum = data.reduce((acc, val) => acc + val, 0);
    const mean = sum / data.length;

    const sortedData = [...data].sort((a, b) => a - b);
    const median = sortedData[Math.floor(data.length / 2)];

    const variance =
      data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);

    return { mean, median, stdDev, sum };
  }, [data]);

  return (
    <div>
      <p>Mean: {statistics.mean}</p>
      <p>Median: {statistics.median}</p>
      <p>Std Dev: {statistics.stdDev}</p>
    </div>
  );
}
```

---

### 4. Dependency Array Behavior

**How Dependencies Work:**

```javascript
const value = useMemo(() => {
  return computation(a, b);
}, [a, b]);

// On each render:
// 1. React checks if 'a' or 'b' changed (using Object.is)
// 2. If changed: run computation, cache result
// 3. If same: return cached result
```

**Dependency Comparison:**

```javascript
function Component() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("John");

  // Depends on count only
  const doubled = useMemo(() => {
    console.log("Computing doubled");
    return count * 2;
  }, [count]);
  // Only recalculates when count changes, NOT when name changes

  // Depends on both
  const message = useMemo(() => {
    console.log("Computing message");
    return `${name}: ${count}`;
  }, [count, name]);
  // Recalculates when either count OR name changes

  // No dependencies (never recalculates)
  const constant = useMemo(() => {
    console.log("Computing constant");
    return Math.random();
  }, []);
  // Only computed once on mount
}
```

**Common Pitfall: Object Dependencies**

```javascript
function Component({ config }) {
  // ❌ WRONG - config is new object every render
  const processed = useMemo(() => {
    return processConfig(config);
  }, [config]);
  // Recalculates every render because config is always "different"

  // ✅ CORRECT - Use primitive dependencies
  const processed = useMemo(() => {
    return processConfig(config);
  }, [config.id, config.type, config.value]);
  // Only recalculates when specific properties change
}
```

---

### 5. When to Use vs When to Skip

**✅ Use useMemo when:**

1. **Expensive calculations:**

```javascript
// Filtering/sorting large lists
const filtered = useMemo(
  () => items.filter((item) => item.matches(query)),
  [items, query]
);

// Complex computations
const result = useMemo(() => complexAlgorithm(data), [data]);
```

2. **Referential equality matters:**

```javascript
// Passed to React.memo component
const MemoChild = React.memo(ChildComponent);

function Parent() {
  const config = useMemo(
    () => ({
      theme: "dark",
      language: "en",
    }),
    []
  );

  return <MemoChild config={config} />;
  // Child won't re-render unnecessarily
}
```

3. **Used in dependency arrays:**

```javascript
function Component({ userId }) {
  const query = useMemo(
    () => ({
      userId,
      type: "active",
    }),
    [userId]
  );

  useEffect(() => {
    fetchData(query);
  }, [query]); // Won't re-run unless userId changes
}
```

**❌ DON'T use useMemo when:**

1. **Simple calculations:**

```javascript
// ❌ Overkill - addition is cheap
const sum = useMemo(() => a + b, [a, b]);

// ✅ Just calculate directly
const sum = a + b;
```

2. **Primitive values that don't cause re-renders:**

```javascript
// ❌ Unnecessary - primitives are already "memoized"
const doubled = useMemo(() => count * 2, [count]);

// ✅ Simple calculation is fine
const doubled = count * 2;
```

3. **Not used multiple times:**

```javascript
// ❌ Only used once, no benefit
const value = useMemo(() => compute(data), [data]);
return <div>{value}</div>;

// ✅ Just calculate inline
return <div>{compute(data)}</div>;
```

4. **Component renders infrequently:**

```javascript
// If component only renders once or rarely,
// memoization overhead > computation cost
```

---

### 6. Referential Equality for Objects/Arrays

**The Problem:**

```javascript
function Parent() {
  const [count, setCount] = useState(0);

  // ❌ New object every render
  const config = { theme: "dark" };

  return <MemoChild config={config} />;
  // Child re-renders even though config hasn't "really" changed
}

const MemoChild = React.memo(({ config }) => {
  console.log("Child rendered");
  return <div>{config.theme}</div>;
});
```

**The Solution:**

```javascript
function Parent() {
  const [count, setCount] = useState(0);

  // ✅ Same object reference across renders
  const config = useMemo(() => ({ theme: "dark" }), []);

  return <MemoChild config={config} />;
  // Child only renders when config actually changes
}
```

**Why This Matters:**

```javascript
// JavaScript reference comparison
const obj1 = { value: 1 };
const obj2 = { value: 1 };

obj1 === obj2; // false (different references!)

const obj3 = obj1;
obj1 === obj3; // true (same reference)

// React uses === for prop comparison
// useMemo keeps same reference if dependencies don't change
```

**Real-World Example:**

```javascript
function DataTable({ data, filters }) {
  // Heavy component that renders 1000s of rows
  const ExpensiveTable = React.memo(Table);

  // ❌ Without useMemo - new object every render
  const columns = [
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },
    { id: "age", label: "Age" },
  ];

  // ✅ With useMemo - stable reference
  const columns = useMemo(
    () => [
      { id: "name", label: "Name" },
      { id: "email", label: "Email" },
      { id: "age", label: "Age" },
    ],
    []
  );

  const filteredData = useMemo(
    () => data.filter((row) => matchesFilters(row, filters)),
    [data, filters]
  );

  return <ExpensiveTable data={filteredData} columns={columns} />;
}
```

---

### 7. Performance Optimization Patterns

**Pattern 1: Expensive List Operations**

```javascript
function UserList({ users, searchQuery, sortBy }) {
  const processedUsers = useMemo(() => {
    // Step 1: Filter by search
    let result = users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Step 2: Sort
    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "age") return a.age - b.age;
      if (sortBy === "joined")
        return new Date(a.joinedDate) - new Date(b.joinedDate);
      return 0;
    });

    return result;
  }, [users, searchQuery, sortBy]);

  return (
    <div>
      {processedUsers.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

**Pattern 2: Derived State**

```javascript
function ShoppingCart({ items }) {
  const summary = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const tax = subtotal * 0.1;
    const shipping = subtotal > 50 ? 0 : 10;
    const total = subtotal + tax + shipping;

    return { subtotal, tax, shipping, total };
  }, [items]);

  return (
    <div>
      <p>Subtotal: ${summary.subtotal}</p>
      <p>Tax: ${summary.tax}</p>
      <p>Shipping: ${summary.shipping}</p>
      <p>Total: ${summary.total}</p>
    </div>
  );
}
```

**Pattern 3: Preventing Child Re-renders**

```javascript
function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");

  // Without useMemo, child re-renders when count changes
  // even though data only depends on name
  const childData = useMemo(
    () => ({
      name,
      timestamp: Date.now(),
      id: Math.random(),
    }),
    [name]
  ); // Only recreate when name changes

  const ExpensiveChild = React.memo(({ data }) => {
    console.log("Child rendered");
    // Expensive rendering logic
    return <div>{data.name}</div>;
  });

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>
        Increment Count: {count}
      </button>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <ExpensiveChild data={childData} />
    </div>
  );
}
```

**Pattern 4: Computed Properties from Context**

```javascript
function DataProvider({ children }) {
  const [rawData, setRawData] = useState([]);

  // Expensive transformations
  const processedData = useMemo(
    () => ({
      items: rawData,
      totalCount: rawData.length,
      activeCount: rawData.filter((item) => item.active).length,
      categories: [...new Set(rawData.map((item) => item.category))],
      averagePrice:
        rawData.reduce((sum, item) => sum + item.price, 0) / rawData.length,
    }),
    [rawData]
  );

  return (
    <DataContext.Provider value={processedData}>
      {children}
    </DataContext.Provider>
  );
}
```

**Pattern 5: Avoiding Cascading Re-renders**

```javascript
function Dashboard({ data }) {
  // Multiple expensive computations
  const chartData = useMemo(() => prepareChartData(data), [data]);

  const statistics = useMemo(() => calculateStatistics(data), [data]);

  const recommendations = useMemo(() => generateRecommendations(data), [data]);

  // Each computation only runs when data changes
  // Not when dashboard re-renders for other reasons

  return (
    <div>
      <Chart data={chartData} />
      <Stats data={statistics} />
      <Recommendations data={recommendations} />
    </div>
  );
}
```

---

## 🎤 Top Interview Questions & Model Answers

### Q1: What is useMemo and when should you use it?

**Answer:**

> "useMemo is a React hook that memoizes the result of a computation. It takes a function and a dependency array, runs the function only when dependencies change, and returns the cached result on subsequent renders. I use useMemo in three main scenarios: First, for expensive calculations that would be wasteful to repeat on every render - like filtering or sorting large arrays, complex mathematical operations, or processing large datasets. Second, to maintain referential equality for objects or arrays passed to memoized child components or used in dependency arrays. Without useMemo, a new object is created on every render, causing unnecessary re-renders. Third, for derived state that depends on props or state but is expensive to compute. However, I'm careful not to overuse it - useMemo has its own overhead, so I only use it when I've identified an actual performance issue or when I need stable references. For simple calculations or primitives, the memoization overhead outweighs the benefits."

---

### Q2: What's the difference between useMemo and useCallback?

**Answer:**

> "Both hooks are for memoization, but they memoize different things. useMemo memoizes the return value of a function - it runs the function and caches the result. useCallback memoizes the function itself - it returns the same function reference across renders. You can think of it this way: `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`. I use useMemo when I have an expensive calculation and want to cache the computed value. I use useCallback when I need a stable function reference, typically for passing to memoized child components or using in dependency arrays. A simple rule: useCallback for functions, useMemo for values. That said, they're solving the same underlying problem of preventing unnecessary work and re-renders through memoization."

**Code Comparison:**

```javascript
// useMemo - memoizes VALUE
const sortedList = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);

// useCallback - memoizes FUNCTION
const handleClick = useCallback(() => {
  console.log("clicked");
}, []);

// They're related:
const handleClick = useMemo(() => {
  return () => console.log("clicked");
}, []);
```

---

### Q3: Does useMemo improve performance in all cases?

**Answer:**

> "Absolutely not - useMemo has overhead and can actually hurt performance if misused. Every time React renders, it needs to check dependencies and manage the memoization cache, which takes time and memory. For cheap calculations like addition or accessing properties, the overhead of useMemo exceeds the cost of just recalculating. I only use useMemo when the computation is actually expensive - processing large arrays, complex algorithms, or when I've profiled and identified a bottleneck. Another key use case is maintaining referential equality to prevent re-renders of memoized children, but even then, the child component needs to be expensive enough to justify the optimization. My rule is to write clean code first, measure performance with React DevTools Profiler, and only add useMemo when there's evidence it helps. Premature optimization with useMemo everywhere makes code harder to read and can actually slow things down."

---

### Q4: How do dependencies work in useMemo?

**Answer:**

> "Dependencies in useMemo work the same way as useEffect - React compares them using Object.is on every render. If any dependency changed, useMemo runs the computation again and caches the new result. If all dependencies are the same, it returns the cached value. The key gotcha is that Object.is uses reference comparison for objects and arrays, not deep equality. This means if you pass an object as a dependency and that object is recreated on every render (even with the same contents), useMemo will recalculate every time, defeating the purpose. That's why I either use primitive values in dependencies, or use useMemo to stabilize object dependencies first. The ESLint exhaustive-deps rule helps catch missing dependencies, but you need to understand the reference comparison behavior to use it effectively."

---

### Q5: Can you explain referential equality and why it matters for useMemo?

**Answer:**

> "Referential equality is about whether two values point to the same location in memory, not whether their contents are the same. In JavaScript, `{a: 1} === {a: 1}` is false because they're different objects, even though they have identical contents. This matters for useMemo in two ways: First, when you pass objects or arrays to memoized components or use them in dependency arrays, you need stable references to prevent unnecessary work. Without useMemo, a new object is created on every render, failing the === check and causing re-renders. Second, when objects are dependencies of useMemo itself, you need to be careful - if the object is recreated every render, useMemo won't help. The solution is to either use primitive dependencies when possible, or use useMemo to stabilize object dependencies first. This is one of the trickier aspects of React optimization, and understanding reference vs value equality is crucial."

---

### Q6: When would you use useMemo to prevent child component re-renders?

**Answer:**

> "I use useMemo to prevent child re-renders when three conditions are met: First, the child component is wrapped in React.memo, otherwise memoizing props won't help. Second, the child is expensive to render - if it's cheap, the optimization isn't worth it. Third, I'm passing objects or arrays as props that would otherwise be recreated on every render. The pattern is: wrap the child in React.memo, use useMemo for object/array props that don't actually change, and this prevents the child from re-rendering when the parent re-renders for other reasons. For example, if I have a large data table component that only needs to update when the data changes, I'd memoize the table component with React.memo and use useMemo to maintain stable references for the columns configuration and filtered data. This optimization really shines when you have expensive children that re-render frequently for no reason."

---

### Q7: What's the overhead of useMemo and when does it outweigh the benefits?

**Answer:**

> "useMemo has both computational and memory overhead. On every render, React needs to compare dependencies, manage the cache, and decide whether to return cached or recompute. This takes time and memory. For simple operations like addition, string concatenation, or accessing object properties, this overhead is greater than just doing the operation again. The break-even point depends on the operation, but as a rule of thumb, if a calculation takes less than a millisecond and happens in a component that doesn't render frequently, useMemo probably isn't worth it. The benefits outweigh the overhead when: the calculation is expensive (processing large arrays, complex algorithms), the component renders frequently, or you need referential equality for performance reasons. I measure with React DevTools Profiler before and after adding useMemo to confirm it actually helps. The key is being selective - adding useMemo everywhere makes code harder to read and can hurt performance."

---

## 🚨 Common Mistakes to Avoid

### 1. Using useMemo for Everything (Premature Optimization)

```javascript
// ❌ OVERKILL - These are cheap operations
const sum = useMemo(() => a + b, [a, b]);
const doubled = useMemo(() => count * 2, [count]);
const upperName = useMemo(() => name.toUpperCase(), [name]);

// ✅ BETTER - Just calculate directly
const sum = a + b;
const doubled = count * 2;
const upperName = name.toUpperCase();
```

### 2. Object/Array in Dependencies

```javascript
// ❌ WRONG - Config is new object every render
function Component({ config }) {
  const result = useMemo(() => {
    return process(config);
  }, [config]); // Recalculates every render!

  return <div>{result}</div>;
}

// ✅ CORRECT - Use primitive dependencies
function Component({ config }) {
  const result = useMemo(() => {
    return process(config);
  }, [config.id, config.type]); // Only when these change

  return <div>{result}</div>;
}

// ✅ OR - Parent memoizes config
function Parent() {
  const config = useMemo(
    () => ({
      id: 1,
      type: "user",
    }),
    []
  );

  return <Component config={config} />;
}
```

### 3. Missing Dependencies

```javascript
// ❌ WRONG - Missing 'multiplier' dependency
function Component({ count, multiplier }) {
  const result = useMemo(() => {
    return count * multiplier;
  }, [count]); // Stale closure! Uses old multiplier

  return <div>{result}</div>;
}

// ✅ CORRECT - Include all dependencies
function Component({ count, multiplier }) {
  const result = useMemo(() => {
    return count * multiplier;
  }, [count, multiplier]);

  return <div>{result}</div>;
}
```

### 4. Memoizing Non-Expensive Calculations

```javascript
// ❌ WRONG - Overhead > benefit
function Component({ items }) {
  const count = useMemo(() => items.length, [items]);

  const isEmpty = useMemo(() => count === 0, [count]);

  const message = useMemo(
    () => (isEmpty ? "No items" : `${count} items`),
    [isEmpty, count]
  );

  return <div>{message}</div>;
}

// ✅ CORRECT - These are cheap, just calculate
function Component({ items }) {
  const count = items.length;
  const isEmpty = count === 0;
  const message = isEmpty ? "No items" : `${count} items`;

  return <div>{message}</div>;
}
```

### 5. Forgetting to Memoize Child Component Too

```javascript
// ❌ INCOMPLETE - useMemo alone doesn't help
function Parent() {
  const data = useMemo(() => ({ value: 123 }), []);

  return <Child data={data} />;
  // Child still re-renders when Parent re-renders!
}

function Child({ data }) {
  return <div>{data.value}</div>;
}

// ✅ CORRECT - Both useMemo AND React.memo
function Parent() {
  const data = useMemo(() => ({ value: 123 }), []);

  return <MemoChild data={data} />;
}

const MemoChild = React.memo(({ data }) => {
  return <div>{data.value}</div>;
});
```

### 6. Memoizing Inside Loops

```javascript
// ❌ WRONG - useMemo inside loop/map
function List({ items }) {
  return items.map((item) => {
    const processed = useMemo(() => processItem(item), [item]); // Breaks rules of hooks!

    return <div key={item.id}>{processed}</div>;
  });
}

// ✅ CORRECT - Memoize outside, or extract component
function List({ items }) {
  const processedItems = useMemo(
    () => items.map((item) => processItem(item)),
    [items]
  );

  return processedItems.map((processed) => (
    <div key={processed.id}>{processed}</div>
  ));
}

// ✅ OR - Extract to component
function ListItem({ item }) {
  const processed = useMemo(() => processItem(item), [item]);

  return <div>{processed}</div>;
}
```

---

## 🔑 Interview Checklist

### ✅ Must Know (Will definitely be asked)

- ✅ What useMemo does (memoizes computed values)
- ✅ When to use useMemo vs when to skip
- ✅ Difference between useMemo and useCallback
- ✅ How dependencies work (Object.is comparison)
- ✅ Referential equality concept
- ✅ Performance trade-offs

### ✅ Should Know (Often asked)

- ✅ Real-world use cases (list operations, derived state)
- ✅ Overhead vs benefits analysis
- ✅ Preventing child re-renders
- ✅ Object dependencies pitfall
- ✅ When memoization hurts performance

### ✅ Nice to Know (Senior level)

- [ ] Measuring useMemo impact
- [ ] Complex optimization patterns
- [ ] useMemo with Context
- [ ] Memory implications
- [ ] Alternative optimization strategies

---

## 💡 Pro Tips for Interviews

1. **Show restraint**: Emphasize you don't use useMemo everywhere
2. **Mention profiling**: Talk about measuring before optimizing
3. **Real examples**: Have stories of actual performance improvements
4. **Know the overhead**: Explain the cost of memoization
5. **Understand trade-offs**: Memory vs computation

---

## 📚 Quick Reference

```javascript
// Basic syntax
const memoizedValue = useMemo(() => computeValue(a, b), [a, b]);

// Expensive calculation
const sorted = useMemo(
  () => items.sort((a, b) => a.name.localeCompare(b.name)),
  [items]
);

// Referential equality
const config = useMemo(() => ({ theme: "dark" }), []);

// Derived state
const total = useMemo(
  () => items.reduce((sum, item) => sum + item.price, 0),
  [items]
);

// With dependency
const filtered = useMemo(
  () => items.filter((item) => item.category === category),
  [items, category]
);

// Constant (computed once)
const constant = useMemo(() => generateId(), []);

// Relationship to useCallback
useMemo(() => fn, deps) === useCallback(fn, deps);
```

---

## 🎯 The Golden Rules

1. **"Don't optimize prematurely"** - Add useMemo only when needed
2. **"Measure first"** - Profile before and after optimization
3. **"For expensive calculations"** - Not for simple operations
4. **"Beware object dependencies"** - Use primitives when possible
5. **"Memory vs computation"** - Understand the trade-off

---

## 🔗 Common Patterns

### Pattern 1: Filtered/Sorted Lists

```javascript
const processed = useMemo(
  () => items.filter(fn).sort(fn).map(fn),
  [items, deps]
);
```

### Pattern 2: Derived State

```javascript
const summary = useMemo(() => ({
  total: items.reduce(...),
  average: total / items.length,
  max: Math.max(...items)
}), [items]);
```

### Pattern 3: Stable References

```javascript
const config = useMemo(
  () => ({
    option1: value1,
    option2: value2,
  }),
  [value1, value2]
);
```

### Pattern 4: Computed Properties

```javascript
const displayData = useMemo(
  () => rawData.map(transform).filter(validate),
  [rawData]
);
```

---

**Remember:** useMemo is an optimization tool, not a requirement. Start without it, measure performance, and add it only where it makes a measurable difference. The best code is readable code that's fast enough - not code that's over-optimized and hard to understand!
