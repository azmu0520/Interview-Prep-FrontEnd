// JavaScript Operators & Expressions - Practical Examples
// Run in browser console or Node.js

console.log("=== JAVASCRIPT OPERATORS & EXPRESSIONS ===\n");

/* ============================================
   1. SHORT-CIRCUIT EVALUATION
   ============================================ */

console.log("=== 1. SHORT-CIRCUIT EVALUATION ===\n");

// AND (&&) - stops at first falsy
console.log("--- AND (&&) Operator ---");

console.log("true && true:", true && true); // true
console.log("true && false:", true && false); // false
console.log("false && true:", false && true); // false (doesn't evaluate right)

// Returns the actual value, not boolean!
console.log('\n"hello" && "world":', "hello" && "world"); // "world"
console.log('null && "world":', null && "world"); // null
console.log('0 && "world":', 0 && "world"); // 0
console.log('"" && "world":', "" && "world"); // ""

// Conditional execution
console.log("\n--- Conditional Execution with && ---");
let isLoggedIn = true;
let message = "Welcome!";

isLoggedIn && console.log(message); // Executes (prints "Welcome!")

isLoggedIn = false;
isLoggedIn && console.log("This won't print"); // Doesn't execute

// Multiple conditions
let user = { name: "Alice", permissions: { admin: true } };
user && user.permissions && console.log("Has permissions");

// OR (||) - stops at first truthy
console.log("\n--- OR (||) Operator ---");

console.log("false || true:", false || true); // true
console.log("true || false:", true || false); // true (doesn't evaluate right)

// Returns the actual value
console.log('\nnull || "default":', null || "default"); // "default"
console.log('0 || "default":', 0 || "default"); // "default" (0 is falsy!)
console.log('"" || "default":', "" || "default"); // "default"
console.log('"value" || "default":', "value" || "default"); // "value"

// Default values (old way - has issues!)
console.log("\n--- Default Values with || ---");

function greetOld(name) {
  name = name || "Guest";
  return `Hello, ${name}!`;
}

console.log('greetOld("Alice"):', greetOld("Alice")); // "Hello, Alice!"
console.log("greetOld():", greetOld()); // "Hello, Guest!"
console.log('greetOld(""):', greetOld("")); // "Hello, Guest!" (but "" is valid!)

// Chaining
console.log("\n--- Chaining Operators ---");

const config = null;
const userConfig = undefined;
const defaultConfig = { theme: "light" };

const finalConfig = config || userConfig || defaultConfig;
console.log("Final config:", finalConfig); // { theme: "light" }

// Guard clauses (old way)
console.log("\n--- Guard Clauses (Old Way) ---");

const userData = { profile: { name: "Bob" } };
const userName = userData && userData.profile && userData.profile.name;
console.log("User name:", userName); // "Bob"

const noData = null;
const noName = noData && noData.profile && noData.profile.name;
console.log("No name:", noName); // null (short-circuited)

// Practical example: Array operations
console.log("\n--- Practical: Safe Array Operations ---");

let items;

// Check before accessing
items && items.length > 0 && console.log("Has items");

items = [1, 2, 3];
items && items.length > 0 && console.log("Now has items:", items.length);

// Function execution guard
console.log("\n--- Function Execution Guard ---");

let callback;

// Won't execute (callback is undefined)
callback && callback();

callback = () => console.log("Callback executed!");
callback && callback(); // Executes!

/* ============================================
   2. NULLISH COALESCING (??) vs OR (||)
   ============================================ */

console.log("\n\n=== 2. NULLISH COALESCING (??) vs OR (||) ===\n");

// The problem with ||
console.log("--- The Problem with || ---");

function setVolumeOld(level) {
  return level || 50;
}

console.log("setVolumeOld(0):", setVolumeOld(0)); // 50 ❌ (0 is valid!)
console.log("setVolumeOld(25):", setVolumeOld(25)); // 25 ✅
console.log("setVolumeOld(null):", setVolumeOld(null)); // 50 ✅

// The solution with ??
console.log("\n--- The Solution with ?? ---");

function setVolumeNew(level) {
  return level ?? 50;
}

