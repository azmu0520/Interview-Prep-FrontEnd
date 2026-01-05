// Mapped Types - Practical Examples
// Run with: npx ts-node mapped-types.ts
// Or in TypeScript Playground: https://www.typescriptlang.org/play

/* ============================================
   1. BASIC MAPPED TYPE SYNTAX
   ============================================ */

console.log("=== 1. BASIC MAPPED TYPE SYNTAX ===\n");

// Basic mapping - make all properties readonly
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface User {
  name: string;
  age: number;
  email: string;
}

type ReadonlyUser = MyReadonly<User>;

const user: ReadonlyUser = {
  name: "Alice",
  age: 30,
  email: "alice@example.com"
};

console.log("User:", user);
// user.name = "Bob"; // ❌ Error: readonly

// Make all properties optional
type MyPartial<T> = {
  [P in keyof T]?: T[P];
};

type PartialUser = MyPartial<User>;

const partialUser: PartialUser = {
  name: "Bob"
  // age and email are optional
};

console.log("Partial user:", partialUser);

// Make all properties required
type MyRequired<T> = {
  [P in keyof T]-?: T[P];  // -? removes optional
};

interface Config {
  host?: string;
  port?: number;
  ssl?: boolean;
}

type RequiredConfig = MyRequired<Config>;

const config: RequiredConfig = {
  host: "localhost",
  port: 3000,
  ssl: true
  // All properties required!
};

console.log("Required config:", config);

// Make all properties mutable (remove readonly)
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

interface ReadonlyPoint {
  readonly x: number;
  readonly y: number;
}

type MutablePoint = Mutable<ReadonlyPoint>;

const point: MutablePoint = { x: 10, y: 20 };
point.x = 30; // ✅ Now mutable!
console.log("Mutable point:", point);

/* ============================================
   2. MAPPING MODIFIERS (+ and -)
   ============================================ */

console.log("\n=== 2. MAPPING MODIFIERS ===\n");

// Adding modifiers (+ is implicit)
type AddReadonly<T> = {
  +readonly [P in keyof T]: T[P];  // Same as: readonly [P in keyof T]
};

type AddOptional<T> = {
  [P in keyof T]+?: T[P];  // Same as: [P in keyof T]?
};

// Removing modifiers
type RemoveReadonly<T> = {
  -readonly [P in keyof T]: T[P];
};

type RemoveOptional<T> = {
  [P in keyof T]-?: T[P];
};

// Remove both modifiers
type Concrete<T> = {
  -readonly [P in keyof T]-?: T[P];
};

interface FlexibleConfig {
  readonly host?: string;
  readonly port?: number;
}

type ConcreteConfig = Concrete<FlexibleConfig>;
// { host: string; port: number } - both required and mutable

const concreteConfig: ConcreteConfig = {
  host: "example.com",
  port: 443
};

console.log("Concrete config:", concreteConfig);

// Partial + Readonly combination
type PartialReadonly<T> = {
  readonly [P in keyof T]?: T[P];
};

type PartialReadonlyUser = PartialReadonly<User>;

const prUser: PartialReadonlyUser = {
  name: "Charlie"
};

console.log("Partial readonly user:", prUser);
// prUser.name = "David"; // ❌ Error: readonly

/* ============================================
   3. KEY REMAPPING WITH 'as' CLAUSE
   ============================================ */

console.log("\n=== 3. KEY REMAPPING ===\n");

// Add prefix to all keys
type Prefixed<T, Prefix extends string> = {
  [P in keyof T as `${Prefix}${P & string}`]: T[P];
};

interface Product {
  name: string;
  price: number;
}

type PrefixedProduct = Prefixed<Product, "product_">;
// { product_name: string; product_price: number }

const prefixedProduct: PrefixedProduct = {
  product_name: "Laptop",
  product_price: 999
};

console.log("Prefixed product:", prefixedProduct);

// Add suffix
type Suffixed<T, Suffix extends string> = {
  [P in keyof T as `${P & string}${Suffix}`]: T[P];
};

type ProductFields = Suffixed<Product, "_field">;
// { name_field: string; price_field: number }

// Filtering keys - remove specific properties
type OmitId<T> = {
  [P in keyof T as P extends "id" ? never : P]: T[P];
};

interface UserWithId {
  id: number;
  name: string;
  email: string;
}

type UserWithoutId = OmitId<UserWithId>;
// { name: string; email: string }

const userNoId: UserWithoutId = {
  name: "Eve",
  email: "eve@example.com"
};

console.log("User without ID:", userNoId);

// Filter by property type
type FunctionProps<T> = {
  [P in keyof T as T[P] extends Function ? P : never]: T[P];
};

