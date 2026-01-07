// JavaScript Data Types & Type Coercion - Practical Examples
// Run in browser console or Node.js

console.log("=== JAVASCRIPT DATA TYPES & TYPE COERCION ===\n");

/* ============================================
   1. PRIMITIVE vs REFERENCE TYPES
   ============================================ */

console.log("=== 1. PRIMITIVE vs REFERENCE TYPES ===\n");

// Primitives - Copy by VALUE
console.log("--- Primitives (Copy by Value) ---");
let num1 = 5;
let num2 = num1; // Copies the VALUE
num2 = 10;

console.log("num1:", num1); // 5 (unchanged!)
console.log("num2:", num2); // 10
console.log("They are independent:", num1 !== num2);

let str1 = "hello";
let str2 = str1; // Copies the VALUE
str2 = "world";

console.log("\nstr1:", str1); // "hello" (unchanged!)
console.log("str2:", str2); // "world"

// References - Copy by REFERENCE
console.log("\n--- References (Copy by Reference) ---");
let obj1 = { value: 5 };
let obj2 = obj1; // Copies the REFERENCE
obj2.value = 10;

console.log("obj1.value:", obj1.value); // 10 (changed!)
console.log("obj2.value:", obj2.value); // 10
console.log("They point to same object:", obj1 === obj2);

let arr1 = [1, 2, 3];
let arr2 = arr1; // Copies the REFERENCE
arr2.push(4);

console.log("\narr1:", arr1); // [1, 2, 3, 4] (changed!)
console.log("arr2:", arr2); // [1, 2, 3, 4]
console.log("They point to same array:", arr1 === arr2);

// Function Parameters
console.log("\n--- Function Parameters ---");

function modifyPrimitive(x) {
  x = 100; // Creates new local variable
  console.log("Inside function - x:", x);
}

function modifyObject(obj) {
  obj.value = 100; // Modifies original object
  console.log("Inside function - obj.value:", obj.value);
}

let primitive = 5;
console.log("Before function - primitive:", primitive);
modifyPrimitive(primitive);
console.log("After function - primitive:", primitive); // 5 (unchanged!)

let object = { value: 5 };
console.log("\nBefore function - object.value:", object.value);
modifyObject(object);
console.log("After function - object.value:", object.value); // 100 (changed!)

// Creating Independent Copies
console.log("\n--- Creating Independent Copies ---");

// Primitives - automatic
let original = 42;
let copy = original;
copy = 100;
console.log("original:", original, "copy:", copy);

// Objects - need to clone
let originalObj = { name: "Alice", age: 30 };

// Shallow copy methods
let shallowCopy1 = { ...originalObj };
let shallowCopy2 = Object.assign({}, originalObj);

shallowCopy1.name = "Bob";
console.log("\noriginalObj:", originalObj); // { name: "Alice", age: 30 }
console.log("shallowCopy1:", shallowCopy1); // { name: "Bob", age: 30 }

// Deep nested object issue
let nestedObj = { user: { name: "Alice" } };
let shallowCopyNested = { ...nestedObj };
shallowCopyNested.user.name = "Bob";
console.log("\nOriginal nested:", nestedObj.user.name); // "Bob" (changed!)
console.log("Copy nested:", shallowCopyNested.user.name); // "Bob"

// Deep copy solution
let deepCopy = JSON.parse(JSON.stringify(nestedObj));
deepCopy.user.name = "Charlie";
console.log("\nAfter deep copy:");
console.log("Original:", nestedObj.user.name); // "Bob" (unchanged!)
console.log("Deep copy:", deepCopy.user.name); // "Charlie"

/* ============================================
   2. TYPEOF OPERATOR & QUIRKS
   ============================================ */

console.log("\n\n=== 2. TYPEOF OPERATOR & QUIRKS ===\n");

// Basic typeof usage
console.log('typeof "hello":', typeof "hello"); // "string"
console.log("typeof 42:", typeof 42); // "number"
console.log("typeof true:", typeof true); // "boolean"
console.log("typeof undefined:", typeof undefined); // "undefined"
console.log("typeof Symbol():", typeof Symbol()); // "symbol"
console.log("typeof 123n:", typeof 123n); // "bigint"

// The QUIRKS
console.log("\n--- The Famous Quirks ---");
console.log("typeof null:", typeof null); // "object" ❌ BUG!
console.log("typeof []:", typeof []); // "object"
console.log("typeof {}:", typeof {}); // "object"
console.log("typeof function(){}:", typeof function () {}); // "function"
console.log("typeof NaN:", typeof NaN); // "number" 🤯

// Proper type checking
console.log("\n--- Proper Type Checking ---");