console.log("setVolumeNew(0):", setVolumeNew(0)); // 0 ✅ (kept!)
console.log("setVolumeNew(25):", setVolumeNew(25)); // 25 ✅
console.log("setVolumeNew(null):", setVolumeNew(null)); // 50 ✅
console.log("setVolumeNew(undefined):", setVolumeNew(undefined)); // 50 ✅

// Complete comparison
console.log("\n--- Complete Comparison ---");

const testValues = [null, undefined, 0, "", false, "value", 42];

console.log("Value\t\t|| 'default'\t?? 'default'");
testValues.forEach((val) => {
  const str =
    val === null
      ? "null"
      : val === undefined
      ? "undefined"
      : val === ""
      ? '""'
      : val === false
      ? "false"
      : String(val);
  const orResult = val || "default";
  const nullishResult = val ?? "default";
  console.log(
    `${str.padEnd(12)}\t${String(orResult).padEnd(12)}\t${nullishResult}`
  );
});

// Real-world examples
console.log("\n--- Real-World Examples ---");

// User settings
const userSettings = {
  notifications: false, // User disabled
  theme: null, // Not set
  fontSize: 0, // Valid small size
  username: "", // Valid empty
};

console.log("With || (WRONG):");
console.log("  notifications:", userSettings.notifications || true); // true ❌
console.log("  fontSize:", userSettings.fontSize || 16); // 16 ❌
console.log("  username:", userSettings.username || "Anonymous"); // "Anonymous" ❌

console.log("\nWith ?? (CORRECT):");
console.log("  notifications:", userSettings.notifications ?? true); // false ✅
console.log("  theme:", userSettings.theme ?? "light"); // "light" ✅
console.log("  fontSize:", userSettings.fontSize ?? 16); // 0 ✅
console.log("  username:", userSettings.username ?? "Anonymous"); // "" ✅

// API response handling
console.log("\n--- API Response Handling ---");

const apiResponse = {
  count: 0, // Valid count
  page: null, // Not provided
  data: [], // Empty but valid
  total: undefined,
};

console.log("Using ?? for defaults:");
console.log("  count:", apiResponse.count ?? 100); // 0 ✅
console.log("  page:", apiResponse.page ?? 1); // 1 ✅
console.log("  items:", apiResponse.data?.length ?? 0); // 0 ✅
console.log("  total:", apiResponse.total ?? 0); // 0 ✅

// Chaining requirement
console.log("\n--- Chaining with ?? ---");

const a = null;
const b = 0;
const c = "value";

// Must use parentheses with && or ||
const result1 = (a ?? b) && c;
console.log("(null ?? 0) && 'value':", result1); // false (0 is falsy)

const result2 = a ?? (b && c);
console.log("null ?? (0 && 'value'):", result2); // false

// This would be SyntaxError:
// const result3 = a ?? b && c;

/* ============================================
   3. OPTIONAL CHAINING (?.)
   ============================================ */

console.log("\n\n=== 3. OPTIONAL CHAINING (?.) ===\n");

// Basic property access
console.log("--- Basic Property Access ---");

const user1 = {
  name: "Alice",
  profile: {
    email: "alice@example.com",
  },
};

const user2 = null;

console.log("user1?.name:", user1?.name); // "Alice"
console.log("user1?.profile?.email:", user1?.profile?.email); // "alice@example.com"
console.log("user2?.name:", user2?.name); // undefined (safe!)

// Without optional chaining (old way)
console.log("\n--- Without Optional Chaining (OLD) ---");
const oldWay = user2 && user2.profile && user2.profile.email; // Verbose!
console.log("Old way:", oldWay); // undefined

// Method calls
console.log("\n--- Method Calls ---");

const obj1 = {
  getData: () => "data",
};

const obj2 = {
  getData: null,
};

const obj3 = null;

console.log("obj1.getData?.():", obj1.getData?.()); // "data"
console.log("obj2.getData?.():", obj2.getData?.()); // undefined (method is null)
console.log("obj3?.getData?.():", obj3?.getData?.()); // undefined (object is null)

// Array access
console.log("\n--- Array Access ---");

const arr1 = [1, 2, 3];
const arr2 = null;
const arr3 = [{ name: "Alice" }, { name: "Bob" }];

