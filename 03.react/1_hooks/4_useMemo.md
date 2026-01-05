# useMemo - Complete Interview Guide

## 🎯 Key Concepts

### 1. Value Memoization Concept

**What it means:**

- `useMemo` returns a **memoized value** (the result of a computation)
- The computation only re-runs when dependencies change
- It caches the result between renders

**The Problem useMemo Solves:**

```javascript
// WITHOUT useMemo - recalculates every render
function Component({ items }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  // This runs on EVERY render, even if items didn't change!

  return <div>Total: {total}</div>;
}

// WITH useMemo - only recalculates when items change
function Component({ items }) {
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price, 0),
    [items]
  );
  // Only recalculates when 'items' reference changes

  return <div>Total: {total}</div>;
}
```

**Key Understanding:**

- Expensive calculations run on every render by default
- useMemo caches the result
- React returns cached value if dependencies haven't changed
- Only recalculates when dependencies change

---

### 2. Expensive Computation Caching

**When a computation is "expensive":**

- Complex calculations (sorting, filtering large arrays)
- Data transformations
- Heavy mathematical operations
- Recursive algorithms
- Creating derived data structures

**Example: Expensive Computation**

```javascript
function ProductList({ products, filter }) {
  // ❌ WITHOUT useMemo - runs every render
  const filteredAndSorted = products
    .filter((p) => p.category === filter)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);
  // If products has 10,000 items, this is slow!

  return <List items={filteredAndSorted} />;
}

// ✅ WITH useMemo - only runs when products or filter changes
function ProductList({ products, filter }) {
  const filteredAndSorted = useMemo(() => {
    console.log("Computing...");
    return products
      .filter((p) => p.category === filter)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
  }, [products, filter]);

  return <List items={filteredAndSorted} />;
}
```

**Rule of Thumb:**

- If it takes >1ms to compute → consider useMemo
- If it runs on every render and is slow → useMemo
- If you notice lag during interactions → profile first, then useMemo

---

### 3. Dependency Array Behavior

**Same as useCallback and useEffect:**

- React compares dependencies with `Object.is()` (shallow comparison)
- When any dependency changes, the computation re-runs
- If dependencies stay the same, cached value is returned

```javascript
function Component({ data, threshold }) {
  const result = useMemo(() => {
    console.log("Computing...");
    return data.filter((item) => item.value > threshold);
  }, [data, threshold]);

  // Computation behavior:
  // - First render: Runs computation, returns result
  // - Re-render with same data & threshold: Returns cached result
  // - Re-render with new data: Runs computation, returns new result
  // - Re-render with new threshold: Runs computation, returns new result
}
```

**Dependency Rules:**

```javascript
// ❌ WRONG - missing dependencies
const result = useMemo(() => {
  return data.filter((item) => item.value > threshold);
}, [data]); // Missing threshold!

// ✅ CORRECT - all dependencies included
const result = useMemo(() => {
  return data.filter((item) => item.value > threshold);
}, [data, threshold]);

// ❌ WRONG - object dependency (new reference every render)
const config = { threshold: 100 };
const result = useMemo(() => {
  return data.filter((item) => item.value > config.threshold);
}, [data, config]); // config is new object every time!

// ✅ CORRECT - primitive dependency
const result = useMemo(() => {
  return data.filter((item) => item.value > config.threshold);
}, [data, config.threshold]); // Use primitive value
```

---

### 4. Referential Equality for Objects/Arrays

**The Referential Equality Problem:**

```javascript
function Component() {
  // ❌ PROBLEM: New object every render
  const user = { id: 1, name: "John" };

  return <ExpensiveChild user={user} />;
  // Child re-renders because user is always a new reference!
}

// ✅ SOLUTION: useMemo for stable reference
function Component() {
  const user = useMemo(() => ({ id: 1, name: "John" }), []);

  return <ExpensiveChild user={user} />;
  // Child gets same reference, won't re-render unnecessarily!
}
```

**Common Use Case:**

```javascript
function DataTable({ rawData, sortBy, filterBy }) {
  // Without useMemo, this creates new array every render
  // Even if rawData didn't change, Child re-renders
  const processedData = useMemo(() => {
    return rawData
      .filter((item) => item.status === filterBy)
      .sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));
  }, [rawData, sortBy, filterBy]);

  return <ExpensiveTable data={processedData} />;
  // Table only re-renders when processedData actually changes!
}
```

**Why This Matters:**

- Objects/arrays are compared by reference, not content
- `{a: 1} !== {a: 1}` (different references)
- `[1, 2] !== [1, 2]` (different references)
- useMemo provides stable reference until dependencies change

---

### 5. When to Use vs When to Skip

**✅ Use useMemo when:**

#### Scenario 1: Expensive Calculations

