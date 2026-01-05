import React, { useState, useRef, useEffect, useReducer, useContext, createContext, useMemo, useCallback, PropsWithChildren } from "react";

// ==========================================
// 1. useState - Type Inference vs Explicit
// ==========================================

interface User {
  name: string;
  email: string;
}

const UseStateDemo = () => {
  // Type inferred
  const [count, setCount] = useState(0); // number
  const [text, setText] = useState(""); // string

  // Explicit typing needed
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<string[]>([]);

  return (
    <div className="p-4 border rounded mb-4 bg-blue-50">
      <h3 className="font-bold text-lg mb-2">1. useState Typing</h3>

      <div className="space-y-2">
        <div className="p-2 bg-white rounded">
          <p className="text-sm font-semibold">Inferred Types:</p>
          <button
            onClick={() => setCount(count + 1)}
            className="px-2 py-1 bg-blue-500 text-white rounded text-sm mr-2"
          >
            Count: {count}
          </button>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type here"
            className="border px-2 py-1 rounded text-sm"
          />
        </div>

        <div className="p-2 bg-white rounded">
          <p className="text-sm font-semibold mb-1">Explicit Types:</p>
          <button
            onClick={() => setUser({ name: "John", email: "john@email.com" })}
            className="px-2 py-1 bg-green-500 text-white rounded text-sm mr-2"
          >
            Set User
          </button>
          <button
            onClick={() => setUser(null)}
            className="px-2 py-1 bg-red-500 text-white rounded text-sm mr-2"
          >
            Clear User
          </button>
          <p className="text-xs mt-1">
            User: {user ? `${user.name} (${user.email})` : "null"}
          </p>
        </div>
      </div>

      <div className="mt-2 p-2 bg-white rounded text-xs font-mono">
        <pre>{`// Inferred
const [count, setCount] = useState(0); // number

// Explicit - needed for union types
const [user, setUser] = useState<User | null>(null);`}</pre>
      </div>
    </div>
  );
};

// ==========================================
// 2. useRef - DOM vs Mutable Values
// ==========================================

const UseRefDemo = () => {
  // DOM ref - must be initialized with null
  const inputRef = useRef<HTMLInputElement>(null);
  const countDisplayRef = useRef<HTMLDivElement>(null);

  // Mutable value ref - holds a value
  const renderCountRef = useRef<number>(0);
  const timerRef = useRef<number>();

  // Track renders
  renderCountRef.current += 1;

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const startTimer = () => {
    timerRef.current = window.setTimeout(() => {
      alert("Timer finished!");
    }, 2000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="p-4 border rounded mb-4 bg-green-50">
      <h3 className="font-bold text-lg mb-2">2. useRef - Two Use Cases</h3>

      <div className="space-y-2">
        <div className="p-2 bg-white rounded">
          <p className="text-sm font-semibold mb-1">DOM Reference:</p>
          <input
            ref={inputRef}
            placeholder="Focus me with button"
            className="border px-2 py-1 rounded text-sm mr-2"
          />
          <button
            onClick={focusInput}
            className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
          >
            Focus Input
          </button>
        </div>

        <div className="p-2 bg-white rounded">
          <p className="text-sm font-semibold mb-1">Mutable Value:</p>
          <div ref={countDisplayRef} className="text-sm mb-1">
            Component rendered: {renderCountRef.current} times
          </div>
          <button
            onClick={startTimer}
            className="px-2 py-1 bg-green-500 text-white rounded text-sm mr-2"
          >
            Start Timer (2s)
          </button>
          <button
            onClick={stopTimer}
            className="px-2 py-1 bg-red-500 text-white rounded text-sm"
          >
            Stop Timer
          </button>
        </div>
      </div>

      <div className="mt-2 p-2 bg-white rounded text-xs font-mono">
        <pre>{`// DOM ref - initialized with null
const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus(); // Nullable

// Mutable value - holds value
const timerRef = useRef<number>();
timerRef.current = setTimeout(...); // Writable`}</pre>
      </div>
    </div>
  );
};

// ==========================================
// 3. useReducer - Discriminated Union Actions
// ==========================================

interface CounterState {
  count: number;
  history: string[];
}

type CounterAction =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "set"; payload: number }
  | { type: "reset" };

