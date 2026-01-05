# useContext - Complete Interview Guide

## 🎯 Key Concepts

### 1. What is useContext?

**Core Understanding:**

- `useContext` is a hook that lets you **consume context** in functional components
- It subscribes to the **nearest Provider** up the component tree
- Context provides a way to **pass data through the component tree** without prop drilling
- When context value changes, **all consumers re-render**

**The Problem Context Solves:**

```javascript
// ❌ WITHOUT Context - Prop Drilling Hell
function App() {
  const [user, setUser] = useState({ name: "John", theme: "dark" });

  return <Layout user={user} setUser={setUser} />;
}

function Layout({ user, setUser }) {
  return <Header user={user} setUser={setUser} />;
}

function Header({ user, setUser }) {
  return <UserMenu user={user} setUser={setUser} />;
}

function UserMenu({ user, setUser }) {
  return <div>{user.name}</div>; // Finally used here!
}

// ✅ WITH Context - Clean and Direct
const UserContext = createContext();

function App() {
  const [user, setUser] = useState({ name: "John", theme: "dark" });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Layout />
    </UserContext.Provider>
  );
}

function Layout() {
  return <Header />; // No props!
}

function Header() {
  return <UserMenu />; // No props!
}

function UserMenu() {
  const { user } = useContext(UserContext); // Direct access!
  return <div>{user.name}</div>;
}
```

---

### 2. Creating Context

**Basic Pattern:**

```javascript
import { createContext } from "react";

// Create context with default value
const ThemeContext = createContext("light");

// Default value is used ONLY when there's no Provider
// In practice, you usually don't want to rely on defaults
const UserContext = createContext(undefined);
```

**Context with TypeScript:**

```javascript
interface User {
  id: string;
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const UserContext = (createContext < UserContextType) | (undefined > undefined);
```

**Best Practice - Separate File:**

```javascript
// contexts/ThemeContext.js
import { createContext, useState, useContext } from "react";

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  const value = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// Custom hook for easier usage
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
```

---

### 3. Provider Component

**Basic Provider Setup:**

```javascript
function App() {
  const [user, setUser] = useState(null);

  // Value is what gets passed to all consumers
  const value = {
    user,
    setUser,
    login: (userData) => setUser(userData),
    logout: () => setUser(null),
  };

  return (
    <UserContext.Provider value={value}>
      <Navigation />
      <MainContent />
    </UserContext.Provider>
  );
}
```

**Multiple Providers:**

```javascript
function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <LanguageProvider>
          <RouterProvider>
            <MainApp />
          </RouterProvider>
        </LanguageProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
```

**Provider with State Management:**

```javascript
function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage or API
    const loadUser = async () => {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials) => {
    const userData = await api.login(credentials);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
```

---

### 4. Consuming Context with useContext

**Basic Consumption:**

```javascript
function ProfilePage() {
  // Get the context value
  const { user, logout } = useContext(UserContext);

  if (!user) {
    return <LoginPrompt />;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

**With Custom Hook (Recommended):**

```javascript
// In context file
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}

