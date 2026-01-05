import React, { useState, useMemo, memo, useCallback, useRef } from "react";

// ==========================================
// 1. BASIC REACT.MEMO DEMO
// ==========================================
const RegularChild = ({ name }) => {
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div className="p-3 bg-red-100 rounded border border-red-300">
      <p className="font-semibold">Regular Child (No memo)</p>
      <p className="text-sm">Name: {name}</p>
      <p className="text-xs text-red-600">Renders: {renderCount.current}</p>
    </div>
  );
};

const MemoizedChild = memo(({ name }) => {
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div className="p-3 bg-green-100 rounded border border-green-300">
      <p className="font-semibold">Memoized Child (With memo)</p>
      <p className="text-sm">Name: {name}</p>
      <p className="text-xs text-green-600">Renders: {renderCount.current}</p>
    </div>
  );
});

const BasicMemoDemo = () => {
  const [parentCount, setParentCount] = useState(0);
  const [childName, setChildName] = useState("John");

  return (
    <div className="p-4 border rounded mb-4 bg-blue-50">
      <h3 className="font-bold text-lg mb-3">1. Basic React.memo Behavior</h3>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setParentCount((c) => c + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Re-render Parent: {parentCount}
        </button>
        <button
          onClick={() => setChildName(childName === "John" ? "Jane" : "John")}
          className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Change Name
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <RegularChild name={childName} />
        <MemoizedChild name={childName} />
      </div>

      <p className="text-xs mt-3 text-gray-600">
        💡 Click "Re-render Parent" - Regular child re-renders, memoized
        doesn't!
      </p>
    </div>
  );
};

// ==========================================
// 2. OBJECT PROPS PROBLEM
// ==========================================
const ChildWithObject = memo(({ user }) => {
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div className="p-3 bg-purple-100 rounded border">
      <p className="text-sm">User: {user.name}</p>
      <p className="text-xs">Renders: {renderCount.current}</p>
    </div>
  );
});