console.log("arr1?.[0]:", arr1?.[0]); // 1
console.log("arr2?.[0]:", arr2?.[0]); // undefined
console.log("arr3?.[0]?.name:", arr3?.[0]?.name); // "Alice"
console.log("arr3?.[5]?.name:", arr3?.[5]?.name); // undefined

// Dynamic properties
console.log("\n--- Dynamic Properties ---");

const key = "email";
const userObj = {
  email: "test@example.com",
};

console.log("userObj?.[key]:", userObj?.[key]); // "test@example.com"
console.log("null?.[key]:", null?.[key]); // undefined

// Combining with nullish coalescing
console.log("\n--- Combining ?. with ?? ---");

const settings = {
  user: {
    preferences: null,
  },
};

const theme = settings?.user?.preferences?.theme ?? "light";
console.log("Theme with defaults:", theme); // "light"

const count = settings?.items?.length ?? 0;
console.log("Item count:", count); // 0

// Practical examples
console.log("\n--- Practical Examples ---");

// API response
const response = {
  data: {
    users: [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ],
  },
};

const firstUser = response?.data?.users?.[0]?.name;
console.log("First user:", firstUser); // "Alice"

const missingUser = response?.data?.admins?.[0]?.name;
console.log("Missing user:", missingUser); // undefined

// DOM-like structure
console.log("\n--- DOM-like Access ---");

const element = {
  firstChild: {
    nodeName: "DIV",
    textContent: "Hello",
  },
};

console.log("Text:", element?.firstChild?.textContent); // "Hello"
console.log("Missing:", element?.lastChild?.textContent); // undefined

// Event handling pattern
console.log("\n--- Event Handling Pattern ---");

function handleEvent(event) {
  const value = event?.target?.value;
  const key = event?.key?.toLowerCase();
  console.log("Event data:", { value, key });
}

handleEvent({ target: { value: "test" }, key: "Enter" });
handleEvent(null);

// Limitations
console.log("\n--- Limitations ---");

const limitObj = {};

// Cannot use on left side of assignment
// limitObj?.property = "value"; // ❌ SyntaxError

// Must check explicitly for assignment
if (limitObj) {
  limitObj.property = "value";
}
console.log("Assigned:", limitObj.property);

/* ============================================
   4. OPERATOR PRECEDENCE
   ============================================ */

console.log("\n\n=== 4. OPERATOR PRECEDENCE ===\n");

// Arithmetic precedence
console.log("--- Arithmetic Precedence ---");

console.log("2 + 3 * 4:", 2 + 3 * 4); // 14 (not 20)
console.log("(2 + 3) * 4:", (2 + 3) * 4); // 20
console.log("10 / 2 * 5:", (10 / 2) * 5); // 25 (left-to-right)
console.log("2 ** 3 ** 2:", 2 ** (3 ** 2)); // 512 (right-to-left!)

// Comparison and logical
console.log("\n--- Comparison and Logical ---");

console.log("5 > 3 && 2 < 4:", 5 > 3 && 2 < 4); // true
console.log("5 > 3 || 2 > 4:", 5 > 3 || 2 > 4); // true
console.log("!false && true:", !false && true); // true

// Tricky case
const x = 5;
const y = 10;
const z = 15;

console.log("\nx > 3 && y < 20 || z === 15:");
console.log("  Result:", (x > 3 && y < 20) || z === 15); // true
console.log("  Evaluated as: ((x > 3) && (y < 20)) || (z === 15)");

// Without parentheses vs with
console.log("\n--- Impact of Parentheses ---");

let a = 5;
const result1 = (a = a + 1 * 2); // 7
console.log("a = a + 1 * 2:", result1);

a = 5;
const result2 = (a = (a + 1) * 2); // 12
console.log("a = (a + 1) * 2:", result2);

// Assignment precedence
console.log("\n--- Assignment Precedence ---");

let m, n;
m = n = 10; // Right-to-left
console.log("m = n = 10:", { m, n }); // Both 10

// Complex expression
console.log("\n--- Complex Expression ---");

const val = 5;
const complexResult = ((val + 2) * 3 > 20 && val < 10) || val === 5;
console.log("Complex result:", complexResult); // true

