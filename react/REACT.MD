# React.js - Complete Interview Preparation Guide

### Comprehensive guide for Senior Frontend Engineer role

---

## 📋 Table of Contents

1. [React Hooks](#1-react-hooks) - ⭐⭐⭐ CRITICAL
2. [Performance Optimization](#2-performance-optimization) - ⭐⭐⭐ CRITICAL
3. [Component Patterns](#3-component-patterns) - ⭐⭐⭐ CRITICAL
4. [State Management](#4-state-management) - ⭐⭐ IMPORTANT
5. [React 18+ Features](#5-react-18-features) - ⭐⭐ IMPORTANT
6. [Advanced Topics](#6-advanced-topics) - ⭐ GOOD TO KNOW

---

## 1. React Hooks

> ⭐⭐⭐ **CRITICAL**

### 1.1 useState

#### Topics to Master:

- Basic state initialization
- Functional updates (updater function pattern)
- Lazy initialization for expensive computations
- State batching behavior
- Asynchronous state updates
- Immutable updates for objects and arrays
- State updates with previous state
- Multiple state variables vs single object

#### Key Understanding Points:

- When to use functional updates vs direct value updates
- Why multiple setState calls are batched
- How to avoid stale closure issues
- When to split state vs keep it together

#### Common Interview Questions:

- Why doesn't my state update immediately?
- What's the difference between `setState(value)` and `setState(prev => value)`?
- How do you update nested objects in state?
- When should you use multiple useState vs single useState with an object?

---

### 1.2 useEffect

#### Topics to Master:

- Effect execution timing (after paint)
- Dependency array behavior and rules
- Cleanup functions (purpose and timing)
- Effect execution order
- Running effects once (empty dependency array)
- Conditional effect execution
- Effects with async operations
- Effect dependencies best practices

#### Key Understanding Points:

- Dependency array uses shallow comparison (Object.is)
- Cleanup runs before next effect and on unmount
- Why effects run twice in Strict Mode (React 18 dev behavior)
- Common infinite loop causes and solutions
- How to handle objects/arrays in dependencies
- Fetching data in useEffect patterns

#### Common Interview Questions:

- When does the cleanup function run?
- Why is my effect running infinitely?
- What happens if I omit the dependency array?
- How do you handle async operations in useEffect?
- What's the difference between useEffect and useLayoutEffect?

---

### 1.3 useCallback

#### Topics to Master:

- Function memoization concept
- Dependency array requirements
- When useCallback provides actual benefits
- Referential equality importance
- Performance trade-offs
- Common use cases (passing to child components, dependencies in other hooks)

#### Key Understanding Points:

- useCallback returns memoized function reference
- Only helpful when function reference matters (child component props, dependencies)
- Creates new function when dependencies change
- Doesn't prevent function re-creation, just returns cached version
- Overhead of memoization vs benefits

#### Common Interview Questions:

- When should you use useCallback?
- What's the difference between useCallback and useMemo?
- Does useCallback improve performance in all cases?
- How do dependencies work in useCallback?

---

### 1.4 useMemo

#### Topics to Master:

- Value memoization concept
- Expensive computation caching
- Dependency array behavior
- When to use vs when to skip
- Referential equality for objects/arrays
- Performance optimization patterns

#### Key Understanding Points:

- useMemo returns memoized value
- Recalculates when dependencies change
- Use for expensive calculations, not everything
- Helps prevent unnecessary child re-renders (referential equality)
- Has its own overhead - measure before optimizing

#### Common Interview Questions:

- When should you use useMemo?
- What's the difference between useMemo and useCallback?
- Can you give examples of when NOT to use useMemo?
- How does useMemo help with performance?

---

### 1.5 useRef

#### Topics to Master:

- DOM element references
- Mutable value storage (persists across renders)
- Doesn't trigger re-renders when changed
- Accessing previous values
- Storing timers/intervals
- Imperative DOM manipulation
- Forwarding refs

#### Key Understanding Points:

- useRef returns mutable object with .current property
- Changes to ref.current don't cause re-renders
- Refs persist across renders (not reset)
- Common use: accessing DOM nodes, storing mutable values
- Difference between refs and state

#### Common Interview Questions:

- What's the difference between useRef and useState?
- When would you use useRef instead of state?
- How do you access DOM elements with useRef?
- What is ref forwarding?

---

### 1.6 useContext

#### Topics to Master:

- Context consumption in functional components
- Accessing context values
- Context updates and re-renders
- Multiple contexts usage
- Context vs props drilling
- When to use context

#### Key Understanding Points:

- useContext subscribes to nearest Provider
- Component re-renders when context value changes
- All consumers re-render on context update (performance concern)
- Context is for sharing data across component tree
- Not a replacement for all state management

#### Common Interview Questions:

- How does useContext work?
- What triggers a re-render in context consumers?
- When should you use Context API vs other state management?
- What are the performance implications of Context?

---

### 1.7 useReducer

#### Topics to Master:

- Reducer pattern in React
- Action types and payloads
- State transitions
- When to use vs useState
- Complex state logic management
- Reducer function requirements (pure function)

#### Key Understanding Points:

- Better for complex state logic with multiple sub-values
- State updates based on action types
- Reducer must be pure function
- Good for related state updates
- Can be easier to test than useState logic

#### Common Interview Questions:

- When would you use useReducer instead of useState?
- What is a reducer function?
- How does useReducer work?
- Can you combine useReducer with Context?

---

### 1.8 Custom Hooks

#### Topics to Master:

- Creating custom hooks
- Hook naming conventions (use prefix)
- Extracting reusable logic
- Composing hooks together
- Hook rules and best practices
- Return values (arrays vs objects)

#### Key Understanding Points:

- Custom hooks let you reuse stateful logic
- Must follow all rules of hooks
- Can use other hooks inside
- Great for sharing logic between components
- Return pattern: arrays for positional, objects for named returns

#### Common Interview Questions:

- What are custom hooks?
- When would you create a custom hook?
- What are the rules for custom hooks?
- How do you share logic between components using hooks?

---

### 1.9 Hook Rules and Best Practices

#### Essential Rules:

- Only call hooks at the top level
- Only call hooks in React functions
- Hooks must be called in the same order every render
- Custom hooks must start with "use"

#### Best Practices:

- Keep hooks at component top level
- Extract related logic into custom hooks
- Name custom hooks descriptively
- Document dependencies clearly
- Use ESLint plugin for hooks

---

## 2. Performance Optimization

> ⭐⭐⭐ **CRITICAL**

### 2.1 React.memo

#### Topics to Master:

- Component memoization concept
- Preventing unnecessary re-renders
- Shallow prop comparison
- Custom comparison function
- When React.memo helps vs when it doesn't
- Trade-offs and overhead

#### Key Understanding Points:

- React.memo is HOC for functional components
- Only re-renders if props change (shallow comparison)
- Can provide custom comparison function
- Use when component renders often with same props
- Don't overuse - has its own cost

#### Common Interview Questions:

- What is React.memo and when should you use it?
- How does React.memo compare props?
- Can you provide a custom comparison function?
- What's the difference between React.memo and useMemo?

---

### 2.2 Code Splitting

#### Topics to Master:

- Dynamic imports
- React.lazy for component loading
- Suspense boundary setup
- Route-based code splitting
- Component-based code splitting
- Bundle size optimization
- Loading states and error handling

#### Key Understanding Points:

- Code splitting reduces initial bundle size
- React.lazy loads components on demand
- Suspense handles loading states
- Best applied at route level first
- Webpack creates separate chunks automatically

#### Common Interview Questions:

- How do you implement code splitting in React?
- What is React.lazy?
- How does Suspense work with lazy loading?
- Where should you apply code splitting?

---

### 2.3 Preventing Unnecessary Re-renders

#### Topics to Master:

- Understanding React rendering behavior
- Component re-render triggers
- Props reference equality
- Lifting state optimization
- Component composition patterns
- Children props pattern
- State colocation

#### Key Understanding Points:

- Parent re-render causes child re-renders by default
- New object/array references cause re-renders
- Moving state down reduces re-render scope
- Children props don't re-create
- Composition can prevent re-renders

#### Common Interview Questions:

- What causes a component to re-render?
- How can you prevent unnecessary re-renders?
- What is the children props pattern for optimization?
- How does state location affect performance?

---

### 2.4 Virtual Scrolling / Windowing

#### Topics to Master:

- Virtual scrolling concept
- react-window library
- react-virtualized library
- Rendering large lists efficiently
- Dynamic item sizes
- Scroll position management

#### Key Understanding Points:

- Only render visible items
- Dramatically improves performance for large lists
- Essential for lists with 100+ items
- Maintains scroll position and UX
- Libraries handle complexity

#### Common Interview Questions:

- How do you optimize rendering of large lists?
- What is virtual scrolling?
- When would you use react-window?
- How does windowing improve performance?

---

### 2.5 Bundle Size Optimization

#### Topics to Master:

- Tree shaking
- Dead code elimination
- Import optimization (named vs default)
- Analyzing bundle size
- Lazy loading heavy dependencies
- Code splitting strategies
- Webpack bundle analyzer

#### Key Understanding Points:

- Smaller bundles load faster
- Tree shaking removes unused code
- Import only what you need
- Measure before optimizing
- Balance between requests and bundle size

#### Common Interview Questions:

- How do you optimize bundle size?
- What is tree shaking?
- How do you analyze your bundle?
- What's the impact of bundle size on performance?

---

### 2.6 Profiling and Measuring Performance

#### Topics to Master:

- React DevTools Profiler
- Performance metrics (commit time, render time)
- Identifying performance bottlenecks
- Chrome DevTools Performance tab
- Web Vitals (LCP, FID, CLS)
- Lighthouse audits

#### Key Understanding Points:

- Measure before optimizing (no premature optimization)
- Profiler shows component render times
- Identify which components render frequently
- Focus on actual bottlenecks, not theoretical issues
- Performance budgets

#### Common Interview Questions:

- How do you identify performance issues in React?
- What is the React Profiler?
- How do you measure component performance?
- What metrics matter for React performance?

---

## 3. Component Patterns

> ⭐⭐⭐ **CRITICAL**

### 3.1 Controlled vs Uncontrolled Components

#### Topics to Master:

- Controlled component pattern
- Uncontrolled component with refs
- Form handling approaches
- When to use each pattern
- State synchronization
- Default values vs value props

#### Key Understanding Points:

- Controlled: React state controls input value
- Uncontrolled: DOM maintains input value
- Controlled gives more control but more code
- Uncontrolled simpler for basic forms
- Most React apps prefer controlled

#### Common Interview Questions:

- What's the difference between controlled and uncontrolled components?
- When would you use an uncontrolled component?
- How do you handle forms in React?
- What are the trade-offs of each approach?

---

### 3.2 Compound Components

#### Topics to Master:

- Compound component pattern
- Implicit state sharing
- React.Children utilities
- Context for state sharing
- Flexible component APIs
- Component composition

#### Key Understanding Points:

- Multiple components work together as one
- Parent manages shared state
- Children implicitly access state
- Creates flexible, composable APIs
- Examples: Select/Option, Tabs/Tab

#### Common Interview Questions:

- What are compound components?
- How do you implement compound components?
- What are the benefits of this pattern?
- Can you give examples of compound components?

---

### 3.3 Render Props

#### Topics to Master:

- Render prop pattern
- Function as children
- Sharing stateful logic
- Inversion of control
- When to use vs custom hooks
- Performance considerations

#### Key Understanding Points:

- Pass function to component as prop
- Function receives data, returns JSX
- Enables logic sharing and reuse
- More verbose than hooks
- Mostly replaced by custom hooks now

#### Common Interview Questions:

- What is the render props pattern?
- How does render props work?
- When would you use render props?
- What's the difference between render props and custom hooks?

---

### 3.4 Higher-Order Components (HOC)

#### Topics to Master:

- HOC pattern concept
- Wrapping components with logic
- Props forwarding
- Display name conventions
- Composing HOCs
- When to use vs hooks
- HOC limitations

#### Key Understanding Points:

- Function that takes component, returns enhanced component
- Used for cross-cutting concerns
- Can add props, wrap with logic
- Mostly replaced by hooks
- Still used in libraries (React Redux connect)

#### Common Interview Questions:

- What is a Higher-Order Component?
- How do you create an HOC?
- What are the use cases for HOCs?
- Why are hooks preferred over HOCs now?

---

### 3.5 Error Boundaries

#### Topics to Master:

- Error boundary concept
- Class component requirement (still needed)
- componentDidCatch lifecycle
- getDerivedStateFromError
- Error boundary placement
- Fallback UI rendering
- Error logging

#### Key Understanding Points:

- Catch JavaScript errors in component tree
- Display fallback UI instead of crash
- Still requires class component (no hook equivalent)
- Should be placed strategically in tree
- Doesn't catch errors in event handlers, async code

#### Common Interview Questions:

- What are error boundaries?
- How do you implement an error boundary?
- Where should error boundaries be placed?
- What errors do error boundaries NOT catch?

---

## 4. State Management

> ⭐⭐ **IMPORTANT**

### 4.1 Context API

#### Topics to Master:

- Creating context
- Provider component
- Consumer patterns
- Multiple contexts
- Context composition
- Performance considerations
- When to use context

#### Key Understanding Points:

- Solves props drilling problem
- All consumers re-render on context change
- Can cause performance issues if misused
- Split contexts for different data domains
- Not a complete state management solution

#### Common Interview Questions:

- How does Context API work?
- What are the performance implications of Context?
- How do you optimize Context usage?
- When should you use Context vs Redux?

---

### 4.2 Context API Limitations

#### Topics to Master:

- Re-render issues with context
- Inability to partially subscribe
- Performance bottlenecks
- Context hell with multiple providers
- Solutions and workarounds
- When to move to Redux/Zustand

#### Key Understanding Points:

- All consumers re-render even if using one value
- No built-in selector mechanism
- Can split contexts to minimize re-renders
- Composition can help
- Know when Context isn't enough

---

### 4.3 Redux (Awareness)

#### Topics to Master:

- Redux core concepts (store, actions, reducers)
- When Redux is beneficial
- Redux Toolkit (modern approach)
- Integration with React (useSelector, useDispatch)
- Middleware concept
- DevTools and debugging

#### Key Understanding Points:

- Centralized state management
- Predictable state updates
- Better for complex state logic
- DevTools for time-travel debugging
- Learning curve and boilerplate
- Redux Toolkit reduces boilerplate

---

### 4.4 Alternative State Management

#### Topics to Master:

- Zustand (lightweight alternative)
- Jotai (atomic state)
- Recoil (Facebook's solution)
- When to use each
- Comparison with Context/Redux
- Trade-offs

#### Key Understanding Points:

- Lighter alternatives to Redux
- Less boilerplate
- Better TypeScript support
- Easier learning curve
- Good for medium-sized apps

---

### 4.5 State Colocation

#### Topics to Master:

- Keep state close to where it's used
- Lifting state up only when needed
- Component composition for state sharing
- Avoiding global state overuse
- Performance benefits

#### Key Understanding Points:

- Start with local state
- Lift state only when multiple components need it
- Reduces unnecessary re-renders
- Simpler debugging
- Better component independence

#### Common Interview Questions:

- What is state colocation?
- When should you lift state up?
- How do you decide between local and global state?

---

## 5. React 18+ Features

> ⭐⭐ **IMPORTANT**

### 5.1 Concurrent Rendering

#### Topics to Master:

- Concurrent rendering concept
- Interruptible rendering
- Priority-based rendering
- Benefits for user experience
- Backward compatibility

#### Key Understanding Points:

- React can interrupt rendering for urgent updates
- Improves responsiveness
- Automatic in React 18
- No code changes required for most apps
- Foundation for new features

---

### 5.2 useTransition

#### Topics to Master:

- Marking updates as transitions
- Deferring non-urgent updates
- isPending state
- Keeping UI responsive during updates
- Use cases (filtering, searching)

#### Key Understanding Points:

- Marks state updates as non-urgent
- React can interrupt transitions for urgent updates
- Keeps UI responsive
- Returns isPending boolean
- Great for heavy computations

---

### 5.3 useDeferredValue

#### Topics to Master:

- Deferring value updates
- Showing stale value while loading
- Debounce alternative
- Use with expensive renders
- Difference from useTransition

#### Key Understanding Points:

- Defers updating a value
- Shows previous value while new one computes
- React built-in debouncing mechanism
- Use when you can't control the setState
- Similar to useTransition but for values

---

### 5.4 Suspense for Data Fetching

#### Topics to Master:

- Suspense component
- Suspense boundaries
- Loading states with Suspense
- Error boundaries with Suspense
- Suspense-enabled libraries
- Streaming SSR with Suspense

#### Key Understanding Points:

- Declarative loading states
- Works with React.lazy today
- Data fetching support coming
- Multiple Suspense boundaries for granular loading
- Better UX with streaming

---

### 5.5 Automatic Batching

#### Topics to Master:

- Batching concept
- Automatic batching in React 18
- Multiple setState calls
- Batching in event handlers, timeouts, promises
- Performance benefits

#### Key Understanding Points:

- React groups multiple state updates
- Reduces re-renders
- Now works outside of event handlers too
- Improves performance automatically
- Transparent to developers

---

## 6. Advanced Topics

> ⭐ **GOOD TO KNOW**

### 6.1 Portals

#### Topics to Master:

- ReactDOM.createPortal
- Rendering outside parent DOM hierarchy
- Modal implementations
- Tooltip positioning
- Event bubbling through portals

---

### 6.2 forwardRef

#### Topics to Master:

- Forwarding refs to child components
- Ref forwarding patterns
- When it's needed
- Component libraries usage

---

### 6.3 useImperativeHandle

#### Topics to Master:

- Customizing ref value
- Exposing methods to parent
- Use with forwardRef
- Imperative API for components

---

### 6.4 React DevTools

#### Topics to Master:

- Components tab
- Profiler tab
- Highlighting updates
- Component props inspection
- Hooks inspection

---

### 6.5 React Server Components (Awareness)

#### Topics to Master:

- Server components concept
- Client vs Server components
- Benefits (zero bundle size, direct DB access)
- Limitations
- Future of React
