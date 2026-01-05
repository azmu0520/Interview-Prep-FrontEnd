// Basic Types - Practical Examples
// Run with: npx ts-node 01-basic-types.ts
// Or in TypeScript Playground: https://www.typescriptlang.org/play

/* ============================================
   1. ANY vs UNKNOWN - Critical Pattern
   ============================================ */

console.log("=== 1. ANY vs UNKNOWN ===\n");

// ❌ BAD: any disables type checking
function processWithAny(data: any) {
  console.log(data.toUpperCase()); // No error, but crashes if not string!
  return data.length; // No error, but crashes if no length property!
}

// This compiles but crashes at runtime:
// processWithAny(42); // Runtime Error!

// ✅ GOOD: unknown forces type checking
function processWithUnknown(data: unknown) {
  // console.log(data.toUpperCase()); // ❌ Error: Object is of type 'unknown'

  // Must narrow type first
  if (typeof data === "string") {
    console.log("String:", data.toUpperCase()); // ✅ Safe!
    return data.length;
  }

  if (Array.isArray(data)) {
    console.log("Array length:", data.length); // ✅ Safe!
    return data.length;
  }

  throw new Error("Invalid data type");
}

processWithUnknown("hello"); // ✅ Works safely
processWithUnknown([1, 2, 3]); // ✅ Works safely

// Practical example: API Response
interface User {
  id: number;
  name: string;
}

function handleAPIResponse(response: unknown): User {
  // Validate before using
  if (
    typeof response === "object" &&
    response !== null &&
    "id" in response &&
    "name" in response
  ) {
    const data = response as { id: unknown; name: unknown };

    if (typeof data.id === "number" && typeof data.name === "string") {
      console.log("Valid user:", data);
      return { id: data.id, name: data.name };
    }
  }

  throw new Error("Invalid user data");
}

handleAPIResponse({ id: 1, name: "Alice" }); // ✅ Safe validation

/* ============================================
   2. VOID vs UNDEFINED vs NEVER
   ============================================ */

console.log("\n=== 2. VOID vs UNDEFINED vs NEVER ===\n");

// VOID - Function doesn't return meaningful value
function logMessage(msg: string): void {
  console.log("Log:", msg);
  // Can return undefined (but not required)
  // return undefined; // ✅ Allowed
}

const result1 = logMessage("Hello"); // result1 is void (essentially undefined)

// UNDEFINED - Explicitly returns undefined
function maybeGetValue(condition: boolean): string | undefined {
  if (condition) {
    return "value";
  }
  return undefined; // Must explicitly return
}

const result2 = maybeGetValue(false); // string | undefined
if (result2 !== undefined) {
  console.log("Got value:", result2.toUpperCase());
}

// NEVER - Function never returns
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {
    // Never exits
  }
}

// Exhaustiveness checking with never
type Status = "pending" | "approved" | "rejected";

function handleStatus(status: Status): string {
  switch (status) {
    case "pending":
      return "⏳ Pending";
    case "approved":
      return "✅ Approved";
    case "rejected":
      return "❌ Rejected";
    default:
      // If we add a new status and forget to handle it, TypeScript errors here
      const _exhaustive: never = status;
      return _exhaustive;
  }
}

console.log(handleStatus("approved"));

// Add "cancelled" to Status type to see error:
// type Status = "pending" | "approved" | "rejected" | "cancelled";

/* ============================================
   3. LITERAL TYPES - Type-Safe Values
   ============================================ */

console.log("\n=== 3. LITERAL TYPES ===\n");

// String literals
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type Theme = "light" | "dark" | "auto";

function makeRequest(url: string, method: HTTPMethod) {
  console.log(`Making ${method} request to ${url}`);
}

makeRequest("/api/users", "GET"); // ✅
makeRequest("/api/users", "POST"); // ✅
// makeRequest("/api/users", "INVALID"); // ❌ Error!

// Numeric literals
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
type Port = 3000 | 8080 | 443;

function rollDice(): DiceRoll {
  return (Math.floor(Math.random() * 6) + 1) as DiceRoll;
}

