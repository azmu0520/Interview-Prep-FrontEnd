// Enums - Practical Examples
// Run with: npx ts-node 07-enums.ts
// Or in TypeScript Playground: https://www.typescriptlang.org/play

/* ============================================
   1. NUMERIC ENUMS - Auto-incrementing
   ============================================ */

console.log("=== 1. NUMERIC ENUMS ===\n");

// Basic numeric enum (auto-increment from 0)
enum Direction {
  Up, // 0
  Down, // 1
  Left, // 2
  Right, // 3
}

console.log("Direction.Up:", Direction.Up);
console.log("Direction.Down:", Direction.Down);
console.log("Direction.Left:", Direction.Left);
console.log("Direction.Right:", Direction.Right);

// Using enum in function
function move(direction: Direction) {
  switch (direction) {
    case Direction.Up:
      console.log("Moving up");
      break;
    case Direction.Down:
      console.log("Moving down");
      break;
    case Direction.Left:
      console.log("Moving left");
      break;
    case Direction.Right:
      console.log("Moving right");
      break;
  }
}

move(Direction.Up);
move(Direction.Right);

// Custom starting value
enum Status {
  Idle = 1, // 1
  Loading, // 2
  Success, // 3
  Error, // 4
}

console.log("\nStatus values:");
console.log("Idle:", Status.Idle);
console.log("Loading:", Status.Loading);
console.log("Success:", Status.Success);
console.log("Error:", Status.Error);

// Custom values
enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  ServerError = 500,
}

function handleResponse(status: HttpStatus) {
  switch (status) {
    case HttpStatus.OK:
      console.log("Request successful");
      break;
    case HttpStatus.NotFound:
      console.log("Resource not found");
      break;
    case HttpStatus.ServerError:
      console.log("Server error");
      break;
  }
}

console.log("\nHTTP Status:");
handleResponse(HttpStatus.OK);
handleResponse(HttpStatus.NotFound);

/* ============================================
   2. STRING ENUMS - Explicit values
   ============================================ */

console.log("\n=== 2. STRING ENUMS ===\n");

// String enum (must initialize all members)
enum LogLevel {
  Debug = "DEBUG",
  Info = "INFO",
  Warning = "WARNING",
  Error = "ERROR",
}

function log(level: LogLevel, message: string) {
  console.log(`[${level}] ${message}`);
}

log(LogLevel.Debug, "Debug message");
log(LogLevel.Info, "Info message");
log(LogLevel.Warning, "Warning message");
log(LogLevel.Error, "Error message");

// API endpoints enum
enum APIEndpoint {
  Users = "/api/users",
  Posts = "/api/posts",
  Comments = "/api/comments",
  Auth = "/api/auth",
}

function fetchData(endpoint: APIEndpoint) {
  console.log(`Fetching from ${endpoint}`);
}

console.log("\nAPI Endpoints:");
fetchData(APIEndpoint.Users);
fetchData(APIEndpoint.Posts);

// Event names
enum EventType {
  Click = "CLICK",
  Hover = "HOVER",
  Focus = "FOCUS",
  Submit = "SUBMIT",
}

function handleEvent(type: EventType) {
  console.log(`Handling ${type} event`);
}

handleEvent(EventType.Click);
handleEvent(EventType.Submit);

// Theme enum
enum Theme {
  Light = "light",
  Dark = "dark",
  Auto = "auto",
}

function applyTheme(theme: Theme) {
  console.log(`Applying ${theme} theme`);
}

console.log("\nThemes:");
applyTheme(Theme.Light);
applyTheme(Theme.Dark);

/* ============================================
   3. CONST ENUMS - Zero runtime cost
   ============================================ */

console.log("\n=== 3. CONST ENUMS ===\n");

// Regular enum (generates runtime object)
enum RegularColor {
  Red,
  Green,
  Blue,
}

// Const enum (inlined at compile time)
const enum ConstColor {
  Red,
  Green,
  Blue,
}

const regularColor = RegularColor.Red;
const constColor = ConstColor.Red;

console.log("Regular enum value:", regularColor); // 0
console.log("Const enum value:", constColor); // 0 (inlined)

// Const enum with strings
const enum Size {
  Small = "S",
  Medium = "M",
  Large = "L",
  XLarge = "XL",
}

function getPrice(size: Size): number {
  switch (size) {
    case Size.Small:
      return 10;
    case Size.Medium:
      return 15;
    case Size.Large:
      return 20;
    case Size.XLarge:
      return 25;
  }
}

console.log("\nSize prices:");
console.log("Small:", getPrice(Size.Small));
console.log("Medium:", getPrice(Size.Medium));
console.log("XLarge:", getPrice(Size.XLarge));

/* ============================================
   4. REVERSE MAPPINGS - Numeric enums only
   ============================================ */

