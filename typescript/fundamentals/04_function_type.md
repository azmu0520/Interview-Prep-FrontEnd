# Functions - Deep Dive

## 🎯 Key Concepts

### 1. Function Type Annotations (CRITICAL!)

**What it means:**

- Explicitly type parameters and return values
- TypeScript can often infer return types, but parameters need types
- Makes function contracts clear and prevents errors

**Basic function syntax:**

```typescript
// Named function
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function
const subtract = (a: number, b: number): number => {
  return a - b;
};

// Shorthand arrow function (return type inferred)
const multiply = (a: number, b: number) => a * b;
```

**Function type expressions:**

```typescript
// Type alias for function
type MathOperation = (a: number, b: number) => number;

const divide: MathOperation = (a, b) => {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
};

// Function as parameter
function calculate(op: MathOperation, x: number, y: number): number {
  return op(x, y);
}

calculate(add, 10, 5); // 15
```

**Interface with call signature:**

```typescript
interface Calculator {
  (a: number, b: number): number;
  description: string;
}

const smartAdd: Calculator = (a, b) => a + b;
smartAdd.description = "Adds two numbers";
```

**When to annotate return types:**

- ✅ Public API functions (documentation)
- ✅ Complex functions (clarity)
- ✅ When inference gives wrong type
- ❌ Simple, obvious functions (inference works well)

**Interview Gold:** "I always type function parameters because TypeScript can't infer them. For return types, I use explicit types for public APIs and complex logic, but let TypeScript infer simple cases like `const double = (n: number) => n * 2`."

---

### 2. Optional Parameters (?)

**What it means:**

- Parameters that may be omitted when calling the function
- Must come after required parameters
- Type becomes `Type | undefined`

**Basic optional parameters:**

```typescript
function greet(name: string, greeting?: string): string {
  return `${greeting ?? "Hello"}, ${name}!`;
}

greet("Alice"); // "Hello, Alice!"
greet("Bob", "Hi"); // "Hi, Bob!"
```

**Optional vs undefined:**

```typescript
// Optional parameter - can be omitted
function log1(message: string, level?: string) {
  console.log(`[${level ?? "INFO"}] ${message}`);
}

log1("Starting app"); // OK - level omitted
log1("Error occurred", "ERROR"); // OK

// Undefined parameter - must be provided (but can be undefined)
function log2(message: string, level: string | undefined) {
  console.log(`[${level ?? "INFO"}] ${message}`);
}

// log2("Starting app"); // ❌ Error: Expected 2 arguments
log2("Starting app", undefined); // OK - explicitly pass undefined
```

**Order matters:**

```typescript
// ❌ Optional parameters must come last
// function bad(optional?: string, required: number) { }

// ✅ Correct order
function good(required: number, optional?: string) {}
```

**Multiple optional parameters:**

```typescript
function createUser(
  name: string,
  email?: string,
  age?: number,
  city?: string
): User {
  return {
    name,
    email: email ?? "unknown@example.com",
    age: age ?? 0,
    city: city ?? "Unknown",
  };
}

createUser("Alice");
createUser("Bob", "bob@example.com");
createUser("Charlie", undefined, 25);
createUser("David", "david@example.com", 30, "NYC");
```

**Working with optional parameters:**

```typescript
function processValue(value: string, transformer?: (s: string) => string) {
  // Check if provided
  if (transformer) {
    return transformer(value);
  }
  return value;
}

// Or use optional chaining
function processValue2(value: string, transformer?: (s: string) => string) {
  return transformer?.(value) ?? value;
}
```

---

### 3. Default Parameters

**What it means:**

- Parameters with default values if not provided
- Automatically makes parameter optional
- Type is inferred from default value

**Basic default parameters:**

```typescript
function createConnection(
  host: string = "localhost",
  port: number = 3000,
  ssl: boolean = false
) {
  return { host, port, ssl };
}

createConnection(); // { host: "localhost", port: 3000, ssl: false }
createConnection("example.com"); // { host: "example.com", port: 3000, ssl: false }
createConnection("example.com", 443, true);
```

