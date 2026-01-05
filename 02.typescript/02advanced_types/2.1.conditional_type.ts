// Conditional Types - Practical Examples
// Run with: npx ts-node conditional-types.ts
// Or in TypeScript Playground: https://www.typescriptlang.org/play

/* ============================================
   1. CONDITIONAL TYPE BASICS
   ============================================ */

console.log("=== 1. CONDITIONAL TYPE BASICS ===\n");

// Basic conditional type - like ternary operator
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
type C = IsString<"hello">; // true (literal extends string)
type D = IsString<any>; // boolean (special case)

console.log("IsString tests completed");

// Multiple conditions (nested)
type TypeName<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : T extends undefined
  ? "undefined"
  : T extends Function
  ? "function"
  : "object";

type T1 = TypeName<string>; // "string"
type T2 = TypeName<42>; // "number"
type T3 = TypeName<true>; // "boolean"
type T4 = TypeName<() => void>; // "function"
type T5 = TypeName<{}>; // "object"

console.log("TypeName tests completed");

// Conditional with object types
type MessageType<T> = T extends Error
  ? "error"
  : T extends string
  ? "text"
  : "data";

type M1 = MessageType<Error>; // "error"
type M2 = MessageType<string>; // "text"
type M3 = MessageType<number>; // "data"

console.log("MessageType tests completed");

// Function to demonstrate usage
function processMessage<T>(value: T): MessageType<T> {
  if (value instanceof Error) {
    return "error" as MessageType<T>;
  }
  if (typeof value === "string") {
    return "text" as MessageType<T>;
  }
  return "data" as MessageType<T>;
}

console.log("Error message:", processMessage(new Error("test")));
console.log("String message:", processMessage("hello"));
console.log("Data message:", processMessage(42));

/* ============================================
   2. DISTRIBUTIVE CONDITIONAL TYPES
   ============================================ */

console.log("\n=== 2. DISTRIBUTIVE CONDITIONAL TYPES ===\n");

// Distributive behavior with naked type parameter
type ToArray<T> = T extends any ? T[] : never;

type Arr1 = ToArray<string>; // string[]
type Arr2 = ToArray<string | number>; // string[] | number[] (distributed!)

console.log("ToArray distributes over unions");

// Non-distributive (wrapped in tuple)
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;

type Arr3 = ToArrayNonDist<string | number>; // (string | number)[]

console.log("ToArrayNonDist doesn't distribute");

// Exclude utility (distributive)
type MyExclude<T, U> = T extends U ? never : T;

type Ex1 = MyExclude<"a" | "b" | "c", "a">; // "b" | "c"
type Ex2 = MyExclude<string | number, number>; // string
type Ex3 = MyExclude<string | number | boolean, string | boolean>; // number

console.log("Exclude removes types from union");

// Extract utility (distributive)
type MyExtract<T, U> = T extends U ? T : never;

type Ext1 = MyExtract<"a" | "b" | "c", "a" | "f">; // "a"
type Ext2 = MyExtract<string | number, number>; // number

console.log("Extract keeps only matching types");

// Practical: Filter nullable types
type NonNullable<T> = T extends null | undefined ? never : T;

type NN1 = NonNullable<string | null | undefined>; // string
type NN2 = NonNullable<number | null>; // number

function assertNonNull<T>(value: T): NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error("Value is null or undefined");
  }
  return value as NonNullable<T>;
}

const result1 = assertNonNull("hello");
console.log("Non-null result:", result1);

// Distribution visualization
type ShowDistribution<T> = T extends any ? `Type: ${T & string}` : never;

type Dist = ShowDistribution<"a" | "b" | "c">;
// "Type: a" | "Type: b" | "Type: c"

console.log("Distribution applies to each union member");

/* ============================================
   3. INFER KEYWORD - Type Extraction
   ============================================ */

console.log("\n=== 3. INFER KEYWORD ===\n");

// Extract return type
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getString(): string {
  return "hello";
}

function getNumber(): number {
  return 42;
}

type RT1 = MyReturnType<typeof getString>; // string
type RT2 = MyReturnType<typeof getNumber>; // number
type RT3 = MyReturnType<() => boolean>; // boolean