console.log("\n=== 4. REVERSE MAPPINGS ===\n");

// Numeric enum with reverse mapping
enum Color {
  Red, // 0
  Green, // 1
  Blue, // 2
}

// Forward mapping (name to value)
console.log("Color.Red:", Color.Red); // 0
console.log("Color['Red']:", Color["Red"]); // 0

// Reverse mapping (value to name)
console.log("Color[0]:", Color[0]); // "Red"
console.log("Color[1]:", Color[1]); // "Green"
console.log("Color[2]:", Color[2]); // "Blue"

// Getting enum name from value
function getColorName(value: number): string | undefined {
  return Color[value];
}

console.log("\nGet color names:");
console.log("0 ->", getColorName(0));
console.log("1 ->", getColorName(1));
console.log("2 ->", getColorName(2));

// String enum (NO reverse mapping)
enum Priority {
  Low = "LOW",
  Medium = "MEDIUM",
  High = "HIGH",
}

console.log("\nString enum:");
console.log("Priority.High:", Priority.High); // "HIGH"
console.log("Priority['High']:", Priority["High"]); // "HIGH"
// console.log(Priority["HIGH"]); // ❌ Error: no reverse mapping

/* ============================================
   5. RUNTIME vs COMPILE-TIME BEHAVIOR
   ============================================ */

console.log("\n=== 5. RUNTIME vs COMPILE-TIME ===\n");

// Regular enum exists at runtime
enum Animal {
  Dog = "DOG",
  Cat = "CAT",
  Bird = "BIRD",
}

// Can iterate over enum
console.log("Animal enum keys:");
for (const key in Animal) {
  console.log(`  ${key} = ${Animal[key as keyof typeof Animal]}`);
}

// Can get all keys and values
console.log("\nAnimal keys:", Object.keys(Animal));
console.log("Animal values:", Object.values(Animal));

// Can check membership
function isAnimal(value: string): value is Animal {
  return Object.values(Animal).includes(value as Animal);
}

console.log("\nIs 'DOG' an Animal?", isAnimal("DOG"));
console.log("Is 'FISH' an Animal?", isAnimal("FISH"));

// Const enum doesn't exist at runtime
const enum Plant {
  Tree = "TREE",
  Flower = "FLOWER",
}

// Can only use direct member access
const plant = Plant.Tree;
console.log("\nPlant value:", plant);

// ❌ Can't iterate (no runtime object)
// for (const key in Plant) { } // Error!

/* ============================================
   6. BIT FLAGS PATTERN
   ============================================ */

console.log("\n=== 6. BIT FLAGS PATTERN ===\n");

// File permissions using bit flags
enum FilePermission {
  None = 0,
  Read = 1 << 0, // 1 (binary: 001)
  Write = 1 << 1, // 2 (binary: 010)
  Execute = 1 << 2, // 4 (binary: 100)
  All = Read | Write | Execute, // 7 (binary: 111)
}

// Check if has permission
function hasPermission(
  userPerms: FilePermission,
  checkPerm: FilePermission
): boolean {
  return (userPerms & checkPerm) === checkPerm;
}

// Add permission
function addPermission(
  current: FilePermission,
  toAdd: FilePermission
): FilePermission {
  return current | toAdd;
}

// Remove permission
function removePermission(
  current: FilePermission,
  toRemove: FilePermission
): FilePermission {
  return current & ~toRemove;
}

const userPerms = FilePermission.Read | FilePermission.Write; // 3

console.log("User permissions:", userPerms);
console.log("Has Read?", hasPermission(userPerms, FilePermission.Read));
console.log("Has Write?", hasPermission(userPerms, FilePermission.Write));
console.log("Has Execute?", hasPermission(userPerms, FilePermission.Execute));

const withExecute = addPermission(userPerms, FilePermission.Execute);
console.log("\nAfter adding Execute:", withExecute);
console.log(
  "Has Execute now?",
  hasPermission(withExecute, FilePermission.Execute)
);

const withoutWrite = removePermission(withExecute, FilePermission.Write);
console.log("\nAfter removing Write:", withoutWrite);
console.log(
  "Has Write now?",
  hasPermission(withoutWrite, FilePermission.Write)
);

/* ============================================
   7. ALTERNATIVES TO ENUMS
   ============================================ */

console.log("\n=== 7. ALTERNATIVES TO ENUMS ===\n");

// Alternative 1: Union of string literals (BEST)
type StatusType = "idle" | "loading" | "success" | "error";

const currentStatus: StatusType = "loading";
console.log("Current status:", currentStatus);

// Alternative 2: as const object
const StatusConst = {
  Idle: "idle",
  Loading: "loading",
  Success: "success",
  Error: "error",
} as const;

