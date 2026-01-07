// JavaScript Variables & Hoisting - Practical Examples
// Run in browser console or Node.js

console.log("=== JAVASCRIPT VARIABLES & HOISTING ===\n");

/* ============================================
   1. VAR, LET, CONST - Complete Comparison
   ============================================ */

console.log("=== 1. VAR, LET, CONST - Complete Comparison ===\n");

// var - Function scoped, can redeclare, hoisted to undefined
console.log("--- var Behavior ---");
var varVariable = "initial";
var varVariable = "redeclared"; // ✅ Allowed (bad!)
console.log("var redeclared:", varVariable);

varVariable = "reassigned"; // ✅ Allowed
console.log("var reassigned:", varVariable);

// let - Block scoped, cannot redeclare, hoisted with TDZ
console.log("\n--- let Behavior ---");
let letVariable = "initial";
// let letVariable = "redeclared"; // ❌ SyntaxError!
console.log("let declared:", letVariable);

letVariable = "reassigned"; // ✅ Allowed
console.log("let reassigned:", letVariable);

// const - Block scoped, cannot redeclare or reassign
console.log("\n--- const Behavior ---");
const constVariable = "initial";
// const constVariable = "redeclared"; // ❌ SyntaxError!
// constVariable = "reassigned"; // ❌ TypeError!
console.log("const declared:", constVariable);

// const with objects - CAN mutate properties
console.log("\n--- const with Objects ---");
const obj = { value: 1 };
console.log("Initial object:", obj);

obj.value = 2; // ✅ Allowed! Mutating property
obj.newProp = 3; // ✅ Allowed! Adding property
console.log("After mutation:", obj);

// obj = { value: 4 }; // ❌ TypeError! Cannot reassign

const arr = [1, 2, 3];
console.log("\nInitial array:", arr);

arr.push(4); // ✅ Allowed! Mutating array
arr[0] = 99; // ✅ Allowed! Changing element
console.log("After mutation:", arr);

// arr = [5, 6]; // ❌ TypeError! Cannot reassign

/* ============================================
   2. SCOPE - Function vs Block
   ============================================ */

console.log("\n\n=== 2. SCOPE - Function vs Block ===\n");

// Function scope with var
console.log("--- Function Scope (var) ---");
function testVarScope() {
  var x = 1;
  console.log("Before if - x:", x);

  if (true) {
    var x = 2; // Same variable!
    var y = 3; // Function scoped
    console.log("Inside if - x:", x);
    console.log("Inside if - y:", y);
  }

  console.log("After if - x:", x); // 2 (changed!)
  console.log("After if - y:", y); // 3 (accessible!)
}
testVarScope();

// Block scope with let
console.log("\n--- Block Scope (let) ---");
function testLetScope() {
  let x = 1;
  console.log("Before if - x:", x);

  if (true) {
    let x = 2; // Different variable!
    let y = 3; // Block scoped
    console.log("Inside if - x:", x);
    console.log("Inside if - y:", y);
  }

  console.log("After if - x:", x); // 1 (unchanged!)
  // console.log("After if - y:", y); // ❌ ReferenceError!
}
testLetScope();

// Loop scope demonstration
console.log("\n--- Loop Scope ---");

// var leaks out of loop
for (var i = 0; i < 3; i++) {
  // i is function scoped
}
console.log("var i after loop:", i); // 3 (accessible!)

// let is block scoped
for (let j = 0; j < 3; j++) {
  // j is block scoped
}
// console.log("let j after loop:", j); // ❌ ReferenceError!

// Classic var loop problem
console.log("\n--- Classic var Loop Problem ---");
console.log("With var:");
for (var k = 0; k < 3; k++) {
  setTimeout(() => console.log("var k:", k), 10);
}
// Prints: 3, 3, 3 (all reference same k)

setTimeout(() => {
  console.log("\nWith let:");
  for (let k = 0; k < 3; k++) {
    setTimeout(() => console.log("let k:", k), 10);
  }
  // Prints: 0, 1, 2 (each has own k)
}, 50);

// Scope chain
console.log("\n--- Scope Chain ---");
const global = "global";

function outer() {
  const outerVar = "outer";

  function middle() {
    const middleVar = "middle";

    function inner() {
      const innerVar = "inner";
      console.log("Access from inner:");
      console.log("  global:", global);
      console.log("  outerVar:", outerVar);
      console.log("  middleVar:", middleVar);
      console.log("  innerVar:", innerVar);
    }

    inner();
  }

  middle();
}
outer();

