import React, { useState, lazy, Suspense, useRef } from "react";

// ==========================================
// 1. BASIC LAZY LOADING DEMO
// ==========================================

// Simulate a heavy component
const HeavyComponent = () => {
  const loadTime = useRef(Date.now());

  return (
    <div className="p-4 bg-blue-100 border border-blue-300 rounded">
      <h4 className="font-semibold mb-2">Heavy Component Loaded! 🎉</h4>
      <p className="text-sm">This component was loaded dynamically</p>
      <p className="text-xs text-gray-600 mt-2">
        Loaded at: {new Date(loadTime.current).toLocaleTimeString()}
      </p>
      <div className="mt-2 p-2 bg-white rounded text-xs">
        In a real app, this might be:
        <ul className="list-disc list-inside mt-1">
          <li>Chart library (recharts, chart.js)</li>
          <li>Rich text editor</li>
          <li>PDF viewer</li>
          <li>Video player</li>
        </ul>
      </div>
    </div>
  );
};

const BasicLazyDemo = () => {
  const [showComponent, setShowComponent] = useState(false);
  const [loadStarted, setLoadStarted] = useState(false);

  return (
    <div className="p-4 border rounded mb-4 bg-blue-50">
      <h3 className="font-bold text-lg mb-3">1. Basic Lazy Loading</h3>

      <button
        onClick={() => {
          setLoadStarted(true);
          setTimeout(() => setShowComponent(true), 800); // Simulate network delay
        }}
        disabled={loadStarted}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 mb-4"
      >
        {loadStarted ? "Loading..." : "Load Heavy Component"}
      </button>

      {loadStarted && !showComponent && (
        <div className="p-4 border border-blue-300 rounded bg-white animate-pulse">
          <div className="h-4 bg-blue-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-blue-200 rounded w-1/2"></div>
        </div>
      )}

      {showComponent && <HeavyComponent />}

      <div className="mt-4 p-3 bg-white rounded border text-sm">
        <p className="font-semibold mb-1">💡 What Happened:</p>
        <ul className="text-xs space-y-1 list-disc list-inside">
          <li>Heavy component code NOT loaded on initial page load</li>
          <li>Code fetched only when button clicked</li>
          <li>Suspense showed loading fallback while fetching</li>
          <li>Reduces initial bundle size!</li>
        </ul>
      </div>
    </div>
  );
};

// ==========================================
// 2. ROUTE-BASED SPLITTING SIMULATION
// ==========================================

const HomePage = () => (
  <div className="p-4 bg-green-100 rounded border">
    <h4 className="font-semibold">🏠 Home Page</h4>
    <p className="text-sm mt-2">Lightweight landing page</p>
    <p className="text-xs text-gray-600 mt-2">Bundle: ~50KB</p>
  </div>
);

const DashboardPage = () => (
  <div className="p-4 bg-purple-100 rounded border">
    <h4 className="font-semibold">📊 Dashboard</h4>
    <p className="text-sm mt-2">Heavy dashboard with charts</p>
    <div className="mt-2 space-y-1">
      <div className="h-16 bg-purple-300 rounded"></div>
      <div className="h-16 bg-purple-300 rounded"></div>
    </div>
    <p className="text-xs text-gray-600 mt-2">
      Bundle: ~200KB (loaded on demand)
    </p>
  </div>
);

const AdminPage = () => (
  <div className="p-4 bg-red-100 rounded border">
    <h4 className="font-semibold">🔐 Admin Panel</h4>
    <p className="text-sm mt-2">Admin-only features</p>
    <p className="text-xs text-gray-600 mt-2">
      Bundle: ~150KB (loaded on demand)
    </p>
  </div>
);