type StatusConstValue = (typeof StatusConst)[keyof typeof StatusConst];
// Type: "idle" | "loading" | "success" | "error"

const status2: StatusConstValue = StatusConst.Idle;
console.log("Status from const object:", status2);

// Advantages of this approach:
// ✅ Zero runtime cost (just values)
// ✅ Tree-shakeable
// ✅ Same autocomplete as enum
// ✅ Type-safe

// Alternative 3: Const object with satisfies (TypeScript 4.9+)
const HttpStatusCode = {
  OK: 200,
  Created: 201,
  BadRequest: 400,
  NotFound: 404,
  ServerError: 500,
} as const satisfies Record<string, number>;

type HttpCode = (typeof HttpStatusCode)[keyof typeof HttpStatusCode];
// Type: 200 | 201 | 400 | 404 | 500

const responseCode: HttpCode = HttpStatusCode.OK;
console.log("HTTP code:", responseCode);

// Alternative 4: Namespace pattern
namespace Direction2 {
  export const Up = "UP";
  export const Down = "DOWN";
  export const Left = "LEFT";
  export const Right = "RIGHT";

  export type Type = typeof Up | typeof Down | typeof Left | typeof Right;
}

const dir: Direction2.Type = Direction2.Up;
console.log("Direction:", dir);

/* ============================================
   8. PRACTICAL REAL-WORLD PATTERNS
   ============================================ */

console.log("\n=== 8. PRACTICAL PATTERNS ===\n");

// Pattern 1: API Response Status
enum ResponseStatus {
  Success = "SUCCESS",
  Error = "ERROR",
  Timeout = "TIMEOUT",
  Cancelled = "CANCELLED",
}

interface APIResponse<T> {
  status: ResponseStatus;
  data?: T;
  error?: string;
}

function handleAPIResponse<T>(response: APIResponse<T>) {
  switch (response.status) {
    case ResponseStatus.Success:
      console.log("Data:", response.data);
      break;
    case ResponseStatus.Error:
      console.log("Error:", response.error);
      break;
    case ResponseStatus.Timeout:
      console.log("Request timed out");
      break;
    case ResponseStatus.Cancelled:
      console.log("Request cancelled");
      break;
  }
}

handleAPIResponse<string>({
  status: ResponseStatus.Success,
  data: "User data",
});

// Pattern 2: User Roles
enum UserRole {
  Guest = "GUEST",
  User = "USER",
  Moderator = "MODERATOR",
  Admin = "ADMIN",
  SuperAdmin = "SUPER_ADMIN",
}

// Role hierarchy
const roleHierarchy: Record<UserRole, number> = {
  [UserRole.Guest]: 0,
  [UserRole.User]: 1,
  [UserRole.Moderator]: 2,
  [UserRole.Admin]: 3,
  [UserRole.SuperAdmin]: 4,
};

function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

console.log("\nRole permissions:");
console.log(
  "User has User permission?",
  hasPermission(UserRole.User, UserRole.User)
);
console.log(
  "User has Admin permission?",
  hasPermission(UserRole.User, UserRole.Admin)
);
console.log(
  "Admin has User permission?",
  hasPermission(UserRole.Admin, UserRole.User)
);

// Pattern 3: Order Status Workflow
enum OrderStatus {
  Pending = "PENDING",
  Processing = "PROCESSING",
  Shipped = "SHIPPED",
  Delivered = "DELIVERED",
  Cancelled = "CANCELLED",
}

// Valid status transitions
const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.Pending]: [OrderStatus.Processing, OrderStatus.Cancelled],
  [OrderStatus.Processing]: [OrderStatus.Shipped, OrderStatus.Cancelled],
  [OrderStatus.Shipped]: [OrderStatus.Delivered],
  [OrderStatus.Delivered]: [],
  [OrderStatus.Cancelled]: [],
};

function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return validTransitions[from].includes(to);
}

console.log("\nOrder transitions:");
console.log(
  "Pending -> Processing?",
  canTransition(OrderStatus.Pending, OrderStatus.Processing)
);
console.log(
  "Pending -> Delivered?",
  canTransition(OrderStatus.Pending, OrderStatus.Delivered)
);
console.log(
  "Shipped -> Delivered?",
  canTransition(OrderStatus.Shipped, OrderStatus.Delivered)
);

// Pattern 4: Feature Flags
enum Feature {
  DarkMode = "DARK_MODE",
  BetaUI = "BETA_UI",
  Analytics = "ANALYTICS",
  Notifications = "NOTIFICATIONS",
}

class FeatureFlags {
  private flags = new Set<Feature>();

  enable(feature: Feature) {
    this.flags.add(feature);
  }

  disable(feature: Feature) {
    this.flags.delete(feature);
  }

  isEnabled(feature: Feature): boolean {
    return this.flags.has(feature);
  }

