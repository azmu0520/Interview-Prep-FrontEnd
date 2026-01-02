// Arrays and Tuples - Practical Examples
// Run with: npx ts-node 02-arrays-tuples.ts

/* ============================================
   1. ARRAY TYPE SYNTAX - Two Ways
   ============================================ */

console.log("=== 1. ARRAY TYPE SYNTAX ===\n");

// Syntax 1: Type[] (more common)
let numbers1: number[] = [1, 2, 3, 4, 5];
let strings1: string[] = ["apple", "banana", "orange"];
let booleans1: boolean[] = [true, false, true];

// Syntax 2: Array<Type> (generic syntax)
let numbers2: Array<number> = [1, 2, 3, 4, 5];
let strings2: Array<string> = ["apple", "banana", "orange"];
let booleans2: Array<boolean> = [true, false, true];

// Both are identical!
console.log("Arrays created with both syntaxes:");
console.log({ numbers1, numbers2 });

// Complex types - Array<Type> might be clearer
type User = { name: string; age: number };
let users1: User[] = [{ name: "Alice", age: 25 }];
let users2: Array<User> = [{ name: "Bob", age: 30 }];

// Multi-dimensional arrays
let matrix1: number[][] = [[1, 2], [3, 4]];
let matrix2: Array<Array<number>> = [[1, 2], [3, 4]];

console.log("Multi-dimensional:", matrix1);

/* ============================================
   2. ARRAYS vs TUPLES - Critical Difference
   ============================================ */

console.log("\n=== 2. ARRAYS vs TUPLES ===\n");

// ARRAY - homogeneous, variable length
let scores: number[] = [95, 87, 91, 88];
scores.push(92); // ✅ Can add more
scores.push(85); // ✅ Can add more
console.log("Scores (array):", scores);

let firstScore: number = scores[0]; // Type: number
let secondScore: number = scores[1]; // Type: number

// TUPLE - heterogeneous, fixed structure
let user: [string, number] = ["Alice", 25];
// user.push(30); // ⚠️ Compiles but breaks tuple contract!

let userName: string = user[0]; // Type: string (specific!)
let userAge: number = user[1]; // Type: number (specific!)
console.log("User (tuple):", { userName, userAge });

// Practical comparison
type Coordinate = [number, number]; // Tuple - fixed 2D point
let point: Coordinate = [10, 20];
console.log("Point:", point);

let points: number[][] = [[10, 20], [30, 40]]; // Array of arrays
console.log("Points:", points);

/* ============================================
   3. TUPLE TYPES - Fixed Structure
   ============================================ */

console.log("\n=== 3. TUPLE TYPES ===\n");

// Basic tuples
type Point2D = [number, number];
type Point3D = [number, number, number];
type RGB = [number, number, number];
type RGBA = [number, number, number, number];

let position: Point2D = [100, 200];
let color: RGB = [255, 128, 0];

console.log("Position:", position);
console.log("Color:", color);

// Tuple destructuring
const [x, y] = position;
const [r, g, b] = color;
console.log("Destructured:", { x, y, r, g, b });

// Complex tuples
type UserTuple = [string, number, boolean]; // [name, age, isActive]
let userTuple: UserTuple = ["Bob", 30, true];

const [name, age, isActive] = userTuple;
console.log("User:", { name, age, isActive });

// Function returning tuple (like React useState)
function createCounter(initial: number): [number, () => void, () => void] {
  let count = initial;
  const increment = () => { count++; };
  const decrement = () => { count--; };
  return [count, increment, decrement];
}

const [count, inc, dec] = createCounter(0);
console.log("Initial count:", count);

// Tuple for key-value pairs
type Entry<K, V> = [K, V];
const entries: Entry<string, number>[] = [
  ["age", 25],
  ["score", 100],
  ["level", 5]
];

console.log("Entries:", entries);

/* ============================================
   4. OPTIONAL TUPLE ELEMENTS
   ============================================ */

