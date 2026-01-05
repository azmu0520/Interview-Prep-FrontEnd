# useReducer - Complete Interview Guide

## 🎯 Key Concepts

### 1. What is useReducer?

**Core Understanding:**

- `useReducer` is a hook for **state management** using the reducer pattern
- Alternative to `useState` for **complex state logic**
- Takes a **reducer function** and **initial state**
- Returns **current state** and **dispatch function**
- Inspired by Redux but built into React

**The Reducer Pattern:**

```javascript
// Basic structure
const [state, dispatch] = useReducer(reducer, initialState);

// Reducer function signature
function reducer(state, action) {
  // Return new state based on action
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    default:
      return state;
  }
}
```

**Simple Example:**

```javascript
function Counter() {
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "INCREMENT":
          return { count: state.count + 1 };
        case "DECREMENT":
          return { count: state.count - 1 };
        case "RESET":
          return { count: 0 };
        default:
          throw new Error(`Unknown action: ${action.type}`);
      }
    },
    { count: 0 }
  );

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>-</button>
      <button onClick={() => dispatch({ type: "RESET" })}>Reset</button>
    </div>
  );
}
```

---

### 2. Reducer Pattern in React

**What is a Reducer?**

A reducer is a **pure function** that takes the current state and an action, and returns a new state:

```javascript
(state, action) => newState;
```

**Key Characteristics:**

1. **Pure Function**: Same inputs = same output, no side effects
2. **Immutable Updates**: Never modify state directly, always return new state
3. **Action-based**: State changes are described by action objects
4. **Predictable**: Easy to understand what happened and why

**Anatomy of an Action:**

```javascript
// Simple action
{ type: 'INCREMENT' }

// Action with payload
{ type: 'SET_USER', payload: { id: 1, name: 'John' } }

// Action with multiple properties
{
  type: 'UPDATE_FIELD',
  field: 'email',
  value: 'john@example.com'
}
```

**Anatomy of a Reducer:**

```javascript
function userReducer(state, action) {
  // Always use switch or if/else on action.type
  switch (action.type) {
    case "SET_USER":
      // Return new state object
      return {
        ...state,
        user: action.payload,
        isLoading: false,
      };

    case "LOGOUT":
      // Can return completely new state
      return {
        user: null,
        isLoading: false,
        error: null,
      };

    case "SET_ERROR":
      // Only update what changed
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    default:
      // Important: handle unknown actions
      throw new Error(`Unhandled action type: ${action.type}`);
    // Or return current state: return state;
  }
}
```

---

### 3. Action Types and Payloads

**Pattern 1: Action Type Constants**

```javascript
// Define action types as constants (prevents typos)
const ActionTypes = {
  ADD_TODO: "ADD_TODO",
  TOGGLE_TODO: "TOGGLE_TODO",
  DELETE_TODO: "DELETE_TODO",
  SET_FILTER: "SET_FILTER",
};

function todoReducer(state, action) {
  switch (action.type) {
    case ActionTypes.ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };

    case ActionTypes.TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };

    case ActionTypes.DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };

    default:
      return state;
  }
}
```

**Pattern 2: Action Creators**

```javascript
// Action creators encapsulate action structure
const actions = {
  addTodo: (text) => ({
    type: "ADD_TODO",
    payload: {
      id: Date.now(),
      text,
      completed: false,
    },
  }),

  toggleTodo: (id) => ({
    type: "TOGGLE_TODO",
    payload: id,
  }),

  deleteTodo: (id) => ({
    type: "DELETE_TODO",
    payload: id,
  }),

  updateTodo: (id, updates) => ({
    type: "UPDATE_TODO",
    payload: { id, updates },
  }),
};

// Usage
function TodoList() {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const handleAdd = (text) => {
    dispatch(actions.addTodo(text));
  };

  const handleToggle = (id) => {
    dispatch(actions.toggleTodo(id));
  };
}
```

**Pattern 3: Payload Structures**

