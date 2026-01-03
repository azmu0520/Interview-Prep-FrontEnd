# Enums - Deep Dive

## 🎯 Key Concepts

### 1. Numeric Enums (CRITICAL!)

**What it means:**

- Enums create a set of named constants
- Numeric enums auto-increment starting from 0 (or custom value)
- Create both a type and a runtime object
- Members are reverse-mapped (number to name lookup)

**Basic numeric enums:**

```typescript
enum Direction {
  Up, // 0
  Down, // 1
  Left, // 2
  Right, // 3
}

const move: Direction = Direction.Up;
console.log(move); // 0
console.log(Direction[0]); // "Up" (reverse mapping)
```

**Custom starting value:**

```typescript
enum Status {
  Idle = 1, // 1
  Loading, // 2
  Success, // 3
  Error, // 4
}
```

**Custom values:**

```typescript
enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  NotFound = 404,
  ServerError = 500,
}
```

**Why numeric enums exist:**

- ✅ Legacy compatibility with other languages
- ✅ Database integer mappings
- ✅ Bit flags and masks
- ✅ Sequential ordering
- ❌ Often better alternatives exist (see below)

**Interview Gold:** "Numeric enums auto-increment and create reverse mappings. They compile to objects with both name-to-value and value-to-name mappings. However, I prefer string enums or union of literals in modern TypeScript because they're more explicit, tree-shakeable, and safer."

---

### 2. String Enums (CRITICAL!)

**What it means:**

- Each member must be explicitly initialized with a string
- No auto-incrementing
- No reverse mapping (unlike numeric enums)
- Better for debugging (readable values)

**Basic string enums:**

```typescript
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

const move: Direction = Direction.Up;
console.log(move); // "UP" (not 0!)
```

**Why string enums are better:**

```typescript
enum LogLevel {
  Debug = "DEBUG",
  Info = "INFO",
  Warning = "WARNING",
  Error = "ERROR",
}

// In logs, you see "ERROR" not 3
console.log(LogLevel.Error); // "ERROR"
```

**Advantages over numeric:**

- ✅ Self-documenting (readable values)
- ✅ Easier debugging (see "ERROR" not 3)
- ✅ JSON serialization friendly
- ✅ No accidental numeric comparisons
- ✅ More explicit (no auto-increment magic)

**When to use string enums:**

- ✅ API response status codes
- ✅ Log levels
- ✅ Event names
- ✅ Configuration keys
- ✅ Any time you want readable values

---

### 3. Const Enums (IMPORTANT!)

**What it means:**

- Enums that are completely removed at compile time
- Members inlined at usage sites
- No runtime object generated
- Better performance, smaller bundle size

**Regular enum (runtime object):**

```typescript
enum Color {
  Red,
  Green,
  Blue,
}

const c = Color.Red;

// Compiles to:
// var Color;
// (function (Color) {
//   Color[Color["Red"] = 0] = "Red";
//   Color[Color["Green"] = 1] = "Green";
//   Color[Color["Blue"] = 2] = "Blue";
// })(Color || (Color = {}));
// const c = Color.Red;
```

**Const enum (inlined):**

```typescript
const enum Color {
  Red,
  Green,
  Blue,
}

const c = Color.Red;

// Compiles to:
// const c = 0; /* Red */
```

**Advantages:**

- ✅ Zero runtime cost
- ✅ Smaller bundle size
- ✅ Values inlined (direct number/string)
- ✅ Same type safety as regular enums

**Limitations:**

- ❌ Can't use computed members
- ❌ Can't be used with `--isolatedModules`
- ❌ Can't iterate over members
- ❌ No reverse mapping even for numeric

**When to use const enums:**

- ✅ Performance-critical code
- ✅ Large enums with many members
- ✅ When you don't need runtime object
- ❌ Avoid in libraries (breaks consumers)
- ❌ Avoid if you need to iterate members

---

### 4. Heterogeneous Enums (AVOID!)

**What it means:**

- Mix of string and numeric values
- Generally considered bad practice
- Confusing and error-prone

