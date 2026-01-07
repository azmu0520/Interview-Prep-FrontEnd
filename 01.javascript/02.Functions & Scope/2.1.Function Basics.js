// ============================================
// 2.1 FUNCTION BASICS - PRACTICAL EXAMPLES
// JavaScript Interview Preparation
// Run in browser console or Node.js
// ============================================

console.log("=== 2.1 FUNCTION BASICS - PRACTICAL EXAMPLES ===\n");

/* ============================================
   1. FUNCTION DECLARATIONS vs EXPRESSIONS
   ============================================ */

console.log("=== 1. FUNCTION DECLARATIONS vs EXPRESSIONS ===\n");

// Function Declaration
console.log("--- Function Declaration ---");

function greetDeclaration(name) {
  return `Hello, ${name}!`;
}

console.log(greetDeclaration("Alice")); // Hello, Alice!

// Function Expression
console.log("\n--- Function Expression ---");

const greetExpression = function (name) {
  return `Hello, ${name}!`;
};

console.log(greetExpression("Bob")); // Hello, Bob!

// Named Function Expression
console.log("\n--- Named Function Expression ---");

const factorial = function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1); // Can call itself by name 'fact'
};

console.log("factorial(5):", factorial(5)); // 120

// 'fact' is only available inside the function
try {
  fact(5);
} catch (error) {
  console.log("Cannot call 'fact' outside:", error.message);
}

// Hoisting Behavior
console.log("\n--- Hoisting Behavior ---");

// ✅ Declaration - Can call before definition
console.log("Calling hoisted declaration:", hoistedFunc()); // Works!

function hoistedFunc() {
  return "I'm hoisted!";
}

// ❌ Expression - Cannot call before definition
try {
  notHoistedFunc();
} catch (error) {
  console.log("Expression not hoisted:", error.message);
}

const notHoistedFunc = function () {
  return "I'm not hoisted!";
};

console.log("Now it works:", notHoistedFunc());

// Hoisting with var vs const/let
console.log("\n--- Hoisting with var vs const/let ---");

console.log("typeof varFunc:", typeof varFunc); // undefined (var hoisted)

try {
  constFunc(); // ReferenceError (TDZ)
} catch (error) {
  console.log("const in TDZ:", error.message);
}

var varFunc = function () {
  return "var function";
};

const constFunc = function () {
  return "const function";
};

// Interview Question: What's the output?
console.log("\n--- Interview Question: Hoisting ---");

console.log("typeof foo:", typeof foo); // "function"
console.log("typeof bar:", typeof bar); // "undefined"

function foo() {
  return "foo";
}

var bar = function () {
  return "bar";
};

// Conditional Function Creation
console.log("\n--- Conditional Function Creation ---");

const shouldUseAdvanced = true;

// ✅ Works with expressions
const processData = shouldUseAdvanced
  ? function (data) {
      return data.toUpperCase();
    }
  : function (data) {
      return data.toLowerCase();
    };

console.log('processData("Hello"):', processData("Hello"));

// ❌ Cannot do this with declarations
// function conditionalFunc() {} // Always defined regardless of condition

/* ============================================
   2. ARROW FUNCTIONS
   ============================================ */

console.log("\n\n=== 2. ARROW FUNCTIONS ===\n");

// Syntax Variations
console.log("--- Syntax Variations ---");

// Traditional function
const traditionalAdd = function (a, b) {
  return a + b;
};

// Arrow with block
const arrowAddBlock = (a, b) => {
  return a + b;
};

// Arrow with implicit return
const arrowAddImplicit = (a, b) => a + b;

// Single parameter - no parentheses
const square = (x) => x * x;

// No parameters - empty parentheses
const getRandom = () => Math.random();

// Returning object - wrap in parentheses
const makePerson = (name) => ({ name, age: 30 });

console.log("traditionalAdd(5, 3):", traditionalAdd(5, 3));
console.log("arrowAddImplicit(5, 3):", arrowAddImplicit(5, 3));
console.log("square(5):", square(5));
console.log("getRandom():", getRandom());
console.log('makePerson("Alice"):', makePerson("Alice"));

