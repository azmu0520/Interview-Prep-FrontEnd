import React, { useState, useCallback, memo, useEffect } from "react";

// ==========================================
// 1. REFERENTIAL EQUALITY DEMO
// ==========================================
const ReferentialEquality = () => {
  const [count, setCount] = useState(0);
  const [checks, setChecks] = useState([]);

  // Without useCallback - new function every render
  const normalFn = () => console.log("normal");

  // With useCallback - same reference across renders
  const memoizedFn = useCallback(() => console.log("memoized"), []);

  // Track references
  const prevNormalRef = React.useRef(null);
  const prevMemoizedRef = React.useRef(null);

  useEffect(() => {
    const normalSame = prevNormalRef.current === normalFn;
    const memoizedSame = prevMemoizedRef.current === memoizedFn;

    if (prevNormalRef.current !== null) {
      setChecks((prev) => [
        ...prev,
        {
          render: count,
          normal: normalSame ? "✅ Same" : "❌ Different",
          memoized: memoizedSame ? "✅ Same" : "❌ Different",
        },
      ]);
    }

    prevNormalRef.current = normalFn;
    prevMemoizedRef.current = memoizedFn;
  }, [count]);

  return (
    <div className="p-4 border rounded mb-4 bg-blue-50">
      <h3 className="font-bold text-lg mb-2">1. Referential Equality</h3>
      <button
        onClick={() => setCount((c) => c + 1)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-2"
      >
        Re-render (Count: {count})
      </button>
      <button
        onClick={() => setChecks([])}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 ml-2 mb-2"
      >
        Clear
      </button>

      <div className="bg-white p-2 rounded border text-sm">
        <div className="grid grid-cols-3 gap-2 font-semibold mb-1 pb-1 border-b">
          <div>Render #</div>
          <div>Normal Function</div>
          <div>useCallback</div>
        </div>
        {checks.map((check, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 py-1">
            <div>{check.render}</div>
            <div>{check.normal}</div>
            <div>{check.memoized}</div>
          </div>
        ))}
      </div>
      <p className="text-xs mt-2 text-gray-600">
        💡 Normal function gets new reference every render, useCallback keeps
        same reference!
      </p>
    </div>
  );
};

// ==========================================
// 2. WITH vs WITHOUT REACT.MEMO
// ==========================================
// Child without memo - always re-renders
const NormalChild = ({ onClick, label }) => {
  const renderCount = React.useRef(0);
  renderCount.current++;

  return (
    <div className="p-2 bg-red-100 rounded text-sm">
      <p>❌ Normal Child (renders: {renderCount.current})</p>
      <button
        onClick={onClick}
        className="px-2 py-1 bg-red-500 text-white rounded text-xs mt-1"
      >
        {label}
      </button>
    </div>
  );
};

// Child with memo - only re-renders when props change
const MemoizedChild = memo(({ onClick, label }) => {
  const renderCount = React.useRef(0);
  renderCount.current++;

  return (
    <div className="p-2 bg-green-100 rounded text-sm">
      <p>✅ Memoized Child (renders: {renderCount.current})</p>
      <button
        onClick={onClick}
        className="px-2 py-1 bg-green-500 text-white rounded text-xs mt-1"
      >
        {label}
      </button>
    </div>
  );
});

const MemoDemo = () => {
  const [parentCount, setParentCount] = useState(0);
  const [childCount, setChildCount] = useState(0);

  // Without useCallback - new function every render
  const handleNormalClick = () => setChildCount((c) => c + 1);

  // With useCallback - stable reference
  const handleMemoizedClick = useCallback(
    () => setChildCount((c) => c + 1),
    []
  );

  return (
    <div className="p-4 border rounded mb-4 bg-green-50">
      <h3 className="font-bold text-lg mb-2">2. useCallback + React.memo</h3>
      <button
        onClick={() => setParentCount((c) => c + 1)}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 mb-3"
      >
        Re-render Parent (Count: {parentCount})
      </button>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-semibold mb-2">Without useCallback:</p>
          <MemoizedChild
            onClick={handleNormalClick}
            label={`Child Count: ${childCount}`}
          />
          <p className="text-xs mt-1 text-gray-600">
            Re-renders on every parent render (new function reference)
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold mb-2">With useCallback:</p>
          <MemoizedChild
            onClick={handleMemoizedClick}
            label={`Child Count: ${childCount}`}
          />
          <p className="text-xs mt-1 text-gray-600">
            Only re-renders when childCount changes!
          </p>
        </div>
      </div>

      <p className="text-xs mt-3 p-2 bg-yellow-100 rounded">
        💡 Click "Re-render Parent" - left child re-renders, right doesn't!
      </p>
    </div>
  );
};

// ==========================================
// 3. DEPENDENCY ARRAY BEHAVIOR
// ==========================================
const DependencyBehavior = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("John");
  const [log, setLog] = useState([]);

  // No dependencies - creates once
  const fn1 = useCallback(() => {
    setLog((prev) => [...prev, `fn1: count=${count}, name=${name}`]);
  }, []);

  // With count dependency
  const fn2 = useCallback(() => {
    setLog((prev) => [...prev, `fn2: count=${count}, name=${name}`]);
  }, [count]);

  // With both dependencies
  const fn3 = useCallback(() => {
    setLog((prev) => [...prev, `fn3: count=${count}, name=${name}`]);
  }, [count, name]);

  return (
    <div className="p-4 border rounded mb-4 bg-yellow-50">
      <h3 className="font-bold text-lg mb-2">3. Dependency Array Behavior</h3>

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-3 py-2 bg-blue-500 text-white rounded text-sm"
        >
          Count: {count}
        </button>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-2 py-1 border rounded text-sm"
          placeholder="Name"
        />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <button
          onClick={fn1}
          className="px-2 py-1 bg-red-500 text-white rounded text-xs"
        >
          fn1 (no deps)
        </button>
        <button
          onClick={fn2}
          className="px-2 py-1 bg-orange-500 text-white rounded text-xs"
        >
          fn2 ([count])
        </button>
        <button
          onClick={fn3}
          className="px-2 py-1 bg-green-500 text-white rounded text-xs"
        >
          fn3 ([count, name])
        </button>
      </div>

      <div className="bg-white p-2 rounded border text-xs max-h-32 overflow-y-auto">
        {log.map((entry, i) => (
          <p key={i} className="font-mono">
            {entry}
          </p>
        ))}
      </div>

      <div className="mt-2 text-xs space-y-1">
        <p className="text-red-600">
          ❌ fn1: Captures initial values (stale closure!)
        </p>
        <p className="text-orange-600">
          ⚠️ fn2: Updates with count, but name is stale
        </p>
        <p className="text-green-600">✅ fn3: Always has current values</p>
      </div>
    </div>
  );
};