/* ============================================
   3. HOISTING - The Mechanism
   ============================================ */

console.log("\n\n=== 3. HOISTING - The Mechanism ===\n");

// var hoisting
console.log("--- var Hoisting ---");
console.log("Accessing before declaration:", varHoisted); // undefined
var varHoisted = "I'm hoisted";
console.log("After declaration:", varHoisted);

// How JavaScript sees it:
// var varHoisted;              // Declaration hoisted
// console.log(varHoisted);     // undefined
// varHoisted = "I'm hoisted";  // Assignment stays

// let/const hoisting with TDZ
console.log("\n--- let/const Hoisting (TDZ) ---");
// console.log(letHoisted); // ❌ ReferenceError: Cannot access before initialization
let letHoisted = "I'm hoisted but in TDZ";
console.log("After declaration:", letHoisted);

// Function hoisting
console.log("\n--- Function Hoisting ---");

// Function declaration - fully hoisted
greet(); // ✅ Works!
function greet() {
  console.log("Function declaration hoisted!");
}

// Function expression - NOT fully hoisted
try {
  sayHi(); // ❌ TypeError
} catch (e) {
  console.log("Function expression error:", e.message);
}
var sayHi = function () {
  console.log("Hi!");
};
sayHi(); // ✅ Now works

// Arrow function - follows variable hoisting
// bye(); // ❌ TypeError
const bye = () => console.log("Bye!");
bye(); // ✅ Works

// Hoisting order demonstration
console.log("\n--- Hoisting Order ---");
console.log("What is foo?", typeof foo); // "function" (function hoisted first)

var foo = "variable";
function foo() {
  return "function";
}

console.log("After declarations:", foo); // "variable" (assignment overwrites)

// Complex hoisting example
console.log("\n--- Complex Hoisting ---");
var name = "Global";

function test() {
  console.log("name at start:", name); // undefined (not "Global"!)
  var name = "Local";
  console.log("name at end:", name); // "Local"
}
test();

// Why? Hoisting creates:
// function test() {
//   var name;                // Hoisted, shadows global
//   console.log(name);       // undefined
//   name = "Local";
//   console.log(name);       // "Local"
// }

/* ============================================
   4. TEMPORAL DEAD ZONE (TDZ)
   ============================================ */

console.log("\n\n=== 4. TEMPORAL DEAD ZONE (TDZ) ===\n");

// TDZ visualization
console.log("--- TDZ Visualization ---");
{
  // TDZ starts here for x ⚠️
  // console.log(x); // ❌ ReferenceError
  // Still in TDZ ⚠️

  let x = 5; // TDZ ends here ✅
  console.log("After initialization:", x); // ✅ 5
}

// TDZ with different declarations
console.log("\n--- TDZ with Different Declarations ---");

function tdzDemo() {
  // var - no TDZ
  console.log("var before declaration:", a); // undefined
  var a = 1;

  // let - has TDZ
  // console.log("let before declaration:", b); // ❌ ReferenceError
  let b = 2;
  console.log("let after declaration:", b);

  // const - has TDZ
  // console.log("const before declaration:", c); // ❌ ReferenceError
  const c = 3;
  console.log("const after declaration:", c);
}
tdzDemo();

// TDZ in function parameters
console.log("\n--- TDZ in Function Parameters ---");

// Error: b in TDZ when evaluating a
// function badParams(a = b, b = 2) {
//   return a + b; // ❌ ReferenceError
// }

// Correct order
function goodParams(b = 2, a = b) {
  return a + b;
}
console.log("Good params result:", goodParams()); // 4

// TDZ with typeof
console.log("\n--- TDZ with typeof ---");

// var behavior
console.log("typeof undeclaredVar:", typeof undeclaredVar); // "undefined"

// let/const behavior
// console.log("typeof y:", typeof y); // ❌ ReferenceError (in TDZ)
let y = 5;
console.log("typeof y after declaration:", typeof y); // "number"

// TDZ scope gotcha
console.log("\n--- TDZ Scope Gotcha ---");
let outer = 1;

