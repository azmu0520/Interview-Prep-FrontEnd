// Type Assertions and Type Casting - Practical Examples
// Run with: npx ts-node 08-type-assertions.ts
// Or in TypeScript Playground: https://www.typescriptlang.org/play

/* ============================================
   1. TYPE ASSERTIONS WITH 'as' SYNTAX
   ============================================ */

console.log("=== 1. TYPE ASSERTIONS WITH 'as' ===\n");

// Basic type assertion
const value: unknown = "hello world";
const str = value as string;
console.log("String length:", str.length);
console.log("Uppercase:", str.toUpperCase());

// DOM manipulation (most common use case)
const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
const context = canvas?.getContext("2d");

const input = document.querySelector(".email-input") as HTMLInputElement;
console.log("Input type:", input?.type);

const button = document.querySelector("#submit") as HTMLButtonElement;
console.log("Button disabled?", button?.disabled);

// API response
interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  // Assert the JSON response to User type
  return (await response.json()) as User;
}

// Type narrowing when TS can't infer
function processValue(x: string | number) {
  if (typeof x === "string") {
    return x.toUpperCase();
  }
  // We know it's a number here, but sometimes TS needs help
  return (x as number).toFixed(2);
}

console.log("Process string:", processValue("hello"));
console.log("Process number:", processValue(42.12345));

// Array element access
interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: "Laptop", price: 999 },
  { id: 2, name: "Mouse", price: 29 },
];

// Assert first element exists
const firstProduct = products[0] as Product;
console.log("\nFirst product:", firstProduct.name);

/* ============================================
   2. ANGLE BRACKET SYNTAX (Legacy)
   ============================================ */

console.log("\n=== 2. ANGLE BRACKET SYNTAX ===\n");

// Angle bracket syntax (don't use in new code)
const value2: unknown = "typescript";
const str2 = <string>value2;
console.log("Legacy syntax result:", str2.toUpperCase());

// Why it's problematic in React/JSX
// ❌ This looks like JSX!
// const element = <HTMLElement>document.querySelector('.item');

// ✅ Use 'as' instead (works everywhere)
const element = document.querySelector(".item") as HTMLElement;

console.log("Prefer 'as' syntax in modern TypeScript");

/* ============================================
   3. NON-NULL ASSERTION OPERATOR (!)
   ============================================ */

console.log("\n=== 3. NON-NULL ASSERTION OPERATOR ===\n");

// Basic non-null assertion
function findUserById(id: number): User | null {
  if (id === 1) {
    return { id: 1, name: "Alice", email: "alice@example.com" };
  }
  return null;
}

// Without assertion (safer)
const user1 = findUserById(1);
if (user1) {
  console.log("User name:", user1.name);
}

// With assertion (claiming it's not null)
const user2 = findUserById(1)!;
console.log("User with assertion:", user2.name);

// DOM elements you KNOW exist
const appRoot = document.getElementById("app")!;
console.log("App root:", appRoot.tagName);

// Array access
const numbers = [1, 2, 3, 4, 5];
const firstNumber = numbers[0]!;
console.log("First number:", firstNumber);

// Map/Set operations
const userMap = new Map<string, User>();
userMap.set("alice", { id: 1, name: "Alice", email: "alice@example.com" });
const alice = userMap.get("alice")!; // Just set it, so it exists
console.log("From map:", alice.name);

// Optional chaining with assertion
interface Company {
  name: string;
  address?: {
    street?: string;
    city: string;
  };
}

const company: Company = {
  name: "Tech Corp",
  address: { city: "San Francisco" },
};

const city = company.address!.city;
console.log("Company city:", city);

// Dangerous example (DON'T DO THIS)
const dangerousUser = findUserById(999)!; // Might be null!
// dangerousUser.name; // 💥 Would crash at runtime

/* ============================================
   4. CONST ASSERTIONS (as const)
   ============================================ */

console.log("\n=== 4. CONST ASSERTIONS ===\n");

// Without as const (type widening)
const colors1 = ["red", "green", "blue"];
console.log("Colors1 type: string[]");
colors1.push("yellow"); // ✅ Allowed

// With as const (readonly literal types)
const colors2 = ["red", "green", "blue"] as const;
console.log("Colors2 type: readonly ['red', 'green', 'blue']");
// colors2.push("yellow"); // ❌ Error: Property 'push' does not exist

// Object as const
const point1 = { x: 10, y: 20 };
point1.x = 30; // ✅ Allowed

const point2 = { x: 10, y: 20 } as const;
// point2.x = 30; // ❌ Error: Cannot assign to 'x' (readonly)
console.log("Point:", point2);

// String literal narrowing
const status1 = "success"; // Type: string
const status2 = "success" as const; // Type: "success"
console.log("Status:", status2);