console.log("ReturnType extracts function return type");

// Extract parameter types
type MyParameters<T> = T extends (...args: infer P) => any ? P : never;

function example(a: string, b: number, c: boolean): void {}

type Params = MyParameters<typeof example>; // [string, number, boolean]

console.log("Parameters extracts function parameters");

// Extract array element type
type ElementType<T> = T extends (infer E)[] ? E : never;

type El1 = ElementType<string[]>; // string
type El2 = ElementType<number[]>; // number
type El3 = ElementType<boolean[]>; // boolean

console.log("ElementType extracts array element type");

// Extract Promise value
type MyAwaited<T> = T extends Promise<infer U> ? U : T;

type Aw1 = MyAwaited<Promise<string>>; // string
type Aw2 = MyAwaited<Promise<number>>; // number
type Aw3 = MyAwaited<boolean>; // boolean (not a Promise)

console.log("Awaited unwraps Promise type");

// Deep awaited (recursive)
type DeepAwaited<T> = T extends Promise<infer U> ? DeepAwaited<U> : T;

type DAw1 = DeepAwaited<Promise<Promise<string>>>; // string
type DAw2 = DeepAwaited<Promise<Promise<Promise<number>>>>; // number

console.log("DeepAwaited recursively unwraps nested Promises");

// Extract first parameter
type FirstParam<T> = T extends (first: infer F, ...args: any[]) => any
  ? F
  : never;

type FP1 = FirstParam<(a: string, b: number) => void>; // string
type FP2 = FirstParam<(x: boolean) => void>; // boolean

console.log("FirstParam extracts first function parameter");

// Constructor parameters
type ConstructorParams<T> = T extends new (...args: infer P) => any ? P : never;

class User {
  constructor(public name: string, public age: number) {}
}

type UserParams = ConstructorParams<typeof User>; // [string, number]

const userInstance = new User("Alice", 30);
console.log("User:", userInstance);

/* ============================================
   4. NESTED CONDITIONAL TYPES
   ============================================ */

console.log("\n=== 4. NESTED CONDITIONAL TYPES ===\n");

// Complex type checking
type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;

type Up1 = Unpacked<string[]>; // string
type Up2 = Unpacked<() => number>; // number
type Up3 = Unpacked<Promise<boolean>>; // boolean
type Up4 = Unpacked<Date>; // Date (unchanged)

console.log("Unpacked handles arrays, functions, and Promises");

// Flatten array types
type Flatten<T> = T extends Array<infer U> ? U : T;

type Fl1 = Flatten<string[]>; // string
type Fl2 = Flatten<number[][]>; // number[] (one level)
type Fl3 = Flatten<boolean>; // boolean (not array)

console.log("Flatten extracts one array level");

// Deep flatten (recursive)
type DeepFlatten<T> = T extends Array<infer U> ? DeepFlatten<U> : T;

type DF1 = DeepFlatten<string[]>; // string
type DF2 = DeepFlatten<number[][][]>; // number (fully flattened)
type DF3 = DeepFlatten<Array<Array<boolean>>>; // boolean

console.log("DeepFlatten recursively flattens nested arrays");

// DeepReadonly
type DeepReadonly<T> = T extends any[]
  ? ReadonlyArray<DeepReadonly<T[number]>>
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

interface Config {
  server: {
    host: string;
    port: number;
  };
  features: string[];
}

type ReadonlyConfig = DeepReadonly<Config>;
// All properties and nested properties are readonly

const config: ReadonlyConfig = {
  server: { host: "localhost", port: 3000 },
  features: ["auth", "api"],
};

console.log("Config:", config);
// config.server.port = 8080; // ❌ Error: readonly

/* ============================================
   5. BUILT-IN UTILITY TYPES
   ============================================ */

console.log("\n=== 5. BUILT-IN UTILITY TYPES ===\n");

// Exclude - remove types from union
type Status = "idle" | "loading" | "success" | "error";
type NonIdleStatus = Exclude<Status, "idle">; // "loading" | "success" | "error"

console.log("Exclude removes types");

