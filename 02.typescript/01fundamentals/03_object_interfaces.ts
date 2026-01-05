// Objects and Interfaces - Practical Examples
// Run with: npx ts-node 03-objects-interfaces.ts
// Or in TypeScript Playground: https://www.typescriptlang.org/play

/* ============================================
   1. INTERFACE vs TYPE - Critical Understanding
   ============================================ */

console.log("=== 1. INTERFACE vs TYPE ===\n");

// INTERFACES - Best for object shapes
interface User {
  id: number;
  name: string;
  email: string;
}

// ✅ Interfaces can extend
interface Admin extends User {
  permissions: string[];
  level: number;
}

// ✅ Interfaces can be reopened (declaration merging)
interface User {
  createdAt: Date; // Adds to existing User interface
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  createdAt: new Date(),
};

console.log("User:", user);

// TYPE ALIASES - More flexible
type Product = {
  id: number;
  name: string;
  price: number;
};

// ✅ Types can do unions (interfaces cannot)
type Status = "pending" | "approved" | "rejected";
type ID = string | number;

// ✅ Types can do mapped types
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// ✅ Types can do conditional types
type IsString<T> = T extends string ? "yes" : "no";
type Test = IsString<"hello">; // "yes"

// ❌ Types CANNOT be reopened
// type Product = { ... } // Error: Duplicate identifier

// ✅ Can intersect types
type DiscountedProduct = Product & {
  discount: number;
  discountCode: string;
};

const product: DiscountedProduct = {
  id: 1,
  name: "Laptop",
  price: 999,
  discount: 0.1,
  discountCode: "SAVE10",
};

console.log("Product:", product);

// HYBRID - Interface extending type
type BaseEntity = {
  id: number;
  createdAt: Date;
};

interface Article extends BaseEntity {
  title: string;
  content: string;
}

// HYBRID - Type extending interface
type ExtendedUser = User & {
  roles: string[];
};

/* ============================================
   2. OPTIONAL PROPERTIES - Understanding the Nuances
   ============================================ */

console.log("\n=== 2. OPTIONAL PROPERTIES ===\n");

interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  tags?: string[]; // Optional - can be missing
  publishedAt?: Date; // Optional - can be missing
}

// ✅ Valid - tags and publishedAt can be omitted
const draft: BlogPost = {
  id: 1,
  title: "TypeScript Guide",
  content: "...",
  author: "Alice",
};

// ✅ Valid - tags and publishedAt can be present
const published: BlogPost = {
  id: 2,
  title: "Advanced TypeScript",
  content: "...",
  author: "Bob",
  tags: ["typescript", "programming"],
  publishedAt: new Date(),
};

console.log("Draft:", draft);
console.log("Published:", published);

// OPTIONAL vs UNDEFINED difference
interface Config {
  host: string;
  port?: number; // Can be missing OR number
  timeout: number | undefined; // MUST be present, can be undefined
}

// ✅ port can be omitted
const config1: Config = {
  host: "localhost",
  timeout: undefined, // Required even if undefined
};

// ✅ port can be provided
const config2: Config = {
  host: "example.com",
  port: 443,
  timeout: 5000,
};

// ❌ Cannot omit timeout
// const config3: Config = {
//   host: "localhost"
// }; // Error: Property 'timeout' is missing

console.log("Config1:", config1);
console.log("Config2:", config2);

// Working with optional properties
function displayPost(post: BlogPost) {
  console.log(`\nTitle: ${post.title}`);
  console.log(`By: ${post.author}`);

  // ❌ Unsafe - tags might be undefined
  // console.log(`Tags: ${post.tags.join(', ')}`);

  // ✅ Check before using
  if (post.tags) {
    console.log(`Tags: ${post.tags.join(", ")}`);
  }

  // ✅ Optional chaining
  console.log(`Tags: ${post.tags?.join(", ") ?? "No tags"}`);

  // ✅ Nullish coalescing for default
  const tagList = post.tags ?? ["untagged"];
  console.log(`Tag list: ${tagList.join(", ")}`);
}