console.log("\n=== 4. OPTIONAL TUPLE ELEMENTS ===\n");

// Optional elements with ?
type Coordinate3D = [number, number, number?]; // Z is optional

let point2D: Coordinate3D = [10, 20]; // ✅ Valid
let point3D: Coordinate3D = [10, 20, 30]; // ✅ Valid

console.log("2D Point:", point2D);
console.log("3D Point:", point3D);

// Function using optional tuple elements
function calculateDistance(point: Coordinate3D): number {
  const [x, y, z] = point;
  
  if (z !== undefined) {
    // 3D distance
    return Math.sqrt(x * x + y * y + z * z);
  }
  // 2D distance
  return Math.sqrt(x * x + y * y);
}

console.log("2D distance:", calculateDistance([3, 4])); // 5
console.log("3D distance:", calculateDistance([2, 3, 6])); // 7

// Multiple optional elements
type UserInfo = [string, number, string?, boolean?];
//                name   age    email   isAdmin

let user1: UserInfo = ["Alice", 25]; // ✅
let user2: UserInfo = ["Bob", 30, "bob@email.com"]; // ✅
let user3: UserInfo = ["Charlie", 35, "charlie@email.com", true]; // ✅

console.log("Users:", { user1, user2, user3 });

/* ============================================
   5. REST ELEMENTS IN TUPLES
   ============================================ */

console.log("\n=== 5. REST ELEMENTS IN TUPLES ===\n");

// Rest element captures remaining values
type StringNumberBooleans = [string, number, ...boolean[]];

let tuple1: StringNumberBooleans = ["hello", 42]; // ✅ No booleans
let tuple2: StringNumberBooleans = ["hello", 42, true]; // ✅ One boolean
let tuple3: StringNumberBooleans = ["hello", 42, true, false, true]; // ✅ Many booleans

console.log("Tuples with rest:", { tuple1, tuple2, tuple3 });

// Practical: Function with required and optional args
type LogArgs = [string, ...any[]];

function log(...args: LogArgs) {
  const [message, ...rest] = args;
  console.log(`[LOG] ${message}`, rest.length > 0 ? rest : "");
}

log("Starting application"); // ✅
log("Error occurred", 404, "Not found"); // ✅
log("User action", { userId: 123, action: "click" }); // ✅

// Rest at the beginning (less common)
type TrailingString = [...number[], string];
let valid1: TrailingString = [1, 2, 3, "end"]; // ✅
let valid2: TrailingString = ["end"]; // ✅
// let invalid: TrailingString = [1, 2, 3]; // ❌ Missing string at end

/* ============================================
   6. NAMED TUPLES - Self-Documenting
   ============================================ */

console.log("\n=== 6. NAMED TUPLES ===\n");

// Without names - unclear
type Response1 = [number, string, boolean];

// With names - self-documenting
type Response2 = [statusCode: number, message: string, success: boolean];

function makeRequest(url: string): Response2 {
  // Mock response
  return [200, "OK", true];
}

const [statusCode, message, success] = makeRequest("/api/users");
console.log("Response:", { statusCode, message, success });

// Named tuples for function signatures
function useState<T>(
  initialValue: T
): [state: T, setState: (value: T) => void] {
  let state = initialValue;
  const setState = (newValue: T) => {
    state = newValue;
  };
  return [state, setState];
}

const [count2, setCount] = useState(0);
console.log("State:", count2);

// Complex example: Database query result
type QueryResult = [
  data: any[],
  totalCount: number,
  hasMore: boolean,
  nextCursor: string | null
];

function queryDatabase(): QueryResult {
  return [
    [{ id: 1 }, { id: 2 }],
    100,
    true,
    "cursor_abc123"
  ];
}

const [data, totalCount, hasMore, nextCursor] = queryDatabase();
console.log("Query result:", { data, totalCount, hasMore, nextCursor });

/* ============================================
   7. READONLY ARRAYS AND TUPLES
   ============================================ */

