// Template Literal Types - Practical Examples
// Run with: npx ts-node template-literal-types.ts
// Or in TypeScript Playground: https://www.typescriptlang.org/play

/* ============================================
   1. BASIC TEMPLATE LITERAL SYNTAX
   ============================================ */

console.log("=== 1. BASIC TEMPLATE LITERAL SYNTAX ===\n");

// Basic template literal type
type Greeting = `Hello ${string}`;

const greeting1: Greeting = "Hello World";
const greeting2: Greeting = "Hello TypeScript";
// const greeting3: Greeting = "Hi World"; // ❌ Must start with "Hello "

console.log(greeting1);
console.log(greeting2);

// With specific literal types
type World = "World";
type HelloWorld = `Hello ${World}`; // "Hello World"

const hello: HelloWorld = "Hello World";
console.log(hello);

// With number types
type ID = `id-${number}`;
type Version = `v${number}.${number}.${number}`;

const userId: ID = "id-123";
const version: Version = "v1.2.3";

console.log("User ID:", userId);
console.log("Version:", version);

// With union types
type EventPrefix = "on";
type EventName = "Click" | "Hover" | "Focus";
type Event = `${EventPrefix}${EventName}`;
// "onClick" | "onHover" | "onFocus"

const clickEvent: Event = "onClick";
const hoverEvent: Event = "onHover";

console.log("Events:", clickEvent, hoverEvent);

/* ============================================
   2. DISTRIBUTION OVER UNIONS
   ============================================ */

console.log("\n=== 2. DISTRIBUTION OVER UNIONS ===\n");

// Single union distribution
type Size = "small" | "medium" | "large";
type ButtonSize = `btn-${Size}`;
// "btn-small" | "btn-medium" | "btn-large"

const btnSm: ButtonSize = "btn-small";
const btnMd: ButtonSize = "btn-medium";
const btnLg: ButtonSize = "btn-large";

console.log("Button sizes:", btnSm, btnMd, btnLg);

// Multiple unions (Cartesian product)
type Color = "red" | "blue" | "green";
type SizeShort = "sm" | "md" | "lg";

type ColoredButton = `${Color}-${SizeShort}`;
// 3 × 3 = 9 combinations

const redSm: ColoredButton = "red-sm";
const blueMd: ColoredButton = "blue-md";
const greenLg: ColoredButton = "green-lg";

console.log("Colored buttons:", redSm, blueMd, greenLg);

// Three-way distribution
type Action = "get" | "set";
type Property = "Name" | "Age";
type Timing = "Sync" | "Async";

type Method = `${Action}${Property}${Timing}`;
// 2 × 2 × 2 = 8 combinations

const method1: Method = "getNameSync";
const method2: Method = "setAgeAsync";

console.log("Methods:", method1, method2);

// HTTP method + endpoint
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
type Endpoint = "users" | "posts";

type APIRoute = `${HTTPMethod} /${Endpoint}`;

const route1: APIRoute = "GET /users";
const route2: APIRoute = "POST /posts";

console.log("API routes:", route1, route2);

/* ============================================
   3. INTRINSIC STRING MANIPULATION
   ============================================ */

console.log("\n=== 3. INTRINSIC STRING MANIPULATION ===\n");

// Uppercase
type LoudHello = Uppercase<"hello">; // "HELLO"
type LoudWords = Uppercase<"foo" | "bar">; // "FOO" | "BAR"

const loud: LoudHello = "HELLO";
const loudFoo: LoudWords = "FOO";

console.log("Uppercase:", loud, loudFoo);

// Lowercase
type QuietHello = Lowercase<"HELLO">; // "hello"
type QuietWords = Lowercase<"FOO" | "BAR">; // "foo" | "bar"

const quiet: QuietHello = "hello";
const quietFoo: QuietWords = "foo";

console.log("Lowercase:", quiet, quietFoo);

// Capitalize
type TitleCase = Capitalize<"hello world">; // "Hello world"
type Titles = Capitalize<"foo" | "bar">; // "Foo" | "Bar"

const title: Titles = "Foo";
console.log("Capitalize:", title);

// Uncapitalize
type LowerFirst = Uncapitalize<"Hello">; // "hello"
type LowerFirsts = Uncapitalize<"Foo" | "Bar">; // "foo" | "bar"

const lowerFirst: LowerFirst = "hello";
console.log("Uncapitalize:", lowerFirst);

