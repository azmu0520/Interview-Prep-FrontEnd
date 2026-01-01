import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useRef,
  memo,
} from "react";

// ==========================================
// 1. BASIC CONTEXT DEMO
// ==========================================
const BasicContext = createContext();

function BasicProvider({ children }) {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("John");

  const value = {
    count,
    setCount,
    name,
    setName,
  };

  return (
    <BasicContext.Provider value={value}>{children}</BasicContext.Provider>
  );
}

function BasicDemo() {
  return (
    <div className="p-4 border rounded mb-4 bg-blue-50">
      <h3 className="font-bold text-lg mb-2">1. Basic Context Usage</h3>

      <BasicProvider>
        <div className="space-y-3">
          <CountDisplay />
          <CountControls />
          <NameDisplay />
          <NameControls />
        </div>
      </BasicProvider>

      <div className="mt-3 bg-yellow-100 p-2 rounded text-xs">
        💡 All components access the same context without prop drilling!
      </div>
    </div>
  );
}

function CountDisplay() {
  const { count } = useContext(BasicContext);
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div className="bg-white p-3 rounded border">
      <p className="font-semibold text-sm">Count Display</p>
      <p className="text-2xl font-bold">{count}</p>
      <p className="text-xs text-gray-600">Renders: {renderCount.current}</p>
    </div>
  );
}

function CountControls() {
  const { count, setCount } = useContext(BasicContext);
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div className="bg-white p-3 rounded border">
      <p className="font-semibold text-sm mb-2">Count Controls</p>
      <div className="flex gap-2">
        <button
          onClick={() => setCount((c) => c - 1)}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm"
        >
          -
        </button>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm"
        >
          +
        </button>
      </div>
      <p className="text-xs text-gray-600 mt-1">
        Renders: {renderCount.current}
      </p>
    </div>
  );
}

function NameDisplay() {
  const { name } = useContext(BasicContext);
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div className="bg-white p-3 rounded border">
      <p className="font-semibold text-sm">Name Display</p>
      <p className="text-lg font-bold">{name}</p>
      <p className="text-xs text-gray-600">Renders: {renderCount.current}</p>
    </div>
  );
}

function NameControls() {
  const { name, setName } = useContext(BasicContext);
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div className="bg-white p-3 rounded border">
      <p className="font-semibold text-sm mb-2">Name Controls</p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-2 py-1 rounded w-full text-sm"
      />
      <p className="text-xs text-gray-600 mt-1">
        Renders: {renderCount.current}
      </p>
    </div>
  );
}

// ==========================================
// 2. RE-RENDER DEMONSTRATION
// ==========================================
const ReRenderContext = createContext();

function ReRenderProvider({ children }) {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Alice");

  // ❌ Without useMemo - new object every render
  const valueWithoutMemo = { count, setCount, name, setName };

  // ✅ With useMemo - stable reference
  const valueWithMemo = useMemo(
    () => ({ count, setCount, name, setName }),
    [count, name]
  );

  return (
    <ReRenderContext.Provider value={valueWithMemo}>
      {children}
    </ReRenderContext.Provider>
  );
}

function ReRenderDemo() {
  const [trigger, setTrigger] = useState(0);

  return (
    <div className="p-4 border rounded mb-4 bg-green-50">
      <h3 className="font-bold text-lg mb-2">2. Re-render Behavior</h3>

      <ReRenderProvider>
        <div className="space-y-3">
          <div className="bg-white p-3 rounded border">
            <p className="font-semibold text-sm mb-2">Change count:</p>
            <CountConsumer />
          </div>

          <div className="bg-white p-3 rounded border">
            <p className="font-semibold text-sm mb-2">Change name:</p>
            <NameConsumer />
          </div>

          <div className="bg-red-100 p-3 rounded border">
            <p className="font-semibold text-sm mb-2">
              ⚠️ This only uses count:
            </p>
            <CountOnlyConsumer />
            <p className="text-xs text-red-600 mt-2">
              But it re-renders when name changes too! This is Context's
              limitation.
            </p>
          </div>
        </div>
      </ReRenderProvider>

      <div className="mt-3 bg-yellow-100 p-2 rounded text-xs">
        💡 ALL consumers re-render when ANY context value changes, even if they
        only use part of it!
      </div>
    </div>
  );
}

function CountConsumer() {
  const { count, setCount } = useContext(ReRenderContext);
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div>
      <p>
        Count: <span className="font-bold">{count}</span>
      </p>
      <button
        onClick={() => setCount((c) => c + 1)}
        className="px-3 py-1 bg-blue-500 text-white rounded text-sm mt-1"
      >
        Increment
      </button>
      <p className="text-xs text-gray-600 mt-1">
        Renders: {renderCount.current}
      </p>
    </div>
  );
}