const ObjectPropsDemo = () => {
  const [count, setCount] = useState(0);

  // ❌ New object every render
  const userWithout = { name: "John", age: 30 };

  // ✅ Stable reference with useMemo
  const userWith = useMemo(() => ({ name: "John", age: 30 }), []);

  return (
    <div className="p-4 border rounded mb-4 bg-purple-50">
      <h3 className="font-bold text-lg mb-3">
        2. Object Props & Referential Equality
      </h3>

      <button
        onClick={() => setCount((c) => c + 1)}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 mb-4"
      >
        Re-render Parent: {count}
      </button>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-semibold mb-2 text-red-600">
            ❌ Without useMemo:
          </p>
          <ChildWithObject user={userWithout} />
          <p className="text-xs mt-2 text-gray-600">New object every render</p>
        </div>
        <div>
          <p className="text-sm font-semibold mb-2 text-green-600">
            ✅ With useMemo:
          </p>
          <ChildWithObject user={userWith} />
          <p className="text-xs mt-2 text-gray-600">Stable reference</p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. FUNCTION PROPS PROBLEM
// ==========================================
const ChildWithFunction = memo(({ onClick, label }) => {
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div className="p-3 bg-orange-100 rounded border">
      <button
        onClick={onClick}
        className="px-3 py-1 bg-orange-500 text-white rounded text-sm"
      >
        {label}
      </button>
      <p className="text-xs mt-2">Renders: {renderCount.current}</p>
    </div>
  );
});

const FunctionPropsDemo = () => {
  const [count, setCount] = useState(0);

  // ❌ New function every render
  const handleClickWithout = () => console.log("clicked");

  // ✅ Stable function with useCallback
  const handleClickWith = useCallback(() => console.log("clicked"), []);

  return (
    <div className="p-4 border rounded mb-4 bg-orange-50">
      <h3 className="font-bold text-lg mb-3">
        3. Function Props & useCallback
      </h3>

      <button
        onClick={() => setCount((c) => c + 1)}
        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 mb-4"
      >
        Re-render Parent: {count}
      </button>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-semibold mb-2 text-red-600">
            ❌ Without useCallback:
          </p>
          <ChildWithFunction onClick={handleClickWithout} label="Click Me" />
          <p className="text-xs mt-2 text-gray-600">
            New function every render
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold mb-2 text-green-600">
            ✅ With useCallback:
          </p>
          <ChildWithFunction onClick={handleClickWith} label="Click Me" />
          <p className="text-xs mt-2 text-gray-600">
            Stable function reference
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. CUSTOM COMPARISON FUNCTION
// ==========================================
// Shallow comparison (default)
const ShallowMemoChild = memo(({ user }) => {
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div className="p-3 bg-blue-100 rounded border">
      <p className="text-sm">
        {user.name} (ID: {user.id})
      </p>
      <p className="text-xs">Renders: {renderCount.current}</p>
    </div>
  );
});

// Custom comparison - only care about ID
const CustomMemoChild = memo(
  ({ user }) => {
    const renderCount = useRef(0);
    renderCount.current++;

    return (
      <div className="p-3 bg-green-100 rounded border">
        <p className="text-sm">
          {user.name} (ID: {user.id})
        </p>
        <p className="text-xs">Renders: {renderCount.current}</p>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Return true = don't re-render
    return prevProps.user.id === nextProps.user.id;
  }
);

const CustomComparisonDemo = () => {
  const [userId, setUserId] = useState(1);
  const [userName, setUserName] = useState("John");

  // Always new object reference, but same ID
  const user = { id: userId, name: userName };

  return (
    <div className="p-4 border rounded mb-4 bg-green-50">
      <h3 className="font-bold text-lg mb-3">4. Custom Comparison Function</h3>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setUserId((id) => id + 1)}
          className="px-3 py-2 bg-blue-500 text-white rounded text-sm"
        >
          Change ID: {userId}
        </button>
        <button
          onClick={() => setUserName(userName === "John" ? "Jane" : "John")}
          className="px-3 py-2 bg-green-500 text-white rounded text-sm"
        >
          Change Name: {userName}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-semibold mb-2">Default Comparison:</p>
          <ShallowMemoChild user={user} />
          <p className="text-xs mt-2 text-red-600">
            Re-renders on any change (new object)
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold mb-2">
            Custom Comparison (ID only):
          </p>
          <CustomMemoChild user={user} />
          <p className="text-xs mt-2 text-green-600">
            Only re-renders when ID changes!
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. WHEN MEMO DOESN'T HELP
// ==========================================
const FastComponent = memo(({ text }) => {
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div className="p-2 bg-gray-100 rounded text-sm">
      <p>{text}</p>
      <p className="text-xs">Renders: {renderCount.current}</p>
    </div>
  );
});

const WhenMemoDoesntHelp = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4 border rounded mb-4 bg-yellow-50">
      <h3 className="font-bold text-lg mb-3">
        5. When React.memo Doesn't Help
      </h3>

      <button
        onClick={() => setCount((c) => c + 1)}
        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 mb-4"
      >
        Update Count: {count}
      </button>

      <div className="space-y-3">
        <div className="bg-white p-3 rounded border">
          <p className="font-semibold text-sm mb-2">
            ❌ Scenario 1: Props Always Change
          </p>
          <FastComponent text={`Current time: ${Date.now()}`} />
          <p className="text-xs text-gray-600 mt-2">
            Memo is useless - timestamp changes every render
          </p>
        </div>

        <div className="bg-white p-3 rounded border">
          <p className="font-semibold text-sm mb-2">
            ❌ Scenario 2: Fast Component
          </p>
          <FastComponent text="Simple text" />
          <p className="text-xs text-gray-600 mt-2">
            Component is too simple/fast - memo overhead not worth it
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. COMPLETE OPTIMIZATION PATTERN
// ==========================================
const ExpensiveListItem = memo(({ item, onDelete }) => {
  const renderCount = useRef(0);
  renderCount.current++;

  // Simulate expensive render
  const expensiveValue = useMemo(() => {
    let result = 0;
    for (let i = 0; i < 1000; i++) {
      result += Math.sqrt(item.value);
    }
    return result.toFixed(2);
  }, [item.value]);

  return (
    <div className="p-2 bg-white border rounded flex justify-between items-center">
      <div>
        <p className="text-sm font-medium">{item.name}</p>
        <p className="text-xs text-gray-600">Computed: {expensiveValue}</p>
        <p className="text-xs text-gray-500">Renders: {renderCount.current}</p>
      </div>
      <button
        onClick={() => onDelete(item.id)}
        className="px-2 py-1 bg-red-500 text-white rounded text-xs"
      >
        Delete
      </button>
    </div>
  );
});

const CompletePattern = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Item 1", value: 100 },
    { id: 2, name: "Item 2", value: 200 },
    { id: 3, name: "Item 3", value: 300 },
  ]);
  const [otherState, setOtherState] = useState(0);

  // Stable delete function
  const handleDelete = useCallback((id) => {
    setItems((items) => items.filter((item) => item.id !== id));
  }, []);

  return (
    <div className="p-4 border rounded bg-indigo-50">
      <h3 className="font-bold text-lg mb-3">
        6. Complete Optimization Pattern
      </h3>

      <button
        onClick={() => setOtherState((s) => s + 1)}
        className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 mb-4"
      >
        Unrelated State Change: {otherState}
      </button>

      <div className="space-y-2">
        {items.map((item) => (
          <ExpensiveListItem
            key={item.id}
            item={item}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <div className="mt-4 p-3 bg-white rounded border text-sm">
        <p className="font-semibold mb-2">✅ Optimization Stack:</p>
        <ul className="text-xs space-y-1 list-disc list-inside">
          <li>React.memo on list items</li>
          <li>useCallback for stable delete function</li>
          <li>useMemo for expensive calculations inside items</li>
          <li>Items only re-render when their data changes!</li>
        </ul>
      </div>

      <p className="text-xs mt-3 text-gray-600">
        💡 Click "Unrelated State Change" - list items don't re-render!
      </p>
    </div>
  );
};

// ==========================================
// MAIN APP
// ==========================================
export default function App() {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2 text-center">
        React.memo - Interview Master Guide
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Understanding component memoization and preventing unnecessary
        re-renders
      </p>

      <BasicMemoDemo />
      <ObjectPropsDemo />
      <FunctionPropsDemo />
      <CustomComparisonDemo />
      <WhenMemoDoesntHelp />
      <CompletePattern />

      <div className="mt-6 p-4 bg-white border-2 border-gray-300 rounded">
        <h3 className="font-bold mb-2">🎯 React.memo Interview Checklist:</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>✅ Memoizes entire component (not values)</li>
          <li>✅ Uses shallow comparison (Object.is) for props</li>
          <li>✅ Combine with useMemo for object props</li>
          <li>✅ Combine with useCallback for function props</li>
          <li>✅ Can provide custom comparison function</li>
          <li>✅ Best for expensive components with stable props</li>
          <li>✅ Has overhead - measure before using</li>
          <li>❌ Don't use for fast components</li>
          <li>❌ Don't use when props always change</li>
          <li>❌ Won't help with Context updates</li>
        </ul>
      </div>
    </div>
  );
}
