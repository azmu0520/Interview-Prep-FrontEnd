# Union & Intersection Types - Deep Dive

## 🎯 Key Concepts

### 1. Union Types (OR) - CRITICAL!

**What it means:**

- A value can be **one of several types**
- Uses the pipe operator `|`
- Like logical OR: "Type A OR Type B"
- Must handle all possible types safely

**Basic union types:**

```typescript
type ID = string | number;

let userId: ID = "user_123"; // ✅
userId = 456; // ✅
// userId = true; // ❌ Error: boolean not in union

type Status = "pending" | "approved" | "rejected";
let orderStatus: Status = "pending"; // ✅
// let orderStatus: Status = "shipped"; // ❌ Error: not in union
```

**Union with objects:**

```typescript
type Dog = {
  type: "dog";
  bark: () => void;
};

type Cat = {
  type: "cat";
  meow: () => void;
};

type Pet = Dog | Cat;

const myPet: Pet = {
  type: "dog",
  bark: () => console.log("Woof!"),
};
```

**Why unions are powerful:**

- ✅ Type-safe alternatives to `any`
- ✅ Express multiple valid types
- ✅ Force exhaustive handling
- ✅ Enable discriminated unions (tagged unions)
- ✅ Better than inheritance in many cases

**Common use cases:**

- API responses: `Result<T> | Error`
- Optional values: `T | null | undefined`
- Multiple input types: `string | number`
- State machines: `"idle" | "loading" | "success" | "error"`
- Event types: `MouseEvent | KeyboardEvent | TouchEvent`

**Interview Gold:** "Unions represent OR logic - a value can be one of several types. They're safer than `any` because TypeScript forces you to narrow the type before using type-specific operations. I use unions for flexible APIs, state machines, and discriminated unions which are one of TypeScript's most powerful patterns."

---

### 2. Type Narrowing with Unions (CRITICAL!)

**What it means:**

- Process of refining a union type to a more specific type
- TypeScript's control flow analysis tracks type changes
- Essential for working safely with unions

**typeof narrowing:**

```typescript
function printId(id: string | number) {
  // ❌ Can't call string methods on string | number
  // console.log(id.toUpperCase());

  // ✅ Narrow with typeof
  if (typeof id === "string") {
    console.log(id.toUpperCase()); // TypeScript knows id is string
  } else {
    console.log(id.toFixed(2)); // TypeScript knows id is number
  }
}
```

**Truthiness narrowing:**

```typescript
function printName(name: string | null | undefined) {
  // ❌ Can't use name directly
  // console.log(name.toUpperCase());

  // ✅ Narrow with truthiness check
  if (name) {
    console.log(name.toUpperCase()); // name is string
  } else {
    console.log("No name provided"); // name is null | undefined
  }
}
```

**Equality narrowing:**

```typescript
function compare(x: string | number, y: string | boolean) {
  if (x === y) {
    // Both must be string (only common type)
    x.toUpperCase();
    y.toUpperCase();
  }
}
```

**in operator narrowing:**

```typescript
type Dog = { bark: () => void };
type Cat = { meow: () => void };

function makeSound(pet: Dog | Cat) {
  if ("bark" in pet) {
    pet.bark(); // TypeScript knows it's Dog
  } else {
    pet.meow(); // TypeScript knows it's Cat
  }
}
```

**instanceof narrowing:**

```typescript
function processValue(value: Date | string) {
  if (value instanceof Date) {
    console.log(value.getTime()); // value is Date
  } else {
    console.log(value.toUpperCase()); // value is string
  }
}
```

**Assignment narrowing:**

```typescript
let x: string | number = Math.random() > 0.5 ? "hello" : 42;
// x is string | number

x = "world";
// x is now string (narrowed by assignment)

console.log(x.toUpperCase()); // ✅ Safe
```

---

### 3. Discriminated Unions (Tagged Unions) - CRITICAL!

**What it means:**

- Union types with a common literal property (discriminant)
- TypeScript uses the discriminant to narrow the type
- The most powerful pattern for complex state management

**Basic discriminated union:**

```typescript
type Success = {
  status: "success";
  data: string;
};

type Error = {
  status: "error";
  error: string;
};

type Result = Success | Error;

function handleResult(result: Result) {
  // Discriminant is 'status'
  if (result.status === "success") {
    console.log(result.data); // TypeScript knows it's Success
  } else {
    console.log(result.error); // TypeScript knows it's Error
  }
}
```