interface API {
  baseUrl: string;
  timeout: number;
  get: () => void;
  post: () => void;
  delete: () => void;
}

type APIFunctions = FunctionProps<API>;
// { get: () => void; post: () => void; delete: () => void }

console.log("API functions extracted");

// Keep only string properties
type StringProps<T> = {
  [P in keyof T as T[P] extends string ? P : never]: T[P];
};

interface Mixed {
  name: string;
  age: number;
  email: string;
  active: boolean;
}

type StringOnly = StringProps<Mixed>;
// { name: string; email: string }

const stringProps: StringOnly = {
  name: "Frank",
  email: "frank@example.com"
};

console.log("String properties:", stringProps);

// Convert keys to uppercase
type UppercaseKeys<T> = {
  [P in keyof T as Uppercase<P & string>]: T[P];
};

type Settings = {
  theme: string;
  language: string;
};

type UpperSettings = UppercaseKeys<Settings>;
// { THEME: string; LANGUAGE: string }

const upperSettings: UpperSettings = {
  THEME: "dark",
  LANGUAGE: "en"
};

console.log("Uppercase settings:", upperSettings);

// Add 'get' prefix (getter pattern)
type Getters<T> = {
  [P in keyof T as `get${Capitalize<P & string>}`]: () => T[P];
};

interface State {
  count: number;
  name: string;
  active: boolean;
}

type StateGetters = Getters<State>;
// {
//   getCount: () => number;
//   getName: () => string;
//   getActive: () => boolean;
// }

const stateGetters: StateGetters = {
  getCount: () => 0,
  getName: () => "initial",
  getActive: () => false
};

console.log("Count:", stateGetters.getCount());
console.log("Name:", stateGetters.getName());

/* ============================================
   4. MAPPING OVER UNION TYPES
   ============================================ */

console.log("\n=== 4. MAPPING OVER UNIONS ===\n");

// Create object from union of keys
type Keys = "name" | "age" | "email";

type ObjectFromKeys<K extends string> = {
  [P in K]: string;
};

type SimpleUser = ObjectFromKeys<Keys>;
// { name: string; age: string; email: string }

const simpleUser: SimpleUser = {
  name: "Grace",
  age: "25",
  email: "grace@example.com"
};

console.log("Simple user:", simpleUser);

// Record utility type
type MyRecord<K extends string | number | symbol, T> = {
  [P in K]: T;
};

type PageInfo = MyRecord<"home" | "about" | "contact", { title: string; description: string }>;

const pages: PageInfo = {
  home: { title: "Home", description: "Welcome" },
  about: { title: "About", description: "About us" },
  contact: { title: "Contact", description: "Get in touch" }
};

console.log("Pages:", pages);

// Event map pattern
type EventMap = {
  click: MouseEvent;
  keypress: KeyboardEvent;
  submit: Event;
};

type EventHandlers = {
  [K in keyof EventMap as `on${Capitalize<K & string>}`]: (event: EventMap[K]) => void;
};

// {
//   onClick: (event: MouseEvent) => void;
//   onKeypress: (event: KeyboardEvent) => void;
//   onSubmit: (event: Event) => void;
// }

console.log("Event handlers mapped");

/* ============================================
   5. BUILT-IN UTILITY TYPES
   ============================================ */

console.log("\n=== 5. BUILT-IN UTILITY TYPES ===\n");

// Partial<T>
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type PartialTodo = Partial<Todo>;

const todoUpdate: PartialTodo = {
  completed: true
  // Other properties optional
};

console.log("Partial todo:", todoUpdate);

// Required<T>
interface OptionalConfig {
  host?: string;
  port?: number;
  ssl?: boolean;
}

type CompleteConfig = Required<OptionalConfig>;

const completeConfig: CompleteConfig = {
  host: "localhost",
  port: 3000,
  ssl: true
  // All required!
};

console.log("Complete config:", completeConfig);

// Readonly<T>
type ReadonlyTodo = Readonly<Todo>;

const readonlyTodo: ReadonlyTodo = {
  title: "Learn TypeScript",
  description: "Master mapped types",
  completed: false
};

console.log("Readonly todo:", readonlyTodo);
// readonlyTodo.completed = true; // ❌ Error

// Pick<T, K>
type TodoPreview = Pick<Todo, "title" | "completed">;

const preview: TodoPreview = {
  title: "Preview",
  completed: false
};

console.log("Todo preview:", preview);

// Omit<T, K>
type TodoInfo = Omit<Todo, "completed">;

const info: TodoInfo = {
  title: "Info",
  description: "Todo info"
};

console.log("Todo info:", info);

// Record<K, T>
type CacheMap = Record<string, { value: any; expiry: number }>;