function getType(value) {
  // Handle null explicitly
  if (value === null) return "null";

  // Handle arrays
  if (Array.isArray(value)) return "array";

  // Use typeof for everything else
  return typeof value;
}

console.log("getType(null):", getType(null)); // "null" ✅
console.log("getType([]):", getType([])); // "array" ✅
console.log("getType({}):", getType({})); // "object" ✅
console.log("getType(42):", getType(42)); // "number" ✅

// Checking for NaN properly
console.log("\n--- Checking for NaN ---");
const notANumber = NaN;
console.log("typeof NaN:", typeof notANumber); // "number"
console.log("NaN === NaN:", notANumber === notANumber); // false
console.log("isNaN(NaN):", isNaN(notANumber)); // true
console.log('isNaN("hello"):', isNaN("hello")); // true (wrong!)
console.log("Number.isNaN(NaN):", Number.isNaN(notANumber)); // true ✅
console.log('Number.isNaN("hello"):', Number.isNaN("hello")); // false ✅

/* ============================================
   3. NULL vs UNDEFINED
   ============================================ */

console.log("\n\n=== 3. NULL vs UNDEFINED ===\n");

// undefined - not assigned
let notAssigned;
console.log("Declared but not assigned:", notAssigned); // undefined

// undefined - missing property
let obj = { name: "Alice" };
console.log("Missing property:", obj.age); // undefined

// undefined - no return
function noReturn() {}
console.log("Function with no return:", noReturn()); // undefined

// undefined - missing parameter
function logParam(param) {
  console.log("Parameter value:", param);
}
logParam(); // undefined

// null - intentionally empty
let currentUser = null;
console.log("\nIntentionally empty:", currentUser); // null

// Type checking
console.log("\n--- Type Checking ---");
console.log("typeof undefined:", typeof undefined); // "undefined"
console.log("typeof null:", typeof null); // "object" (quirk)

// Equality
console.log("\n--- Equality ---");
console.log("null == undefined:", null == undefined); // true
console.log("null === undefined:", null === undefined); // false

// Arithmetic
console.log("\n--- Arithmetic Behavior ---");
console.log("undefined + 5:", undefined + 5); // NaN
console.log("null + 5:", null + 5); // 5 (null → 0)
console.log("Number(undefined):", Number(undefined)); // NaN
console.log("Number(null):", Number(null)); // 0

// Best practices
console.log("\n--- Best Practices ---");

// Check both with ==
function checkEmpty(value) {
  if (value == null) {
    // Catches both null AND undefined
    console.log("Value is null or undefined");
    return true;
  }
  return false;
}

checkEmpty(null); // true
checkEmpty(undefined); // true
checkEmpty(0); // false

// Or explicit check
function checkEmptyExplicit(value) {
  if (value === null || value === undefined) {
    console.log("Value is null or undefined (explicit)");
    return true;
  }
  return false;
}

checkEmptyExplicit(null); // true
checkEmptyExplicit(undefined); // true

// Nullish coalescing
const value1 = null ?? "default";
const value2 = undefined ?? "default";
const value3 = 0 ?? "default"; // 0 is not null/undefined
console.log("\nNullish coalescing:");
console.log("null ?? 'default':", value1); // "default"
console.log("undefined ?? 'default':", value2); // "default"
console.log("0 ?? 'default':", value3); // 0

/* ============================================
   4. TYPE COERCION - Implicit vs Explicit
   ============================================ */

console.log("\n\n=== 4. TYPE COERCION ===\n");

// Explicit coercion (RECOMMENDED)
console.log("--- Explicit Coercion (Recommended) ---");

console.log("String(123):", String(123)); // "123"
console.log("String(true):", String(true)); // "true"
console.log("String(null):", String(null)); // "null"
console.log("String(undefined):", String(undefined)); // "undefined"

console.log('\nNumber("123"):', Number("123")); // 123
console.log('Number("12.5"):', Number("12.5")); // 12.5
console.log("Number(true):", Number(true)); // 1
console.log("Number(false):", Number(false)); // 0
console.log("Number(null):", Number(null)); // 0
console.log("Number(undefined):", Number(undefined)); // NaN
console.log('Number(""):', Number("")); // 0
console.log('Number("abc"):', Number("abc")); // NaN

console.log("\nBoolean(1):", Boolean(1)); // true
console.log("Boolean(0):", Boolean(0)); // false
console.log('Boolean(""):', Boolean("")); // false
console.log('Boolean("text"):', Boolean("text")); // true
console.log("Boolean(null):", Boolean(null)); // false
console.log("Boolean({}):", Boolean({})); // true
console.log("Boolean([]):", Boolean([])); // true