displayPost(draft);
displayPost(published);

// Default values pattern
interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  timeout?: number;
  retries?: number;
  cache?: boolean;
}

function fetchData(url: string, options: FetchOptions = {}) {
  const method = options.method ?? "GET";
  const timeout = options.timeout ?? 3000;
  const retries = options.retries ?? 3;
  const cache = options.cache ?? true;

  console.log("\nFetching:", {
    url,
    method,
    timeout,
    retries,
    cache,
  });
}

fetchData("https://api.example.com/users");
fetchData("https://api.example.com/posts", { method: "POST", timeout: 5000 });

/* ============================================
   3. READONLY PROPERTIES - Immutability
   ============================================ */

console.log("\n=== 3. READONLY PROPERTIES ===\n");

// Basic readonly
interface Point {
  readonly x: number;
  readonly y: number;
}

const point: Point = { x: 10, y: 20 };
console.log("Point:", point);

// point.x = 30; // ❌ Error: Cannot assign to 'x' because it is read-only
// point.y = 40; // ❌ Error: Cannot assign to 'y' because it is read-only

// Readonly with objects (SHALLOW!)
interface Account {
  readonly id: string;
  name: string;
  readonly createdAt: Date;
  settings: {
    theme: string;
    notifications: boolean;
  };
}

const account: Account = {
  id: "acc_123",
  name: "John Doe",
  createdAt: new Date(),
  settings: {
    theme: "dark",
    notifications: true,
  },
};

// ✅ Can modify non-readonly properties
account.name = "Jane Doe";

// ❌ Cannot reassign readonly properties
// account.id = "acc_456"; // Error: Cannot assign to readonly
// account.createdAt = new Date(); // Error: Cannot assign to readonly

// ⚠️ BUT can mutate nested objects (readonly is shallow!)
account.settings.theme = "light"; // ✅ Allowed!
account.createdAt.setFullYear(2020); // ✅ Allowed (mutation, not reassignment)

console.log("Account:", account);

// Deep readonly utility
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    endpoints: {
      users: string;
      posts: string;
    };
  };
  features: string[];
}

const config: DeepReadonly<AppConfig> = {
  api: {
    baseUrl: "https://api.example.com",
    timeout: 5000,
    endpoints: {
      users: "/users",
      posts: "/posts",
    },
  },
  features: ["auth", "analytics"],
};

// ❌ All nested properties are readonly
// config.api.timeout = 10000; // Error: readonly
// config.api.endpoints.users = "/v2/users"; // Error: readonly
// config.features.push("cache"); // Error: readonly array

console.log("Deep readonly config:", config);

// Readonly arrays
interface Team {
  name: string;
  readonly members: readonly string[];
}

const team: Team = {
  name: "Engineering",
  members: ["Alice", "Bob", "Charlie"],
};

// ❌ Cannot mutate readonly array
// team.members.push("David"); // Error: Property 'push' does not exist
// team.members[0] = "Alicia"; // Error: Index signature is readonly

// ✅ Can reassign the team name
team.name = "Frontend Engineering";

console.log("Team:", team);