const cache: CacheMap = {
  user_1: { value: { name: "Alice" }, expiry: Date.now() + 3600000 },
  user_2: { value: { name: "Bob" }, expiry: Date.now() + 3600000 }
};

console.log("Cache:", cache);

/* ============================================
   6. ADVANCED MAPPING PATTERNS
   ============================================ */

console.log("\n=== 6. ADVANCED PATTERNS ===\n");

// Nullable properties
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type NullableUser = Nullable<User>;

const nullableUser: NullableUser = {
  name: "Henry",
  age: null,
  email: "henry@example.com"
};

console.log("Nullable user:", nullableUser);

// Deep partial (recursive)
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface NestedConfig {
  server: {
    host: string;
    port: number;
    ssl: {
      enabled: boolean;
      cert: string;
    };
  };
}

type PartialNestedConfig = DeepPartial<NestedConfig>;

const partialNested: PartialNestedConfig = {
  server: {
    host: "localhost"
    // port and ssl are optional
  }
};

console.log("Deep partial config:", partialNested);

// Deep readonly (recursive)
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? T[P] extends any[]
      ? ReadonlyArray<DeepReadonly<T[P][number]>>
      : DeepReadonly<T[P]>
    : T[P];
};

type DeepReadonlyConfig = DeepReadonly<NestedConfig>;

const deepReadonlyConfig: DeepReadonlyConfig = {
  server: {
    host: "localhost",
    port: 3000,
    ssl: {
      enabled: true,
      cert: "/path/to/cert"
    }
  }
};

console.log("Deep readonly config:", deepReadonlyConfig);
// deepReadonlyConfig.server.ssl.enabled = false; // ❌ Error: readonly

// Promisify - wrap return types in Promise
type Promisify<T> = {
  [P in keyof T]: T[P] extends (...args: infer A) => infer R
    ? (...args: A) => Promise<R>
    : T[P];
};

interface SyncAPI {
  getUser: (id: string) => User;
  getProduct: (id: string) => Product;
  timeout: number;
}

type AsyncAPI = Promisify<SyncAPI>;
// {
//   getUser: (id: string) => Promise<User>;
//   getProduct: (id: string) => Promise<Product>;
//   timeout: number;
// }

console.log("Promisify wraps functions in Promise");

// Proxify - create proxy getters/setters
type Proxify<T> = {
  [P in keyof T]: {
    get: () => T[P];
    set: (value: T[P]) => void;
  };
};

type ProxifiedUser = Proxify<User>;

const proxifiedUser: ProxifiedUser = {
  name: {
    get: () => "Ivy",
    set: (value) => console.log("Setting name:", value)
  },
  age: {
    get: () => 28,
    set: (value) => console.log("Setting age:", value)
  },
  email: {
    get: () => "ivy@example.com",
    set: (value) => console.log("Setting email:", value)
  }
};

console.log("Name:", proxifiedUser.name.get());
proxifiedUser.age.set(29);

/* ============================================
   7. COMBINING WITH CONDITIONAL TYPES
   ============================================ */

console.log("\n=== 7. COMBINING WITH CONDITIONALS ===\n");

// Asyncify - make functions async, keep others
type Asyncify<T> = {
  [P in keyof T]: T[P] extends (...args: infer A) => infer R
    ? (...args: A) => Promise<R>
    : T[P];
};

interface MixedAPI {
  getUser: (id: string) => User;
  baseUrl: string;
  timeout: number;
}

type AsyncMixedAPI = Asyncify<MixedAPI>;
// Functions become async, primitives stay same

console.log("Asyncify transforms only functions");

// Filter by type and transform
type StringToNumber<T> = {
  [P in keyof T]: T[P] extends string ? number : T[P];
};

interface Measurements {
  width: string;
  height: string;
  units: string;
  count: number;
}

type NumericMeasurements = StringToNumber<Measurements>;
// { width: number; height: number; units: number; count: number }

// Wrap primitives in arrays, keep objects
type Arrayify<T> = {
  [P in keyof T]: T[P] extends object ? T[P] : T[P][];
};

interface DataTypes {
  id: number;
  name: string;
  metadata: { created: Date };
}

type ArrayifiedData = Arrayify<DataTypes>;
// { id: number[]; name: string[]; metadata: { created: Date } }

/* ============================================
   8. REAL-WORLD PRACTICAL PATTERNS
   ============================================ */

console.log("\n=== 8. REAL-WORLD PATTERNS ===\n");

// Pattern 1: Form field state
type FormFieldState<T> = {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
};

type FormState<T> = {
  [P in keyof T]: FormFieldState<T[P]>;
};

interface LoginForm {
  email: string;
  password: string;
}

type LoginFormState = FormState<LoginForm>;

