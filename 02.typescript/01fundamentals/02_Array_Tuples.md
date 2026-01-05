# Arrays and Tuples

## 🎯 Key Concepts

### 1. Array Type Syntax (Two Ways)

**What it means:**

- TypeScript offers two syntaxes for array types
- Both are functionally identical
- Choose one and be consistent

**Two Syntaxes:**

```typescript
// Syntax 1: Type[] (preferred, more common)
let numbers: number[] = [1, 2, 3];
let strings: string[] = ["a", "b", "c"];

// Syntax 2: Array<Type> (generic syntax)
let numbers: Array<number> = [1, 2, 3];
let strings: Array<string> = ["a", "b", "c"];
```

**Which to use?**

- `Type[]` - More common, cleaner for simple types
- `Array<Type>` - Better for complex generic types
- **Best practice:** Use `Type[]` for primitives, `Array<Type>` when needed for clarity

**Interview tip:** Know both syntaxes, be able to explain they're identical!

---

### 2. Arrays vs Tuples (CRITICAL!)

**Arrays:**

- **Homogeneous** collections (all elements same type)
- **Variable length** (can grow/shrink)
- Access by index returns the element type

**Tuples:**

- **Heterogeneous** collections (elements can be different types)
- **Fixed length** (specific number of elements)
- Each position has its own type

**Key Differences:**

```typescript
// ARRAY - all same type, any length
let scores: number[] = [95, 87, 91, 88];
scores.push(92); // ✅ Can add more
let first: number = scores[0]; // Type: number

// TUPLE - specific types, fixed length
let user: [string, number] = ["Alice", 25];
// user.push(30); // ⚠️ Compiles but breaks tuple contract!
let name: string = user[0]; // Type: string (not string | number)
let age: number = user[1]; // Type: number
```

**When to use each:**

- **Array:** Collection of similar items (list of users, scores, products)
- **Tuple:** Fixed structure with known positions (coordinates, key-value pairs, function returns)

---

### 3. Tuple Types - Fixed Structure

**What it means:**

- Tuples represent a fixed-length array where each element has a specific type
- Position matters - each index has its own type
- Great for functions that return multiple values

**Basic Tuple:**

```typescript
// [type1, type2, type3]
type Point2D = [number, number];
type Point3D = [number, number, number];
type User = [string, number, boolean]; // [name, age, isActive]

let point: Point2D = [10, 20]; // ✅
// let invalid: Point2D = [10]; // ❌ Error: length must be 2
// let invalid2: Point2D = [10, 20, 30]; // ❌ Error: length must be 2
```

**Tuple Destructuring:**

```typescript
type Coordinates = [number, number];
const position: Coordinates = [100, 200];

const [x, y] = position; // x: number, y: number
console.log(x, y); // 100, 200
```

**Common Use Cases:**

1. **Function returns:**

   ```typescript
   function useState<T>(initial: T): [T, (value: T) => void] {
     // Returns [state, setState]
   }
   ```

2. **Coordinates/Points:**

   ```typescript
   type RGB = [number, number, number];
   type RGBA = [number, number, number, number];
   ```

3. **Key-value pairs:**
   ```typescript
   type Entry<K, V> = [K, V];
   const entries: Entry<string, number>[] = [
     ["age", 25],
     ["score", 100],
   ];
   ```

---

### 4. Optional Tuple Elements

**What it means:**

- Tuple elements can be optional using `?`
- Optional elements must come after required ones
- Creates flexibility in tuple length

**Syntax:**

```typescript
type User = [string, number, boolean?];
//                            ^ optional

let user1: User = ["Alice", 25, true]; // ✅
let user2: User = ["Bob", 30]; // ✅ (isActive is optional)
// let user3: User = ["Charlie"]; // ❌ Error: age is required
```

**Practical Example:**

```typescript
type Point = [number, number, number?]; // 2D or 3D

let point2D: Point = [10, 20]; // ✅
let point3D: Point = [10, 20, 30]; // ✅

function distance(point: Point): number {
  const [x, y, z] = point;
  if (z !== undefined) {
    // 3D distance
    return Math.sqrt(x * x + y * y + z * z);
  }
  // 2D distance
  return Math.sqrt(x * x + y * y);
}
```

**Interview tip:** Optional tuple elements must be at the end, just like function parameters!

---