**Type inference with defaults:**

```typescript
// Type inferred from default value
function increment(value: number, step = 1) {
  // step is inferred as number
  return value + step;
}

// Can still provide explicit type
function decrement(value: number, step: number = 1) {
  return value - step;
}
```

**Default vs optional:**

```typescript
// Optional - no default, can be undefined
function opt(value: string, count?: number) {
  const finalCount = count ?? 1;
  return value.repeat(finalCount);
}

// Default - has default, never undefined in body
function def(value: string, count: number = 1) {
  return value.repeat(count); // count is always number
}
```

**Object destructuring with defaults:**

```typescript
interface Options {
  timeout?: number;
  retries?: number;
  cache?: boolean;
}

function fetchData({
  timeout = 3000,
  retries = 3,
  cache = true,
}: Options = {}) {
  console.log({ timeout, retries, cache });
}

fetchData(); // Uses all defaults
fetchData({}); // Uses all defaults
fetchData({ timeout: 5000 }); // Override timeout only
```

**Default value can reference earlier parameters:**

```typescript
function createRange(start: number, end: number = start + 10) {
  return { start, end };
}

createRange(5); // { start: 5, end: 15 }
```

---

### 4. Rest Parameters

**What it means:**

- Collect remaining arguments into an array
- Must be last parameter
- Typed as array

**Basic rest parameters:**

```typescript
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

sum(1, 2, 3); // 6
sum(1, 2, 3, 4, 5); // 15
sum(); // 0
```

**Rest with other parameters:**

```typescript
function logMessage(level: string, ...messages: string[]) {
  console.log(`[${level}]`, ...messages);
}

logMessage("INFO", "Server started", "on port 3000");
logMessage("ERROR", "Connection failed");
```

**Typing rest parameters:**

```typescript
// Array of specific type
function max(...numbers: number[]): number {
  return Math.max(...numbers);
}

// Tuple with rest
function buildUrl(base: string, ...segments: string[]): string {
  return base + "/" + segments.join("/");
}

buildUrl("https://api.example.com", "users", "123", "posts");
// "https://api.example.com/users/123/posts"
```

**Rest with tuple types:**

```typescript
function connect(...args: [host: string, port: number, ssl?: boolean]) {
  const [host, port, ssl = false] = args;
  return { host, port, ssl };
}

connect("localhost", 3000);
connect("example.com", 443, true);
```

**Variadic tuple types (advanced):**

```typescript
function concat<T extends unknown[], U extends unknown[]>(
  arr1: [...T],
  arr2: [...U]
): [...T, ...U] {
  return [...arr1, ...arr2];
}

const result = concat([1, 2], ["a", "b"]);
// Type: [number, number, string, string]
```

---

### 5. Function Overloading (CRITICAL!)

**What it means:**

- Multiple function signatures with one implementation
- TypeScript checks which overload matches the call
- Implementation signature must be compatible with all overloads

**Basic overloading:**

```typescript
// Overload signatures
function parse(value: string): object;
function parse(value: number): string;

// Implementation signature
function parse(value: string | number): object | string {
  if (typeof value === "string") {
    return JSON.parse(value);
  }
  return String(value);
}

const obj = parse('{"name": "Alice"}'); // Type: object
const str = parse(42); // Type: string
```

**Why overloading matters:**

```typescript
// Without overloading - union return type
function createElement1(tag: string): HTMLElement {
  return document.createElement(tag);
}

const div1 = createElement1("div"); // Type: HTMLElement
// div1.innerHTML // Need type assertion to access specific properties

// With overloading - specific return types
function createElement(tag: "div"): HTMLDivElement;
function createElement(tag: "span"): HTMLSpanElement;
function createElement(tag: "a"): HTMLAnchorElement;
function createElement(tag: string): HTMLElement;

function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

const div = createElement("div"); // Type: HTMLDivElement
div.innerHTML = "Hello"; // ✅ Knows it's a div
const span = createElement("span"); // Type: HTMLSpanElement
const link = createElement("a"); // Type: HTMLAnchorElement
link.href = "https://example.com"; // ✅ Knows it's an anchor
```

