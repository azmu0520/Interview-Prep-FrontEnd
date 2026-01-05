import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";

// ==========================================
// 1. USEREF VS USESTATE DEMO
// ==========================================
const RefVsState = () => {
  const [stateCount, setStateCount] = useState(0);
  const refCount = useRef(0);
  const [renderCount, setRenderCount] = useState(0);

  const incrementState = () => {
    setStateCount((c) => c + 1);
  };

  const incrementRef = () => {
    refCount.current += 1;
    console.log(`Ref count is now: ${refCount.current}`);
  };

  const forceRender = () => {
    setRenderCount((c) => c + 1);
  };

  return (
    <div className="p-4 border rounded mb-4 bg-blue-50">
      <h3 className="font-bold text-lg mb-2">1. useRef vs useState</h3>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="bg-green-100 p-3 rounded">
          <p className="font-semibold text-sm mb-2">
            ✅ useState (triggers re-render)
          </p>
          <p className="text-2xl font-bold mb-2">{stateCount}</p>
          <button
            onClick={incrementState}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm"
          >
            Increment State
          </button>
          <p className="text-xs mt-2 text-gray-600">
            Component re-renders, UI updates immediately
          </p>
        </div>

        <div className="bg-orange-100 p-3 rounded">
          <p className="font-semibold text-sm mb-2">⚠️ useRef (no re-render)</p>
          <p className="text-2xl font-bold mb-2">{refCount.current}</p>
          <button
            onClick={incrementRef}
            className="px-3 py-1 bg-orange-500 text-white rounded text-sm"
          >
            Increment Ref
          </button>
          <p className="text-xs mt-2 text-gray-600">
            Value changes but UI doesn't update!
          </p>
        </div>
      </div>

      <button
        onClick={forceRender}
        className="px-4 py-2 bg-purple-500 text-white rounded text-sm"
      >
        Force Re-render (to see ref value)
      </button>

      <div className="mt-3 p-2 bg-yellow-100 rounded text-sm">
        <p className="font-semibold">Total Renders: {renderCount}</p>
        <p className="text-xs mt-1">
          💡 Click "Increment Ref" multiple times, then "Force Re-render" to see
          the accumulated value!
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 2. DOM ELEMENT REFERENCE
// ==========================================
const DOMReference = () => {
  const inputRef = useRef(null);
  const videoRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const boxRef = useRef(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const selectInput = () => {
    inputRef.current?.select();
  };

  const playVideo = () => {
    videoRef.current?.play();
  };

  const pauseVideo = () => {
    videoRef.current?.pause();
  };

  const measureBox = () => {
    if (boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect();
      setDimensions({
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      });
    }
  };

  return (
    <div className="p-4 border rounded mb-4 bg-green-50">
      <h3 className="font-bold text-lg mb-2">2. DOM Element References</h3>

      <div className="space-y-4">
        {/* Input Control */}
        <div className="bg-white p-3 rounded border">
          <p className="font-semibold text-sm mb-2">Focus & Select Input:</p>
          <input
            ref={inputRef}
            className="border px-2 py-1 rounded w-full mb-2"
            defaultValue="Try focus and select!"
          />
          <div className="flex gap-2">
            <button
              onClick={focusInput}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Focus
            </button>
            <button
              onClick={selectInput}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm"
            >
              Select Text
            </button>
          </div>
        </div>

        {/* Measure Element */}
        <div className="bg-white p-3 rounded border">
          <p className="font-semibold text-sm mb-2">Measure Element:</p>
          <div
            ref={boxRef}
            className="bg-gradient-to-r from-purple-400 to-pink-400 p-6 rounded mb-2"
          >
            Resize your browser to change dimensions!
          </div>
          <button
            onClick={measureBox}
            className="px-3 py-1 bg-purple-500 text-white rounded text-sm mb-2"
          >
            Measure
          </button>
          {dimensions.width > 0 && (
            <p className="text-sm">
              📏 Width: {dimensions.width}px, Height: {dimensions.height}px
            </p>
          )}
        </div>
      </div>

      <p className="text-xs mt-2 text-gray-600">
        💡 useRef gives you direct access to DOM elements!
      </p>
    </div>
  );
};

// ==========================================
// 3. RENDER COUNTER & PREVIOUS VALUE
// ==========================================
const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

const RenderTracking = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("John");
  const renderCount = useRef(0);
  const prevCount = usePrevious(count);
  const prevName = usePrevious(name);

  // Increment render count on every render
  renderCount.current += 1;

  return (
    <div className="p-4 border rounded mb-4 bg-purple-50">
      <h3 className="font-bold text-lg mb-2">
        3. Render Counter & Previous Values
      </h3>

      <div className="bg-white p-3 rounded border mb-3">
        <p className="font-semibold text-sm mb-2">Render Counter:</p>
        <p className="text-2xl font-bold">
          Total Renders: {renderCount.current}
        </p>
        <p className="text-xs text-gray-600 mt-1">
          This counter persists across renders without triggering re-renders!
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-blue-100 p-3 rounded">
          <p className="font-semibold text-sm mb-2">Count:</p>
          <p className="text-lg">
            Current: <span className="font-bold">{count}</span>
          </p>
          <p className="text-lg">
            Previous: <span className="font-bold">{prevCount ?? "N/A"}</span>
          </p>
          <p className="text-lg">
            Difference:{" "}
            <span className="font-bold">{count - (prevCount ?? 0)}</span>
          </p>
          <button
            onClick={() => setCount((c) => c + 1)}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm mt-2"
          >
            Increment
          </button>
        </div>

        <div className="bg-green-100 p-3 rounded">
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
            className="border px-2 py-1 rounded w-full mt-2 text-sm"
          />
        </div>
      </div>

      <div className="bg-yellow-100 p-2 rounded text-xs">
        💡 usePrevious custom hook uses useRef to store values from the previous
        render!
      </div>
    </div>
  );
};

// ==========================================
// 4. TIMER MANAGEMENT
// ==========================================
const TimerDemo = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const start = () => {
    if (intervalRef.current) return; // Already running

    startTimeRef.current = Date.now() - seconds * 1000;
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 100);
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };

  const reset = () => {
    stop();
    setSeconds(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="p-4 border rounded mb-4 bg-orange-50">
      <h3 className="font-bold text-lg mb-2">
        4. Timer Management with useRef
      </h3>

      <div className="bg-white p-6 rounded border text-center mb-3">
        <p className="text-5xl font-bold font-mono mb-4">
          {formatTime(seconds)}
        </p>

        <div className="flex gap-2 justify-center">
          <button
            onClick={start}
            disabled={isRunning}
            className={`px-4 py-2 rounded text-white font-semibold ${
              isRunning ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            Start
          </button>
          <button
            onClick={stop}
            disabled={!isRunning}
            className={`px-4 py-2 rounded text-white font-semibold ${
              !isRunning ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            Stop
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="bg-yellow-100 p-2 rounded text-sm">
        <p className="font-semibold mb-1">Why useRef for timer ID?</p>
        <ul className="text-xs space-y-1 list-disc list-inside">
          <li>Timer ID doesn't affect UI (no re-render needed)</li>
          <li>setState would cause unnecessary re-renders</li>
          <li>Ref assignment is immediate and synchronous</li>
          <li>Easy cleanup with useEffect</li>
        </ul>
      </div>
    </div>
  );
};

// ==========================================
// 5. DEBOUNCED SEARCH
// ==========================================
const DebouncedSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const timeoutRef = useRef(null);
  const searchCountRef = useRef(0);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsSearching(true);

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      // Simulate search
      searchCountRef.current += 1;
      const mockResults = value
        ? Array.from({ length: 5 }, (_, i) => `${value} - Result ${i + 1}`)
        : [];
      setResults(mockResults);
      setIsSearching(false);
    }, 500);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="p-4 border rounded mb-4 bg-pink-50">
      <h3 className="font-bold text-lg mb-2">5. Debounced Search</h3>

      <div className="bg-white p-3 rounded border mb-3">
        <input
          value={query}
          onChange={handleChange}
          placeholder="Type to search... (500ms debounce)"
          className="border px-3 py-2 rounded w-full mb-2"
        />

        <p className="text-sm text-gray-600">
          Total API calls: {searchCountRef.current}
        </p>

        {isSearching && (
          <p className="text-sm text-blue-500 mt-2">Searching...</p>
        )}

        {!isSearching && results.length > 0 && (
          <ul className="mt-2 space-y-1">
            {results.map((result, i) => (
              <li key={i} className="text-sm p-2 bg-gray-50 rounded">
                {result}
              </li>
            ))}
          </ul>
        )}

        {!isSearching && query && results.length === 0 && (
          <p className="text-sm text-gray-500 mt-2">No results</p>
        )}
      </div>

      <div className="bg-yellow-100 p-2 rounded text-xs">
        💡 useRef stores the timeout ID without causing re-renders on each
        keystroke!
      </div>
    </div>
  );
};