// Implicit coercion (AUTOMATIC)
console.log("\n--- Implicit Coercion (Automatic) ---");

// String coercion with +
console.log('"hello" + " world":', "hello" + " world"); // "hello world"
console.log('"5" + 5:', "5" + 5); // "55"
console.log('"5" + true:', "5" + true); // "5true"
console.log('"5" + null:', "5" + null); // "5null"
console.log('"5" + undefined:', "5" + undefined); // "5undefined"

// Numeric coercion with -, *, /, %
console.log('\n"5" - 2:', "5" - 2); // 3
console.log('"5" * "2":', "5" * "2"); // 10
console.log('"10" / "2":', "10" / "2"); // 5
console.log('"5" % 2:', "5" % 2); // 1

// Boolean coercion in conditions
console.log("\n--- Boolean Coercion in Conditions ---");

if ("hello") console.log('if("hello") is truthy'); // Executes
if (0) console.log("if(0) is truthy");
else console.log("if(0) is falsy"); // Executes
if ([]) console.log("if([]) is truthy"); // Executes (arrays are truthy!)

// The confusing cases
console.log("\n--- The Confusing Cases ---");
console.log("[] + []:", [] + []); // ""
console.log("[] + {}:", [] + {}); // "[object Object]"
console.log("{} + []:", {} + []); // 0 or "[object Object]" (context-dependent)

// Comparison coercion
console.log("\n--- Comparison Coercion ---");
console.log('5 == "5":', 5 == "5"); // true (coerces)
console.log('5 === "5":', 5 === "5"); // false (strict)
console.log("true == 1:", true == 1); // true
console.log("false == 0:", false == 0); // true
console.log("null == undefined:", null == undefined); // true
console.log('"" == 0:', "" == 0); // true

// Practical example: Safe addition
console.log("\n--- Practical: Safe Addition ---");

function add(a, b) {
  // Bad: Implicit coercion
  // return a + b; // Could be string or number!

  // Good: Explicit coercion
  return Number(a) + Number(b);
}

console.log('add("5", 3):', add("5", 3)); // 8 (not "53")
console.log("add(5, 3):", add(5, 3)); // 8

/* ============================================
   5. TRUTHY and FALSY VALUES
   ============================================ */

console.log("\n\n=== 5. TRUTHY and FALSY VALUES ===\n");

// The 8 falsy values (MEMORIZE!)
console.log("--- The 8 Falsy Values ---");
const falsyValues = [false, 0, -0, 0n, "", null, undefined, NaN];

falsyValues.forEach((val) => {
  console.log(`Boolean(${String(val).padEnd(10)}):`, Boolean(val));
});

// Surprisingly truthy values
console.log("\n--- Surprisingly Truthy Values ---");
const truthyValues = [
  "0",
  "false",
  [],
  {},
  function () {},
  new Date(),
  -1,
  Infinity,
];

truthyValues.forEach((val) => {
  const str =
    typeof val === "function"
      ? "function(){}"
      : typeof val === "object"
      ? JSON.stringify(val) || "Date"
      : String(val);
  console.log(`Boolean(${str.padEnd(15)}):`, Boolean(val));
});

// Practical usage - Default values
console.log("\n--- Default Values ---");

// BAD: OR operator with 0
function setVolume(level) {
  return level || 50; // 0 becomes 50!
}
console.log("setVolume(0):", setVolume(0)); // 50 ❌
console.log("setVolume(25):", setVolume(25)); // 25 ✅

// GOOD: Nullish coalescing
function setVolumeGood(level) {
  return level ?? 50; // Only null/undefined become 50
}
console.log("\nsetVolumeGood(0):", setVolumeGood(0)); // 0 ✅
console.log("setVolumeGood(null):", setVolumeGood(null)); // 50 ✅
console.log("setVolumeGood(undefined):", setVolumeGood(undefined)); // 50 ✅

// Existence checks
console.log("\n--- Existence Checks ---");

const users = ["Alice", "Bob"];
if (users) console.log("users array exists"); // ✅
if (users.length) console.log("users array has items"); // ✅

const emptyArray = [];
if (emptyArray) console.log("emptyArray is truthy"); // ✅ (arrays always truthy)
if (!emptyArray.length) console.log("emptyArray is empty"); // ✅ (check length)

const text = "Hello";
if (text) console.log("text has content"); // ✅

// Double NOT trick
console.log("\n--- Double NOT (!!) Trick ---");
console.log('!!"":', !!""); // false
console.log('!!"text":', !!"text"); // true
console.log("!!0:", !!0); // false
console.log("!!42:", !!42); // true
console.log("!![]:", !![]); // true
console.log("!!{}:", !!{}); // true