```typescript
// ❌ DON'T DO THIS
enum BooleanLikeHeterogeneousEnum {
  No = 0,
  Yes = "YES",
}

// ❌ Why it's bad:
const value1 = BooleanLikeHeterogeneousEnum.No; // 0
const value2 = BooleanLikeHeterogeneousEnum.Yes; // "YES"
// Inconsistent types!
```

**Why to avoid:**

- ❌ Inconsistent types (breaks expectations)
- ❌ Confusing for team members
- ❌ No good use case in practice
- ❌ Better alternatives always exist

**Interview tip:** "Heterogeneous enums are technically possible but considered an anti-pattern. I avoid them and use either all numeric or all string values for consistency."

---

### 5. Enums at Runtime vs Compile Time

**What it means:**

- Regular enums exist at runtime (generate JavaScript objects)
- Const enums only exist at compile time (inlined)
- This affects bundle size and usage patterns

**Runtime behavior:**

```typescript
enum Status {
  Idle = "IDLE",
  Loading = "LOADING",
}

// Can use as object at runtime
Object.keys(Status); // ["Idle", "Loading"]
Object.values(Status); // ["IDLE", "LOADING"]

// Can iterate
for (const key in Status) {
  console.log(key, Status[key as keyof typeof Status]);
}

// Can check membership
function isStatus(value: string): value is Status {
  return Object.values(Status).includes(value as Status);
}
```

**Compile-time only (const enum):**

```typescript
const enum Status {
  Idle = "IDLE",
  Loading = "LOADING",
}

// ❌ Can't iterate (no runtime object)
// Object.keys(Status); // Error!

// ✅ Can only use direct member access
const s = Status.Idle; // Inlined as "IDLE"
```

**Bundle size impact:**

```typescript
// Regular enum: ~50-100 bytes per enum in bundle
enum Color {
  Red,
  Green,
  Blue,
}

// Const enum: 0 bytes (completely removed)
const enum Color {
  Red,
  Green,
  Blue,
}
```

---

### 6. Reverse Mappings (Numeric Enums Only)

**What it means:**

- Numeric enums create bidirectional mappings
- Can look up name from value
- String enums don't have reverse mappings

**Numeric enum reverse mapping:**

```typescript
enum Direction {
  Up, // 0
  Down, // 1
  Left, // 2
  Right, // 3
}

// Forward mapping (name to value)
console.log(Direction.Up); // 0
console.log(Direction["Up"]); // 0

// Reverse mapping (value to name)
console.log(Direction[0]); // "Up"
console.log(Direction[1]); // "Down"

// Generated object looks like:
// {
//   0: "Up",
//   1: "Down",
//   2: "Left",
//   3: "Right",
//   Up: 0,
//   Down: 1,
//   Left: 2,
//   Right: 3
// }
```

**String enums (no reverse mapping):**

```typescript
enum Status {
  Idle = "IDLE",
  Loading = "LOADING",
}

console.log(Status.Idle); // "IDLE"
console.log(Status["Idle"]); // "IDLE"
// console.log(Status["IDLE"]); // ❌ Error: no reverse mapping

// Generated object:
// {
//   Idle: "IDLE",
//   Loading: "LOADING"
// }
```

**Use cases for reverse mapping:**

```typescript
enum HttpStatus {
  OK = 200,
  NotFound = 404,
  ServerError = 500,
}

function getStatusName(code: number): string | undefined {
  return HttpStatus[code];
}

console.log(getStatusName(200)); // "OK"
console.log(getStatusName(404)); // "NotFound"
```

---

### 7. Alternatives to Enums (CRITICAL!)

**What it means:**

- Modern TypeScript offers better alternatives
- Union of string literals often preferred
- More tree-shakeable, type-safe, and flexible

**Problem with enums:**

```typescript
enum Status {
  Idle = "IDLE",
  Loading = "LOADING",
}

// ❌ Creates runtime object (bundle size)
// ❌ Can't be tree-shaken
// ❌ Not a true TypeScript type (nominal typing issue)
```

**Alternative 1: Union of string literals (BEST):**