```javascript
// Simple payload - single value
dispatch({ type: "SET_COUNT", payload: 5 });

// Object payload - multiple values
dispatch({
  type: "SET_USER",
  payload: {
    id: 1,
    name: "John",
    email: "john@example.com",
  },
});

// Structured payload - clear intent
dispatch({
  type: "UPDATE_FORM",
  payload: {
    field: "email",
    value: "new@example.com",
    isValid: true,
  },
});

// No payload needed
dispatch({ type: "RESET" });

// Multiple properties (less common)
dispatch({
  type: "UPDATE_TODO",
  id: 1,
  text: "New text",
  completed: true,
});
```

---

### 4. State Transitions

**Understanding State Flow:**

```javascript
// Current State
const currentState = {
  todos: [
    { id: 1, text: "Learn React", completed: false },
    { id: 2, text: "Build app", completed: false },
  ],
  filter: "all",
};

// Action Dispatched
dispatch({
  type: "TOGGLE_TODO",
  payload: 1,
});

// Reducer Processes
function todoReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
  }
}

// New State (immutable!)
const newState = {
  todos: [
    { id: 1, text: "Learn React", completed: true }, // Changed!
    { id: 2, text: "Build app", completed: false },
  ],
  filter: "all",
};
```

**Complex State Transitions:**

```javascript
const initialState = {
  user: null,
  posts: [],
  isLoading: false,
  error: null,
};

function dataReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "FETCH_SUCCESS":
      return {
        ...state,
        posts: action.payload,
        isLoading: false,
        error: null,
      };

    case "FETCH_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case "ADD_POST":
      return {
        ...state,
        posts: [...state.posts, action.payload],
      };

    case "UPDATE_POST":
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.id
            ? { ...post, ...action.payload.updates }
            : post
        ),
      };

    case "DELETE_POST":
      return {
        ...state,
        posts: state.posts.filter((post) => post.id !== action.payload),
      };

    default:
      return state;
  }
}
```

---

### 5. When to Use useReducer vs useState

**Use useState when:**

```javascript
// ✅ Simple, independent state
const [count, setCount] = useState(0);
const [name, setName] = useState("");
const [isOpen, setIsOpen] = useState(false);

// ✅ State updates are simple
const increment = () => setCount((c) => c + 1);
const toggle = () => setIsOpen((open) => !open);

// ✅ Few state variables
function SimpleForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Just 2-3 pieces of state
}
```

**Use useReducer when:**

```javascript
// ✅ Complex state with multiple sub-values
const initialState = {
  todos: [],
  filter: 'all',
  searchQuery: '',
  sortBy: 'date',
  selectedIds: []
};

// ✅ State updates depend on previous state
case 'TOGGLE_TODO':
  return {
    ...state,
    todos: state.todos.map(todo =>
      todo.id === action.id
        ? { ...todo, completed: !todo.completed }
        : todo
    )
  };

// ✅ Multiple related state updates
case 'FETCH_SUCCESS':
  return {
    ...state,
    data: action.payload,
    isLoading: false,
    error: null,
    lastFetch: Date.now()
  };

// ✅ State logic is complex/lengthy
case 'ADD_TODO':
  const newTodo = {
    id: Date.now(),
    text: action.payload,
    completed: false,
    createdAt: new Date()
  };

  return {
    ...state,
    todos: [...state.todos, newTodo],
    totalCount: state.totalCount + 1,
    lastModified: Date.now()
  };
```

**Decision Tree:**

```
Do you have complex state logic?
├─ No → useState
└─ Yes → Do updates depend on previous state?
    ├─ No → useState (maybe multiple)
    └─ Yes → Does one action update multiple state values?
        ├─ No → useState with objects
        └─ Yes → useReducer
```

---

### 6. Complex State Logic Management

**Example: Shopping Cart**

```javascript
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        // Increment quantity if exists
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        // Add new item
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
        };
      }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: action.payload.quantity }
              : item
          )
          .filter((item) => item.quantity > 0), // Remove if quantity is 0
      };

    case "APPLY_COUPON":
      return {
        ...state,
        coupon: action.payload,
        discount: calculateDiscount(state.items, action.payload),
      };

    case "CLEAR_CART":
      return {
        items: [],
        coupon: null,
        discount: 0,
      };

    default:
      return state;
  }
};

function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    coupon: null,
    discount: 0,
  });

  const total =
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0) -
    state.discount;

  return (
    <div>
      {state.items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onUpdate={(quantity) =>
            dispatch({
              type: "UPDATE_QUANTITY",
              payload: { id: item.id, quantity },
            })
          }
          onRemove={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}
        />
      ))}
      <p>Total: ${total}</p>
    </div>
  );
}
```

