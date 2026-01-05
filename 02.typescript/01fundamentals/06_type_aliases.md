# Type Aliases - Deep Dive

## 🎯 Key Concepts

### 1. Creating Type Aliases (CRITICAL!)

**What it means:**

- Give a name to any type using the `type` keyword
- More flexible than interfaces
- Can alias primitives, unions, intersections, tuples, and more
- Cannot be reopened/merged (unlike interfaces)

**Basic type aliases:**

```typescript
// Primitive types
type ID = string;
type Count = number;
type Flag = boolean;

// Object types
type User = {
  id: ID;
  name: string;
  email: string;
};

// Function types
type Validator = (value: string) => boolean;
type Callback = () => void;

// Union types
type Status = "idle" | "loading" | "success" | "error";
type Result = Success | Error;

// Tuple types
type Point = [number, number];
type RGB = [red: number, green: number, blue: number];

// Array types
type StringArray = string[];
type Matrix = number[][];
```

**Why use type aliases:**

- ✅ Give meaningful names to complex types
- ✅ Avoid repeating type definitions
- ✅ Create semantic types (Price, Email, UserID)
- ✅ Document intent and domain concepts
- ✅ Make refactoring easier
- ✅ Enable type reuse across codebase

**When to create type aliases:**

- ✅ Complex types used multiple times
- ✅ Domain-specific types (UserId, ProductCode)
- ✅ Union types representing choices
- ✅ Function signatures used in multiple places
- ✅ Configuration shapes
- ❌ Simple one-off object shapes (consider inline)

**Interview Gold:** "Type aliases let me name any type, not just objects. I use them for unions, intersections, tuples, and complex types that interfaces can't express. Unlike interfaces, they can't be reopened, which gives me more control. I prefer type aliases for unions and complex type manipulations, but interfaces for object shapes in public APIs."

---

### 2. Type Alias vs Interface (CRITICAL!)

**What it means:**

- Both can describe object shapes, but have key differences
- Understanding when to use each is crucial

**Key differences:**

| Feature                  | Type Alias | Interface      |
| ------------------------ | ---------- | -------------- |
| **Objects**              | ✅ Yes     | ✅ Yes         |
| **Primitives**           | ✅ Yes     | ❌ No          |
| **Unions**               | ✅ Yes     | ❌ No          |
| **Intersections**        | ✅ Yes     | ⚠️ Via extends |
| **Tuples**               | ✅ Yes     | ⚠️ Awkward     |
| **Declaration Merging**  | ❌ No      | ✅ Yes         |
| **Extends**              | ⚠️ Via &   | ✅ Yes         |
| **Implements (classes)** | ⚠️ Limited | ✅ Yes         |
| **Mapped Types**         | ✅ Yes     | ❌ No          |
| **Conditional Types**    | ✅ Yes     | ❌ No          |
| **Computed Properties**  | ✅ Yes     | ✅ Yes         |

**Type alias examples:**

```typescript
// ✅ Can alias primitives
type Age = number;
type Name = string;

// ✅ Can create unions
type Status = "active" | "inactive";
type ID = string | number;

// ✅ Can create intersections
type Employee = Person & { employeeId: number };

// ✅ Can create tuples
type Point = [number, number];

// ✅ Can do mapped types
type Readonly<T> = { readonly [P in keyof T]: T[P] };

// ✅ Can do conditional types
type IsString<T> = T extends string ? true : false;
```

**Interface examples:**

```typescript
// ✅ Great for objects
interface User {
  id: number;
  name: string;
}

// ✅ Can extend
interface Admin extends User {
  permissions: string[];
}

// ✅ Can be reopened (declaration merging)
interface User {
  email: string; // Adds to User
}

// ✅ Best for class contracts
class UserService implements User {
  id = 1;
  name = "Alice";
  email = "alice@example.com";
}
```

**When to use Type:**

- ✅ Unions: `type Status = "idle" | "loading"`
- ✅ Intersections: `type A = B & C`
- ✅ Tuples: `type Point = [number, number]`
- ✅ Primitives: `type Age = number`
- ✅ Utility types: `type Partial<T> = ...`
- ✅ Complex manipulations: mapped, conditional types

**When to use Interface:**

- ✅ Object shapes (especially public APIs)
- ✅ When you want declaration merging
- ✅ Class contracts (`implements`)
- ✅ When extending is primary use case
- ✅ Library definitions that might be extended

**Practical decision:**

```typescript
// ✅ Use type for unions and complex types
type Result<T> = Success<T> | Error;
type Nullable<T> = T | null;

// ✅ Use interface for object shapes
interface User {
  id: number;
  name: string;
}

// Both work for objects, but interface is conventional
interface Config {
  host: string;
  port: number;
}

// Type alias if you need union/intersection features
type ConfigOrNull = Config | null;
```