function tdzScopeGotcha() {
  // console.log(outer); // ❌ ReferenceError!
  // Even though outer exists in parent scope,
  // the let declaration below creates TDZ
  let outer = 2;
  console.log("Inner outer:", outer);
}
tdzScopeGotcha();

// Common TDZ mistake
console.log("\n--- Common TDZ Mistake ---");
try {
  let z = z + 1; // ❌ ReferenceError (z in TDZ on right side)
} catch (e) {
  console.log("TDZ error:", e.message);
}

// Correct way
let z = 1;
z = z + 1;
console.log("Correct way:", z);

/* ============================================
   5. VARIABLE SHADOWING
   ============================================ */

console.log("\n\n=== 5. VARIABLE SHADOWING ===\n");

// Block scope shadowing
console.log("--- Block Scope Shadowing ---");
let x1 = 1;
console.log("Outer x1:", x1);

{
  let x1 = 2; // Shadows outer x1
  console.log("Inner block x1:", x1);

  {
    let x1 = 3; // Shadows middle x1
    console.log("Innermost x1:", x1);
  }

  console.log("Back to middle x1:", x1);
}

console.log("Back to outer x1:", x1);

// Function parameter shadowing
console.log("\n--- Parameter Shadowing ---");

function shadowParam(value) {
  console.log("Parameter value:", value);

  // Can shadow with var
  var value = "shadowed";
  console.log("Shadowed value:", value);
}
shadowParam("original");

// Illegal shadowing
console.log("\n--- Illegal Shadowing ---");

function illegalShadow1() {
  let a = 1;
  // var a = 2; // ❌ SyntaxError! Can't shadow let with var in same function
}

function illegalShadow2() {
  let b = 1;
  {
    // var b = 2; // ❌ SyntaxError! var is function scoped
  }
}

function legalShadow() {
  let c = 1;
  {
    let c = 2; // ✅ Legal! Different block scope
    console.log("Inner c:", c);
  }
  console.log("Outer c:", c);
}
legalShadow();

// Practical shadowing
console.log("\n--- Practical Shadowing ---");

const config = { mode: "prod" };

function process(data) {
  // Shadow with local config
  const config = { mode: "dev", debug: true };
  console.log("Local config:", config);
  return data * 2;
}

console.log("Global config:", config);
process(5);
console.log("Global config unchanged:", config);

/* ============================================
   6. GLOBAL SCOPE & GLOBAL OBJECT
   ============================================ */

console.log("\n\n=== 6. GLOBAL SCOPE & GLOBAL OBJECT ===\n");

// var creates global property
console.log("--- var on Global Object ---");
var globalVar = "I'm on window/global";

// In browser: console.log(window.globalVar);
// In Node: console.log(global.globalVar);
console.log("globalVar exists:", typeof globalThis.globalVar !== "undefined");

// let/const don't create global property
let globalLet = "Not on window/global";
const globalConst = "Also not on window/global";

console.log(
  "globalLet on globalThis:",
  typeof globalThis.globalLet !== "undefined"
); // false
console.log(
  "globalConst on globalThis:",
  typeof globalThis.globalConst !== "undefined"
); // false

// Implicit globals (BAD!)
console.log("\n--- Implicit Globals ---");

function createImplicitGlobal() {
  // Forgot var/let/const
  implicitGlobal = "Oops, I'm global!";
}

createImplicitGlobal();
console.log("Implicit global:", implicitGlobal); // Works (bad!)

// Strict mode prevents this
console.log("\n--- Strict Mode Prevention ---");

function strictTest() {
  "use strict";
  try {
    strictGlobal = "This will fail";
  } catch (e) {
    console.log("Strict mode error:", e.message);
  }
}
strictTest();

// globalThis - universal access
console.log("\n--- globalThis ---");
console.log("globalThis exists:", typeof globalThis !== "undefined"); // true
console.log("globalThis type:", typeof globalThis); // "object"

/* ============================================
   7. BEST PRACTICES
   ============================================ */

console.log("\n\n=== 7. BEST PRACTICES ===\n");

// Rule 1: const by default
console.log("--- Rule 1: const by Default ---");
const PI = 3.14159;
const config2 = { debug: false };
const users = ["Alice", "Bob"];
console.log("Use const for values that won't be reassigned");

// Rule 2: let when reassignment needed
console.log("\n--- Rule 2: let When Needed ---");
let counter = 0;
counter++;
counter++;
console.log("Use let for counters, accumulators:", counter);