console.log("\n=== 7. READONLY ARRAYS AND TUPLES ===\n");

// Regular array - mutable
let mutableNumbers: number[] = [1, 2, 3, 4, 5];
mutableNumbers.push(6); // ✅ Allowed
mutableNumbers[0] = 10; // ✅ Allowed
console.log("Mutable array:", mutableNumbers);

// Readonly array - immutable
let immutableNumbers: readonly number[] = [1, 2, 3, 4, 5];
// immutableNumbers.push(6); // ❌ Error: push doesn't exist
// immutableNumbers[0] = 10; // ❌ Error: cannot assign to readonly

// Can read values
console.log("First immutable:", immutableNumbers[0]); // ✅ 1
console.log("All immutable:", immutableNumbers); // ✅

// Alternative syntax
let readonlyArray: ReadonlyArray<number> = [1, 2, 3];
// readonlyArray.push(4); // ❌ Error

// Readonly tuples
let readonlyPoint: readonly [number, number] = [10, 20];
// readonlyPoint[0] = 15; // ❌ Error: cannot assign
// readonlyPoint.push(30); // ❌ Error: push doesn't exist

console.log("Readonly point:", readonlyPoint);

// Readonly in function parameters
function sum(numbers: readonly number[]): number {
  // numbers.sort(); // ❌ Error: can't mutate
  return numbers.reduce((acc, n) => acc + n, 0);
}

const result = sum([1, 2, 3, 4, 5]);
console.log("Sum:", result);

// Creating new arrays instead of mutating
const original: readonly number[] = [3, 1, 4, 1, 5];

// ✅ Create new sorted array
const sorted = [...original].sort();
console.log("Original:", original); // [3, 1, 4, 1, 5]
console.log("Sorted:", sorted); // [1, 1, 3, 4, 5]

// ✅ Create new array with added element
const withNew = [...original, 9];
console.log("With new element:", withNew);

/* ============================================
   8. ARRAY METHODS - Type Safety
   ============================================ */

console.log("\n=== 8. ARRAY METHODS - TYPE SAFETY ===\n");

const numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// map - transforms and preserves type
const doubled: number[] = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

const stringified: string[] = numbers.map(n => n.toString());
console.log("Stringified:", stringified);

// filter - maintains type
const evens: number[] = numbers.filter(n => n % 2 === 0);
console.log("Evens:", evens);

// reduce - infers result type
const sum2: number = numbers.reduce((acc, n) => acc + n, 0);
console.log("Sum:", sum2);

const product: number = numbers.reduce((acc, n) => acc * n, 1);
console.log("Product:", product);

// reduce to object
const grouped = numbers.reduce((acc, n) => {
  const key = n % 2 === 0 ? "even" : "odd";
  return { ...acc, [key]: [...(acc[key] || []), n] };
}, {} as { even?: number[]; odd?: number[] });
console.log("Grouped:", grouped);

// find - returns T | undefined
const found: number | undefined = numbers.find(n => n > 5);
console.log("Found:", found); // 6

const notFound: number | undefined = numbers.find(n => n > 100);
console.log("Not found:", notFound); // undefined

// some/every - return boolean
const hasEven: boolean = numbers.some(n => n % 2 === 0);
const allPositive: boolean = numbers.every(n => n > 0);
console.log("Has even:", hasEven, "All positive:", allPositive);

// Type inference with complex objects
interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: "Laptop", price: 999 },
  { id: 2, name: "Mouse", price: 29 },
  { id: 3, name: "Keyboard", price: 79 }
];

const productNames: string[] = products.map(p => p.name);
const expensiveProducts: Product[] = products.filter(p => p.price > 50);
const totalPrice: number = products.reduce((sum, p) => sum + p.price, 0);

console.log("Product names:", productNames);
console.log("Expensive products:", expensiveProducts);
console.log("Total price:", totalPrice);

/* ============================================
   9. PRACTICAL EXAMPLES
   ============================================ */