```javascript
function Component({ data }) {
  // Heavy computation
  const result = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
      sum += data[i % data.length];
    }
    return sum;
  }, [data]);
}
```

#### Scenario 2: Preventing Child Re-renders

```javascript
const MemoizedChild = memo(Child);

function Parent() {
  // Stable object reference for memoized child
  const config = useMemo(() => ({ theme: "dark", size: "large" }), []);

  return <MemoizedChild config={config} />;
  // Child won't re-render if only Parent re-renders
}
```

#### Scenario 3: Dependency in Other Hooks

```javascript
function Component({ filters }) {
  // Stable array for useEffect dependency
  const filterArray = useMemo(() => Object.values(filters), [filters]);

  useEffect(() => {
    fetchData(filterArray);
  }, [filterArray]); // Won't re-run unnecessarily
}
```

#### Scenario 4: Large List Transformations

```javascript
function SearchResults({ items, searchTerm }) {
  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);
  // Only filters when items or searchTerm changes
}
```

**❌ Don't use useMemo when:**

#### Scenario 1: Simple Calculations

```javascript
// ❌ OVERKILL - addition is cheap
const sum = useMemo(() => a + b, [a, b]);

// ✅ BETTER - just calculate directly
const sum = a + b;
```

#### Scenario 2: Creating Simple Objects/Primitives Not Passed Down

```javascript
// ❌ UNNECESSARY - not passed to children
const config = useMemo(() => ({ size: "large" }), []);

return <div>{config.size}</div>;

// ✅ BETTER - just create it
const config = { size: "large" };
```

#### Scenario 3: Already Fast Operations

```javascript
// ❌ PREMATURE OPTIMIZATION
const doubled = useMemo(() => numbers.map((n) => n * 2), [numbers]);

// Only use if numbers is large and this causes performance issues
```

---

### 6. Performance Trade-offs

**useMemo Has Overhead:**

```javascript
// Cost of useMemo:
// 1. Memory to store cached value
// 2. Dependency comparison on every render
// 3. Function call overhead

// WITHOUT useMemo
const result = expensiveCalculation(data);
// Cost: Calculation time

// WITH useMemo
const result = useMemo(() => expensiveCalculation(data), [data]);
// Cost: Calculation time + memoization overhead
```

**When Overhead is Worth It:**

```
Calculation cost > Memoization overhead
```

**Example:**

- **Cheap operation** (< 1ms): useMemo overhead > benefit ❌
- **Expensive operation** (> 5ms): useMemo overhead < benefit ✅
- **Referential equality needed**: useMemo worth it for memoized children ✅

**Measure First:**

```javascript
// Profile without useMemo
console.time("calculation");
const result = expensiveFunction(data);
console.timeEnd("calculation");
// If this shows >1-2ms and happens frequently, use useMemo
```

---

### 7. useMemo vs useCallback

**They're Related:**

```javascript
// These are equivalent:
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const memoizedFunction = useCallback(() => doSomething(a, b), [a, b]);

// useCallback is literally:
useCallback(fn, deps) === useMemo(() => fn, deps);
```

**Key Differences:**

| Aspect      | useMemo                                       | useCallback                             |
| ----------- | --------------------------------------------- | --------------------------------------- |
| Returns     | **Computed value**                            | **Function itself**                     |
| Use for     | Expensive calculations, stable objects/arrays | Event handlers, callbacks               |
| Example     | `useMemo(() => data.filter(...), [data])`     | `useCallback(() => handleClick(), [])`  |
| Common with | Derived data, transformations                 | Props to memoized children, effect deps |

**Mental Model:**

- **useMemo**: "Remember this expensive calculation result"
- **useCallback**: "Remember this function itself"

**Practical Example:**

```javascript
function Component({ items }) {
  // useMemo - memoize the VALUE (filtered array)
  const filteredItems = useMemo(
    () => items.filter((item) => item.active),
    [items]
  );

  // useCallback - memoize the FUNCTION
  const handleClick = useCallback((id) => console.log(id), []);

  return (
    <List
      items={filteredItems} // Memoized value
      onClick={handleClick} // Memoized function
    />
  );
}
```

---

## 🎤 Top Interview Questions & Model Answers

### Q1: What is useMemo and when should you use it?

**Answer:**

> "useMemo is a React hook that memoizes the result of a computation. It takes a function and a dependency array, runs the function on the first render, caches the result, and returns that cached result on subsequent renders unless the dependencies change. You should use it in three main scenarios: First, for expensive calculations that run on every render - things like sorting or filtering large datasets, complex mathematical operations, or recursive algorithms. Second, when you need referential equality for objects or arrays that are passed to memoized child components, to prevent unnecessary re-renders. Third, when computed values are used as dependencies in other hooks like useEffect. However, it's important to measure performance first because useMemo has its own overhead - don't use it for simple operations or premature optimization."