// Combining transformations
type EventHandler<T extends string> = `on${Capitalize<T>}`;
type DOMEvents = EventHandler<"click" | "hover" | "focus">;
// "onClick" | "onHover" | "onFocus"

const clickHandler: DOMEvents = "onClick";
console.log("Event handler:", clickHandler);

// Redux action type
type ActionType<T extends string> = `SET_${Uppercase<T>}`;
type Actions = ActionType<"user" | "theme" | "language">;
// "SET_USER" | "SET_THEME" | "SET_LANGUAGE"

const setUser: Actions = "SET_USER";
console.log("Action type:", setUser);

/* ============================================
   4. WITH MAPPED TYPES
   ============================================ */

console.log("\n=== 4. WITH MAPPED TYPES ===\n");

// Getters pattern
type Getters<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
};

interface User {
  name: string;
  age: number;
  email: string;
}

type UserGetters = Getters<User>;
// {
//   getName: () => string;
//   getAge: () => number;
//   getEmail: () => string;
// }

const userGetters: UserGetters = {
  getName: () => "Alice",
  getAge: () => 30,
  getEmail: () => "alice@example.com",
};

console.log("User name:", userGetters.getName());
console.log("User age:", userGetters.getAge());

// Setters pattern
type Setters<T> = {
  [K in keyof T as `set${Capitalize<K & string>}`]: (value: T[K]) => void;
};

type UserSetters = Setters<User>;

const userSetters: UserSetters = {
  setName: (value) => console.log("Setting name:", value),
  setAge: (value) => console.log("Setting age:", value),
  setEmail: (value) => console.log("Setting email:", value),
};

userSetters.setName("Bob");
userSetters.setAge(25);

// Event handlers
type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<K & string>}`]: (data: T[K]) => void;
};

interface Events {
  click: { x: number; y: number };
  submit: { formData: FormData };
  keypress: { key: string };
}

type Handlers = EventHandlers<Events>;

const handlers: Handlers = {
  onClick: (data) => console.log("Clicked at:", data.x, data.y),
  onSubmit: (data) => console.log("Submitted:", data.formData),
  onKeypress: (data) => console.log("Key pressed:", data.key),
};

handlers.onClick({ x: 100, y: 200 });
handlers.onKeypress({ key: "Enter" });

// Combined getters and setters
type Properties<T> = Getters<T> & Setters<T>;

type UserProps = Properties<User>;

const userProps: UserProps = {
  getName: () => "Charlie",
  getAge: () => 35,
  getEmail: () => "charlie@example.com",
  setName: (value) => console.log("Name:", value),
  setAge: (value) => console.log("Age:", value),
  setEmail: (value) => console.log("Email:", value),
};

console.log("User:", userProps.getName());
userProps.setAge(36);

/* ============================================
   5. PATTERN MATCHING
   ============================================ */

console.log("\n=== 5. PATTERN MATCHING ===\n");

// Extract prefix
type RemovePrefix<
  S extends string,
  Prefix extends string
> = S extends `${Prefix}${infer Rest}` ? Rest : S;

type WithoutOn = RemovePrefix<"onClick", "on">; // "Click"
type WithoutGet = RemovePrefix<"getName", "get">; // "Name"
type NoPrefix = RemovePrefix<"click", "on">; // "click"

console.log("Prefix removed from 'onClick'");

// Extract suffix
type RemoveSuffix<
  S extends string,
  Suffix extends string
> = S extends `${infer Rest}${Suffix}` ? Rest : S;

type WithoutAsync = RemoveSuffix<"getUserAsync", "Async">; // "getUser"
type WithoutSync = RemoveSuffix<"setNameSync", "Sync">; // "setName"

console.log("Suffix removed from 'getUserAsync'");

// Extract route parameters
type ExtractParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractParams<`/${Rest}`>
    : T extends `${string}:${infer Param}`
    ? Param
    : never;

type RouteParams = ExtractParams<"/users/:userId/posts/:postId">;
// "userId" | "postId"

console.log("Route params extracted: userId, postId");

// Split string
type Split<
  S extends string,
  D extends string
> = S extends `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] : [S];

type Parts = Split<"a-b-c-d", "-">; // ["a", "b", "c", "d"]

console.log("String split into parts");

// Parse version
type ParseVersion<V extends string> =
  V extends `v${infer Major}.${infer Minor}.${infer Patch}`
    ? { major: Major; minor: Minor; patch: Patch }
    : never;

