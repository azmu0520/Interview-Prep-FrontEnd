# Objects and Interfaces - Deep Dive

## 🎯 Key Concepts

### 1. Interface vs Type Alias (CRITICAL!)

**What it means:**

- Both can describe object shapes, but they have important differences
- Interfaces are extendable and can be merged
- Type aliases are more flexible but can't be reopened

**Interface:**

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// ✅ Can extend
interface Admin extends User {
  permissions: string[];
}

// ✅ Can be reopened (declaration merging)
interface User {
  createdAt: Date; // Adds to existing User interface
}
```

**Type Alias:**

```typescript
type Product = {
  id: number;
  name: string;
  price: number;
};

// ✅ Can intersect
type DiscountedProduct = Product & {
  discount: number;
};

// ❌ Cannot be reopened
// type Product = { ... } // Error: Duplicate identifier
```

**When to use Interface:**

- ✅ Defining object shapes (especially public API)
- ✅ When you might extend later
- ✅ When you want declaration merging
- ✅ Class implementation contracts

**When to use Type:**

- ✅ Union types: `type Status = 'active' | 'inactive'`
- ✅ Intersection types: `type A = B & C`
- ✅ Tuple types: `type Point = [number, number]`
- ✅ Mapped types: `type Readonly<T> = { readonly [P in keyof T]: T[P] }`
- ✅ Conditional types: `type IsString<T> = T extends string ? true : false`

**Interview Gold:** "I use interfaces for object shapes and public APIs because they're more extensible and support declaration merging. I use type aliases for unions, intersections, and complex type manipulations that interfaces can't handle."

---

### 2. Optional Properties (?)

**What it means:**

- Properties that may or may not exist on an object
- Different from properties that can be `undefined`

**Basic syntax:**

```typescript
interface User {
  id: number;
  name: string;
  email?: string; // Optional property
  age?: number;
}

const user1: User = {
  id: 1,
  name: "Alice",
  // email and age not required
};

const user2: User = {
  id: 2,
  name: "Bob",
  email: "bob@example.com",
  age: 30,
};
```

**Optional vs Undefined:**

```typescript
interface Config {
  host: string;
  port?: number; // Can be missing OR number
  timeout: number | undefined; // Must be present, can be undefined
}

const config1: Config = {
  host: "localhost",
  // port can be omitted
  // timeout: undefined // ❌ Error: Property 'timeout' is missing
};

const config2: Config = {
  host: "localhost",
  timeout: undefined, // ✅ Required, but can be undefined
};

const config3: Config = {
  host: "localhost",
  port: 3000,
  timeout: 5000,
};
```

**Working with optional properties:**

```typescript
function greetUser(user: User) {
  // ❌ Email might be undefined
  // console.log(user.email.toLowerCase());

  // ✅ Check before using
  if (user.email) {
    console.log(user.email.toLowerCase());
  }

  // ✅ Optional chaining
  console.log(user.email?.toLowerCase());

  // ✅ Nullish coalescing
  const email = user.email ?? "no-email@example.com";
}
```

**Default values:**

```typescript
interface Options {
  timeout?: number;
  retries?: number;
  cache?: boolean;
}

function fetchData(options: Options = {}) {
  const timeout = options.timeout ?? 3000;
  const retries = options.retries ?? 3;
  const cache = options.cache ?? true;

  console.log({ timeout, retries, cache });
}

fetchData(); // Uses all defaults
fetchData({ timeout: 5000 }); // Override timeout only
```

---

### 3. Readonly Properties

**What it means:**

- Properties that cannot be reassigned after initialization
- Only prevents reassignment, not mutation of nested objects
- Checked at compile-time only

**Basic readonly:**

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}

const point: Point = { x: 10, y: 20 };
// point.x = 30; // ❌ Error: Cannot assign to 'x' because it is read-only
```

**Readonly with objects (shallow):**