function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case "increment":
      return {
        count: state.count + 1,
        history: [...state.history, `+1 → ${state.count + 1}`],
      };
    case "decrement":
      return {
        count: state.count - 1,
        history: [...state.history, `-1 → ${state.count - 1}`],
      };
    case "set":
      return {
        count: action.payload,
        history: [...state.history, `Set to ${action.payload}`],
      };
    case "reset":
      return { count: 0, history: ["Reset"] };
    default:
      // Exhaustive check
      const _exhaustive: never = action;
      return state;
  }
}

const UseReducerDemo = () => {
  const [state, dispatch] = useReducer(counterReducer, {
    count: 0,
    history: ["Initialized"],
  });

  return (
    <div className="p-4 border rounded mb-4 bg-purple-50">
      <h3 className="font-bold text-lg mb-2">3. useReducer - Typed Actions</h3>

      <div className="p-2 bg-white rounded mb-2">
        <p className="text-2xl font-bold text-center mb-2">{state.count}</p>
        <div className="flex gap-2 justify-center flex-wrap">
          <button
            onClick={() => dispatch({ type: "increment" })}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm"
          >
            +1
          </button>
          <button
            onClick={() => dispatch({ type: "decrement" })}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm"
          >
            -1
          </button>
          <button
            onClick={() => dispatch({ type: "set", payload: 100 })}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
          >
            Set 100
          </button>
          <button
            onClick={() => dispatch({ type: "reset" })}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="p-2 bg-white rounded max-h-32 overflow-y-auto">
        <p className="text-xs font-semibold mb-1">History:</p>
        {state.history.slice(-5).map((entry, i) => (
          <p key={i} className="text-xs font-mono">
            {entry}
          </p>
        ))}
      </div>

      <div className="mt-2 p-2 bg-white rounded text-xs font-mono">
        <pre>{`type Action =
  | { type: "increment" }
  | { type: "set"; payload: number } // Payload typed!
  
dispatch({ type: "set", payload: 100 }); // ✓
dispatch({ type: "set" }); // ❌ Missing payload`}</pre>
      </div>
    </div>
  );
};

// ==========================================
// 4. useContext - Typed Context with Type Guard
// ==========================================

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<"light" | "dark>("light");

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const value: ThemeContextType = { theme, toggleTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function ThemedComponent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`p-3 rounded ${theme === "light" ? "bg-yellow-100" : "bg-gray-800 text-white"}`}
    >
      <p className="text-sm mb-2">Current theme: {theme}</p>
      <button
        onClick={toggleTheme}
        className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
      >
        Toggle Theme
      </button>
    </div>
  );
}

const UseContextDemo = () => {
  return (
    <div className="p-4 border rounded mb-4 bg-yellow-50">
      <h3 className="font-bold text-lg mb-2">4. useContext - Type-Safe</h3>

      <ThemeProvider>
        <ThemedComponent />
      </ThemeProvider>

      <div className="mt-2 p-2 bg-white rounded text-xs font-mono">
        <pre>{`const Context = createContext<Type | undefined>(undefined);

function useMyContext() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("Missing provider");
  return ctx; // Now guaranteed non-null!
}`}</pre>
      </div>
    </div>
  );
};

// ==========================================
// 5. useMemo and useCallback - Type Inference
// ==========================================

const UseMemoCallbackDemo = () => {
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(2);

  // useMemo - type inferred from return value
  const expensiveValue = useMemo(() => {
    console.log("Computing expensive value...");
    return count * multiplier;
  }, [count, multiplier]);
  // Type: number (inferred)

  // useCallback - type inferred from function signature
  const increment = useCallback(() => {
    setCount((c) => c + 1);
  }, []);
  // Type: () => void (inferred)

  const setToValue = useCallback((value: number) => {
    setCount(value);
  }, []);
  // Type: (value: number) => void (inferred)

  return (
    <div className="p-4 border rounded mb-4 bg-orange-50">
      <h3 className="font-bold text-lg mb-2">5. useMemo & useCallback</h3>

      <div className="p-2 bg-white rounded mb-2">
        <p className="text-sm mb-1">
          Count: {count} × Multiplier: {multiplier} = <strong>{expensiveValue}</strong>
        </p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={increment}
            className="px-2 py-1 bg-green-500 text-white rounded text-sm"
          >
            Increment
          </button>
          <button
            onClick={() => setToValue(10)}
            className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
          >
            Set to 10
          </button>
          <button
            onClick={() => setMultiplier((m) => m + 1)}
            className="px-2 py-1 bg-purple-500 text-white rounded text-sm"
          >
            +Multiplier
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Open console to see memoization
        </p>
      </div>

      <div className="p-2 bg-white rounded text-xs font-mono">
        <pre>{`// Types inferred automatically
const value = useMemo(() => compute(), [deps]);
const callback = useCallback((n: number) => {}, []);`}</pre>
      </div>
    </div>
  );
};

