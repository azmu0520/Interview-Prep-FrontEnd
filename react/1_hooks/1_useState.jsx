import React, { useState, useEffect } from "react";

// ==========================================
// 1. FUNCTIONAL UPDATES - Critical Pattern
// ==========================================
const FunctionalUpdates = () => {
  const [count, setCount] = useState(0);

  // ❌ BAD: Multiple rapid updates with direct value
  const badIncrement = () => {
    setCount(count + 1);
    setCount(count + 1); // Both use same 'count' value - only increases by 1!
    setCount(count + 1);
  };

  // ✅ GOOD: Functional updates - each gets latest state
  const goodIncrement = () => {
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1); // Uses updated value - increases by 3!
    setCount((prev) => prev + 1);
  };

  return (
    <div className="p-4 border rounded mb-4 bg-blue-50">
      <h3 className="font-bold text-lg mb-2">1. Functional Updates</h3>
      <p className="mb-2">
        Count: <span className="font-bold text-xl">{count}</span>
      </p>
      <div className="flex gap-2">
        <button
          onClick={badIncrement}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          ❌ Bad (+1 only)
        </button>
        <button
          onClick={goodIncrement}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          ✅ Good (+3)
        </button>
        <button
          onClick={() => setCount(0)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
      <p className="text-sm mt-2 text-gray-600">
        💡 Click both buttons - Bad button only adds 1, Good button adds 3!
      </p>
    </div>
  );
};

// ==========================================
// 2. LAZY INITIALIZATION - Performance
// ==========================================
const LazyInitialization = () => {
  // Simulates expensive computation
  const expensiveComputation = () => {
    console.log("🔥 Expensive computation running...");
    let sum = 0;
    for (let i = 0; i < 1000000; i++) sum += i;
    return sum;
  };

  // ❌ BAD: Runs on every render (check console on re-renders)
  const [badValue] = useState(expensiveComputation());

  // ✅ GOOD: Runs only once on mount
  const [goodValue] = useState(() => expensiveComputation());

  const [rerenderTrigger, setRerenderTrigger] = useState(0);

  return (
    <div className="p-4 border rounded mb-4 bg-green-50">
      <h3 className="font-bold text-lg mb-2">2. Lazy Initialization</h3>
      <p className="mb-2">Bad Value: {badValue.toLocaleString()}</p>
      <p className="mb-2">Good Value: {goodValue.toLocaleString()}</p>
      <button
        onClick={() => setRerenderTrigger((prev) => prev + 1)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Force Re-render ({rerenderTrigger})
      </button>
      <p className="text-sm mt-2 text-gray-600">
        💡 Open console - Bad value recalculates on every re-render!
      </p>
    </div>
  );
};

// ==========================================
// 3. ASYNCHRONOUS UPDATES - Common Pitfall
// ==========================================
const AsynchronousUpdates = () => {
  const [value, setValue] = useState(0);
  const [log, setLog] = useState([]);

  const demonstrateAsync = () => {
    setValue(5);
    setLog((prev) => [...prev, `After setValue(5): value is still ${value}`]);

    // Value only updates in next render!
  };

  useEffect(() => {
    if (value === 5) {
      setLog((prev) => [...prev, `In next render: value is now ${value}`]);
    }
  }, [value]);

  return (
    <div className="p-4 border rounded mb-4 bg-yellow-50">
      <h3 className="font-bold text-lg mb-2">3. Asynchronous State Updates</h3>
      <p className="mb-2">
        Value: <span className="font-bold">{value}</span>
      </p>
      <button
        onClick={demonstrateAsync}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 mb-2"
      >
        Update & Log
      </button>
      <button
        onClick={() => {
          setValue(0);
          setLog([]);
        }}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 ml-2 mb-2"
      >
        Reset
      </button>
      <div className="bg-white p-2 rounded border">
        <p className="font-semibold mb-1">Console Log:</p>
        {log.map((entry, i) => (
          <p key={i} className="text-sm font-mono">
            {entry}
          </p>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 4. IMMUTABLE UPDATES - Objects & Arrays
// ==========================================
const ImmutableUpdates = () => {
  const [user, setUser] = useState({
    name: "John",
    age: 25,
    address: { city: "NYC" },
  });
  const [items, setItems] = useState(["Apple", "Banana"]);

  // ✅ Update nested object immutably
  const updateCity = () => {
    setUser((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        city: "LA",
      },
    }));
  };

  // ✅ Array operations immutably
  const addItem = () => setItems((prev) => [...prev, "Orange"]);
  const removeFirst = () => setItems((prev) => prev.slice(1));
  const updateSecond = () =>
    setItems((prev) => prev.map((item, i) => (i === 1 ? "Cherry" : item)));

  return (
    <div className="p-4 border rounded mb-4 bg-purple-50">
      <h3 className="font-bold text-lg mb-2">4. Immutable Updates</h3>

      <div className="mb-3">
        <p className="font-semibold">Object (Nested):</p>
        <p className="text-sm">
          Name: {user.name}, Age: {user.age}, City: {user.address.city}
        </p>
        <button
          onClick={updateCity}
          className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm mt-1"
        >
          Change City to LA
        </button>
      </div>

      <div>
        <p className="font-semibold">Array Operations:</p>
        <p className="text-sm mb-1">Items: {items.join(", ")}</p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={addItem}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          >
            Add Orange
          </button>
          <button
            onClick={removeFirst}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Remove First
          </button>
          <button
            onClick={updateSecond}
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
          >
            Update 2nd → Cherry
          </button>
          <button
            onClick={() => setItems(["Apple", "Banana"])}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. MULTIPLE STATE vs SINGLE OBJECT
// ==========================================
const StateStructure = () => {
  // Multiple independent states - GOOD when independent
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Single object - GOOD when states are related
  const [form, setForm] = useState({ username: "", bio: "" });

  return (
    <div className="p-4 border rounded mb-4 bg-pink-50">
      <h3 className="font-bold text-lg mb-2">5. State Structure Patterns</h3>

      <div className="mb-3">
        <p className="font-semibold text-sm mb-1">
          ✅ Multiple States (Independent):
        </p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-2 py-1 rounded mr-2 text-sm"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-2 py-1 rounded text-sm"
        />
      </div>

      <div>
        <p className="font-semibold text-sm mb-1">
          ✅ Single Object (Related Data):
        </p>
        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, username: e.target.value }))
          }
          className="border px-2 py-1 rounded mr-2 text-sm"
        />
        <input
          placeholder="Bio"
          value={form.bio}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, bio: e.target.value }))
          }
          className="border px-2 py-1 rounded text-sm"
        />
      </div>
      <p className="text-sm mt-2 text-gray-600">
        💡 Use multiple states for independent data, single object for related
        data
      </p>
    </div>
  );
};