```typescript
interface User {
  readonly id: number;
  name: string;
  readonly createdAt: Date;
}

const user: User = {
  id: 1,
  name: "Alice",
  createdAt: new Date(),
};

user.name = "Alicia"; // ✅ Allowed
// user.id = 2; // ❌ Error: Cannot assign to readonly
// user.createdAt = new Date(); // ❌ Error: Cannot assign to readonly

// ⚠️ But can mutate the Date object itself!
user.createdAt.setFullYear(2020); // ✅ Allowed (mutation, not reassignment)
```

**Deep readonly (using utility type):**

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

interface Config {
  server: {
    host: string;
    port: number;
  };
  features: string[];
}

const config: DeepReadonly<Config> = {
  server: { host: "localhost", port: 3000 },
  features: ["auth", "api"],
};

// config.server.port = 8080; // ❌ Error: readonly
// config.features.push("cache"); // ❌ Error: readonly array
```

**Readonly arrays:**

```typescript
interface Team {
  readonly members: readonly string[];
}

const team: Team = {
  members: ["Alice", "Bob"],
};

// team.members.push("Charlie"); // ❌ Error: readonly array
// team.members[0] = "Alicia"; // ❌ Error: readonly array
```

**When to use readonly:**

- ✅ IDs and timestamps
- ✅ Configuration objects
- ✅ Immutable data structures
- ✅ Props in React components
- ✅ Preventing accidental mutations

---

### 4. Index Signatures

**What it means:**

- Define types for objects with dynamic property names
- Allows any string/number/symbol key
- All properties must match the signature

**Basic index signature:**

```typescript
interface StringMap {
  [key: string]: string;
}

const translations: StringMap = {
  hello: "Hola",
  goodbye: "Adiós",
  thanks: "Gracias",
};

// Can add any string key
translations["welcome"] = "Bienvenido"; // ✅
// translations["count"] = 42; // ❌ Error: must be string
```

**Number index:**

```typescript
interface NumberArray {
  [index: number]: string;
}

const colors: NumberArray = ["red", "green", "blue"];
console.log(colors[0]); // "red"
```

**Combining with known properties:**

```typescript
interface Dictionary {
  // Known properties
  length: number;

  // Index signature
  [key: string]: string | number; // Must include known property types!
}

const dict: Dictionary = {
  length: 3,
  apple: "A fruit",
  count: 42,
};
```

**Common pitfall:**

```typescript
interface Config {
  host: string;
  port: number;
  [key: string]: string; // ❌ Error: 'number' is not assignable to string
}

// ✅ Fix: Include number in index signature
interface Config {
  host: string;
  port: number;
  [key: string]: string | number;
}
```

**Practical use cases:**

```typescript
// HTTP headers
interface Headers {
  [header: string]: string;
}

const headers: Headers = {
  "Content-Type": "application/json",
  Authorization: "Bearer token123",
};

// Cache with any key
interface Cache<T> {
  [key: string]: T;
}

const userCache: Cache<User> = {
  user_1: { id: 1, name: "Alice" },
  user_2: { id: 2, name: "Bob" },
};

// API response with dynamic fields
interface APIResponse {
  status: number;
  message: string;
  [field: string]: unknown; // Additional fields
}
```

**Better alternatives (when possible):**

```typescript
// ✅ Use Record utility type
type StringMap = Record<string, string>;

// ✅ Use Map for runtime dynamic keys
const map = new Map<string, string>();
map.set("hello", "Hola");

// ✅ Use specific union types
type AllowedKeys = "name" | "email" | "age";
type UserData = Record<AllowedKeys, string>;
```

---

### 5. Extending Interfaces

**What it means:**

- Create new interfaces based on existing ones
- Inherit all properties from parent interface(s)
- Can extend multiple interfaces

**Single inheritance:**

```typescript
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  employeeId: number;
  department: string;
}

const emp: Employee = {
  name: "Alice",
  age: 30,
  employeeId: 12345,
  department: "Engineering",
  // Must have all properties from Person AND Employee
};
```

**Multiple inheritance:**

```typescript
interface Printable {
  print(): void;
}

interface Loggable {
  log(): void;
}

interface Document extends Printable, Loggable {
  title: string;
  content: string;
}