// Better: break it down
const sum = val + 2;
const product = sum * 3;
const comparison = product > 20 && val < 10;
const finalResult = comparison || val === 5;
console.log("Broken down:", finalResult); // true

// Nullish coalescing precedence
console.log("\n--- Nullish Coalescing Precedence ---");

const p = null;
const q = 0;
const r = "value";

// Must use parentheses
const result3 = (p ?? q) && r;
console.log("(null ?? 0) && 'value':", result3); // false

const result4 = p ?? (q && r);
console.log("null ?? (0 && 'value'):", result4); // false

/* ============================================
   5. TERNARY OPERATOR
   ============================================ */

console.log("\n\n=== 5. TERNARY OPERATOR ===\n");

// Basic usage
console.log("--- Basic Usage ---");

const age = 18;
const canVote = age >= 18 ? "Yes" : "No";
console.log("Can vote:", canVote);

const isOnline = true;
const status = isOnline ? "🟢 Online" : "⚫ Offline";
console.log("Status:", status);

// With function calls
console.log("\n--- With Function Calls ---");

function processValid() {
  return "Processing valid data";
}

function handleError() {
  return "Handling error";
}

const isValid = true;
const result = isValid ? processValid() : handleError();
console.log("Result:", result);

// Nested ternaries
console.log("\n--- Nested Ternaries ---");

const score = 85;
const grade =
  score >= 90
    ? "A"
    : score >= 80
    ? "B"
    : score >= 70
    ? "C"
    : score >= 60
    ? "D"
    : "F";

console.log(`Score ${score} = Grade ${grade}`);

// Too complex (avoid!)
console.log("\n--- Too Complex (DON'T DO THIS) ---");
const complexTernary = true ? (false ? "a" : "b") : false ? "c" : "d";
console.log("Complex (confusing!):", complexTernary);

// Better: use if-else for complex logic
let betterResult;
if (true) {
  betterResult = false ? "a" : "b";
} else {
  betterResult = false ? "c" : "d";
}
console.log("Better (readable):", betterResult);

// Practical examples
console.log("\n--- Practical Examples ---");

// Discount calculation
const isMember = true;
const price = 100;
const finalPrice = isMember ? price * 0.8 : price;
console.log("Final price:", finalPrice);

// String building
const name = "Alice";
const greeting = `Hello${name ? `, ${name}` : ""}!`;
console.log("Greeting:", greeting);

const count = 1;
const label = `${count} item${count === 1 ? "" : "s"}`;
console.log("Label:", label);

// Multiple items
const count2 = 5;
const label2 = `${count2} item${count2 === 1 ? "" : "s"}`;
console.log("Label2:", label2);

// React-like pattern (simulated)
console.log("\n--- React-like Pattern ---");

const isLoggedIn2 = true;
const username = "Alice";

const display = isLoggedIn2 ? `Welcome, ${username}` : "Please log in";
console.log("Display:", display);

// Conditional rendering simulation
const items2 = [1, 2, 3];
const content =
  items2.length > 0 ? `Showing ${items2.length} items` : "No items found";
console.log("Content:", content);

/* ============================================
   6. COMMA OPERATOR
   ============================================ */

console.log("\n\n=== 6. COMMA OPERATOR ===\n");

// Basic usage
console.log("--- Basic Usage ---");

let commaResult = (1, 2, 3);
console.log("(1, 2, 3):", commaResult); // 3 (last value)

// Multiple operations
const res = (console.log("First"), console.log("Second"), "Final");
console.log("Result:", res);

// In for loops (most common use)
console.log("\n--- In For Loops ---");

for (let i = 0, j = 10; i < j; i++, j--) {
  console.log(`i: ${i}, j: ${j}`);
  if (i >= 2) break; // Just show a few
}

// With side effects
console.log("\n--- With Side Effects ---");

let sideEffect = 0;
const value = (sideEffect++, sideEffect++, sideEffect);
console.log("Value:", value); // 2
console.log("Side effect:", sideEffect); // 2

// Not recommended for readability
console.log("\n--- Better: Separate Statements ---");

// ❌ Hard to read
const bad = (console.log("a"), console.log("b"), "c");

// ✅ More readable
console.log("a");
console.log("b");
const good = "c";

/* ============================================
   7. INCREMENT/DECREMENT
   ============================================ */