// ==========================================
// 6. REF FORWARDING
// ==========================================
const FancyInput = forwardRef(({ label, error, ...props }, ref) => {
  return (
    <div className="mb-3">
      {label && (
        <label className="block text-sm font-semibold mb-1">{label}</label>
      )}
      <input
        ref={ref}
        {...props}
        className={`border px-3 py-2 rounded w-full ${
          error ? "border-red-500 bg-red-50" : ""
        }`}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
});

const RefForwarding = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!emailRef.current.value) {
      newErrors.email = "Email is required";
      emailRef.current.focus();
    } else if (!emailRef.current.value.includes("@")) {
      newErrors.email = "Invalid email format";
      emailRef.current.focus();
    } else if (!passwordRef.current.value) {
      newErrors.password = "Password is required";
      passwordRef.current.focus();
    } else if (passwordRef.current.value.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      passwordRef.current.focus();
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert("Form submitted successfully!");
      emailRef.current.value = "";
      passwordRef.current.value = "";
    }
  };

  return (
    <div className="p-4 border rounded mb-4 bg-indigo-50">
      <h3 className="font-bold text-lg mb-2">6. Ref Forwarding (forwardRef)</h3>

      <div className="bg-white p-4 rounded border">
        <form onSubmit={handleSubmit}>
          <FancyInput
            ref={emailRef}
            label="Email"
            type="email"
            placeholder="your@email.com"
            error={errors.email}
          />

          <FancyInput
            ref={passwordRef}
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password}
          />

          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-500 text-white rounded font-semibold hover:bg-indigo-600"
          >
            Submit
          </button>
        </form>
      </div>

      <div className="bg-yellow-100 p-2 rounded text-xs mt-3">
        <p className="font-semibold mb-1">Why forwardRef?</p>
        <p>
          Functional components can't receive refs directly. forwardRef lets you
          pass refs through custom components to DOM elements inside them!
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 7. USEIMPERATIVEHANDLE DEMO
// ==========================================
const CustomPlayer = forwardRef((props, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  useImperativeHandle(ref, () => ({
    play: () => {
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            setIsPlaying(false);
            clearInterval(intervalRef.current);
            return 100;
          }
          return p + 1;
        });
      }, 100);
    },
    pause: () => {
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    },
    reset: () => {
      setIsPlaying(false);
      setProgress(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    },
    seek: (value) => {
      setProgress(Math.min(100, Math.max(0, value)));
    },
  }));

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-gray-800 p-4 rounded">
      <div className="bg-gray-700 h-2 rounded overflow-hidden mb-3">
        <div
          className="bg-blue-500 h-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-white text-center">
        {isPlaying ? "▶️ Playing" : "⏸️ Paused"} - {progress}%
      </p>
    </div>
  );
});