function NameConsumer() {
  const { name, setName } = useContext(ReRenderContext);
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-2 py-1 rounded w-full text-sm"
      />
      <p className="text-xs text-gray-600 mt-1">
        Renders: {renderCount.current}
      </p>
    </div>
  );
}

function CountOnlyConsumer() {
  const { count } = useContext(ReRenderContext);
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div>
      <p>
        I only care about count: <span className="font-bold">{count}</span>
      </p>
      <p className="text-xs text-gray-600 mt-1">
        Renders: {renderCount.current} (increases even when name changes!)
      </p>
    </div>
  );
}

// ==========================================
// 3. SPLIT CONTEXTS SOLUTION
// ==========================================
const CountContext = createContext();
const NameContext = createContext();

function SplitContextsProvider({ children }) {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Bob");

  const countValue = useMemo(() => ({ count, setCount }), [count]);
  const nameValue = useMemo(() => ({ name, setName }), [name]);

  return (
    <CountContext.Provider value={countValue}>
      <NameContext.Provider value={nameValue}>{children}</NameContext.Provider>
    </CountContext.Provider>
  );
}

function SplitContextsDemo() {
  return (
    <div className="p-4 border rounded mb-4 bg-purple-50">
      <h3 className="font-bold text-lg mb-2">
        3. Split Contexts (Performance Fix)
      </h3>

      <SplitContextsProvider>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded border">
            <p className="font-semibold text-sm mb-2">Count Consumer:</p>
            <SplitCountConsumer />
          </div>

          <div className="bg-white p-3 rounded border">
            <p className="font-semibold text-sm mb-2">Name Consumer:</p>
            <SplitNameConsumer />
          </div>
        </div>
      </SplitContextsProvider>

      <div className="mt-3 bg-green-100 p-2 rounded text-xs">
        ✅ Now count changes only affect count consumers, and name changes only
        affect name consumers!
      </div>
    </div>
  );
}

function SplitCountConsumer() {
  const { count, setCount } = useContext(CountContext);
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div>
      <p className="text-2xl font-bold mb-2">{count}</p>
      <button
        onClick={() => setCount((c) => c + 1)}
        className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
      >
        Increment
      </button>
      <p className="text-xs text-gray-600 mt-2">
        Renders: {renderCount.current}
      </p>
      <p className="text-xs text-green-600">
        Doesn't re-render when name changes! ✅
      </p>
    </div>
  );
}

function SplitNameConsumer() {
  const { name, setName } = useContext(NameContext);
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-2 py-1 rounded w-full text-sm mb-2"
      />
      <p className="text-xs text-gray-600">Renders: {renderCount.current}</p>
      <p className="text-xs text-green-600">
        Doesn't re-render when count changes! ✅
      </p>
    </div>
  );
}

// ==========================================
// 4. THEME CONTEXT (REAL-WORLD EXAMPLE)
// ==========================================
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

function ThemeDemo() {
  return (
    <div className="p-4 border rounded mb-4 bg-orange-50">
      <h3 className="font-bold text-lg mb-2">
        4. Theme Context (Real-World Pattern)
      </h3>

      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>

      <div className="mt-3 bg-yellow-100 p-2 rounded text-xs">
        💡 Custom hook pattern with error handling - best practice for Context!
      </div>
    </div>
  );
}

function ThemedApp() {
  const { theme } = useTheme();

  const bgColor = theme === "light" ? "bg-white" : "bg-gray-800";
  const textColor = theme === "light" ? "text-gray-900" : "text-white";

  return (
    <div
      className={`${bgColor} ${textColor} p-4 rounded border transition-colors`}
    >
      <ThemedHeader />
      <ThemedContent />
      <ThemedFooter />
    </div>
  );
}

function ThemedHeader() {
  const { theme, toggleTheme } = useTheme();
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div className="mb-4 pb-4 border-b border-gray-300">
      <div className="flex justify-between items-center">
        <h4 className="font-bold">Header</h4>
        <button
          onClick={toggleTheme}
          className={`px-3 py-1 rounded text-sm font-semibold ${
            theme === "light"
              ? "bg-gray-800 text-white"
              : "bg-white text-gray-800"
          }`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
      <p className="text-xs mt-1 opacity-60">Renders: {renderCount.current}</p>
    </div>
  );
}

function ThemedContent() {
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div className="mb-4">
      <p className="mb-2">This is some content that adapts to the theme.</p>
      <p className="text-xs opacity-60">Renders: {renderCount.current}</p>
    </div>
  );
}