/* ============================================
   6. EQUALITY: == vs ===
   ============================================ */

console.log("\n\n=== 6. EQUALITY: == vs === ===\n");

// Strict equality (RECOMMENDED)
console.log("--- Strict Equality (===) ---");
console.log("5 === 5:", 5 === 5); // true
console.log('5 === "5":', 5 === "5"); // false
console.log("true === 1:", true === 1); // false
console.log("null === undefined:", null === undefined); // false
console.log("NaN === NaN:", NaN === NaN); // false

// Loose equality (AVOID)
console.log("\n--- Loose Equality (==) ---");
console.log('5 == "5":', 5 == "5"); // true ⚠️
console.log("true == 1:", true == 1); // true ⚠️
console.log("false == 0:", false == 0); // true ⚠️
console.log("null == undefined:", null == undefined); // true ⚠️
console.log('"" == 0:', "" == 0); // true ⚠️
console.log('[] == "":', [] == ""); // true ⚠️

// Confusing examples
console.log("\n--- Confusing Examples ---");
console.log("[] == ![]:", [] == ![]); // true 🤯
console.log('"" == 0:', "" == 0); // true
console.log('"0" == 0:', "0" == 0); // true
console.log('"0" == "":', "0" == ""); // false 🤯
console.log('false == "":', false == ""); // true
console.log("false == []:", false == []); // true
console.log("false == {}:", false == {}); // false

// Object comparison
console.log("\n--- Object Comparison ---");
const obj3 = { a: 1 };
const obj4 = { a: 1 };
const obj5 = obj3;

console.log("Different objects === :", obj3 === obj4); // false
console.log("Same reference === :", obj3 === obj5); // true
console.log("Different objects == :", obj3 == obj4); // false

console.log("[] === []:", [] === []); // false
console.log("{} === {}:", {} === {}); // false

// The ONE valid use of ==
console.log("\n--- Valid Use of == ---");

function checkValue(value) {
  // Only valid use: checking null/undefined together
  if (value == null) {
    console.log("Value is null or undefined");
    return;
  }
  console.log("Value exists:", value);
}

checkValue(null); // Catches null
checkValue(undefined); // Catches undefined
checkValue(0); // Doesn't catch 0

// NaN comparison
console.log("\n--- NaN Comparison ---");
console.log("NaN === NaN:", NaN === NaN); // false
console.log("NaN == NaN:", NaN == NaN); // false
console.log("Number.isNaN(NaN):", Number.isNaN(NaN)); // true ✅
console.log("Object.is(NaN, NaN):", Object.is(NaN, NaN)); // true ✅

/* ============================================
   7. OBJECT.IS() - Better Equality
   ============================================ */

console.log("\n\n=== 7. OBJECT.IS() - Better Equality ===\n");

// Differences from ===
console.log("--- NaN Comparison ---");
console.log("NaN === NaN:", NaN === NaN); // false
console.log("Object.is(NaN, NaN):", Object.is(NaN, NaN)); // true ✅

console.log("\n--- +0 vs -0 ---");
console.log("+0 === -0:", +0 === -0); // true
console.log("Object.is(+0, -0):", Object.is(+0, -0)); // false ✅

console.log("\n--- Other Cases (Same as ===) ---");
console.log("Object.is(5, 5):", Object.is(5, 5)); // true
console.log('Object.is(5, "5"):', Object.is(5, "5")); // false
console.log("Object.is({}, {}):", Object.is({}, {})); // false

/* ============================================
   8. PRACTICAL INTERVIEW QUESTIONS
   ============================================ */

console.log("\n\n=== 8. PRACTICAL INTERVIEW QUESTIONS ===\n");

// Q1: Deep comparison function
console.log("--- Q1: Deep Object Comparison ---");

