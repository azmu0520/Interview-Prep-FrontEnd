// Index Access Types - Practical Examples
// Run with: npx ts-node index-access-types.ts
// Or in TypeScript Playground: https://www.typescriptlang.org/play

/* ============================================
   1. BASIC INDEX ACCESS SYNTAX
   ============================================ */

console.log("=== 1. BASIC INDEX ACCESS SYNTAX ===\n");

// Basic property access
interface User {
  name: string;
  age: number;
  email: string;
  isActive: boolean;
}

type UserName = User["name"]; // string
type UserAge = User["age"]; // number
type UserEmail = User["email"]; // string

const name: UserName = "Alice";
const age: UserAge = 30;

console.log("Name:", name);
console.log("Age:", age);

// Multiple property access (union)
type NameOrAge = User["name" | "age"]; // string | number
type AllStringProps = User["name" | "email"]; // string

const value1: NameOrAge = "Bob";
const value2: NameOrAge = 25;

console.log("Values:", value1, value2);

// Access all properties
type UserValue = User["name" | "age" | "email" | "isActive"];
// string | number | boolean

// Generic property accessor
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = {
  name: "Charlie",
  age: 35,
  email: "charlie@example.com",
  isActive: true,
};

const userName = getProperty(user, "name"); // Type: string
const userAge = getProperty(user, "age"); // Type: number

console.log("User name:", userName);
console.log("User age:", userAge);

/* ============================================
   2. USING keyof WITH INDEX ACCESS
   ============================================ */

console.log("\n=== 2. keyof WITH INDEX ACCESS ===\n");

// Get all keys
type UserKeys = keyof User; // "name" | "age" | "email" | "isActive"

// Get union of all value types
type UserValues = User[keyof User]; // string | number | boolean

console.log("All value types extracted");

// Practical example: type-safe pick
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    result[key] = obj[key];
  }
  return result;
}

const userSubset = pick(user, ["name", "email"]);
console.log("User subset:", userSubset);

// Filter by type using index access
type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

type UserStringKeys = StringKeys<User>; // "name" | "email"

console.log("String keys identified: name, email");

// Get all function properties
interface API {
  baseUrl: string;
  timeout: number;
  get: () => void;
  post: () => void;
  delete: () => void;
}

type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type APIFunctions = FunctionKeys<API>; // "get" | "post" | "delete"

console.log("Function keys identified: get, post, delete");

/* ============================================
   3. ARRAY ELEMENT TYPES
   ============================================ */

console.log("\n=== 3. ARRAY ELEMENT TYPES ===\n");

// Basic array element access
type StringArray = string[];
type ArrayElement = StringArray[number]; // string

const element: ArrayElement = "hello";
console.log("Array element:", element);

// Array with specific values
type Numbers = number[];
type NumberElement = Numbers[number]; // number

// Const array to union
const COLORS = ["red", "green", "blue"] as const;
type ColorsArray = typeof COLORS; // readonly ["red", "green", "blue"]
type Color = (typeof COLORS)[number]; // "red" | "green" | "blue"

const color: Color = "red";
console.log("Color:", color);

// Tuple element access
type Tuple = [string, number, boolean];
type TupleElement = Tuple[number]; // string | number | boolean
type FirstElement = Tuple[0]; // string
type SecondElement = Tuple[1]; // number
type ThirdElement = Tuple[2]; // boolean

const first: FirstElement = "hello";
const second: SecondElement = 42;
const third: ThirdElement = true;

console.log("Tuple elements:", first, second, third);

// Practical: enum from array
const ROLES = ["admin", "user", "moderator", "guest"] as const;
type Role = (typeof ROLES)[number]; // "admin" | "user" | "moderator" | "guest"

function hasRole(role: Role): boolean {
  return ROLES.includes(role);
}

console.log("Has admin role?", hasRole("admin"));

// Extract element type utility
type ElementType<T extends readonly any[]> = T[number];

type Status = ElementType<typeof ROLES>; // "admin" | "user" | "moderator" | "guest"

console.log("Element type extracted from roles");

/* ============================================
   4. NESTED PROPERTY ACCESS
   ============================================ */

console.log("\n=== 4. NESTED PROPERTY ACCESS ===\n");

// Nested interface
interface Company {
  name: string;
  address: {
    street: string;
    city: string;
    country: {
      name: string;
      code: string;
    };
  };
  employees: {
    count: number;
    departments: string[];
  };
}

// Basic nested access
type AddressType = Company["address"];
// { street: string; city: string; country: { name: string; code: string } }

type CityType = Company["address"]["city"]; // string
type CountryType = Company["address"]["country"];
// { name: string; code: string }

type CountryName = Company["address"]["country"]["name"]; // string

console.log("Nested types accessed");

// Generic nested accessor
function getNestedProperty<T, K1 extends keyof T, K2 extends keyof T[K1]>(
  obj: T,
  key1: K1,
  key2: K2
): T[K1][K2] {
  return obj[key1][key2];
}

