// Union & Intersection Types - Practical Examples
// Run with: npx ts-node 05-union-intersection.ts
// Or in TypeScript Playground: https://www.typescriptlang.org/play

/* ============================================
   1. UNION TYPES - OR Logic
   ============================================ */

console.log("=== 1. UNION TYPES ===\n");

// Basic unions
type ID = string | number;

let userId: ID = "user_123";
console.log("User ID (string):", userId);

userId = 456;
console.log("User ID (number):", userId);

// userId = true; // ❌ Error: boolean not assignable

// String literal unions (most common pattern!)
type Status = "pending" | "approved" | "rejected";
type Theme = "light" | "dark" | "auto";
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

let orderStatus: Status = "pending";
console.log("Order status:", orderStatus);

orderStatus = "approved";
// orderStatus = "shipped"; // ❌ Error: not in union

// Union of object types
type Dog = {
  type: "dog";
  bark: () => void;
  breed: string;
};

type Cat = {
  type: "cat";
  meow: () => void;
  color: string;
};

type Pet = Dog | Cat;

const myDog: Pet = {
  type: "dog",
  bark: () => console.log("Woof!"),
  breed: "Labrador",
};

const myCat: Pet = {
  type: "cat",
  meow: () => console.log("Meow!"),
  color: "orange",
};

console.log("Dog breed:", myDog.breed);
console.log("Cat color:", myCat.color);

// Complex unions
type SuccessResult = {
  success: true;
  data: string;
  timestamp: Date;
};

type ErrorResult = {
  success: false;
  error: string;
  code: number;
};

type APIResult = SuccessResult | ErrorResult;

const success: APIResult = {
  success: true,
  data: "Hello World",
  timestamp: new Date(),
};

const error: APIResult = {
  success: false,
  error: "Not found",
  code: 404,
};

console.log("Success result:", success);
console.log("Error result:", error);

// Array types with unions
// Array of strings OR array of numbers (not mixed!)
type StringOrNumberArray = string[] | number[];

const stringArr: StringOrNumberArray = ["a", "b", "c"];
const numberArr: StringOrNumberArray = [1, 2, 3];
// const mixedArr: StringOrNumberArray = [1, "a"]; // ❌ Error

console.log("String array:", stringArr);
console.log("Number array:", numberArr);

// Array that can contain strings OR numbers (mixed!)
type MixedArray = (string | number)[];

const mixed: MixedArray = [1, "hello", 2, "world", 3];
console.log("Mixed array:", mixed);

/* ============================================
   2. TYPE NARROWING - Making Unions Safe
   ============================================ */

console.log("\n=== 2. TYPE NARROWING ===\n");

// typeof narrowing
function printId(id: string | number) {
  // ❌ Can't use string methods on union
  // console.log(id.toUpperCase()); // Error!

  // ✅ Narrow with typeof
  if (typeof id === "string") {
    console.log("String ID:", id.toUpperCase());
  } else {
    console.log("Number ID:", id.toFixed(0));
  }
}

printId("abc123");
printId(456);

// Truthiness narrowing
function printName(name: string | null | undefined) {
  // Truthy check narrows to string
  if (name) {
    console.log("Name:", name.toUpperCase());
  } else {
    console.log("No name provided");
  }
}

printName("Alice");
printName(null);
printName(undefined);

// Equality narrowing
function compareValues(x: string | number, y: string | boolean) {
  if (x === y) {
    // Both must be string (only common type)
    console.log("Both are strings:", x.toUpperCase(), y.toUpperCase());
  } else {
    console.log("Different types or values");
  }
}

compareValues("hello", "hello");
compareValues("hello", "world");
compareValues(42, true);

// in operator narrowing
type Circle = {
  kind: "circle";
  radius: number;
};

type Square = {
  kind: "square";
  size: number;
};

type Shape = Circle | Square;