// ==========================================
// 4. USECALLBACK IN USEEFFECT DEPENDENCY
// ==========================================
const UseEffectDependency = () => {
  const [userId, setUserId] = useState(1);
  const [fetchCount, setFetchCount] = useState({ bad: 0, good: 0 });

  // ❌ WITHOUT useCallback - recreates every render
  const fetchUserBad = () => {
    console.log(`Fetching user ${userId}`);
  };

  useEffect(() => {
    fetchUserBad();
    setFetchCount((prev) => ({ ...prev, bad: prev.bad + 1 }));
  }, [fetchUserBad]); // New reference every render!

  // ✅ WITH useCallback - stable reference
  const fetchUserGood = useCallback(() => {
    console.log(`Fetching user ${userId}`);
  }, [userId]); // Only changes when userId changes

  useEffect(() => {
    fetchUserGood();
    setFetchCount((prev) => ({ ...prev, good: prev.good + 1 }));
  }, [fetchUserGood]);

  return (
    <div className="p-4 border rounded mb-4 bg-purple-50">
      <h3 className="font-bold text-lg mb-2">
        4. useCallback in useEffect Dependencies
      </h3>

      <button
        onClick={() => setUserId((id) => id + 1)}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 mb-2"
      >
        Change User ID: {userId}
      </button>

      <div className="bg-white p-2 rounded border text-sm">
        <p>❌ Without useCallback: useEffect ran {fetchCount.bad} times</p>
        <p>✅ With useCallback: useEffect ran {fetchCount.good} times</p>
      </div>

      <p className="text-xs mt-2 text-gray-600">
        💡 Both should run same number of times, but without useCallback runs on
        EVERY render!
      </p>
    </div>
  );
};