const doc: Document = {
  title: "Report",
  content: "...",
  print() {
    console.log(this.title, this.content);
  },
  log() {
    console.log(`[LOG] ${this.title}`);
  },
};
```

**Overriding properties (narrowing):**

```typescript
interface Animal {
  name: string;
  legs: number;
}

// ✅ Can narrow types
interface Dog extends Animal {
  legs: 4; // Narrows number to literal 4
  breed: string;
}

const dog: Dog = {
  name: "Buddy",
  legs: 4, // Must be exactly 4
  breed: "Labrador",
};
```

**Extending with modifications:**

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Add optional properties
interface UserProfile extends User {
  bio?: string;
  avatar?: string;
}

// Override with stricter type
interface VerifiedUser extends User {
  email: string; // Already string, but could narrow further
  verified: true; // Literal type
}
```

**Type vs Interface extension:**

```typescript
// Interface extends interface
interface A extends B {}

// Type extends using intersection
type C = B & { newProp: string };

// Interface extends type
interface D extends SomeType {}

// Type extends interface
type E = SomeInterface & { newProp: string };
```

---

### 6. Excess Property Checking

**What it means:**

- TypeScript checks for extra properties in object literals
- Only applies to fresh object literals, not variables
- Prevents typos and incorrect property names

**The behavior:**

```typescript
interface Point {
  x: number;
  y: number;
}

// ❌ Excess property error
const p1: Point = {
  x: 10,
  y: 20,
  z: 30, // Error: 'z' does not exist in type 'Point'
};

// ✅ No error when assigning from variable (structural typing)
const obj = { x: 10, y: 20, z: 30 };
const p2: Point = obj; // ✅ Allowed! Only x and y are checked
```

**Why this matters:**

```typescript
interface Options {
  timeout?: number;
  retries?: number;
}

function fetchData(options: Options) {
  // ...
}

// ❌ Catches typos
fetchData({
  timeout: 3000,
  retrys: 3, // Error: Did you mean 'retries'?
});

// ⚠️ Doesn't catch typos in variables
const opts = { timeout: 3000, retrys: 3 };
fetchData(opts); // ✅ No error (but bug exists!)
```

**Workarounds (when you need extra properties):**

**1. Index signature:**

```typescript
interface FlexibleOptions {
  timeout?: number;
  [key: string]: unknown;
}

const options: FlexibleOptions = {
  timeout: 3000,
  customProp: "value", // ✅ Allowed
};
```

**2. Type assertion:**

```typescript
const point = {
  x: 10,
  y: 20,
  z: 30,
} as Point; // ⚠️ Bypasses checking
```

**3. Intermediate variable:**

```typescript
const temp = { x: 10, y: 20, z: 30 };
const point: Point = temp; // Uses structural typing
```

**4. Intersection type:**

```typescript
type Point3D = Point & { z: number };

const point: Point3D = {
  x: 10,
  y: 20,
  z: 30,
};
```

---

### 7. Interface Declaration Merging

**What it means:**

- Multiple interface declarations with same name automatically merge
- Only works with interfaces, not type aliases
- Useful for extending third-party types

**Basic merging:**

```typescript
interface User {
  name: string;
}

interface User {
  email: string;
}

// Merged result:
// interface User {
//   name: string;
//   email: string;
// }

const user: User = {
  name: "Alice",
  email: "alice@example.com",
};
```

**Augmenting modules:**

```typescript
// Extend Express Request
import "express";

declare module "express" {
  interface Request {
    user?: {
      id: string;
      role: string;
    };
  }
}

// Now Request.user is typed everywhere
```

**Augmenting global types:**

```typescript
declare global {
  interface Window {
    myApp: {
      version: string;
      config: Record<string, unknown>;
    };
  }
}

// Now window.myApp is typed
window.myApp = {
  version: "1.0.0",
  config: {},
};
```

**Merging with different types (error):**

```typescript
interface Data {
  value: string;
}

// ❌ Error: Subsequent property declarations must have the same type
interface Data {
  value: number; // Can't change type of existing property
}
```

**Merging methods:**