console.log("\n=== 9. PRACTICAL EXAMPLES ===\n");

// Example 1: Type-safe coordinates
type Coordinate2D = [x: number, y: number];
type Coordinate3D = [x: number, y: number, z: number];

class Point {
  constructor(private coords: Coordinate2D | Coordinate3D) {}
  
  distance(): number {
    const [x, y, z] = this.coords;
    if (z !== undefined) {
      return Math.sqrt(x * x + y * y + z * z);
    }
    return Math.sqrt(x * x + y * y);
  }
  
  toString(): string {
    return `Point(${this.coords.join(", ")})`;
  }
}

const p1 = new Point([3, 4]);
const p2 = new Point([2, 3, 6]);
console.log(p1.toString(), "distance:", p1.distance());
console.log(p2.toString(), "distance:", p2.distance());

// Example 2: Type-safe configuration
type Config = readonly [
  environment: "development" | "staging" | "production",
  port: number,
  hostname: string
];

const config: Config = ["development", 3000, "localhost"];
const [env, port, hostname] = config;
console.log("Config:", { env, port, hostname });

// Example 3: Function returning multiple values
function divideWithRemainder(
  dividend: number,
  divisor: number
): [quotient: number, remainder: number] {
  return [Math.floor(dividend / divisor), dividend % divisor];
}

const [quotient, remainder] = divideWithRemainder(17, 5);
console.log(`17 ÷ 5 = ${quotient} remainder ${remainder}`);

// Example 4: Event system with tuples
type MouseEventData = [x: number, y: number, button: number];
type KeyEventData = [key: string, ctrlKey: boolean, shiftKey: boolean];

type EventMap = {
  click: MouseEventData;
  keypress: KeyEventData;
};

function emitEvent<K extends keyof EventMap>(
  event: K,
  data: EventMap[K]
): void {
  console.log(`Event: ${event}`, data);
}

emitEvent("click", [100, 200, 0]);
emitEvent("keypress", ["Enter", false, false]);

// Example 5: Type-safe range
type Range = readonly [start: number, end: number];

function createRange([start, end]: Range): number[] {
  return Array.from({ length: end - start }, (_, i) => start + i);
}

const range1 = createRange([1, 5]); // [1, 2, 3, 4]
const range2 = createRange([10, 15]); // [10, 11, 12, 13, 14]
console.log("Ranges:", { range1, range2 });

/* ============================================
   10. COMMON PITFALLS & SOLUTIONS
   ============================================ */

console.log("\n=== 10. COMMON PITFALLS ===\n");

// Pitfall 1: Empty array type inference
// ❌ Type is never[] - can't add anything!
const emptyArray1 = [];
// emptyArray1.push(1); // ❌ Error: number not assignable to never

// ✅ Provide explicit type
const emptyArray2: number[] = [];
emptyArray2.push(1); // ✅ Works
console.log("Empty array:", emptyArray2);

// Pitfall 2: Tuple mutations with push/pop
type Pair = [number, number];
let pair: Pair = [1, 2];

// ⚠️ This compiles but breaks tuple contract!
pair.push(3); // Now length is 3!
console.log("Mutated tuple:", pair); // [1, 2, 3]

// ✅ Use readonly for true immutability
let safePair: readonly [number, number] = [1, 2];
// safePair.push(3); // ❌ Error: push doesn't exist

// Pitfall 3: Confusing array and union syntax
// ❌ This is: string OR array of numbers
type Wrong = string | number[];

// ✅ This is: array of (string or number)
type Correct = (string | number)[];

let wrong: Wrong = "hello"; // ✅ string
let wrong2: Wrong = [1, 2, 3]; // ✅ number[]
// let wrong3: Wrong = ["hello", 1]; // ❌ Error

let correct: Correct = ["hello", 1, "world", 2]; // ✅
console.log("Correct mixed array:", correct);

// Pitfall 4: Optional tuple elements position
// ❌ Optional must be at end
// type Invalid = [string, number?, boolean];