### 5. Rest Elements in Tuples

**What it means:**

- Can use rest syntax (`...Type[]`) in tuples
- Captures remaining elements of same type
- Must be last element in tuple

**Syntax:**

```typescript
type StringNumberBooleans = [string, number, ...boolean[]];
//                                            ^ rest element

let valid1: StringNumberBooleans = ["hello", 42]; // ✅
let valid2: StringNumberBooleans = ["hello", 42, true]; // ✅
let valid3: StringNumberBooleans = ["hello", 42, true, false, true]; // ✅
// let invalid: StringNumberBooleans = ["hello"]; // ❌ Missing number
```

**Practical Examples:**

```typescript
// Function with required and optional args
type LogArgs = [string, ...any[]];
function log(...args: LogArgs) {
  const [message, ...rest] = args;
  console.log(message, rest);
}

log("Error"); // ✅
log("Error", 404, "Not found"); // ✅

// Concat pattern
type Concat<T extends any[], U extends any[]> = [...T, ...U];
type Result = Concat<[1, 2], [3, 4]>; // [1, 2, 3, 4]
```

**When to use:**

- Variable number of arguments after fixed ones
- Spreading multiple tuples together
- Type-safe variadic functions

---

### 6. Named Tuples (TypeScript 4.0+)

**What it means:**