// Extract - keep only matching types
type StringOrNumber = string | number | boolean;
type OnlyString = Extract<StringOrNumber, string>; // string

console.log("Extract keeps matching types");

// NonNullable - remove null and undefined
type MaybeString = string | null | undefined;
type DefinitelyString = NonNullable<MaybeString>; // string

console.log("NonNullable removes null/undefined");

// ReturnType - extract function return
function createUser() {
  return { id: 1, name: "Alice" };
}

type UserReturn = ReturnType<typeof createUser>; // { id: number; name: string }

console.log("ReturnType extracts return type");

// Parameters - extract parameters
function updateUser(id: number, name: string, email: string) {}

type UpdateParams = Parameters<typeof updateUser>; // [number, string, string]

console.log("Parameters extracts parameter types");

// ConstructorParameters - extract constructor params
class Product {
  constructor(id: number, name: string, price: number) {}
}

type ProductParams = ConstructorParameters<typeof Product>; // [number, string, number]

console.log("ConstructorParameters extracts constructor params");

// InstanceType - get instance type from constructor
type ProductInstance = InstanceType<typeof Product>; // Product

const product: ProductInstance = new Product(1, "Laptop", 999);
console.log("Product:", product);

/* ============================================
   6. PRACTICAL PATTERNS
   ============================================ */

console.log("\n=== 6. PRACTICAL PATTERNS ===\n");

// Pattern 1: Filter object keys by value type
type FilterByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

interface Person {
  name: string;
  age: number;
  email: string;
  isActive: boolean;
}

type StringProps = FilterByType<Person, string>; // { name: string; email: string }
type NumberProps = FilterByType<Person, number>; // { age: number }

console.log("FilterByType extracts properties by type");

// Pattern 2: Required keys only
type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

interface User {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

type UserRequiredKeys = RequiredKeys<User>; // "id" | "name"

console.log("RequiredKeys finds required properties");

// Pattern 3: Optional keys only
type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

type UserOptionalKeys = OptionalKeys<User>; // "email" | "phone"

console.log("OptionalKeys finds optional properties");

// Pattern 4: Function property keys
type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

interface API {
  baseUrl: string;
  timeout: number;
  get: () => void;
  post: () => void;
  delete: () => void;
}

type APIFunctions = FunctionKeys<API>; // "get" | "post" | "delete"

console.log("FunctionKeys finds function properties");

// Pattern 5: Tuple to union
type TupleToUnion<T extends readonly any[]> = T[number];

type Colors = readonly ["red", "green", "blue"];
type Color = TupleToUnion<Colors>; // "red" | "green" | "blue"

console.log("TupleToUnion converts tuple to union");

// Pattern 6: Union to intersection (advanced)
type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (
  x: infer I
) => void
  ? I
  : never;

type Union = { a: string } | { b: number };
type Intersection = UnionToIntersection<Union>; // { a: string } & { b: number }

console.log("UnionToIntersection converts union to intersection");

/* ============================================
   7. ADVANCED PATTERNS
   ============================================ */

console.log("\n=== 7. ADVANCED PATTERNS ===\n");

// IsAny type
type IsAny<T> = 0 extends 1 & T ? true : false;

type Any1 = IsAny<any>; // true
type Any2 = IsAny<string>; // false
type Any3 = IsAny<unknown>; // false

console.log("IsAny detects any type");

// IsNever type
type IsNever<T> = [T] extends [never] ? true : false;

type Never1 = IsNever<never>; // true
type Never2 = IsNever<any>; // false
type Never3 = IsNever<void>; // false

console.log("IsNever detects never type");

// IsUnknown type
type IsUnknown<T> = unknown extends T
  ? [T] extends [null]
    ? false
    : true
  : false;

type Unk1 = IsUnknown<unknown>; // true
type Unk2 = IsUnknown<any>; // false
type Unk3 = IsUnknown<string>; // false

console.log("IsUnknown detects unknown type");

// Exact type equality
type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type Eq1 = Equals<string, string>; // true
type Eq2 = Equals<string, number>; // false
type Eq3 = Equals<string, string | number>; // false

console.log("Equals checks exact type equality");

// IsReadonly property check
type IsReadonly<T, K extends keyof T> = Equals<
  { [P in K]: T[P] },
  { -readonly [P in K]: T[P] }
> extends true
  ? false
  : true;

interface ReadonlyObj {
  readonly id: number;
  name: string;
}

type IdReadonly = IsReadonly<ReadonlyObj, "id">; // true
type NameReadonly = IsReadonly<ReadonlyObj, "name">; // false

console.log("IsReadonly detects readonly properties");

/* ============================================
   8. REAL-WORLD EXAMPLES
   ============================================ */

console.log("\n=== 8. REAL-WORLD EXAMPLES ===\n");

// Example 1: Type-safe event emitter
type EventMap = {
  login: { userId: string; timestamp: Date };
  logout: { userId: string };
  purchase: { productId: string; amount: number };
};

type EventCallback<T extends keyof EventMap> = (data: EventMap[T]) => void;

class TypedEventEmitter {
  private handlers: {
    [K in keyof EventMap]?: EventCallback<K>[];
  } = {};