**Example: Form with Validation**

```javascript
const formReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      const { field, value } = action.payload;
      const error = validateField(field, value);

      return {
        ...state,
        values: {
          ...state.values,
          [field]: value,
        },
        errors: {
          ...state.errors,
          [field]: error,
        },
        touched: {
          ...state.touched,
          [field]: true,
        },
      };

    case "SUBMIT_START":
      return {
        ...state,
        isSubmitting: true,
        submitError: null,
      };

    case "SUBMIT_SUCCESS":
      return {
        values: {},
        errors: {},
        touched: {},
        isSubmitting: false,
        submitError: null,
      };

    case "SUBMIT_ERROR":
      return {
        ...state,
        isSubmitting: false,
        submitError: action.payload,
      };

    case "RESET":
      return action.payload; // Reset to initial state

    default:
      return state;
  }
};

function RegistrationForm() {
  const [state, dispatch] = useReducer(formReducer, {
    values: { email: "", password: "", confirmPassword: "" },
    errors: {},
    touched: {},
    isSubmitting: false,
    submitError: null,
  });

  const handleChange = (field) => (e) => {
    dispatch({
      type: "UPDATE_FIELD",
      payload: { field, value: e.target.value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "SUBMIT_START" });

    try {
      await api.register(state.values);
      dispatch({ type: "SUBMIT_SUCCESS" });
    } catch (error) {
      dispatch({ type: "SUBMIT_ERROR", payload: error.message });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={state.values.email} onChange={handleChange("email")} />
      {state.touched.email && state.errors.email && (
        <span>{state.errors.email}</span>
      )}
      {/* More fields... */}
    </form>
  );
}
```

---

### 7. Reducer Function Requirements (Pure Function)

**What Makes a Function Pure?**

1. **Same inputs → Same outputs** (deterministic)
2. **No side effects** (no API calls, no mutations, no random values)
3. **No external dependencies** (only uses parameters)

**✅ Pure Reducer (CORRECT):**

```javascript
function pureReducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      // ✅ Returns new state based only on inputs
      return { count: state.count + 1 };

    case "ADD_TODO":
      // ✅ Creates new array without mutating
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };

    case "UPDATE_TODO":
      // ✅ Maps to new array
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, ...action.payload.updates }
            : todo
        ),
      };

    default:
      return state;
  }
}
```

**❌ Impure Reducer (WRONG):**

```javascript
function impureReducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      // ❌ WRONG: Mutates state directly
      state.todos.push(action.payload);
      return state;

    case "FETCH_DATA":
      // ❌ WRONG: Side effect (API call)
      fetch("/api/data").then((data) => {
        // This is an async side effect!
      });
      return state;

    case "SET_TIMESTAMP":
      // ❌ WRONG: Non-deterministic (Date.now())
      return {
        ...state,
        timestamp: Date.now(), // Different result each time!
      };

    case "LOG_ACTION":
      // ❌ WRONG: Side effect (console.log)
      console.log("Action:", action);
      return state;

    default:
      return state;
  }
}
```

**How to Handle Side Effects:**

```javascript
function Component() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ✅ Side effects in component, not reducer
  const handleAdd = async () => {
    dispatch({ type: "FETCH_START" });

    try {
      const data = await api.fetchData();
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
  };

  // ✅ Current timestamp in action, not reducer
  const handleLog = () => {
    dispatch({
      type: "ADD_LOG",
      payload: {
        message: "Something happened",
        timestamp: Date.now(), // Generate outside reducer
      },
    });
  };

  return <button onClick={handleAdd}>Fetch Data</button>;
}
```

---

### 8. useReducer with Context

**Pattern: Global State Management**