// THIS Binding - Most Important Difference!
console.log("\n--- THIS Binding (Critical!) ---");

// Regular function - 'this' depends on HOW it's called
const personRegular = {
  name: "Alice",
  friends: ["Bob", "Charlie"],

  printFriends: function () {
    console.log("\nRegular function:");

    // 'this' here is personRegular
    console.log(this.name + "'s friends:");

    // Regular function loses 'this'
    this.friends.forEach(function (friend) {
      console.log(this.name + " knows " + friend); // undefined knows Bob
    });
  },
};

personRegular.printFriends();

// Arrow function - 'this' from parent scope
const personArrow = {
  name: "Alice",
  friends: ["Bob", "Charlie"],

  printFriends: function () {
    console.log("\nArrow function:");

    // 'this' here is personArrow
    console.log(this.name + "'s friends:");

    // Arrow function preserves 'this'
    this.friends.forEach((friend) => {
      console.log(this.name + " knows " + friend); // Alice knows Bob ✅
    });
  },
};

personArrow.printFriends();

// ❌ WRONG: Arrow as object method
console.log("\n--- ❌ Arrow as Object Method ---");

const wrongObj = {
  name: "Alice",

  // ❌ Arrow function as method
  greetWrong: () => {
    console.log("Arrow method, this.name:", this.name); // undefined
  },

  // ✅ Regular function as method
  greetCorrect: function () {
    console.log("Regular method, this.name:", this.name); // Alice
  },

  // ✅ Method shorthand (preferred)
  greetBest() {
    console.log("Method shorthand, this.name:", this.name); // Alice
  },
};

wrongObj.greetWrong();
wrongObj.greetCorrect();
wrongObj.greetBest();

// setTimeout Example
console.log("\n--- setTimeout Example ---");

const counter = {
  count: 0,

  incrementRegular: function () {
    setTimeout(function () {
      this.count++; // 'this' is window/undefined
      console.log("Regular setTimeout, count:", this.count); // NaN or undefined
    }, 100);
  },

  incrementArrow: function () {
    setTimeout(() => {
      this.count++; // 'this' is counter object
      console.log("Arrow setTimeout, count:", this.count); // 1
    }, 100);
  },
};

counter.incrementRegular();
setTimeout(() => counter.incrementArrow(), 200);

// No arguments Object
console.log("\n--- No 'arguments' Object ---");

function regularWithArgs() {
  console.log("Regular function arguments:", arguments);
  console.log("arguments[0]:", arguments[0]);
}

regularWithArgs(1, 2, 3);

const arrowWithArgs = (...args) => {
  console.log("Arrow function rest params:", args);
  console.log("args[0]:", args[0]);

  // Cannot access 'arguments'
  try {
    console.log(arguments);
  } catch (error) {
    console.log("Arrow has no 'arguments':", error.message);
  }
};

arrowWithArgs(1, 2, 3);

// Cannot be Constructor
console.log("\n--- Cannot be Constructor ---");

function RegularConstructor(name) {
  this.name = name;
}

const ArrowConstructor = (name) => {
  this.name = name;
};

const regularInstance = new RegularConstructor("Alice");
console.log("Regular constructor works:", regularInstance.name);

try {
  const arrowInstance = new ArrowConstructor("Bob");
} catch (error) {
  console.log("Arrow constructor fails:", error.message);
}

// No prototype Property
console.log("\n--- No 'prototype' Property ---");

function regularFunc() {}
const arrowFunc = () => {};

console.log("Regular function prototype:", typeof regularFunc.prototype); // object
console.log("Arrow function prototype:", typeof arrowFunc.prototype); // undefined

/* ============================================
   3. FUNCTION PARAMETERS
   ============================================ */

console.log("\n\n=== 3. FUNCTION PARAMETERS ===\n");

// 3.1 Default Parameters
console.log("--- Default Parameters ---");