// Practical use: React props pattern
interface ButtonProps {
  readonly label: string;
  readonly onClick: () => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

function createButton(props: ButtonProps) {
  // props.label = "Modified"; // ❌ Error: Cannot modify props
  console.log("Button created:", props.label);
}

createButton({
  label: "Submit",
  onClick: () => console.log("Clicked!"),
});

/* ============================================
   4. INDEX SIGNATURES - Dynamic Properties
   ============================================ */

console.log("\n=== 4. INDEX SIGNATURES ===\n");

// Basic string index signature
interface StringDictionary {
  [key: string]: string;
}

const translations: StringDictionary = {
  hello: "Hola",
  goodbye: "Adiós",
  thanks: "Gracias",
};

// ✅ Can add any string key
translations["welcome"] = "Bienvenido";
translations["yes"] = "Sí";

// ❌ Value must be string
// translations["count"] = 42; // Error: number not assignable to string

console.log("Translations:", translations);

// Number index signature
interface NumberDictionary {
  [index: number]: string;
}

const daysOfWeek: NumberDictionary = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

console.log("Day 3:", daysOfWeek[3]);

// Combining with known properties
interface Configuration {
  version: string; // Known property
  environment: "dev" | "staging" | "prod"; // Known property
  [key: string]: string | number | boolean; // Must include known property types!
}

const appConfig: Configuration = {
  version: "1.0.0",
  environment: "prod",
  port: 3000,
  ssl: true,
  logLevel: "info",
};

console.log("App config:", appConfig);

// Common pitfall: Conflicting types
// interface BadConfig {
//   port: number; // This is number
//   [key: string]: string; // ❌ Error: number not assignable to string
// }

// ✅ Fix: Include all types in index signature
interface GoodConfig {
  port: number;
  host: string;
  [key: string]: string | number;
}

// Practical: HTTP Headers
interface Headers {
  [header: string]: string;
}

const requestHeaders: Headers = {
  "Content-Type": "application/json",
  Authorization: "Bearer token123",
  "User-Agent": "MyApp/1.0",
};

console.log("Headers:", requestHeaders);

// Practical: Cache system
interface Cache<T> {
  [key: string]: T;
}

interface CachedUser {
  id: number;
  name: string;
  lastAccessed: Date;
}

const userCache: Cache<CachedUser> = {
  user_1: { id: 1, name: "Alice", lastAccessed: new Date() },
  user_2: { id: 2, name: "Bob", lastAccessed: new Date() },
};

console.log("User cache:", userCache);

// Better alternatives to index signatures
// 1. Record utility type
type ColorPalette = Record<string, string>;

const colors: ColorPalette = {
  primary: "#007bff",
  secondary: "#6c757d",
  success: "#28a745",
  danger: "#dc3545",
};

// 2. Map for runtime dynamic keys
const runtimeCache = new Map<string, CachedUser>();
runtimeCache.set("user_3", {
  id: 3,
  name: "Charlie",
  lastAccessed: new Date(),
});

// 3. Union of specific keys
type MetricType = "cpu" | "memory" | "disk" | "network";
type Metrics = Record<MetricType, number>;

const systemMetrics: Metrics = {
  cpu: 45,
  memory: 78,
  disk: 62,
  network: 23,
};

console.log("System metrics:", systemMetrics);

/* ============================================
   5. EXTENDING INTERFACES - Inheritance
   ============================================ */

console.log("\n=== 5. EXTENDING INTERFACES ===\n");

// Single inheritance
interface Animal {
  name: string;
  age: number;
  makeSound(): void;
}

interface Dog extends Animal {
  breed: string;
  wagTail(): void;
}

const myDog: Dog = {
  name: "Buddy",
  age: 3,
  breed: "Golden Retriever",
  makeSound() {
    console.log("Woof!");
  },
  wagTail() {
    console.log("Tail wagging!");
  },
};

console.log("My dog:", myDog.name, myDog.breed);
myDog.makeSound();
myDog.wagTail();

// Multiple inheritance
interface Printable {
  print(): void;
}

interface Saveable {
  save(): void;
}

interface Loggable {
  log(): void;
}

interface Document extends Printable, Saveable, Loggable {
  title: string;
  content: string;
  author: string;
}

const report: Document = {
  title: "Q4 Report",
  content: "Sales increased by 25%",
  author: "Finance Team",
  print() {
    console.log(`Printing: ${this.title}`);
  },
  save() {
    console.log(`Saving: ${this.title}`);
  },
  log() {
    console.log(`[LOG] ${this.title} by ${this.author}`);
  },
};

report.print();
report.save();
report.log();

// Narrowing types in extension
interface Vehicle {
  wheels: number;
  engine: string;
}

interface Car extends Vehicle {
  wheels: 4; // Narrows number to literal 4
  doors: number;
}

const myCar: Car = {
  wheels: 4, // Must be exactly 4
  engine: "V6",
  doors: 4,
};

console.log("My car:", myCar);

// Building a type hierarchy
interface Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface User extends Entity {
  email: string;
  username: string;
}

interface Post extends Entity {
  title: string;
  content: string;
  authorId: string;
}

interface Comment extends Entity {
  text: string;
  postId: string;
  userId: string;
}

const blogPost: Post = {
  id: "post_123",
  createdAt: new Date(),
  updatedAt: new Date(),
  title: "TypeScript Tips",
  content: "Here are some useful tips...",
  authorId: "user_456",
};

console.log("Blog post:", blogPost);

/* ============================================
   6. EXCESS PROPERTY CHECKING - TypeScript Magic
   ============================================ */

console.log("\n=== 6. EXCESS PROPERTY CHECKING ===\n");

interface Person {
  name: string;
  age: number;
}

// ❌ Fresh object literal - excess property error
// const person1: Person = {
//   name: "Alice",
//   age: 30,
//   email: "alice@example.com" // Error: 'email' does not exist
// };

// ✅ Assign to variable first - no error (structural typing)
const personData = {
  name: "Alice",
  age: 30,
  email: "alice@example.com",
};
const person2: Person = personData; // ✅ Only checks name and age exist

console.log("Person:", person2);

// Why this matters: Catches typos
interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  timeout?: number;
  headers?: Record<string, string>;
}

