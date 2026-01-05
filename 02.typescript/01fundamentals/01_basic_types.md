# Basic Types

## 🎯 Key Concepts

### 1. any vs unknown (CRITICAL!)

**What it means:**

- `any` disables type checking completely (dangerous)
- `unknown` is the type-safe alternative that requires type narrowing

**The Problem with `any`:**

```typescript
let value: any = "hello";
value = 42;
value.doesNotExist(); // ❌ No compile error, crashes at runtime!
value.toUpperCase(); // Runtime error if not a string
```

**The Solution with `unknown`:**

```typescript
let value: unknown = "hello";
// value.toUpperCase(); // ❌ Error: Object is of type 'unknown'

// Must narrow type first
if (typeof value === "string") {
  value.toUpperCase(); // ✅ Now it's safe!
}
```

**When to use:**

- ✅ User input validation
- ✅ API responses before parsing
- ✅ Error handling
- ❌ NEVER use `any` unless migrating JS code

**Interview Gold:** `unknown` is the #1 way to show you understand TypeScript safety!

---

### 2. void vs undefined vs never

**void - "I don't return anything meaningful":**

```typescript
function logMessage(msg: string): void {
  console.log(msg);
  // return undefined; // Optional
}
```

**undefined - "I return the value undefined":**

```typescript
function maybeReturn(): string | undefined {
  if (Math.random() > 0.5) {
    return "value";
  }
  return undefined; // Explicitly return undefined
}
```

**never - "I never return at all":**

```typescript
function throwError(msg: string): never {
  throw new Error(msg); // Never returns
}

function infiniteLoop(): never {
  while (true) {} // Never exits
}
```

**Key Differences:**

- `void` = function completes but doesn't return useful value
- `undefined` = function explicitly returns undefined
- `never` = function never completes (throws or loops forever)

**Exhaustiveness Checking with `never`:**

```typescript
type Shape = "circle" | "square";

function getArea(shape: Shape): number {
  switch (shape) {
    case "circle":
      return 3.14;
    case "square":
      return 4;
    default:
      const _exhaustive: never = shape; // Error if we missed a case!
      return _exhaustive;
  }
}
```

---

### 3. Literal Types (CRITICAL!)

**What it means:**

- Types that are specific values, not general types
- Creates compile-time validation for exact values

**String Literals:**

```typescript
type Status = "pending" | "approved" | "rejected";
let orderStatus: Status = "pending"; // ✅
// let orderStatus: Status = "invalid"; // ❌ Error!
```

**Why they're powerful:**

- Self-documenting code
- Prevents typos
- Better than magic strings
- Powers discriminated unions

**Practical Example:**

```typescript
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

function makeRequest(url: string, method: HTTPMethod) {
  // TypeScript ensures method is valid
}

makeRequest("/api/users", "GET"); // ✅
// makeRequest("/api/users", "INVALID"); // ❌ Error!
```

**Template Literal Types:**

```typescript
type EmailLocale = "en" | "es" | "fr";
type EmailType = "welcome" | "reset";
type EmailTemplate = `${EmailLocale}_${EmailType}`;
// Result: "en_welcome" | "en_reset" | "es_welcome" | ...

let template: EmailTemplate = "en_welcome"; // ✅
// let template: EmailTemplate = "de_welcome"; // ❌ Error!
```

**Interview tip:** Show you understand how literals enable type-safe APIs!

---

### 4. Type Assertions (Use Carefully!)

**What it means:**

- Telling TypeScript "trust me, I know better than you"
- Does NOT perform any runtime checking or conversion

**The `as` syntax:**

```typescript
let someValue: unknown = "this is a string";
let strLength: number = (someValue as string).length;
```

**When to use:**

- DOM manipulation (you know element type)
- After validation TypeScript doesn't see
- Type narrowing when compiler can't infer

**When NOT to use:**

- As a workaround for type errors (fix the types instead!)
- When type guards would work
- For type conversions (use proper parsing)

**Non-null Assertion (!):**