  getEnabled(): Feature[] {
    return Array.from(this.flags);
  }
}

const features = new FeatureFlags();
features.enable(Feature.DarkMode);
features.enable(Feature.Analytics);

console.log("\nFeature flags:");
console.log("Dark mode enabled?", features.isEnabled(Feature.DarkMode));
console.log("Beta UI enabled?", features.isEnabled(Feature.BetaUI));
console.log("Enabled features:", features.getEnabled());

/* ============================================
   INTERVIEW CODING CHALLENGES
   ============================================ */

console.log("\n=== INTERVIEW CHALLENGES ===\n");

// Challenge 1: Enum to array
function enumToArray<T extends Record<string, string | number>>(
  enumObj: T
): Array<T[keyof T]> {
  return Object.values(enumObj).filter(
    (value) => typeof value === "string" || typeof value === "number"
  ) as Array<T[keyof T]>;
}

console.log("Direction values:", enumToArray(Direction));
console.log("LogLevel values:", enumToArray(LogLevel));

// Challenge 2: Get enum keys
function getEnumKeys<T extends Record<string, string | number>>(
  enumObj: T
): Array<keyof T> {
  return Object.keys(enumObj).filter((key) => isNaN(Number(key))) as Array<
    keyof T
  >;
}

console.log("\nDirection keys:", getEnumKeys(Direction));
console.log("Color keys:", getEnumKeys(Color));

// Challenge 3: Create enum from array
function createEnum<T extends string>(values: readonly T[]): Record<T, T> {
  const result = {} as Record<T, T>;
  for (const value of values) {
    result[value] = value;
  }
  return result;
}

const DayOfWeek = createEnum(["Monday", "Tuesday", "Wednesday"] as const);
type DayOfWeek = (typeof DayOfWeek)[keyof typeof DayOfWeek];

console.log("\nDayOfWeek:", DayOfWeek);

// Challenge 4: Validate enum value
function isEnumValue<T extends Record<string, string | number>>(
  enumObj: T,
  value: unknown
): value is T[keyof T] {
  return Object.values(enumObj).includes(value as T[keyof T]);
}

console.log("\nEnum validation:");
console.log("Is 'DEBUG' a LogLevel?", isEnumValue(LogLevel, "DEBUG"));
console.log("Is 'INVALID' a LogLevel?", isEnumValue(LogLevel, "INVALID"));
console.log("Is 0 a Direction?", isEnumValue(Direction, 0));

// Challenge 5: Convert string to enum safely
function parseEnum<T extends Record<string, string>>(
  enumObj: T,
  value: string,
  defaultValue: T[keyof T]
): T[keyof T] {
  return isEnumValue(enumObj, value) ? value : defaultValue;
}

console.log("\nParse enum:");
console.log("Parse 'DEBUG':", parseEnum(LogLevel, "DEBUG", LogLevel.Info));
console.log("Parse 'INVALID':", parseEnum(LogLevel, "INVALID", LogLevel.Info));

console.log("\n=== All examples completed successfully! ===");

/* ============================================
   QUICK REFERENCE CHEAT SHEET
   ============================================ */

/*
KEY TAKEAWAYS:

1. Numeric Enums
   ✅ Auto-increment from 0
   ✅ Have reverse mappings
   ✅ Can customize starting value
   ✅ Good for bit flags

2. String Enums
   ✅ Must initialize all members
   ✅ No reverse mapping
   ✅ Self-documenting (readable values)
   ✅ Better for debugging

3. Const Enums
   ✅ Zero runtime cost (inlined)
   ✅ Smaller bundle size
   ✅ Can't iterate or access dynamically
   ❌ Don't use in libraries

4. Reverse Mappings
   ✅ Only for numeric enums
   ✅ Can get name from value
   ✅ Doubles enum object size
   ❌ Not available for string enums

5. Runtime Behavior
   ✅ Regular enums exist at runtime
   ✅ Can iterate and check membership
   ✅ Const enums removed at compile time
   ❌ Const enums can't be iterated

6. Alternatives (PREFERRED!)
   ✅ Union of string literals
   ✅ as const objects
   ✅ Zero runtime cost
   ✅ Tree-shakeable
   ✅ Better integration with TypeScript

7. When to Use Enums
   ✅ Bit flags operations
   ✅ Need reverse mapping
   ✅ Legacy compatibility
   ❌ Most cases: use union literals instead

8. Common Patterns
   - API response status
   - User roles and permissions
   - Feature flags
   - Order/workflow status
   - File permissions (bit flags)

INTERVIEW TIPS:
- Know numeric vs string differences
- Understand const enum benefits/limitations
- Explain why union literals often better
- Can implement enum utilities
- Understand reverse mapping mechanism
*/