// Creating enum-like constants
const Direction = {
  Up: "UP",
  Down: "DOWN",
  Left: "LEFT",
  Right: "RIGHT",
} as const;

type Direction = (typeof Direction)[keyof typeof Direction];
// Type: "UP" | "DOWN" | "LEFT" | "RIGHT"

function move(direction: Direction) {
  console.log(`Moving ${direction}`);
}

move(Direction.Up);
move(Direction.Right);
// move("INVALID"); // ❌ Error

// Configuration object
const CONFIG = {
  apiUrl: "https://api.example.com",
  timeout: 3000,
  retries: 3,
  features: {
    darkMode: true,
    analytics: false,
  },
} as const;

console.log("\nConfig:", CONFIG.apiUrl);
// CONFIG.timeout = 5000; // ❌ Error: readonly

// Tuple types
const pair1 = ["hello", 42]; // (string | number)[]
const pair2 = ["hello", 42] as const; // readonly ["hello", 42]

function processTuple(tuple: readonly [string, number]) {
  console.log(`String: ${tuple[0]}, Number: ${tuple[1]}`);
}

processTuple(pair2);
// processTuple(pair1); // ❌ Error: Type mismatch

// Routes configuration
const ROUTES = {
  home: "/",
  about: "/about",
  contact: "/contact",
  blog: {
    list: "/blog",
    post: "/blog/:id",
  },
} as const;

type Route = (typeof ROUTES)[keyof typeof ROUTES];
console.log("Home route:", ROUTES.home);

/* ============================================
   5. DOUBLE ASSERTIONS (Dangerous!)
   ============================================ */

console.log("\n=== 5. DOUBLE ASSERTIONS ===\n");

// Direct assertion fails for incompatible types
const num = 42;
// const str = num as string; // ❌ Error

// Double assertion (via unknown) - DANGEROUS!
const str3 = num as unknown as string;
console.log("Double assertion (unsafe):", str3);
// str3.toUpperCase(); // 💥 Would crash at runtime

// Real scenario: poorly-typed library
interface LegacyData {
  user_id: number;
  user_name: string;
}

interface ModernData {
  userId: number;
  userName: string;
}

function transformLegacyData(legacy: LegacyData): ModernData {
  // If structure is actually the same, double assert (temporarily)
  return {
    userId: legacy.user_id,
    userName: legacy.user_name,
  };
}

// Testing mock data
interface ComplexType {
  id: number;
  nested: {
    value: string;
  };
}

const mockData = { id: 1, nested: { value: "test" } } as unknown as ComplexType;
console.log("Mock data:", mockData.id);

/* ============================================
   6. TYPE GUARDS vs TYPE ASSERTIONS
   ============================================ */

console.log("\n=== 6. TYPE GUARDS vs ASSERTIONS ===\n");

// Type assertion (no runtime check)
function getLength1(value: unknown): number {
  return (value as string).length; // 💥 Dangerous!
}

// Type guard (runtime check)
function getLength2(value: unknown): number {
  if (typeof value === "string") {
    return value.length; // ✅ Safe
  }
  throw new Error("Not a string");
}

console.log("Length with guard:", getLength2("hello"));
// getLength2(42); // Throws error

// Custom type guard
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    "email" in value &&
    typeof (value as any).id === "number" &&
    typeof (value as any).name === "string" &&
    typeof (value as any).email === "string"
  );
}

function processUser(data: unknown) {
  if (isUser(data)) {
    console.log("Valid user:", data.name);
    return data;
  }
  throw new Error("Invalid user data");
}

processUser({ id: 1, name: "Bob", email: "bob@example.com" });

// Discriminated union with type guard
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number }
  | { kind: "rectangle"; width: number; height: number };

function isCircle(shape: Shape): shape is Extract<Shape, { kind: "circle" }> {
  return shape.kind === "circle";
}

function getArea(shape: Shape): number {
  if (isCircle(shape)) {
    return Math.PI * shape.radius ** 2;
  }
  if (shape.kind === "square") {
    return shape.size ** 2;
  }
  return shape.width * shape.height;
}

console.log("Circle area:", getArea({ kind: "circle", radius: 5 }));

/* ============================================
   7. ASSERTION FUNCTIONS
   ============================================ */

console.log("\n=== 7. ASSERTION FUNCTIONS ===\n");

// Basic assertion function
function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

function divide(a: number, b: number): number {
  assert(b !== 0, "Cannot divide by zero");
  return a / b;
}

console.log("10 / 2 =", divide(10, 2));
// divide(10, 0); // Throws error

// Type predicate assertion
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error(`Expected string, got ${typeof value}`);
  }
}

function processString(value: unknown) {
  assertIsString(value);
  // TypeScript knows value is string now
  return value.toUpperCase();
}