function ThemedFooter() {
  const { theme } = useTheme();
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div className="pt-4 border-t border-gray-300">
      <p className="text-sm">
        Footer - Current theme: <span className="font-bold">{theme}</span>
      </p>
      <p className="text-xs opacity-60">Renders: {renderCount.current}</p>
    </div>
  );
}

// ==========================================
// 5. AUTH CONTEXT (REAL-WORLD EXAMPLE)
// ==========================================
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (username, password) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setUser({ id: 1, name: username, email: `${username}@example.com` });
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, logout }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

function AuthDemo() {
  return (
    <div className="p-4 border rounded mb-4 bg-pink-50">
      <h3 className="font-bold text-lg mb-2">
        5. Auth Context (Real-World Pattern)
      </h3>

      <AuthProvider>
        <AuthApp />
      </AuthProvider>

      <div className="mt-3 bg-yellow-100 p-2 rounded text-xs">
        💡 Common pattern: Auth state accessible throughout the app!
      </div>
    </div>
  );
}

function AuthApp() {
  const { user } = useAuth();

  return (
    <div className="bg-white p-4 rounded border">
      {user ? <Dashboard /> : <LoginForm />}
    </div>
  );
}

function LoginForm() {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h4 className="font-bold text-lg">Login</h4>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="border px-3 py-2 rounded w-full"
        required
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
        className="border px-3 py-2 rounded w-full"
        required
      />
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-2 rounded text-white font-semibold ${
          isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-bold text-lg">Dashboard</h4>
          <p className="text-sm text-gray-600">Welcome, {user.name}!</p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded font-semibold hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <UserInfo />
      <UserProfile />
    </div>
  );
}

function UserInfo() {
  const { user } = useAuth();
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div className="bg-gray-50 p-3 rounded">
      <p className="text-sm">
        <strong>Email:</strong> {user.email}
      </p>
      <p className="text-sm">
        <strong>ID:</strong> {user.id}
      </p>
      <p className="text-xs text-gray-600 mt-1">
        Renders: {renderCount.current}
      </p>
    </div>
  );
}

function UserProfile() {
  const { user } = useAuth();
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div className="bg-gray-50 p-3 rounded">
      <p className="text-sm font-semibold mb-1">Profile Settings</p>
      <p className="text-sm">Logged in as: {user.name}</p>
      <p className="text-xs text-gray-600 mt-1">
        Renders: {renderCount.current}
      </p>
    </div>
  );
}

// ==========================================
// 6. MULTIPLE CONTEXTS
// ==========================================
const MultiUserContext = createContext();
const MultiThemeContext = createContext();
const MultiLanguageContext = createContext();

function MultiContextProviders({ children }) {
  const [user, setUser] = useState({ name: "Alice" });
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");

  return (
    <MultiUserContext.Provider value={{ user, setUser }}>
      <MultiThemeContext.Provider value={{ theme, setTheme }}>
        <MultiLanguageContext.Provider value={{ language, setLanguage }}>
          {children}
        </MultiLanguageContext.Provider>
      </MultiThemeContext.Provider>
    </MultiUserContext.Provider>
  );
}

function MultiContextDemo() {
  return (
    <div className="p-4 border rounded mb-4 bg-indigo-50">
      <h3 className="font-bold text-lg mb-2">6. Multiple Contexts</h3>

      <MultiContextProviders>
        <MultiContextApp />
      </MultiContextProviders>

      <div className="mt-3 bg-yellow-100 p-2 rounded text-xs">
        💡 Components can consume multiple contexts at once!
      </div>
    </div>
  );
}