function greetWithDefault(name = "Guest", greeting = "Hello") {
  return `${greeting}, ${name}!`;
}

console.log("greetWithDefault():", greetWithDefault());
console.log('greetWithDefault("Alice"):', greetWithDefault("Alice"));
console.log('greetWithDefault("Bob", "Hi"):', greetWithDefault("Bob", "Hi"));

// Defaults only for undefined
console.log("\n--- Defaults Only for Undefined ---");

function testDefaults(a = 10) {
  console.log("Value:", a);
}

testDefaults(); // 10 (undefined → default)
testDefaults(undefined); // 10 (undefined → default)
testDefaults(null); // null (null !== undefined)
testDefaults(0); // 0 (0 !== undefined)
testDefaults(""); // "" (empty string !== undefined)
testDefaults(false); // false (false !== undefined)

// Defaults Evaluated at Call Time
console.log("\n--- Defaults Evaluated at Call Time ---");

let callCount = 0;

function getDefault() {
  callCount++;
  return `Default ${callCount}`;
}

function test(value = getDefault()) {
  return value;
}

console.log("First call:", test()); // "Default 1"
console.log("Second call:", test()); // "Default 2"
console.log("With value:", test("Custom")); // "Custom" (default not called)

// Can Reference Earlier Parameters
console.log("\n--- Reference Earlier Parameters ---");

function makeFullName(first, last = first) {
  return `${first} ${last}`;
}

console.log('makeFullName("Alice"):', makeFullName("Alice")); // "Alice Alice"
console.log('makeFullName("Bob", "Smith"):', makeFullName("Bob", "Smith"));

function greetWithTime(
  name,
  message = `Hello, ${name}!`,
  time = new Date().getHours()
) {
  return `${message} (Hour: ${time})`;
}

console.log('greetWithTime("Alice"):', greetWithTime("Alice"));

// Old Way vs New Way
console.log("\n--- Old Way vs New Way ---");

// ❌ OLD: Using || (wrong for 0, false, "")
function setVolumeBad(level) {
  level = level || 50; // 0 becomes 50!
  return level;
}

// ✅ NEW: Using default parameters
function setVolumeGood(level = 50) {
  return level;
}

console.log("setVolumeBad(0):", setVolumeBad(0)); // 50 ❌
console.log("setVolumeBad(25):", setVolumeBad(25)); // 25 ✅
console.log("setVolumeGood(0):", setVolumeGood(0)); // 0 ✅
console.log("setVolumeGood():", setVolumeGood()); // 50 ✅

// 3.2 Rest Parameters
console.log("\n--- Rest Parameters ---");

function sum(...numbers) {
  console.log("Rest parameter is array:", Array.isArray(numbers));
  return numbers.reduce((total, n) => total + n, 0);
}

console.log("sum(1, 2, 3):", sum(1, 2, 3));
console.log("sum(1, 2, 3, 4, 5):", sum(1, 2, 3, 4, 5));

// Rest with Named Parameters
console.log("\n--- Rest with Named Parameters ---");

function logMessage(level, timestamp, ...messages) {
  console.log(`[${level}] ${timestamp}:`);
  messages.forEach((msg) => console.log(`  ${msg}`));
}

logMessage("ERROR", "2024-01-01", "Server crashed", "Restarting...", "Done");

// Rest Parameter Rules
console.log("\n--- Rest Parameter Rules ---");

// ✅ Correct: Rest is last
function correct1(...args) {
  return args;
}

function correct2(first, ...rest) {
  console.log("First:", first);
  console.log("Rest:", rest);
}

correct2(1, 2, 3, 4);

// ❌ Would error: Rest must be last
// function wrong(...args, last) {} // SyntaxError

// ❌ Would error: Only one rest parameter
// function wrong(...a, ...b) {} // SyntaxError

// 3.3 Arguments Object (Legacy)
console.log("\n--- Arguments Object (Legacy) ---");