**Why discriminated unions are powerful:**

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number }
  | { kind: "rectangle"; width: number; height: number };

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2; // radius available
    case "square":
      return shape.size ** 2; // size available
    case "rectangle":
      return shape.width * shape.height; // width & height available
  }
}
```

**Exhaustiveness checking:**

```typescript
type Action = { type: "INCREMENT" } | { type: "DECREMENT" } | { type: "RESET" };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    case "RESET":
      return 0;
    default:
      const _exhaustive: never = action; // Ensures all cases handled
      return _exhaustive;
  }
}

// If you add a new action type and forget to handle it:
// type Action = ... | { type: "SET"; value: number };
// TypeScript will error at the never assignment!
```

**Real-world example - API states:**

```typescript
type APIState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

function renderUser(state: APIState<User>) {
  switch (state.status) {
    case "idle":
      return "Click to load";
    case "loading":
      return "Loading...";
    case "success":
      return `User: ${state.data.name}`; // data available
    case "error":
      return `Error: ${state.error}`; // error available
  }
}
```

**Common discriminant patterns:**

- `kind` or `type` property (most common)
- `status` for state machines
- `tag` for tagged unions
- Any literal property works!

---

### 4. Custom Type Guards

**What it means:**

- Functions that tell TypeScript a value is a specific type
- Return type is `value is Type`
- Essential for complex type narrowing

**Basic type guard:**

```typescript
interface User {
  name: string;
  email: string;
}

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "email" in value &&
    typeof (value as User).name === "string" &&
    typeof (value as User).email === "string"
  );
}

function processUser(data: unknown) {
  if (isUser(data)) {
    console.log(data.name); // TypeScript knows data is User
    console.log(data.email);
  }
}
```

**Type guard for union discrimination:**

```typescript
type Dog = { type: "dog"; bark: () => void };
type Cat = { type: "cat"; meow: () => void };
type Pet = Dog | Cat;

function isDog(pet: Pet): pet is Dog {
  return pet.type === "dog";
}

function handlePet(pet: Pet) {
  if (isDog(pet)) {
    pet.bark(); // TypeScript knows it's Dog
  } else {
    pet.meow(); // TypeScript knows it's Cat
  }
}
```

**Type guard for null checking:**

```typescript
function isNonNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

const values: (string | null)[] = ["a", null, "b", null, "c"];
const validValues = values.filter(isNonNull); // Type: string[]
```

**Array type guard:**

```typescript
function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}
```

**When to use custom type guards:**

- ✅ Validating unknown data (API responses, user input)
- ✅ Complex type checking logic
- ✅ Reusable type narrowing
- ✅ Working with discriminated unions
- ✅ Filtering arrays by type

---

### 5. Intersection Types (AND) - CRITICAL!

**What it means:**

- Combine multiple types into one
- Uses the ampersand operator `&`
- Like logical AND: "Type A AND Type B"
- Result has ALL properties from all types

**Basic intersection:**

```typescript
type Person = {
  name: string;
  age: number;
};

type Employee = {
  employeeId: number;
  department: string;
};

type Staff = Person & Employee;

const staff: Staff = {
  name: "Alice",
  age: 30,
  employeeId: 12345,
  department: "Engineering",
  // Must have ALL properties from both types
};
```

**Intersection with methods:**

```typescript
type Printable = {
  print: () => void;
};

type Loggable = {
  log: () => void;
};

type Document = Printable &
  Loggable & {
    title: string;
  };

const doc: Document = {
  title: "Report",
  print() {
    console.log("Printing...");
  },
  log() {
    console.log("Logging...");
  },
};
```

**When intersections conflict:**

```typescript
type A = { value: string };
type B = { value: number };

type C = A & B;
// C.value is string & number = never (impossible!)

const impossible: C = {
  value: ??? // No value can be both string AND number
};
```

**Intersection vs Union:**

```typescript
// Union: value can be Dog OR Cat (one of them)
type PetUnion = Dog | Cat;
const pet1: PetUnion = { type: "dog", bark: () => {} }; // ✅

