# Code Splitting - Complete Interview Guide

## 🎯 Key Concepts

### 1. Dynamic Imports & Code Splitting Concept

**What it means:**

- Code splitting divides your bundle into smaller chunks
- Chunks are loaded on-demand rather than all at once
- Reduces initial JavaScript payload sent to browser
- Improves Time to Interactive (TTI) and First Contentful Paint (FCP)

**The Problem Code Splitting Solves:**

```javascript
// ❌ WITHOUT code splitting - everything loaded upfront
import HeavyChart from "./HeavyChart";
import AdminPanel from "./AdminPanel";
import UserProfile from "./UserProfile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/charts" element={<HeavyChart />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  );
}
// User visits home page but downloads ALL route components!
// Initial bundle: 500KB+ even though they only need Home

// ✅ WITH code splitting - load on demand
const HeavyChart = lazy(() => import("./HeavyChart"));
const AdminPanel = lazy(() => import("./AdminPanel"));
const UserProfile = lazy(() => import("./UserProfile"));

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/charts"
        element={
          <Suspense fallback={<Loading />}>
            <HeavyChart />
          </Suspense>
        }
      />
    </Routes>
  );
}
// Home page: 50KB bundle, charts load only when needed!
```

---

### 2. React.lazy for Component Loading

**How React.lazy Works:**

```javascript
// React.lazy takes a function that returns a dynamic import
const Component = React.lazy(() => import("./Component"));

// When component is needed:
// 1. React calls the function
// 2. Dynamic import() returns a Promise
// 3. Promise resolves with module
// 4. React renders the component
```

**Basic Usage:**

```javascript
import React, { lazy, Suspense } from "react";

// Lazy load component
const Dashboard = lazy(() => import("./Dashboard"));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard />
      </Suspense>
    </div>
  );
}
```

**Key Rules:**

- Must use dynamic `import()` syntax
- Component must be default export
- Must wrap in `<Suspense>` boundary
- Suspense needs `fallback` prop

---

### 3. Suspense Boundary Setup

**What is Suspense:**

- Component that handles loading states
- Shows `fallback` while lazy component loads
- Can wrap multiple lazy components
- Can be nested for granular loading

**Basic Pattern:**

```javascript
function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyComponent />
    </Suspense>
  );
}
```

**Multiple Components:**

```javascript
function App() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <Header /> {/* Not lazy */}
      <LazyContent /> {/* Lazy */}
      <LazyFooter /> {/* Lazy */}
    </Suspense>
  );
}
// Shows fallback until BOTH lazy components load
```

**Nested Suspense:**

```javascript
function App() {
  return (
    <div>
      <Header />

      {/* Separate loading for main content */}
      <Suspense fallback={<MainLoading />}>
        <MainContent />
      </Suspense>

      {/* Separate loading for sidebar */}
      <Suspense fallback={<SidebarLoading />}>
        <Sidebar />
      </Suspense>
    </div>
  );
}
// Each section loads independently!
```

---

### 4. Route-based Code Splitting

**The Most Effective Pattern:**

Routes are natural split points - users can only see one route at a time!

```javascript
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy load route components
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

**Benefits:**

- Immediate reduction in initial bundle
- Users only download routes they visit
- Easy to implement
- Biggest performance win for effort

**Bundle Impact Example:**

```
Before route splitting:
main.js: 800KB (all routes)

After route splitting:
main.js: 100KB (app shell)
home.chunk.js: 50KB
dashboard.chunk.js: 200KB
admin.chunk.js: 150KB
```

---

### 5. Component-based Code Splitting

**Split Heavy Components:**

```javascript
// Heavy components that aren't always needed
const HeavyChart = lazy(() => import("./HeavyChart"));
const VideoPlayer = lazy(() => import("./VideoPlayer"));
const PDFViewer = lazy(() => import("./PDFViewer"));

function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>Show Analytics</button>

      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}