console.log("\n\n=== 7. INCREMENT/DECREMENT (++/--) ===\n");

// Postfix increment
console.log("--- Postfix (x++) ---");

let postI = 5;
let postJ = postI++;
console.log("After j = i++:");
console.log("  i:", postI); // 6
console.log("  j:", postJ); // 5 (old value)

// Prefix increment
console.log("\n--- Prefix (++x) ---");

let preI = 5;
let preJ = ++preI;
console.log("After j = ++i:");
console.log("  i:", preI); // 6
console.log("  j:", preJ); // 6 (new value)

// Decrement
console.log("\n--- Decrement ---");

let dec1 = 5;
console.log("dec1--:", dec1--); // 5
console.log("dec1:", dec1); // 4

let dec2 = 5;
console.log("--dec2:", --dec2); // 4
console.log("dec2:", dec2); // 4

// In loops
console.log("\n--- In Loops ---");

console.log("Postfix:");
for (let i = 0; i < 3; i++) {
  console.log("  i:", i);
}

console.log("\nPrefix:");
for (let i = 0; i < 3; ++i) {
  console.log("  i:", i);
}

// Confusing usage
console.log("\n--- Confusing Usage (AVOID) ---");

let arr = [1, 2, 3, 4, 5];
let idx = 0;

console.log("arr[idx++]:", arr[idx++]); // 1 (uses 0, then increments)
console.log("idx is now:", idx); // 1

console.log("arr[++idx]:", arr[++idx]); // 3 (increments to 2, uses 2)
console.log("idx is now:", idx); // 2

// Better: explicit
console.log("\n--- Better: Explicit Operations ---");

idx = 0;
console.log("arr[idx]:", arr[idx]); // 1
idx++;

console.log("arr[idx]:", arr[idx]); // 2
idx++;

console.log("Much clearer!");

/* ============================================
   8. INTERVIEW CODING CHALLENGES
   ============================================ */

console.log("\n\n=== 8. INTERVIEW CODING CHALLENGES ===\n");

// Challenge 1: Safe property access
console.log("--- Challenge 1: Safe Property Access ---");

function getNestedProperty(obj, path) {
  return path.split(".").reduce((current, key) => current?.[key], obj);
}

const data = {
  user: {
    profile: {
      address: {
        city: "NYC",
      },
    },
  },
};

console.log("City:", getNestedProperty(data, "user.profile.address.city"));
console.log("Missing:", getNestedProperty(data, "user.profile.phone"));

// Challenge 2: Default value with validation
console.log("\n--- Challenge 2: Default with Validation ---");

function getConfigValue(config, key, defaultValue) {
  const value = config?.[key];
  // Use ?? to preserve falsy values that aren't null/undefined
  return value ?? defaultValue;
}

const config = {
  maxRetries: 0, // Valid
  timeout: null, // Not set
  debug: false, // Valid
};

console.log("maxRetries:", getConfigValue(config, "maxRetries", 3)); // 0
console.log("timeout:", getConfigValue(config, "timeout", 5000)); // 5000
console.log("debug:", getConfigValue(config, "debug", true)); // false

// Challenge 3: Conditional execution chain
console.log("\n--- Challenge 3: Conditional Chain ---");

function processUser(user) {
  // Chain of optional operations
  user?.validate?.();
  user?.normalize?.();
  user?.permissions?.check?.();

  return user?.data ?? {};
}

const validUser = {
  validate: () => console.log("Validating..."),
  normalize: () => console.log("Normalizing..."),
  permissions: {
    check: () => console.log("Checking permissions..."),
  },
  data: { id: 1 },
};

console.log("Processing valid user:");
processUser(validUser);

console.log("\nProcessing null user:");
processUser(null); // Safe!

// Challenge 4: Grade calculator with ternary
console.log("\n--- Challenge 4: Grade Calculator ---");

function getGrade(score) {
  return score >= 90
    ? "A"
    : score >= 80
    ? "B"
    : score >= 70
    ? "C"
    : score >= 60
    ? "D"
    : "F";
}

[95, 85, 75, 65, 55].forEach((score) => {
  console.log(`Score ${score}: Grade ${getGrade(score)}`);
});