```typescript
interface Calculator {
  add(a: number, b: number): number;
}

interface Calculator {
  subtract(a: number, b: number): number;
}

// Both methods available
const calc: Calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
};
```

---

## 🎤 Top Interview Questions & Model Answers

### Q1: When should you use interface vs type?

**Answer:**

> "I use interfaces for defining object shapes, especially for public APIs and class contracts, because they're more extensible through declaration merging and inheritance. I use type aliases for unions, intersections, tuples, and complex type manipulations that interfaces can't handle. For example, `type Status = 'active' | 'inactive'` or `type ReadonlyUser = Readonly<User>` must be types. But for a User object shape, I'd use an interface because it can be extended later and supports better error messages."

---

### Q2: What are index signatures and when would you use them?

**Answer:**

> "Index signatures allow defining types for objects with dynamic property names. You use `[key: string]: Type` syntax. They're useful for dictionaries, caches, or API responses with unknown fields. However, they have limitations - all properties must match the signature. In modern TypeScript, I often prefer `Record<string, Type>` utility type or Map objects for better type safety. Index signatures are best when you truly have arbitrary string keys and don't know them at compile time."

---

### Q3: Explain excess property checking. Why does it behave differently with object literals vs variables?

**Answer:**

> "Excess property checking catches typos in object literals by flagging properties that don't exist in the target type. It only applies to fresh object literals because that's when you're most likely to make mistakes. When you assign from a variable, TypeScript uses structural typing - it only checks that required properties exist and match. This is intentional: the variable might be shared with other code that needs those extra properties. This dual behavior helps catch errors while maintaining structural typing flexibility."

---

### Q4: What's the difference between optional properties and properties that can be undefined?

**Answer:**

> "An optional property with `?` can be completely absent from the object, while a property typed as `Type | undefined` must be present but its value can be undefined. For example, `email?: string` allows omitting email entirely, but `email: string | undefined` requires the email key to exist, even if set to undefined. This affects object spreading, JSON serialization, and the `in` operator. Optional properties are more flexible for configuration objects where certain keys may not exist at all."

---

### Q5: How does interface declaration merging work and when is it useful?

**Answer:**

> "Interface declaration merging combines multiple interface declarations with the same name into a single interface. This is unique to interfaces - types can't do this. It's incredibly useful for increasing third-party library types, like adding custom properties to Express's Request object or extending Window for global variables. You declare a module with the same name and add your properties. This allows enhancing types without modifying the original library code, which is essential for type-safe library extensions."

---

## 🔑 Must Know Checklist

### ✅ Critical (Always asked)

- ✅ Interface vs type - when to use each
- ✅ Optional properties and their behavior
- ✅ Readonly properties and limitations
- ✅ Excess property checking

### ✅ Should Know (Often asked)

- ✅ Index signatures and alternatives
- ✅ Extending interfaces
- ✅ Declaration merging
- ✅ Optional vs undefined types

### ✅ Nice to Know (Senior level)

- [ ] Deep readonly patterns
- [ ] Module augmentation
- [ ] Structural vs nominal typing
- [ ] Index signature conflicts

---

## 🚨 Common Mistakes to Avoid

### 1. Confusing optional with undefined

```typescript
// ❌ These are different!
interface Wrong {
  email?: string; // Can be missing
  age: number | undefined; // Must be present
}
```

### 2. Shallow readonly assumption

```typescript
// ❌ Readonly is shallow!
interface Config {
  readonly server: { port: number };
}
const config: Config = { server: { port: 3000 } };
config.server.port = 8080; // ✅ Allowed! (mutation, not reassignment)
```

### 3. Index signature type conflicts

```typescript
// ❌ Error!
interface Bad {
  id: number;
  [key: string]: string; // number not assignable to string
}

// ✅ Include all property types
interface Good {
  id: number;
  [key: string]: string | number;
}
```

### 4. Over-using index signatures

```typescript
// ❌ Too loose
interface AnyProps {
  [key: string]: unknown;
}

// ✅ Be specific when possible
interface SpecificProps {
  name: string;
  age: number;
  email?: string;
}
```