type VersionInfo = ParseVersion<"v1.2.3">;
// { major: "1"; minor: "2"; patch: "3" }

console.log("Version parsed: major.minor.patch");

/* ============================================
   6. REAL-WORLD USE CASES
   ============================================ */

console.log("\n=== 6. REAL-WORLD USE CASES ===\n");

// CSS-in-JS
type CSSUnit = "px" | "em" | "rem" | "%" | "vh" | "vw";
type CSSValue = `${number}${CSSUnit}` | "auto" | "inherit";

interface Styles {
  width: CSSValue;
  height: CSSValue;
  margin: CSSValue;
  padding: CSSValue;
}

const styles: Styles = {
  width: "100px",
  height: "50%",
  margin: "1rem",
  padding: "auto",
};

console.log("CSS styles:", styles);

// Route parameters
type Route =
  | "/home"
  | "/users/:userId"
  | "/users/:userId/posts/:postId"
  | "/settings/:section";

type RouteWithParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? { [K in Param]: string } & RouteWithParams<Rest>
    : T extends `${string}:${infer Param}`
    ? { [K in Param]: string }
    : {};

type UserPostParams = RouteWithParams<"/users/:userId/posts/:postId">;
// { userId: string; postId: string }

const params: UserPostParams = {
  userId: "user_123",
  postId: "post_456",
};

console.log("Route params:", params);

// SQL query types
type Table = "users" | "posts" | "comments";
type SQLAction = "SELECT" | "INSERT" | "UPDATE" | "DELETE";

type SQLQuery = `${SQLAction} FROM ${Table}`;

const query1: SQLQuery = "SELECT FROM users";
const query2: SQLQuery = "DELETE FROM comments";

console.log("SQL queries:", query1, query2);

// API versioning
type APIVersion = "v1" | "v2" | "v3";
type Resource = "users" | "posts" | "comments";

type VersionedEndpoint = `/${APIVersion}/${Resource}`;

const endpoint1: VersionedEndpoint = "/v1/users";
const endpoint2: VersionedEndpoint = "/v2/posts";

console.log("Versioned endpoints:", endpoint1, endpoint2);

// Redux action creators
type StateKeys = "user" | "theme" | "language";

type ActionCreators = {
  [K in StateKeys as `set${Capitalize<K>}`]: (payload: any) => {
    type: `SET_${Uppercase<K>}`;
    payload: any;
  };
};

const actionCreators: ActionCreators = {
  setUser: (payload) => ({ type: "SET_USER", payload }),
  setTheme: (payload) => ({ type: "SET_THEME", payload }),
  setLanguage: (payload) => ({ type: "SET_LANGUAGE", payload }),
};

const action = actionCreators.setTheme("dark");
console.log("Action:", action);

/* ============================================
   7. ADVANCED PATTERNS
   ============================================ */

console.log("\n=== 7. ADVANCED PATTERNS ===\n");

// Join array of strings
type Join<T extends string[], D extends string> = T extends [
  infer F extends string,
  ...infer R extends string[]
]
  ? R extends []
    ? F
    : `${F}${D}${Join<R, D>}`
  : "";

type Path = Join<["users", "123", "posts"], "/">;
// "users/123/posts"

console.log("Path joined: users/123/posts");

// Object path type
type PathImpl<T, Key extends keyof T> = Key extends string
  ? T[Key] extends Record<string, any>
    ? `${Key}.${PathImpl<T[Key], keyof T[Key]> & string}` | `${Key}`
    : `${Key}`
  : never;

type ObjectPath<T> = PathImpl<T, keyof T>;

interface NestedUser {
  profile: {
    name: string;
    address: {
      city: string;
      country: string;
    };
  };
  settings: {
    theme: string;
  };
}

type UserPath = ObjectPath<NestedUser>;
// "profile" | "profile.name" | "profile.address" |
// "profile.address.city" | "profile.address.country" |
// "settings" | "settings.theme"

console.log("Object paths generated");

// BEM CSS classes
type Block = "button" | "input" | "card";
type Element = "icon" | "label" | "body";
type Modifier = "primary" | "disabled" | "large";

type BEMClass =
  | `${Block}`
  | `${Block}__${Element}`
  | `${Block}--${Modifier}`
  | `${Block}__${Element}--${Modifier}`;