```typescript
function processValue(value: string | null) {
  console.log(value!.toUpperCase()); // "I promise it's not null"
}
```

**Dangers:**

```typescript
const element = document.getElementById("id") as HTMLCanvasElement;
element.getContext("2d"); // Runtime error if it's not a canvas!
```

**Better alternative - Type Guards:**

```typescript
if (element instanceof HTMLCanvasElement) {
  element.getContext("2d"); // ✅ Safe!
}
```

---

### 5. Const Assertions (`as const`)

**What it means:**

- Creates deeply immutable literal types
- Prevents type widening
- Makes TypeScript as specific as possible

**The Problem - Type Widening:**

```typescript
let status = "pending"; // Type: string (widened)
const status2 = "pending"; // Type: "pending" (literal)

type Status = "pending" | "complete";
// let current: Status = status; // ❌ Error: string not assignable
let current: Status = status2; // ✅ Works!
```

**The Solution - `as const`:**

```typescript
let config = {
  host: "localhost",
  port: 8080,
}; // Type: { host: string; port: number }

const config2 = {
  host: "localhost",
  port: 8080,
} as const; // Type: { readonly host: "localhost"; readonly port: 8080 }

// config2.port = 3000; // ❌ Error: Cannot assign to readonly
```

**Array to Tuple:**

```typescript
let colors1 = ["red", "green", "blue"]; // Type: string[]
const colors2 = ["red", "green", "blue"] as const; // Type: readonly ["red", "green", "blue"]
```

**Enum-like Objects:**

```typescript
const Direction = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
} as const;

type DirectionValue = (typeof Direction)[keyof typeof Direction];
// Type: "UP" | "DOWN" | "LEFT" | "RIGHT"

function move(dir: DirectionValue) {
  console.log(`Moving ${dir}`);
}

move(Direction.UP); // ✅
// move("INVALID"); // ❌ Error!
```

**When to use:**

- Configuration objects that shouldn't change
- Creating enum-like objects
- When you want narrowest possible types
- Preventing accidental mutations

---

### 6. strictNullChecks (Must Enable!)

**What it means:**

- When enabled, `null` and `undefined` are NOT assignable to other types
- Must explicitly handle nullable values

**Without strictNullChecks (BAD):**

```typescript
let name: string = null; // ❌ Allowed, but dangerous!
function greet(name: string) {
  console.log(name.toUpperCase()); // Runtime error if null!
}
```

**With strictNullChecks (GOOD):**

```typescript
// let name: string = null; // ❌ Error: Type 'null' not assignable

let name: string | null = null; // ✅ Explicit
if (name !== null) {
  console.log(name.toUpperCase()); // ✅ Safe!
}

// Or use optional chaining
console.log(name?.toUpperCase());
```

**Interview tip:** Always enable strict mode - shows you value type safety!

---

## 🎤 Top Interview Questions & Model Answers

### Q1: What's the difference between `any` and `unknown`?

**Answer:**

> "`any` completely disables type checking - you can do anything with it, which defeats the purpose of TypeScript. `unknown` is the type-safe alternative. It tells TypeScript 'I don't know what this is yet, but I'll check before using it.' With `unknown`, you must narrow the type using type guards before performing operations. I always prefer `unknown` for truly dynamic data like API responses or user input, because it forces me to validate before using."

---

### Q2: When would you use the `never` type?

**Answer:**

> "`never` represents values that never occur. I use it in three main scenarios: First, functions that always throw errors and never return normally. Second, exhaustiveness checking in switch statements to ensure all union cases are handled - if I add a new case and forget to handle it, TypeScript will error. Third, for impossible states in type-level programming. The `never` type is TypeScript's way of saying 'this code should never be reached' or 'this case should never happen.'"

---

### Q3: What are literal types and why are they useful?

**Answer:**

> "Literal types are types that represent specific values rather than general types. Instead of `string`, I might use `'pending' | 'approved' | 'rejected'`. They're incredibly useful because they provide compile-time validation, prevent typos, make code self-documenting, and enable powerful patterns like discriminated unions. For example, an HTTP method type of `'GET' | 'POST' | 'PUT' | 'DELETE'` is much safer than just `string` because TypeScript will catch invalid values at compile time."