console.log("Processed:", processString("hello"));
// processString(42); // Throws error

// Object shape assertion
function assertIsUser(value: unknown): asserts value is User {
  if (
    typeof value !== "object" ||
    value === null ||
    !("id" in value) ||
    !("name" in value) ||
    !("email" in value) ||
    typeof (value as any).id !== "number" ||
    typeof (value as any).name !== "string" ||
    typeof (value as any).email !== "string"
  ) {
    throw new Error("Invalid user object");
  }
}

function handleUser(data: unknown) {
  assertIsUser(data);
  // data is User type now
  console.log("User ID:", data.id);
  console.log("User name:", data.name);
}

handleUser({ id: 1, name: "Charlie", email: "charlie@example.com" });

// Non-null assertion function
function assertNonNull<T>(
  value: T,
  message?: string
): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error(message || "Value is null or undefined");
  }
}

function getUserName(user: User | null): string {
  assertNonNull(user, "User not found");
  // user is User (not null) now
  return user.name;
}

const foundUser = findUserById(1);
console.log("User name:", getUserName(foundUser));

// Array element assertion
function assertHasElements<T>(
  array: T[],
  message?: string
): asserts array is [T, ...T[]] {
  if (array.length === 0) {
    throw new Error(message || "Array is empty");
  }
}

function getFirstElement<T>(array: T[]): T {
  assertHasElements(array);
  // TypeScript knows array has at least one element
  return array[0];
}

console.log("First element:", getFirstElement([1, 2, 3]));

/* ============================================
   8. PRACTICAL PATTERNS
   ============================================ */

console.log("\n=== 8. PRACTICAL PATTERNS ===\n");

// Pattern 1: Safe API response handling
interface APIResponse<T> {
  data: T;
  status: number;
}

async function safelyFetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const json = await response.json();

  // Validate before using
  assertIsUser(json);
  return json;
}

// Pattern 2: Event handler with specific target
function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement;
  console.log("Input value:", target.value);
}

// Pattern 3: Local storage with type safety
function getFromLocalStorage<T>(key: string): T | null {
  const item = localStorage.getItem(key);
  if (!item) return null;
  return JSON.parse(item) as T;
}

function saveToLocalStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Pattern 4: Form data processing
function getFormData(form: HTMLFormElement) {
  const formData = new FormData(form);
  return {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    remember: formData.get("remember") === "on",
  };
}

// Pattern 5: Runtime type narrowing with validation
function validateAndParse<T>(
  data: unknown,
  validator: (value: unknown) => value is T
): T {
  if (!validator(data)) {
    throw new Error("Validation failed");
  }
  return data;
}

const validatedUser = validateAndParse(
  { id: 1, name: "Dave", email: "dave@example.com" },
  isUser
);
console.log("Validated user:", validatedUser.name);

// Pattern 6: Branded types with assertions
type Brand<K, T> = K & { __brand: T };
type UserId = Brand<number, "UserId">;
type ProductId = Brand<number, "ProductId">;

function createUserId(id: number): UserId {
  return id as UserId;
}

function createProductId(id: number): ProductId {
  return id as ProductId;
}

function getUserById(id: UserId): User | null {
  // Function only accepts UserId, not plain number
  return findUserById(id);
}

const userId = createUserId(1);
const productId = createProductId(123);

getUserById(userId); // ✅ Works
// getUserById(productId); // ❌ Error: type mismatch
// getUserById(42); // ❌ Error: needs UserId

// Pattern 7: Const assertions for state machines
const States = {
  Idle: "idle",
  Loading: "loading",
  Success: "success",
  Error: "error",
} as const;

type State = (typeof States)[keyof typeof States];

class StateMachine {
  private state: State = States.Idle;

  transition(newState: State) {
    console.log(`Transitioning from ${this.state} to ${newState}`);
    this.state = newState;
  }

  getState(): State {
    return this.state;
  }
}

const machine = new StateMachine();
machine.transition(States.Loading);
machine.transition(States.Success);
// machine.transition("invalid"); // ❌ Error

// Pattern 8: Type-safe event emitter
type EventMap = {
  userLogin: { userId: number; timestamp: number };
  userLogout: { userId: number };
  dataUpdate: { data: unknown };
};

class TypedEventEmitter {
  private listeners = new Map<keyof EventMap, Function[]>();

  on<K extends keyof EventMap>(
    event: K,
    callback: (data: EventMap[K]) => void
  ) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.push(callback);
    this.listeners.set(event, callbacks);
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((cb) => cb(data));
  }
}

const emitter = new TypedEventEmitter();
emitter.on("userLogin", (data) => {
  // data is automatically typed as { userId: number; timestamp: number }
  console.log(`User ${data.userId} logged in at ${data.timestamp}`);
});