function makeRequest(url: string, options: RequestOptions) {
  console.log(`Making ${options.method ?? "GET"} request to ${url}`);
}

// ❌ Catches typo in fresh object
// makeRequest("https://api.example.com", {
//   method: "GET",
//   timout: 5000 // Error: Did you mean 'timeout'?
// });

// ⚠️ Doesn't catch typo in variable
const opts = {
  method: "GET" as const,
  timout: 5000, // Typo, but no error!
};
makeRequest("https://api.example.com", opts); // Compiles, but bug exists

// Workarounds when you need extra properties

// 1. Index signature
interface FlexibleConfig {
  host: string;
  port: number;
  [key: string]: unknown; // Allow any extra properties
}

const flexConfig: FlexibleConfig = {
  host: "localhost",
  port: 3000,
  ssl: true,
  logLevel: "debug",
};

// 2. Type assertion (not recommended)
const person3: Person = {
  name: "Bob",
  age: 25,
  email: "bob@example.com",
} as Person; // Bypasses checking

// 3. Intersection type (better)
type PersonWithEmail = Person & { email: string };

const person4: PersonWithEmail = {
  name: "Charlie",
  age: 28,
  email: "charlie@example.com",
};

console.log("Person with email:", person4);

/* ============================================
   7. DECLARATION MERGING - Interface Power
   ============================================ */

console.log("\n=== 7. DECLARATION MERGING ===\n");

// Basic merging
interface Box {
  width: number;
  height: number;
}

interface Box {
  depth: number;
}

// Merged result: { width, height, depth }
const box: Box = {
  width: 10,
  height: 20,
  depth: 5,
};

console.log("Box:", box);

// Augmenting modules (simulated)
// In real code, this would be in a .d.ts file
interface String {
  customMethod(): string;
}

String.prototype.customMethod = function () {
  return `Custom: ${this}`;
};

// Now all strings have this method (in theory)
// const str = "hello".customMethod(); // Would work after proper declaration

// Practical: Extending third-party libraries
// Example: Extending Express Request (if we had Express)
/*
import "express";

declare module "express" {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: string;
    };
  }
}

// Now req.user is typed everywhere in Express
*/

// Global augmentation pattern
declare global {
  interface Window {
    myApp: {
      version: string;
      config: Record<string, unknown>;
    };
  }
}