function getArea(shape: Shape): number {
  if ("radius" in shape) {
    // TypeScript knows it's Circle
    return Math.PI * shape.radius ** 2;
  } else {
    // TypeScript knows it's Square
    return shape.size ** 2;
  }
}

console.log("Circle area:", getArea({ kind: "circle", radius: 5 }));
console.log("Square area:", getArea({ kind: "square", size: 4 }));

// instanceof narrowing
function processValue(value: Date | string) {
  if (value instanceof Date) {
    console.log("Date timestamp:", value.getTime());
  } else {
    console.log("String length:", value.length);
  }
}

processValue(new Date());
processValue("Hello World");

// Assignment narrowing
let x: string | number = Math.random() > 0.5 ? "hello" : 42;
console.log("Initial x type: string | number");

x = "world";
console.log("After assignment, x is string:", x.toUpperCase());

x = 123;
console.log("After assignment, x is number:", x.toFixed(2));

/* ============================================
   3. DISCRIMINATED UNIONS - The Power Pattern
   ============================================ */

console.log("\n=== 3. DISCRIMINATED UNIONS ===\n");

// Basic discriminated union
type LoadingState = {
  status: "loading";
};

type SuccessState = {
  status: "success";
  data: string;
};

type ErrorState = {
  status: "error";
  error: string;
};

type State = LoadingState | SuccessState | ErrorState;

function renderState(state: State): string {
  // Discriminant is 'status'
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      return `Data: ${state.data}`; // data available!
    case "error":
      return `Error: ${state.error}`; // error available!
  }
}

console.log(renderState({ status: "loading" }));
console.log(renderState({ status: "success", data: "User data" }));
console.log(renderState({ status: "error", error: "Network failed" }));

// Complex discriminated union - Shapes
type Rectangle = {
  kind: "rectangle";
  width: number;
  height: number;
};

type CircleShape = {
  kind: "circle";
  radius: number;
};

type Triangle = {
  kind: "triangle";
  base: number;
  height: number;
};

type ComplexShape = Rectangle | CircleShape | Triangle;

function calculateArea(shape: ComplexShape): number {
  switch (shape.kind) {
    case "rectangle":
      return shape.width * shape.height;
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "triangle":
      return (shape.base * shape.height) / 2;
  }
}

console.log(
  "Rectangle area:",
  calculateArea({ kind: "rectangle", width: 5, height: 3 })
);
console.log("Circle area:", calculateArea({ kind: "circle", radius: 4 }));
console.log(
  "Triangle area:",
  calculateArea({ kind: "triangle", base: 6, height: 4 })
);

// Exhaustiveness checking with never
type Action =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "RESET" }
  | { type: "SET"; value: number };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    case "RESET":
      return 0;
    case "SET":
      return action.value;
    default:
      // If we forget a case, TypeScript errors here!
      const _exhaustive: never = action;
      return _exhaustive;
  }
}

console.log("Increment:", reducer(5, { type: "INCREMENT" }));
console.log("Decrement:", reducer(5, { type: "DECREMENT" }));
console.log("Reset:", reducer(5, { type: "RESET" }));
console.log("Set:", reducer(5, { type: "SET", value: 100 }));

// Real-world pattern: API states
type APIState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T; timestamp: Date }
  | { status: "error"; error: string; retryCount: number };

interface User {
  id: number;
  name: string;
  email: string;
}

function displayUserState(state: APIState<User>): string {
  switch (state.status) {
    case "idle":
      return "Click to load user";
    case "loading":
      return "Loading user...";
    case "success":
      return `User: ${
        state.data.name
      } (loaded at ${state.timestamp.toISOString()})`;
    case "error":
      return `Error: ${state.error} (retried ${state.retryCount} times)`;
  }
}

const userState: APIState<User> = {
  status: "success",
  data: { id: 1, name: "Alice", email: "alice@example.com" },
  timestamp: new Date(),
};