// In component
function ProfilePage() {
  const { user, logout } = useUser(); // Cleaner!

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

**Conditional Context Access:**

```javascript
function OptionalTheme() {
  const theme = useContext(ThemeContext);

  // Theme might be undefined if not wrapped in Provider
  const backgroundColor = theme?.theme === "dark" ? "#000" : "#fff";

  return <div style={{ backgroundColor }}>Content</div>;
}
```

---

### 5. Context Updates and Re-renders

**Critical Understanding:**

```javascript
// When Provider value changes, ALL consumers re-render
function App() {
  const [user, setUser] = useState({ name: "John" });
  const [theme, setTheme] = useState("light");

  // ❌ BAD - New object every render, all consumers re-render!
  return (
    <UserContext.Provider value={{ user, setUser, theme, setTheme }}>
      <Components />
    </UserContext.Provider>
  );
}

// ✅ GOOD - Memoize value to prevent unnecessary re-renders
function App() {
  const [user, setUser] = useState({ name: "John" });
  const [theme, setTheme] = useState("light");

  const value = useMemo(
    () => ({ user, setUser, theme, setTheme }),
    [user, theme]
  );

  return (
    <UserContext.Provider value={value}>
      <Components />
    </UserContext.Provider>
  );
}
```

**Re-render Behavior:**

```javascript
const CountContext = createContext();

function CountProvider({ children }) {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("John");

  // Both count and name in same context
  const value = { count, setCount, name, setName };

  return (
    <CountContext.Provider value={value}>{children}</CountContext.Provider>
  );
}

function CountDisplay() {
  const { count } = useContext(CountContext);
  console.log("CountDisplay re-rendered"); // ⚠️ Re-renders even when name changes!
  return <div>{count}</div>;
}

function NameDisplay() {
  const { name } = useContext(CountContext);
  console.log("NameDisplay re-rendered"); // ⚠️ Re-renders even when count changes!
  return <div>{name}</div>;
}

// When setCount is called:
// - Provider value changes
// - ALL consumers re-render (CountDisplay AND NameDisplay)
// Even though NameDisplay only uses 'name'!
```

---

### 6. Multiple Contexts Usage

**Pattern 1: Nested Providers**

```javascript
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <MainApp />
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

function MainApp() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { language } = useLanguage();

  return (
    <div className={theme}>
      <p>
        {language === "en" ? "Hello" : "Hola"} {user.name}!
      </p>
    </div>
  );
}
```

**Pattern 2: Combined Provider Component**

```javascript
function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <AppProviders>
      <MainApp />
    </AppProviders>
  );
}
```

**Using Multiple Contexts:**

```javascript
function UserProfile() {
  // Consume multiple contexts
  const { user } = useAuth();
  const { theme } = useTheme();
  const { notify } = useNotification();

  const handleUpdate = async () => {
    try {
      await updateProfile(user.id);
      notify("Profile updated!", "success");
    } catch (error) {
      notify("Update failed", "error");
    }
  };

  return (
    <div className={`profile ${theme}`}>
      <h1>{user.name}</h1>
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
}
```

---

### 7. Context vs Props Drilling

**When to Use Props (Simple, Direct):**

```javascript
// ✅ GOOD - Props for direct parent-child
function UserCard() {
  const user = { name: "John", age: 30 };

  return <UserDetails user={user} />; // Just one level down
}

function UserDetails({ user }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.age} years old</p>
    </div>
  );
}
```

**When to Use Context (Deep Tree):**

```javascript
// ✅ GOOD - Context for deeply nested components
function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Sidebar>
          <Navigation>
            <MenuItem /> {/* Needs theme here */}
          </Navigation>
        </Sidebar>
        <Content>
          <Article>
            <CodeBlock /> {/* And here */}
          </Article>
        </Content>
      </Layout>
    </ThemeProvider>
  );
}

function MenuItem() {
  const { theme } = useTheme(); // Direct access!
  return <li className={theme}>Menu Item</li>;
}
```

**Props vs Context Decision Tree:**

```
Is the data used by many components?
├─ No → Use props
└─ Yes → Is it deeply nested?
    ├─ No (1-2 levels) → Use props
    └─ Yes (3+ levels) → Consider Context
        └─ Does it change frequently?
            ├─ Yes → Split contexts or use state management
            └─ No → Use Context
```

---

### 8. When to Use Context

**✅ Good Use Cases:**

1. **Theme/Styling:**

```javascript
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Used by: Header, Footer, Buttons, Cards, etc.
```

2. **Authentication:**

```javascript
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const user = await api.login(credentials);
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Used by: NavBar, Profile, ProtectedRoutes, etc.
```

3. **Localization/i18n:**

```javascript
const LanguageContext = createContext();

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  const t = (key) => translations[language][key];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Used by: All UI text throughout the app
```

4. **Global UI State:**

```javascript
const ModalContext = createContext();

function ModalProvider({ children }) {
  const [modals, setModals] = useState([]);

  const openModal = (content) => {
    setModals((prev) => [...prev, { id: Date.now(), content }]);
  };

  const closeModal = (id) => {
    setModals((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modals.map((modal) => (
        <Modal key={modal.id} {...modal} />
      ))}
    </ModalContext.Provider>
  );
}
```

**❌ Bad Use Cases (Use Something Else):**

1. **Frequently Changing Data:**

```javascript
// ❌ BAD - All consumers re-render on every change
const FormContext = createContext();

function FormProvider({ children }) {
  const [formData, setFormData] = useState({
    field1: '',
    field2: '',
    field3: '',
    // ... 20 more fields
  });

  // Every keystroke in any field re-renders ALL consumers!
}

// ✅ BETTER - Use local state or form library
function Form() {
  const [formData, setFormData] = useState({ ... });
  // Each field manages its own state
}
```

2. **Component-Specific State:**

```javascript
// ❌ BAD - This should be local state
const CounterContext = createContext();

function CounterProvider({ children }) {
  const [count, setCount] = useState(0);
  return (
    <CounterContext.Provider value={{ count, setCount }}>
      {children}
    </CounterContext.Provider>
  );
}

// ✅ BETTER - Just use useState in the component
function Counter() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}
```

3. **High-Frequency Updates:**

```javascript
// ❌ BAD - Mouse position updates many times per second
const MouseContext = createContext();

function MouseProvider({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      // This re-renders ALL consumers constantly!
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <MouseContext.Provider value={position}>{children}</MouseContext.Provider>
  );
}

// ✅ BETTER - Use refs or specialized libraries
```

---

## 🎤 Top Interview Questions & Model Answers

### Q1: How does useContext work?

**Answer:**

> "useContext is a hook that lets you consume values from a React Context. You first create a context using createContext, which returns a context object with Provider and Consumer components. You wrap your component tree with the Provider and pass a value to it. Then, any descendant component can call useContext with that context object to access the value. The key behavior is that useContext looks up the component tree to find the nearest Provider for that context - if it doesn't find one, it uses the default value passed to createContext. When the Provider's value changes, all components that called useContext for that context will re-render, even if they only use a small part of the context value. This is the main performance consideration with Context."

---

### Q2: What triggers a re-render in context consumers?

**Answer:**

> "A component that uses useContext re-renders whenever the Provider's value changes, and React determines this using shallow comparison - basically Object.is comparison on the value prop. This is important because if you pass a new object or array to the Provider on every render, all consumers will re-render, even if the contents are the same. That's why it's crucial to memoize the context value using useMemo. Another key point: ALL consumers re-render when the value changes, even if they only use a small portion of the context. For example, if you have a context with user and theme, and only theme changes, components that only use user will still re-render. This is one of Context's main limitations and why you might split contexts or use more sophisticated state management for complex scenarios."

**Code Example:**

```javascript
// ❌ This causes all consumers to re-render on every parent render
function App() {
  const [user, setUser] = useState({ name: "John" });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Components />
    </UserContext.Provider>
  );
}

// ✅ This only causes re-renders when user actually changes
function App() {
  const [user, setUser] = useState({ name: "John" });

  const value = useMemo(() => ({ user, setUser }), [user]);

  return (
    <UserContext.Provider value={value}>
      <Components />
    </UserContext.Provider>
  );
}
```

---

### Q3: When should you use Context API vs other state management solutions?

**Answer:**

> "Context is great for relatively static, global data that many components need - things like theme, authentication, localization, or global UI state like modals. It's built into React, has zero dependencies, and is perfect for avoiding prop drilling. However, Context has limitations for complex state management: first, all consumers re-render when the value changes, even if they only use part of it. Second, there's no built-in selector mechanism to prevent this. Third, it can get messy with many contexts, leading to 'provider hell'. I'd use Context for simple global state and when performance isn't critical. For complex state with frequent updates, or when you need features like time-travel debugging, middleware, or fine-grained subscriptions, I'd reach for Redux Toolkit or Zustand. For server state, I'd use React Query or SWR. The key is picking the right tool - Context is excellent for its use cases, but it's not a replacement for all state management."

---

### Q4: How do you optimize Context performance?

**Answer:**

> "There are several strategies for optimizing Context performance. First, always memoize the Provider value using useMemo to prevent unnecessary re-renders from object reference changes. Second, split contexts by concern - instead of one big context with user, theme, and settings, create separate contexts for each. This way, changing the theme doesn't re-render components that only care about the user. Third, split contexts by update frequency - put frequently changing data in one context and stable data in another. Fourth, you can combine Context with composition - pass children to a Provider wrapper component, and those children won't re-render when the context value changes unless they consume it. Fifth, for really performance-critical scenarios, you can combine Context with useMemo and React.memo to prevent re-renders of expensive child components. The nuclear option is to avoid Context for that data and use a state management library with selector capabilities like Zustand or Redux."

**Code Example:**

```javascript
// Instead of one large context:
const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [settings, setSettings] = useState({});

  // All consumers re-render on any change!
  return (
    <AppContext.Provider value={{ user, theme, settings, ... }}>
      {children}
    </AppContext.Provider>
  );
}

// Split into separate contexts:
function AppProviders({ children }) {
  return (
    <UserProvider>
      <ThemeProvider>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </ThemeProvider>
    </UserProvider>
  );
}
// Now changing theme only affects theme consumers!
```

---

### Q5: What are the differences between Context API and Redux?

**Answer:**

> "Context and Redux solve different problems, though there's some overlap. Context is built into React and is designed for passing data through the component tree without prop drilling - it's essentially dependency injection for React. Redux is a standalone state management library with a specific pattern: single store, actions, reducers, and unidirectional data flow. Key differences: Context re-renders all consumers when the value changes, while Redux has a selector mechanism for fine-grained subscriptions. Redux has middleware support for async logic, logging, and more. Redux DevTools provide time-travel debugging and state inspection. Redux has more boilerplate but also more structure and predictability. For simple apps or when you just need to avoid prop drilling, Context is perfect. For complex apps with lots of state interactions, Redux Toolkit offers better developer experience and performance. That said, many apps successfully use Context for auth and theme, then Redux for business logic, or vice versa. They're not mutually exclusive."

---

### Q6: Can you explain context composition and when to use it?

**Answer:**

> "Context composition refers to combining multiple contexts together or using contexts in creative ways to solve problems. One pattern is splitting contexts by concern, like having separate UserContext, ThemeContext, and SettingsContext instead of one big AppContext. This improves performance because changes to one context don't affect consumers of other contexts. Another pattern is context layering, where you have a base context that provides stable data and derived contexts that compute values from it. You can also use composition to prevent unnecessary re-renders - for example, wrapping a static part of your tree in a component that doesn't consume context, so it doesn't re-render when context changes. The key principle is to think about your context boundaries carefully: what logically belongs together, what changes together, and what components need what data. Good context composition can make your app more maintainable and performant."

---

### Q7: What's the default value in createContext and when is it used?

**Answer:**

> "The default value passed to createContext is used only when a component calls useContext but there's no matching Provider above it in the tree. This is actually pretty rare in practice - usually you want every useContext call to be inside a Provider. I typically pass undefined as the default and then create a custom hook that throws an error if the context is undefined, which helps catch bugs where I forgot to wrap a component in the Provider. Some developers use a meaningful default for unit testing, so tests can render components without Provider wrappers. The key thing to understand is that the default value is not a fallback when the Provider's value is undefined - if you render a Provider with value={undefined}, consumers get undefined, not the default. The default only applies when there's no Provider at all."

**Code Example:**

```javascript
// Creating context with default
const ThemeContext = createContext("light");

// This component will get 'light' if no Provider
function Component() {
  const theme = useContext(ThemeContext); // 'light' (default)
  return <div className={theme}>Content</div>;
}

// Better pattern - throw error for missing Provider
const ThemeContext = createContext(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
```

---

## 🚨 Common Mistakes to Avoid

### 1. Creating New Objects in Provider Value

```javascript
// ❌ WRONG - New object every render, all consumers re-render!
function App() {
  const [user, setUser] = useState({ name: "John" });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {/* Every App re-render creates new value object */}
      <Children />
    </UserContext.Provider>
  );
}

// ✅ CORRECT - Memoize the value
function App() {
  const [user, setUser] = useState({ name: "John" });

  const value = useMemo(() => ({ user, setUser }), [user]);

  return (
    <UserContext.Provider value={value}>
      <Children />
    </UserContext.Provider>
  );
}

// ✅ ALSO CORRECT - Extract to custom provider
function UserProvider({ children }) {
  const [user, setUser] = useState({ name: "John" });

  const value = useMemo(() => ({ user, setUser }), [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
```

### 2. Using Context for Frequently Changing Data

```javascript
// ❌ WRONG - Every keystroke re-renders all consumers
function FormProvider({ children }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    // ... many more fields
  });

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
}

function FirstNameInput() {
  const { formData, setFormData } = useContext(FormContext);
  // Re-renders on EVERY field change, not just firstName!

  return (
    <input
      value={formData.firstName}
      onChange={(e) => setFormData({
        ...formData,
        firstName: e.target.value
      })}
    />
  );
}

// ✅ BETTER - Use local state or form library
function Form() {
  const [formData, setFormData] = useState({ ... });

  return (
    <>
      <FirstNameInput
        value={formData.firstName}
        onChange={(value) => setFormData({ ...formData, firstName: value })}
      />
      <LastNameInput ... />
    </>
  );
}

// ✅ OR - Use form library like React Hook Form
```

### 3. Not Using Custom Hook for Context

```javascript
// ❌ LESS IDEAL - Direct useContext usage
function Component() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("Must be used within provider");
  }

  const { user } = context;
  // Every component has to do this check...
}

// ✅ BETTER - Custom hook with error handling
export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within UserProvider");
  }

  return context;
}

// In components - clean and safe!
function Component() {
  const { user } = useUser();
  return <div>{user.name}</div>;
}
```

### 4. Putting Too Much in One Context

```javascript
// ❌ BAD - One giant context
const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({});
  // ... and more

  // Any change to any value re-renders ALL consumers!
}

// ✅ GOOD - Split by concern
function Providers({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <NotificationProvider>
            <SettingsProvider>{children}</SettingsProvider>
          </NotificationProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
```

### 5. Forgetting Context Provider

```javascript
// ❌ WRONG - Forgot to wrap in Provider
function App() {
  return <UserProfile />; // useUser() will throw error!
}

function UserProfile() {
  const { user } = useUser(); // Error: no provider!
  return <div>{user.name}</div>;
}

// ✅ CORRECT - Always wrap in Provider
function App() {
  return (
    <UserProvider>
      <UserProfile />
    </UserProvider>
  );
}
```

---

## 🔑 Interview Checklist

### ✅ Must Know (Will definitely be asked)

- ✅ What useContext does (consumes context value)
- ✅ How to create and provide context
- ✅ When context consumers re-render
- ✅ Context vs props drilling
- ✅ When to use Context vs state management
- ✅ Basic performance optimization (useMemo value)

### ✅ Should Know (Often asked)

- ✅ Custom hook pattern for context
- ✅ Multiple contexts usage
- ✅ Context limitations
- ✅ Splitting contexts for performance
- ✅ Context composition patterns

### ✅ Nice to Know (Senior level)

- [ ] Context with TypeScript
- [ ] Advanced optimization techniques
- [ ] Context vs Redux trade-offs
- [ ] Context hell solutions
- [ ] Testing components with context

---

## 💡 Pro Tips for Interviews

1. **Emphasize performance awareness**: Show you understand re-render implications
2. **Know when NOT to use Context**: This shows maturity
3. **Custom hook pattern**: Always mention this best practice
4. **Real examples**: Have stories about using Context in projects
5. **Compare with alternatives**: Show you know the ecosystem

---

## 📚 Quick Reference

```javascript
// 1. Create Context
const ThemeContext = createContext("light");

// 2. Create Provider Component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// 3. Create Custom Hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

// 4. Wrap App
function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

// 5. Consume in Components
function Button() {
  const { theme, setTheme } = useTheme();
  return (
    <button className={theme} onClick={() => setTheme("dark")}>
      Toggle Theme
    </button>
  );
}
```

---

## 🎯 The Golden Rules

1. **"Context is for global, relatively static data"** - Not for everything
2. **"Always memoize Provider value"** - Use useMemo to prevent re-renders
3. **"Split contexts by concern"** - Don't put everything in one context
4. **"Create custom hooks for context"** - Better DX and error handling
5. **"All consumers re-render on change"** - This is the key limitation

---

## 🔗 Common Patterns

### Pattern 1: Auth Context

```javascript
const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const user = await api.login(credentials);
    setUser(user);
  };

  const logout = () => setUser(null);

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth requires AuthProvider");
  return context;
}
```

### Pattern 2: Theme Context

```javascript
const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
```

### Pattern 3: Combined Providers

```javascript
function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
```

---

**Remember:** Context is a powerful tool for avoiding prop drilling and sharing global state, but it's not a silver bullet. Use it for its intended purpose - sharing relatively static, global data - and reach for more sophisticated solutions when you need fine-grained control, complex state logic, or high-performance updates!