const ImperativeHandleDemo = () => {
  const playerRef = useRef(null);

  return (
    <div className="p-4 border rounded mb-4 bg-teal-50">
      <h3 className="font-bold text-lg mb-2">7. useImperativeHandle</h3>

      <div className="bg-white p-4 rounded border mb-3">
        <CustomPlayer ref={playerRef} />

        <div className="grid grid-cols-4 gap-2 mt-4">
          <button
            onClick={() => playerRef.current?.play()}
            className="px-3 py-2 bg-green-500 text-white rounded text-sm font-semibold"
          >
            Play
          </button>
          <button
            onClick={() => playerRef.current?.pause()}
            className="px-3 py-2 bg-yellow-500 text-white rounded text-sm font-semibold"
          >
            Pause
          </button>
          <button
            onClick={() => playerRef.current?.reset()}
            className="px-3 py-2 bg-red-500 text-white rounded text-sm font-semibold"
          >
            Reset
          </button>
          <button
            onClick={() => playerRef.current?.seek(50)}
            className="px-3 py-2 bg-blue-500 text-white rounded text-sm font-semibold"
          >
            Seek 50%
          </button>
        </div>
      </div>

      <div className="bg-yellow-100 p-2 rounded text-xs">
        <p className="font-semibold mb-1">useImperativeHandle:</p>
        <p>
          Customizes the ref value exposed to parent components. Lets you choose
          which methods/properties to expose instead of exposing the entire DOM
          node!
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 8. COMMON MISTAKES
// ==========================================
const CommonMistakes = () => {
  const [count, setCount] = useState(0);
  const inputRef = useRef(null);

  // ❌ This would crash on first render if uncommented
  // inputRef.current.focus(); // Don't do this!

  const mistakeDemo = () => {
    alert("Check the console for ref.current value!");
    console.log("Input ref:", inputRef.current);
  };

  return (
    <div className="p-4 border rounded bg-red-50">
      <h3 className="font-bold text-lg mb-2">8. Common Mistakes to Avoid</h3>

      <div className="space-y-3">
        <div className="bg-white p-3 rounded border">
          <p className="font-semibold text-red-600 text-sm mb-2">
            ❌ Mistake 1: Using refs for UI values
          </p>
          <p className="text-xs text-gray-600 mb-2">
            Bad: Incrementing a ref and expecting UI to update
          </p>
          <p className="text-xs text-green-600">
            Good: Use useState for values that should appear in UI
          </p>
        </div>

        <div className="bg-white p-3 rounded border">
          <p className="font-semibold text-red-600 text-sm mb-2">
            ❌ Mistake 2: Accessing ref.current during render
          </p>
          <input
            ref={inputRef}
            className="border px-2 py-1 rounded w-full mb-2"
            placeholder="This input has a ref"
          />
          <button
            onClick={mistakeDemo}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm"
          >
            Check Ref (Open Console)
          </button>
          <p className="text-xs text-gray-600 mt-2">
            ✅ Access refs in useEffect or event handlers, NOT during render!
          </p>
        </div>

        <div className="bg-white p-3 rounded border">
          <p className="font-semibold text-red-600 text-sm mb-2">
            ❌ Mistake 3: Not cleaning up timers
          </p>
          <p className="text-xs text-gray-600">
            Always clear intervals/timeouts in useEffect cleanup function!
          </p>
          <pre className="bg-gray-100 p-2 rounded text-xs mt-2 overflow-x-auto">
            {`useEffect(() => {
  return () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };
}, []);`}
          </pre>
        </div>

        <div className="bg-white p-3 rounded border">
          <p className="font-semibold text-red-600 text-sm mb-2">
            ❌ Mistake 4: Forgetting forwardRef
          </p>
          <p className="text-xs text-gray-600">
            Can't pass ref to functional component without forwardRef wrapper!
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
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2 text-center">
        useRef - Interview Master Guide
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Mutable values, DOM access, and persistent storage without re-renders
      </p>

      <RefVsState />
      <DOMReference />
      <RenderTracking />
      <TimerDemo />
      <DebouncedSearch />
      <RefForwarding />
      <ImperativeHandleDemo />
      <CommonMistakes />

      <div className="mt-6 p-4 bg-white border-2 border-gray-300 rounded">
        <h3 className="font-bold mb-2">🎯 useRef Interview Checklist:</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>✅ Returns mutable ref object with .current property</li>
          <li>✅ Doesn't trigger re-renders when .current changes</li>
          <li>✅ Persists across renders (same object returned)</li>
          <li>✅ Use for DOM access (focus, measure, animate)</li>
          <li>
            ✅ Use for mutable values (timers, subscriptions, previous values)
          </li>
          <li>
            ✅ Access refs in useEffect or event handlers, not during render
          </li>
          <li>✅ Use forwardRef to pass refs through custom components</li>
          <li>✅ Always cleanup timers/subscriptions in useEffect</li>
          <li>❌ Don't use refs for values that affect UI (use useState)</li>
          <li>❌ Don't create refs inside loops or conditions</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded border-2 border-blue-300">
        <h3 className="font-bold mb-2">🔑 Key Differences:</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-blue-700 mb-1">useState:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Triggers re-render</li>
              <li>For UI values</li>
              <li>Async updates</li>
              <li>Immutable updates</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-purple-700 mb-1">useRef:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>No re-render</li>
              <li>For non-UI values</li>
              <li>Sync updates</li>
              <li>Direct mutation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