---

### 3. Generic Type Aliases

**What it means:**

- Type aliases can accept type parameters
- Create reusable, flexible type definitions
- Like functions, but for types

**Basic generic aliases:**

```typescript
// Generic container
type Box<T> = {
  value: T;
};

const stringBox: Box<string> = { value: "hello" };
const numberBox: Box<number> = { value: 42 };

// Generic array wrapper
type List<T> = {
  items: T[];
  count: number;
};

const userList: List<User> = {
  items: [{ id: 1, name: "Alice" }],
  count: 1,
};

// Generic function type
type Mapper<T, U> = (input: T) => U;

const toString: Mapper<number, string> = (n) => String(n);
const toLength: Mapper<string, number> = (s) => s.length;
```

**Multiple type parameters:**

```typescript
// Key-value pair
type Pair<K, V> = {
  key: K;
  value: V;
};

const stringNumber: Pair<string, number> = {
  key: "age",
  value: 30,
};

// Result with error type
type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

const success: Result<User> = {
  success: true,
  value: { id: 1, name: "Alice" },
};

const error: Result<User, string> = {
  success: false,
  error: "User not found",
};
```

**Generic constraints:**

```typescript
// Constrain to objects with id
type WithId<T extends { id: number }> = T & {
  getId: () => number;
};

// Constrain to arrays
type FirstElement<T extends any[]> = T[0];

type First = FirstElement<[string, number]>; // string

// Constrain to specific keys
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

**Default type parameters:**

```typescript
// Default to unknown
type Response<T = unknown> = {
  data: T;
  status: number;
};

const response1: Response = {
  data: "anything",
  status: 200,
};

const response2: Response<User> = {
  data: { id: 1, name: "Alice" },
  status: 200,
};

// Default to Error
type AsyncState<T, E = Error> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: E };
```

---

### 4. Recursive Type Aliases

**What it means:**

- Type aliases that reference themselves
- Essential for tree structures, nested data
- Must have a base case (like recursion in programming)

**Basic recursive types:**

```typescript
// JSON value
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

const json: JSONValue = {
  name: "Alice",
  age: 30,
  active: true,
  tags: ["user", "admin"],
  metadata: {
    created: "2024-01-01",
    nested: {
      deep: true,
    },
  },
};

// Linked list node
type ListNode<T> = {
  value: T;
  next: ListNode<T> | null;
};

const list: ListNode<number> = {
  value: 1,
  next: {
    value: 2,
    next: {
      value: 3,
      next: null,
    },
  },
};

// Tree node
type TreeNode<T> = {
  value: T;
  children: TreeNode<T>[];
};

const tree: TreeNode<string> = {
  value: "root",
  children: [
    { value: "child1", children: [] },
    {
      value: "child2",
      children: [{ value: "grandchild", children: [] }],
    },
  ],
};
```

**Recursive utility types:**

```typescript
// Deep readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Deep partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Deep required
type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// Usage
interface Config {
  server: {
    host: string;
    port: number;
    ssl?: {
      cert: string;
      key: string;
    };
  };
}

type ReadonlyConfig = DeepReadonly<Config>;
type PartialConfig = DeepPartial<Config>;
```

**Path types (advanced):**

```typescript
// Get all possible paths in an object
type Paths<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? K | `${K}.${Paths<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

type User = {
  id: number;
  profile: {
    name: string;
    address: {
      city: string;
      country: string;
    };
  };
};

type UserPaths = Paths<User>;
// "id" | "profile" | "profile.name" | "profile.address" | "profile.address.city" | "profile.address.country"
```

---

### 5. Union Type Aliases

**What it means:**

- Type aliases are the ONLY way to name unions
- Interfaces cannot represent unions
- Essential for state machines and alternatives

**String literal unions:**

```typescript
// Status types
type LoadingState = "idle" | "loading" | "success" | "error";
type Theme = "light" | "dark" | "auto";
type Size = "xs" | "sm" | "md" | "lg" | "xl";
type Alignment = "left" | "center" | "right" | "justify";

// HTTP methods
type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// Days of week
type Weekday = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
type Weekend = "Saturday" | "Sunday";
type Day = Weekday | Weekend;
```

**Discriminated union aliases:**

```typescript
// API response
type APIResponse<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

// Shape types
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number }
  | { kind: "rectangle"; width: number; height: number };

// Form field state
type FieldState<T> =
  | { state: "pristine" }
  | { state: "validating" }
  | { state: "valid"; value: T }
  | { state: "invalid"; value: T; errors: string[] };
```

**Mixed type unions:**

