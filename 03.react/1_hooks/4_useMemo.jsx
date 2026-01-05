import React, { useState, useMemo, memo, useCallback } from "react";

// ==========================================
// 1. EXPENSIVE CALCULATION DEMO
// ==========================================
const ExpensiveCalculation = () => {
  const [count, setCount] = useState(0);
  const [items] = useState(Array.from({ length: 10000 }, (_, i) => i));
  const [calcCount, setCalcCount] = useState({ without: 0, with: 0 });

  // ❌ WITHOUT useMemo - runs every render
  const withoutMemo = () => {
    setCalcCount((prev) => ({ ...prev, without: prev.without + 1 }));
    let sum = 0;
    for (let i = 0; i < items.length; i++) {
      sum += items[i];
      // Simulate expensive work
      for (let j = 0; j < 100; j++) {
        Math.sqrt(sum);
      }
    }
    return sum;
  };

  const sumWithout = withoutMemo();

  // ✅ WITH useMemo - only runs when items change
  const sumWith = useMemo(() => {
    setCalcCount((prev) => ({ ...prev, with: prev.with + 1 }));
    let sum = 0;
    for (let i = 0; i < items.length; i++) {
      sum += items[i];
      for (let j = 0; j < 100; j++) {
        Math.sqrt(sum);
      }
    }
    return sum;
  }, [items]);

  return (
    <div className="p-4 border rounded mb-4 bg-blue-50">
      <h3 className="font-bold text-lg mb-2">1. Expensive Calculation</h3>
      <button
        onClick={() => setCount((c) => c + 1)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-2"
      >
        Re-render (Count: {count})
      </button>

      <div className="bg-white p-3 rounded border text-sm space-y-2">
        <div>
          <p>❌ Without useMemo:</p>
          <p className="font-mono">Sum: {sumWithout.toLocaleString()}</p>
          <p className="text-red-600">Calculated {calcCount.without} times</p>
        </div>
        <div>
          <p>✅ With useMemo:</p>
          <p className="font-mono">Sum: {sumWith.toLocaleString()}</p>
          <p className="text-green-600">
            Calculated {calcCount.with} time(s) only!
          </p>
        </div>
      </div>

      <p className="text-xs mt-2 text-gray-600">
        💡 Click re-render - without useMemo recalculates every time!
      </p>
    </div>
  );
};

// ==========================================
// 2. REFERENTIAL EQUALITY DEMO
// ==========================================
const MemoizedChild = memo(({ config }) => {
  const renderCount = React.useRef(0);
  renderCount.current++;

  return (
    <div className="p-2 bg-green-100 rounded text-sm">
      <p>Child Component</p>
      <p className="text-xs">Renders: {renderCount.current}</p>
      <p className="text-xs font-mono">Config: {JSON.stringify(config)}</p>
    </div>
  );
});

const ReferentialEquality = () => {
  const [parentCount, setParentCount] = useState(0);

  // ❌ WITHOUT useMemo - new object every render
  const configWithout = { theme: "dark", size: "large" };

  // ✅ WITH useMemo - stable reference
  const configWith = useMemo(() => ({ theme: "dark", size: "large" }), []);

  return (
    <div className="p-4 border rounded mb-4 bg-green-50">
      <h3 className="font-bold text-lg mb-2">2. Referential Equality</h3>
      <button
        onClick={() => setParentCount((c) => c + 1)}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mb-3"
      >
        Re-render Parent (Count: {parentCount})
      </button>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-semibold mb-2">❌ Without useMemo:</p>
          <MemoizedChild config={configWithout} />
          <p className="text-xs mt-1 text-red-600">
            Re-renders on every parent render (new object reference)
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold mb-2">✅ With useMemo:</p>
          <MemoizedChild config={configWith} />
          <p className="text-xs mt-1 text-green-600">
            Only renders once (stable reference)!
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. FILTERING & SORTING LARGE LIST
// ==========================================
const FilterSortDemo = () => {
  const [filter, setFilter] = useState("all");
  const [count, setCount] = useState(0);
  const [items] = useState(
    Array.from({ length: 5000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      category: ["electronics", "books", "clothing"][i % 3],
      price: Math.random() * 100,
    }))
  );

  // Track computation count
  const [computeCount, setComputeCount] = useState({ without: 0, with: 0 });

  // ❌ WITHOUT useMemo - filters/sorts every render
  const withoutMemo = () => {
    setComputeCount((prev) => ({ ...prev, without: prev.without + 1 }));
    return items
      .filter((item) => filter === "all" || item.category === filter)
      .sort((a, b) => b.price - a.price)
      .slice(0, 100);
  };

  const filteredWithout = withoutMemo();

  // ✅ WITH useMemo - only when filter changes
  const filteredWith = useMemo(() => {
    setComputeCount((prev) => ({ ...prev, with: prev.with + 1 }));
    return items
      .filter((item) => filter === "all" || item.category === filter)
      .sort((a, b) => b.price - a.price)
      .slice(0, 100);
  }, [items, filter]);

  return (
    <div className="p-4 border rounded mb-4 bg-purple-50">
      <h3 className="font-bold text-lg mb-2">
        3. Filtering & Sorting Large Lists
      </h3>

      <div className="flex gap-2 mb-3">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-2 py-1 border rounded text-sm"
        >
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="books">Books</option>
          <option value="clothing">Clothing</option>
        </select>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
        >
          Re-render: {count}
        </button>
      </div>

      <div className="bg-white p-3 rounded border text-sm">
        <p>Total items: 5,000</p>
        <p className="mb-2">Showing top 100 by price</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-red-600">❌ Without useMemo:</p>
            <p>Computed {computeCount.without} times</p>
            <p className="text-xs">Runs on every render!</p>
          </div>
          <div>
            <p className="font-semibold text-green-600">✅ With useMemo:</p>
            <p>Computed {computeCount.with} times</p>
            <p className="text-xs">Only when filter changes!</p>
          </div>
        </div>
      </div>

      <p className="text-xs mt-2 text-gray-600">
        💡 Click re-render with same filter - without useMemo keeps computing!
      </p>
    </div>
  );
};

// ==========================================
// 4. DEPENDENCY ARRAY BEHAVIOR
// ==========================================
const DependencyBehavior = () => {
  const [a, setA] = useState(5);
  const [b, setB] = useState(10);
  const [c, setC] = useState(2);
  const [logs, setLogs] = useState([]);

  // No dependencies - only computes once
  const result1 = useMemo(() => {
    const val = a * b;
    setLogs((prev) => [...prev, `result1: ${val} (no deps - stale!)`]);
    return val;
  }, []);

  // With 'a' dependency
  const result2 = useMemo(() => {
    const val = a * b;
    setLogs((prev) => [...prev, `result2: ${val} (deps: [a])`]);
    return val;
  }, [a]);

  // With both dependencies
  const result3 = useMemo(() => {
    const val = a * b;
    setLogs((prev) => [...prev, `result3: ${val} (deps: [a, b])`]);
    return val;
  }, [a, b]);

  return (
    <div className="p-4 border rounded mb-4 bg-yellow-50">
      <h3 className="font-bold text-lg mb-2">4. Dependency Array Behavior</h3>

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setA(a + 1)}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          A: {a}
        </button>
        <button
          onClick={() => setB(b + 1)}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm"
        >
          B: {b}
        </button>
        <button
          onClick={() => {
            setLogs([]);
            setC(c + 1);
          }}
          className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
        >
          Clear (C: {c})
        </button>
      </div>

      <div className="bg-white p-3 rounded border text-sm mb-2">
        <p>Current A × B = {a * b}</p>
        <div className="mt-2 space-y-1">
          <p className="text-red-600">result1 (no deps): {result1} ❌ Stale!</p>
          <p className="text-orange-600">
            result2 ([a]): {result2} ⚠️ Missing b
          </p>
          <p className="text-green-600">
            result3 ([a, b]): {result3} ✅ Correct
          </p>
        </div>
      </div>

      <div className="bg-white p-2 rounded border text-xs max-h-32 overflow-y-auto">
        <p className="font-semibold mb-1">Computation Log:</p>
        {logs.slice(-6).map((log, i) => (
          <p key={i} className="font-mono">
            {log}
          </p>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 5. USEMEMO vs USECALLBACK
// ==========================================
const MemoVsCallback = () => {
  const [count, setCount] = useState(0);
  const [items] = useState([1, 2, 3, 4, 5]);

  // useMemo - returns the VALUE (filtered array)
  const filteredItems = useMemo(() => {
    console.log("useMemo: Computing filtered items");
    return items.filter((item) => item > 2);
  }, [items]);

  // useCallback - returns the FUNCTION
  const handleClick = useCallback(() => {
    console.log("Button clicked");
  }, []);

  // This is equivalent to useCallback:
  const handleClickEquivalent = useMemo(() => {
    return () => console.log("Button clicked");
  }, []);

  return (
    <div className="p-4 border rounded mb-4 bg-orange-50">
      <h3 className="font-bold text-lg mb-2">5. useMemo vs useCallback</h3>

      <button
        onClick={() => setCount((c) => c + 1)}
        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 mb-3"
      >
        Re-render (Count: {count})
      </button>

      <div className="bg-white p-3 rounded border text-sm space-y-3">
        <div>
          <p className="font-semibold">useMemo - Returns VALUE:</p>
          <p className="font-mono text-xs">
            const filtered = useMemo(() ={">"} items.filter(...), [items])
          </p>
          <p className="mt-1">Result: [{filteredItems.join(", ")}]</p>
          <p className="text-xs text-gray-600">
            Returns the filtered array itself
          </p>
        </div>

        <div>
          <p className="font-semibold">useCallback - Returns FUNCTION:</p>
          <p className="font-mono text-xs">
            const handler = useCallback(() ={">"} console.log(), [])
          </p>
          <button
            onClick={handleClick}
            className="mt-1 px-2 py-1 bg-blue-500 text-white rounded text-xs"
          >
            Click Me
          </button>
          <p className="text-xs text-gray-600">Returns the function itself</p>
        </div>

        <div className="p-2 bg-blue-50 rounded">
          <p className="font-semibold text-xs">💡 They're Related:</p>
          <p className="font-mono text-xs mt-1">
            useCallback(fn, deps) === useMemo(() ={">"} fn, deps)
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. PERFORMANCE OVERHEAD DEMO
// ==========================================
const PerformanceOverhead = () => {
  const [count, setCount] = useState(0);
  const [timings, setTimings] = useState({ simple: 0, memoized: 0 });

  const runBenchmark = () => {
    // Simple calculation
    const start1 = performance.now();
    const simple = count + 1;
    const end1 = performance.now();

    // Memoized calculation (simulate)
    const start2 = performance.now();
    const memoized = useMemo(() => count + 1, [count]);
    const end2 = performance.now();

    setTimings({
      simple: (end1 - start1).toFixed(4),
      memoized: (end2 - start2).toFixed(4),
    });
  };

  return (
    <div className="p-4 border rounded bg-red-50">
      <h3 className="font-bold text-lg mb-2">6. Performance Trade-offs</h3>

      <div className="bg-white p-3 rounded border text-sm mb-3">
        <p className="font-semibold mb-2">Simple Operation Example:</p>
        <div className="space-y-2">
          <div>
            <p className="font-mono text-xs">
              ❌ const sum = useMemo(() ={">"} a + b, [a, b])
            </p>
            <p className="text-xs text-red-600">
              Overhead: Memory + dependency comparison + function call
            </p>
          </div>
          <div>
            <p className="font-mono text-xs">✅ const sum = a + b</p>
            <p className="text-xs text-green-600">
              Cost: Just the addition (nanoseconds)
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-3 rounded border text-sm">
        <p className="font-semibold mb-2">When useMemo is Worth It:</p>
        <ul className="text-xs space-y-1 list-disc list-inside">
          <li>Computation takes &gt; 1-2ms</li>
          <li>Runs frequently (on every render)</li>
          <li>Need stable reference for React.memo child</li>
          <li>Used in dependency arrays</li>
        </ul>
        <p className="mt-2 text-xs font-semibold text-orange-600">
          ⚠️ Always measure before optimizing!
        </p>
      </div>

      <button
        onClick={() => setCount((c) => c + 1)}
        className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Increment: {count}
      </button>
    </div>
  );
};

// ==========================================
// MAIN APP
// ==========================================
export default function App() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2 text-center">
        useMemo - Interview Master Guide
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Understanding value memoization and when to use it
      </p>

      <ExpensiveCalculation />
      <ReferentialEquality />
      <FilterSortDemo />
      <DependencyBehavior />
      <MemoVsCallback />
      <PerformanceOverhead />

      <div className="mt-6 p-4 bg-white border-2 border-gray-300 rounded">
        <h3 className="font-bold mb-2">🎯 useMemo Interview Checklist:</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>✅ Memoizes computed VALUES (not functions)</li>
          <li>✅ Use for expensive calculations (&gt;1-2ms)</li>
          <li>✅ Use for stable object/array references</li>
          <li>✅ Include ALL dependencies or get stale data</li>
          <li>✅ Has overhead - measure before using</li>
          <li>✅ useCallback = useMemo(() ={">"} fn, deps)</li>
          <li>✅ Works with React.memo to prevent re-renders</li>
          <li>❌ Don't use for simple calculations (a + b)</li>
          <li>❌ Don't use everywhere (premature optimization)</li>
        </ul>
      </div>
    </div>
  );
}