**Overloading with different parameters:**

```typescript
// Different parameter counts
function makeDate(timestamp: number): Date;
function makeDate(year: number, month: number, day: number): Date;

function makeDate(yearOrTimestamp: number, month?: number, day?: number): Date {
  if (month !== undefined && day !== undefined) {
    return new Date(yearOrTimestamp, month, day);
  }
  return new Date(yearOrTimestamp);
}

const date1 = makeDate(1234567890); // From timestamp
const date2 = makeDate(2024, 0, 1); // From year, month, day
```

**Overloading with different types:**

```typescript
function reverse(value: string): string;
function reverse<T>(value: T[]): T[];

function reverse<T>(value: string | T[]): string | T[] {
  if (typeof value === "string") {
    return value.split("").reverse().join("");
  }
  return value.slice().reverse();
}

const str = reverse("hello"); // Type: string
const arr = reverse([1, 2, 3]); // Type: number[]
```

**Common pitfalls:**

```typescript
// ❌ Implementation signature is visible (avoid this)
function bad(x: number): number;
function bad(x: string): string;
function bad(x: number | string): number | string {
  // ⚠️ This signature is callable!
  return typeof x === "number" ? x + 1 : x + "!";
}

// const result = bad(true); // Would compile but wrong!

// ✅ Implementation signature should be most general
function good(x: number): number;
function good(x: string): string;
function good(x: any): any {
  return typeof x === "number" ? x + 1 : x + "!";
}
```

---

### 6. this Parameter Type

**What it means:**

- Explicitly type the `this` context of a function
- First parameter named `this` (not a real parameter)
- Ensures function called with correct context

**Basic this typing:**

```typescript
interface User {
  name: string;
  email: string;
  greet(this: User): void;
}

const user: User = {
  name: "Alice",
  email: "alice@example.com",
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  },
};

user.greet(); // ✅ Works
const greetFn = user.greet;
// greetFn(); // ❌ Error: 'this' context required
```

**this in standalone functions:**

```typescript
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
```

**this with arrow functions:**

```typescript
interface Component {
  name: string;
  handleClick: () => void;
}

// Arrow functions don't have their own 'this'
const button: Component = {
  name: "Submit Button",
  handleClick: function () {
    // Regular function - 'this' is the button object
    console.log(this.name);

    // Arrow function - inherits 'this' from enclosing scope
    setTimeout(() => {
      console.log(this.name); // ✅ Still refers to button
    }, 1000);
  },
};
```

**this parameters in callbacks:**

```typescript
interface DB {
  query(this: DB, sql: string): void;
}

class Database implements DB {
  private connection = "connected";

  query(this: Database, sql: string) {
    console.log(`Executing: ${sql} on ${this.connection}`);
  }
}

const db = new Database();
db.query("SELECT * FROM users"); // ✅

const queryFn = db.query;
// queryFn("SELECT * FROM users"); // ❌ Error: 'this' context required

// Fix with bind
const boundQuery = db.query.bind(db);
boundQuery("SELECT * FROM users"); // ✅
```

**ThisParameterType and OmitThisParameter utilities:**

```typescript
function greet(this: { name: string }, greeting: string) {
  return `${greeting}, ${this.name}!`;
}

type GreetThis = ThisParameterType<typeof greet>;
// Type: { name: string }

type GreetFn = OmitThisParameter<typeof greet>;
// Type: (greeting: string) => string
```

---

### 7. void vs undefined Returns

**What it means:**

- `void` = "I don't care about the return value"
- `undefined` = "I explicitly return undefined"
- Subtle but important difference

**void return type:**