```javascript
// Create Context
const TodoContext = createContext();

// Reducer
function todoReducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    default:
      return state;
  }
}

// Provider Component
function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    filter: "all",
  });

  // Memoize value to prevent unnecessary re-renders
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

// Custom Hook
function useTodos() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodos must be used within TodoProvider");
  }
  return context;
}

// Usage in Components
function TodoList() {
  const { state, dispatch } = useTodos();

  const handleAdd = (text) => {
    dispatch({
      type: "ADD_TODO",
      payload: { id: Date.now(), text, completed: false },
    });
  };

  const handleToggle = (id) => {
    dispatch({ type: "TOGGLE_TODO", payload: id });
  };

  return (
    <div>
      {state.todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => handleToggle(todo.id)}
        />
      ))}
    </div>
  );
}

// App Setup
function App() {
  return (
    <TodoProvider>
      <TodoList />
      <TodoStats />
    </TodoProvider>
  );
}
```

**Benefits of useReducer + Context:**

1. ✅ Centralized state logic (reducer)
2. ✅ Access state anywhere in tree (context)
3. ✅ Type-safe actions
4. ✅ Easy to test (pure reducer function)
5. ✅ Predictable state updates
6. ✅ Good for medium-sized apps

---

## 🎤 Top Interview Questions & Model Answers

### Q1: When would you use useReducer instead of useState?

**Answer:**

> "I use useReducer instead of useState in four main scenarios. First, when I have complex state that contains multiple sub-values - like a form with values, errors, touched fields, and submission status. With useState, I'd need multiple state variables and keep them in sync; with useReducer, I can manage them together in one place. Second, when the next state depends on the previous state in complex ways - useReducer makes this more explicit and predictable. Third, when I have multiple related state transitions - for example, fetching data involves setting loading, handling success, and handling errors. Fourth, when I want to optimize performance by passing dispatch down instead of callback functions, since dispatch identity is stable. That said, I don't reach for useReducer immediately - I start with useState and refactor to useReducer when the complexity justifies it. The key is recognizing when state logic is becoming hard to manage with simple setState calls."

---

### Q2: What is a reducer function and what are its requirements?

**Answer:**

> "A reducer is a pure function that takes the current state and an action, and returns the next state - it's expressed as (state, action) => newState. The term comes from array reduce functions, but in React it means reducing actions into state changes. A reducer has strict requirements: First, it must be a pure function, meaning same inputs always produce the same outputs with no side effects. Second, it must never mutate the state directly - always return a new state object or array. Third, it should not perform side effects like API calls, random number generation, or Date.now() calls. Fourth, it should handle all possible action types, typically using a switch statement, and include a default case. These requirements make reducers predictable and easy to test - you can call a reducer with specific state and action, and always get the same result. Any side effects like API calls should happen in the component before dispatching an action, not in the reducer itself."

---

### Q3: How does useReducer work internally?

**Answer:**

> "Under the hood, useReducer and useState are actually related - useState is implemented using useReducer! When you call useReducer with a reducer function and initial state, React stores that state internally and returns it along with a dispatch function. The dispatch function is stable across renders - it won't change, similar to setState from useState. When you call dispatch with an action, React calls your reducer function with the current state and that action, gets the new state back, and if it's different from the current state (using Object.is comparison), React schedules a re-render with the new state. The key insight is that the reducer function is called during the render phase, not when dispatch is called. Like useState, multiple dispatch calls in the same render are batched together. The dispatch function also has the same referential equality guarantee as setState, making it safe to pass to child components without causing re-renders."

---

### Q4: Can you explain the difference between useReducer and Redux?

**Answer:**

> "useReducer and Redux share the same reducer pattern, but they're designed for different scales. useReducer is a React hook for local or shared component state - it's built into React, has zero dependencies, and is perfect for component-level or small-to-medium app state. Redux is a standalone library for global application state with more features: middleware for async logic and side effects, Redux DevTools for time-travel debugging and state inspection, a more opinionated structure with action creators and constants, and better performance with selector memoization. For a small app or managing state within a component tree, useReducer with Context works great. For larger apps with complex state interactions, extensive async logic, or when you need advanced debugging, Redux Toolkit is worth the added complexity. In my experience, many apps can start with useReducer and Context, and only migrate to Redux when they hit its limitations. They're complementary - you can use both in the same app for different concerns."

---

### Q5: How do you handle async actions with useReducer?

**Answer:**