emitter.emit("userLogin", { userId: 1, timestamp: Date.now() });

/* ============================================
   INTERVIEW CODING CHALLENGES
   ============================================ */

console.log("\n=== INTERVIEW CHALLENGES ===\n");

// Challenge 1: Safe JSON parse with type
function safeJsonParse<T>(
  json: string,
  validator: (value: unknown) => value is T
): T | null {
  try {
    const parsed = JSON.parse(json);
    return validator(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

const userJson = '{"id":1,"name":"Eve","email":"eve@example.com"}';
const parsedUser = safeJsonParse(userJson, isUser);
console.log("Parsed user:", parsedUser?.name);

// Challenge 2: Create branded type with validation
type Email = Brand<string, "Email">;

function isValidEmail(value: string): value is Email {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function createEmail(value: string): Email {
  assertIsString(value);
  if (!isValidEmail(value)) {
    throw new Error("Invalid email format");
  }
  return value;
}

const email = createEmail("user@example.com");
console.log("Valid email:", email);

// Challenge 3: Type-safe object path access
type PathValue<T, P extends string> = P extends keyof T
  ? T[P]
  : P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? PathValue<T[K], R>
    : never
  : never;

function getPath<T, P extends string>(obj: T, path: P): PathValue<T, P> {
  const keys = path.split(".");
  let result: any = obj;
  for (const key of keys) {
    result = result[key];
  }
  return result as PathValue<T, P>;
}

const data = {
  user: {
    profile: {
      name: "Frank",
      age: 30,
    },
  },
};

const name = getPath(data, "user.profile.name");
console.log("Nested value:", name);

// Challenge 4: Assert array type
function assertIsArray<T>(
  value: unknown,
  itemValidator: (item: unknown) => item is T
): asserts value is T[] {
  if (!Array.isArray(value)) {
    throw new Error("Not an array");
  }
  if (!value.every(itemValidator)) {
    throw new Error("Array contains invalid items");
  }
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

const numbers2: unknown = [1, 2, 3, 4, 5];
assertIsArray(numbers2, isNumber);
console.log(
  "Sum:",
  numbers2.reduce((a, b) => a + b, 0)
);

// Challenge 5: Const assertion utility type
type AsConst<T> = T extends readonly unknown[]
  ? { readonly [K in keyof T]: AsConst<T[K]> }
  : T extends object
  ? { readonly [K in keyof T]: AsConst<T[K]> }
  : T;

function asConst<T>(value: T): AsConst<T> {
  return value as AsConst<T>;
}

const constData = asConst({
  name: "Test",
  values: [1, 2, 3],
  nested: { key: "value" },
});

console.log("Const data:", constData.name);
// constData.name = "New"; // ❌ Error: readonly

console.log("\n=== All examples completed successfully! ===");

/* ============================================
   QUICK REFERENCE CHEAT SHEET
   ============================================ */

/*
KEY TAKEAWAYS:

1. Type Assertions ('as' syntax)
   ✅ Tell compiler about types it can't infer
   ✅ No runtime effect (compile-time only)
   ✅ Use for DOM, after validation, narrowing
   ❌ Don't use for external data validation

2. Angle Brackets (Legacy)
   ✅ Older syntax: <Type>value
   ❌ Conflicts with JSX
   ❌ Use 'as' syntax instead

3. Non-null Assertion (!)
   ✅ Removes null/undefined from type
   ✅ Use when you're certain value exists
   ❌ Dangerous if wrong
   ❌ Prefer optional chaining (?.) when possible

4. Const Assertions (as const)
   ✅ Creates readonly literal types
   ✅ Prevents type widening
   ✅ Great for configs, enums, tuples
   ✅ Zero runtime cost

5. Double Assertions
   ✅ Via unknown: value as unknown as Type
   ❌ Bypasses all type safety
   ❌ Use as last resort only
   ✅ Add runtime validation

6. Type Guards vs Assertions
   ✅ Guards: Runtime check + type narrowing
   ✅ Assertions: Compile-time only
   ✅ Prefer guards for external data
   ✅ Assertions for known types

7. Assertion Functions
   ✅ Use 'asserts' keyword
   ✅ Throw on failure, narrow on success
   ✅ Combine runtime + compile-time safety
   ✅ Centralize validation logic

8. Best Practices
   ✅ Use assertions sparingly
   ✅ Validate external data with guards
   ✅ Prefer 'as const' for immutable data
   ✅ Add runtime checks for safety
   ✅ Document why assertions are needed

INTERVIEW TIPS:
- Assertions ≠ casting (no runtime effect)
- Know when to use guards vs assertions
- Explain 'as const' benefits clearly
- Understand ! operator risks
- Can implement assertion functions
- Know double assertion dangers
*/