const formState: LoginFormState = {
  email: {
    value: "user@example.com",
    touched: true,
    dirty: true
  },
  password: {
    value: "password123",
    error: "Password must be at least 8 characters",
    touched: true,
    dirty: true
  }
};

console.log("Form state:", formState);

// Pattern 2: Validation schema
type Validator<T> = (value: T) => boolean;

type ValidationSchema<T> = {
  [P in keyof T]: {
    required: boolean;
    validator: Validator<T[P]>;
    errorMessage: string;
  };
};

type UserValidation = ValidationSchema<User>;

const userValidation: UserValidation = {
  name: {
    required: true,
    validator: (value) => value.length > 0,
    errorMessage: "Name is required"
  },
  age: {
    required: true,
    validator: (value) => value >= 18,
    errorMessage: "Must be 18 or older"
  },
  email: {
    required: true,
    validator: (value) => value.includes("@"),
    errorMessage: "Invalid email"
  }
};

console.log("User validation schema created");

// Pattern 3: Redux actions
type Actions<T> = {
  [P in keyof T as `set${Capitalize<P & string>}`]: (value: T[P]) => {
    type: `SET_${Uppercase<P & string>}`;
    payload: T[P];
  };
};

interface AppState {
  user: User;
  theme: string;
  loading: boolean;
}

type AppActions = Actions<AppState>;

// {
//   setUser: (value: User) => { type: "SET_USER"; payload: User };
//   setTheme: (value: string) => { type: "SET_THEME"; payload: string };
//   setLoading: (value: boolean) => { type: "SET_LOADING"; payload: boolean };
// }

console.log("Redux actions mapped");

// Pattern 4: API endpoints
type APIEndpoint<T> = {
  get: () => Promise<T>;
  post: (data: Partial<T>) => Promise<T>;
  put: (id: string, data: Partial<T>) => Promise<T>;
  delete: (id: string) => Promise<void>;
};

type APIEndpoints<T> = {
  [P in keyof T as `/${P & string}`]: APIEndpoint<T[P]>;
};

interface Entities {
  users: User;
  products: Product;
}

type API_Endpoints = APIEndpoints<Entities>;

// {
//   "/users": APIEndpoint<User>;
//   "/products": APIEndpoint<Product>;
// }

console.log("API endpoints structured");

// Pattern 5: Event listeners
type EventHandler<T> = (data: T) => void;

type EventListeners<T> = {
  [P in keyof T as `on${Capitalize<P & string>}`]: EventHandler<T[P]>;
};

interface AppEvents {
  login: { userId: string; timestamp: Date };
  logout: void;
  error: { message: string; code: number };
}

type AppEventListeners = EventListeners<AppEvents>;

const eventListeners: AppEventListeners = {
  onLogin: (data) => {
    console.log("User logged in:", data.userId);
  },
  onLogout: () => {
    console.log("User logged out");
  },
  onError: (data) => {
    console.error(`Error ${data.code}: ${data.message}`);
  }
};

eventListeners.onLogin({ userId: "user_789", timestamp: new Date() });
eventListeners.onError({ message: "Network error", code: 500 });

console.log("\n=== All examples completed successfully! ===");

/* ============================================
   QUICK REFERENCE CHEAT SHEET
   ============================================ */

/*
KEY TAKEAWAYS:

1. Basic Syntax
   ✅ [P in keyof T]: T[P] - iterate over keys
   ✅ keyof T - union of all keys
   ✅ T[P] - lookup property type

2. Modifiers
   ✅ +readonly / -readonly
   ✅ +? / -? (optional)
   ✅ Default is + if not specified

3. Key Remapping (as clause)
   ✅ [P in keyof T as NewKey]: T[P]
   ✅ Use never to filter
   ✅ Template literals for transformation
   ✅ Capitalize, Uppercase for case changes

4. Common Patterns
   ✅ Partial - make optional
   ✅ Required - remove optional
   ✅ Readonly - add readonly
   ✅ Pick - select properties
   ✅ Omit - exclude properties
   ✅ Record - create from union

5. Advanced Patterns
   ✅ DeepPartial - recursive optional
   ✅ DeepReadonly - recursive readonly
   ✅ Nullable - add null to all
   ✅ Promisify - wrap in Promise
   ✅ Proxify - add getters/setters

6. With Conditionals
   ✅ Filter by type
   ✅ Transform based on type
   ✅ Asyncify functions only
   ✅ Type-specific transformations

7. Real-World Uses
   ✅ Form state management
   ✅ Validation schemas
   ✅ Redux actions
   ✅ API endpoint typing
   ✅ Event listener typing

INTERVIEW TIPS:
- Explain [P in keyof T] clearly
- Show modifier usage (+ and -)
- Demonstrate key remapping
- Combine with conditionals
- Create practical examples
*/