console.log(displayUserState(userState));

// Form field states
type FormFieldState =
  | { type: "pristine" }
  | { type: "validating" }
  | { type: "valid"; value: string }
  | { type: "invalid"; value: string; errors: string[] };

function renderFormField(field: FormFieldState): string {
  switch (field.type) {
    case "pristine":
      return "Not yet touched";
    case "validating":
      return "Validating...";
    case "valid":
      return `✓ Valid: ${field.value}`;
    case "invalid":
      return `✗ Invalid: ${field.value} - ${field.errors.join(", ")}`;
  }
}

console.log(renderFormField({ type: "pristine" }));
console.log(renderFormField({ type: "valid", value: "alice@example.com" }));
console.log(
  renderFormField({
    type: "invalid",
    value: "invalid-email",
    errors: ["Must be valid email"],
  })
);

/* ============================================
   4. CUSTOM TYPE GUARDS - Advanced Narrowing
   ============================================ */

console.log("\n=== 4. CUSTOM TYPE GUARDS ===\n");

// Basic type guard
interface Product {
  id: number;
  name: string;
  price: number;
}

function isProduct(value: unknown): value is Product {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    "price" in value &&
    typeof (value as Product).id === "number" &&
    typeof (value as Product).name === "string" &&
    typeof (value as Product).price === "number"
  );
}

function processProduct(data: unknown) {
  if (isProduct(data)) {
    console.log(`Product: ${data.name} - $${data.price}`);
  } else {
    console.log("Invalid product data");
  }
}

processProduct({ id: 1, name: "Laptop", price: 999 });
processProduct({ name: "Invalid" });

// Type guard for array filtering
function isNonNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

const values: (string | null | undefined)[] = [
  "a",
  null,
  "b",
  undefined,
  "c",
  null,
];

const validValues = values.filter(isNonNull); // Type: string[]
console.log("Valid values:", validValues);

// Type guard for union discrimination
type Bird = { type: "bird"; fly: () => void };
type Fish = { type: "fish"; swim: () => void };
type Animal = Bird | Fish;

function isBird(animal: Animal): animal is Bird {
  return animal.type === "bird";
}

function isFish(animal: Animal): animal is Fish {
  return animal.type === "fish";
}

function moveAnimal(animal: Animal) {
  if (isBird(animal)) {
    console.log("Bird is flying");
    animal.fly();
  } else if (isFish(animal)) {
    console.log("Fish is swimming");
    animal.swim();
  }
}

const bird: Animal = {
  type: "bird",
  fly: () => console.log("Flying!"),
};

const fish: Animal = {
  type: "fish",
  swim: () => console.log("Swimming!"),
};

moveAnimal(bird);
moveAnimal(fish);

// Type guard for string array
function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

function processArray(data: unknown) {
  if (isStringArray(data)) {
    console.log(
      "String array:",
      data.map((s) => s.toUpperCase())
    );
  } else {
    console.log("Not a string array");
  }
}

processArray(["a", "b", "c"]);
processArray([1, 2, 3]);
processArray(["a", 1, "b"]); // Mixed, not string array

// Generic type guard
function hasProperty<T, K extends string>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> {
  return typeof obj === "object" && obj !== null && key in obj;
}

function safeAccess(obj: unknown) {
  if (hasProperty(obj, "name")) {
    console.log("Name:", obj.name); // TypeScript knows name exists
  }
  if (hasProperty(obj, "age")) {
    console.log("Age:", obj.age); // TypeScript knows age exists
  }
}

safeAccess({ name: "Alice", age: 30 });
safeAccess({ name: "Bob" });

/* ============================================
   5. INTERSECTION TYPES - AND Logic
   ============================================ */

console.log("\n=== 5. INTERSECTION TYPES ===\n");

// Basic intersection
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
  // Must have ALL properties
};

console.log("Staff:", staff);

// Intersection with methods
type Printable = {
  print: () => void;
};

