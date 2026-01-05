// Functions - Practical Examples
// Run with: npx ts-node 04-functions.ts
// Or in TypeScript Playground: https://www.typescriptlang.org/play

/* ============================================
   1. FUNCTION TYPE ANNOTATIONS - The Basics
   ============================================ */

console.log("=== 1. FUNCTION TYPE ANNOTATIONS ===\n");

// Named function with explicit types
function add(a: number, b: number): number {
  return a + b;
}

console.log("add(5, 3):", add(5, 3));

// Arrow function with explicit return type
const subtract = (a: number, b: number): number => {
  return a - b;
};

// Arrow function with inferred return type
const multiply = (a: number, b: number) => a * b;

// Function type as alias
type MathOperation = (a: number, b: number) => number;

const divide: MathOperation = (a, b) => {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
};

console.log("divide(10, 2):", divide(10, 2));

// Function as parameter
function calculate(op: MathOperation, x: number, y: number): number {
  return op(x, y);
}

console.log("calculate(add, 7, 3):", calculate(add, 7, 3));
console.log("calculate(multiply, 4, 5):", calculate(multiply, 4, 5));

// Interface with call signature
interface Calculator {
  (a: number, b: number): number;
  description: string;
  version: number;
}

const smartAdd: Calculator = ((a: number, b: number) => a + b) as Calculator;
smartAdd.description = "Adds two numbers";
smartAdd.version = 1;

console.log("smartAdd(2, 3):", smartAdd(2, 3));
console.log("smartAdd.description:", smartAdd.description);

// Multiple call signatures (overloading in interface)
interface Parser {
  (value: string): object;
  (value: number): string;
}

// Generic function type
type MapFunction<T, U> = (item: T) => U;

const numberToString: MapFunction<number, string> = (n) => String(n);
const stringToLength: MapFunction<string, number> = (s) => s.length;

console.log("numberToString(42):", numberToString(42));
console.log("stringToLength('hello'):", stringToLength("hello"));

/* ============================================
   2. OPTIONAL PARAMETERS - Flexibility
   ============================================ */

console.log("\n=== 2. OPTIONAL PARAMETERS ===\n");

// Basic optional parameter
function greet(name: string, greeting?: string): string {
  return `${greeting ?? "Hello"}, ${name}!`;
}

console.log(greet("Alice"));
console.log(greet("Bob", "Hi"));
console.log(greet("Charlie", "Hey"));

// Multiple optional parameters
function createUser(name: string, email?: string, age?: number, city?: string) {
  return {
    name,
    email: email ?? "unknown@example.com",
    age: age ?? 0,
    city: city ?? "Unknown",
  };
}

console.log(createUser("Alice"));
console.log(createUser("Bob", "bob@example.com"));
console.log(createUser("Charlie", undefined, 25));
console.log(createUser("David", "david@example.com", 30, "NYC"));

// Optional vs undefined difference
function log1(message: string, level?: string) {
  console.log(`[${level ?? "INFO"}] ${message}`);
}

function log2(message: string, level: string | undefined) {
  console.log(`[${level ?? "INFO"}] ${message}`);
}

log1("Server started"); // ✅ Can omit level
log1("Error occurred", "ERROR");

// log2("Server started"); // ❌ Error: Expected 2 arguments
log2("Server started", undefined); // ✅ Must provide undefined

// Optional callback pattern
function processValue(
  value: string,
  transformer?: (s: string) => string
): string {
  // Check if provided
  if (transformer) {
    return transformer(value);
  }
  return value;
}

console.log(processValue("hello"));
console.log(processValue("hello", (s) => s.toUpperCase()));

// Using optional chaining with optional callbacks
function processValue2(
  value: string,
  transformer?: (s: string) => string
): string {
  return transformer?.(value) ?? value;
}

console.log(processValue2("world"));
console.log(processValue2("world", (s) => s + "!"));

// Optional parameters in configuration
interface FetchConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  timeout?: number;
}