function usingArguments() {
  console.log("arguments:", arguments);
  console.log("arguments.length:", arguments.length);
  console.log("arguments[0]:", arguments[0]);
  console.log("Is array?", Array.isArray(arguments)); // false (array-like)

  // Convert to array
  const argsArray = Array.from(arguments);
  console.log("Converted to array:", argsArray);
  console.log("Is array now?", Array.isArray(argsArray)); // true
}

usingArguments(1, 2, 3, 4);

// Rest vs Arguments Comparison
console.log("\n--- Rest vs Arguments Comparison ---");

function sumWithArguments() {
  // ❌ Must convert to array first
  const args = Array.from(arguments);
  return args.reduce((a, b) => a + b, 0);
}

function sumWithRest(...numbers) {
  // ✅ Already an array
  return numbers.reduce((a, b) => a + b, 0);
}

console.log("sumWithArguments(1, 2, 3):", sumWithArguments(1, 2, 3));
console.log("sumWithRest(1, 2, 3):", sumWithRest(1, 2, 3));

// Arguments Not in Arrow Functions
console.log("\n--- Arguments Not in Arrow Functions ---");

const arrowFunc2 = () => {
  try {
    console.log(arguments);
  } catch (error) {
    console.log("Arrow function error:", error.message);
  }
};

arrowFunc2(1, 2, 3);

// 3.4 Parameter Destructuring
console.log("\n--- Parameter Destructuring ---");

// Object Destructuring
function displayUser({ name, age, city }) {
  return `${name}, ${age} years old, from ${city}`;
}

console.log(displayUser({ name: "Alice", age: 30, city: "NYC" }));

// With Defaults
function displayUserWithDefaults({
  name = "Guest",
  age = 0,
  city = "Unknown",
} = {}) {
  return `${name}, ${age} years old, from ${city}`;
}

console.log(displayUserWithDefaults({ name: "Alice", age: 30 })); // city defaults
console.log(displayUserWithDefaults({ name: "Bob" })); // age and city default
console.log(displayUserWithDefaults()); // all default

// Array Destructuring
function printCoords([x, y, z = 0]) {
  return `X: ${x}, Y: ${y}, Z: ${z}`;
}

console.log("printCoords([10, 20]):", printCoords([10, 20])); // Z defaults to 0
console.log("printCoords([10, 20, 30]):", printCoords([10, 20, 30]));

// Nested Destructuring
function processOrder({
  id,
  user: { name, email },
  items: [firstItem, ...restItems],
}) {
  return {
    orderId: id,
    customerName: name,
    customerEmail: email,
    firstItem,
    remainingItems: restItems.length,
  };
}

const order = {
  id: 123,
  user: { name: "Alice", email: "alice@example.com" },
  items: ["Book", "Pen", "Notebook"],
};

console.log("processOrder result:", processOrder(order));

/* ============================================
   4. FUNCTION HOISTING
   ============================================ */

console.log("\n\n=== 4. FUNCTION HOISTING ===\n");

// Declaration Hoisting
console.log("--- Declaration Hoisting ---");

console.log("Calling before declaration:", hoistedDeclaration()); // ✅ Works!

function hoistedDeclaration() {
  return "I'm hoisted!";
}

// Expression Hoisting with var
console.log("\n--- Expression Hoisting with var ---");

console.log("typeof before assignment:", typeof hoistedExpression); // undefined

try {
  hoistedExpression(); // TypeError: not a function
} catch (error) {
  console.log("Cannot call before assignment:", error.message);
}

var hoistedExpression = function () {
  return "I'm not fully hoisted!";
};

console.log("After assignment:", hoistedExpression());

// Expression with let/const (TDZ)
console.log("\n--- Expression with let/const (TDZ) ---");

try {
  console.log(constExpression); // ReferenceError
} catch (error) {
  console.log("const in TDZ:", error.message);
}

const constExpression = function () {
  return "I'm in TDZ before this line!";
};

// Interview Question
console.log("\n--- Interview Question: Mixed Hoisting ---");