// ==========================================
// 5. PERFORMANCE COMPARISON
// ==========================================
const PerformanceDemo = () => {
  const [count, setCount] = useState(0);
  const [items] = useState(Array.from({ length: 100 }, (_, i) => i));

  const handleClickNoMemo = (id) => {
    console.log(`Clicked ${id}`);
  };

  const handleClickWithMemo = useCallback((id) => {
    console.log(`Clicked ${id}`);
  }, []);

  // Expensive child component
  const ExpensiveItem = memo(({ id, onClick }) => {
    const renderCount = React.useRef(0);
    renderCount.current++;

    // Simulate expensive render
    let i = 0;
    while (i < 100000) i++;

    return (
      <div className="p-1 bg-gray-100 rounded text-xs">
        Item {id} (renders: {renderCount.current})
      </div>
    );
  });

  return (
    <div className="p-4 border rounded mb-4 bg-orange-50">
      <h3 className="font-bold text-lg mb-2">5. Performance Impact</h3>

      <button
        onClick={() => setCount((c) => c + 1)}
        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 mb-2"
      >
        Re-render Parent (Count: {count})
      </button>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-semibold mb-2">❌ Without useCallback:</p>
          <div className="bg-white p-2 rounded border h-48 overflow-y-auto">
            {items.slice(0, 10).map((id) => (
              <ExpensiveItem key={id} id={id} onClick={handleClickNoMemo} />
            ))}
          </div>
          <p className="text-xs mt-1 text-red-600">
            All items re-render on parent update
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold mb-2">✅ With useCallback:</p>
          <div className="bg-white p-2 rounded border h-48 overflow-y-auto">
            {items.slice(0, 10).map((id) => (
              <ExpensiveItem key={id} id={id} onClick={handleClickWithMemo} />
            ))}
          </div>
          <p className="text-xs mt-1 text-green-600">
            Items stay memoized, no re-render!
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. COMMON MISTAKES
// ==========================================
const CommonMistakes = () => {
  const [count, setCount] = useState(0);

  // ❌ MISTAKE 1: Missing dependency (stale closure)
  const mistake1 = useCallback(() => {
    console.log(`Count is: ${count}`);
  }, []); // Missing count!

  // ✅ CORRECT
  const correct1 = useCallback(() => {
    console.log(`Count is: ${count}`);
  }, [count]);

  // ❌ MISTAKE 2: Object in dependencies
  const config = { id: count };
  const mistake2 = useCallback(() => {
    console.log(config);
  }, [config]); // New object every render!

  // ✅ CORRECT
  const correct2 = useCallback(() => {
    console.log({ id: count });
  }, [count]); // Primitive dependency

  return (
    <div className="p-4 border rounded bg-red-50">
      <h3 className="font-bold text-lg mb-2">6. Common Mistakes</h3>

      <button
        onClick={() => setCount((c) => c + 1)}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mb-3"
      >
        Count: {count}
      </button>

      <div className="space-y-3 text-sm">
        <div className="bg-white p-3 rounded border">
          <p className="font-semibold text-red-600 mb-1">❌ Stale Closure:</p>
          <button
            onClick={mistake1}
            className="px-3 py-1 bg-red-400 text-white rounded text-xs"
          >
            Click (logs old count)
          </button>
          <p className="text-xs mt-1 text-gray-600">
            Missing dependency - always logs initial count
          </p>
        </div>

        <div className="bg-white p-3 rounded border">
          <p className="font-semibold text-green-600 mb-1">✅ Current Value:</p>
          <button
            onClick={correct1}
            className="px-3 py-1 bg-green-500 text-white rounded text-xs"
          >
            Click (logs current count)
          </button>
          <p className="text-xs mt-1 text-gray-600">
            Includes dependency - logs current count
          </p>
        </div>

        <div className="bg-white p-3 rounded border">
          <p className="font-semibold mb-1">⚠️ Common Pitfall:</p>
          <p className="text-xs text-gray-600">
            Object dependencies like{" "}
            <code className="bg-gray-200 px-1">[config]</code> cause the
            function to recreate every render because objects have new
            references. Use primitive values like{" "}
            <code className="bg-gray-200 px-1">[config.id]</code> instead!
          </p>
        </div>
      </div>
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
        useCallback - Interview Master Guide
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Understanding function memoization and when to use it
      </p>

      <ReferentialEquality />
      <MemoDemo />
      <DependencyBehavior />
      <UseEffectDependency />
      <PerformanceDemo />
      <CommonMistakes />

      <div className="mt-6 p-4 bg-white border-2 border-gray-300 rounded">
        <h3 className="font-bold mb-2">🎯 useCallback Interview Checklist:</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>✅ Returns memoized function reference (not result)</li>
          <li>✅ Use with React.memo children to prevent re-renders</li>
          <li>✅ Use in useEffect dependencies to prevent re-runs</li>
          <li>✅ Include ALL dependencies or get stale closures</li>
          <li>✅ Has overhead - don't use everywhere</li>
          <li>✅ Object/array dependencies break memoization</li>
          <li>✅ useCallback(fn, deps) = useMemo(() ={">"} fn, deps)</li>
          <li>❌ Don't use for simple event handlers not passed down</li>
        </ul>
      </div>
    </div>
  );
}
