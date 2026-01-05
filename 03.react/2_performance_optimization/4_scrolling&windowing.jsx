import React, { useState, memo, useMemo, useRef } from "react";

// ==========================================
// MOCK DATA GENERATION
// ==========================================
const generateItems = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    description: `Description for item ${i + 1}`,
    category: ["Electronics", "Clothing", "Food", "Books"][i % 4],
    price: Math.floor(Math.random() * 1000) + 10,
  }));
};

// ==========================================
// 1. PERFORMANCE COMPARISON
// ==========================================
function PerformanceComparison() {
  const [count, setCount] = useState(100);
  const [useVirtual, setUseVirtual] = useState(false);
  const [renderTime, setRenderTime] = useState(0);
  const items = useMemo(() => generateItems(count), [count]);

  const handleRender = () => {
    const start = performance.now();
    // Force re-render
    setUseVirtual((v) => v);
    const end = performance.now();
    setRenderTime(end - start);
  };

  return (
    <div className="p-4 border rounded mb-4 bg-blue-50">
      <h3 className="font-bold text-lg mb-3">1. Performance Comparison</h3>

      <div className="bg-white p-4 rounded border mb-3">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Number of items: {count}
            </label>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>100</span>
              <span>5,000</span>
              <span>10,000</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Rendering mode:
            </label>
            <button
              onClick={() => setUseVirtual(!useVirtual)}
              className={`px-4 py-2 rounded font-semibold ${
                useVirtual ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {useVirtual ? "✅ Virtual (20 items)" : "❌ All items"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-gray-600 text-xs">DOM Nodes</p>
            <p className="text-2xl font-bold">{useVirtual ? "~20" : count}</p>
            <p className="text-xs text-gray-600 mt-1">
              {useVirtual
                ? `${Math.round((20 / count) * 100)}% of total`
                : "100% of total"}
            </p>
          </div>

          <div className="bg-gray-100 p-3 rounded">
            <p className="text-gray-600 text-xs">Memory Usage</p>
            <p className="text-2xl font-bold">
              {useVirtual ? "~2MB" : `~${Math.round(count / 100)}MB`}
            </p>
            <p
              className={`text-xs mt-1 ${
                useVirtual ? "text-green-600" : "text-red-600"
              }`}
            >
              {useVirtual ? "95% less" : "Full"}
            </p>
          </div>

          <div className="bg-gray-100 p-3 rounded">
            <p className="text-gray-600 text-xs">Render Time</p>
            <p className="text-2xl font-bold">
              {useVirtual ? "<16ms" : `${Math.round(count / 10)}ms`}
            </p>
            <p
              className={`text-xs mt-1 ${
                useVirtual ? "text-green-600" : "text-red-600"
              }`}
            >
              {useVirtual ? "60 FPS" : count > 1000 ? "<30 FPS" : "~60 FPS"}
            </p>
          </div>
        </div>

        {useVirtual ? (
          <VirtualListSimulation items={items.slice(0, 20)} />
        ) : (
          <RegularListSimulation items={items} />
        )}
      </div>

      <div className="bg-yellow-100 p-3 rounded text-xs">
        💡 With {count} items:{" "}
        {useVirtual ? "✅ Only renders visible items" : "❌ Renders all items"}
        <br />
        {count > 1000 &&
          !useVirtual &&
          "⚠️ Performance will be poor without virtualization!"}
      </div>
    </div>
  );
}

function RegularListSimulation({ items }) {
  return (
    <div className="h-64 overflow-auto border rounded bg-white">
      {items.map((item) => (
        <div key={item.id} className="p-3 border-b hover:bg-gray-50">
          <p className="font-semibold text-sm">{item.name}</p>
          <p className="text-xs text-gray-600">{item.description}</p>
        </div>
      ))}
    </div>
  );
}

function VirtualListSimulation({ items }) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerHeight = 256; // 64 * 4
  const itemHeight = 64;
  const totalHeight = 10000 * itemHeight; // Simulated total

  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const visibleItems = items.slice(0, visibleCount);

  return (
    <div
      className="h-64 overflow-auto border rounded bg-white relative"
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: totalHeight }}>
        <div style={{ transform: `translateY(${startIndex * itemHeight}px)` }}>
          {visibleItems.map((item, i) => (
            <div
              key={item.id}
              className="p-3 border-b hover:bg-gray-50"
              style={{ height: itemHeight }}
            >
              <p className="font-semibold text-sm">{item.name}</p>
              <p className="text-xs text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. FIXED VS VARIABLE SIZE
// ==========================================
function FixedVsVariableSize() {
  const [mode, setMode] = useState("fixed");
  const items = useMemo(() => generateItems(50), []);

  return (
    <div className="p-4 border rounded mb-4 bg-green-50">
      <h3 className="font-bold text-lg mb-3">
        2. Fixed vs Variable Size Items
      </h3>

      <div className="bg-white p-4 rounded border">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode("fixed")}
            className={`px-4 py-2 rounded ${
              mode === "fixed" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            Fixed Size
          </button>
          <button
            onClick={() => setMode("variable")}
            className={`px-4 py-2 rounded ${
              mode === "variable" ? "bg-purple-500 text-white" : "bg-gray-200"
            }`}
          >
            Variable Size
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded">
            <p className="font-semibold text-sm mb-2">✅ Fixed Size:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>All items same height</li>
              <li>Simpler to implement</li>
              <li>Better performance</li>
              <li>Easy position calculation</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <p className="font-semibold text-sm mb-2">⚠️ Variable Size:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Items have different heights</li>
              <li>More complex implementation</li>
              <li>Need to measure/estimate</li>
              <li>Slight performance cost</li>
            </ul>
          </div>
        </div>

        <div className="h-64 overflow-auto border rounded">
          {items.slice(0, 10).map((item, i) => (
            <div
              key={item.id}
              className="p-3 border-b"
              style={{
                height: mode === "fixed" ? "60px" : `${60 + (i % 3) * 30}px`,
              }}
            >
              <p className="font-semibold text-sm">{item.name}</p>
              <p className="text-xs text-gray-600">{item.description}</p>
              {mode === "variable" && i % 3 === 2 && (
                <p className="text-xs text-gray-500 mt-1">Extra content line</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 bg-yellow-100 p-2 rounded text-xs">
        💡 Fixed size is simpler and more performant. Use variable size only
        when necessary!
      </div>
    </div>
  );
}

// ==========================================
// 3. INFINITE LOADING SIMULATION
// ==========================================
function InfiniteLoadingDemo() {
  const [items, setItems] = useState(() => generateItems(20));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);

  const loadMore = () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoading(true);

    setTimeout(() => {
      const newItems = generateItems(20).map((item) => ({
        ...item,
        id: items.length + item.id,
        name: `Item ${items.length + item.id}`,
      }));

      setItems((prev) => [...prev, ...newItems]);
      setLoading(false);
      loadingRef.current = false;

      if (items.length >= 100) {
        setHasMore(false);
      }
    }, 1000);
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      loadMore();
    }
  };

  return (
    <div className="p-4 border rounded mb-4 bg-purple-50">
      <h3 className="font-bold text-lg mb-3">
        3. Infinite Loading Integration
      </h3>

      <div className="bg-white p-4 rounded border">
        <div className="mb-3 flex justify-between items-center">
          <p className="text-sm">
            Loaded: <span className="font-bold">{items.length}</span> items
          </p>
          <button
            onClick={() => {
              setItems(generateItems(20));
              setHasMore(true);
            }}
            className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
          >
            Reset
          </button>
        </div>

        <div
          className="h-96 overflow-auto border rounded"
          onScroll={handleScroll}
        >
          {items.map((item) => (
            <div key={item.id} className="p-3 border-b">
              <p className="font-semibold text-sm">{item.name}</p>
              <p className="text-xs text-gray-600">
                {item.category} - ${item.price}
              </p>
            </div>
          ))}

          {loading && (
            <div className="p-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
              <p className="text-sm text-gray-600 mt-2">Loading more...</p>
            </div>
          )}

          {!hasMore && (
            <div className="p-4 text-center text-sm text-gray-500">
              No more items to load
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 bg-yellow-100 p-2 rounded text-xs">
        💡 Scroll to bottom to load more items. Virtual scrolling + infinite
        loading = perfect combo!
      </div>
    </div>
  );
}

// ==========================================
// 4. LIBRARY COMPARISON
// ==========================================
function LibraryComparison() {
  return (
    <div className="p-4 border rounded mb-4 bg-orange-50">
      <h3 className="font-bold text-lg mb-3">4. Library Comparison</h3>

      <div className="bg-white p-4 rounded border">
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-3 text-green-700">react-window</h4>

            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-xs text-gray-600">
                  Bundle Size:
                </p>
                <p className="text-2xl font-bold text-green-600">3KB</p>
              </div>

              <div>
                <p className="font-semibold text-xs mb-1">✅ Pros:</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>Very lightweight</li>
                  <li>Simple API</li>
                  <li>Modern codebase</li>
                  <li>Hooks-based</li>
                  <li>Active maintenance</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-xs mb-1">❌ Cons:</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>Fewer features</li>
                  <li>No auto-sizing built-in</li>
                  <li>Basic variable heights</li>
                </ul>
              </div>

              <div className="bg-green-100 p-2 rounded text-xs">
                <p className="font-semibold mb-1">Use when:</p>
                <p>• New projects</p>
                <p>• Want small bundle</p>
                <p>• Simple use cases</p>
              </div>
            </div>
          </div>

          <div className="border rounded p-4">
            <h4 className="font-semibold mb-3 text-blue-700">
              react-virtualized
            </h4>

            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-xs text-gray-600">
                  Bundle Size:
                </p>
                <p className="text-2xl font-bold text-orange-600">30KB</p>
              </div>

              <div>
                <p className="font-semibold text-xs mb-1">✅ Pros:</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>More features</li>
                  <li>AutoSizer included</li>
                  <li>Masonry layout</li>
                  <li>WindowScroller</li>
                  <li>CellMeasurer</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-xs mb-1">❌ Cons:</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>Larger bundle</li>
                  <li>More complex API</li>
                  <li>Class-based</li>
                </ul>
              </div>

              <div className="bg-blue-100 p-2 rounded text-xs">
                <p className="font-semibold mb-1">Use when:</p>
                <p>• Need advanced features</p>
                <p>• Complex layouts</p>
                <p>• Already using it</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded">
          <p className="font-semibold text-sm mb-2">Code Examples:</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold mb-2 text-green-700">
                react-window:
              </p>
              <pre className="bg-gray-800 text-green-400 p-2 rounded text-xs overflow-x-auto">
                {`import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={1000}
  itemSize={50}
  width="100%"
>
  {Row}
</FixedSizeList>`}
              </pre>
            </div>

            <div>
              <p className="text-xs font-semibold mb-2 text-blue-700">
                react-virtualized:
              </p>
              <pre className="bg-gray-800 text-blue-400 p-2 rounded text-xs overflow-x-auto">
                {`import { List } from 'react-virtualized';

<List
  height={600}
  rowCount={1000}
  rowHeight={50}
  rowRenderer={rowRenderer}
  width={width}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. WHEN TO USE VIRTUALIZATION
// ==========================================
function WhenToUseDemo() {
  const scenarios = [
    {
      title: "50 simple items",
      itemCount: 50,
      complexity: "low",
      recommendation: "❌ Don't virtualize",
      reason: "Overhead > benefit. Browser can handle easily.",
      color: "red",
    },
    {
      title: "500 simple items",
      itemCount: 500,
      complexity: "low",
      recommendation: "⚠️ Maybe virtualize",
      reason: "Measure first. Might not need it for simple items.",
      color: "yellow",
    },
    {
      title: "1000+ items",
      itemCount: 1000,
      complexity: "any",
      recommendation: "✅ Definitely virtualize",
      reason: "Significant performance gains. Essential for good UX.",
      color: "green",
    },
    {
      title: "200 complex items",
      itemCount: 200,
      complexity: "high",
      recommendation: "✅ Virtualize",
      reason: "Complex DOM nodes per item. Will be slow without it.",
      color: "green",
    },
    {
      title: "Mobile app list",
      itemCount: 300,
      complexity: "medium",
      recommendation: "✅ Virtualize",
      reason: "Limited memory on mobile. Virtualization helps.",
      color: "green",
    },
    {
      title: "Static table",
      itemCount: 100,
      complexity: "low",
      recommendation: "❌ Don't virtualize",
      reason: "No scrolling needed. All visible at once.",
      color: "red",
    },
  ];

  return (
    <div className="p-4 border rounded mb-4 bg-indigo-50">
      <h3 className="font-bold text-lg mb-3">5. When to Use Virtualization</h3>

      <div className="bg-white p-4 rounded border">
        <div className="space-y-3">
          {scenarios.map((scenario, i) => (
            <div
              key={i}
              className={`p-3 rounded border-l-4 ${
                scenario.color === "green"
                  ? "border-green-500 bg-green-50"
                  : scenario.color === "yellow"
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-red-500 bg-red-50"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-sm">{scenario.title}</p>
                  <p className="text-xs text-gray-600">
                    {scenario.itemCount} items • {scenario.complexity}{" "}
                    complexity
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded font-semibold ${
                    scenario.color === "green"
                      ? "bg-green-200 text-green-800"
                      : scenario.color === "yellow"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {scenario.recommendation}
                </span>
              </div>
              <p className="text-xs">{scenario.reason}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded">
          <p className="font-semibold text-sm mb-2">Decision Framework:</p>
          <div className="text-xs space-y-1">
            <p>
              1. <strong>Measure first:</strong> Profile with React DevTools
            </p>
            <p>
              2. <strong>Check item count:</strong> 1000+ = always virtualize
            </p>
            <p>
              3. <strong>Check complexity:</strong> Complex items = lower
              threshold
            </p>
            <p>
              4. <strong>Consider mobile:</strong> Memory constraints matter
            </p>
            <p>
              5. <strong>Test scroll performance:</strong> {"<"}60 FPS =
              virtualize
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. COMMON PITFALLS
// ==========================================
function CommonPitfalls() {
  return (
    <div className="p-4 border rounded bg-red-50">
      <h3 className="font-bold text-lg mb-3">6. Common Pitfalls</h3>

      <div className="bg-white p-4 rounded border space-y-3">
        <div className="border-l-4 border-red-500 pl-3">
          <p className="font-semibold text-sm text-red-700 mb-1">
            ❌ Not spreading style prop
          </p>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {`// ❌ WRONG
const Row = ({ index, style }) => (
  <div>{items[index].name}</div>
);

// ✅ CORRECT
const Row = ({ index, style }) => (
  <div style={style}>{items[index].name}</div>
);`}
          </pre>
        </div>

        <div className="border-l-4 border-red-500 pl-3">
          <p className="font-semibold text-sm text-red-700 mb-1">
            ❌ Using index as key
          </p>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {`// ❌ WRONG
<div key={index}>

// ✅ CORRECT
<div key={items[index].id}>`}
          </pre>
        </div>

        <div className="border-l-4 border-red-500 pl-3">
          <p className="font-semibold text-sm text-red-700 mb-1">
            ❌ Expensive operations in Row
          </p>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {`// ❌ WRONG - runs every render
const Row = ({ index }) => {
  const processed = expensiveOp(items[index]);
  return <div>{processed}</div>;
};

// ✅ CORRECT - preprocess
const processed = useMemo(
  () => items.map(expensiveOp),
  [items]
);`}
          </pre>
        </div>

        <div className="border-l-4 border-red-500 pl-3">
          <p className="font-semibold text-sm text-red-700 mb-1">
            ❌ Not checking bounds
          </p>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {`// ❌ WRONG - might be undefined
const Row = ({ index }) => (
  <div>{items[index].name}</div>
);

// ✅ CORRECT - check first
const Row = ({ index }) => {
  if (!items[index]) return <Loading />;
  return <div>{items[index].name}</div>;
};`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN APP
// ==========================================
export default function App() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2 text-center">
        Virtual Scrolling & Windowing
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Optimizing large lists with virtualization
      </p>

      <PerformanceComparison />
      <FixedVsVariableSize />
      <InfiniteLoadingDemo />
      <LibraryComparison />
      <WhenToUseDemo />
      <CommonPitfalls />

      <div className="mt-6 p-4 bg-white border-2 border-gray-300 rounded">
        <h3 className="font-bold mb-2">🎯 Virtual Scrolling Checklist:</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>✅ Only renders visible items (not all items)</li>
          <li>✅ Use react-window for most cases (3KB)</li>
          <li>✅ Use react-virtualized for complex needs (30KB)</li>
          <li>✅ Always spread style prop in Row component</li>
          <li>✅ Use stable IDs as keys (not index)</li>
          <li>✅ Fixed size when possible (best performance)</li>
          <li>✅ Measure before optimizing (not always needed)</li>
          <li>✅ Essential for 1000+ items</li>
          <li>❌ Don't use for small lists ({"<"}50 items)</li>
          <li>❌ Don't forget to preprocess expensive data</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-gradient-to-r from-blue-100 to-green-100 rounded border-2 border-blue-300">
        <h3 className="font-bold mb-2">📊 Performance Impact:</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600 text-xs">DOM Nodes</p>
            <p className="text-xl font-bold text-green-600">500x fewer</p>
            <p className="text-xs">10,000 → 20 nodes</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs">Memory Usage</p>
            <p className="text-xl font-bold text-green-600">95% less</p>
            <p className="text-xs">100MB → 5MB</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs">Scroll Performance</p>
            <p className="text-xl font-bold text-green-600">60 FPS</p>
            <p className="text-xs">vs 15-30 FPS</p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-yellow-100 rounded border-2 border-yellow-300">
        <h3 className="font-bold mb-2">🔑 Key Takeaways:</h3>
        <div className="text-sm space-y-1">
          <p>
            • <strong>What:</strong> Only render items visible in viewport
          </p>
          <p>
            • <strong>Why:</strong> Prevents DOM bloat with large lists
          </p>
          <p>
            • <strong>When:</strong> 1000+ items or complex item components
          </p>
          <p>
            • <strong>How:</strong> react-window (simple) or react-virtualized
            (complex)
          </p>
          <p>
            • <strong>Trade-off:</strong> Complexity vs performance - measure
            first!
          </p>
        </div>
      </div>
    </div>
  );
}