const company: Company = {
  name: "TechCorp",
  address: {
    street: "123 Main St",
    city: "San Francisco",
    country: {
      name: "USA",
      code: "US",
    },
  },
  employees: {
    count: 100,
    departments: ["Engineering", "Sales"],
  },
};

const city = getNestedProperty(company, "address", "city");
console.log("City:", city);

// Deep property path with string
type DeepValue<T, Path extends string> = Path extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? DeepValue<T[K], Rest>
    : never
  : Path extends keyof T
  ? T[Path]
  : never;

type CityFromPath = DeepValue<Company, "address.city">; // string
type CountryCodeFromPath = DeepValue<Company, "address.country.code">; // string

console.log("Deep value types extracted via path");

/* ============================================
   5. CONDITIONAL TYPES WITH INDEX ACCESS
   ============================================ */

console.log("\n=== 5. CONDITIONAL TYPES WITH INDEX ACCESS ===\n");

// Filter properties by type
type PickByType<T, ValueType> = {
  [K in keyof T as T[K] extends ValueType ? K : never]: T[K];
};

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  inStock: boolean;
}

type StringProps = PickByType<Product, string>;
// { name: string; description: string }

type NumberProps = PickByType<Product, number>;
// { id: number; price: number }

const stringProp: StringProps = {
  name: "Laptop",
  description: "High-performance laptop",
};

console.log("String properties:", stringProp);

// Get optional properties
type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

interface Config {
  host: string;
  port?: number;
  ssl?: boolean;
  timeout?: number;
}

type ConfigOptional = OptionalKeys<Config>; // "port" | "ssl" | "timeout"

console.log("Optional keys identified: port, ssl, timeout");

// Get required properties
type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

type ConfigRequired = RequiredKeys<Config>; // "host"

console.log("Required keys identified: host");

// Extract function types
type FunctionProps<T> = {
  [K in keyof T]: T[K] extends Function ? T[K] : never;
}[keyof T];

interface Methods {
  getName: () => string;
  getAge: () => number;
  value: string;
}

type MethodTypes = FunctionProps<Methods>;
// (() => string) | (() => number)

console.log("Function types extracted");

/* ============================================
   6. INDEX SIGNATURES AND ACCESS
   ============================================ */

console.log("\n=== 6. INDEX SIGNATURES AND ACCESS ===\n");

// Basic index signature
interface Dictionary {
  [key: string]: number;
}

type DictValue = Dictionary[string]; // number

const dict: Dictionary = {
  a: 1,
  b: 2,
  c: 3,
};

console.log("Dictionary:", dict);

// Mixed index signature
interface FlexibleConfig {
  host: string;
  port: number;
  [key: string]: string | number;
}

type KnownHost = FlexibleConfig["host"]; // string
type DynamicValue = FlexibleConfig[string]; // string | number

const flexConfig: FlexibleConfig = {
  host: "localhost",
  port: 3000,
  timeout: 5000,
  region: "us-east",
};

console.log("Flexible config:", flexConfig);

// Array-like interface
interface ArrayLike<T> {
  [index: number]: T;
  length: number;
}

type ArrayElement2<T> = ArrayLike<T>[number]; // T
type LengthType = ArrayLike<any>["length"]; // number

// Generic values extraction
type Values<T> = T[keyof T];

interface StatusMap {
  idle: boolean;
  loading: boolean;
  success: boolean;
}

type StatusValue = Values<StatusMap>; // boolean

console.log("Values type extracted: boolean");

/* ============================================
   7. MAPPED TYPES WITH INDEX ACCESS
   ============================================ */

console.log("\n=== 7. MAPPED TYPES WITH INDEX ACCESS ===\n");

// Make all properties nullable
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type NullableUser = Nullable<User>;

const nullableUser: NullableUser = {
  name: "David",
  age: null,
  email: "david@example.com",
  isActive: true,
};

console.log("Nullable user:", nullableUser);

// Transform to promises
type Promisify<T> = {
  [K in keyof T]: Promise<T[K]>;
};

interface SyncAPI {
  getUser: string;
  getPost: number;
}

type AsyncAPI = Promisify<SyncAPI>;
// { getUser: Promise<string>; getPost: Promise<number> }

// Getters
type Getters<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
};

type UserGetters = Getters<User>;

const userGetters: UserGetters = {
  getName: () => "Eve",
  getAge: () => 28,
  getEmail: () => "eve@example.com",
  getIsActive: () => false,
};

console.log("Name from getter:", userGetters.getName());

// Extract only certain property types
type ExtractByType<T, U> = {
  [K in keyof T]: T[K] extends U ? T[K] : never;
}[keyof T];

interface Mixed {
  name: string;
  age: number;
  email: string;
  count: number;
}

type Strings = ExtractByType<Mixed, string>; // string
type Numbers = ExtractByType<Mixed, number>; // number