function fetchData(url: string, config?: FetchConfig) {
  const method = config?.method ?? "GET";
  const timeout = config?.timeout ?? 3000;

  console.log(`Fetching ${url} with ${method} (timeout: ${timeout}ms)`);
}

fetchData("https://api.example.com/users");
fetchData("https://api.example.com/posts", { method: "POST", timeout: 5000 });

/* ============================================
   3. DEFAULT PARAMETERS - Convenience
   ============================================ */

console.log("\n=== 3. DEFAULT PARAMETERS ===\n");

// Basic default parameters
function createConnection(
  host: string = "localhost",
  port: number = 3000,
  ssl: boolean = false
) {
  return { host, port, ssl };
}

console.log(createConnection());
console.log(createConnection("example.com"));
console.log(createConnection("example.com", 443, true));

// Type inference from defaults
function increment(value: number, step = 1) {
  // step is inferred as number
  return value + step;
}

console.log("increment(5):", increment(5));
console.log("increment(5, 3):", increment(5, 3));

// Default with explicit type
function decrement(value: number, step: number = 1) {
  return value - step;
}

console.log("decrement(10):", decrement(10));
console.log("decrement(10, 2):", decrement(10, 2));

// Object destructuring with defaults
interface Options {
  timeout?: number;
  retries?: number;
  cache?: boolean;
}

function fetchWithOptions(
  url: string,
  { timeout = 3000, retries = 3, cache = true }: Options = {}
) {
  console.log(`Fetching ${url}:`, { timeout, retries, cache });
}

fetchWithOptions("https://api.example.com/data");
fetchWithOptions("https://api.example.com/data", {});
fetchWithOptions("https://api.example.com/data", { timeout: 5000 });
fetchWithOptions("https://api.example.com/data", {
  timeout: 5000,
  retries: 5,
  cache: false,
});

// Default can reference earlier parameters
function createRange(start: number, end: number = start + 10) {
  return { start, end };
}

console.log("createRange(5):", createRange(5));
console.log("createRange(5, 20):", createRange(5, 20));

// Complex default values
function createLogger(
  prefix: string = new Date().toISOString(),
  formatter: (msg: string) => string = (msg) => msg.toUpperCase()
) {
  return (message: string) => {
    console.log(`[${prefix}] ${formatter(message)}`);
  };
}

const logger1 = createLogger();
logger1("Hello");

const logger2 = createLogger("APP", (msg) => `>>> ${msg} <<<`);
logger2("Important message");

// Default vs optional comparison
function compareParams1(required: string, optional?: string) {
  // optional is string | undefined
  const value = optional ?? "default";
  console.log("Optional:", value);
}

function compareParams2(required: string, withDefault: string = "default") {
  // withDefault is always string (never undefined in body)
  console.log("Default:", withDefault);
}

compareParams1("test");
compareParams2("test");

/* ============================================
   4. REST PARAMETERS - Variadic Functions
   ============================================ */

console.log("\n=== 4. REST PARAMETERS ===\n");

// Basic rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

console.log("sum():", sum());
console.log("sum(1, 2, 3):", sum(1, 2, 3));
console.log("sum(1, 2, 3, 4, 5):", sum(1, 2, 3, 4, 5));

// Rest with other parameters
function logMessage(level: string, ...messages: string[]) {
  console.log(`[${level}]`, messages.join(" "));
}

logMessage("INFO", "Server", "started", "on", "port", "3000");
logMessage("ERROR", "Connection", "failed");

// Type-safe rest parameters
function max(...numbers: number[]): number {
  if (numbers.length === 0) return -Infinity;
  return Math.max(...numbers);
}

console.log("max(1, 5, 3, 9, 2):", max(1, 5, 3, 9, 2));

// Building URLs with rest
function buildUrl(base: string, ...segments: string[]): string {
  return base + "/" + segments.join("/");
}

