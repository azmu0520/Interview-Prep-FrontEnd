import { useState, useEffect, useLayoutEffect, useCallback } from "react";

// ==========================================
// 1. EFFECT EXECUTION TIMING
// ==========================================
const ExecutionTiming = () => {
  const [count, setCount] = useState(0);
  const [log, setLog] = useState([]);

  // Runs during render
  const addLog = (msg) => {
    setLog((prev) => [...prev, `${Date.now() % 10000}ms: ${msg}`]);
  };

  if (count > 0 && log.length < 3) {
    addLog("1️⃣ Render phase");
  }

  useLayoutEffect(() => {
    if (count > 0) {
      addLog("2️⃣ useLayoutEffect (before paint)");
    }
  }, [count]);

  useEffect(() => {
    if (count > 0) {
      addLog("3️⃣ useEffect (after paint)");
    }
  }, [count]);

  return (
    <div className="p-4 border rounded mb-4 bg-blue-50">
      <h3 className="font-bold text-lg mb-2">1. Effect Execution Timing</h3>
      <p className="text-sm mb-2">Count: {count}</p>
      <button
        onClick={() => {
          setCount((c) => c + 1);
          setLog([]);
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-2"
      >
        Trigger Render
      </button>
      <div className="bg-white p-2 rounded border text-xs">
        {log.map((entry, i) => (
          <p key={i} className="font-mono">
            {entry}
          </p>
        ))}
      </div>
      <p className="text-xs mt-2 text-gray-600">
        💡 Order: Render → useLayoutEffect → Paint → useEffect
      </p>
    </div>
  );
};

// ==========================================
// 2. DEPENDENCY ARRAY PATTERNS
// ==========================================
const DependencyPatterns = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const [logs, setLogs] = useState({ noArray: 0, empty: 0, withDeps: 0 });

  // No dependency array - runs every render
  useEffect(() => {
    setLogs((prev) => ({ ...prev, noArray: prev.noArray + 1 }));
  });

  // Empty array - runs once on mount
  useEffect(() => {
    setLogs((prev) => ({ ...prev, empty: prev.empty + 1 }));
  }, []);

  // With dependencies - runs when count changes
  useEffect(() => {
    setLogs((prev) => ({ ...prev, withDeps: prev.withDeps + 1 }));
  }, [count]);

  return (
    <div className="p-4 border rounded mb-4 bg-green-50">
      <h3 className="font-bold text-lg mb-2">2. Dependency Array Patterns</h3>
      <div className="mb-2">
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm mr-2"
        >
          Count: {count}
        </button>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Type to re-render"
          className="px-2 py-1 border rounded text-sm"
        />
      </div>
      <div className="bg-white p-2 rounded border text-sm">
        <p>❌ No array: Ran {logs.noArray} times (every render)</p>
        <p>✅ Empty []: Ran {logs.empty} time(s) (mount only)</p>
        <p>
          ✅ With [count]: Ran {logs.withDeps} time(s) (mount + count changes)
        </p>
      </div>
      <p className="text-xs mt-2 text-gray-600">
        💡 Type in input - no array runs, but [count] doesn't!
      </p>
    </div>
  );
};

// ==========================================
// 3. CLEANUP FUNCTIONS
// ==========================================
const CleanupDemo = () => {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [log, setLog] = useState([]);

  useEffect(() => {
    if (!isActive) return;

    setLog((prev) => [...prev, "⚡ Effect: Timer started"]);

    const interval = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);

    // Cleanup function
    return () => {
      setLog((prev) => [...prev, "🧹 Cleanup: Timer stopped"]);
      clearInterval(interval);
    };
  }, [isActive]);

  return (
    <div className="p-4 border rounded mb-4 bg-yellow-50">
      <h3 className="font-bold text-lg mb-2">3. Cleanup Functions</h3>
      <p className="mb-2">
        Time: <span className="font-bold text-xl">{time}s</span>
      </p>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setIsActive(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Start Timer
        </button>
        <button
          onClick={() => setIsActive(false)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Stop Timer
        </button>
        <button
          onClick={() => {
            setTime(0);
            setLog([]);
            setIsActive(false);
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
      <div className="bg-white p-2 rounded border text-xs max-h-32 overflow-y-auto">
        {log.map((entry, i) => (
          <p key={i}>{entry}</p>
        ))}
      </div>
      <p className="text-xs mt-2 text-gray-600">
        💡 Cleanup runs before next effect and on stop (unmount simulation)
      </p>
    </div>
  );
};

// ==========================================
// 4. ASYNC OPERATIONS WITH ABORT
// ==========================================
const AsyncWithAbort = () => {
  const [userId, setUserId] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUser = async () => {
      try {
        setLoading(true);
        setLog((prev) => [...prev, `📡 Fetching user ${userId}...`]);

        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${userId}`,
          { signal: controller.signal } // KEY POINT
        );
        const userData = await response.json();

        setData(userData);
        setLog((prev) => [...prev, `✅ Got ${userData.name}`]);
      } catch (error) {
        if (error.name === "AbortError") {
          setLog((prev) => [...prev, `❌ Request aborted for user ${userId}`]);
        } else {
          setLog((prev) => [...prev, `❌ Error: ${error.message}`]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Cleanup: abort fetch if userId changes or component unmounts
    return () => {
      controller.abort();
    };
  }, [userId]);

  return (
    <div className="p-4 border rounded mb-4 bg-purple-50">
      <h3 className="font-bold text-lg mb-2">
        4. Async Operations with AbortController
      </h3>
      <div className="mb-2">
        <p className="text-sm mb-1">User ID: {userId}</p>
        <button
          onClick={() => setUserId((id) => id + 1)}
          className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm mr-2"
        >
          Next User
        </button>
        <button
          onClick={() => {
            setUserId(1);
            setLog([]);
          }}
          className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
        >
          Reset
        </button>
      </div>
      {loading && <p className="text-sm">⏳ Loading...</p>}
      {data && (
        <div className="bg-white p-2 rounded border text-sm mb-2">
          <p>
            <strong>Name:</strong> {data.name}
          </p>
          <p>
            <strong>Email:</strong> {data.email}
          </p>
        </div>
      )}
      <div className="bg-white p-2 rounded border text-xs max-h-32 overflow-y-auto">
        {log.slice(-5).map((entry, i) => (
          <p key={i}>{entry}</p>
        ))}
      </div>
      <p className="text-xs mt-2 text-gray-600">
        💡 Click Next rapidly - previous requests get aborted!
      </p>
    </div>
  );
};

// ==========================================
// 5. INFINITE LOOP EXAMPLES
// ==========================================
const InfiniteLoopDemo = () => {
  const [count, setCount] = useState(0);
  const [mode, setMode] = useState("safe");
  const [iterations, setIterations] = useState(0);

  // Safe version - with proper dependencies
  useEffect(() => {
    if (mode === "safe" && count < 3) {
      const timer = setTimeout(() => {
        setIterations((i) => i + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [count, mode]);

  // Simulate infinite loop - controlled
  useEffect(() => {
    if (mode === "dangerous" && iterations < 5) {
      setIterations((i) => i + 1);
    }
  }, [iterations, mode]); // iterations changes → effect runs → iterations changes → ∞

  return (
    <div className="p-4 border rounded mb-4 bg-red-50">
      <h3 className="font-bold text-lg mb-2">
        5. Infinite Loop (Controlled Demo)
      </h3>
      <p className="text-sm mb-2">
        Iterations: <span className="font-bold">{iterations}</span>
      </p>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => {
            setMode("safe");
            setIterations(0);
            setCount((c) => c + 1);
          }}
          className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
        >
          ✅ Safe Pattern
        </button>
        <button
          onClick={() => {
            setMode("dangerous");
            setIterations(0);
          }}
          className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
        >
          ❌ Infinite (5 iter)
        </button>
        <button
          onClick={() => {
            setIterations(0);
            setMode("safe");
          }}
          className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
        >
          Reset
        </button>
      </div>
      <div className="bg-white p-2 rounded border text-xs">
        <p className="mb-1">
          <strong>Safe:</strong> Proper dependency, stops at limit
        </p>
        <p>
          <strong>Dangerous:</strong> Updates its own dependency → loop (capped
          at 5)
        </p>
      </div>
      <p className="text-xs mt-2 text-gray-600">
        💡 Real infinite loops would crash! This is controlled for demo.
      </p>
    </div>
  );
};

// ==========================================
// 6. OBJECT DEPENDENCIES PROBLEM
// ==========================================
const ObjectDependencies = () => {
  const [userId, setUserId] = useState(1);
  const [runCount, setRunCount] = useState({ bad: 0, good: 0 });

  // ❌ BAD: New object every render
  const filters = { userId, active: true };

  useEffect(() => {
    setRunCount((prev) => ({ ...prev, bad: prev.bad + 1 }));
  }, [filters]); // New object reference every render!

  // ✅ GOOD: Primitive dependencies
  useEffect(() => {
    setRunCount((prev) => ({ ...prev, good: prev.good + 1 }));
  }, [userId]); // Primitive value, stable reference

  return (
    <div className="p-4 border rounded mb-4 bg-orange-50">
      <h3 className="font-bold text-lg mb-2">6. Object Dependencies Problem</h3>
      <button
        onClick={() => setUserId((id) => id + 1)}
        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 mb-2"
      >
        Change User ID: {userId}
      </button>
      <div className="bg-white p-2 rounded border text-sm">
        <p>❌ Bad (object dep): Ran {runCount.bad} times</p>
        <p>✅ Good (primitive dep): Ran {runCount.good} times</p>
      </div>
      <p className="text-xs mt-2 text-gray-600">
        💡 Object reference changes every render → unnecessary effect runs!
      </p>
    </div>
  );
};

// ==========================================
// 7. STRICT MODE DOUBLE MOUNT
// ==========================================
const StrictModeDemo = () => {
  const [log, setLog] = useState([]);

  useEffect(() => {
    setLog((prev) => [...prev, "🚀 Effect: Component mounted"]);

    return () => {
      setLog((prev) => [...prev, "💀 Cleanup: Component unmounting"]);
    };
  }, []);

  return (
    <div className="p-4 border rounded mb-4 bg-pink-50">
      <h3 className="font-bold text-lg mb-2">
        7. React 18 Strict Mode Behavior
      </h3>
      <button
        onClick={() => setLog([])}
        className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 mb-2"
      >
        Clear Log
      </button>
      <div className="bg-white p-2 rounded border text-xs">
        {log.map((entry, i) => (
          <p key={i}>{entry}</p>
        ))}
      </div>
      <p className="text-xs mt-2 text-gray-600">
        💡 In Strict Mode (dev), you'll see: Mount → Unmount → Mount
      </p>
      <p className="text-xs text-gray-600">
        This tests that your cleanup works! Only in dev, not production.
      </p>
    </div>
  );
};

// ==========================================
// 8. FUNCTION DEPENDENCIES WITH USECALLBACK
// ==========================================
const FunctionDependencies = () => {
  const [userId, setUserId] = useState(1);
  const [runCount, setRunCount] = useState({ bad: 0, good: 0 });

  // ❌ BAD: New function every render
  const fetchUser = () => {
    console.log(`Fetching user ${userId}`);
  };

  useEffect(() => {
    fetchUser();
    setRunCount((prev) => ({ ...prev, bad: prev.bad + 1 }));
  }, [fetchUser]); // New function reference every render!

  // ✅ GOOD: Memoized with useCallback
  const fetchUserMemoized = useCallback(() => {
    console.log(`Fetching user ${userId}`);
  }, [userId]); // Only changes when userId changes

  useEffect(() => {
    fetchUserMemoized();
    setRunCount((prev) => ({ ...prev, good: prev.good + 1 }));
  }, [fetchUserMemoized]);

  return (
    <div className="p-4 border rounded bg-indigo-50">
      <h3 className="font-bold text-lg mb-2">8. Function Dependencies</h3>
      <button
        onClick={() => setUserId((id) => id + 1)}
        className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 mb-2"
      >
        Change User ID: {userId}
      </button>
      <div className="bg-white p-2 rounded border text-sm">
        <p>❌ Bad (function dep): Ran {runCount.bad} times</p>
        <p>✅ Good (useCallback): Ran {runCount.good} times</p>
      </div>
      <p className="text-xs mt-2 text-gray-600">
        💡 Functions recreate every render → use useCallback or define inside
        effect!
      </p>
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
        useEffect - Interview Master Guide
      </h1>
      <p className="text-center text-gray-600 mb-6">
        All critical patterns and pitfalls in action
      </p>

      <ExecutionTiming />
      <DependencyPatterns />
      <CleanupDemo />
      <AsyncWithAbort />
      <InfiniteLoopDemo />
      <ObjectDependencies />
      <StrictModeDemo />
      <FunctionDependencies />

      <div className="mt-6 p-4 bg-white border-2 border-gray-300 rounded">
        <h3 className="font-bold mb-2">🎯 useEffect Interview Checklist:</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>✅ Effects run AFTER paint (asynchronous)</li>
          <li>✅ Cleanup runs before next effect and on unmount</li>
          <li>✅ Dependencies use shallow comparison (Object.is)</li>
          <li>✅ Empty array [] = run once, no array = run always</li>
          <li>✅ Can't make useEffect async - define async function inside</li>
          <li>✅ Use AbortController to cancel fetch requests</li>
          <li>✅ Object/function dependencies need useMemo/useCallback</li>
          <li>✅ Strict Mode runs effects twice in development only</li>
        </ul>
      </div>
    </div>
  );
}