```typescript
// ✅ No runtime code
// ✅ Tree-shakeable
// ✅ Same type safety
type Status = "idle" | "loading" | "success" | "error";

const status: Status = "idle";

// For constants, use as const object
const Status = {
  Idle: "idle",
  Loading: "loading",
  Success: "success",
  Error: "error",
} as const;

type StatusValue = (typeof Status)[keyof typeof Status];
// Type: "idle" | "loading" | "success" | "error"

const current: StatusValue = Status.Idle;
```

**Alternative 2: Const object with satisfies:**

```typescript
const HttpStatus = {
  OK: 200,
  Created: 201,
  BadRequest: 400,
  NotFound: 404,
} as const satisfies Record<string, number>;

type HttpStatusCode = (typeof HttpStatus)[keyof typeof HttpStatus];
// Type: 200 | 201 | 400 | 404

const code: HttpStatusCode = HttpStatus.OK;
```

**When to use enums vs alternatives:**

**Use Enums:**

- ✅ Need reverse mapping (numeric only)
- ✅ Legacy codebase using enums
- ✅ Integration with non-TypeScript code
- ✅ Bit flags operations

**Use Union Literals:**

- ✅ Modern TypeScript codebases (default choice!)
- ✅ Tree-shaking important
- ✅ Zero runtime overhead needed
- ✅ Working with discriminated unions
- ✅ Library/framework APIs

**Comparison:**

```typescript
// Enum approach
enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE",
}
const c1: Color = Color.Red;

// Union literal approach (preferred)
type Color = "red" | "green" | "blue";
const c2: Color = "red";

// With constants for autocomplete
const Color = {
  Red: "red",
  Green: "green",
  Blue: "blue",
} as const;
type Color = (typeof Color)[keyof typeof Color];
const c3: Color = Color.Red;
```

---

### 8. Computed and Constant Enum Members

**What it means:**

- Constant members: values known at compile time
- Computed members: calculated at runtime
- Only constant members can be used with const enums

**Constant members:**

```typescript
enum FileAccess {
  // Constant members
  None, // 0 (auto)
  Read = 1, // 1 (explicit)
  Write = 2, // 2 (explicit)
  ReadWrite = Read | Write, // 3 (computed from constants)

  // Can use in other enums
  G = "123".length, // 3 (constant expression)
}
```

**Computed members:**

```typescript
enum Complex {
  A = 1,
  B = A * 2, // 2 (constant)
  C = Math.random(), // Computed at runtime
  D = "text".length, // 4 (constant)
  E, // ❌ Error: Must initialize after computed
}
```

**Rules:**

- First member without initializer = 0
- Member after number without initializer = previous + 1
- Computed members must be followed by initialized members
- Const enums can't have computed members

**Bit flags pattern:**

```typescript
enum Permissions {
  None = 0,
  Read = 1 << 0, // 1
  Write = 1 << 1, // 2
  Execute = 1 << 2, // 4
  All = Read | Write | Execute, // 7
}

// Check permission
function hasPermission(user: number, permission: Permissions): boolean {
  return (user & permission) === permission;
}

const userPerms = Permissions.Read | Permissions.Write; // 3
console.log(hasPermission(userPerms, Permissions.Read)); // true
console.log(hasPermission(userPerms, Permissions.Execute)); // false
```

---

## 🎤 Top Interview Questions & Model Answers

### Q1: What's the difference between numeric and string enums?

**Answer:**

> "Numeric enums auto-increment starting from 0 and create reverse mappings where you can look up the name from the value. String enums require explicit string values for each member and don't have reverse mappings. I prefer string enums because they're self-documenting - when debugging or logging, you see 'ERROR' instead of 3, which is much clearer. String enums also avoid accidental numeric comparisons and work better with JSON serialization. The only time I'd use numeric enums is for bit flags, database mappings, or legacy compatibility."

---

### Q2: What are const enums and when should you use them?

**Answer:**