> "useReducer doesn't handle async operations directly since reducers must be pure functions. The pattern I use is to handle async operations in the component and dispatch multiple actions to track the async lifecycle. For example, when fetching data, I dispatch FETCH_START before the request, then either FETCH_SUCCESS with the data or FETCH_ERROR with the error. This gives me clear state transitions and lets me track loading and error states. Here's the pattern: In the component, I have an async function that dispatches actions. Before the async operation, I dispatch an action to set loading state. Then I await the async operation, and dispatch success or error actions based on the result. The reducer handles these actions by updating loading, data, and error states appropriately. For more complex scenarios, you could create custom hooks that encapsulate this pattern, or use libraries like Redux Thunk if you're using Redux. The key principle is: side effects in components, pure state transitions in reducers."

**Code Example:**

```javascript
// In component
const handleFetch = async () => {
  dispatch({ type: 'FETCH_START' });

  try {
    const data = await api.fetchData();
    dispatch({ type: 'FETCH_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'FETCH_ERROR', payload: error.message });
  }
};

// In reducer
case 'FETCH_START':
  return { ...state, isLoading: true, error: null };
case 'FETCH_SUCCESS':
  return { ...state, data: action.payload, isLoading: false };
case 'FETCH_ERROR':
  return { ...state, error: action.payload, isLoading: false };
```

---

### Q6: What are action creators and why would you use them?

**Answer:**

> "Action creators are functions that create and return action objects. Instead of writing action objects inline every time you dispatch, you encapsulate the action structure in a function. This has several benefits: First, it prevents typos in action types - you define the type once in the action creator. Second, it encapsulates action structure - if you need to add properties or change the payload format, you change it in one place. Third, it makes the dispatch calls cleaner and more readable. Fourth, it enables action logic - you can generate IDs, format data, or add timestamps in the action creator. Fifth, it's easier to test - you can test action creators independently. In TypeScript projects, action creators help with type safety by ensuring actions have the correct shape. I typically create action creators when an action has complex payload logic, is used in multiple places, or when I want better type safety. For simple actions with no payload, inline dispatch calls are fine."

---

### Q7: How do you test reducers?

**Answer:**

> "Testing reducers is straightforward because they're pure functions - you just call them with specific state and action inputs, and assert the output. I typically write tests for each action type: First, test the initial state by calling the reducer with undefined state and an init action. Then for each action type, I create a test that starts with a known state, dispatches the action, and asserts the resulting state. I also test edge cases like unknown action types, empty arrays, or missing payload properties. The beauty of pure functions is there's no mocking required - no API calls, no timers, no context. I can test every branch and edge case easily. I also test that reducers don't mutate state by freezing the input state in development. For complex reducers, I might test multiple actions in sequence to verify state flows correctly. Tools like Jest make this simple with snapshot testing too - I can capture the entire state tree and be notified of any changes. The testability of reducers is one of their major advantages over scattered setState logic."

**Example:**

```javascript
describe("todoReducer", () => {
  it("should add a todo", () => {
    const state = { todos: [] };
    const action = {
      type: "ADD_TODO",
      payload: { id: 1, text: "Test", completed: false },
    };

    const newState = todoReducer(state, action);

    expect(newState.todos).toHaveLength(1);
    expect(newState.todos[0].text).toBe("Test");
    expect(state.todos).toHaveLength(0); // Original not mutated
  });

  it("should toggle todo", () => {
    const state = {
      todos: [{ id: 1, text: "Test", completed: false }],
    };
    const action = { type: "TOGGLE_TODO", payload: 1 };

    const newState = todoReducer(state, action);

    expect(newState.todos[0].completed).toBe(true);
  });
});
```

---

## 🚨 Common Mistakes to Avoid

### 1. Mutating State Directly

```javascript
// ❌ WRONG - Mutates state
function badReducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      state.todos.push(action.payload); // Mutating!
      return state; // Returns same reference

    case "UPDATE_TODO":
      const todo = state.todos.find((t) => t.id === action.id);
      todo.completed = true; // Mutating!
      return state;
  }
}

// ✅ CORRECT - Returns new state
function goodReducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };

    case "UPDATE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.id ? { ...todo, completed: true } : todo
        ),
      };
  }
}
```

### 2. Side Effects in Reducer