// ✅ Optional at end
type Valid = [string, number?, boolean?];

// Pitfall 5: Not using readonly for immutable data
// ❌ Function can accidentally mutate
function processData(data: number[]): number {
  data.sort(); // Mutates original!
  return data[0];
}

const myData = [3, 1, 4, 1, 5];
const min = processData(myData);
console.log("Original mutated:", myData); // [1, 1, 3, 4, 5] - oops!

// ✅ Use readonly parameter
function processDataSafe(data: readonly number[]): number {
  const sorted = [...data].sort(); // Create copy
  return sorted[0];
}

const myData2 = [3, 1, 4, 1, 5];
const min2 = processDataSafe(myData2);
console.log("Original safe:", myData2); // [3, 1, 4, 1, 5] - unchanged!

/* ============================================
   INTERVIEW CODING CHALLENGES
   ============================================ */

console.log("\n=== INTERVIEW CODING CHALLENGES ===\n");

// Challenge 1: Implement tuple swap
function swap<T, U>(tuple: [T, U]): [U, T] {
  const [first, second] = tuple;
  return [second, first];
}

const swapped = swap([1, "hello"]);
console.log("Swapped:", swapped); // ["hello", 1]

// Challenge 2: Implement zip function
function zip<T, U>(arr1: T[], arr2: U[]): [T, U][] {
  const length = Math.min(arr1.length, arr2.length);
  const result: [T, U][] = [];
  
  for (let i = 0; i < length; i++) {
    result.push([arr1[i], arr2[i]]);
  }
  
  return result;
}

const zipped = zip([1, 2, 3], ["a", "b", "c"]);
console.log("Zipped:", zipped); // [[1, "a"], [2, "b"], [3, "c"]]

// Challenge 3: Implement first and rest
function firstAndRest<T>(arr: readonly T[]): [T, T[]] | [] {
  if (arr.length === 0) return [];
  const [first, ...rest] = arr;
  return [first, rest];
}

const result1 = firstAndRest([1, 2, 3, 4, 5]);
console.log("First and rest:", result1); // [1, [2, 3, 4, 5]]

// Challenge 4: Type-safe tuple concat
function concat<T extends readonly any[], U extends readonly any[]>(
  tuple1: T,
  tuple2: U
): [...T, ...U] {
  return [...tuple1, ...tuple2];
}

const concatenated = concat([1, "hello"], [true, 42]);
console.log("Concatenated:", concatenated); // [1, "hello", true, 42]

console.log("\n=== All examples completed successfully! ===");

/* ============================================
   QUICK REFERENCE CHEAT SHEET
   ============================================ */

/*
KEY TAKEAWAYS:

1. Array Type Syntax
   ✅ Type[] - preferred for simple types
   ✅ Array<Type> - for complex generics
   ✅ Both are identical

2. Arrays vs Tuples
   ✅ Array: homogeneous, variable length
   ✅ Tuple: heterogeneous, fixed length
   ✅ Use tuples for fixed structures

3. Tuple Features
   ✅ Optional elements with ?
   ✅ Rest elements with ...Type[]
   ✅ Named tuples for clarity
   ✅ Destructuring support

4. Readonly
   ✅ Prevents mutations
   ✅ Use for function parameters
   ✅ Compile-time only
   ✅ readonly number[] or ReadonlyArray<number>

5. Type Safety
   ✅ Array methods preserve types
   ✅ TypeScript infers return types
   ✅ Explicit types for empty arrays
   ✅ Use generics for flexibility

COMMON INTERVIEW PATTERNS:
- React useState return: [state: T, setState: (T) => void]
- Coordinates: [x: number, y: number, z?: number]
- Key-value pairs: [K, V][]
- Function multiple returns: [result, error]
- Range: [start: number, end: number]

GOTCHAS:
- Tuple push/pop still compile (use readonly!)
- Empty array infers as never[]
- Optional tuple elements must be last
- Readonly is compile-time only
*/