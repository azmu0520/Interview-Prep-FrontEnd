import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

// ==========================================
// CUSTOM HOOKS
// ==========================================

// 1. useToggle - Simple state toggle
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, { toggle, setTrue, setFalse }];
}

// 2. useCounter - Counter with increment/decrement
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => setCount((c) => c + 1), []);
  const decrement = useCallback(() => setCount((c) => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  const set = useCallback((value) => setCount(value), []);

  return {
    count,
    increment,
    decrement,
    reset,
    set,
  };
}

// 3. useLocalStorage - Sync state with localStorage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

// 4. usePrevious - Track previous value
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

// 5. useDebounce - Debounce a value
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 6. useWindowSize - Track window dimensions
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

// 7. useInterval - setInterval hook
function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// 8. useFetch - Data fetching hook
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      if (!cancelled) {
        if (Math.random() > 0.3) {
          setData({
            id: Math.random(),
            url,
            timestamp: new Date().toLocaleTimeString(),
          });
        } else {
          setError(new Error("Failed to fetch"));
        }
        setLoading(false);
      }
    }, 1000);

    return () => {
      cancelled = true;
    };
  }, [url]);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    // Trigger re-fetch by updating a dependency
  }, []);

  return { data, loading, error, refetch };
}

// ==========================================
// 1. BASIC CUSTOM HOOK DEMO
// ==========================================
function BasicCustomHookDemo() {
  const { count, increment, decrement, reset } = useCounter(0);
  const [isOpen, { toggle, setTrue, setFalse }] = useToggle(false);

  return (
    <div className="p-4 border rounded mb-4 bg-blue-50">
      <h3 className="font-bold text-lg mb-2">1. Basic Custom Hooks</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded border">
          <p className="font-semibold text-sm mb-2">useCounter:</p>
          <p className="text-3xl font-bold mb-3 text-center">{count}</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={decrement}
              className="px-3 py-2 bg-red-500 text-white rounded text-sm"
            >
              -
            </button>
            <button
              onClick={reset}
              className="px-3 py-2 bg-gray-500 text-white rounded text-sm"
            >
              Reset
            </button>
            <button
              onClick={increment}
              className="px-3 py-2 bg-green-500 text-white rounded text-sm"
            >
              +
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded border">
          <p className="font-semibold text-sm mb-2">useToggle:</p>
          <div className="text-center mb-3">
            <span
              className={`inline-block px-4 py-2 rounded text-white font-semibold ${
                isOpen ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {isOpen ? "OPEN" : "CLOSED"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={setFalse}
              className="px-3 py-2 bg-red-500 text-white rounded text-sm"
            >
              Close
            </button>
            <button
              onClick={toggle}
              className="px-3 py-2 bg-blue-500 text-white rounded text-sm"
            >
              Toggle
            </button>
            <button
              onClick={setTrue}
              className="px-3 py-2 bg-green-500 text-white rounded text-sm"
            >
              Open
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 bg-yellow-100 p-2 rounded text-xs">
        💡 Custom hooks encapsulate reusable logic with state and effects!
      </div>
    </div>
  );
}

// ==========================================
// 2. INDEPENDENT STATE DEMO
// ==========================================
function CounterComponent({ label, color }) {
  const { count, increment, decrement } = useCounter(0);

  return (
    <div className={`${color} p-3 rounded border`}>
      <p className="font-semibold text-sm mb-2">{label}</p>
      <p className="text-2xl font-bold mb-2 text-center">{count}</p>
      <div className="flex gap-2">
        <button
          onClick={decrement}
          className="flex-1 px-3 py-1 bg-red-500 text-white rounded text-sm"
        >
          -
        </button>
        <button
          onClick={increment}
          className="flex-1 px-3 py-1 bg-green-500 text-white rounded text-sm"
        >
          +
        </button>
      </div>
    </div>
  );
}

function IndependentStateDemo() {
  return (
    <div className="p-4 border rounded mb-4 bg-green-50">
      <h3 className="font-bold text-lg mb-2">2. Independent State</h3>

      <div className="grid grid-cols-3 gap-3">
        <CounterComponent label="Counter A" color="bg-blue-100" />
        <CounterComponent label="Counter B" color="bg-purple-100" />
        <CounterComponent label="Counter C" color="bg-pink-100" />
      </div>

      <div className="mt-3 bg-yellow-100 p-2 rounded text-xs">
        💡 Each component using useCounter() has its own independent state!
      </div>
    </div>
  );
}

// ==========================================
// 3. USELOCALSTORAGE DEMO
// ==========================================
function LocalStorageDemo() {
  const [name, setName] = useLocalStorage("demo-name", "");
  const [theme, setTheme] = useLocalStorage("demo-theme", "light");
  const [count, setCount] = useLocalStorage("demo-count", 0);

  return (
    <div className="p-4 border rounded mb-4 bg-purple-50">
      <h3 className="font-bold text-lg mb-2">3. useLocalStorage</h3>

      <div className="bg-white p-4 rounded border space-y-3">
        <div>
          <label className="block text-sm font-semibold mb-1">Name:</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Theme:</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Count: {count}
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setCount((c) => c - 1)}
              className="flex-1 px-3 py-2 bg-red-500 text-white rounded"
            >
              Decrement
            </button>
            <button
              onClick={() => setCount((c) => c + 1)}
              className="flex-1 px-3 py-2 bg-green-500 text-white rounded"
            >
              Increment
            </button>
          </div>
        </div>

        <div className="pt-3 border-t">
          <p className="text-sm font-semibold mb-2">Stored Values:</p>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {JSON.stringify(
              {
                "demo-name": name,
                "demo-theme": theme,
                "demo-count": count,
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>

      <div className="mt-3 bg-yellow-100 p-2 rounded text-xs">
        💡 Refresh the page - values persist in localStorage!
      </div>
    </div>
  );
}

// ==========================================
// 4. USEPREVIOUS DEMO
// ==========================================
function PreviousValueDemo() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("John");
  const prevCount = usePrevious(count);
  const prevName = usePrevious(name);

  return (
    <div className="p-4 border rounded mb-4 bg-orange-50">
      <h3 className="font-bold text-lg mb-2">4. usePrevious</h3>

      <div className="bg-white p-4 rounded border">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="font-semibold text-sm mb-2">Count:</p>
            <p className="text-lg">
              Current: <span className="font-bold">{count}</span>
            </p>
            <p className="text-lg">
              Previous: <span className="font-bold">{prevCount ?? "N/A"}</span>
            </p>
            <p className="text-lg">
              Diff:{" "}
              <span className="font-bold">{count - (prevCount ?? 0)}</span>
            </p>
            <button
              onClick={() => setCount((c) => c + 1)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded w-full"
            >
              Increment
            </button>
          </div>

          <div>
            <p className="font-semibold text-sm mb-2">Name:</p>
            <p className="text-lg">
              Current: <span className="font-bold">{name}</span>
            </p>
            <p className="text-lg">
              Previous: <span className="font-bold">{prevName ?? "N/A"}</span>
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 border px-3 py-2 rounded w-full"
            />
          </div>
        </div>

        <div className="bg-gray-100 p-3 rounded">
          <p className="text-sm font-semibold mb-1">How it works:</p>
          <p className="text-xs">
            usePrevious uses useRef to store the value after each render, so you
            can compare current with previous!
          </p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. USEDEBOUNCE DEMO
// ==========================================
function DebounceDemo() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setSearchHistory((prev) => [
        { term: debouncedSearchTerm, time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 4),
      ]);
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="p-4 border rounded mb-4 bg-pink-50">
      <h3 className="font-bold text-lg mb-2">5. useDebounce</h3>

      <div className="bg-white p-4 rounded border">
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            Search (500ms debounce):
          </label>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type to search..."
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded">
            <p className="text-sm font-semibold mb-1">Immediate Value:</p>
            <p className="font-mono text-sm">{searchTerm || "(empty)"}</p>
            <p className="text-xs text-gray-600 mt-1">
              Updates on every keystroke
            </p>
          </div>

          <div className="bg-green-50 p-3 rounded">
            <p className="text-sm font-semibold mb-1">Debounced Value:</p>
            <p className="font-mono text-sm">
              {debouncedSearchTerm || "(empty)"}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Updates after 500ms pause
            </p>
          </div>
        </div>

        {searchHistory.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold mb-2">
              Search History (API calls):
            </p>
            <div className="space-y-1">
              {searchHistory.map((entry, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm bg-gray-100 px-3 py-2 rounded"
                >
                  <span className="font-mono">{entry.term}</span>
                  <span className="text-gray-600">{entry.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 bg-yellow-100 p-2 rounded text-xs">
        💡 Debouncing prevents API calls on every keystroke - only calls after
        user stops typing!
      </div>
    </div>
  );
}

// ==========================================
// 6. USEWINDOWSIZE DEMO
// ==========================================
function WindowSizeDemo() {
  const { width, height } = useWindowSize();

  return (
    <div className="p-4 border rounded mb-4 bg-indigo-50">
      <h3 className="font-bold text-lg mb-2">6. useWindowSize</h3>

      <div className="bg-white p-4 rounded border">
        <div className="text-center mb-4">
          <p className="text-4xl font-bold mb-2">
            {width} × {height}
          </p>
          <p className="text-sm text-gray-600">Window dimensions (px)</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-100 p-3 rounded text-center">
            <p className="text-2xl font-bold">{width}px</p>
            <p className="text-sm">Width</p>
          </div>
          <div className="bg-green-100 p-3 rounded text-center">
            <p className="text-2xl font-bold">{height}px</p>
            <p className="text-sm">Height</p>
          </div>
        </div>

        <div className="bg-gray-100 p-3 rounded">
          <p className="text-sm font-semibold mb-2">Responsive Breakpoints:</p>
          <div className="space-y-1 text-sm">
            <p>
              Mobile: {width < 640 ? "✅ Yes" : "❌ No"} ({"<"} 640px)
            </p>
            <p>
              Tablet: {width >= 640 && width < 1024 ? "✅ Yes" : "❌ No"}{" "}
              (640-1024px)
            </p>
            <p>
              Desktop: {width >= 1024 ? "✅ Yes" : "❌ No"} ({">"}= 1024px)
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 bg-yellow-100 p-2 rounded text-xs">
        💡 Resize your browser window to see the values update in real-time!
      </div>
    </div>
  );
}

// ==========================================
// 7. USEINTERVAL DEMO
// ==========================================
function IntervalDemo() {
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);
  const [isRunning, setIsRunning] = useState(false);

  useInterval(
    () => {
      setCount((c) => c + 1);
    },
    isRunning ? delay : null
  );

  return (
    <div className="p-4 border rounded mb-4 bg-teal-50">
      <h3 className="font-bold text-lg mb-2">7. useInterval</h3>

      <div className="bg-white p-4 rounded border">
        <div className="text-center mb-4">
          <p className="text-5xl font-bold mb-2">{count}</p>
          <p className="text-sm text-gray-600">
            Counter increments every {delay}ms
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Delay: {delay}ms
            </label>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex-1 px-4 py-2 rounded font-semibold text-white ${
                isRunning ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {isRunning ? "Stop" : "Start"}
            </button>
            <button
              onClick={() => setCount(0)}
              className="px-4 py-2 bg-gray-500 text-white rounded font-semibold"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 bg-yellow-100 p-2 rounded text-xs">
        💡 useInterval properly handles cleanup and dynamic delay changes!
      </div>
    </div>
  );
}

// ==========================================
// 8. USEFETCH DEMO
// ==========================================
function FetchDemo() {
  const [endpoint, setEndpoint] = useState("/api/users");
  const { data, loading, error } = useFetch(endpoint);

  return (
    <div className="p-4 border rounded mb-4 bg-yellow-50">
      <h3 className="font-bold text-lg mb-2">8. useFetch</h3>

      <div className="bg-white p-4 rounded border">
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            API Endpoint:
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setEndpoint("/api/users")}
              className={`px-4 py-2 rounded ${
                endpoint === "/api/users"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setEndpoint("/api/posts")}
              className={`px-4 py-2 rounded ${
                endpoint === "/api/posts"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setEndpoint("/api/products")}
              className={`px-4 py-2 rounded ${
                endpoint === "/api/products"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Products
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-sm text-gray-600">Loading...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error!</p>
            <p className="text-sm">{error.message}</p>
          </div>
        )}

        {data && !loading && (
          <div className="bg-green-100 border border-green-400 px-4 py-3 rounded">
            <p className="font-bold text-green-700">Success!</p>
            <pre className="text-xs mt-2 overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-3 bg-yellow-100 p-2 rounded text-xs">
        💡 useFetch handles loading, error, and data states automatically!
      </div>
    </div>
  );
}

// ==========================================
// 9. COMMON MISTAKES
// ==========================================
function CommonMistakes() {
  return (
    <div className="p-4 border rounded bg-red-50">
      <h3 className="font-bold text-lg mb-2">9. Common Mistakes to Avoid</h3>

      <div className="space-y-3">
        <div className="bg-white p-3 rounded border">
          <p className="font-semibold text-red-600 text-sm mb-2">
            ❌ Mistake 1: Not starting with "use"
          </p>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {`// ❌ WRONG - ESLint won't check Hook rules
function counter() {
  const [count, setCount] = useState(0);
  return { count, setCount };
}

// ✅ CORRECT - Follows convention
function useCounter() {
  const [count, setCount] = useState(0);
  return { count, setCount };
}`}
          </pre>
        </div>

        <div className="bg-white p-3 rounded border">
          <p className="font-semibold text-red-600 text-sm mb-2">
            ❌ Mistake 2: Conditional hook calls
          </p>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {`// ❌ WRONG - Breaks Rules of Hooks
function useBadHook(shouldUse) {
  if (shouldUse) {
    const [value] = useState(0); // Conditional!
  }
  return value;
}

// ✅ CORRECT - Hook at top level
function useGoodHook(shouldUse) {
  const [value] = useState(0);
  return shouldUse ? value : null;
}`}
          </pre>
        </div>

        <div className="bg-white p-3 rounded border">
          <p className="font-semibold text-red-600 text-sm mb-2">
            ❌ Mistake 3: Thinking hooks share state
          </p>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {`// ❌ MISUNDERSTANDING
function ComponentA() {
  const { count } = useCounter(); // Independent state
}
function ComponentB() {
  const { count } = useCounter(); // Different state!
}

// ✅ To share state, use Context
const CounterContext = createContext();
function useSharedCounter() {
  return useContext(CounterContext);
}`}
          </pre>
        </div>

        <div className="bg-white p-3 rounded border">
          <p className="font-semibold text-red-600 text-sm mb-2">
            ❌ Mistake 4: Missing cleanup
          </p>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {`// ❌ WRONG - No cleanup
function useInterval(callback, delay) {
  useEffect(() => {
    setInterval(callback, delay);
    // Memory leak!
  }, [callback, delay]);
}

// ✅ CORRECT - Proper cleanup
function useInterval(callback, delay) {
  useEffect(() => {
    const id = setInterval(callback, delay);
    return () => clearInterval(id);
  }, [callback, delay]);
}`}
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
        Custom Hooks - Interview Master Guide
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Extracting and reusing stateful logic
      </p>

      <BasicCustomHookDemo />
      <IndependentStateDemo />
      <LocalStorageDemo />
      <PreviousValueDemo />
      <DebounceDemo />
      <WindowSizeDemo />
      <IntervalDemo />
      <FetchDemo />
      <CommonMistakes />

      <div className="mt-6 p-4 bg-white border-2 border-gray-300 rounded">
        <h3 className="font-bold mb-2">🎯 Custom Hooks Interview Checklist:</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>✅ Custom hooks are functions that use React hooks</li>
          <li>✅ MUST start with "use" prefix (convention + tooling)</li>
          <li>✅ Share logic, NOT state (each usage is independent)</li>
          <li>✅ Follow all Rules of Hooks (top level, same order)</li>
          <li>✅ Can use other hooks inside (built-in or custom)</li>
          <li>✅ Extract when logic is duplicated (2-3 components)</li>
          <li>✅ Return arrays for 2-3 values, objects for 4+</li>
          <li>✅ Test with @testing-library/react-hooks</li>
          <li>❌ Don't create for single-use logic</li>
          <li>❌ Don't forget cleanup in effects</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded border-2 border-blue-300">
        <h3 className="font-bold mb-2">🔑 Common Custom Hook Patterns:</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-blue-700 mb-2">
              State Management:
            </p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>useToggle - Boolean state</li>
              <li>useCounter - Numeric state</li>
              <li>useArray - Array operations</li>
              <li>useLocalStorage - Persistent state</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-purple-700 mb-2">Side Effects:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>useFetch - Data fetching</li>
              <li>useDebounce - Delay updates</li>
              <li>useInterval - Timed effects</li>
              <li>useEventListener - DOM events</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-yellow-100 rounded border-2 border-yellow-300">
        <h3 className="font-bold mb-2">⚡ When to Create Custom Hooks:</h3>
        <div className="text-sm space-y-1">
          <p>
            ✅ <strong>DO create when:</strong> Logic is duplicated across 2-3+
            components
          </p>
          <p>
            ✅ <strong>DO create when:</strong> Complex stateful logic needs
            encapsulation
          </p>
          <p>
            ✅ <strong>DO create when:</strong> Want to compose multiple hooks
            together
          </p>
          <p>
            ❌ <strong>DON'T create when:</strong> Logic is used in only one
            place
          </p>
          <p>
            ❌ <strong>DON'T create when:</strong> It's just a regular function
            (no hooks used)
          </p>
          <p>
            ❌ <strong>DON'T create when:</strong> Would hide too much
            complexity
          </p>
        </div>
      </div>
    </div>
  );
}