```typescript
function logMessage(msg: string): void {
  console.log(msg);
  // Can return undefined (but not required)
  // return undefined; // ✅ Allowed
  // return; // ✅ Allowed
  // return null; // ❌ Error
}

// Caller can't use return value meaningfully
const result: void = logMessage("Hello");
// const value = result.toUpperCase(); // ❌ Can't use void
```

**undefined return type:**

```typescript
function findUser(id: number): User | undefined {
  if (id === 1) {
    return { id: 1, name: "Alice" };
  }
  return undefined; // Must explicitly return
}

const user = findUser(2);
if (user !== undefined) {
  console.log(user.name);
}
```

**Why void exists:**

```typescript
// void allows any return value in implementation
type VoidFunc = () => void;

const fn1: VoidFunc = () => {
  return 123; // ✅ Allowed! Return value ignored
};

const fn2: VoidFunc = () => {
  return "hello"; // ✅ Allowed! Return value ignored
};

// Useful for callbacks
function forEach(arr: number[], callback: (item: number) => void) {
  for (const item of arr) {
    callback(item);
  }
}

// Can pass function that returns something
forEach([1, 2, 3], (item) => item * 2); // ✅ Works, return value ignored
```

**undefined doesn't work the same way:**

```typescript
type UndefinedFunc = () => undefined;

// const fn3: UndefinedFunc = () => 123; // ❌ Error: Must return undefined
const fn4: UndefinedFunc = () => undefined; // ✅

const fn5: UndefinedFunc = () => {
  // Must explicitly return undefined
  return;
};
```

**Practical difference:**

```typescript
// Array.prototype.forEach expects void callback
[1, 2, 3].forEach((num) => {
  return num * 2; // ✅ Return value ignored
});

// Array.prototype.map expects returned value
[1, 2, 3].map((num) => {
  console.log(num);
  // Implicitly returns undefined, which is added to result array
});
```

---

### 8. Function Type Compatibility

**What it means:**

- When can one function type be assigned to another?
- Parameters are contravariant (more general accepted)
- Return types are covariant (more specific accepted)

**Parameter contravariance:**

```typescript
type Handler = (event: MouseEvent) => void;

// ✅ More general parameter accepted
const handler1: Handler = (event: Event) => {
  // Works because MouseEvent is an Event
};

// ❌ More specific parameter rejected
// const handler2: Handler = (event: PointerEvent) => {
//   // Error: PointerEvent is more specific than MouseEvent
// };
```

**Return type covariance:**

```typescript
type Factory = () => Animal;

class Animal {
  name: string = "";
}

class Dog extends Animal {
  bark() {}
}

// ✅ More specific return accepted
const factory1: Factory = (): Dog => {
  return new Dog();
};

// ❌ More general return rejected
// const factory2: Factory = (): Object => {
//   return {};
// };
```

**Parameter count:**

```typescript
type Callback = (a: number, b: number) => void;

// ✅ Fewer parameters accepted
const cb1: Callback = (a: number) => {
  console.log(a);
};

// ✅ Can ignore parameters
const cb2: Callback = () => {
  console.log("Called");
};

// ❌ More parameters rejected
// const cb3: Callback = (a: number, b: number, c: number) => {
//   console.log(a, b, c);
// };
```

**Practical example - Array methods:**

```typescript
const numbers = [1, 2, 3, 4, 5];

// forEach provides: (value, index, array)
numbers.forEach((value) => {
  // ✅ Can ignore index and array
  console.log(value);
});

numbers.forEach((value, index) => {
  // ✅ Can ignore array
  console.log(value, index);
});
```

---

## 🎤 Top Interview Questions & Model Answers

### Q1: What's the difference between void and undefined return types?

**Answer:**