---

### Q4: What does `as const` do and when would you use it?

**Answer:**

> "`as const` creates the most specific, deeply readonly type possible. It prevents type widening and makes all properties readonly. I use it for configuration objects that shouldn't change, creating enum-like objects with string literals, or when I want tuple types instead of arrays. For example, `['red', 'green'] as const` gives type `readonly ['red', 'green']` instead of `string[]`. This is especially useful when building type-safe APIs where we want to derive types from constant values."

---

### Q5: When should you use type assertions?

**Answer:**

> "Type assertions should be used sparingly, only when you have information the compiler doesn't. Common valid cases include DOM manipulation where you know the element type, or after validation that TypeScript can't detect. However, I avoid using assertions as a quick fix for type errors - that usually means the types are wrong. I prefer type guards and proper type narrowing when possible, because assertions bypass type safety and can cause runtime errors if used incorrectly."

---

### Q6: Explain type widening in TypeScript

**Answer:**

> "Type widening is when TypeScript automatically assigns a more general type than you might expect. For example, `let status = 'pending'` gets type `string`, not the literal `'pending'`. This happens because `let` allows reassignment, so TypeScript widens to accommodate future values. Using `const` prevents widening for primitives, giving you the literal type. For objects and arrays, you can use `as const` to prevent widening deeply. Understanding widening is important because it affects type compatibility and can cause errors when working with unions of literals."

---

## 🔑 Must Know Checklist

### ✅ Critical (Always asked)

- ✅ Difference between `any` and `unknown`
- ✅ When and how to use `never` type
- ✅ Literal types and their use cases
- ✅ Type assertions and their dangers

### ✅ Should Know (Often asked)

- ✅ `void` vs `undefined` vs `never`
- ✅ `as const` for preventing widening
- ✅ Type widening and narrowing
- ✅ strictNullChecks importance

### ✅ Nice to Know (Senior level)

- [ ] Template literal types
- [ ] Structural typing vs nominal typing
- [ ] Symbol and BigInt use cases
- [ ] Type compatibility rules

---

## 🚨 Common Mistakes to Avoid

### 1. Using `any` Everywhere

```typescript
// ❌ NEVER do this
function processData(data: any) {
  return data.value.toUpperCase(); // Runtime errors waiting to happen
}

// ✅ Use unknown and validate
function processData(data: unknown) {
  if (typeof data === "object" && data !== null && "value" in data) {
    const obj = data as { value: unknown };
    if (typeof obj.value === "string") {
      return obj.value.toUpperCase(); // Safe!
    }
  }
  throw new Error("Invalid data");
}
```

### 2. Not Enabling Strict Mode

```typescript
// ❌ Without strict mode
let name: string = null; // Compiles but dangerous

// ✅ With strict mode in tsconfig
// let name: string = null; // Error caught at compile time
let name: string | null = null; // Explicit and safe
```

### 3. Type Assertion Instead of Narrowing

```typescript
// ❌ Unsafe assertion
function getLength(value: string | string[]) {
  return (value as string).length; // Crashes if array!
}

// ✅ Proper type guard
function getLength(value: string | string[]) {
  if (typeof value === "string") {
    return value.length;
  }
  return value.length;
}
```

### 4. Forgetting Exhaustiveness Checks

```typescript
type Status = "pending" | "approved" | "rejected";

// ❌ Missing case, no error
function handleStatus(status: Status) {
  switch (status) {
    case "pending":
      return "⏳";
    case "approved":
      return "✅";
    // Missing "rejected" case!
  }
}

// ✅ Exhaustiveness check
function handleStatus(status: Status) {
  switch (status) {
    case "pending":
      return "⏳";
    case "approved":
      return "✅";
    case "rejected":
      return "❌";
    default:
      const _: never = status; // Error if case missed!
      return _;
  }
}
```