console.log(buildUrl("https://api.example.com", "users", "123", "posts"));
console.log(buildUrl("https://api.example.com", "products"));

// Rest with tuple types
function connect(...args: [host: string, port: number, ssl?: boolean]): {
  host: string;
  port: number;
  ssl: boolean;
} {
  const [host, port, ssl = false] = args;
  return { host, port, ssl };
}

console.log(connect("localhost", 3000));
console.log(connect("example.com", 443, true));

// Generic rest parameters
function merge<T extends object>(...objects: T[]): T {
  return Object.assign({}, ...objects);
}

const merged = merge({ a: 1 }, { b: 2 }, { c: 3 });
console.log("merged:", merged);

// Variadic tuple types (advanced)
function concat<T extends unknown[], U extends unknown[]>(
  arr1: [...T],
  arr2: [...U]
): [...T, ...U] {
  return [...arr1, ...arr2];
}

const result = concat([1, 2], ["a", "b"]);
console.log("concat result:", result);
// Type: [number, number, string, string]

// Practical: printf-style function
function printf(format: string, ...args: (string | number)[]): string {
  let result = format;
  for (let i = 0; i < args.length; i++) {
    result = result.replace(`{${i}}`, String(args[i]));
  }
  return result;
}

console.log(printf("Hello {0}, you are {1} years old", "Alice", 30));
console.log(printf("The answer is {0}", 42));

/* ============================================
   5. FUNCTION OVERLOADING - Precision
   ============================================ */

console.log("\n=== 5. FUNCTION OVERLOADING ===\n");

// Basic overloading
function parseValue(value: string): object;
function parseValue(value: number): string;
function parseValue(value: string | number): object | string {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }
  return String(value);
}

const obj = parseValue('{"name": "Alice"}');
console.log("Parsed object:", obj);

const str = parseValue(42);
console.log("Parsed string:", str);

// Overloading with different parameter counts
function makeDate(timestamp: number): Date;
function makeDate(year: number, month: number, day: number): Date;
function makeDate(yearOrTimestamp: number, month?: number, day?: number): Date {
  if (month !== undefined && day !== undefined) {
    return new Date(yearOrTimestamp, month, day);
  }
  return new Date(yearOrTimestamp);
}

console.log("makeDate(1609459200000):", makeDate(1609459200000));
console.log("makeDate(2024, 0, 1):", makeDate(2024, 0, 1));

// Overloading for type narrowing
function reverse(value: string): string;
function reverse<T>(value: T[]): T[];
function reverse<T>(value: string | T[]): string | T[] {
  if (typeof value === "string") {
    return value.split("").reverse().join("");
  }
  return value.slice().reverse();
}

console.log("reverse('hello'):", reverse("hello"));
console.log("reverse([1, 2, 3]):", reverse([1, 2, 3]));

// Practical: createElement with specific types
function createElement(tag: "div"): HTMLDivElement;
function createElement(tag: "span"): HTMLSpanElement;
function createElement(tag: "input"): HTMLInputElement;
function createElement(tag: string): HTMLElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

// In a browser environment:
// const div = createElement("div"); // Type: HTMLDivElement
// div.className = "container";
// const input = createElement("input"); // Type: HTMLInputElement
// input.value = "hello";

// Overloading with union discrimination
interface Square {
  kind: "square";
  size: number;
}

interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}

interface Circle {
  kind: "circle";
  radius: number;
}

type Shape = Square | Rectangle | Circle;

function calculateArea(shape: Square): number;
function calculateArea(shape: Rectangle): number;
function calculateArea(shape: Circle): number;
function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "square":
      return shape.size * shape.size;
    case "rectangle":
      return shape.width * shape.height;
    case "circle":
      return Math.PI * shape.radius * shape.radius;
  }
}

console.log("Square area:", calculateArea({ kind: "square", size: 5 }));
console.log(
  "Rectangle area:",
  calculateArea({ kind: "rectangle", width: 4, height: 6 })
);
console.log("Circle area:", calculateArea({ kind: "circle", radius: 3 }));