type Saveable = {
  save: () => void;
};

type Loggable = {
  log: () => void;
};

type Document = Printable &
  Saveable &
  Loggable & {
    title: string;
    content: string;
  };

const document: Document = {
  title: "Report",
  content: "Q4 Financial Report",
  print() {
    console.log(`Printing: ${this.title}`);
  },
  save() {
    console.log(`Saving: ${this.title}`);
  },
  log() {
    console.log(`Logging: ${this.title}`);
  },
};

document.print();
document.save();
document.log();

// Timestamp mixin pattern
type Timestamps = {
  createdAt: Date;
  updatedAt: Date;
};

type SoftDelete = {
  deletedAt: Date | null;
};

type BaseModel = {
  id: string;
};

type UserModel = BaseModel &
  Timestamps &
  SoftDelete & {
    email: string;
    username: string;
  };

const user: UserModel = {
  id: "user_123",
  email: "alice@example.com",
  username: "alice",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

console.log("User model:", user);

// Conflicting intersections (becomes never)
type A = { value: string };
type B = { value: number };

type Conflict = A & B;
// Conflict.value is string & number = never!

// This is impossible:
// const impossible: Conflict = {
//   value: ??? // Can't be both string AND number
// };

console.log("Conflicting intersection creates 'never' type");

// Practical: Adding metadata
type WithMetadata<T> = T & {
  metadata: {
    version: number;
    author: string;
    lastModified: Date;
  };
};

type Post = {
  title: string;
  content: string;
};

const postWithMeta: WithMetadata<Post> = {
  title: "TypeScript Tips",
  content: "Here are some useful tips...",
  metadata: {
    version: 1,
    author: "Alice",
    lastModified: new Date(),
  },
};

console.log("Post with metadata:", postWithMeta);

/* ============================================
   6. UNION vs INTERSECTION - Decision Making
   ============================================ */

console.log("\n=== 6. UNION vs INTERSECTION ===\n");

// UNION: Value is ONE of several types (OR)
type PaymentMethod = "credit-card" | "paypal" | "crypto";
type Result = Success | Error;
type ID2 = string | number;

console.log("Union examples (OR logic):");
console.log("- PaymentMethod: one of the payment types");
console.log("- Result: either Success or Error");
console.log("- ID: either string or number");

// INTERSECTION: Value has ALL properties (AND)
type Admin = User & {
  permissions: string[];
  role: "admin";
};

type AuditablePost = Post &
  Timestamps & {
    auditLog: string[];
  };

console.log("\nIntersection examples (AND logic):");
console.log("- Admin: has User properties AND admin properties");
console.log("- AuditablePost: has Post AND Timestamps AND audit properties");

// Common mistake: Using & for alternatives
// ❌ WRONG
// type Pet2 = Dog & Cat; // Must be BOTH! (impossible)

// ✅ RIGHT
type Pet2 = Dog | Cat; // Can be EITHER

// Practical comparison
type StringOrNumber = string | number; // Can pass string OR number
let value1: StringOrNumber = "hello";
value1 = 42;

type PersonAndEmployee = Person & Employee; // Must have BOTH Person and Employee props
const combo: PersonAndEmployee = {
  name: "Bob",
  age: 25,
  employeeId: 999,
  department: "Sales",
};

console.log("Union value:", value1);
console.log("Intersection value:", combo);

/* ============================================
   7. WORKING WITH UNIONS IN PRACTICE
   ============================================ */

console.log("\n=== 7. PRACTICAL UNION PATTERNS ===\n");

// Nullable types
type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type Maybe<T> = T | null | undefined;

function processNullable(value: Nullable<string>) {
  if (value !== null) {
    console.log("Not null:", value.toUpperCase());
  } else {
    console.log("Value is null");
  }
}

processNullable("hello");
processNullable(null);

// Union of functions
type Logger = (message: string) => void;
type ErrorLogger = (message: string, error: Error) => void;
type LogFunction = Logger | ErrorLogger;

const log1: LogFunction = (msg) => console.log(msg);
const log2: LogFunction = (msg, err) => console.log(msg, err?.message);

// Extract and Exclude utilities
type AllStatus = "idle" | "loading" | "success" | "error" | "cancelled";

type ActiveStatus = Exclude<AllStatus, "idle" | "cancelled">; // loading | success | error
type CompletedStatus = Extract<AllStatus, "success" | "error">; // success | error

console.log("Active statuses: loading, success, error");
console.log("Completed statuses: success, error");

// Union with discriminated objects
type MessageEvent =
  | { type: "text"; content: string }
  | { type: "image"; url: string; alt: string }
  | { type: "video"; url: string; duration: number };

function handleMessage(event: MessageEvent) {
  switch (event.type) {
    case "text":
      console.log("Text message:", event.content);
      break;
    case "image":
      console.log(`Image: ${event.url} (${event.alt})`);
      break;
    case "video":
      console.log(`Video: ${event.url} (${event.duration}s)`);
      break;
  }
}

handleMessage({ type: "text", content: "Hello!" });
handleMessage({ type: "image", url: "/pic.jpg", alt: "Photo" });
handleMessage({ type: "video", url: "/vid.mp4", duration: 120 });

/* ============================================
   8. ADVANCED PATTERNS
   ============================================ */

console.log("\n=== 8. ADVANCED PATTERNS ===\n");

// Conditional union extraction
type RemoveNull<T> = T extends null ? never : T;

type Original = string | number | null | boolean;
type WithoutNull = RemoveNull<Original>; // string | number | boolean

console.log("Removed null from union type");

// Distributed conditional types
type ToArray<T> = T extends any ? T[] : never;

type Numbers = number | string;
type ArrayTypes = ToArray<Numbers>; // number[] | string[]

const arr1: ArrayTypes = [1, 2, 3];
const arr2: ArrayTypes = ["a", "b"];
// const arr3: ArrayTypes = [1, "a"]; // ❌ Error

console.log("Distributed to array types:", arr1, arr2);

// Union to tuple (advanced)
type UnionToTuple<T> = (
  (T extends any ? (t: T) => T : never) extends infer U
    ? (U extends any ? (u: U) => any : never) extends (v: infer V) => any
      ? V
      : never
    : never
) extends (_: any) => infer W
  ? [...UnionToTuple<Exclude<T, W>>, W]
  : [];

type StatusUnion = "idle" | "loading" | "success";
// type StatusTuple = UnionToTuple<StatusUnion>; // Advanced pattern

// Practical: Handling async operations
type AsyncResult<T, E = Error> =
  | { status: "pending" }
  | { status: "fulfilled"; value: T }
  | { status: "rejected"; error: E };

async function fetchUser(id: number): Promise<AsyncResult<User>> {
  try {
    // Simulated async operation
    const userData = { id, name: "Alice", email: "alice@example.com" };
    return { status: "fulfilled", value: userData };
  } catch (error) {
    return { status: "rejected", error: error as Error };
  }
}

fetchUser(1).then((result) => {
  switch (result.status) {
    case "pending":
      console.log("Still loading...");
      break;
    case "fulfilled":
      console.log("User:", result.value);
      break;
    case "rejected":
      console.log("Error:", result.error);
      break;
  }
});

/* ============================================
   INTERVIEW CODING CHALLENGES
   ============================================ */

console.log("\n=== INTERVIEW CHALLENGES ===\n");

// Challenge 1: Type-safe state machine
type State2 =
  | { status: "idle" }
  | { status: "loading"; progress: number }
  | { status: "success"; data: string }
  | { status: "error"; error: string };

class StateMachine {
  private state: State2 = { status: "idle" };

  getState(): State2 {
    return this.state;
  }

  startLoading(): void {
    if (this.state.status === "idle") {
      this.state = { status: "loading", progress: 0 };
    }
  }

  updateProgress(progress: number): void {
    if (this.state.status === "loading") {
      this.state = { status: "loading", progress };
    }
  }

  complete(data: string): void {
    if (this.state.status === "loading") {
      this.state = { status: "success", data };
    }
  }

  fail(error: string): void {
    this.state = { status: "error", error };
  }
}

const machine = new StateMachine();
console.log("Initial:", machine.getState());
machine.startLoading();
console.log("Loading:", machine.getState());
machine.updateProgress(50);
console.log("Progress:", machine.getState());
machine.complete("Done!");
console.log("Complete:", machine.getState());

// Challenge 2: Implement a Result type
type Result2<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

function divide(a: number, b: number): Result2<number, string> {
  if (b === 0) {
    return { ok: false, error: "Division by zero" };
  }
  return { ok: true, value: a / b };
}

const result1 = divide(10, 2);
if (result1.ok) {
  console.log("Result:", result1.value);
} else {
  console.log("Error:", result1.error);
}

const result2 = divide(10, 0);
if (result2.ok) {
  console.log("Result:", result2.value);
} else {
  console.log("Error:", result2.error);
}

// Challenge 3: Type-safe event system
type EventHandler<T> = (data: T) => void;

type Events = {
  login: { userId: string; timestamp: Date };
  logout: { userId: string };
  error: { message: string; code: number };
};

class TypeSafeEventEmitter {
  private handlers: {
    [K in keyof Events]?: EventHandler<Events[K]>[];
  } = {};

  on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): void {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event]!.push(handler);
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    const handlers = this.handlers[event];
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }
}