function MultiContextApp() {
  const { user, setUser } = useContext(MultiUserContext);
  const { theme, setTheme } = useContext(MultiThemeContext);
  const { language, setLanguage } = useContext(MultiLanguageContext);

  const greeting =
    language === "en" ? "Hello" : language === "es" ? "Hola" : "Bonjour";

  const bgColor = theme === "light" ? "bg-white" : "bg-gray-800";
  const textColor = theme === "light" ? "text-gray-900" : "text-white";

  return (
    <div
      className={`${bgColor} ${textColor} p-4 rounded border transition-colors`}
    >
      <h4 className="font-bold mb-3">
        {greeting}, {user.name}!
      </h4>

      <div className="space-y-2 text-sm">
        <div>
          <label className="block mb-1 font-semibold">Name:</label>
          <input
            value={user.name}
            onChange={(e) => setUser({ name: e.target.value })}
            className="border px-2 py-1 rounded w-full text-gray-900"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Theme:</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="border px-2 py-1 rounded w-full text-gray-900"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border px-2 py-1 rounded w-full text-gray-900"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 7. COMMON MISTAKES
// ==========================================
function CommonMistakes() {
  return (
    <div className="p-4 border rounded bg-red-50">
      <h3 className="font-bold text-lg mb-2">7. Common Mistakes to Avoid</h3>

      <div className="space-y-3">
        <div className="bg-white p-3 rounded border">
          <p className="font-semibold text-red-600 text-sm mb-2">
            ❌ Mistake 1: Not memoizing Provider value
          </p>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {`// ❌ WRONG - New object every render
<Context.Provider value={{ user, setUser }}>

// ✅ CORRECT - Memoized value
const value = useMemo(() => ({ user, setUser }), [user]);
<Context.Provider value={value}>`}
          </pre>
        </div>

        <div className="bg-white p-3 rounded border">
          <p className="font-semibold text-red-600 text-sm mb-2">
            ❌ Mistake 2: Using Context for frequently changing data
          </p>
          <p className="text-xs text-gray-600">
            Don't use Context for form fields, mouse position, or other
            high-frequency updates. Every change re-renders ALL consumers!
          </p>
        </div>

        <div className="bg-white p-3 rounded border">
          <p className="font-semibold text-red-600 text-sm mb-2">
            ❌ Mistake 3: Putting everything in one Context
          </p>
          <p className="text-xs text-gray-600">
            Split contexts by concern. Don't mix user, theme, settings, and
            notifications in one context - any change affects all consumers!
          </p>
        </div>

        <div className="bg-white p-3 rounded border">
          <p className="font-semibold text-red-600 text-sm mb-2">
            ❌ Mistake 4: Not using custom hooks
          </p>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {`// ❌ WRONG - Direct useContext
const context = useContext(UserContext);

// ✅ CORRECT - Custom hook with error handling
function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('Must use within Provider');
  return context;
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
        useContext - Interview Master Guide
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Sharing state across components without prop drilling
      </p>

      <BasicDemo />
      <ReRenderDemo />
      <SplitContextsDemo />
      <ThemeDemo />
      <AuthDemo />
      <MultiContextDemo />
      <CommonMistakes />

      <div className="mt-6 p-4 bg-white border-2 border-gray-300 rounded">
        <h3 className="font-bold mb-2">🎯 useContext Interview Checklist:</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>✅ useContext consumes value from nearest Provider</li>
          <li>✅ ALL consumers re-render when Provider value changes</li>
          <li>✅ Always memoize Provider value with useMemo</li>
          <li>✅ Use custom hooks for context (better DX + error handling)</li>
          <li>✅ Split contexts by concern for better performance</li>
          <li>✅ Good for: theme, auth, i18n, global UI state</li>
          <li>✅ Bad for: frequently changing data, form state</li>
          <li>✅ Context vs Props: Use Context for deep nesting (3+ levels)</li>
          <li>❌ Don't put everything in one giant context</li>
          <li>❌ Not a replacement for all state management</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded border-2 border-blue-300">
        <h3 className="font-bold mb-2">🔑 Key Patterns:</h3>
        <div className="space-y-2 text-sm">
          <div className="bg-white p-2 rounded">
            <p className="font-semibold text-blue-700">
              1. Custom Hook Pattern:
            </p>
            <code className="text-xs">
              export function useUser() {"{ return useContext(UserContext) }"}
            </code>
          </div>
          <div className="bg-white p-2 rounded">
            <p className="font-semibold text-purple-700">
              2. Provider Component:
            </p>
            <code className="text-xs">
              function UserProvider({"{ children }"}) {"{ ... }"}
            </code>
          </div>
          <div className="bg-white p-2 rounded">
            <p className="font-semibold text-green-700">3. Memoized Value:</p>
            <code className="text-xs">
              const value = useMemo(() ={">"} ({"{...}"}), [deps])
            </code>
          </div>
          <div className="bg-white p-2 rounded">
            <p className="font-semibold text-orange-700">4. Split Contexts:</p>
            <code className="text-xs">
              {
                "<AuthProvider><ThemeProvider>...</ThemeProvider></AuthProvider>"
              }
            </code>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-yellow-100 rounded border-2 border-yellow-300">
        <h3 className="font-bold mb-2">⚠️ Critical Limitations:</h3>
        <ul className="text-sm space-y-1">
          <li>
            • All consumers re-render on ANY context change (no partial
            subscriptions)
          </li>
          <li>• No built-in selector mechanism like Redux</li>
          <li>• Can cause performance issues with frequent updates</li>
          <li>• Provider nesting can get messy ("Provider hell")</li>
          <li>
            • Solution: Split contexts, use state management libraries for
            complex state
          </li>
        </ul>
      </div>
    </div>
  );
}