console.log("Step 1 - typeof func1:", typeof func1); // "function"
console.log("Step 2 - typeof func2:", typeof func2); // "undefined"
console.log("Step 3 - typeof func3:", typeof func3); // Would error (commented)

function func1() {
  return "func1";
}

var func2 = function () {
  return "func2";
};

// const func3 = function() {
//   return "func3";
// };

console.log("Step 4 - func1():", func1());
console.log("Step 5 - func2():", func2());

// Hoisting in Different Scopes
console.log("\n--- Hoisting in Different Scopes ---");

function outer() {
  console.log("Inside outer, calling inner:", inner()); // Works!

  function inner() {
    return "I'm hoisted within outer!";
  }
}

outer();

// try {
//   inner(); // ReferenceError - not in global scope
// } catch (error) {
//   console.log("inner not in global scope");
// }

/* ============================================
   5. PRACTICAL INTERVIEW SCENARIOS
   ============================================ */

console.log("\n\n=== 5. PRACTICAL INTERVIEW SCENARIOS ===\n");

// Scenario 1: Method with Arrow Callback
console.log("--- Scenario 1: Method with Arrow Callback ---");

const shoppingCart = {
  items: [
    { name: "Book", price: 20 },
    { name: "Pen", price: 5 },
    { name: "Notebook", price: 10 },
  ],
  discount: 0.1,

  getTotalPrice() {
    // Arrow function preserves 'this'
    const total = this.items.reduce((sum, item) => {
      return sum + item.price * (1 - this.discount);
    }, 0);
    return total.toFixed(2);
  },
};

console.log("Total price:", shoppingCart.getTotalPrice());

// Scenario 2: Function Factory
console.log("\n--- Scenario 2: Function Factory ---");