// Overloading with optional parameters
function format(value: number): string;
function format(value: number, decimals: number): string;
function format(value: number, decimals?: number): string {
  return value.toFixed(decimals ?? 2);
}

console.log("format(3.14159):", format(3.14159));
console.log("format(3.14159, 4):", format(3.14159, 4));

/* ============================================
   6. THIS PARAMETER TYPE - Context Control
   ============================================ */

console.log("\n=== 6. THIS PARAMETER TYPE ===\n");

// Basic this typing
interface User {
  name: string;
  email: string;
  greet(this: User): void;
}

const user: User = {
  name: "Alice",
  email: "alice@example.com",
  greet() {
    console.log(`Hello, I'm ${this.name} (${this.email})`);
  },
};

user.greet(); // ✅ Works
const greetFn = user.greet;
// greetFn(); // ❌ Error: 'this' context required

// Fix with bind
const boundGreet = user.greet.bind(user);
boundGreet(); // ✅ Works

// this in standalone functions
function introduce(this: { name: string; age: number }) {
  console.log(`I'm ${this.name}, ${this.age} years old`);
}

const person = {
  name: "Bob",
  age: 30,
  introduce,
};

person.introduce(); // ✅ Works
// introduce(); // ❌ Error: 'this' context required

// Class methods with this
class Counter {
  private count = 0;

  increment(this: Counter): void {
    this.count++;
  }

  getValue(this: Counter): number {
    return this.count;
  }

  // Arrow function preserves this
  getIncrementor = () => {
    return () => this.count++;
  };
}

const counter = new Counter();
counter.increment();
console.log("Counter value:", counter.getValue());

// Using this with callbacks
class Button {
  private clicks = 0;

  handleClick(this: Button): void {
    this.clicks++;
    console.log(`Button clicked ${this.clicks} times`);
  }

  // Wrong way - loses this context
  setupWrong() {
    const handler = this.handleClick;
    // handler(); // Would error
  }

  // Right way - preserve this
  setupRight() {
    const handler = this.handleClick.bind(this);
    handler(); // ✅ Works
  }

  // Arrow function way - inherits this
  handleClickArrow = () => {
    this.clicks++;
    console.log(`Button clicked ${this.clicks} times (arrow)`);
  };
}

const button = new Button();
button.setupRight();
button.handleClickArrow();

// ThisParameterType utility
function greetUser(this: { name: string; role: string }, greeting: string) {
  return `${greeting}, ${this.name} (${this.role})`;
}

type GreetThis = ThisParameterType<typeof greetUser>;
// Type: { name: string; role: string }

type GreetFn = OmitThisParameter<typeof greetUser>;
// Type: (greeting: string) => string

const admin: GreetThis = { name: "Admin", role: "Administrator" };
console.log(greetUser.call(admin, "Welcome"));

/* ============================================
   7. VOID vs UNDEFINED - Return Types
   ============================================ */

console.log("\n=== 7. VOID vs UNDEFINED ===\n");

// void return type
function logToConsole(msg: string): void {
  console.log(`[LOG] ${msg}`);
  // Can return undefined (but not required)
  // return undefined; // ✅ Allowed
  // return; // ✅ Allowed
  // return null; // ❌ Error
}

const voidResult: void = logToConsole("Hello");
// Can't use voidResult meaningfully

// undefined return type
function findById(id: number): string | undefined {
  if (id === 1) return "Found";
  return undefined; // Must explicitly return
}

const result1 = findById(1);
if (result1 !== undefined) {
  console.log("Found:", result1.toUpperCase());
}

// Why void exists - callback flexibility
type VoidCallback = () => void;

const callback1: VoidCallback = () => {
  return 123; // ✅ Allowed! Return value ignored
};

const callback2: VoidCallback = () => {
  return "hello"; // ✅ Allowed! Return value ignored
};

