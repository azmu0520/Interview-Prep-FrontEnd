import React, { useState, memo, useMemo, useCallback, useRef } from "react";

// ==========================================
// HELPER: Render counter component
// ==========================================
function RenderCounter({ label }) {
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div className="text-xs text-gray-600">
      {label} renders: {renderCount.current}
    </div>
  );
}

// ==========================================
// 1. DEFAULT RE-RENDER BEHAVIOR
// ==========================================
function ChildWithoutMemo({ label }) {
  return (
    <div className="bg-red-100 p-3 rounded border border-red-300">
      <p className="font-semibold text-sm">{label}</p>
      <RenderCounter label="Child" />
    </div>
  );
}

const ChildWithMemo = memo(({ label }) => {
  return (
    <div className="bg-green-100 p-3 rounded border border-green-300">
      <p className="font-semibold text-sm">{label}</p>
      <RenderCounter label="Child" />
    </div>
  );
});

function DefaultBehaviorDemo() {
  const [parentCount, setParentCount] = useState(0);

  return (
    <div className="p-4 border rounded mb-4 bg-blue-50">
      <h3 className="font-bold text-lg mb-2">1. Default Re-render Behavior</h3>

      <div className="bg-white p-4 rounded border">
        <button
          onClick={() => setParentCount((c) => c + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded mb-3"
        >
          Re-render Parent: {parentCount}
        </button>
        <RenderCounter label="Parent" />

        <div className="grid grid-cols-2 gap-4 mt-3">
          <ChildWithoutMemo label="❌ Without React.memo" />
          <ChildWithMemo label="✅ With React.memo" />
        </div>
      </div>

      <div className="mt-3 bg-yellow-100 p-2 rounded text-xs">
        💡 Click "Re-render Parent" - child without memo re-renders, child with
        memo doesn't!
      </div>
    </div>
  );
}

// ==========================================
// 2. REFERENCE EQUALITY PROBLEM
// ==========================================
const ExpensiveChild = memo(({ config, onClick }) => {
  return (
    <div className="bg-white p-3 rounded border">
      <p className="text-sm mb-1">Theme: {config.theme}</p>
      <p className="text-sm mb-2">Language: {config.language}</p>
      <button
        onClick={onClick}
        className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
      >
        Click me
      </button>
      <RenderCounter label="Expensive Child" />
    </div>
  );
});

function ReferenceEqualityDemo() {
  const [count, setCount] = useState(0);

  // ❌ New object and function every render
  const configBad = { theme: "dark", language: "en" };
  const handleClickBad = () => console.log("clicked");

  // ✅ Memoized
  const configGood = useMemo(() => ({ theme: "dark", language: "en" }), []);
  const handleClickGood = useCallback(() => console.log("clicked"), []);

  return (
    <div className="p-4 border rounded mb-4 bg-green-50">
      <h3 className="font-bold text-lg mb-2">2. Reference Equality Problem</h3>

      <div className="bg-white p-4 rounded border">
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-4 py-2 bg-green-500 text-white rounded mb-3"
        >
          Re-render Parent: {count}
        </button>
        <RenderCounter label="Parent" />

        <div className="grid grid-cols-2 gap-4 mt-3">
          <div className="bg-red-50 p-3 rounded">
            <p className="font-semibold text-sm mb-2 text-red-700">
              ❌ Without memoization:
            </p>
            <ExpensiveChild config={configBad} onClick={handleClickBad} />
            <p className="text-xs text-red-700 mt-2">
              New object/function = child re-renders
            </p>
          </div>

          <div className="bg-green-50 p-3 rounded">
            <p className="font-semibold text-sm mb-2 text-green-700">
              ✅ With memoization:
            </p>
            <ExpensiveChild config={configGood} onClick={handleClickGood} />
            <p className="text-xs text-green-700 mt-2">
              Same reference = no re-render
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 bg-yellow-100 p-2 rounded text-xs">
        💡 Objects and functions need useMemo/useCallback to maintain reference
        equality!
      </div>
    </div>
  );
}

// ==========================================
// 3. CHILDREN PROPS PATTERN
// ==========================================
function ContainerWithoutChildren() {
  const [count, setCount] = useState(0);

  return (
    <div className="bg-red-50 p-3 rounded border border-red-300">
      <p className="font-semibold text-sm mb-2">❌ Without children pattern:</p>
      <button
        onClick={() => setCount((c) => c + 1)}
        className="px-3 py-1 bg-red-500 text-white rounded text-sm mb-2"
      >
        Count: {count}
      </button>
      <RenderCounter label="Container" />
      <ExpensiveContentWithoutPattern />
    </div>
  );
}

function ExpensiveContentWithoutPattern() {
  return (
    <div className="bg-white p-2 rounded mt-2">
      <p className="text-xs">Expensive Content</p>
      <RenderCounter label="Content" />
    </div>
  );
}

function ContainerWithChildren({ children }) {
  const [count, setCount] = useState(0);

  return (
    <div className="bg-green-50 p-3 rounded border border-green-300">
      <p className="font-semibold text-sm mb-2">✅ With children pattern:</p>
      <button
        onClick={() => setCount((c) => c + 1)}
        className="px-3 py-1 bg-green-500 text-white rounded text-sm mb-2"
      >
        Count: {count}
      </button>
      <RenderCounter label="Container" />
      {children}
    </div>
  );
}

function ExpensiveContentWithPattern() {
  return (
    <div className="bg-white p-2 rounded mt-2">
      <p className="text-xs">Expensive Content</p>
      <RenderCounter label="Content" />
    </div>
  );
}

function ChildrenPropsDemo() {
  return (
    <div className="p-4 border rounded mb-4 bg-purple-50">
      <h3 className="font-bold text-lg mb-2">3. Children Props Pattern</h3>

      <div className="bg-white p-4 rounded border">
        <div className="grid grid-cols-2 gap-4">
          <ContainerWithoutChildren />

          <ContainerWithChildren>
            <ExpensiveContentWithPattern />
          </ContainerWithChildren>
        </div>
      </div>

      <div className="mt-3 bg-yellow-100 p-2 rounded text-xs">
        💡 Click both buttons - left content re-renders, right content doesn't!
      </div>
    </div>
  );
}

// ==========================================
// 4. STATE COLOCATION
// ==========================================
function StateColocationDemo() {
  const [example, setExample] = useState("bad");

  return (
    <div className="p-4 border rounded mb-4 bg-orange-50">
      <h3 className="font-bold text-lg mb-2">4. State Colocation</h3>

      <div className="bg-white p-4 rounded border">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setExample("bad")}
            className={`px-4 py-2 rounded ${
              example === "bad" ? "bg-red-500 text-white" : "bg-gray-200"
            }`}
          >
            ❌ State Too High
          </button>
          <button
            onClick={() => setExample("good")}
            className={`px-4 py-2 rounded ${
              example === "good" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            ✅ State Colocated
          </button>
        </div>

        {example === "bad" && <BadColocation />}
        {example === "good" && <GoodColocation />}
      </div>

      <div className="mt-3 bg-yellow-100 p-2 rounded text-xs">
        💡 Toggle menu in each example - watch which components re-render!
      </div>
    </div>
  );
}

function BadColocation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="space-y-3">
      <div className="bg-red-50 p-3 rounded border border-red-300">
        <p className="font-semibold text-sm mb-2">Parent (has menu state)</p>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm"
        >
          Toggle Menu: {menuOpen ? "Open" : "Closed"}
        </button>
        <RenderCounter label="Parent" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-100 p-2 rounded">
          <p className="text-xs font-semibold">Sidebar</p>
          <RenderCounter label="Component" />
        </div>
        <div className="bg-gray-100 p-2 rounded">
          <p className="text-xs font-semibold">Content</p>
          <RenderCounter label="Component" />
        </div>
        <div className="bg-gray-100 p-2 rounded">
          <p className="text-xs font-semibold">Footer</p>
          <RenderCounter label="Component" />
        </div>
      </div>

      <p className="text-xs text-red-600">
        All children re-render when menu toggles! 😢
      </p>
    </div>
  );
}

function GoodColocation() {
  return (
    <div className="space-y-3">
      <div className="bg-green-50 p-3 rounded border border-green-300">
        <p className="font-semibold text-sm mb-2">Parent (no menu state)</p>
        <RenderCounter label="Parent" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <MenuComponent />
        <div className="bg-gray-100 p-2 rounded">
          <p className="text-xs font-semibold">Content</p>
          <RenderCounter label="Component" />
        </div>
        <div className="bg-gray-100 p-2 rounded">
          <p className="text-xs font-semibold">Footer</p>
          <RenderCounter label="Component" />
        </div>
      </div>

      <p className="text-xs text-green-600">
        Only Menu re-renders when state changes! 🎉
      </p>
    </div>
  );
}

function MenuComponent() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-blue-100 p-2 rounded border border-blue-300">
      <p className="text-xs font-semibold">Menu (owns state)</p>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="px-2 py-1 bg-blue-500 text-white rounded text-xs mt-1"
      >
        {menuOpen ? "Open" : "Closed"}
      </button>
      <RenderCounter label="Menu" />
    </div>
  );
}

// ==========================================
// 5. INLINE PROPS PROBLEM
// ==========================================
const DisplayComponent = memo(({ style, onClick, data }) => {
  return (
    <div className="bg-white p-3 rounded border">
      <p className="text-sm mb-2">Data: {JSON.stringify(data)}</p>
      <button
        onClick={onClick}
        style={style}
        className="px-3 py-1 rounded text-white text-sm"
      >
        Click me
      </button>
      <RenderCounter label="Display" />
    </div>
  );
});

function InlinePropsDemo() {
  const [count, setCount] = useState(0);

  // ✅ Memoized props
  const style = useMemo(() => ({ backgroundColor: "#10B981" }), []);
  const data = useMemo(() => ({ value: 42 }), []);
  const handleClick = useCallback(() => console.log("clicked"), []);

  return (
    <div className="p-4 border rounded mb-4 bg-pink-50">
      <h3 className="font-bold text-lg mb-2">5. Inline Props Problem</h3>

      <div className="bg-white p-4 rounded border">
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-4 py-2 bg-pink-500 text-white rounded mb-3"
        >
          Re-render Parent: {count}
        </button>
        <RenderCounter label="Parent" />

        <div className="grid grid-cols-2 gap-4 mt-3">
          <div className="bg-red-50 p-3 rounded">
            <p className="font-semibold text-sm mb-2 text-red-700">
              ❌ Inline props:
            </p>
            <DisplayComponent
              style={{ backgroundColor: "#10B981" }}
              data={{ value: 42 }}
              onClick={() => console.log("clicked")}
            />
            <div className="mt-2 text-xs text-red-700">
              <p>• New style object</p>
              <p>• New data object</p>
              <p>• New function</p>
              <p>→ Component re-renders!</p>
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded">
            <p className="font-semibold text-sm mb-2 text-green-700">
              ✅ Memoized props:
            </p>
            <DisplayComponent style={style} data={data} onClick={handleClick} />
            <div className="mt-2 text-xs text-green-700">
              <p>• Same style reference</p>
              <p>• Same data reference</p>
              <p>• Same function reference</p>
              <p>→ No re-render!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. CONTEXT RE-RENDERS
// ==========================================
const CountContext = React.createContext();
const ThemeContext = React.createContext();

function ContextRerendersDemo() {
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState("light");

  return (
    <div className="p-4 border rounded mb-4 bg-indigo-50">
      <h3 className="font-bold text-lg mb-2">6. Context Re-renders</h3>

      <div className="bg-white p-4 rounded border">
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setCount((c) => c + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Increment Count: {count}
          </button>
          <button
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            className="px-4 py-2 bg-purple-500 text-white rounded"
          >
            Toggle Theme: {theme}
          </button>
        </div>

        <CountContext.Provider value={count}>
          <ThemeContext.Provider value={theme}>
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded">
                <p className="font-semibold text-sm mb-1">Count Consumer:</p>
                <CountConsumer />
                <p className="text-xs text-blue-700 mt-1">
                  Re-renders when count changes
                </p>
              </div>

              <div className="bg-purple-50 p-3 rounded">
                <p className="font-semibold text-sm mb-1">Theme Consumer:</p>
                <ThemeConsumer />
                <p className="text-xs text-purple-700 mt-1">
                  Re-renders when theme changes
                </p>
              </div>

              <div className="bg-green-50 p-3 rounded">
                <p className="font-semibold text-sm mb-1">Both Consumers:</p>
                <BothConsumer />
                <p className="text-xs text-green-700 mt-1">
                  Re-renders when either changes
                </p>
              </div>
            </div>
          </ThemeContext.Provider>
        </CountContext.Provider>
      </div>

      <div className="mt-3 bg-yellow-100 p-2 rounded text-xs">
        💡 Context consumers only re-render when their specific context changes!
      </div>
    </div>
  );
}

function CountConsumer() {
  const count = React.useContext(CountContext);
  return (
    <div className="bg-white p-2 rounded">
      <p className="text-sm">Count: {count}</p>
      <RenderCounter label="Count Consumer" />
    </div>
  );
}

function ThemeConsumer() {
  const theme = React.useContext(ThemeContext);
  return (
    <div className="bg-white p-2 rounded">
      <p className="text-sm">Theme: {theme}</p>
      <RenderCounter label="Theme Consumer" />
    </div>
  );
}

function BothConsumer() {
  const count = React.useContext(CountContext);
  const theme = React.useContext(ThemeContext);
  return (
    <div className="bg-white p-2 rounded">
      <p className="text-sm">
        Count: {count}, Theme: {theme}
      </p>
      <RenderCounter label="Both Consumer" />
    </div>
  );
}

// ==========================================
// 7. OPTIMIZATION COMPARISON
// ==========================================
function OptimizationComparison() {
  const [trigger, setTrigger] = useState(0);

  return (
    <div className="p-4 border rounded bg-teal-50">
      <h3 className="font-bold text-lg mb-2">7. Optimization Comparison</h3>

      <div className="bg-white p-4 rounded border">
        <button
          onClick={() => setTrigger((t) => t + 1)}
          className="px-4 py-2 bg-teal-500 text-white rounded mb-4"
        >
          Trigger Re-render: {trigger}
        </button>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-red-50 p-3 rounded border border-red-300">
            <p className="font-semibold text-sm mb-2 text-red-700">
              ❌ No optimization:
            </p>
            <NoOptimization />
          </div>

          <div className="bg-orange-50 p-3 rounded border border-orange-300">
            <p className="font-semibold text-sm mb-2 text-orange-700">
              ⚠️ Partial optimization:
            </p>
            <PartialOptimization />
          </div>

          <div className="bg-green-50 p-3 rounded border border-green-300">
            <p className="font-semibold text-sm mb-2 text-green-700">
              ✅ Full optimization:
            </p>
            <FullOptimization />
          </div>
        </div>
      </div>

      <div className="mt-3 bg-yellow-100 p-2 rounded text-xs">
        💡 Click "Trigger Re-render" and compare render counts!
      </div>
    </div>
  );
}

function NoOptimization() {
  return (
    <div className="space-y-2">
      <UnoptimizedChild config={{ value: 1 }} />
      <UnoptimizedChild config={{ value: 2 }} />
      <UnoptimizedChild config={{ value: 3 }} />
    </div>
  );
}

function UnoptimizedChild({ config }) {
  return (
    <div className="bg-white p-2 rounded text-xs">
      Value: {config.value}
      <RenderCounter label="Child" />
    </div>
  );
}

function PartialOptimization() {
  const config1 = { value: 1 };
  const config2 = { value: 2 };
  const config3 = { value: 3 };

  return (
    <div className="space-y-2">
      <PartiallyOptimizedChild config={config1} />
      <PartiallyOptimizedChild config={config2} />
      <PartiallyOptimizedChild config={config3} />
    </div>
  );
}

const PartiallyOptimizedChild = memo(({ config }) => {
  return (
    <div className="bg-white p-2 rounded text-xs">
      Value: {config.value}
      <RenderCounter label="Child" />
    </div>
  );
});

function FullOptimization() {
  const config1 = useMemo(() => ({ value: 1 }), []);
  const config2 = useMemo(() => ({ value: 2 }), []);
  const config3 = useMemo(() => ({ value: 3 }), []);

  return (
    <div className="space-y-2">
      <FullyOptimizedChild config={config1} />
      <FullyOptimizedChild config={config2} />
      <FullyOptimizedChild config={config3} />
    </div>
  );
}

const FullyOptimizedChild = memo(({ config }) => {
  return (
    <div className="bg-white p-2 rounded text-xs">
      Value: {config.value}
      <RenderCounter label="Child" />
    </div>
  );
});

// ==========================================
// MAIN APP
// ==========================================
export default function App() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2 text-center">
        Preventing Unnecessary Re-renders
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Understanding and optimizing React rendering behavior
      </p>

      <DefaultBehaviorDemo />
      <ReferenceEqualityDemo />
      <ChildrenPropsDemo />
      <StateColocationDemo />
      <InlinePropsDemo />
      <ContextRerendersDemo />
      <OptimizationComparison />

      <div className="mt-6 p-4 bg-white border-2 border-gray-300 rounded">
        <h3 className="font-bold mb-2">🎯 Re-render Prevention Checklist:</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>✅ Use React.memo to prevent child re-renders</li>
          <li>✅ Memoize objects/arrays with useMemo</li>
          <li>✅ Memoize functions with useCallback</li>
          <li>✅ Use children props pattern for composition</li>
          <li>✅ Colocate state close to where it's used</li>
          <li>✅ Split contexts by concern</li>
          <li>✅ Avoid inline object/array/function props</li>
          <li>✅ Profile with React DevTools before optimizing</li>
          <li>❌ Don't memoize everything (overhead)</li>
          <li>❌ Don't optimize prematurely</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-gradient-to-r from-red-100 to-orange-100 rounded border-2 border-red-300">
        <h3 className="font-bold mb-2">⚠️ Common Re-render Causes:</h3>
        <div className="text-sm space-y-1">
          <p>
            🔴 <strong>State change:</strong> Component and all children
            re-render
          </p>
          <p>
            🔴 <strong>Parent re-renders:</strong> All children re-render by
            default
          </p>
          <p>
            🔴 <strong>Context changes:</strong> All consumers re-render
          </p>
          <p>
            🔴 <strong>New object/array props:</strong> Reference changes
            trigger re-renders
          </p>
          <p>
            🔴 <strong>Inline functions:</strong> New function every render
          </p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded border-2 border-green-300">
        <h3 className="font-bold mb-2">✅ Optimization Techniques:</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-green-700 mb-1">
              Component Level:
            </p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>React.memo for pure components</li>
              <li>Children props pattern</li>
              <li>State colocation</li>
              <li>Component splitting</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-blue-700 mb-1">Props Level:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>useMemo for objects/arrays</li>
              <li>useCallback for functions</li>
              <li>Avoid inline props</li>
              <li>Extract static values</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