function createMultiplier(factor) {
  return function (number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
const quadruple = createMultiplier(4);

console.log("double(5):", double(5)); // 10
console.log("triple(5):", triple(5)); // 15
console.log("quadruple(5):", quadruple(5)); // 20

// With Arrow Functions
const createMultiplierArrow = (factor) => (number) => number * factor;

const times5 = createMultiplierArrow(5);
console.log("times5(3):", times5(3)); // 15

// Scenario 3: Configuration with Defaults
console.log("\n--- Scenario 3: Configuration with Defaults ---");

function createServer({
  port = 3000,
  host = "localhost",
  protocol = "http",
  cors = true,
  logging = true,
} = {}) {
  return {
    url: `${protocol}://${host}:${port}`,
    cors,
    logging,
  };
}

console.log("Default config:", createServer());
console.log("Custom config:", createServer({ port: 8080, protocol: "https" }));
console.log("Partial config:", createServer({ logging: false }));

// Scenario 4: Variadic Function
console.log("\n--- Scenario 4: Variadic Function ---");

function calculateAverage(...numbers) {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((a, b) => a + b, 0);
  return sum / numbers.length;
}

console.log("calculateAverage(10, 20, 30):", calculateAverage(10, 20, 30));
console.log("calculateAverage(5, 15):", calculateAverage(5, 15));
console.log("calculateAverage():", calculateAverage());

// Scenario 5: Event Handler Pattern
console.log("\n--- Scenario 5: Event Handler Pattern ---");

class Component {
  constructor(name) {
    this.name = name;
    this.count = 0;

    // ✅ Bind in constructor (option 1)
    this.handleClickBound = this.handleClick.bind(this);
  }

  handleClick() {
    this.count++;
    console.log(`${this.name} clicked ${this.count} times`);
  }

  // ✅ Arrow function property (option 2)
  handleClickArrow = () => {
    this.count++;
    console.log(`${this.name} arrow clicked ${this.count} times`);
  };

  setupListeners() {
    // Simulate event listener setup
    console.log("\nSimulating clicks:");

    // ❌ Wrong: loses 'this'
    const wrongHandler = this.handleClick;
    try {
      wrongHandler(); // 'this' is undefined/window
    } catch (error) {
      console.log("Wrong handler error:", error.message);
    }

    // ✅ Correct: bound handler
    this.handleClickBound();

    // ✅ Correct: arrow function
    this.handleClickArrow();

    // ✅ Correct: inline arrow
    const inlineHandler = () => this.handleClick();
    inlineHandler();
  }
}

const button = new Component("MyButton");
button.setupListeners();

/* ============================================
   6. COMMON MISTAKES
   ============================================ */

console.log("\n\n=== 6. COMMON MISTAKES ===\n");

// Mistake 1: Arrow as Method
console.log("--- Mistake 1: Arrow as Method ---");

const mistake1 = {
  value: 42,

  // ❌ WRONG
  getValueWrong: () => {
    return this.value; // undefined
  },

  // ✅ CORRECT
  getValueCorrect() {
    return this.value;
  },
};

console.log("Arrow as method:", mistake1.getValueWrong()); // undefined
console.log("Regular as method:", mistake1.getValueCorrect()); // 42

// Mistake 2: Forgetting Parentheses for Objects
console.log("\n--- Mistake 2: Object Return ---");

// ❌ WRONG - thinks it's a block, not object
const makeUser1 = (name) => {
  name: name;
};
console.log("Without parentheses:", makeUser1("Alice")); // undefined

// ✅ CORRECT - wrap object in parentheses
const makeUser2 = (name) => ({ name: name });
console.log("With parentheses:", makeUser2("Alice"));

// Mistake 3: Using || for Defaults
console.log("\n--- Mistake 3: Using || for Defaults ---");

function mistake3(count) {
  // ❌ WRONG - 0 is falsy
  const value = count || 10;
  return value;
}

console.log("mistake3(0):", mistake3(0)); // 10 (wrong!)
console.log("mistake3(5):", mistake3(5)); // 5 (correct)

// ✅ CORRECT - use default parameter
function correct3(count = 10) {
  return count;
}

console.log("correct3(0):", correct3(0)); // 0 (correct!)
console.log("correct3():", correct3()); // 10 (correct!)

// Mistake 4: Rest Parameter Position
console.log("\n--- Mistake 4: Rest Parameter Position ---");

// ❌ These would cause SyntaxError:
// function wrong1(...args, last) {}
// function wrong2(first, ...middle, last) {}
// function wrong3(...args1, ...args2) {}

// ✅ CORRECT
function correct4(first, second, ...rest) {
  console.log("First:", first);
  console.log("Second:", second);
  console.log("Rest:", rest);
}

correct4(1, 2, 3, 4, 5);

console.log("\n=== All function basics examples completed! ===\n");

/* ============================================
   QUICK REFERENCE SUMMARY
   ============================================ */

console.log("=== QUICK REFERENCE ===\n");

console.log(`
KEY TAKEAWAYS:

1. Declarations vs Expressions
   ✅ Declarations: Fully hoisted, can call before definition
   ✅ Expressions: Not hoisted, must define before call
   ✅ Modern: Prefer const with expressions

2. Arrow Functions
   ✅ Lexical 'this' (inherit from parent)
   ✅ Implicit return for single expressions
   ✅ No 'arguments' (use rest parameters)
   ✅ Cannot be constructors
   ✅ Perfect for callbacks
   ❌ Don't use as object methods

3. Parameters
   ✅ Default parameters: Only for undefined
   ✅ Rest parameters: Real array of remaining args
   ✅ Destructuring: Extract from objects/arrays
   ✅ arguments: Legacy, array-like (avoid)

4. Hoisting
   ✅ Declarations: Entire function hoisted
   ✅ Expressions: Only variable declaration hoisted
   ✅ const/let: In TDZ before initialization

5. Best Practices
   ✅ Use arrow functions for callbacks
   ✅ Use regular functions/methods for object methods
   ✅ Use default parameters (not ||)
   ✅ Use rest parameters (not arguments)
   ✅ Use const for function expressions
   ✅ Destructure parameters when appropriate
`);