```typescript
// Primitive union
type Primitive = string | number | boolean | null | undefined;

// ID can be string or number
type ID = string | number;

// Value can be single or array
type OneOrMany<T> = T | T[];

// Nullable type
type Nullable<T> = T | null | undefined;

// Optional type
type Optional<T> = T | undefined;
```

---

### 6. Intersection Type Aliases

**What it means:**

- Combine multiple types into one
- Object shapes are merged
- All properties from all types required

**Basic intersection aliases:**

```typescript
// Combine two types
type Person = {
  name: string;
  age: number;
};

type Employee = {
  employeeId: number;
  department: string;
};

type Staff = Person & Employee;
// Has: name, age, employeeId, department

// Mixin pattern
type Timestamps = {
  createdAt: Date;
  updatedAt: Date;
};

type Auditable = {
  createdBy: string;
  updatedBy: string;
};

type TrackedEntity<T> = T & Timestamps & Auditable;

type User = TrackedEntity<{
  id: number;
  email: string;
}>;
```

**Adding properties to existing types:**

```typescript
// Add metadata
type WithMetadata<T> = T & {
  metadata: {
    version: number;
    tags: string[];
  };
};

// Add loading state
type WithLoading<T> = T & {
  isLoading: boolean;
  error?: string;
};

// Add pagination
type Paginated<T> = T & {
  page: number;
  pageSize: number;
  total: number;
};

type UserList = Paginated<{
  users: User[];
}>;
```

**Combining unions and intersections:**

```typescript
// Base types
type Dog = { type: "dog"; bark: () => void };
type Cat = { type: "cat"; meow: () => void };

// Add common properties
type Pet = (Dog | Cat) & {
  name: string;
  age: number;
};

// Now all pets have name and age
const myDog: Pet = {
  type: "dog",
  name: "Buddy",
  age: 3,
  bark: () => console.log("Woof!"),
};
```

---

### 7. Tuple Type Aliases

**What it means:**

- Name fixed-length arrays with specific types
- Interfaces are awkward for tuples
- Type aliases are the natural choice

**Basic tuple aliases:**

```typescript
// Coordinates
type Point2D = [x: number, y: number];
type Point3D = [x: number, y: number, z: number];

// RGB colors
type RGB = [red: number, green: number, blue: number];
type RGBA = [red: number, green: number, blue: number, alpha: number];

// Key-value pair
type Entry<K, V> = [key: K, value: V];

// Range
type Range = [min: number, max: number];

// API response with metadata
type Response<T> = [data: T, status: number, headers: Record<string, string>];
```

**Optional tuple elements:**

```typescript
// Optional third element
type Point = [x: number, y: number, z?: number];

const point2D: Point = [10, 20];
const point3D: Point = [10, 20, 30];

// Optional elements at end
type HTTPResponse = [
  status: number,
  body: string,
  headers?: Record<string, string>
];
```

**Rest elements in tuples:**

```typescript
// First element required, rest optional
type Args = [required: string, ...optional: number[]];

const args1: Args = ["test"];
const args2: Args = ["test", 1, 2, 3];

// Multiple rest elements (TypeScript 4.0+)
type StringNumberBooleans = [string, number, ...boolean[]];
type StringsAndNumber = [...string[], number];

// Function arguments as tuple
type PrintArgs = [message: string, ...values: unknown[]];

function print(...args: PrintArgs) {
  const [message, ...values] = args;
  console.log(message, values);
}
```

**Readonly tuples:**

```typescript
type ReadonlyPoint = readonly [number, number];

const point: ReadonlyPoint = [10, 20];
// point[0] = 30; // ❌ Error: readonly

// Useful for constants
type Colors = readonly ["red", "green", "blue"];
```

---

### 8. Type Alias Best Practices

**Naming conventions:**

```typescript
// ✅ Use PascalCase
type UserProfile = { ... };
type ApiResponse = { ... };

// ✅ Descriptive names
type UserID = string;
type EmailAddress = string;
type Timestamp = number;

// ✅ Semantic domain types
type Price = number;
type Quantity = number;
type Percentage = number;

// ❌ Avoid generic names
type Data = { ... }; // Too vague
type Obj = { ... }; // Too vague
type Thing = { ... }; // Too vague
```

**When to inline vs alias:**

```typescript
// ✅ Alias for reuse
type Status = "idle" | "loading" | "success" | "error";

function fetchData(): Status { ... }
function saveData(): Status { ... }

// ✅ Inline for one-off
function oneTimeUse(config: { host: string; port: number }) { ... }

// ✅ Alias for complex types
type Config = {
  server: {
    host: string;
    port: number;
    ssl: boolean;
  };
  database: {
    url: string;
    poolSize: number;
  };
};

// ❌ Don't alias simple types
type Str = string; // Unnecessary
type Num = number; // Unnecessary
```