// Intersection: value must be Dog AND Cat (both)
type PetIntersection = Dog & Cat;
// Impossible if Dog and Cat have conflicting properties!
```

---

### 6. Union vs Intersection Decision Making

**When to use UNION (|):**

- ✅ Value can be **one of several types**
- ✅ Representing alternatives
- ✅ Optional or nullable values
- ✅ Different shapes for the same concept
- ✅ State machines (idle | loading | success | error)

```typescript
// ✅ Good union usage
type Result = Success | Error;
type ID = string | number;
type Status = "pending" | "approved" | "rejected";
```

**When to use INTERSECTION (&):**

- ✅ Combining multiple **interfaces/types**
- ✅ Adding properties to existing types
- ✅ Mixins and composition
- ✅ Requiring **all properties** from multiple sources

```typescript
// ✅ Good intersection usage
type Admin = User & { permissions: string[] };
type Timestamped = { createdAt: Date; updatedAt: Date };
type Post = BasePost & Timestamped;
```

**Common mistake - Using intersection like union:**

```typescript
// ❌ WRONG: Trying to use intersection for alternatives
type Animal = Dog & Cat; // Impossible! Can't be both

// ✅ RIGHT: Use union for alternatives
type Animal = Dog | Cat; // Can be Dog OR Cat
```

**Mental model:**

- **Union (|)**: "This OR that" - **one of the types**
- **Intersection (&)**: "This AND that" - **all of the types**

**Practical example:**

```typescript
// Union - API can return success OR error
type APIResponse =
  | { success: true; data: User }
  | { success: false; error: string };

// Intersection - Admin has User properties AND admin properties
type AdminUser = User & {
  role: "admin";
  permissions: string[];
};
```

---

### 7. Working with Union Types in Practice

**Handling unions safely:**

```typescript
function process(value: string | number | boolean) {
  // ❌ Can't assume type
  // value.toUpperCase(); // Error!

  // ✅ Narrow before using
  if (typeof value === "string") {
    return value.toUpperCase();
  } else if (typeof value === "number") {
    return value.toFixed(2);
  } else {
    return value ? "yes" : "no";
  }
}
```

**Union of arrays:**

```typescript
// Array of strings OR array of numbers (not mixed!)
type StringArrayOrNumberArray = string[] | number[];

const arr1: StringArrayOrNumberArray = ["a", "b"]; // ✅
const arr2: StringArrayOrNumberArray = [1, 2, 3]; // ✅
// const arr3: StringArrayOrNumberArray = [1, "a"]; // ❌
```

**Array of union (mixed array):**

```typescript
// Array that can contain strings OR numbers (mixed!)
type MixedArray = (string | number)[];

const arr: MixedArray = [1, "a", 2, "b"]; // ✅
```

**Union with null/undefined:**

```typescript
type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type Maybe<T> = T | null | undefined;

function greet(name: Maybe<string>) {
  // Must check for null AND undefined
  if (name != null) {
    // Checks both null and undefined
    console.log(`Hello, ${name}`);
  }
}
```

**Extracting from unions:**

```typescript
type AllTypes = string | number | boolean | null;

// Extract only primitive types
type OnlyPrimitives = Exclude<AllTypes, null>; // string | number | boolean

// Extract only certain types
type OnlyStrings = Extract<AllTypes, string>; // string
```

---

### 8. Advanced Union Patterns

**Conditional union extraction:**

```typescript
type RemoveNull<T> = T extends null ? never : T;

type Original = string | number | null;
type WithoutNull = RemoveNull<Original>; // string | number
```

**Union to intersection (advanced):**

```typescript
type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (
  x: infer I
) => void
  ? I
  : never;

type Union = { a: string } | { b: number };
type Intersection = UnionToIntersection<Union>;
// Result: { a: string } & { b: number }
```

**Distributed conditional types:**

```typescript
type ToArray<T> = T extends any ? T[] : never;