function deepEqual(obj1, obj2) {
  // Same reference
  if (obj1 === obj2) return true;

  // Not both objects
  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  ) {
    return false;
  }

  // Different number of keys
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;

  // Compare each key recursively
  for (let key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

console.log("deepEqual({a:1}, {a:1}):", deepEqual({ a: 1 }, { a: 1 })); // true
console.log("deepEqual({a:1}, {a:2}):", deepEqual({ a: 1 }, { a: 2 })); // false
console.log(
  "deepEqual({a:{b:1}}, {a:{b:1}}):",
  deepEqual({ a: { b: 1 } }, { a: { b: 1 } })
); // true

// Q2: Clone object deeply
console.log("\n--- Q2: Deep Clone ---");

function deepClone(obj) {
  // Handle primitives and null
  if (obj === null || typeof obj !== "object") return obj;

  // Handle Date
  if (obj instanceof Date) return new Date(obj);

  // Handle Array
  if (Array.isArray(obj)) return obj.map((item) => deepClone(item));

  // Handle Object
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

const original2 = { a: 1, b: { c: 2 } };
const cloned = deepClone(original2);
cloned.b.c = 999;
console.log("Original:", original2.b.c); // 2 (unchanged)
console.log("Cloned:", cloned.b.c); // 999

// Q3: Type checking utility
console.log("\n--- Q3: Type Checking Utility ---");

function getTypeOf(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (value instanceof Date) return "date";
  if (value instanceof RegExp) return "regexp";
  return typeof value;
}

console.log("getTypeOf(null):", getTypeOf(null)); // "null"
console.log("getTypeOf([]):", getTypeOf([])); // "array"
console.log("getTypeOf(new Date()):", getTypeOf(new Date())); // "date"
console.log("getTypeOf(/test/):", getTypeOf(/test/)); // "regexp"
console.log("getTypeOf({}):", getTypeOf({})); // "object"

// Q4: Safe type conversion
console.log("\n--- Q4: Safe Type Conversion ---");

function toNumber(value) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }
  if (typeof value === "boolean") return value ? 1 : 0;
  return 0;
}

console.log('toNumber("42"):', toNumber("42")); // 42
console.log('toNumber("abc"):', toNumber("abc")); // 0
console.log("toNumber(true):", toNumber(true)); // 1
console.log("toNumber(null):", toNumber(null)); // 0

/* ============================================
   9. COMMON PITFALLS & SOLUTIONS
   ============================================ */

console.log("\n\n=== 9. COMMON PITFALLS ===\n");

// Pitfall 1: Mutating function arguments
console.log("--- Pitfall 1: Mutating Arguments ---");

function badUpdate(obj) {
  obj.updated = true; // Mutates original!
  return obj;
}

function goodUpdate(obj) {
  return { ...obj, updated: true }; // Returns new object
}

const data = { value: 42 };
const updated1 = badUpdate(data);
console.log("After badUpdate, original:", data); // { value: 42, updated: true }

const data2 = { value: 42 };
const updated2 = goodUpdate(data2);
console.log("After goodUpdate, original:", data2); // { value: 42 }

// Pitfall 2: Comparing objects
console.log("\n--- Pitfall 2: Comparing Objects ---");

const arr3 = [1, 2, 3];
const arr4 = [1, 2, 3];
console.log("arr3 === arr4:", arr3 === arr4); // false!

// Need deep comparison
console.log("JSON.stringify:", JSON.stringify(arr3) === JSON.stringify(arr4)); // true

// Pitfall 3: Truthy check on 0
console.log("\n--- Pitfall 3: Truthy Check on 0 ---");

function getCount(count) {
  // Bad: 0 is falsy
  return count || "No items";
}
console.log("getCount(0):", getCount(0)); // "No items" ❌

function getCountGood(count) {
  // Good: Check for undefined
  return count !== undefined ? count : "No items";
}
console.log("getCountGood(0):", getCountGood(0)); // 0 ✅

console.log("\n=== All examples completed successfully! ===\n");

/* ============================================
   QUICK REFERENCE
   ============================================ */

console.log("=== QUICK REFERENCE ===\n");

console.log(`
KEY TAKEAWAYS:

1. Primitives vs References
   ✅ Primitives: string, number, boolean, null, undefined, symbol, bigint
   ✅ References: object, array, function (all objects)
   ✅ Primitives copy by value, references by reference

2. typeof Quirks
   ✅ typeof null === "object" (historical bug)
   ✅ typeof [] === "object" (use Array.isArray)
   ✅ typeof NaN === "number"

3. null vs undefined
   ✅ undefined = not assigned
   ✅ null = intentionally empty
   ✅ Use == to check both: value == null

4. Type Coercion
   ✅ Prefer explicit: String(), Number(), Boolean()
   ✅ + coerces to string if one operand is string
   ✅ -, *, /, % coerce to number

5. Falsy Values (8 total)
   ✅ false, 0, -0, 0n, "", null, undefined, NaN
   ✅ Everything else is truthy (including [], {})

6. Equality
   ✅ Always use === (strict)
   ✅ Only use == for null/undefined check
   ✅ Objects compared by reference

7. Best Practices
   ✅ Use const for immutability intent
   ✅ Clone objects instead of mutating
   ✅ Use ?? for default values (not ||)
   ✅ Explicit type conversion over implicit
`);