**Composition patterns:**

```typescript
// ✅ Build complex types from simple ones
type Base = { id: number; name: string };
type WithTimestamps = Base & { createdAt: Date; updatedAt: Date };
type WithAuthor = WithTimestamps & { authorId: string };

// ✅ Generic composition
type Entity<T> = T & {
  id: string;
  createdAt: Date;
};

// ✅ Conditional composition
type Loadable<T> = T & {
  loading: boolean;
  error?: string;
};
```

---

## 🎤 Top Interview Questions & Model Answers

### Q1: When should you use type aliases instead of interfaces?

**Answer:**

> "I use type aliases when I need features that interfaces can't provide: unions, intersections, tuples, primitives, mapped types, or conditional types. For example, `type Status = 'idle' | 'loading'` must be a type alias because interfaces can't represent unions. Type aliases are also better for complex type manipulations like `type Readonly<T> = { readonly [P in keyof T]: T[P] }`. However, I prefer interfaces for plain object shapes in public APIs because they support declaration merging and work better with extends. The key is: interfaces for object contracts, type aliases for everything else."

---

### Q2: Can type aliases be generic? Give examples.

**Answer:**

> "Yes, type aliases can be generic, which makes them incredibly powerful for reusable type definitions. You can define type parameters just like with functions. For example, `type Box<T> = { value: T }` creates a generic container, or `type Result<T, E = Error> = Success<T> | Failure<E>` with a default type parameter. Generic type aliases are essential for utility types like Partial, Pick, and Record. You can also add constraints: `type WithId<T extends { id: number }> = T & { getId: () => number }` ensures T has an id property."

---

### Q3: What are recursive type aliases and when would you use them?

**Answer:**

> "Recursive type aliases reference themselves in their definition, similar to recursive functions. They're essential for modeling tree structures, nested data, and recursive data types. Classic examples include JSON values, linked lists, and tree nodes. For instance, `type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue }` defines all valid JSON. I also use recursive types for utility types like DeepReadonly or DeepPartial that recursively apply transformations to nested objects. The key is having a base case to prevent infinite recursion."

---

### Q4: How do type aliases differ from interfaces in terms of declaration merging?

**Answer:**

> "Type aliases cannot be reopened or merged - they're closed after declaration. If you try to declare a type with the same name twice, you get a duplicate identifier error. Interfaces, on the other hand, support declaration merging where multiple declarations with the same name automatically merge together. This is useful for augmenting third-party library types. For example, you can extend Express's Request interface by declaring it again with additional properties. This is why interfaces are preferred for public APIs that consumers might want to extend."

---

### Q5: Can you combine unions and intersections in type aliases?

**Answer:**

> "Absolutely, and this is where type aliases really shine. You can create complex types by combining unions and intersections. For example, `type Pet = (Dog | Cat) & { name: string; age: number }` creates a union of Dog or Cat, but both must have name and age properties. You can also do `type Result<T> = (Success<T> | Error) & { timestamp: Date }` where the result is either success or error, but always has a timestamp. The key is understanding operator precedence - intersections bind tighter than unions, so use parentheses to control evaluation order."

---

## 🔑 Must Know Checklist

### ✅ Critical (Always asked)

- ✅ Type alias vs interface - when to use each
- ✅ Generic type aliases
- ✅ Union type aliases
- ✅ Intersection type aliases

### ✅ Should Know (Often asked)

- ✅ Recursive type aliases
- ✅ Tuple type aliases
- ✅ Type alias composition
- ✅ Declaration merging differences

### ✅ Nice to Know (Senior level)

- ✅ Advanced recursive patterns
- [ ] Path types
- [ ] Complex generic constraints
- [ ] Type alias performance considerations

---

## 🚨 Common Mistakes to Avoid

### 1. Using type when interface is better

```typescript
// ❌ Type for simple object (interface is conventional)
type User = {
  id: number;
  name: string;
};

// ✅ Interface for object shapes
interface User {
  id: number;
  name: string;
}
```

### 2. Trying to reopen type aliases

```typescript
type User = {
  id: number;
};

// ❌ Error: Duplicate identifier
// type User = {
//   name: string;
// };

// ✅ Use interface for merging
interface User {
  id: number;
}
interface User {
  name: string;
}
```

### 3. Over-aliasing simple types

```typescript
// ❌ Unnecessary aliases
type Str = string;
type Num = number;

// ✅ Only alias when it adds meaning
type UserID = string;
type Timestamp = number;
type EmailAddress = string;
```

### 4. Confusing union of arrays vs array of union

```typescript
// Array of strings OR array of numbers (not mixed)
type StringOrNumberArray = string[] | number[];

// Array that can contain strings OR numbers (mixed)
type MixedArray = (string | number)[];
```