---

### Q2: What's the difference between useMemo and useCallback?

**Answer:**

> "Both are memoization hooks, but they memoize different things. useMemo memoizes a computed value - the result of running a function. useCallback memoizes the function itself. In fact, useCallback is just syntactic sugar - `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`. Use useMemo when you have an expensive calculation and want to cache the result, like filtering or sorting a large array. Use useCallback when you need a stable function reference, typically for passing to memoized child components as props or using as dependencies in other hooks. A simple rule: useMemo for values, useCallback for functions."

**Code Example:**

```javascript
// useMemo - returns the RESULT
const sortedList = useMemo(() => items.sort(), [items]);

// useCallback - returns the FUNCTION
const handleSort = useCallback(() => items.sort(), [items]);

// Equivalent to:
const handleSort = useMemo(() => () => items.sort(), [items]);
```

---

### Q3: Does useMemo prevent the calculation from running completely?

**Answer:**

> "No, useMemo doesn't prevent the calculation from running - it runs on the first render and whenever dependencies change. What it does is cache the result and skip recalculation when dependencies haven't changed. This is an important distinction: if you call `useMemo(() => expensiveFunc(), [dep])`, expensiveFunc still runs every time dep changes. useMemo is not about eliminating work entirely, it's about avoiding redundant work when inputs haven't changed. Also, React reserves the right to 'forget' memoized values in certain situations to free up memory, so you can't rely on it never recalculating."

---

### Q4: How do dependencies work in useMemo?

**Answer:**

> "Dependencies work the same way as in useEffect and useCallback - React uses shallow comparison with Object.is to check if any dependency changed. If all dependencies are the same, React returns the cached value without re-running the computation. If any dependency changed, it re-runs the computation and caches the new result. You must include all values from the component scope that the computation uses, otherwise you'll get stale data. A common pitfall is using objects or arrays as dependencies - since they have new references on every render, the memoization becomes ineffective. The solution is to use primitive values from those objects as dependencies, or memoize the objects themselves."

---

### Q5: When should you NOT use useMemo?

**Answer:**

> "You shouldn't use useMemo in several situations: First, for simple calculations like basic arithmetic or string operations - the overhead of memoization is greater than just doing the calculation. Second, when you haven't measured a performance problem - premature optimization makes code harder to read without proven benefit. Third, when the computation is already fast - if it takes less than 1 millisecond, memoization probably isn't worth it. Fourth, when creating simple objects or arrays that aren't passed to memoized children - there's no benefit to memoizing them. As a rule, I prefer to write simple code first, profile for performance issues, and only add useMemo when there's evidence it will help. The React team has stated they may make useMemo unnecessary in the future through compiler optimizations."

---

### Q6: How does useMemo help with referential equality?

**Answer:**

> "In JavaScript, objects and arrays are compared by reference, not by value. So even if two objects have the same content, they're not equal if they're different objects in memory. This causes problems with React.memo - if you pass a new object or array to a memoized child component on every render, the child will re-render even though the content might be the same. useMemo solves this by providing a stable reference: it returns the same object or array reference until dependencies change. For example, if you're passing a config object to a memoized child, wrapping it in useMemo ensures the child only re-renders when the config actually changes, not on every parent render. This is one of the most practical uses of useMemo."

---

### Q7: Can you give a real-world example of when useMemo improved performance?

**Answer:**

> "Sure, I had a component rendering a data table with about 5,000 rows. Users could sort, filter, and paginate through the data. Every time anything changed in the parent component - even unrelated state like a loading spinner - the entire dataset was being filtered and sorted again, causing visible lag. I profiled with React DevTools and saw the component was taking 50-80ms to render. I added useMemo around the filtering and sorting logic with the relevant dependencies - the raw data, sort field, and filter values. After that, the expensive calculation only ran when those specific values changed, and other re-renders used the cached result. Render time dropped to under 5ms for cache hits. The key was measuring first to confirm it was worth optimizing, then targeting the specific expensive operation."

---

## 🚨 Common Mistakes to Avoid

### 1. Using useMemo for Everything (Premature Optimization)

```javascript
// ❌ OVERKILL - unnecessary memoization
function Component({ a, b }) {
  const sum = useMemo(() => a + b, [a, b]);
  const product = useMemo(() => a * b, [a, b]);
  const greeting = useMemo(() => `Hello ${name}`, [name]);

  // Memoization overhead > benefit for simple operations
}

// ✅ BETTER - just calculate
function Component({ a, b, name }) {
  const sum = a + b;
  const product = a * b;
  const greeting = `Hello ${name}`;
}
```

### 2. Missing Dependencies (Stale Data)