  on<T extends keyof EventMap>(event: T, handler: EventCallback<T>): void {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event]!.push(handler);
  }

  emit<T extends keyof EventMap>(event: T, data: EventMap[T]): void {
    const callbacks = this.handlers[event];
    if (callbacks) {
      callbacks.forEach((cb) => cb(data));
    }
  }
}

const emitter = new TypedEventEmitter();
emitter.on("login", (data) => {
  console.log("User logged in:", data.userId);
});
emitter.emit("login", { userId: "user_123", timestamp: new Date() });

// Example 2: API response handler
type APIResponse<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string };

type UnwrapAPIResponse<T> = T extends APIResponse<infer U> ? U : never;

type UserResponse = APIResponse<{ id: number; name: string }>;
type UserData = UnwrapAPIResponse<UserResponse>; // { id: number; name: string }

function handleResponse<T>(response: APIResponse<T>): T | null {
  if (response.status === "success") {
    return response.data;
  }
  console.error(response.error);
  return null;
}

const apiResponse: APIResponse<string> = { status: "success", data: "Hello" };
const result = handleResponse(apiResponse);
console.log("API result:", result);

// Example 3: Deep partial for form state
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

interface FormData {
  user: {
    name: string;
    email: string;
    address: {
      street: string;
      city: string;
      country: string;
    };
  };
}

type PartialFormData = DeepPartial<FormData>;

const formDraft: PartialFormData = {
  user: {
    name: "Alice",
    // email and address are optional
    address: {
      city: "NYC",
      // street and country are optional
    },
  },
};

console.log("Form draft:", formDraft);

console.log("\n=== All examples completed successfully! ===");

/* ============================================
   QUICK REFERENCE CHEAT SHEET
   ============================================ */

/*
KEY TAKEAWAYS:

1. Basic Syntax
   ✅ T extends U ? X : Y
   ✅ Like ternary for types
   ✅ Checks assignability
   ✅ Compile-time evaluation

2. Distributive Behavior
   ✅ Naked type params distribute over unions
   ✅ Applied to each member separately
   ✅ Results are unioned
   ✅ Prevent with [T] wrapper

3. infer Keyword
   ✅ Extract types from conditions
   ✅ Only in true branch
   ✅ Creates type variable
   ✅ Essential for utilities

4. Common Utilities
   ✅ Exclude<T, U> - remove from union
   ✅ Extract<T, U> - keep matching
   ✅ NonNullable<T> - remove null/undefined
   ✅ ReturnType<T> - function return
   ✅ Parameters<T> - function params

5. Practical Patterns
   ✅ Filter keys by type
   ✅ Required/Optional keys
   ✅ Function keys
   ✅ Tuple to union
   ✅ Deep readonly/partial

6. Advanced Techniques
   ✅ IsAny, IsNever checks
   ✅ Exact equality
   ✅ Union to intersection
   ✅ Recursive conditionals

INTERVIEW TIPS:
- Explain distributive behavior clearly
- Show infer usage patterns
- Implement common utilities
- Understand extends as assignability
- Know when to prevent distribution
*/