const callback3: VoidCallback = () => {
  console.log("No return");
  // ✅ Allowed
};

// Practical use in forEach
[1, 2, 3].forEach((num) => {
  return num * 2; // Return value ignored by forEach
});

// undefined doesn't work the same
type UndefinedCallback = () => undefined;

// const cb4: UndefinedCallback = () => 123; // ❌ Error
const cb5: UndefinedCallback = () => undefined; // ✅
const cb6: UndefinedCallback = () => {
  return;
}; // ✅

// Practical difference: Array methods
const numbers = [1, 2, 3, 4, 5];

// forEach expects void callback
numbers.forEach((num) => {
  console.log(num);
  return num * 2; // ✅ Ignored
});

// map uses return value
const doubled = numbers.map((num) => {
  console.log(num);
  // Implicitly returns undefined if we don't return
  // Better to return explicitly
  return num * 2;
});

console.log("Doubled:", doubled);

// void in Promise chains
function asyncLog(message: string): Promise<void> {
  return new Promise((resolve) => {
    console.log(message);
    resolve(); // Same as resolve(undefined)
  });
}

asyncLog("Async message").then(() => {
  console.log("Done");
});

// Method that returns this (fluent interface)
class StringBuilder {
  private value = "";

  append(text: string): this {
    this.value += text;
    return this;
  }

  clear(): void {
    this.value = "";
    // Note: void, so can't chain
  }

  toString(): string {
    return this.value;
  }
}

const builder = new StringBuilder();
const text = builder.append("Hello ").append("World").toString();
console.log("Built string:", text);

/* ============================================
   8. PRACTICAL REAL-WORLD PATTERNS
   ============================================ */

console.log("\n=== 8. PRACTICAL PATTERNS ===\n");

// Pattern 1: Type-safe event emitter
type EventMap = {
  connect: (host: string, port: number) => void;
  disconnect: () => void;
  message: (data: string) => void;
  error: (error: Error) => void;
};

class TypedEventEmitter<T extends Record<string, (...args: any[]) => void>> {
  private listeners: Partial<Record<keyof T, T[keyof T][]>> = {};

  on<K extends keyof T>(event: K, handler: T[K]): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(handler);
  }

  emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void {
    const handlers = this.listeners[event];
    if (handlers) {
      handlers.forEach((handler) => handler(...args));
    }
  }
}

const emitter = new TypedEventEmitter<EventMap>();

emitter.on("connect", (host, port) => {
  console.log(`Connected to ${host}:${port}`);
});

emitter.on("message", (data) => {
  console.log(`Received: ${data}`);
});

emitter.emit("connect", "localhost", 3000);
emitter.emit("message", "Hello!");

// Pattern 2: Retry with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Retry attempt ${attempt + 1}, waiting ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Should not reach here");
}

// Pattern 3: Currying with types
function curry<A, B, R>(fn: (a: A, b: B) => R): (a: A) => (b: B) => R {
  return (a: A) => (b: B) => fn(a, b);
}

const addCurried = curry((a: number, b: number) => a + b);
const add5 = addCurried(5);
console.log("add5(3):", add5(3));

// Pattern 4: Pipe function
function pipe<A, B>(value: A, fn1: (a: A) => B): B;
function pipe<A, B, C>(value: A, fn1: (a: A) => B, fn2: (b: B) => C): C;
function pipe<A, B, C, D>(
  value: A,
  fn1: (a: A) => B,
  fn2: (b: B) => C,
  fn3: (c: C) => D
): D;
function pipe(value: any, ...fns: ((arg: any) => any)[]): any {
  return fns.reduce((acc, fn) => fn(acc), value);
}

const piped = pipe(
  5,
  (n) => n * 2,
  (n) => n + 1,
  (n) => `Result: ${n}`
);
console.log("Piped:", piped);