- Add labels to tuple elements for better readability
- Labels are for documentation only (don't affect runtime)
- Makes code self-documenting

**Syntax:**

```typescript
// Without labels - unclear what each element means
type User = [string, number, boolean];

// With labels - clear and self-documenting
type UserNamed = [name: string, age: number, isActive: boolean];

let user: UserNamed = ["Alice", 25, true];
//                     ^ clear what each position represents
```

**Benefits:**

1. **Self-documenting code**
2. **Better IDE tooltips**
3. **Easier to understand function signatures**

**Practical Example:**

```typescript
type Range = [start: number, end: number];
type Point3D = [x: number, y: number, z: number];

function createRange(range: Range): number[] {
  const [start, end] = range;
  // Clear what start and end represent
  return Array.from({ length: end - start }, (_, i) => start + i);
}

// Function signature is self-documenting
function useState<T>(
  initialValue: T
): [state: T, setState: (value: T) => void] {
  // Returns [state, setState] - clear from type signature!
}
```

**Interview tip:** Named tuples are just for developer experience - they don't affect runtime or type checking!

---

### 7. Readonly Arrays and Tuples

**What it means:**

- Prevents mutations to arrays/tuples
- Compiler enforces immutability
- No push, pop, splice, or index assignment

**Readonly Arrays:**

```typescript
// Regular array - mutable
let numbers: number[] = [1, 2, 3];
numbers.push(4); // ✅ Allowed
numbers[0] = 10; // ✅ Allowed

// Readonly array - immutable
let readonlyNumbers: readonly number[] = [1, 2, 3];
// readonlyNumbers.push(4); // ❌ Error: push doesn't exist
// readonlyNumbers[0] = 10; // ❌ Error: cannot assign
```

**Alternative Syntax:**

```typescript
let numbers: ReadonlyArray<number> = [1, 2, 3];
let scores: Readonly<number[]> = [95, 87, 91];
```

**Readonly Tuples:**

```typescript
let point: readonly [number, number] = [10, 20];
// point[0] = 15; // ❌ Error: cannot assign
// point.push(30); // ❌ Error: push doesn't exist

const config: readonly [string, number] = ["localhost", 3000];
// config[1] = 8080; // ❌ Error: cannot modify
```

**When to use:**

- Function parameters that shouldn't be modified
- Configuration data
- Preventing accidental mutations
- Functional programming patterns

**Key Differences:**

| Feature            | Array                  | Readonly Array           |
| ------------------ | ---------------------- | ------------------------ |
| Mutation methods   | ✅ Available           | ❌ Not available         |
| Index assignment   | ✅ Allowed             | ❌ Not allowed           |
| Reading            | ✅ Allowed             | ✅ Allowed               |
| Type compatibility | Can assign to readonly | Cannot assign to mutable |

**Interview tip:** `readonly` is compile-time only - it doesn't affect runtime behavior!

---

### 8. Array Methods and Type Safety

**What it means:**

- Array methods preserve type information
- TypeScript infers return types automatically
- Type-safe transformations

**Type-Safe Array Methods:**

```typescript
const numbers: number[] = [1, 2, 3, 4, 5];

// map - transforms and preserves type
const doubled: number[] = numbers.map((n) => n * 2);
const strings: string[] = numbers.map((n) => n.toString());

// filter - narrows type
const evens: number[] = numbers.filter((n) => n % 2 === 0);

// reduce - infers result type
const sum: number = numbers.reduce((acc, n) => acc + n, 0);
const object = numbers.reduce((acc, n) => ({ ...acc, [n]: n }), {});
// Type: { [x: number]: number }

// find - returns T | undefined
const found: number | undefined = numbers.find((n) => n > 3);

// some/every - return boolean
const hasEven: boolean = numbers.some((n) => n % 2 === 0);
const allPositive: boolean = numbers.every((n) => n > 0);
```

**Generic Type Inference:**

```typescript
// TypeScript infers generic types from usage
const mixed = [1, "hello", true]; // Type: (string | number | boolean)[]

const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
];
// Type: { name: string; age: number }[]

const names = users.map((u) => u.name); // Type: string[]
```

---

## 🎤 Top Interview Questions & Model Answers

### Q1: What's the difference between arrays and tuples?

**Answer:**

> "Arrays are homogeneous collections where all elements have the same type and the length is variable. Tuples are heterogeneous collections with a fixed length where each position can have a different type. For example, `number[]` is an array that can hold any number of numbers, while `[string, number]` is a tuple that must have exactly two elements: a string followed by a number. Tuples are useful for representing fixed structures like coordinates `[x, y]` or function return values like React's `useState` which returns `[state, setState]`."

---

### Q2: Can tuples have optional elements?

**Answer:**

> "Yes, tuples can have optional elements using the `?` syntax, just like optional function parameters. However, optional elements must come after required elements. For example, `[string, number, boolean?]` is valid - the boolean is optional - but `[string, boolean?, number]` would be invalid because the optional element isn't at the end. This is useful when you have a tuple structure where some trailing values might not always be present."

---

### Q3: What are the two ways to declare array types and which should you use?

**Answer:**

> "TypeScript provides two syntaxes for array types: `Type[]` and `Array<Type>`. They're functionally identical. I prefer `Type[]` for simple types like `number[]` or `string[]` because it's more concise and readable. However, `Array<Type>` can be clearer for complex generic types or when you're already working with generic syntax. The most important thing is to be consistent within a codebase. Both compile to the same JavaScript."

---

### Q4: What does `readonly` do for arrays and tuples?

**Answer:**

> "The `readonly` modifier prevents any mutations to the array or tuple. You can't use mutation methods like `push`, `pop`, `splice`, or assign to indexes. For example, `readonly number[]` allows reading values but not modifying them. This is a compile-time check only - at runtime it's still a regular array. I use `readonly` for function parameters when I want to guarantee the function won't modify the input, or for configuration data that shouldn't change. It's particularly useful in functional programming patterns where immutability is important."

---

### Q5: How do rest elements work in tuples?

**Answer:**

> "Rest elements in tuples use the spread syntax `...Type[]` to capture a variable number of elements of the same type. The rest element must be the last element in the tuple. For example, `[string, number, ...boolean[]]` means a tuple that starts with a string and number, followed by zero or more booleans. This is useful for typing functions that have required parameters followed by optional ones, or when you're spreading multiple tuples together in type-level programming."

---

### Q6: When would you use a tuple over an object?

**Answer:**

> "I use tuples when the order is more important than names, especially for short, well-known structures. Common cases include: coordinates like `[x, y]`, function returns like React's `useState` returning `[state, setState]`, or ranges like `[min, max]`. Tuples are also more concise for simple structures. However, for complex data with many fields or when the structure might evolve, I prefer objects because the named properties make the code more self-documenting and refactoring-safe. Named tuples in TypeScript 4.0+ help bridge this gap by adding labels while keeping the tuple structure."

---

## 🔑 Must Know Checklist

### ✅ Critical (Always asked)

- ✅ Array type syntax (both forms)
- ✅ Arrays vs Tuples differences
- ✅ When to use arrays vs tuples
- ✅ Readonly arrays/tuples

### ✅ Should Know (Often asked)

- ✅ Optional tuple elements
- ✅ Tuple destructuring
- ✅ Named tuples (TypeScript 4.0+)
- ✅ Array method type inference

### ✅ Nice to Know (Senior level)

- ✅ Rest elements in tuples
- ✅ Readonly vs ReadonlyArray
- [ ] Type-safe array transformations
- [ ] Tuple spreading patterns

---

## 🚨 Common Mistakes to Avoid

### 1. Confusing Array and Tuple Syntax

```typescript
// ❌ WRONG - This is an array, not a tuple
let user: string | number[] = ["Alice", 25];
// Type: string | number[] (string OR array of numbers)

// ✅ CORRECT - This is a tuple
let user: [string, number] = ["Alice", 25];
// Type: [string, number] (tuple with string and number)
```

### 2. Mutating Readonly Arrays

```typescript
const numbers: readonly number[] = [1, 2, 3];

// ❌ All of these error with readonly
// numbers.push(4);
// numbers[0] = 10;
// numbers.sort();

// ✅ Create new arrays instead
const newNumbers = [...numbers, 4]; // Add element
const modified = numbers.map((n) => n * 2); // Transform
```

### 3. Optional Tuple Elements in Wrong Position

```typescript
// ❌ WRONG - Optional elements must be at end
type Invalid = [string, number?, boolean];

// ✅ CORRECT - Optional elements at end
type Valid = [string, number, boolean?];
type AlsoValid = [string, number?, boolean?];
```

### 4. Tuple Length Violations

```typescript
type Pair = [number, number];

// ❌ These violate tuple contract
// let invalid1: Pair = [1]; // Too few
// let invalid2: Pair = [1, 2, 3]; // Too many

// ✅ Exact length required
let valid: Pair = [1, 2];

// ⚠️ WATCH OUT - push/pop still compile but break contract!
valid.push(3); // Compiles but now length is 3!
// Better: use readonly for true immutability
let safePair: readonly [number, number] = [1, 2];
// safePair.push(3); // ❌ Error: push doesn't exist
```

### 5. Forgetting Type Annotations for Empty Arrays

```typescript
// ❌ Type is never[] - can't add anything!
const numbers = [];
// numbers.push(1); // Error: number not assignable to never

// ✅ Provide explicit type
const numbers: number[] = [];
numbers.push(1); // ✅ Works

// ✅ Or initialize with values
const numbers = [1, 2, 3]; // Inferred as number[]
```

### 6. Not Using Readonly for Immutable Data

```typescript
// ❌ Function can accidentally modify input
function process(data: number[]) {
  data.sort(); // Mutates original array!
  return data[0];
}

// ✅ Use readonly to prevent mutations
function process(data: readonly number[]) {
  // data.sort(); // ❌ Error: can't mutate
  const sorted = [...data].sort(); // Create copy first
  return sorted[0];
}
```

---

## 💡 Pro Tips

### Tip 1: Use Tuples for Function Returns

```typescript
// ✅ Clear return type with tuple
function getMinMax(numbers: number[]): [min: number, max: number] {
  return [Math.min(...numbers), Math.max(...numbers)];
}

const [min, max] = getMinMax([1, 5, 3, 9, 2]);
```

### Tip 2: Const Assertions Create Readonly Tuples

```typescript
// Without as const - type is (string | number)[]
const point1 = ["x", 10];

// With as const - type is readonly ["x", 10]
const point2 = ["x", 10] as const;
```

### Tip 3: Use Readonly for Function Parameters

```typescript
// Guarantees function won't modify input
function sum(numbers: readonly number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}
```

### Tip 4: Named Tuples for Clarity

```typescript
// Self-documenting return type
function useState<T>(initial: T): [state: T, setState: (value: T) => void] {
  // Implementation
}
```

---

## 🎯 Key Takeaways

1. **Arrays** = homogeneous, variable length; **Tuples** = heterogeneous, fixed length
2. Two array syntaxes: `Type[]` (preferred) and `Array<Type>` (for generics)
3. Tuples are great for fixed structures and multiple return values
4. Use `readonly` to prevent mutations at compile time
5. Optional tuple elements must come last
6. Named tuples (TS 4.0+) improve readability without changing behavior
7. Rest elements in tuples capture variable-length trailing elements
8. Array methods preserve type safety automatically
9. Always provide type for empty arrays to avoid `never[]`
10. Tuple push/pop still compile - use `readonly` for true immutability