type StringOrNumber = string | number;
type Result = ToArray<StringOrNumber>;
// Distributes over union: string[] | number[]
```

---

## 🎤 Top Interview Questions & Model Answers

### Q1: What's the difference between union and intersection types?

**Answer:**

> "Union types use `|` and represent 'OR' logic - a value can be one of several types. Intersection types use `&` and represent 'AND' logic - a value must satisfy all types. For example, `string | number` means the value is either a string or a number, while `Person & Employee` means the value has all properties from both Person and Employee. Unions are for alternatives, intersections are for composition. A common mistake is trying to use intersections for alternatives - `Dog & Cat` would require being both simultaneously, which is usually impossible. Use unions for that case instead."

---

### Q2: What are discriminated unions and why are they important?

**Answer:**

> "Discriminated unions, also called tagged unions, are union types where each variant has a common literal property called a discriminant - usually named 'type', 'kind', or 'status'. TypeScript uses this discriminant to narrow the type in switch statements or if blocks. For example, `{ type: 'success'; data: T } | { type: 'error'; error: string }` lets TypeScript know which properties are available based on the 'type' property. They're incredibly powerful for state machines, API responses, and Redux-style actions because they provide type-safe exhaustiveness checking and prevent accessing properties that don't exist in a particular variant."

---

### Q3: How does type narrowing work with unions?

**Answer:**

> "Type narrowing is TypeScript's control flow analysis that refines union types to more specific types. TypeScript tracks the type through your code's logic. Common narrowing techniques include typeof checks for primitives, instanceof for classes, 'in' operator for properties, equality checks, and custom type guards using 'is'. For example, in `if (typeof value === 'string')`, TypeScript knows value is a string in that block. Discriminated unions use the discriminant property for narrowing. This is essential because you can't call type-specific methods on a union without narrowing first."

---

### Q4: When should you use custom type guards?

**Answer:**

> "I use custom type guards in four main scenarios: First, validating unknown data from APIs or user input where I need to check the structure. Second, when working with complex union types where built-in narrowing isn't sufficient. Third, for reusable type checking logic that I use in multiple places. Fourth, when filtering arrays by type, since the type guard tells TypeScript the filtered result's type. The key is using the `value is Type` return type syntax, which tells TypeScript's control flow analysis that the value is that specific type when the function returns true."

---

### Q5: What happens when intersection types have conflicting properties?

**Answer:**

> "When intersection types have properties with the same name but different types, the resulting property type is the intersection of those types, which can become 'never' if they're incompatible. For example, `{ value: string } & { value: number }` results in `value: string & number`, which is 'never' because nothing can be both string and number simultaneously. This makes the entire type unusable. This usually indicates a design problem - you probably wanted a union instead, or you need to rename the conflicting properties. It's TypeScript's way of saying 'this combination is impossible.'"

---

## 🔑 Must Know Checklist

### ✅ Critical (Always asked)

- ✅ Union types (|) - OR logic
- ✅ Type narrowing techniques
- ✅ Discriminated unions pattern
- ✅ Intersection types (&) - AND logic

### ✅ Should Know (Often asked)

- ✅ Custom type guards (is keyword)
- ✅ Union vs intersection decision making
- ✅ Exhaustiveness checking with never
- ✅ Working with nullable unions

### ✅ Nice to Know (Senior level)

- [ ] Union to intersection conversion
- [ ] Distributed conditional types
- [ ] Advanced narrowing patterns
- [ ] Generic type guard utilities

---

## 🚨 Common Mistakes to Avoid

### 1. Confusing union with intersection

```typescript
// ❌ WRONG: Using & for alternatives
type Pet = Dog & Cat; // Must be both! (impossible)

// ✅ RIGHT: Using | for alternatives
type Pet = Dog | Cat; // Can be either
```

### 2. Not narrowing before accessing properties

```typescript
// ❌ Accessing union without narrowing
function print(value: string | number) {
  console.log(value.toUpperCase()); // Error!
}

// ✅ Narrow first
function print(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  }
}
```

### 3. Forgetting exhaustiveness checks

```typescript
// ❌ Missing case, no error
type Status = "idle" | "loading" | "success" | "error";
function handle(status: Status) {
  switch (status) {
    case "idle":
      return "Idle";
    case "loading":
      return "Loading";
    // Missing success and error!
  }
}

// ✅ Exhaustiveness check
function handle(status: Status) {
  switch (status) {
    case "idle":
      return "Idle";
    case "loading":
      return "Loading";
    case "success":
      return "Success";
    case "error":
      return "Error";
    default:
      const _: never = status;
      return _;
  }
}
```

### 4. Wrong array type syntax

```typescript
// Array of union (mixed)
type Mixed = (string | number)[]; // [1, "a", 2]

// Union of arrays (not mixed)
type Separate = string[] | number[]; // ["a", "b"] OR [1, 2]
```