// Challenge 5: Short-circuit optimization
console.log("\n--- Challenge 5: Short-Circuit Optimization ---");

function expensiveOperation() {
  console.log("  Running expensive operation...");
  return "result";
}

function smartProcess(shouldRun, data) {
  // Only run expensive operation if needed
  return shouldRun && data && expensiveOperation();
}

console.log("With shouldRun = false:");
smartProcess(false, {}); // Doesn't run expensive operation

console.log("\nWith shouldRun = true:");
const result6 = smartProcess(true, {});
console.log("Result:", result6);

/* ============================================
   9. PRACTICAL PATTERNS
   ============================================ */

console.log("\n\n=== 9. PRACTICAL PATTERNS ===\n");

// Pattern 1: Safe API call
console.log("--- Pattern 1: Safe API Call ---");

async function fetchUser(id) {
  // Simulate API call
  return id === 1 ? { id: 1, name: "Alice" } : null;
}

async function getUserName(id) {
  const user = await fetchUser(id);
  return user?.name ?? "Unknown User";
}

getUserName(1).then((name) => console.log("User 1:", name));
getUserName(999).then((name) => console.log("User 999:", name));

// Pattern 2: Feature flags
console.log("\n--- Pattern 2: Feature Flags ---");

const features = {
  newUI: true,
  betaFeature: false,
  experimentalMode: null,
};

function isFeatureEnabled(feature) {
  return features?.[feature] ?? false;
}

console.log("New UI:", isFeatureEnabled("newUI")); // true
console.log("Beta:", isFeatureEnabled("betaFeature")); // false
console.log("Experimental:", isFeatureEnabled("experimentalMode")); // false

// Pattern 3: Chained method calls
console.log("\n--- Pattern 3: Chained Methods ---");

class Calculator {
  constructor(value = 0) {
    this.value = value;
  }

  add(n) {
    this.value += n;
    return this;
  }

  multiply(n) {
    this.value *= n;
    return this;
  }

  result() {
    return this.value;
  }
}

const calc = new Calculator(5).add(3).multiply(2).add(1);
console.log("Calculator result:", calc.result()); // 17

// Pattern 4: Default parameters with ??
console.log("\n--- Pattern 4: Default Parameters ---");

function createUser({ name, age, role } = {}) {
  return {
    name: name ?? "Anonymous",
    age: age ?? 0,
    role: role ?? "user",
  };
}

console.log(
  "Full data:",
  createUser({ name: "Alice", age: 30, role: "admin" })
);
console.log("Partial data:", createUser({ name: "Bob" }));
console.log("Empty object:", createUser({}));
console.log("No argument:", createUser());

console.log("\n=== All examples completed successfully! ===\n");

/* ============================================
   QUICK REFERENCE
   ============================================ */

console.log("=== QUICK REFERENCE ===\n");

console.log(`
KEY TAKEAWAYS:

1. Short-Circuit Evaluation
   ✅ && returns first falsy or last value
   ✅ || returns first truthy or last value
   ✅ Returns actual values, not booleans
   ✅ Use for conditional execution and guards

2. Nullish Coalescing (??)
   ✅ Only checks null and undefined
   ✅ Preserves 0, "", false as valid values
   ✅ Use instead of || for default values
   ✅ Requires parentheses with && or ||

3. Optional Chaining (?.)
   ✅ Safely access nested properties
   ✅ Returns undefined if any part is null/undefined
   ✅ Works with properties, methods, arrays
   ✅ Cannot use on left side of assignment

4. Operator Precedence
   ✅ Arithmetic > Comparison > Logical
   ✅ && before ||
   ✅ Use parentheses for clarity
   ✅ Don't rely on memorization

5. Ternary Operator
   ✅ For simple expressions that return values
   ✅ condition ? ifTrue : ifFalse
   ✅ Avoid deep nesting
   ✅ Use if-else for complex logic

6. Increment/Decrement
   ✅ Postfix (x++): return then change
   ✅ Prefix (++x): change then return
   ✅ Use on separate lines for clarity

BEST PRACTICES:
✅ Use ?? instead of || for defaults
✅ Use ?. for safe property access
✅ Use () for clarity, not just precedence
✅ Keep ternaries simple (one level max)
✅ Prefer explicit over clever
`);