// Chart only loads when user clicks button!
```

**Modal/Dialog Splitting:**

```javascript
const UserSettingsModal = lazy(() => import("./UserSettingsModal"));

function Header() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header>
      <button onClick={() => setShowSettings(true)}>Settings</button>

      {showSettings && (
        <Suspense fallback={<ModalSkeleton />}>
          <UserSettingsModal onClose={() => setShowSettings(false)} />
        </Suspense>
      )}
    </header>
  );
}
```

**Tab Content Splitting:**

```javascript
const ProfileTab = lazy(() => import("./tabs/ProfileTab"));
const SettingsTab = lazy(() => import("./tabs/SettingsTab"));
const BillingTab = lazy(() => import("./tabs/BillingTab"));

function UserPanel() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div>
      <Tabs onChange={setActiveTab} />

      <Suspense fallback={<TabLoader />}>
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "settings" && <SettingsTab />}
        {activeTab === "billing" && <BillingTab />}
      </Suspense>
    </div>
  );
}
```

---

### 6. Bundle Size Optimization

**Webpack Chunk Naming:**

```javascript
// Name your chunks for better debugging
const Dashboard = lazy(() =>
  import(/* webpackChunkName: "dashboard" */ "./Dashboard")
);

// Generates: dashboard.chunk.js instead of 1.chunk.js
```

**Prefetching & Preloading:**

```javascript
// Prefetch - load when browser idle
const AdminPanel = lazy(() =>
  import(/* webpackPrefetch: true */ "./AdminPanel")
);

// Preload - load in parallel with parent
const CriticalComponent = lazy(() =>
  import(/* webpackPreload: true */ "./CriticalComponent")
);
```

**Bundle Analysis:**

```bash
# Install webpack-bundle-analyzer
npm install --save-dev webpack-bundle-analyzer

# Add to webpack config or use with CRA
npm run build -- --stats
npx webpack-bundle-analyzer build/bundle-stats.json
```

**What to Look For:**

- Duplicate dependencies across chunks
- Unexpectedly large chunks
- Libraries that should be in vendor bundle
- Opportunities for further splitting

---

### 7. Loading States and Error Handling

**Better Loading States:**

```javascript
// Basic loading
<Suspense fallback={<div>Loading...</div>}>
  <LazyComponent />
</Suspense>

// Better - skeleton UI
<Suspense fallback={<ComponentSkeleton />}>
  <LazyComponent />
</Suspense>

// Best - progressive enhancement
function PageWithLoader() {
  return (
    <>
      <Header /> {/* Loads immediately */}
      <Suspense fallback={<ContentSkeleton />}>
        <MainContent />
      </Suspense>
    </>
  );
}
```

**Error Handling with Error Boundaries:**

```javascript
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Failed to load component. Please refresh.</div>;
    }
    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <LazyComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

**Retry Logic:**

```javascript
function lazyWithRetry(importFunc, retries = 3) {
  return lazy(() => {
    return importFunc().catch((error) => {
      if (retries > 0) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(lazyWithRetry(importFunc, retries - 1));
          }, 1000);
        });
      }
      throw error;
    });
  });
}

const Dashboard = lazyWithRetry(() => import("./Dashboard"));
```

---

## 🎤 Top Interview Questions & Model Answers

### Q1: What is code splitting and why is it important?

**Answer:**

> "Code splitting is the practice of dividing your application bundle into smaller chunks that can be loaded on demand, rather than loading everything upfront. It's important because it significantly reduces the initial JavaScript payload users need to download, which directly improves Time to Interactive and First Contentful Paint metrics. For example, if your app has an admin panel that most users never see, code splitting ensures they don't download that code. In practice, I've seen code splitting reduce initial bundle sizes by 60-70% on larger applications. React makes this easy with React.lazy and dynamic imports, and it's especially effective when applied at route boundaries."

---

### Q2: How do you implement code splitting in React?

**Answer:**