> "Const enums are completely removed at compile time - their values are inlined at every usage site. This means zero runtime overhead and smaller bundle sizes. For example, `const enum Color { Red }` becomes just the number 0 wherever it's used. I use const enums for performance-critical code or large enums where runtime objects aren't needed. However, I avoid them in libraries because they break consumers who import the library, and they don't work with --isolatedModules flag. They also can't be iterated over since they don't exist at runtime."

---

### Q3: Why do many developers prefer union of literals over enums?

**Answer:**

> "Union of string literals like `type Status = 'idle' | 'loading' | 'success'` has several advantages over enums. First, they generate zero JavaScript code - they're purely type-level. Second, they're tree-shakeable unlike enum objects. Third, they integrate better with discriminated unions which are a core TypeScript pattern. Fourth, they avoid the nominal typing quirks of enums. If I need the constants for autocomplete, I create an `as const` object alongside the type. The only times I use actual enums are for bit flags, reverse mappings, or maintaining consistency in legacy codebases."

---

### Q4: How do reverse mappings work in enums?

**Answer:**

> "Reverse mappings only exist for numeric enums - not string enums. TypeScript generates a bidirectional object where you can look up the name from the value. For example, with `enum Direction { Up, Down }`, the compiled object has both `Up: 0` and `0: 'Up'`. This is useful when you receive a numeric value from an API or database and need to get the enum name. However, this doubles the size of the enum object in your bundle. String enums don't need reverse mappings since the values are already readable strings."

---

### Q5: Can you explain computed vs constant enum members?

**Answer:**

> "Constant members have values known at compile time - literals, enum references, or constant expressions like bit shifts. Computed members are calculated at runtime using functions like Math.random() or method calls. In const enums, only constant members are allowed since everything must be inlined. After a computed member, you must explicitly initialize the next member - TypeScript can't auto-increment after a runtime value. Computed members are rare in practice - usually you'd use constant expressions for things like bit flags: `Read = 1 << 0, Write = 1 << 1`."

---

## 🔑 Must Know Checklist

### ✅ Critical (Always asked)

- ✅ Numeric vs string enums
- ✅ Const enums and performance
- ✅ Alternatives to enums (union literals)
- ✅ When to use enums vs alternatives

### ✅ Should Know (Often asked)

- ✅ Reverse mappings (numeric only)
- ✅ Runtime vs compile-time behavior
- ✅ Heterogeneous enums (and why to avoid)
- ✅ Bit flags pattern

### ✅ Nice to Know (Senior level)

- [ ] Computed members
- [ ] Ambient enums
- [ ] Enum member types
- [ ] Declaration merging with enums

---

## 🚨 Common Mistakes to Avoid

### 1. Using enums when union literals are better

```typescript
// ❌ Unnecessary runtime object
enum Status {
  Idle = "IDLE",
  Loading = "LOADING",
}

// ✅ Zero runtime cost
type Status = "idle" | "loading";

// ✅ With constants if needed
const Status = {
  Idle: "idle",
  Loading: "loading",
} as const;
```

### 2. Mixing string and numeric values

```typescript
// ❌ Heterogeneous enum (anti-pattern)
enum Mixed {
  A = 0,
  B = "B",
}

// ✅ Be consistent
enum AllNumeric {
  A = 0,
  B = 1,
}
enum AllStrings {
  A = "A",
  B = "B",
}
```

### 3. Expecting string enum reverse mappings

```typescript
enum Status {
  Idle = "IDLE",
}

// ❌ No reverse mapping for string enums
// Status["IDLE"] // Error!

// ✅ Only works with numeric enums
enum Code {
  OK = 200,
}
Code[200]; // "OK" ✅
```

### 4. Using const enums in libraries

```typescript
// ❌ Don't export const enums from libraries
export const enum Color {
  Red,
  Green,
}

// ✅ Use regular enums or union literals
export enum Color {
  Red,
  Green,
}
export type Color = "red" | "green";
```

### 5. Not initializing after computed members

```typescript
// ❌ Error after computed member
enum Bad {
  A = 1,
  B = Math.random(),
  C, // ❌ Error: must initialize after computed
}

// ✅ Initialize explicitly
enum Good {
  A = 1,
  B = Math.random(),
  C = 3, // ✅ Explicit value
}
```
