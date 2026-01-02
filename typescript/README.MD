# TypeScript - Complete Interview Preparation Guide

### Comprehensive guide for Senior Frontend Engineer role

---

## 📋 Table of Contents

1. [TypeScript Fundamentals](#1-typescript-fundamentals) - ⭐⭐⭐ CRITICAL
2. [Advanced Types](#2-advanced-types) - ⭐⭐⭐ CRITICAL
3. [Generics](#3-generics) - ⭐⭐⭐ CRITICAL
4. [Type Manipulation](#4-type-manipulation) - ⭐⭐ IMPORTANT
5. [TypeScript with React](#5-typescript-with-react) - ⭐⭐ IMPORTANT
6. [Configuration & Tooling](#6-configuration--tooling) - ⭐⭐ IMPORTANT
7. [Advanced Patterns](#7-advanced-patterns) - ⭐ GOOD TO KNOW

---

## 1. TypeScript Fundamentals

> ⭐⭐⭐ **CRITICAL**

### 1.1 Basic Types

#### Topics to Master:

- Primitive types (string, number, boolean, null, undefined, symbol, bigint)
- Type annotations vs type inference
- Any type and its dangers
- Unknown type (safer alternative to any)
- Void type for functions
- Never type for unreachable code
- Literal types (string literals, numeric literals)
- Type assertions (as keyword, angle bracket syntax)

#### Key Understanding Points:

- TypeScript adds static types to JavaScript
- Type inference reduces need for explicit annotations
- `any` disables type checking (avoid when possible)
- `unknown` requires type checking before use
- `never` represents values that never occur
- Literal types create very specific type constraints
- Type assertions tell compiler "trust me, I know better"

#### Common Interview Questions:

- What's the difference between `any` and `unknown`?
- When would you use the `never` type?
- What are literal types and when are they useful?
- How does type inference work in TypeScript?
- What's the difference between `void` and `undefined`?

---

### 1.2 Arrays and Tuples

#### Topics to Master:

- Array type syntax (Type[] vs Array<Type>)
- Readonly arrays
- Tuple types and their use cases
- Optional tuple elements
- Rest elements in tuples
- Named tuples
- Fixed-length arrays

#### Key Understanding Points:

- Arrays are homogeneous collections
- Tuples have fixed length and can mix types
- Readonly prevents mutations
- Tuples useful for function returns (multiple values)
- Optional elements with `?` in tuples
- Named tuples improve readability

#### Common Interview Questions:

- What's the difference between arrays and tuples?
- How do you create a readonly array?
- When would you use tuples over objects?
- Can tuples have optional elements?

---

### 1.3 Objects and Interfaces

#### Topics to Master:

- Object type annotations
- Interface declarations
- Optional properties (`?`)
- Readonly properties
- Index signatures
- Extending interfaces
- Interface vs type alias
- Excess property checking

#### Key Understanding Points:

- Interfaces define object shapes
- Optional properties may or may not exist
- Readonly prevents property reassignment
- Index signatures for dynamic property names
- Interfaces can extend other interfaces
- Interfaces are open (can be merged)
- Excess properties checked in object literals

#### Common Interview Questions:

- What's the difference between `interface` and `type`?
- How do you make a property optional?
- What are index signatures?
- Can interfaces be reopened/merged?
- When should you use `readonly`?

---

### 1.4 Functions

#### Topics to Master:

- Function type annotations
- Parameter types
- Return type annotations
- Optional parameters
- Default parameters
- Rest parameters
- Function overloading
- `this` parameter types
- Arrow function types
- Void vs undefined return

#### Key Understanding Points:

- Annotate parameters and return types
- Optional parameters come after required ones
- Default parameters provide type and value
- Rest parameters typed as arrays
- Overloading provides multiple signatures
- `this` can be explicitly typed
- Void means "ignore return value", undefined is actual value

#### Common Interview Questions:

- How do you type function parameters?
- What's the difference between optional and default parameters?
- How does function overloading work in TypeScript?
- When would you explicitly type `this`?
- What's the difference between `void` and `undefined` return types?

---

### 1.5 Union and Intersection Types

#### Topics to Master:

- Union types (|) concept
- Intersection types (&) concept
- Type narrowing with unions
- Discriminated unions (tagged unions)
- Type guards for narrowing
- Common use cases
- Union vs intersection decision making

#### Key Understanding Points:

- Union: value can be one of several types (OR)
- Intersection: value must satisfy all types (AND)
- Narrowing determines specific type from union
- Discriminated unions use literal type property
- Type guards help narrow union types
- Unions more common than intersections

#### Common Interview Questions:

- What's the difference between union and intersection types?
- How do you narrow a union type?
- What are discriminated unions?
- When would you use an intersection type?
- How do type guards work?

---

### 1.6 Type Aliases

#### Topics to Master:

- Creating type aliases
- Type alias vs interface differences
- Union types with aliases
- Intersection types with aliases
- Generic type aliases
- Recursive type aliases
- When to use type vs interface

#### Key Understanding Points:

- Type aliases name any type
- Can't be reopened (unlike interfaces)
- Better for unions, intersections, primitives
- Can be generic
- Can be recursive (for tree structures)
- Interface better for object shapes in most cases

#### Common Interview Questions:

- When should you use `type` vs `interface`?
- Can type aliases be generic?
- What are the limitations of type aliases?
- Can you create recursive types?

---

### 1.7 Enums

#### Topics to Master:

- Numeric enums
- String enums
- Heterogeneous enums
- Const enums
- Computed and constant members
- Reverse mappings
- Enum at runtime vs compile time
- Alternatives to enums (union of literals)

#### Key Understanding Points:

- Enums create named constants
- Numeric enums auto-increment
- String enums require explicit values
- Const enums inlined at compile time
- Regular enums exist at runtime
- Reverse mapping for numeric enums
- Union of literals often preferred (tree-shakable)

#### Common Interview Questions:

- What's the difference between numeric and string enums?
- What are const enums?
- When should you avoid enums?
- What are reverse mappings?
- What's the alternative to enums in TypeScript?

---

### 1.8 Type Assertions and Type Casting

#### Topics to Master:

- Type assertions (as syntax)
- Angle bracket syntax (not in JSX)
- Non-null assertion operator (!)
- Const assertions (as const)
- When assertions are necessary
- Dangers of over-using assertions
- Double assertions

#### Key Understanding Points:

- Assertions tell compiler "I know better"
- Don't perform runtime checks or conversions
- Non-null assertion removes null/undefined
- As const creates deeply readonly literal types
- Use sparingly - prefer type narrowing
- Double assertion via `unknown` for impossible casts

#### Common Interview Questions:

- What's the difference between type assertion and type casting?
- When should you use type assertions?
- What does the `!` operator do?
- What is `as const` and when would you use it?
- Are type assertions safe?

---

## 2. Advanced Types

> ⭐⭐⭐ **CRITICAL**

### 2.1 Conditional Types

#### Topics to Master:

- Conditional type syntax (T extends U ? X : Y)
- Distributive conditional types
- Type inference in conditional types (infer keyword)
- Nested conditional types
- Practical use cases
- Built-in conditional types

#### Key Understanding Points:

- Acts like ternary operator for types
- Distributes over union types
- `infer` keyword extracts types
- Used to create sophisticated type transformations
- Foundation for many utility types
- Can be nested for complex logic

#### Common Interview Questions:

- How do conditional types work?
- What is a distributive conditional type?
- How does the `infer` keyword work?
- Can you give examples of conditional type use cases?

---

### 2.2 Mapped Types

#### Topics to Master:

- Mapped type syntax
- Key remapping with `as` clause
- Modifiers (readonly, optional with +/-)
- Mapping over union types
- Template literal types in mapping
- Built-in mapped types (Partial, Required, etc.)
- Creating custom mapped types

#### Key Understanding Points:

- Transform properties of existing types
- Iterate over keys of type
- Add/remove modifiers (readonly, optional)
- Remap keys using `as` clause
- Foundation for utility types
- Powerful for creating type transformations

#### Common Interview Questions:

- What are mapped types?
- How do you make all properties optional?
- What's the difference between `Partial<T>` and `Required<T>`?
- How do you remove readonly from all properties?
- How can you rename keys in mapped types?

---

### 2.3 Template Literal Types

#### Topics to Master:

- String literal type interpolation
- Creating string patterns with types
- Combining with mapped types
- Uppercase, Lowercase, Capitalize, Uncapitalize utilities
- Union distribution in template literals
- Practical applications (API routes, CSS properties)

#### Key Understanding Points:

- Build string types from other types
- Interpolate types into strings
- Distribute over unions automatically
- Built-in string manipulation utilities
- Great for type-safe string APIs
- Useful for discriminated unions

#### Common Interview Questions:

- What are template literal types?
- How do they distribute over unions?
- Can you give practical examples?
- What built-in string utilities exist?

---

### 2.4 Index Access Types

#### Topics to Master:

- Accessing types using bracket notation
- Type[keyof Type] pattern
- Nested property access
- Array element types
- Number indexing for tuples
- Combining with mapped types

#### Key Understanding Points:

- Look up property type from another type
- Use `keyof` to get all keys
- Can access nested properties
- Works with arrays and tuples
- Useful for extracting types
- Type-safe property access

#### Common Interview Questions:

- How do you access a property type from another type?
- What does `Type[keyof Type]` do?
- How do you get array element types?
- Can you access nested property types?

---

### 2.5 Type Guards and Narrowing

#### Topics to Master:

- typeof type guards
- instanceof type guards
- Custom type guard functions (is keyword)
- Truthiness narrowing
- Equality narrowing
- in operator narrowing
- Discriminated unions narrowing
- Assignment narrowing
- Control flow analysis

#### Key Understanding Points:

- Narrowing refines types in branches
- TypeScript analyzes control flow
- Custom guards return `value is Type`
- Discriminated unions work with switch/if
- Guards combine with union types
- Essential for working with unions safely

#### Common Interview Questions:

- What are type guards?
- How do you create a custom type guard?
- What is control flow analysis?
- How do discriminated unions help with narrowing?
- What's the difference between `typeof` and `instanceof` guards?

---

### 2.6 Utility Types

#### Topics to Master:

- Partial<T> - all properties optional
- Required<T> - all properties required
- Readonly<T> - all properties readonly
- Pick<T, K> - select subset of properties
- Omit<T, K> - exclude properties
- Record<K, T> - object with specified keys/values
- Exclude<T, U> - exclude from union
- Extract<T, U> - extract from union
- NonNullable<T> - remove null/undefined
- ReturnType<T> - extract function return type
- Parameters<T> - extract function parameters
- Awaited<T> - unwrap Promise type

#### Key Understanding Points:

- Built-in type transformations
- Most built with mapped/conditional types
- Memorize common ones
- Understand implementation of each
- Know when to use each utility
- Can combine utilities together

#### Common Interview Questions:

- What's the difference between `Pick` and `Omit`?
- How would you implement `Partial<T>`?
- When would you use `Record<K, T>`?
- What's the difference between `Exclude` and `Extract`?
- How does `ReturnType<T>` work?

---

## 3. Generics

> ⭐⭐⭐ **CRITICAL**

### 3.1 Generic Functions

#### Topics to Master:

- Generic function syntax
- Type parameters
- Multiple type parameters
- Generic constraints (extends)
- Default type parameters
- Type inference with generics
- Generic arrow functions

#### Key Understanding Points:

- Generics create reusable, type-safe code
- Type parameters like function parameters
- Constraints limit what types can be used
- TypeScript often infers generic types
- Multiple type parameters for complex relationships
- Defaults provide fallback types

#### Common Interview Questions:

- What are generics?
- How do you constrain generic types?
- When does TypeScript infer generic types?
- Can you have multiple generic type parameters?
- What are default type parameters?

---

### 3.2 Generic Interfaces and Classes

#### Topics to Master:

- Generic interface declarations
- Generic class declarations
- Generic constraints in interfaces/classes
- Static members and generics
- Generic constructors
- Extending generic classes/interfaces
- Type parameter inference

#### Key Understanding Points:

- Interfaces and classes can be generic
- Type parameters defined at declaration
- Can constrain generics with extends
- Static members can't use class type parameters
- Generics propagate through inheritance
- Useful for data structures (Array, Map, Set)

#### Common Interview Questions:

- How do you create a generic interface?
- Can static methods use class type parameters?
- How do generic constraints work with classes?
- Give examples of generic classes

---

### 3.3 Generic Constraints

#### Topics to Master:

- Extends keyword for constraints
- Constraining to object properties (keyof)
- Multiple constraints
- Using type parameters in constraints
- Constraint inference
- Common constraint patterns

#### Key Understanding Points:

- Constraints limit acceptable types
- `T extends U` means T must be assignable to U
- `keyof` constrains to object keys
- Can use one type parameter to constrain another
- Enables property access on generic types
- Essential for type-safe generic code

#### Common Interview Questions:

- How do you constrain a generic type?
- What does `T extends keyof U` mean?
- Can you have multiple constraints?
- How do you ensure a generic has a specific property?

---

### 3.4 Generic Utility Patterns

#### Topics to Master:

- Creating custom generic utilities
- Combining generics with conditional types
- Recursive generic types
- Generic type inference patterns
- Common generic patterns (Factory, Repository, etc.)

#### Key Understanding Points:

- Generics power most utility types
- Combine with conditionals for complex types
- Can reference themselves (recursion)
- Type inference reduces boilerplate
- Learn common patterns for reuse

#### Common Interview Questions:

- How would you create a deep readonly type?
- Can you implement a generic pick function?
- What are some common generic patterns?
- How do recursive generics work?

---

## 4. Type Manipulation

> ⭐⭐ **IMPORTANT**

### 4.1 keyof Operator

#### Topics to Master:

- keyof type operator
- Getting union of object keys
- Number vs string keys
- Symbol keys
- Using with mapped types
- Using with generic constraints
- keyof typeof pattern

#### Key Understanding Points:

- `keyof T` produces union of T's keys
- Works with interfaces, types, classes
- Result is string | number for index signatures
- Essential for type-safe property access
- Combines powerfully with generics
- `keyof typeof` gets keys from value

#### Common Interview Questions:

- What does `keyof` do?
- How do you get keys from an object type?
- What's `keyof typeof`?
- How does `keyof` work with index signatures?

---

### 4.2 typeof Operator

#### Topics to Master:

- typeof type operator (not runtime typeof)
- Extracting type from value
- typeof with const assertions
- Capturing complex object types
- typeof in type declarations
- Differences from runtime typeof

#### Key Understanding Points:

- Gets type of a value/variable
- Used in type space, not runtime
- Great for capturing inferred types
- Works with const assertions
- Different from JavaScript typeof
- Useful for working with existing code

#### Common Interview Questions:

- What's the difference between type `typeof` and runtime `typeof`?
- How do you extract a type from a variable?
- When would you use `typeof` in types?

---

### 4.3 Type Inference

#### Topics to Master:

- Best common type algorithm
- Contextual typing
- Type inference in return types
- Generic type inference
- Inference with rest parameters
- Inference limitations
- When to add explicit types

#### Key Understanding Points:

- TypeScript infers types when possible
- Reduces need for annotations
- Context affects inference
- Generics often inferred from usage
- Sometimes explicit types improve clarity
- Know when inference isn't enough

#### Common Interview Questions:

- How does TypeScript infer types?
- When should you add explicit type annotations?
- What is contextual typing?
- Can TypeScript infer generic types?

---

### 4.4 Type Compatibility

#### Topics to Master:

- Structural typing (duck typing)
- Assignability rules
- Variance (covariance, contravariance, bivariance)
- Function parameter bivariance
- Excess property checking
- Fresh object literal types

#### Key Understanding Points:

- TypeScript uses structural typing
- Shape matters, not name
- Functions have special rules
- Fresh literals checked more strictly
- Understanding compatibility helps debug errors
- Variance affects generic types

#### Common Interview Questions:

- What is structural typing?
- How does function parameter compatibility work?
- What is excess property checking?
- What's the difference between nominal and structural typing?

---

### 4.5 Type Widening and Narrowing

#### Topics to Master:

- Type widening on initialization
- const vs let inference
- Literal type widening
- Type narrowing techniques
- as const for preventing widening
- Control flow narrowing

#### Key Understanding Points:

- Variables widen to general types
- `const` prevents widening for primitives
- `as const` creates deep readonly literals
- Narrowing refines types in branches
- Understanding widening prevents surprises
- Balance between flexibility and specificity

#### Common Interview Questions:

- What is type widening?
- How does `const` affect type inference?
- What's the difference between `const` and `as const`?
- How do you prevent type widening?

---

## 5. TypeScript with React

> ⭐⭐ **IMPORTANT**

### 5.1 Component Typing

#### Topics to Master:

- React.FC vs function components
- Component props typing
- Children prop types
- Optional props
- Default props with TypeScript
- Props with callbacks
- Generic components

#### Key Understanding Points:

- Props interface/type for type safety
- `React.FC` provides children automatically (not always wanted)
- Function components preferred over React.FC
- Use PropsWithChildren for children prop
- Generic components for flexible APIs
- Destructuring with types

#### Common Interview Questions:

- How do you type React component props?
- Should you use `React.FC`?
- How do you type children props?
- How do you create generic React components?

```typescript
// Good pattern
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

// Generic component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map(renderItem)}</ul>;
}
```

---

### 5.2 Hooks Typing

#### Topics to Master:

- useState with types
- useEffect typing
- useRef typing (DOM refs vs mutable values)
- useReducer with typed actions
- useContext with typed context
- useMemo and useCallback types
- Custom hooks typing

#### Key Understanding Points:

- Most hooks infer types well
- Provide explicit types when needed
- useRef has different types for DOM vs values
- Discriminated unions for reducer actions
- Context needs type for Provider and Consumer
- Custom hooks return typed values

#### Common Interview Questions:

- How do you type useState?
- What's the difference between `useRef<HTMLDivElement>` and `useRef<number>`?
- How do you type useReducer actions?
- How do you create a typed context?

```typescript
// useState
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);

// useRef - DOM
const inputRef = useRef<HTMLInputElement>(null);

// useRef - mutable value
const timerRef = useRef<number>();

// useReducer
type Action =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "set"; payload: number };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case "increment":
      return state + 1;
    case "decrement":
      return state - 1;
    case "set":
      return action.payload;
  }
}
```

---

### 5.3 Event Typing

#### Topics to Master:

- React event types (React.MouseEvent, React.ChangeEvent, etc.)
- Synthetic event system
- Event handler typing
- Form events
- Custom events
- Generic event handlers

#### Key Understanding Points:

- Use React event types, not DOM types
- Events are generic over element type
- Inline handlers often infer types
- Explicit types for extracted handlers
- SyntheticEvent is base type

#### Common Interview Questions:

- How do you type React event handlers?
- What's the difference between `MouseEvent` and `React.MouseEvent`?
- How do you type form submission handlers?

```typescript
// Click handler
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log(e.currentTarget);
};

// Change handler
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

// Form submit
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};
```

---

### 5.4 React Types Reference

#### Topics to Master:

- React.ReactNode
- React.ReactElement
- React.JSX.Element
- React.ComponentProps
- React.ComponentPropsWithRef
- React.ElementType
- React.PropsWithChildren
- React.CSSProperties

#### Key Understanding Points:

- ReactNode is broadest (any renderable)
- ReactElement is JSX element specifically
- ComponentProps extracts prop types
- PropsWithChildren adds children prop
- CSSProperties for inline styles
- Know which type to use when

#### Common Interview Questions:

- What's the difference between ReactNode and ReactElement?
- How do you extract prop types from a component?
- How do you type inline styles?

```typescript
// ReactNode - anything that can be rendered
function Container({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

// Extract props from existing component
type ButtonProps = React.ComponentProps<typeof Button>;

// Inline styles
const styles: React.CSSProperties = {
  color: "blue",
  fontSize: "16px",
};
```

---

### 5.5 Higher-Order Components

#### Topics to Master:

- Typing HOCs
- Props injection
- forwardRef typing
- Generic HOCs
- Props omission patterns

#### Key Understanding Points:

- HOCs complex to type properly
- Use generics for flexibility
- Handle injected props correctly
- ForwardRef has special typing

---

## 6. Configuration & Tooling

> ⭐⭐ **IMPORTANT**

### 6.1 tsconfig.json Basics

#### Topics to Master:

- Compiler options overview
- Target and module settings
- Lib option for polyfills
- Strict mode flags
- Module resolution strategies
- Include/exclude patterns
- Extends configuration

#### Key Understanding Points:

- Configuration controls TypeScript behavior
- Strict mode recommended (catches more errors)
- Target affects output JavaScript
- Module affects import/export compilation
- Understanding options helps debugging
- Modern apps typically use strict configuration

#### Common Interview Questions:

- What are the most important tsconfig options?
- What does strict mode enable?
- What's the difference between target and lib?
- How does module resolution work?

---

### 6.2 Important Compiler Options

#### Topics to Master:

- strict (and all strict flags)
- noImplicitAny
- strictNullChecks
- strictFunctionTypes
- esModuleInterop
- skipLibCheck
- allowSyntheticDefaultImports
- resolveJsonModule
- jsx options

#### Key Understanding Points:

- `strict: true` enables multiple checks
- noImplicitAny requires explicit types
- strictNullChecks prevents null errors
- esModuleInterop helps CommonJS imports
- skipLibCheck speeds compilation
- jsx setting for React (react-jsx recommended)

#### Common Interview Questions:

- What does `strict: true` include?
- Why is strictNullChecks important?
- What's esModuleInterop?
- Which compiler options should always be enabled?

---

### 6.3 Path Mapping and Module Resolution

#### Topics to Master:

- baseUrl configuration
- paths mapping (aliases)
- rootDirs for virtual directories
- Module resolution strategies (node, classic)
- Types package resolution
- @types packages

#### Key Understanding Points:

- Path mapping creates aliases
- baseUrl root for relative imports
- Paths need runtime resolver (webpack, etc.)
- TypeScript finds types in node_modules/@types
- Module resolution affects how imports work

---

### 6.4 Declaration Files (.d.ts)

#### Topics to Master:

- Purpose of declaration files
- Creating declarations for JS libraries
- Ambient declarations
- Augmenting existing types
- Triple-slash directives
- @types packages
- Writing type-only declarations

#### Key Understanding Points:

- .d.ts files contain only type information
- Describe shape of JavaScript code
- Allow using JS libraries with types
- Can augment existing module types
- DefinitelyTyped repository provides types

#### Common Interview Questions:

- What are declaration files?
- How do you add types to a JavaScript library?
- What are ambient declarations?
- How do you augment module types?

```typescript
// Declare module without types
declare module "my-untyped-library" {
  export function doSomething(x: number): string;
}

// Augment existing module
declare module "express" {
  interface Request {
    user?: User;
  }
}

// Global augmentation
declare global {
  interface Window {
    myCustomProperty: string;
  }
}
```

---

### 6.5 Type-Only Imports and Exports

#### Topics to Master:

- import type syntax
- export type syntax
- Type-only imports for optimization
- Re-exporting types
- Inline type imports

#### Key Understanding Points:

- Type-only imports erased at runtime
- Helps with circular dependencies
- Improves tree-shaking
- Makes intent clear
- TypeScript 3.8+ feature

```typescript
// Type-only import
import type { User } from "./types";

// Mixed import
import { something, type SomeType } from "./module";

// Type-only export
export type { User, Post };
```

---

## 7. Advanced Patterns

> ⭐ **GOOD TO KNOW**

### 7.1 Builder Pattern

#### Topics to Master:

- Fluent interfaces with TypeScript
- Method chaining types
- Progressive type refinement
- Compile-time validation

```typescript
class QueryBuilder<T> {
  private filters: Array<(item: T) => boolean> = [];

  where(predicate: (item: T) => boolean): this {
    this.filters.push(predicate);
    return this;
  }

  execute(items: T[]): T[] {
    return items.filter((item) => this.filters.every((filter) => filter(item)));
  }
}
```

---

### 7.2 Branded Types

#### Topics to Master:

- Nominal typing in TypeScript
- Creating unique type brands
- Runtime vs compile-time safety
- Use cases (user IDs, validated strings)

```typescript
type Brand<K, T> = K & { __brand: T };
type UserId = Brand<string, "UserId">;
type ProductId = Brand<string, "ProductId">;

function createUserId(id: string): UserId {
  return id as UserId;
}

// Can't mix different branded types
function getUser(id: UserId) {}
function getProduct(id: ProductId) {}

const userId = createUserId("123");
getUser(userId); // ✓
getProduct(userId); // ✗ Type error
```

---

### 7.3 Phantom Types

#### Topics to Master:

- Types with phantom type parameters
- State machine typing
- Compile-time state tracking
- Resource lifecycle management

```typescript
type State = "open" | "closed";

class Connection<S extends State> {
  private constructor(private state: S) {}

  static create(): Connection<"closed"> {
    return new Connection("closed");
  }

  open(this: Connection<"closed">): Connection<"open"> {
    return new Connection("open");
  }

  query(this: Connection<"open">, sql: string) {
    // Can only query when open
  }

  close(this: Connection<"open">): Connection<"closed"> {
    return new Connection("closed");
  }
}

const conn = Connection.create();
// conn.query('SELECT *'); // ✗ Error: connection not open
const openConn = conn.open();
openConn.query("SELECT *"); // ✓
```

---

### 7.4 Variadic Tuple Types

#### Topics to Master:

- Generic spread syntax in tuples
- Type-safe function composition
- Curry function typing
- Rest element positioning

```typescript
// Function composition
type Fn<A extends any[], R> = (...args: A) => R;

function compose<A extends any[], B, C>(f: Fn<[B], C>, g: Fn<A, B>): Fn<A, C> {
  return (...args) => f(g(...args));
}

// Type-safe curry
type Curry<P extends any[], R> = P extends [infer First, ...infer Rest]
  ? (arg: First) => Curry<Rest, R>
  : R;
```

---

### 7.5 Type-Level Programming

#### Topics to Master:

- Recursion in types
- Type-level computations
- String manipulation at type level
- Number arithmetic with types

```typescript
// String splitting
type Split<
  S extends string,
  D extends string
> = S extends `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] : [S];

type Result = Split<"a-b-c", "-">; // ['a', 'b', 'c']

// Deep readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
```

---

### 7.6 Advanced Error Handling

#### Topics to Master:

- Result/Either types
- Discriminated unions for errors
- Type-safe error handling
- Never type for exhaustiveness

```typescript
type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return { success: false, error: "Division by zero" };
  }
  return { success: true, value: a / b };
}

const result = divide(10, 2);
if (result.success) {
  console.log(result.value); // TypeScript knows value exists
} else {
  console.error(result.error); // TypeScript knows error exists
}
```

---

### 7.7 Advanced Decorator Patterns

#### Topics to Master:

- Decorator metadata
- Method decorators
- Property decorators
- Class decorators
- Parameter decorators
- Decorator factories

#### Key Understanding Points:

- Experimental feature (stage 3 proposal)
- Enable in tsconfig: `experimentalDecorators: true`
- Useful for frameworks (Angular, NestJS)
- Can modify class/property/method behavior

---

### 7.8 Module Augmentation

#### Topics to Master:

- Augmenting third-party modules
- Global augmentation
- Namespace augmentation
- Merging interfaces and namespaces

```typescript
// Augment Express Request
import "express";

declare module "express" {
  interface Request {
    user?: {
      id: string;
      name: string;
    };
  }
}

// Now Request.user is typed everywhere
```

---

## Additional Study Resources

### Practice Projects:

1. **Type-safe API Client**

   - Create REST API wrapper with full type safety
   - Practice: Generics, conditional types, mapped types

2. **Form Validation Library**

   - Type-safe form schema definition
   - Practice: Generic constraints, utility types, template literals

3. **State Management Library**

   - Redux-like store with TypeScript
   - Practice: Advanced generics, type inference, discriminated unions

4. **Type-safe Router**
   - Route matching and parameter extraction
   - Practice: Template literal types, type manipulation

### Common Interview Coding Challenges:

1. Implement `DeepPartial<T>`
2. Implement `DeepReadonly<T>`
3. Create type-safe event emitter
4. Implement `Paths<T>` (all paths in object)
5. Create `ReturnTypes<T>` for function overloads
6. Implement type-safe query builder
7. Create discriminated union from object

### Books and References:

- TypeScript Handbook (official docs)
- Effective TypeScript by Dan Vanderkam
- TypeScript Deep Dive by Basarat Ali Syed
- Type-Level TypeScript (online book)

### Online Practice:

- TypeScript Playground
- Type Challenges (GitHub repo)
- Exercism TypeScript track
- LeetCode with TypeScript

---

## Interview Preparation Checklist

### Fundamentals

- [ ] Master all basic types
- [ ] Understand interfaces vs types
- [ ] Practice with functions and objects
- [ ] Get comfortable with unions and intersections

### Advanced Types

- [ ] Master conditional types
- [ ] Learn mapped types thoroughly
- [ ] Understand template literal types
- [ ] Practice all utility types

### Generics & Patterns

- [ ] Generic functions and classes
- [ ] Generic constraints
- [ ] Common patterns (branded types, builders)
- [ ] Type manipulation techniques

### React & Practical Application

- [ ] TypeScript with React hooks
- [ ] Component typing patterns
- [ ] Build complete TypeScript + React project
- [ ] Practice interview questions

### Before Interview:

- [ ] Review all CRITICAL sections
- [ ] Practice explaining concepts out loud
- [ ] Do mock interviews
- [ ] Review tsconfig.json options
- [ ] Prepare examples from your projects

---

## Key Principles to Remember

1. **Type Safety is Goal**: TypeScript adds compile-time checking
2. **Inference is Powerful**: Let TypeScript infer when possible
3. **Explicit When Needed**: Add types for clarity and complex cases
4. **Strict Mode Always**: Enable strict for better code
5. **Read Error Messages**: TypeScript errors are descriptive
6. **Generic When Reusable**: Use generics for flexible, type-safe code
7. **Utility Types are Friends**: Learn and use built-in utilities
8. **Type Don't Lie**: If types compile, runtime types should match
9. **Progressive Enhancement**: Add types incrementally to JS projects
10. **Types Document Code**: Good types serve as documentation

---