> "React provides React.lazy for component-level code splitting. You wrap dynamic imports in lazy(), which returns a special component that can be rendered. However, you must wrap lazy components in a Suspense boundary with a fallback prop to show loading UI. The most effective approach is route-based code splitting - lazy loading each route component since users can only see one route at a time. For example, using React Router, I'd lazy load each page component and wrap my Routes in Suspense. Beyond routes, I also split heavy components like chart libraries, video players, or modals that aren't immediately needed. The key is identifying natural split points where code isn't needed on initial load."

**Code Example:**

```javascript
const Dashboard = lazy(() => import("./Dashboard"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  );
}
```

---

### Q3: What is React.lazy and how does it work?

**Answer:**

> "React.lazy is a function that enables dynamic imports for React components. It takes a function that returns a dynamic import statement, which returns a Promise that resolves to a module with a default export. When React needs to render the lazy component, it waits for the Promise to resolve, then renders the component. The component must be a default export for lazy to work. While the Promise is pending, React looks up the component tree for the nearest Suspense boundary and shows its fallback UI. This happens automatically - you just wrap the lazy component in Suspense and React handles the loading state."

---

### Q4: What is Suspense and how do you use it with lazy loading?

**Answer:**

> "Suspense is a React component that handles loading states for its children. When a child component suspends - like when a lazy component is loading - Suspense shows the fallback UI specified in its fallback prop. You must wrap every lazy component in a Suspense boundary, though one Suspense can wrap multiple lazy components. You can also nest Suspense boundaries for more granular loading states - for example, having separate loading indicators for your main content and sidebar. The fallback can be anything - a spinner, skeleton UI, or null. In practice, I prefer skeleton UIs that match the component's layout to prevent layout shifts."

---

### Q5: Where should you apply code splitting in your application?

**Answer:**

> "The most effective place is at route boundaries - this is often called route-based splitting. Since users can only view one route at a time, this provides the biggest bundle size reduction for the least effort. Beyond routes, I split heavy components that aren't immediately needed: modals, chart libraries, rich text editors, video players, or admin-only features. I also split components behind user interactions, like tab content or collapsible sections. The key is finding natural split points where code isn't needed on initial load. However, I avoid over-splitting - creating too many tiny chunks can increase the number of network requests and hurt performance. I typically aim for chunks that are at least 20-30KB after minification."

---

### Q6: How do you handle errors when lazy loading fails?

**Answer:**

> "Lazy loading can fail due to network issues or deployment problems where chunks are deleted. I use Error Boundaries to catch these errors gracefully. An Error Boundary wraps the Suspense component and catches any errors during lazy loading, showing a fallback UI instead of crashing the app. For production apps, I also implement retry logic - if a chunk fails to load, I retry a few times with exponential backoff before showing an error. This handles transient network issues. Additionally, I use service workers or cache headers to ensure chunks remain available even after deployments, and implement proper versioning strategies to avoid users getting 404s for old chunks."

---

### Q7: What's the difference between prefetch and preload hints?

**Answer:**

> "Both are Webpack magic comments that optimize how chunks are loaded. Prefetch tells the browser to load a chunk during idle time, after the main bundle loads. It's good for chunks you expect users will need soon, like the next likely route. Preload loads chunks in parallel with the parent chunk at high priority - it's for chunks you know will be needed immediately. For example, I'd prefetch an admin panel since only some users go there, but preload a critical component that's needed on every page load. However, I use these sparingly - prefetching too much wastes bandwidth, and preloading incorrectly can delay critical resources. I only add these after measuring and confirming they improve the user experience."

---

## 🚨 Common Mistakes to Avoid

### 1. Not Wrapping Lazy Components in Suspense

```javascript
// ❌ WRONG - will crash
const Dashboard = lazy(() => import("./Dashboard"));

function App() {
  return <Dashboard />;
  // Error: Lazy component must be wrapped in Suspense!
}

// ✅ CORRECT
function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  );
}
```

### 2. Not Using Default Exports