```javascript
// ❌ WRONG - Side effects in reducer
function badReducer(state, action) {
  switch (action.type) {
    case "FETCH_DATA":
      // ❌ API call in reducer!
      fetch("/api/data").then((data) => {
        // Can't even dispatch here!
      });
      return state;

    case "LOG_ACTION":
      // ❌ Console log is a side effect
      console.log("Action:", action);
      return state;
  }
}

// ✅ CORRECT - Side effects in component
function Component() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleFetch = async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const data = await fetch("/api/data");
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error });
    }
  };

  return <button onClick={handleFetch}>Fetch</button>;
}
```

### 3. Not Handling Default Case

```javascript
// ❌ WRONG - No default case
function badReducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    // No default! Typos return undefined!
  }
}

// ✅ CORRECT - Handle unknown actions
function goodReducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    default:
      // Either throw error or return current state
      throw new Error(`Unknown action type: ${action.type}`);
    // Or: return state;
  }
}
```

### 4. Forgetting to Memoize with Context

```javascript
// ❌ WRONG - New value object every render
function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
  // All consumers re-render on every Provider render!
}

// ✅ CORRECT - Memoize value
function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
```

### 5. Complex Logic in Action Payloads

```javascript
// ❌ WRONG - Computing in dispatch call
dispatch({
  type: "ADD_TODO",
  payload: {
    id: Math.random(), // Non-deterministic!
    text: text,
    completed: false,
    createdAt: new Date(), // Non-deterministic!
  },
});

// ✅ CORRECT - Compute before dispatch or in action creator
const newTodo = {
  id: Date.now(),
  text: text,
  completed: false,
  createdAt: new Date(),
};
dispatch({ type: "ADD_TODO", payload: newTodo });

// ✅ OR use action creator
const addTodo = (text) => ({
  type: "ADD_TODO",
  payload: {
    id: Date.now(),
    text,
    completed: false,
    createdAt: new Date(),
  },
});

dispatch(addTodo(text));
```

---

## 🔑 Interview Checklist

### ✅ Must Know (Will definitely be asked)

- ✅ What useReducer does (state management with reducer pattern)
- ✅ When to use useReducer vs useState
- ✅ Reducer function signature: (state, action) => newState
- ✅ Reducer must be pure function
- ✅ Actions have type and optional payload
- ✅ Immutable state updates

### ✅ Should Know (Often asked)

- ✅ Action creators pattern
- ✅ Handling async actions
- ✅ useReducer with Context
- ✅ Testing reducers
- ✅ useReducer vs Redux differences

### ✅ Nice to Know (Senior level)

- [ ] Init function (lazy initialization)
- [ ] Complex state transitions
- [ ] TypeScript with useReducer
- [ ] Performance optimizations
- [ ] Reducer composition patterns

---

## 💡 Pro Tips for Interviews

1. **Start simple**: Show you know when NOT to use useReducer
2. **Emphasize purity**: Explain why pure functions matter
3. **Real examples**: Have a complex state management story
4. **Testing angle**: Mention how easy reducers are to test
5. **Know limitations**: Understand when to reach for Redux

---

## 📚 Quick Reference

```javascript
// Basic setup
const [state, dispatch] = useReducer(reducer, initialState);

// Reducer function
function reducer(state, action) {
  switch (action.type) {
    case "ACTION_TYPE":
      return { ...state /* changes */ };
    default:
      return state;
  }
}

// Dispatch action
dispatch({ type: "ACTION_TYPE", payload: value });

// Action creator
const actionCreator = (value) => ({
  type: "ACTION_TYPE",
  payload: value,
});

// With Context
const Context = createContext();

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

// Async pattern
const handleAsync = async () => {
  dispatch({ type: "START" });
  try {
    const data = await fetch();
    dispatch({ type: "SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "ERROR", payload: error });
  }
};
```

---

## 🎯 The Golden Rules

1. **"Reducers must be pure functions"** - No side effects, no mutations
2. **"One action, one state transition"** - Clear, predictable updates
3. **"Use useState first"** - Only refactor to useReducer when needed
4. **"Test reducers easily"** - Pure functions are simple to test
5. **"Side effects in components"** - Not in reducers

---

**Remember:** useReducer is about organizing complex state logic in a predictable, testable way. It's not about performance or optimization - it's about code organization and maintainability. Use it when useState becomes hard to manage, not as a default!