const RouteBasedSplitting = () => {
  const [currentRoute, setCurrentRoute] = useState("home");
  const [loading, setLoading] = useState(false);
  const [loadedRoutes, setLoadedRoutes] = useState(["home"]);

  const handleRouteChange = (route) => {
    if (!loadedRoutes.includes(route)) {
      setLoading(true);
      setTimeout(() => {
        setCurrentRoute(route);
        setLoadedRoutes([...loadedRoutes, route]);
        setLoading(false);
      }, 600);
    } else {
      setCurrentRoute(route);
    }
  };

  return (
    <div className="p-4 border rounded mb-4 bg-purple-50">
      <h3 className="font-bold text-lg mb-3">2. Route-Based Code Splitting</h3>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => handleRouteChange("home")}
          className={`px-3 py-2 rounded text-sm ${
            currentRoute === "home"
              ? "bg-green-500 text-white"
              : "bg-white border hover:bg-gray-50"
          }`}
        >
          Home
        </button>
        <button
          onClick={() => handleRouteChange("dashboard")}
          className={`px-3 py-2 rounded text-sm ${
            currentRoute === "dashboard"
              ? "bg-purple-500 text-white"
              : "bg-white border hover:bg-gray-50"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => handleRouteChange("admin")}
          className={`px-3 py-2 rounded text-sm ${
            currentRoute === "admin"
              ? "bg-red-500 text-white"
              : "bg-white border hover:bg-gray-50"
          }`}
        >
          Admin
        </button>
      </div>

      {loading ? (
        <div className="p-8 border rounded bg-white text-center">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading route...</p>
        </div>
      ) : (
        <>
          {currentRoute === "home" && <HomePage />}
          {currentRoute === "dashboard" && <DashboardPage />}
          {currentRoute === "admin" && <AdminPage />}
        </>
      )}

      <div className="mt-4 p-3 bg-white rounded border text-sm">
        <p className="font-semibold mb-2">📦 Loaded Chunks:</p>
        <div className="flex gap-2 flex-wrap">
          {loadedRoutes.map((route) => (
            <span
              key={route}
              className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
            >
              {route}.chunk.js
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Only routes you visit get loaded!
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 3. MODAL/DIALOG SPLITTING
// ==========================================

const HeavyModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h4 className="font-semibold text-lg mb-3">Settings Modal</h4>
      <p className="text-sm mb-4">
        This modal contains heavy form libraries and validation logic
      </p>
      <div className="space-y-2 mb-4">
        <div className="h-8 bg-gray-200 rounded"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
      <button
        onClick={onClose}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Close
      </button>
      <p className="text-xs text-gray-500 mt-3">
        Bundle: ~80KB (only loaded when modal opens)
      </p>
    </div>
  </div>
);

const ModalSplitting = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalLoaded, setModalLoaded] = useState(false);

  const handleOpenModal = () => {
    if (!modalLoaded) {
      setLoading(true);
      setTimeout(() => {
        setModalLoaded(true);
        setShowModal(true);
        setLoading(false);
      }, 500);
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="p-4 border rounded mb-4 bg-orange-50">
      <h3 className="font-bold text-lg mb-3">3. Modal/Dialog Splitting</h3>

      <button
        onClick={handleOpenModal}
        disabled={loading}
        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-400"
      >
        {loading ? "Loading Modal..." : "Open Settings"}
      </button>

      {showModal && <HeavyModal onClose={() => setShowModal(false)} />}

      <div className="mt-4 p-3 bg-white rounded border text-sm">
        <p className="font-semibold mb-2">💡 Why Split Modals:</p>
        <ul className="text-xs space-y-1 list-disc list-inside">
          <li>Modals often contain heavy form libraries</li>
          <li>Users may never open them</li>
          <li>Perfect candidate for lazy loading</li>
          <li>Modal code: {modalLoaded ? "✅ Loaded" : "❌ Not loaded yet"}</li>
        </ul>
      </div>
    </div>
  );
};

// ==========================================
// 4. TAB CONTENT SPLITTING
// ==========================================

const ProfileTab = () => (
  <div className="p-4 bg-blue-100 rounded">
    <h4 className="font-semibold">Profile Information</h4>
    <p className="text-sm mt-2">User profile data and forms</p>
  </div>
);

const AnalyticsTab = () => (
  <div className="p-4 bg-green-100 rounded">
    <h4 className="font-semibold">Analytics Dashboard</h4>
    <div className="mt-2 space-y-2">
      <div className="h-12 bg-green-300 rounded"></div>
      <div className="h-12 bg-green-300 rounded"></div>
    </div>
    <p className="text-xs text-gray-600 mt-2">Heavy chart library</p>
  </div>
);

const SettingsTab = () => (
  <div className="p-4 bg-purple-100 rounded">
    <h4 className="font-semibold">Settings</h4>
    <p className="text-sm mt-2">Configuration options</p>
  </div>
);

const TabSplitting = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [loadedTabs, setLoadedTabs] = useState(["profile"]);

  const handleTabChange = (tab) => {
    if (!loadedTabs.includes(tab)) {
      setLoading(true);
      setTimeout(() => {
        setActiveTab(tab);
        setLoadedTabs([...loadedTabs, tab]);
        setLoading(false);
      }, 400);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="p-4 border rounded mb-4 bg-green-50">
      <h3 className="font-bold text-lg mb-3">4. Tab Content Splitting</h3>

      <div className="flex gap-2 mb-4 border-b">
        {["profile", "analytics", "settings"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 text-sm capitalize ${
              activeTab === tab
                ? "border-b-2 border-blue-500 font-semibold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-8 border rounded bg-white text-center">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ) : (
        <>
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "settings" && <SettingsTab />}
        </>
      )}

      <div className="mt-4 p-3 bg-white rounded border text-sm">
        <p className="font-semibold mb-1">Loaded Tabs: {loadedTabs.length}/3</p>
        <div className="flex gap-2">
          {loadedTabs.map((tab) => (
            <span
              key={tab}
              className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs capitalize"
            >
              {tab}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. ERROR HANDLING DEMO
// ==========================================

const ErrorBoundaryDemo = () => {
  const [showError, setShowError] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLoad = () => {
    setLoading(true);
    setTimeout(() => {
      if (showError) {
        setHasError(true);
      }
      setLoading(false);
    }, 800);
  };

  const reset = () => {
    setHasError(false);
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded mb-4 bg-red-50">
      <h3 className="font-bold text-lg mb-3">5. Error Handling</h3>

      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showError}
            onChange={(e) => setShowError(e.target.checked)}
            className="rounded"
          />
          Simulate loading error
        </label>
      </div>

      <button
        onClick={handleLoad}
        disabled={loading}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 mb-4"
      >
        {loading ? "Loading..." : "Load Component"}
      </button>

      {loading && (
        <div className="p-4 border rounded bg-white">
          <div className="animate-pulse">Loading chunk...</div>
        </div>
      )}

      {hasError && (
        <div className="p-4 border-2 border-red-500 rounded bg-white">
          <h4 className="font-semibold text-red-600 mb-2">
            ⚠️ Error Loading Component
          </h4>
          <p className="text-sm mb-3">
            Failed to load component. This might happen due to:
          </p>
          <ul className="text-xs list-disc list-inside mb-3 space-y-1">
            <li>Network error</li>
            <li>Chunk not found (deployment issue)</li>
            <li>CDN failure</li>
          </ul>
          <button
            onClick={reset}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !hasError && (
        <div className="p-3 bg-white rounded border text-sm">
          <p className="font-semibold mb-2">
            🛡️ Error Handling Best Practices:
          </p>
          <ul className="text-xs space-y-1 list-disc list-inside">
            <li>Always wrap lazy components in Error Boundary</li>
            <li>Implement retry logic for transient failures</li>
            <li>Show user-friendly error messages</li>
            <li>Log errors for monitoring</li>
          </ul>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 6. BUNDLE SIZE COMPARISON
// ==========================================

const BundleSizeComparison = () => {
  const [useSplitting, setUseSplitting] = useState(false);

  const withoutSplitting = {
    initial: 800,
    chunks: [],
  };

  const withSplitting = {
    initial: 120,
    chunks: [
      { name: "home.chunk.js", size: 50 },
      { name: "dashboard.chunk.js", size: 200 },
      { name: "admin.chunk.js", size: 150 },
      { name: "charts.chunk.js", size: 180 },
      { name: "editor.chunk.js", size: 100 },
    ],
  };

  return (
    <div className="p-4 border rounded bg-indigo-50">
      <h3 className="font-bold text-lg mb-3">6. Bundle Size Impact</h3>

      <div className="mb-4">
        <button
          onClick={() => setUseSplitting(!useSplitting)}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
        >
          Toggle: {useSplitting ? "With Splitting" : "Without Splitting"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 bg-white rounded border">
          <h4 className="font-semibold mb-2">❌ Without Splitting</h4>
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>main.js</span>
              <span className="font-mono">{withoutSplitting.initial}KB</span>
            </div>
            <div className="h-8 bg-red-400 rounded"></div>
          </div>
          <p className="text-xs text-gray-600">
            User downloads everything upfront
          </p>
        </div>

        <div className="p-4 bg-white rounded border">
          <h4 className="font-semibold mb-2">✅ With Splitting</h4>
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>main.js (initial)</span>
              <span className="font-mono">{withSplitting.initial}KB</span>
            </div>
            <div className="h-4 bg-green-400 rounded mb-2"></div>
          </div>
          <div className="space-y-1">
            {withSplitting.chunks.slice(0, 2).map((chunk) => (
              <div key={chunk.name} className="flex justify-between text-xs">
                <span className="text-gray-600">{chunk.name}</span>
                <span className="font-mono">{chunk.size}KB</span>
              </div>
            ))}
            <p className="text-xs text-gray-500 italic">+ 3 more chunks...</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white rounded border">
        <h4 className="font-semibold mb-2">📊 Performance Impact</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600 text-xs">Initial Load</p>
            <p className="font-mono text-lg">
              {useSplitting ? "120KB" : "800KB"}
            </p>
            <p
              className={`text-xs ${
                useSplitting ? "text-green-600" : "text-red-600"
              }`}
            >
              {useSplitting ? "85% smaller! 🎉" : "Full bundle"}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-xs">Time to Interactive</p>
            <p className="font-mono text-lg">
              {useSplitting ? "1.2s" : "4.5s"}
            </p>
            <p
              className={`text-xs ${
                useSplitting ? "text-green-600" : "text-red-600"
              }`}
            >
              {useSplitting ? "73% faster! 🚀" : "Slow"}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-xs">Unused Code</p>
            <p className="font-mono text-lg">
              {useSplitting ? "0KB" : "~500KB"}
            </p>
            <p
              className={`text-xs ${
                useSplitting ? "text-green-600" : "text-red-600"
              }`}
            >
              {useSplitting ? "Load on demand!" : "Wasted bandwidth"}
            </p>
          </div>
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
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2 text-center">
        Code Splitting - Interview Master Guide
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Understanding lazy loading and reducing bundle size
      </p>

      <BasicLazyDemo />
      <RouteBasedSplitting />
      <ModalSplitting />
      <TabSplitting />
      <ErrorBoundaryDemo />
      <BundleSizeComparison />

      <div className="mt-6 p-4 bg-white border-2 border-gray-300 rounded">
        <h3 className="font-bold mb-2">
          🎯 Code Splitting Interview Checklist:
        </h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>✅ Use React.lazy() for dynamic imports</li>
          <li>✅ Must wrap in Suspense with fallback</li>
          <li>✅ Component must be default export</li>
          <li>✅ Route-based splitting = biggest win</li>
          <li>✅ Split heavy components (modals, tabs, charts)</li>
          <li>✅ Always implement error boundaries</li>
          <li>✅ Consider prefetch/preload for optimization</li>
          <li>✅ Analyze bundle size with webpack-bundle-analyzer</li>
          <li>❌ Don't over-split (creates too many requests)</li>
          <li>❌ Chunks should be 20-30KB+ minimum</li>
        </ul>
      </div>
    </div>
  );
}