// ==========================================
// 6. AUTOMATIC BATCHING (React 18)
// ==========================================
const AutomaticBatching = () => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [renders, setRenders] = useState(0);

  useEffect(() => {
    setRenders((prev) => prev + 1);
  });

  const handleClick = () => {
    // React 18: All these updates batched = 1 re-render
    setCount1((prev) => prev + 1);
    setCount2((prev) => prev + 1);
  };

  const handleAsync = () => {
    // React 18: Even in promises/timeouts - still batched!
    setTimeout(() => {
      setCount1((prev) => prev + 1);
      setCount2((prev) => prev + 1);
    }, 100);
  };

  return (
    <div className="p-4 border rounded bg-orange-50">
      <h3 className="font-bold text-lg mb-2">
        6. Automatic Batching (React 18)
      </h3>
      <p className="mb-2">
        Count 1: {count1} | Count 2: {count2}
      </p>
      <p className="mb-2 text-sm font-semibold">Total Renders: {renders}</p>
      <div className="flex gap-2">
        <button
          onClick={handleClick}
          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
        >
          Update Both (Sync)
        </button>
        <button
          onClick={handleAsync}
          className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
        >
          Update Both (Async)
        </button>
      </div>
      <p className="text-sm mt-2 text-gray-600">
        💡 Both buttons cause only 1 re-render despite 2 setState calls!
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
        useState - Interview Master Guide
      </h1>
      <p className="text-center text-gray-600 mb-6">
        All critical patterns and pitfalls in one demo
      </p>

      <FunctionalUpdates />
      <LazyInitialization />
      <AsynchronousUpdates />
      <ImmutableUpdates />
      <StateStructure />
      <AutomaticBatching />

      <div className="mt-6 p-4 bg-white border-2 border-gray-300 rounded">
        <h3 className="font-bold mb-2">🎯 Interview Checklist:</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>
            ✅ Always use functional updates when new state depends on old
          </li>
          <li>✅ Use lazy initialization for expensive initial state</li>
          <li>✅ Remember state updates are async - batched for performance</li>
          <li>✅ Always update objects/arrays immutably (spread operator)</li>
          <li>
            ✅ Split state logically - multiple for independent, object for
            related
          </li>
          <li>✅ React 18 batches ALL updates automatically (even async)</li>
        </ul>
      </div>
    </div>
  );
}
