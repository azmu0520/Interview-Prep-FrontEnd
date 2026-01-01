import React, { useState, Suspense, lazy, memo, useMemo } from "react";
import {
  Package,
  FileCode,
  Zap,
  Download,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
} from "lucide-react";

// Simulated library data
const LIBRARIES = {
  lodash: { size: 500, treeshakeable: false, alternative: "lodash-es" },
  "lodash-es": { size: 25, treeshakeable: true },
  moment: { size: 290, treeshakeable: false, alternative: "dayjs" },
  dayjs: { size: 7, treeshakeable: true },
  "chart.js": { size: 250, treeshakeable: false },
  recharts: { size: 180, treeshakeable: true },
  "@mui/material": { size: 500, treeshakeable: false },
  "react-icons/fa": { size: 2, treeshakeable: true },
};

// 1. TREE SHAKING DEMONSTRATION
function TreeShakingDemo() {
  const [importType, setImportType] = useState("default");
  const [selectedLib, setSelectedLib] = useState("lodash");

  const bundleSize = useMemo(() => {
    if (importType === "default") {
      return LIBRARIES[selectedLib].size;
    } else if (importType === "named") {
      return selectedLib === "lodash" ? 500 : 25;
    } else {
      return selectedLib === "lodash" ? 5 : 5;
    }
  }, [importType, selectedLib]);

  const getCode = () => {
    if (importType === "default") {
      return `import _ from '${selectedLib}';\n_.map(array, fn);`;
    } else if (importType === "named") {
      return `import { map } from '${selectedLib}';\nmap(array, fn);`;
    } else {
      return `import map from '${selectedLib}/map';\nmap(array, fn);`;
    }
  };

  const isOptimal = bundleSize < 50;

  return (
    <div className="p-6 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-white">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="text-blue-600" size={24} />
        <h3 className="text-xl font-bold text-gray-800">
          1. Tree Shaking Demo
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Choose Library:
            </label>
            <select
              value={selectedLib}
              onChange={(e) => setSelectedLib(e.target.value)}
              className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="lodash">lodash</option>
              <option value="lodash-es">lodash-es</option>
              <option value="moment">moment</option>
              <option value="dayjs">dayjs</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Import Type:
            </label>
            <div className="space-y-2">
              {["default", "named", "path"].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="importType"
                    value={type}
                    checked={importType === type}
                    onChange={(e) => setImportType(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm capitalize">{type} Import</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg">
            <pre className="text-green-400 text-sm font-mono">{getCode()}</pre>
          </div>
        </div>

        <div className="space-y-4">
          <div
            className={`p-6 rounded-lg border-2 ${
              isOptimal
                ? "bg-green-50 border-green-500"
                : "bg-red-50 border-red-500"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Bundle Size:
              </span>
              {isOptimal ? (
                <CheckCircle className="text-green-600" size={20} />
              ) : (
                <AlertTriangle className="text-red-600" size={20} />
              )}
            </div>
            <div className="text-4xl font-bold mb-2">{bundleSize}KB</div>
            <div className="text-sm text-gray-600">
              {isOptimal ? "✅ Optimized!" : "❌ Not optimized"}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <h4 className="font-semibold text-sm mb-3 text-gray-700">
              Results:
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Default import:</span>
                <span className="font-bold text-red-600">
                  {LIBRARIES[selectedLib].size}KB
                </span>
              </div>
              <div className="flex justify-between">
                <span>Named import:</span>
                <span className="font-bold text-yellow-600">
                  {selectedLib === "lodash" ? "500KB" : "25KB"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Path import:</span>
                <span className="font-bold text-green-600">5KB</span>
              </div>
            </div>
          </div>

          {!isOptimal && LIBRARIES[selectedLib].alternative && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm">
                💡 <strong>Tip:</strong> Consider using{" "}
                <code className="bg-blue-200 px-1 rounded">
                  {LIBRARIES[selectedLib].alternative}
                </code>{" "}
                instead for better tree shaking!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 2. CODE SPLITTING VISUALIZATION
function CodeSplittingDemo() {
  const [useSplitting, setUseSplitting] = useState(false);
  const [visitedRoutes, setVisitedRoutes] = useState(["home"]);

  const routes = [
    { id: "home", name: "Home", size: 200 },
    { id: "dashboard", name: "Dashboard", size: 250 },
    { id: "profile", name: "Profile", size: 150 },
    { id: "settings", name: "Settings", size: 180 },
  ];

  const totalSize = routes.reduce((sum, r) => sum + r.size, 0);
  const loadedSize = useSplitting
    ? visitedRoutes.reduce((sum, id) => {
        const route = routes.find((r) => r.id === id);
        return sum + (route?.size || 0);
      }, 0)
    : totalSize;

  const visitRoute = (id) => {
    if (!visitedRoutes.includes(id)) {
      setVisitedRoutes([...visitedRoutes, id]);
    }
  };

  return (
    <div className="p-6 border-2 border-purple-200 rounded-lg bg-gradient-to-br from-purple-50 to-white">
      <div className="flex items-center gap-2 mb-4">
        <FileCode className="text-purple-600" size={24} />
        <h3 className="text-xl font-bold text-gray-800">
          2. Code Splitting Visualization
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setUseSplitting(!useSplitting);
                setVisitedRoutes(["home"]);
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                useSplitting
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {useSplitting ? "✅ Code Splitting ON" : "❌ Code Splitting OFF"}
            </button>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg">
            <pre className="text-sm font-mono text-green-400">
              {useSplitting
                ? `// ✅ With React.lazy()
const Dashboard = lazy(
  () => import('./Dashboard')
);

<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>`
                : `// ❌ Static imports
import Dashboard from './Dashboard';

<Dashboard />`}
            </pre>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Visit Routes:</p>
            <div className="grid grid-cols-2 gap-2">
              {routes.map((route) => {
                const isVisited = visitedRoutes.includes(route.id);
                return (
                  <button
                    key={route.id}
                    onClick={() => visitRoute(route.id)}
                    disabled={!useSplitting && route.id !== "home"}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      isVisited
                        ? "bg-green-100 border-green-500"
                        : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="font-semibold text-sm">{route.name}</div>
                    <div className="text-xs text-gray-600">{route.size}KB</div>
                    {isVisited && (
                      <div className="text-xs text-green-600">✓ Loaded</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <h4 className="font-semibold mb-3 text-gray-700">
              Bundle Analysis:
            </h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Initial Load:</span>
                  <span className="font-bold">
                    {useSplitting ? routes[0].size : totalSize}KB
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{
                      width: `${
                        useSplitting ? (routes[0].size / totalSize) * 100 : 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Currently Loaded:</span>
                  <span className="font-bold">{loadedSize}KB</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${(loadedSize / totalSize) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-lg border-2 ${
              useSplitting
                ? "bg-green-50 border-green-500"
                : "bg-red-50 border-red-500"
            }`}
          >
            <h4 className="font-semibold text-sm mb-2 text-gray-700">
              Performance Impact:
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Initial bundle:</span>
                <span className="font-bold">
                  {useSplitting ? routes[0].size : totalSize}KB
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total chunks:</span>
                <span className="font-bold">
                  {useSplitting ? visitedRoutes.length : 1}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Savings:</span>
                <span className="font-bold text-green-600">
                  {useSplitting ? totalSize - routes[0].size : 0}KB
                </span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-300">
            <p className="text-sm">
              {useSplitting ? (
                <>
                  ✅ <strong>Optimized:</strong> Only loads code when you visit
                  each route!
                </>
              ) : (
                <>
                  ❌ <strong>Not optimized:</strong> All routes loaded upfront,
                  even if never visited!
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. BUNDLE ANALYZER SIMULATION
function BundleAnalyzerDemo() {
  const [optimized, setOptimized] = useState(false);

  const bundles = {
    unoptimized: [
      { name: "lodash", size: 500, category: "vendor", issue: "Use lodash-es" },
      {
        name: "moment",
        size: 290,
        category: "vendor",
        issue: "Replace with dayjs",
      },
      {
        name: "chart.js",
        size: 250,
        category: "vendor",
        issue: "Consider recharts",
      },
      { name: "react", size: 100, category: "vendor", issue: null },
      { name: "react-dom", size: 120, category: "vendor", issue: null },
      { name: "app code", size: 300, category: "app", issue: null },
    ],
    optimized: [
      { name: "lodash-es", size: 25, category: "vendor", issue: null },
      { name: "dayjs", size: 7, category: "vendor", issue: null },
      { name: "recharts", size: 180, category: "vendor", issue: null },
      { name: "react", size: 100, category: "vendor", issue: null },
      { name: "react-dom", size: 120, category: "vendor", issue: null },
      { name: "app code", size: 300, category: "app", issue: null },
    ],
  };

  const currentBundles = optimized ? bundles.optimized : bundles.unoptimized;
  const totalSize = currentBundles.reduce((sum, b) => sum + b.size, 0);
  const issues = currentBundles.filter((b) => b.issue).length;

  return (
    <div className="p-6 border-2 border-green-200 rounded-lg bg-gradient-to-br from-green-50 to-white">
      <div className="flex items-center gap-2 mb-4">
        <Package className="text-green-600" size={24} />
        <h3 className="text-xl font-bold text-gray-800">
          3. Bundle Analyzer Simulation
        </h3>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setOptimized(!optimized)}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              optimized
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            {optimized ? "✅ Optimized Bundle" : "⚠️ Unoptimized Bundle"}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <h4 className="font-semibold mb-3 text-gray-700">
                Bundle Treemap:
              </h4>
              <div className="space-y-1">
                {currentBundles.map((bundle) => {
                  const percentage = (bundle.size / totalSize) * 100;
                  return (
                    <div key={bundle.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium">{bundle.name}</span>
                        <span className="font-bold">{bundle.size}KB</span>
                      </div>
                      <div className="h-8 bg-gray-200 rounded overflow-hidden relative">
                        <div
                          className={`h-full transition-all duration-500 ${
                            bundle.category === "vendor"
                              ? bundle.issue
                                ? "bg-red-500"
                                : "bg-blue-500"
                              : "bg-purple-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                        {bundle.issue && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <AlertTriangle className="text-white" size={16} />
                          </div>
                        )}
                      </div>
                      {bundle.issue && (
                        <p className="text-xs text-red-600 mt-1">
                          ⚠️ {bundle.issue}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div
              className={`p-6 rounded-lg border-2 ${
                optimized
                  ? "bg-green-50 border-green-500"
                  : "bg-red-50 border-red-500"
              }`}
            >
              <h4 className="font-semibold mb-3 text-gray-700">
                Total Bundle Size:
              </h4>
              <div className="text-5xl font-bold mb-2">{totalSize}KB</div>
              {!optimized && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle size={20} />
                  <span className="text-sm font-semibold">
                    {issues} issues found
                  </span>
                </div>
              )}
              {optimized && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle size={20} />
                  <span className="text-sm font-semibold">Optimized!</span>
                </div>
              )}
            </div>

            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <h4 className="font-semibold mb-3 text-gray-700">Breakdown:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Vendor code:</span>
                  <span className="font-bold">
                    {currentBundles
                      .filter((b) => b.category === "vendor")
                      .reduce((sum, b) => sum + b.size, 0)}
                    KB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>App code:</span>
                  <span className="font-bold">
                    {currentBundles
                      .filter((b) => b.category === "app")
                      .reduce((sum, b) => sum + b.size, 0)}
                    KB
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-300">
                  <span className="font-semibold">Savings:</span>
                  <span className="font-bold text-green-600">
                    {bundles.unoptimized.reduce((sum, b) => sum + b.size, 0) -
                      bundles.optimized.reduce((sum, b) => sum + b.size, 0)}
                    KB
                  </span>
                </div>
              </div>
            </div>

            {!optimized && (
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-300">
                <h4 className="font-semibold text-sm mb-2">Recommendations:</h4>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>Replace lodash with lodash-es (475KB savings)</li>
                  <li>Replace moment with dayjs (283KB savings)</li>
                  <li>Consider lighter charting library (70KB savings)</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. COMPRESSION IMPACT
function CompressionDemo() {
  const [compressionType, setCompressionType] = useState("none");

  const originalSize = 500;
  const sizes = {
    none: originalSize,
    gzip: Math.round(originalSize * 0.25),
    brotli: Math.round(originalSize * 0.2),
  };

  const savings = originalSize - sizes[compressionType];
  const savingsPercent = Math.round((savings / originalSize) * 100);

  return (
    <div className="p-6 border-2 border-indigo-200 rounded-lg bg-gradient-to-br from-indigo-50 to-white">
      <div className="flex items-center gap-2 mb-4">
        <Download className="text-indigo-600" size={24} />
        <h3 className="text-xl font-bold text-gray-800">
          4. Compression Impact
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Compression Type:
            </label>
            <div className="space-y-2">
              {[
                { value: "none", label: "None (Uncompressed)" },
                { value: "gzip", label: "Gzip" },
                { value: "brotli", label: "Brotli" },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="compression"
                    value={option.value}
                    checked={compressionType === option.value}
                    onChange={(e) => setCompressionType(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg">
            <pre className="text-sm font-mono text-green-400">
              {compressionType === "none"
                ? `# No compression
Content-Encoding: identity`
                : compressionType === "gzip"
                ? `# Gzip compression
Content-Encoding: gzip
# 75% size reduction`
                : `# Brotli compression
Content-Encoding: br
# 80% size reduction`}
            </pre>
          </div>
        </div>

        <div className="space-y-4">
          <div
            className={`p-6 rounded-lg border-2 ${
              compressionType === "none"
                ? "bg-red-50 border-red-500"
                : "bg-green-50 border-green-500"
            }`}
          >
            <h4 className="font-semibold mb-3 text-gray-700">Transfer Size:</h4>
            <div className="text-5xl font-bold mb-2">
              {sizes[compressionType]}KB
            </div>
            {compressionType !== "none" && (
              <div className="flex items-center gap-2 text-green-600">
                <TrendingDown size={20} />
                <span className="text-sm font-semibold">
                  {savingsPercent}% smaller
                </span>
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <h4 className="font-semibold mb-3 text-gray-700">Comparison:</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>No compression:</span>
                  <span className="font-bold">{originalSize}KB</span>
                </div>
                <div className="h-2 bg-red-500 rounded-full" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Gzip:</span>
                  <span className="font-bold">{sizes.gzip}KB</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 transition-all duration-500"
                    style={{ width: "25%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Brotli:</span>
                  <span className="font-bold">{sizes.brotli}KB</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: "20%" }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm">
              💡 <strong>Tip:</strong> Modern servers automatically compress
              files. Enable gzip/brotli in your server configuration for free
              performance gains!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