```javascript
// ❌ WRONG - named export doesn't work
// Dashboard.js
export const Dashboard = () => <div>Dashboard</div>;

// App.js
const Dashboard = lazy(() => import("./Dashboard"));
// This will fail!

// ✅ CORRECT - default export
// Dashboard.js
export default function Dashboard() {
  return <div>Dashboard</div>;
}
```

### 3. Over-splitting (Too Many Small Chunks)

```javascript
// ❌ BAD - too granular
const Button = lazy(() => import("./Button"));
const Icon = lazy(() => import("./Icon"));
const Text = lazy(() => import("./Text"));

// These components are too small, overhead > benefit
// Creates many network requests for tiny chunks

// ✅ BETTER - split at meaningful boundaries
const SettingsPanel = lazy(() => import("./SettingsPanel"));
// Panel contains Button, Icon, Text together
```

### 4. No Error Handling

```javascript
// ❌ RISKY - no error handling
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
// If chunk fails to load, app crashes

// ✅ SAFER - with error boundary
<ErrorBoundary fallback={<ErrorMessage />}>
  <Suspense fallback={<Loading />}>
    <LazyComponent />
  </Suspense>
</ErrorBoundary>
```

### 5. Splitting Non-Default Exports

```javascript
// ❌ WRONG - trying to lazy load named export
const Dashboard = lazy(() =>
  import("./Dashboard").then((module) => ({ default: module.Dashboard }))
);
// Verbose and error-prone

// ✅ BETTER - just make it default export
// Dashboard.js
export default Dashboard;
```

---

## 🔑 Interview Checklist

### ✅ Must Know

- [ ] What code splitting is and why it matters
- [ ] How to use React.lazy
- [ ] How Suspense works
- [ ] Route-based splitting pattern
- [ ] Default export requirement
- [ ] Basic error handling

### ✅ Should Know

- [ ] Component-based splitting strategies
- [ ] When to split vs not split
- [ ] Bundle size impact
- [ ] Prefetch vs preload
- [ ] Error boundaries with lazy loading

### ✅ Nice to Know

- [ ] Webpack chunk naming
- [ ] Bundle analysis tools
- [ ] Retry logic for failed chunks
- [ ] Service worker caching strategies
- [ ] Advanced Suspense patterns

---

## 💡 Pro Tips for Interviews

1. **Start with Routes**: Always mention route-based splitting first - it's the easiest win
2. **Know the Trade-offs**: Show you understand over-splitting can hurt performance
3. **Error Handling**: Demonstrate awareness that lazy loading can fail
4. **Metrics Matter**: Mention specific metrics like bundle size reduction
5. **Real Examples**: Have a story about bundle size improvements you've made

---

## 📚 Quick Reference

```javascript
// Basic lazy loading
const Component = lazy(() => import('./Component'));

<Suspense fallback={<Loading />}>
  <Component />
</Suspense>

// Route-based splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));

<BrowserRouter>
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </Suspense>
</BrowserRouter>

// With error boundary
<ErrorBoundary>
  <Suspense fallback={<Loading />}>
    <LazyComponent />
  </Suspense>
</ErrorBoundary>

// Conditional rendering
{showModal && (
  <Suspense fallback={<ModalSkeleton />}>
    <LazyModal />
  </Suspense>
)}

// Webpack chunk naming
const Dashboard = lazy(() =>
  import(/* webpackChunkName: "dashboard" */ './Dashboard')
);

// With prefetch
const AdminPanel = lazy(() =>
  import(/* webpackPrefetch: true */ './AdminPanel')
);
```

---

## 🎯 The Golden Rule

**"Split at route boundaries first, then split heavy components that aren't immediately needed. Avoid over-splitting and always handle loading failures gracefully."**

Ask yourself:

1. Is this used on the initial page load? → Maybe don't split
2. Is this route-specific? → Definitely split
3. Is this behind user interaction? → Consider splitting
4. Is this chunk large enough (>20-30KB)? → Worth splitting
5. Will this create too many requests? → Maybe don't split