console.log("Types extracted by value type");

/* ============================================
   8. ADVANCED PATTERNS
   ============================================ */

console.log("\n=== 8. ADVANCED PATTERNS ===\n");

// Deep readonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

interface NestedConfig {
  server: {
    host: string;
    port: number;
  };
  database: {
    url: string;
    pool: {
      min: number;
      max: number;
    };
  };
}

type ReadonlyConfig = DeepReadonly<NestedConfig>;

const config2: ReadonlyConfig = {
  server: {
    host: "localhost",
    port: 3000,
  },
  database: {
    url: "postgresql://localhost",
    pool: {
      min: 2,
      max: 10,
    },
  },
};

console.log("Deep readonly config:", config2);
// config2.server.port = 8080; // ❌ Error: readonly

// Path-based access
type PropType<T, Path extends string> = Path extends keyof T
  ? T[Path]
  : Path extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? PropType<T[K], R>
    : never
  : never;

type ServerHost = PropType<NestedConfig, "server.host">; // string
type PoolMax = PropType<NestedConfig, "database.pool.max">; // number

console.log("Path-based type access completed");

// Flatten nested object types
type Flatten<T> = {
  [K in keyof T]: T[K] extends object
    ? T[K] extends any[]
      ? T[K]
      : Flatten<T[K]>
    : T[K];
};

// Paths to all string values
type PathsToStringValues<T, Prefix extends string = ""> = {
  [K in keyof T]: T[K] extends string
    ? `${Prefix}${K & string}`
    : T[K] extends object
    ? PathsToStringValues<T[K], `${Prefix}${K & string}.`>
    : never;
}[keyof T];

type StringPaths = PathsToStringValues<NestedConfig>;
// "server.host" | "database.url"

console.log("String value paths identified");

// Type-safe dot notation access
function get<T, P extends string>(obj: T, path: P): PropType<T, P> {
  const keys = path.split(".");
  let result: any = obj;
  for (const key of keys) {
    result = result[key];
  }
  return result;
}

const host = get(config2, "server.host");
const poolMax = get(config2, "database.pool.max");

console.log("Server host:", host);
console.log("Pool max:", poolMax);

// Union of all nested values
type AllValues<T> = T[keyof T] extends infer V
  ? V extends object
    ? V | AllValues<V>
    : V
  : never;

type ConfigValues = AllValues<NestedConfig>;
// All possible value types in the nested structure

console.log("All nested values type created");

// Conditional property extraction
type ExtractProperties<T, Condition> = {
  [K in keyof T as T[K] extends Condition ? K : never]: T[K];
};

interface DataTypes {
  id: number;
  name: string;
  tags: string[];
  metadata: object;
}

type ArrayProps = ExtractProperties<DataTypes, any[]>;
// { tags: string[] }

type ObjectProps = ExtractProperties<DataTypes, object>;
// { tags: string[]; metadata: object } (arrays are objects)

console.log("Properties extracted by condition");

// Pick and transform
type PickAndTransform<T, K extends keyof T, Transform> = {
  [P in K]: Transform;
};

type TransformedUser = PickAndTransform<User, "name" | "email", string | null>;
// { name: string | null; email: string | null }

console.log("\n=== All examples completed successfully! ===");

/* ============================================
   QUICK REFERENCE CHEAT SHEET
   ============================================ */

/*
KEY TAKEAWAYS:

1. Basic Syntax
   ✅ Type[Key] - access property type
   ✅ Type["key1" | "key2"] - union access
   ✅ Works like object property access

2. With keyof
   ✅ Type[keyof Type] - union of all value types
   ✅ Essential for getting all property types
   ✅ Use with generic constraints

3. Array Elements
   ✅ Array[number] - element type
   ✅ Tuple[0] - specific index
   ✅ typeof array[number] - literal union

4. Nested Access
   ✅ Type["a"]["b"]["c"] - chain access
   ✅ Deep property extraction
   ✅ Works with generic types

5. Conditional Access
   ✅ Filter properties by type
   ✅ Extract optional/required keys
   ✅ Get function properties

6. Index Signatures
   ✅ Type[string] - index signature value
   ✅ Type[number] - numeric index
   ✅ Mixed with known properties

7. With Mapped Types
   ✅ Transform property types
   ✅ Create getters/setters
   ✅ Filter and extract

8. Advanced Patterns
   ✅ Deep readonly/partial
   ✅ Path-based access
   ✅ Nested value extraction
   ✅ Type-safe dot notation

COMMON PATTERNS:
- Type[keyof Type] - all values
- Type["prop1" | "prop2"] - multiple props
- Array[number] - array elements
- typeof arr[number] - literal union
- T[K] where K extends keyof T - generic access

INTERVIEW TIPS:
- Explain bracket notation clearly
- Show keyof combination
- Demonstrate nested access
- Combine with conditionals
- Provide type-safe examples
*/