// Now window.myApp is typed (in browser environment)
// window.myApp = {
//   version: "1.0.0",
//   config: {}
// };

// Merging namespaces and interfaces
namespace App {
  export interface Config {
    apiUrl: string;
  }
}

namespace App {
  export interface Config {
    timeout: number;
  }
}

const appConfiguration: App.Config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
};

console.log("App configuration:", appConfiguration);

/* ============================================
   8. PRACTICAL REAL-WORLD PATTERNS
   ============================================ */

console.log("\n=== 8. PRACTICAL PATTERNS ===\n");

// Pattern 1: API Response Types
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta: {
    timestamp: Date;
    requestId: string;
  };
}

interface UserData {
  id: number;
  name: string;
  email: string;
}

const successResponse: APIResponse<UserData> = {
  success: true,
  data: { id: 1, name: "Alice", email: "alice@example.com" },
  meta: {
    timestamp: new Date(),
    requestId: "req_123",
  },
};

const errorResponse: APIResponse<UserData> = {
  success: false,
  error: "User not found",
  meta: {
    timestamp: new Date(),
    requestId: "req_124",
  },
};

function handleResponse<T>(response: APIResponse<T>) {
  if (response.success && response.data) {
    console.log("Success:", response.data);
  } else {
    console.log("Error:", response.error);
  }
}

handleResponse(successResponse);
handleResponse(errorResponse);

// Pattern 2: Form State Management
interface FormField<T> {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

interface LoginForm {
  email: FormField<string>;
  password: FormField<string>;
  rememberMe: FormField<boolean>;
}

const loginForm: LoginForm = {
  email: {
    value: "",
    touched: false,
    dirty: false,
  },
  password: {
    value: "",
    touched: false,
    dirty: false,
  },
  rememberMe: {
    value: false,
    touched: false,
    dirty: false,
  },
};

function validateForm(form: LoginForm) {
  if (!form.email.value) {
    form.email.error = "Email is required";
  }
  if (!form.password.value) {
    form.password.error = "Password is required";
  }
}

console.log("Login form:", loginForm);

// Pattern 3: Database Models
interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

interface SoftDelete {
  deletedAt?: Date;
}

interface BaseModel extends Timestamps {
  id: string;
}

interface UserModel extends BaseModel, SoftDelete {
  email: string;
  username: string;
  passwordHash: string;
  role: "admin" | "user" | "moderator";
}

interface PostModel extends BaseModel, SoftDelete {
  title: string;
  content: string;
  authorId: string;
  published: boolean;
  tags: readonly string[];
}

const userRecord: UserModel = {
  id: "user_789",
  email: "admin@example.com",
  username: "admin",
  passwordHash: "hashed_password",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
};

console.log("User record:", userRecord);

// Pattern 4: Event System
interface BaseEvent {
  type: string;
  timestamp: Date;
}

interface UserLoggedIn extends BaseEvent {
  type: "USER_LOGGED_IN";
  userId: string;
  ipAddress: string;
}

interface OrderPlaced extends BaseEvent {
  type: "ORDER_PLACED";
  orderId: string;
  userId: string;
  total: number;
}

interface ErrorOccurred extends BaseEvent {
  type: "ERROR_OCCURRED";
  error: string;
  stack?: string;
}

type AppEvent = UserLoggedIn | OrderPlaced | ErrorOccurred;

function handleEvent(event: AppEvent) {
  switch (event.type) {
    case "USER_LOGGED_IN":
      console.log(`User ${event.userId} logged in from ${event.ipAddress}`);
      break;
    case "ORDER_PLACED":
      console.log(`Order ${event.orderId} placed for $${event.total}`);
      break;
    case "ERROR_OCCURRED":
      console.error(`Error: ${event.error}`);
      break;
    default:
      const _exhaustive: never = event;
      return _exhaustive;
  }
}

handleEvent({
  type: "USER_LOGGED_IN",
  timestamp: new Date(),
  userId: "user_123",
  ipAddress: "192.168.1.1",
});

handleEvent({
  type: "ORDER_PLACED",
  timestamp: new Date(),
  orderId: "order_456",
  userId: "user_123",
  total: 99.99,
});

/* ============================================
   INTERVIEW CODING CHALLENGES
   ============================================ */

console.log("\n=== INTERVIEW CHALLENGES ===\n");

// Challenge 1: Create a type-safe key-value store
interface Store<T> {
  [key: string]: T;
}

class TypedStore<T> {
  private store: Store<T> = {};