// Pattern 5: Memoization
function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Result
): (...args: Args) => Result {
  const cache = new Map<string, Result>();

  return (...args: Args): Result => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log("Cache hit!");
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const expensiveCalc = memoize((n: number) => {
  console.log("Calculating...");
  return n * n;
});

console.log(expensiveCalc(5));
console.log(expensiveCalc(5)); // Cache hit!

/* ============================================
   INTERVIEW CODING CHALLENGES
   ============================================ */

console.log("\n=== INTERVIEW CHALLENGES ===\n");

// Challenge 1: Type-safe compose function
function compose<A, B>(fn1: (a: A) => B): (a: A) => B;
function compose<A, B, C>(fn1: (b: B) => C, fn2: (a: A) => B): (a: A) => C;
function compose<A, B, C, D>(
  fn1: (c: C) => D,
  fn2: (b: B) => C,
  fn3: (a: A) => B
): (a: A) => D;
function compose(...fns: ((arg: any) => any)[]): (arg: any) => any {
  return (arg: any) => fns.reduceRight((acc, fn) => fn(acc), arg);
}

const composedFn = compose(
  (n: number) => `Result: ${n}`,
  (n: number) => n + 1,
  (n: number) => n * 2
);

console.log("Composed:", composedFn(5)); // "Result: 11"

// Challenge 2: Implement debounce with types
function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

const debouncedLog = debounce(
  (message: string) => console.log("Debounced:", message),
  1000
);

// Challenge 3: Type-safe pick function
function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    result[key] = obj[key];
  }
  return result;
}

const fullUser = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  age: 30,
};

const picked = pick(fullUser, "name", "email");
console.log("Picked:", picked);

// Challenge 4: Implement Promise.all with types
function promiseAll<T extends readonly unknown[]>(
  promises: T
): Promise<{ [K in keyof T]: Awaited<T[K]> }> {
  return Promise.all(promises) as any;
}

const promises = [
  Promise.resolve(42),
  Promise.resolve("hello"),
  Promise.resolve(true),
] as const;

promiseAll(promises).then((results) => {
  // results is typed as [number, string, boolean]
  console.log("Promise.all results:", results);
});

console.log("\n=== All examples completed successfully! ===");

/* ============================================
   QUICK REFERENCE CHEAT SHEET
   ============================================ */

/*
KEY TAKEAWAYS:

1. Function Type Annotations
   ✅ Always type parameters
   ✅ Return types optional but recommended for public APIs
   ✅ Use type aliases or interfaces for complex function types

2. Optional Parameters
   ✅ Use ? for optional: `param?: Type`
   ✅ Must come after required parameters
   ✅ Type becomes `Type | undefined` inside function

3. Default Parameters
   ✅ Provide default value: `param: Type = defaultValue`
   ✅ Makes parameter optional
   ✅ Type inferred from default if not specified
   ✅ Never undefined inside function body

4. Rest Parameters
   ✅ Collect remaining args: `...params: Type[]`
   ✅ Must be last parameter
   ✅ Typed as array
   ✅ Works with tuple types for precision

5. Function Overloading
   ✅ Multiple signatures, one implementation
   ✅ Most specific overloads first
   ✅ Implementation signature must be general
   ✅ Provides precise return types

6. This Parameter
   ✅ Type this context: `function fn(this: Type)`
   ✅ Not a real parameter (type-only)
   ✅ Ensures correct context
   ✅ Use arrow functions to preserve this

7. Void vs Undefined
   ✅ void = ignore return value
   ✅ undefined = explicitly return undefined
   ✅ void allows any return (ignored)
   ✅ Use void for callbacks

8. Function Compatibility
   ✅ Parameters contravariant (more general OK)
   ✅ Returns covariant (more specific OK)
   ✅ Fewer parameters OK
   ✅ More parameters rejected

COMMON PATTERNS:
- Type-safe event emitters
- Retry with exponential backoff
- Currying and partial application
- Function composition and pipes
- Memoization and caching
- Debounce and throttle
*/