let status = "pending";
status = "complete";
console.log("Use let for state that changes:", status);

// Rule 3: Never use var
console.log("\n--- Rule 3: Never Use var ---");
console.log("Don't use var in modern JavaScript!");

// Rule 4: Declare at top of scope
console.log("\n--- Rule 4: Declare at Top ---");

function goodDeclarations() {
  // All declarations at top
  const items = [];
  let total = 0;
  let count = 0;

  // Use them below
  for (let i = 0; i < 5; i++) {
    items.push(i);
    total += i;
    count++;
  }

  console.log("Items:", items);
  console.log("Total:", total);
  console.log("Count:", count);
}
goodDeclarations();

// Rule 5: One declaration per line
console.log("\n--- Rule 5: One Per Line ---");

// ✅ GOOD
const firstName = "Alice";
const lastName = "Smith";
const age = 30;
console.log("Clear and readable");

// ❌ AVOID
const name1 = "Bob",
  name2 = "Charlie",
  name3 = "Dave";
console.log("Harder to read");

// Rule 6: Always initialize
console.log("\n--- Rule 6: Always Initialize ---");

// ✅ GOOD
let count2 = 0;
const items2 = [];
const settings = { theme: "light" };
console.log("Initialized immediately");

// ❌ AVOID (except when necessary)
// let count3;
// ... lots of code
// count3 = 0; // Easy to forget

// Rule 7: Minimize scope
console.log("\n--- Rule 7: Minimize Scope ---");

function processData() {
  // ✅ GOOD: Minimal scope
  for (let i = 0; i < 3; i++) {
    const item = i * 2;
    console.log("Scoped item:", item);
  }
  // i and item don't exist here

  // ❌ AVOID: Wide scope
  // let i;
  // let item;
  // for (i = 0; i < 3; i++) {
  //   item = i * 2;
  //   console.log(item);
  // }
  // i and item still exist here
}
processData();

/* ============================================
   8. INTERVIEW CODING CHALLENGES
   ============================================ */

console.log("\n\n=== 8. INTERVIEW CODING CHALLENGES ===\n");

// Challenge 1: Fix the var loop problem
console.log("--- Challenge 1: Fix var Loop ---");

// Problem
function createFunctionsVar() {
  const funcs = [];
  for (var i = 0; i < 3; i++) {
    funcs.push(function () {
      return i;
    });
  }
  return funcs;
}

const badFuncs = createFunctionsVar();
console.log("Problem - all return 3:");
console.log(badFuncs[0]()); // 3
console.log(badFuncs[1]()); // 3
console.log(badFuncs[2]()); // 3

// Solution 1: Use let
function createFunctionsLet() {
  const funcs = [];
  for (let i = 0; i < 3; i++) {
    funcs.push(function () {
      return i;
    });
  }
  return funcs;
}

const goodFuncs = createFunctionsLet();
console.log("\nSolution 1 (let) - returns 0, 1, 2:");
console.log(goodFuncs[0]()); // 0
console.log(goodFuncs[1]()); // 1
console.log(goodFuncs[2]()); // 2

// Solution 2: IIFE (old way)
function createFunctionsIIFE() {
  const funcs = [];
  for (var i = 0; i < 3; i++) {
    funcs.push(
      (function (i) {
        return function () {
          return i;
        };
      })(i)
    );
  }
  return funcs;
}

const iifeFuncs = createFunctionsIIFE();
console.log("\nSolution 2 (IIFE) - returns 0, 1, 2:");
console.log(iifeFuncs[0]()); // 0
console.log(iifeFuncs[1]()); // 1
console.log(iifeFuncs[2]()); // 2

// Challenge 2: Predict the output
console.log("\n--- Challenge 2: Predict Output ---");

function challenge2() {
  console.log(typeof a); // ?
  var a = 10;
  console.log(typeof a); // ?
}
console.log("Output:");
challenge2();
// Prints: undefined, number

// Challenge 3: TDZ gotcha
console.log("\n--- Challenge 3: TDZ Gotcha ---");

let value = 1;

function challenge3() {
  // console.log(value); // ❌ What happens?
  let value = 2;
  console.log(value);
}

console.log("Explanation: Inner let creates TDZ, shadows outer");
challenge3();