// ==========================================
// 6. Custom Hooks - Typed Return Values
// ==========================================

// Custom hook with tuple return
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle] as const; // 'as const' for tuple type
}

// Custom hook with object return
interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

function useCounter(initialValue = 0): UseCounterReturn {
  const [count, setCount] = useState(initialValue);

  return {
    count,
    increment: useCallback(() => setCount((c) => c + 1), []),
    decrement: useCallback(() => setCount((c) => c - 1), []),
    reset: useCallback(() => setCount(initialValue), [initialValue]),
  };
}

const CustomHooksDemo = () => {
  const [isOpen, toggleOpen] = useToggle();
  const counter = useCounter(5);

  return (
    <div className="p-4 border rounded bg-pink-50">
      <h3 className="font-bold text-lg mb-2">6. Custom Hooks</h3>

      <div className="space-y-2">
        <div className="p-2 bg-white rounded">
          <p className="text-sm font-semibold mb-1">Tuple Return (useToggle):</p>
          <button
            onClick={toggleOpen}
            className={`px-3 py-1 rounded text-sm ${isOpen ? "bg-green-500" : "bg-gray-400"} text-white`}
          >
            {isOpen ? "Open ✓" : "Closed ✗"}
          </button>
        </div>

        <div className="p-2 bg-white rounded">
          <p className="text-sm font-semibold mb-1">Object Return (useCounter):</p>
          <p className="text-xl font-bold mb-1">{counter.count}</p>
          <div className="flex gap-2">
            <button
              onClick={counter.increment}
              className="px-2 py-1 bg-green-500 text-white rounded text-sm"
            >
              +
            </button>
            <button
              onClick={counter.decrement}
              className="px-2 py-1 bg-red-500 text-white rounded text-sm"
            >
              -
            </button>
            <button
              onClick={counter.reset}
              className="px-2 py-1 bg-gray-500 text-white rounded text-sm"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="mt-2 p-2 bg-white rounded text-xs font-mono">
        <pre>{`// Tuple return - use 'as const'
return [value, toggle] as const;

// Object return - explicit type
function useCounter(): UseCounterReturn { ... }`}</pre>
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
        TypeScript + React: Hooks Typing
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Section 5.2 - Interactive Examples
      </p>

      <UseStateDemo />
      <UseRefDemo />
      <UseReducerDemo />
      <UseContextDemo />
      <UseMemoCallbackDemo />
      <CustomHooksDemo />

      <div className="mt-6 p-4 bg-white border-2 border-gray-300 rounded">
        <h3 className="font-bold mb-2">🎯 Key Takeaways:</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>✅ useState: Let TypeScript infer, except for null/undefined unions</li>
          <li>✅ useRef: null for DOM refs, value for mutable variables</li>
          <li>✅ useReducer: Discriminated unions for type-safe actions</li>
          <li>✅ useContext: Type guard in custom hook for safety</li>
          <li>✅ useMemo/useCallback: Types inferred from return/function</li>
          <li>✅ Custom hooks: 'as const' for tuples, explicit type for objects</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded">
        <p className="text-sm font-semibold mb-1">🚨 Critical Interview Point:</p>
        <p className="text-sm">
          useRef typing is THE most commonly asked question. Know the difference:
          DOM refs use null initialization (RefObject), mutable values don't (MutableRefObject).
        </p>
      </div>
    </div>
  );
}