const roll: DiceRoll = rollDice();
console.log("Dice roll:", roll);

// Boolean literals (less common)
type SuccessFlag = true;
type FailureFlag = false;

// Template literal types
type EmailLocale = "en" | "es" | "fr";
type EmailType = "welcome" | "reset-password" | "verify";
type EmailTemplate = `${EmailLocale}_${EmailType}`;

const template1: EmailTemplate = "en_welcome"; // ✅
const template2: EmailTemplate = "es_reset-password"; // ✅
// const template3: EmailTemplate = "de_welcome"; // ❌ Error!

console.log("Email templates:", template1, template2);

// Practical: Event names
type MouseEvents = "click" | "mousedown" | "mouseup" | "mousemove";
type KeyEvent = "keydown" | "keyup" | "keypress";
type DOMEvent = MouseEvents | KeyEvent;

function addEventListener(event: DOMEvent, handler: () => void) {
  console.log(`Listening for ${event}`);
}

addEventListener("click", () => {}); // ✅
// addEventListener("invalid", () => {}); // ❌ Error!

/* ============================================
   4. TYPE ASSERTIONS - Use Carefully!
   ============================================ */

console.log("\n=== 4. TYPE ASSERTIONS ===\n");

// ✅ Valid use: DOM manipulation
const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
// const ctx = canvas.getContext("2d"); // ✅ TypeScript knows it's a canvas

// ✅ Valid use: After validation
function processValue(value: unknown) {
  if (typeof value === "string") {
    const str = value as string; // Redundant but explicit
    return str.toUpperCase();
  }
}

// ❌ DANGEROUS: Incorrect assertion
interface Point {
  x: number;
  y: number;
}

const notAPoint = { x: 10 } as Point; // ⚠️ Compiles but wrong!
// console.log(notAPoint.y.toFixed()); // Runtime error!

// Non-null assertion (!)
function processString(value: string | null) {
  // If you're SURE it's not null
  console.log(value!.toUpperCase()); // "I promise it's not null"

  // ✅ Better: Use optional chaining
  console.log(value?.toUpperCase());

  // ✅ Best: Use proper null check
  if (value !== null) {
    console.log(value.toUpperCase());
  }
}

// Double assertion (last resort)
// Only when going from completely unrelated types
const weird = "hello" as unknown as number; // ⚠️ Very dangerous!

/* ============================================
   5. AS CONST - Prevent Type Widening
   ============================================ */

console.log("\n=== 5. AS CONST ===\n");

// Problem: Type widening
let status1 = "pending"; // Type: string (widened)
const status2 = "pending"; // Type: "pending" (literal)

type StatusType = "pending" | "complete";
// let current: StatusType = status1; // ❌ Error: string not assignable
let current: StatusType = status2; // ✅ Works

// Solution: as const
let status3 = "pending" as const; // Type: "pending"
let current2: StatusType = status3; // ✅ Works!

// Objects without as const
const config1 = {
  host: "localhost",
  port: 8080,
  ssl: false,
};
// Type: { host: string; port: number; ssl: boolean }
config1.host = "example.com"; // ✅ Can mutate

// Objects with as const
const config2 = {
  host: "localhost",
  port: 8080,
  ssl: false,
} as const;
// Type: { readonly host: "localhost"; readonly port: 8080; readonly ssl: false }
// config2.host = "example.com"; // ❌ Error: Cannot assign to readonly

console.log("Config:", config2);

// Arrays to tuples
const colors1 = ["red", "green", "blue"]; // Type: string[]
colors1.push("yellow"); // ✅ Can mutate

const colors2 = ["red", "green", "blue"] as const; // Type: readonly ["red", "green", "blue"]
// colors2.push("yellow"); // ❌ Error: Cannot mutate
// colors2[0] = "purple"; // ❌ Error: Cannot assign

// Enum-like pattern
const Direction = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
} as const;

type DirectionValue = (typeof Direction)[keyof typeof Direction];
// Type: "UP" | "DOWN" | "LEFT" | "RIGHT"