const events = new TypeSafeEventEmitter();

events.on("login", (data) => {
  console.log(`User ${data.userId} logged in at ${data.timestamp}`);
});

events.on("error", (data) => {
  console.log(`Error ${data.code}: ${data.message}`);
});

events.emit("login", { userId: "user_123", timestamp: new Date() });
events.emit("error", { message: "Not found", code: 404 });

console.log("\n=== All examples completed successfully! ===");

/* ============================================
   QUICK REFERENCE CHEAT SHEET
   ============================================ */

/*
KEY TAKEAWAYS:

1. Union Types (|)
   ✅ Represents OR logic - value is one of several types
   ✅ Use for alternatives: string | number
   ✅ String literal unions: "idle" | "loading" | "success"
   ✅ Discriminated unions for complex states

2. Type Narrowing
   ✅ typeof for primitives
   ✅ instanceof for classes
   ✅ in operator for properties
   ✅ Equality checks
   ✅ Custom type guards with 'is'

3. Discriminated Unions
   ✅ Common literal property (type, kind, status)
   ✅ TypeScript narrows based on discriminant
   ✅ Exhaustiveness checking with never
   ✅ Most powerful pattern for state management

4. Intersection Types (&)
   ✅ Represents AND logic - value has all properties
   ✅ Use for composition: Person & Employee
   ✅ Great for mixins and metadata
   ✅ Conflicts create 'never' type

5. Custom Type Guards
   ✅ Return type: value is Type
   ✅ Use for complex validation
   ✅ Great for filtering arrays
   ✅ Reusable type checking logic

6. Union vs Intersection
   ✅ Union (|): alternatives, one of several types
   ✅ Intersection (&): composition, all properties
   ✅ Union for "either/or", intersection for "both"
   ✅ Don't confuse them!

COMMON PATTERNS:
- Discriminated unions for state machines
- Result/Either types for error handling
- API state management
- Type-safe event systems
- Nullable and optional types
- Union extraction with Exclude/Extract

INTERVIEW FAVORITES:
- Discriminated unions (always asked!)
- Type narrowing techniques
- Custom type guards
- Union vs intersection difference
- Exhaustiveness checking
*/