> "`void` means 'I don't care about the return value' and allows the function to return anything - the return value is just ignored. `undefined` means 'I explicitly return undefined' and the function must return undefined or nothing. The key difference is that void is used for callbacks where we don't care what's returned, like `Array.forEach`. A function typed as `() => void` can actually return a number or string, but TypeScript will ignore it. A function typed as `() => undefined` must explicitly return undefined or use a bare return statement."

---

### Q2: How does function overloading work in TypeScript?

**Answer:**

> "Function overloading lets you define multiple type signatures for a single implementation. You write several overload signatures followed by one implementation that handles all cases. TypeScript uses the overloads to type-check calls, but only the implementation signature is used at runtime. For example, you might overload `createElement` to return `HTMLDivElement` for 'div', `HTMLSpanElement` for 'span', etc., giving you precise types. The implementation signature must be general enough to handle all overloads. This is crucial for library code where you want different return types based on input."

---

### Q3: When should you explicitly type function return values?

**Answer:**

> "I explicitly type return values in three cases: First, for public API functions where the return type serves as documentation and a contract. Second, for complex functions where inference might not catch logic errors - explicit types act as a check. Third, when inference gives the wrong type, like inferring a union when you want a specific type. For simple, internal functions like `const double = (n: number) => n * 2`, I let TypeScript infer the return type since it's obvious. The key is balancing safety and documentation with avoiding redundant annotations."

---

### Q4: What's the difference between optional and default parameters?

**Answer:**

> "Optional parameters use `?` and can be completely omitted, making their type `Type | undefined` inside the function body. Default parameters have a value if not provided, and they're never undefined in the function body. For example, `function greet(name: string, greeting?: string)` requires checking if greeting exists, while `function greet(name: string, greeting: string = 'Hello')` can use greeting directly. Default parameters are more convenient because you don't need null checks, while optional parameters give callers more explicit control. Both automatically make the parameter optional for callers."

---

### Q5: How do rest parameters work with TypeScript?

**Answer:**

> "Rest parameters collect remaining arguments into an array using the `...` syntax. In TypeScript, you type them as an array: `function sum(...numbers: number[])`. They must be the last parameter and are typed as `number[]` inside the function. You can use tuple types for more precise rest parameters, like `...args: [string, number, boolean?]` for exactly those types in order. Rest parameters are useful for variadic functions like mathematical operations, and they work well with the spread operator when calling other functions. TypeScript ensures type safety across the spread operation."

---

## 🔑 Must Know Checklist

### ✅ Critical (Always asked)

- ✅ Function parameter and return type annotations
- ✅ Function overloading patterns
- ✅ void vs undefined return types
- ✅ Optional vs default parameters

### ✅ Should Know (Often asked)

- ✅ Rest parameters typing
- ✅ this parameter type
- ✅ Function type expressions
- ✅ Function type compatibility

### ✅ Nice to Know (Senior level)

- [ ] Variadic tuple types
- [ ] Parameter contravariance
- [ ] ThisParameterType utility
- [ ] Generic function constraints

---

## 🚨 Common Mistakes to Avoid

### 1. Not typing parameters

```typescript
// ❌ Parameters need types!
function greet(name) {
  return `Hello, ${name}`;
}

// ✅ Always type parameters
function greet(name: string): string {
  return `Hello, ${name}`;
}
```

### 2. Optional parameter order

```typescript
// ❌ Optional must come last
// function bad(optional?: string, required: number) { }

// ✅ Required first, optional last
function good(required: number, optional?: string) {}
```

### 3. Overload implementation visibility

```typescript
// ❌ Implementation signature too specific
function parse(value: string): object;
function parse(value: string | number): object | string {
  // Callable!
  // ...
}

// ✅ Implementation should be general
function parse(value: string): object;
function parse(value: any): any {
  // ...
}
```

### 4. Confusing void and undefined

```typescript
// ❌ Expecting void to enforce no return
function process(): void {
  return 42; // ✅ Allowed! void ignores return value
}

// ✅ Use undefined if you need no meaningful return
function process(): undefined {
  // Must return undefined or nothing
  return;
}
```