// Challenge 4: Closure with var vs let
console.log("\n--- Challenge 4: Closure Differences ---");

function makeCounterVar() {
  var count = 0;
  return {
    increment: function () {
      count++;
    },
    get: function () {
      return count;
    },
  };
}

const counterVar = makeCounterVar();
counterVar.increment();
counterVar.increment();
console.log("Counter with var:", counterVar.get()); // 2

function makeCounterLet() {
  let count = 0;
  return {
    increment: function () {
      count++;
    },
    get: function () {
      return count;
    },
  };
}

const counterLet = makeCounterLet();
counterLet.increment();
counterLet.increment();
console.log("Counter with let:", counterLet.get()); // 2

console.log("Both work the same for closures!");

// Challenge 5: Implement block scope with var (old technique)
console.log("\n--- Challenge 5: Simulate Block Scope ---");

// Old way: IIFE for block scope
(function () {
  var privateVar = "hidden";
  console.log("Inside IIFE:", privateVar);
})();

// console.log(privateVar); // ❌ ReferenceError

// Modern way: just use let/const in block
{
  const privateConst = "hidden";
  console.log("Inside block:", privateConst);
}

// console.log(privateConst); // ❌ ReferenceError

/* ============================================
   9. PRACTICAL PATTERNS
   ============================================ */

console.log("\n\n=== 9. PRACTICAL PATTERNS ===\n");

// Pattern 1: Module pattern with closure
console.log("--- Pattern 1: Module Pattern ---");

const calculator = (function () {
  // Private variables
  let result = 0;

  // Private function
  function validate(num) {
    return typeof num === "number";
  }

  // Public API
  return {
    add: function (num) {
      if (validate(num)) result += num;
      return this;
    },
    subtract: function (num) {
      if (validate(num)) result -= num;
      return this;
    },
    getResult: function () {
      return result;
    },
    reset: function () {
      result = 0;
      return this;
    },
  };
})();

calculator.add(5).add(3).subtract(2);
console.log("Calculator result:", calculator.getResult()); // 6

// Pattern 2: Singleton pattern
console.log("\n--- Pattern 2: Singleton ---");

const Singleton = (function () {
  let instance;

  function createInstance() {
    const object = {
      value: Math.random(),
      getData: function () {
        return this.value;
      },
    };
    return object;
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

const singleton1 = Singleton.getInstance();
const singleton2 = Singleton.getInstance();
console.log("Same instance?", singleton1 === singleton2); // true
console.log("Value:", singleton1.getData());

// Pattern 3: Private variables with const
console.log("\n--- Pattern 3: Private Variables ---");

function createUser(name, email) {
  // Private variable (const can't be reassigned)
  const userId = Math.random().toString(36).substr(2, 9);

  // Public interface
  return {
    getName: () => name,
    getEmail: () => email,
    getUserId: () => userId,
    // Can't modify userId from outside
  };
}

const user = createUser("Alice", "alice@example.com");
console.log("User ID:", user.getUserId());
console.log("User name:", user.getName());
// console.log(userId); // ❌ Not accessible

console.log("\n=== All examples completed successfully! ===\n");

/* ============================================
   QUICK REFERENCE
   ============================================ */

console.log("=== QUICK REFERENCE ===\n");

console.log(`
KEY TAKEAWAYS:

1. var, let, const
   ✅ var: function-scoped, hoisted to undefined, avoid!
   ✅ let: block-scoped, hoisted with TDZ, for reassignment
   ✅ const: block-scoped, hoisted with TDZ, no reassignment

2. Hoisting
   ✅ Declarations moved to top of scope
   ✅ var initialized to undefined
   ✅ let/const in TDZ until declaration
   ✅ Functions fully hoisted

3. Temporal Dead Zone
   ✅ Period between scope entry and initialization
   ✅ Applies to let, const, class
   ✅ Accessing in TDZ throws ReferenceError

4. Scope
   ✅ var: function scope
   ✅ let/const: block scope
   ✅ Block = anything between {}

5. Best Practices
   ✅ Use const by default
   ✅ Use let when reassignment needed
   ✅ Never use var
   ✅ Declare at top of scope
   ✅ One declaration per line
   ✅ Always use strict mode

6. Common Patterns
   ✅ Module pattern with IIFE
   ✅ Private variables with closures
   ✅ const for immutability intent
   ✅ let for loop counters
`);