function move(direction: DirectionValue) {
  console.log(`Moving ${direction}`);
}

move(Direction.UP); // ✅
// move("INVALID"); // ❌ Error!

/* ============================================
   6. STRICT NULL CHECKS - Must Enable!
   ============================================ */

console.log("\n=== 6. STRICT NULL CHECKS ===\n");

// Without strictNullChecks (tsconfig.json "strictNullChecks": false)
// This would compile but is dangerous:
// let name: string = null; // ❌ Allowed without strict mode, but dangerous!

// With strictNullChecks (tsconfig.json "strictNullChecks": true)
// let name: string = null; // ✅ Error: Type 'null' not assignable to 'string'

// Must be explicit about nullable types
let userName: string | null = null;
userName = "Alice";

// Handling nullable values
function greet(name: string | null) {
  // ❌ BAD: No null check
  // console.log(name.toUpperCase()); // Error with strictNullChecks

  // ✅ GOOD: Null check
  if (name !== null) {
    console.log("Hello,", name.toUpperCase());
  } else {
    console.log("Hello, Guest");
  }

  // ✅ GOOD: Optional chaining
  console.log("Hello,", name?.toUpperCase() ?? "Guest");
}

greet("Alice");
greet(null);

// Undefined handling
function processAge(age: number | undefined) {
  // ✅ Check before using
  if (age !== undefined) {
    console.log("Age:", age);
  }

  // ✅ Nullish coalescing
  const finalAge = age ?? 0;
  console.log("Final age:", finalAge);
}

processAge(25);
processAge(undefined);

/* ============================================
   7. DISCRIMINATED UNIONS with Literals
   ============================================ */

console.log("\n=== 7. DISCRIMINATED UNIONS ===\n");

// Using literal types for type-safe unions
type SuccessResponse = {
  status: "success";
  data: { id: number; name: string };
};

type ErrorResponse = {
  status: "error";
  error: string;
  code: number;
};

type LoadingResponse = {
  status: "loading";
};

type APIResponse = SuccessResponse | ErrorResponse | LoadingResponse;

function handleResponse(response: APIResponse) {
  // TypeScript narrows type based on literal
  switch (response.status) {
    case "success":
      console.log("Data:", response.data); // TypeScript knows data exists
      break;
    case "error":
      console.log("Error:", response.error, response.code); // Knows error/code exist
      break;
    case "loading":
      console.log("Loading..."); // Knows only status exists
      break;
    default:
      const _exhaustive: never = response;
      return _exhaustive;
  }
}

handleResponse({ status: "success", data: { id: 1, name: "Alice" } });
handleResponse({ status: "error", error: "Not found", code: 404 });
handleResponse({ status: "loading" });

/* ============================================
   8. PRACTICAL EXAMPLES
   ============================================ */

console.log("\n=== 8. PRACTICAL EXAMPLES ===\n");

// Example 1: Type-safe configuration
type Environment = "development" | "staging" | "production";
type LogLevel = "debug" | "info" | "warn" | "error";

interface AppConfig {
  readonly env: Environment;
  readonly logLevel: LogLevel;
  readonly apiUrl: string;
  readonly maxRetries: 1 | 3 | 5;
}

const appConfig: AppConfig = {
  env: "development",
  logLevel: "debug",
  apiUrl: "http://localhost:3000",
  maxRetries: 3,
};

console.log("App config:", appConfig);

// Example 2: Type-safe event system
type EventMap = {
  click: { x: number; y: number };
  keypress: { key: string; ctrlKey: boolean };
  submit: { formData: Record<string, unknown> };
};

type EventType = keyof EventMap;

function emit<T extends EventType>(event: T, data: EventMap[T]) {
  console.log(`Event: ${event}`, data);
}

emit("click", { x: 100, y: 200 }); // ✅
emit("keypress", { key: "Enter", ctrlKey: true }); // ✅
// emit("click", { key: "Enter" }); // ❌ Error: Wrong data type!

// Example 3: Type-safe string builder
type CSSUnit = "px" | "em" | "rem" | "%" | "vh" | "vw";