const bemClass1: BEMClass = "button";
const bemClass2: BEMClass = "button__icon";
const bemClass3: BEMClass = "button--primary";
const bemClass4: BEMClass = "button__icon--large";

console.log("BEM classes:", bemClass1, bemClass2, bemClass3, bemClass4);

// Type-safe translation keys
type Translations = {
  common: {
    save: string;
    cancel: string;
    delete: string;
  };
  errors: {
    required: string;
    invalid: string;
  };
};

type TranslationKey = ObjectPath<Translations>;

function t(key: TranslationKey): string {
  // Lookup translation
  return `Translation for: ${key}`;
}

console.log(t("common.save"));
console.log(t("errors.required"));
// console.log(t("invalid.key")); // ❌ Type error!

/* ============================================
   8. PRACTICAL UTILITY TYPES
   ============================================ */

console.log("\n=== 8. PRACTICAL UTILITY TYPES ===\n");

// Kebab-case converter
type KebabCase<S extends string> = S extends `${infer C}${infer T}`
  ? C extends Lowercase<C>
    ? `${C}${KebabCase<T>}`
    : `-${Lowercase<C>}${KebabCase<T>}`
  : S;

type Kebab = KebabCase<"userName">; // "user-name"
type Kebab2 = KebabCase<"userId">; // "user-id"

console.log("Kebab case conversion simulated");

// Snake case converter
type SnakeCase<S extends string> = S extends `${infer C}${infer T}`
  ? C extends Lowercase<C>
    ? `${C}${SnakeCase<T>}`
    : `_${Lowercase<C>}${SnakeCase<T>}`
  : S;

type Snake = SnakeCase<"userName">; // "_user_name"

console.log("Snake case conversion simulated");

// Add prefix to all keys
type PrefixKeys<T, Prefix extends string> = {
  [K in keyof T as K extends string ? `${Prefix}${K}` : K]: T[K];
};

type PrefixedUser = PrefixKeys<User, "user_">;
// { user_name: string; user_age: number; user_email: string }

console.log("Prefix added to all keys");

// Add suffix to all keys
type SuffixKeys<T, Suffix extends string> = {
  [K in keyof T as K extends string ? `${K}${Suffix}` : K]: T[K];
};

type SuffixedUser = SuffixKeys<User, "_field">;
// { name_field: string; age_field: number; email_field: string }

console.log("Suffix added to all keys");

// Ensure prefix exists
type EnsurePrefix<
  S extends string,
  Prefix extends string
> = S extends `${Prefix}${string}` ? S : `${Prefix}${S}`;

type WithOn = EnsurePrefix<"Click", "on">; // "onClick"
type AlreadyHasOn = EnsurePrefix<"onClick", "on">; // "onClick"

console.log("Prefix ensured");

console.log("\n=== All examples completed successfully! ===");

/* ============================================
   QUICK REFERENCE CHEAT SHEET
   ============================================ */

/*
KEY TAKEAWAYS:

1. Basic Syntax
   ✅ `string ${Type} string`
   ✅ Interpolate types into strings
   ✅ Type must be literal type

2. Distribution
   ✅ Automatically distributes over unions
   ✅ Creates Cartesian product
   ✅ Multiple unions multiply combinations

3. String Manipulation
   ✅ Uppercase<T> - "HELLO"
   ✅ Lowercase<T> - "hello"
   ✅ Capitalize<T> - "Hello"
   ✅ Uncapitalize<T> - "hello"

4. With Mapped Types
   ✅ [K in keyof T as `pattern${K & string}`]
   ✅ Transform all keys systematically
   ✅ Create getters, setters, handlers

5. Pattern Matching
   ✅ Use with conditional types
   ✅ Extract with infer
   ✅ Parse strings at type level

6. Real-World Uses
   ✅ CSS-in-JS type safety
   ✅ Route parameter extraction
   ✅ Redux action types
   ✅ Event handler naming
   ✅ API versioning

7. Advanced Patterns
   ✅ Object path types
   ✅ String joining
   ✅ Case conversion
   ✅ BEM class names

8. Performance
   ⚠️ Too many unions = slow compilation
   ⚠️ Limit Cartesian products
   ⚠️ Use at type level, not runtime

INTERVIEW TIPS:
- Explain distribution clearly
- Show mapped type combination
- Demonstrate pattern matching
- Provide practical examples
- Know performance limits
*/