```javascript
// ❌ WRONG - missing dependency
function Component({ items, threshold }) {
  const filtered = useMemo(() => {
    return items.filter((item) => item.value > threshold);
  }, [items]); // Missing threshold!

  // Will use old threshold value, not current one
}

// ✅ CORRECT - include all dependencies
function Component({ items, threshold }) {
  const filtered = useMemo(() => {
    return items.filter((item) => item.value > threshold);
  }, [items, threshold]);
}
```

### 3. Object/Array Dependencies

```javascript
// ❌ PROBLEM - object dependency
function Component({ filters }) {
  const data = useMemo(() => {
    return fetchData(filters);
  }, [filters]); // filters is object, new reference every render!

  // Computation runs every render, memoization is useless
}

// ✅ SOLUTION 1 - destructure primitives
function Component({ filters }) {
  const data = useMemo(() => {
    return fetchData({ status: filters.status, date: filters.date });
  }, [filters.status, filters.date]);
}

// ✅ SOLUTION 2 - memoize the filters object first
function Parent() {
  const filters = useMemo(() => ({ status: "active", date: today }), [today]);
  return <Component filters={filters} />;
}
```

### 4. Not Measuring Performance First

```javascript
// ❌ BAD PRACTICE - optimizing without evidence
function Component({ items }) {
  const processed = useMemo(() => items.map((i) => i * 2), [items]);
  // Is this even slow? Did you measure?
}

// ✅ BETTER - measure first
function Component({ items }) {
  // console.time('processing');
  const processed = items.map((i) => i * 2);
  // console.timeEnd('processing');
  // Only add useMemo if this shows >1-2ms
}
```

### 5. Memoizing Component Props That Aren't Used in Memoized Children

```javascript
// ❌ POINTLESS - child not memoized
function Parent() {
  const config = useMemo(() => ({ theme: "dark" }), []);

  return <Child config={config} />;
  // Child will re-render when Parent re-renders anyway!
}

// ✅ CORRECT - memoize child too
const MemoizedChild = memo(Child);

function Parent() {
  const config = useMemo(() => ({ theme: "dark" }), []);

  return <MemoizedChild config={config} />;
  // Now optimization works!
}
```

---

## 🔑 Interview Checklist - What Interviewers Look For

### ✅ Must Know (Will definitely be asked)

- [ ] What useMemo does (memoizes computed values)
- [ ] When to use it (expensive calculations, referential equality)
- [ ] When NOT to use it (premature optimization, simple operations)
- [ ] Difference from useCallback
- [ ] How dependencies work

### ✅ Should Know (Often asked)

- [ ] Performance trade-offs
- [ ] Referential equality concept
- [ ] How to measure if it's helping
- [ ] Common pitfalls (missing deps, object deps)
- [ ] Relationship with React.memo

### ✅ Nice to Know (Senior level)

- [ ] When overhead outweighs benefits
- [ ] How React might optimize this in the future
- [ ] Alternative patterns
- [ ] Profiling techniques

---

## 💡 Pro Tips for Interviews

1. **Measure First**: Always emphasize profiling before optimizing
2. **Know the Trade-offs**: Show you understand useMemo has costs
3. **Real Examples**: Have a story about when you used it effectively
4. **Don't Oversell**: Show you know it's not always the answer
5. **Understand "Why"**: Explain referential equality clearly

---

## 📚 Quick Reference

```javascript
// Basic syntax
const memoizedValue = useMemo(
  () => computeExpensiveValue(a, b),
  [a, b] // dependencies
);

// Common patterns

// 1. Expensive calculation
const total = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price, 0);
}, [items]);

// 2. Filtering/sorting large lists
const filtered = useMemo(() => {
  return items
    .filter((item) => item.active)
    .sort((a, b) => a.name.localeCompare(b.name));
}, [items]);

// 3. Stable object reference for memoized child
const config = useMemo(
  () => ({
    theme: "dark",
    size: "large",
  }),
  []
);

// 4. Derived data structure
const itemsById = useMemo(() => {
  return items.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
}, [items]);

// 5. For useEffect dependency
const searchParams = useMemo(
  () => ({
    query: searchTerm,
    filters: activeFilters,
  }),
  [searchTerm, activeFilters]
);

useEffect(() => {
  search(searchParams);
}, [searchParams]);
```

---

## 🎯 The Golden Rule

**"Only use useMemo when you have evidence it will help"**

Ask yourself:

1. Is this computation actually expensive? (>1-2ms) → Maybe useMemo
2. Have I profiled and seen a problem? → useMemo
3. Am I passing this to a React.memo component? → useMemo
4. Is this used in a dependency array? → Maybe useMemo
5. None of the above? → Don't use useMemo

**Remember:** useMemo is an optimization, not a requirement. Write clear code first, optimize when needed!