function createSize(value: number, unit: CSSUnit): string {
  return `${value}${unit}`;
}

console.log(createSize(16, "px")); // "16px"
console.log(createSize(1.5, "rem")); // "1.5rem"
// console.log(createSize(100, "percent")); // ❌ Error!

// Example 4: Safe JSON parsing
function parseJSON<T>(json: string): T | null {
  try {
    const result: unknown = JSON.parse(json);
    return result as T; // Assertion needed here
  } catch {
    return null;
  }
}

const user = parseJSON<User>('{"id": 1, "name": "Alice"}');
if (user !== null) {
  console.log("Parsed user:", user);
}

/* ============================================
   COMMON PITFALLS & SOLUTIONS
   ============================================ */

console.log("\n=== COMMON PITFALLS ===\n");

// Pitfall 1: Type widening
function compareStatus(status: "active" | "inactive") {
  console.log("Status:", status);
}

let myStatus = "active"; // Type: string (widened!)
// compareStatus(myStatus); // ❌ Error!

const myStatus2 = "active"; // Type: "active" ✅
compareStatus(myStatus2); // ✅

const myStatus3 = "active" as const; // Type: "active" ✅
compareStatus(myStatus3); // ✅

// Pitfall 2: Null without strict checks
// Remember to enable "strictNullChecks" in tsconfig.json!

// Pitfall 3: Over-using assertions
// ❌ BAD
function badGetLength(value: string | number) {
  return (value as string).length; // Crashes if number!
}

// ✅ GOOD
function goodGetLength(value: string | number): number {
  if (typeof value === "string") {
    return value.length;
  }
  return value.toString().length;
}

console.log(goodGetLength("hello")); // 5
console.log(goodGetLength(12345)); // 5

/* ============================================
   INTERVIEW QUESTIONS - LIVE CODING
   ============================================ */

// Q1: Implement a type-safe status checker
type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

function getStatusMessage(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "📦 Order is being processed";
    case "shipped":
      return "🚚 Order is on the way";
    case "delivered":
      return "✅ Order delivered";
    case "cancelled":
      return "❌ Order cancelled";
    default:
      const _: never = status;
      return _;
  }
}

console.log(getStatusMessage("shipped"));

// Q2: Create a safe type guard
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    typeof (value as User).id === "number" &&
    typeof (value as User).name === "string"
  );
}

const maybeUser: unknown = { id: 1, name: "Bob" };
if (isUser(maybeUser)) {
  console.log("User:", maybeUser.name.toUpperCase()); // ✅ Safe!
}

// Q3: Implement type-safe deep readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

const mutableConfig = {
  server: {
    host: "localhost",
    port: 3000,
  },
};

const immutableConfig: DeepReadonly<typeof mutableConfig> = mutableConfig;
// immutableConfig.server.port = 8080; // ❌ Error: Cannot assign to readonly

console.log("\n=== All examples completed successfully! ===");

/* ============================================
   QUICK REFERENCE CHEAT SHEET
   ============================================ */

/*
KEY TAKEAWAYS:

1. any vs unknown
   ✅ Use unknown, not any
   ✅ Always validate unknown before using

2. void vs undefined vs never
   ✅ void = function doesn't return meaningful value
   ✅ undefined = explicitly returns undefined
   ✅ never = function never returns

3. Literal Types
   ✅ Use for type-safe constants
   ✅ Better than magic strings
   ✅ Powers discriminated unions

4. Type Assertions
   ✅ Use sparingly
   ✅ Prefer type guards
   ✅ Only when you know more than compiler

5. as const
   ✅ Prevents type widening
   ✅ Creates readonly types
   ✅ Use for constant configurations

6. strictNullChecks
   ✅ Always enable in tsconfig
   ✅ Explicit about nullable types
   ✅ Use optional chaining and nullish coalescing

COMMON INTERVIEW PATTERNS:
- Discriminated unions with literals
- Exhaustiveness checking with never
- Type guards for unknown
- Enum-like objects with as const
- Type-safe event systems
*/