  set(key: string, value: T): void {
    this.store[key] = value;
  }

  get(key: string): T | undefined {
    return this.store[key];
  }

  has(key: string): boolean {
    return key in this.store;
  }

  delete(key: string): boolean {
    if (this.has(key)) {
      delete this.store[key];
      return true;
    }
    return false;
  }

  keys(): string[] {
    return Object.keys(this.store);
  }
}

const numberStore = new TypedStore<number>();
numberStore.set("age", 25);
numberStore.set("score", 100);
console.log("Age:", numberStore.get("age"));
console.log("Keys:", numberStore.keys());

// Challenge 2: Implement Partial and Required utilities
type MyPartial<T> = {
  [P in keyof T]?: T[P];
};

type MyRequired<T> = {
  [P in keyof T]-?: T[P]; // Remove optional modifier
};

interface Task {
  id: number;
  title: string;
  completed?: boolean;
  dueDate?: Date;
}

const partialTask: MyPartial<Task> = {
  title: "Learn TypeScript",
};

const requiredTask: MyRequired<Task> = {
  id: 1,
  title: "Learn TypeScript",
  completed: false,
  dueDate: new Date(),
};

console.log("Partial task:", partialTask);
console.log("Required task:", requiredTask);

// Challenge 3: Create a deep merge type
type DeepMerge<T, U> = {
  [K in keyof T | keyof U]: K extends keyof T
    ? K extends keyof U
      ? T[K] extends object
        ? U[K] extends object
          ? DeepMerge<T[K], U[K]>
          : U[K]
        : U[K]
      : T[K]
    : K extends keyof U
    ? U[K]
    : never;
};

type Config1 = {
  server: {
    host: string;
    port: number;
  };
};

type Config2 = {
  server: {
    ssl: boolean;
  };
  database: {
    url: string;
  };
};

type MergedConfig = DeepMerge<Config1, Config2>;
// Result: {
//   server: { host: string; port: number; ssl: boolean; };
//   database: { url: string; };
// }

console.log("\n=== All examples completed successfully! ===");

/* ============================================
   QUICK REFERENCE CHEAT SHEET
   ============================================ */

/*
KEY TAKEAWAYS:

1. Interface vs Type
   ✅ Interface: Object shapes, extensible, declaration merging
   ✅ Type: Unions, intersections, mapped types, conditionals

2. Optional Properties
   ✅ `prop?:` can be missing entirely
   ✅ `prop: T | undefined` must be present but can be undefined

3. Readonly
   ✅ Prevents reassignment, not mutation
   ✅ Shallow by default, use DeepReadonly for nested

4. Index Signatures
   ✅ Dynamic property names: `[key: string]: Type`
   ✅ All properties must match signature
   ✅ Consider Record<K, T> or Map instead

5. Extending Interfaces
   ✅ Single: `interface B extends A`
   ✅ Multiple: `interface C extends A, B`
   ✅ Can narrow types in extension

6. Excess Property Checking
   ✅ Fresh object literals checked strictly
   ✅ Variables use structural typing
   ✅ Helps catch typos

7. Declaration Merging
   ✅ Only interfaces, not types
   ✅ Useful for augmenting third-party types
   ✅ Can extend global types

COMMON PATTERNS:
- API response wrappers
- Form state management
- Database models with timestamps
- Event systems with discriminated unions
- Type-safe configuration objects
*/
