import React, {
  useReducer,
  useState,
  useRef,
  useMemo,
  createContext,
  useContext,
} from "react";

// ==========================================
// 1. BASIC USEREDUCER DEMO
// ==========================================
function counterReducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    case "INCREMENT_BY":
      return { count: state.count + action.payload };
    case "RESET":
      return { count: 0 };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function BasicReducerDemo() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  const [actionLog, setActionLog] = useState([]);

  const logAction = (action) => {
    setActionLog((prev) =>
      [
        ...prev,
        {
          type: action.type,
          payload: action.payload,
          timestamp: new Date().toLocaleTimeString(),
        },
      ].slice(-5)
    ); // Keep last 5
  };

  const handleDispatch = (action) => {
    dispatch(action);
    logAction(action);
  };

  return (
    <div className="p-4 border rounded mb-4 bg-blue-50">
      <h3 className="font-bold text-lg mb-2">1. Basic useReducer</h3>

      <div className="bg-white p-4 rounded border mb-3">
        <p className="text-4xl font-bold text-center mb-4">{state.count}</p>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleDispatch({ type: "INCREMENT" })}
            className="px-4 py-2 bg-green-500 text-white rounded font-semibold"
          >
            +1
          </button>
          <button
            onClick={() => handleDispatch({ type: "DECREMENT" })}
            className="px-4 py-2 bg-red-500 text-white rounded font-semibold"
          >
            -1
          </button>
          <button
            onClick={() => handleDispatch({ type: "INCREMENT_BY", payload: 5 })}
            className="px-4 py-2 bg-blue-500 text-white rounded font-semibold"
          >
            +5
          </button>
          <button
            onClick={() => handleDispatch({ type: "RESET" })}
            className="px-4 py-2 bg-gray-500 text-white rounded font-semibold"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="bg-gray-800 text-white p-3 rounded text-xs font-mono">
        <p className="font-bold mb-2">Action Log:</p>
        {actionLog.length === 0 ? (
          <p className="text-gray-400">No actions yet...</p>
        ) : (
          actionLog.map((log, i) => (
            <div key={i} className="mb-1">
              <span className="text-yellow-400">{log.timestamp}</span>
              {" → "}
              <span className="text-green-400">{log.type}</span>
              {log.payload && (
                <span className="text-blue-400"> (payload: {log.payload})</span>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-3 bg-yellow-100 p-2 rounded text-xs">
        💡 useReducer: dispatch actions → reducer processes → new state!
      </div>
    </div>
  );
}

// ==========================================
// 2. USESTATE VS USEREDUCER
// ==========================================
function StateVsReducer() {
  // useState approach
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [total1, setTotal1] = useState(0);

  const handleIncrement1 = () => {
    setCount1((c) => c + 1);
    setTotal1((t) => t + 1);
  };

  const handleDecrement1 = () => {
    setCount1((c) => c - 1);
    setTotal1((t) => t - 1);
  };

  // useReducer approach
  const reducer = (state, action) => {
    switch (action.type) {
      case "INCREMENT":
        return {
          ...state,
          count: state.count + 1,
          total: state.total + 1,
        };
      case "DECREMENT":
        return {
          ...state,
          count: state.count - 1,
          total: state.total - 1,
        };
      case "RESET":
        return { count: 0, total: 0 };
      default:
        return state;
    }
  };

  const [state2, dispatch] = useReducer(reducer, { count: 0, total: 0 });

  return (
    <div className="p-4 border rounded mb-4 bg-green-50">
      <h3 className="font-bold text-lg mb-2">2. useState vs useReducer</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded border">
          <p className="font-semibold text-sm mb-3">❌ With useState:</p>
          <p className="text-2xl font-bold mb-2">Count: {count1}</p>
          <p className="text-lg mb-3">Total: {total1}</p>

          <div className="space-y-2">
            <button
              onClick={handleIncrement1}
              className="w-full px-3 py-2 bg-green-500 text-white rounded"
            >
              Increment
            </button>
            <button
              onClick={handleDecrement1}
              className="w-full px-3 py-2 bg-red-500 text-white rounded"
            >
              Decrement
            </button>
          </div>

          <p className="text-xs text-gray-600 mt-3">
            Multiple setState calls, harder to keep in sync
          </p>
        </div>

        <div className="bg-white p-4 rounded border">
          <p className="font-semibold text-sm mb-3">✅ With useReducer:</p>
          <p className="text-2xl font-bold mb-2">Count: {state2.count}</p>
          <p className="text-lg mb-3">Total: {state2.total}</p>

          <div className="space-y-2">
            <button
              onClick={() => dispatch({ type: "INCREMENT" })}
              className="w-full px-3 py-2 bg-green-500 text-white rounded"
            >
              Increment
            </button>
            <button
              onClick={() => dispatch({ type: "DECREMENT" })}
              className="w-full px-3 py-2 bg-red-500 text-white rounded"
            >
              Decrement
            </button>
            <button
              onClick={() => dispatch({ type: "RESET" })}
              className="w-full px-3 py-2 bg-gray-500 text-white rounded"
            >
              Reset
            </button>
          </div>

          <p className="text-xs text-green-600 mt-3">
            Single action updates related state atomically
          </p>
        </div>
      </div>

      <div className="mt-3 bg-yellow-100 p-2 rounded text-xs">
        💡 useReducer keeps related state updates together and atomic!
      </div>
    </div>
  );
}

// ==========================================
// 3. COMPLEX STATE - TODO LIST
// ==========================================
const todoReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [...state.todos, action.payload],
        nextId: state.nextId + 1,
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

    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };

    case "SET_FILTER":
      return {
        ...state,
        filter: action.payload,
      };

    case "CLEAR_COMPLETED":
      return {
        ...state,
        todos: state.todos.filter((todo) => !todo.completed),
      };

    default:
      return state;
  }
};

function TodoListDemo() {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    filter: "all",
    nextId: 1,
  });

  const [input, setInput] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (input.trim()) {
      dispatch({
        type: "ADD_TODO",
        payload: {
          id: state.nextId,
          text: input,
          completed: false,
        },
      });
      setInput("");
    }
  };

  const filteredTodos = state.todos.filter((todo) => {
    if (state.filter === "active") return !todo.completed;
    if (state.filter === "completed") return todo.completed;
    return true;
  });

  const stats = {
    total: state.todos.length,
    active: state.todos.filter((t) => !t.completed).length,
    completed: state.todos.filter((t) => t.completed).length,
  };

  return (
    <div className="p-4 border rounded mb-4 bg-purple-50">
      <h3 className="font-bold text-lg mb-2">3. Complex State - Todo List</h3>

      <div className="bg-white p-4 rounded border">
        <form onSubmit={handleAdd} className="mb-4">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 border px-3 py-2 rounded"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded font-semibold"
            >
              Add
            </button>
          </div>
        </form>

        <div className="flex gap-2 mb-4 text-sm">
          <button
            onClick={() => dispatch({ type: "SET_FILTER", payload: "all" })}
            className={`px-3 py-1 rounded ${
              state.filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => dispatch({ type: "SET_FILTER", payload: "active" })}
            className={`px-3 py-1 rounded ${
              state.filter === "active"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Active ({stats.active})
          </button>
          <button
            onClick={() =>
              dispatch({ type: "SET_FILTER", payload: "completed" })
            }
            className={`px-3 py-1 rounded ${
              state.filter === "completed"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Completed ({stats.completed})
          </button>
          {stats.completed > 0 && (
            <button
              onClick={() => dispatch({ type: "CLEAR_COMPLETED" })}
              className="ml-auto px-3 py-1 bg-red-500 text-white rounded"
            >
              Clear Completed
            </button>
          )}
        </div>

        <div className="space-y-2">
          {filteredTodos.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No todos yet!</p>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() =>
                    dispatch({ type: "TOGGLE_TODO", payload: todo.id })
                  }
                  className="w-5 h-5"
                />
                <span
                  className={`flex-1 ${
                    todo.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() =>
                    dispatch({ type: "DELETE_TODO", payload: todo.id })
                  }
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-3 bg-yellow-100 p-2 rounded text-xs">
        💡 Multiple state values (todos, filter, nextId) managed together!
      </div>
    </div>
  );
}

// ==========================================
// 4. ASYNC ACTIONS
// ==========================================
const dataReducer = (state, action) => {
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
        data: action.payload,
        isLoading: false,
        error: null,
      };

    case "FETCH_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

function AsyncDemo() {
  const [state, dispatch] = useReducer(dataReducer, {
    data: null,
    isLoading: false,
    error: null,
  });

  const fetchData = async () => {
    dispatch({ type: "FETCH_START" });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Randomly succeed or fail
      if (Math.random() > 0.3) {
        const fakeData = {
          id: Math.floor(Math.random() * 1000),
          title: "Sample Data",
          timestamp: new Date().toLocaleTimeString(),
        };
        dispatch({ type: "FETCH_SUCCESS", payload: fakeData });
      } else {
        throw new Error("Random network error!");
      }
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
  };

  return (
    <div className="p-4 border rounded mb-4 bg-orange-50">
      <h3 className="font-bold text-lg mb-2">4. Async Actions Pattern</h3>

      <div className="bg-white p-4 rounded border">
        <button
          onClick={fetchData}
          disabled={state.isLoading}
          className={`w-full px-4 py-3 rounded font-semibold text-white mb-4 ${
            state.isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {state.isLoading ? "Loading..." : "Fetch Data"}
        </button>

        {state.isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Fetching data...</p>
          </div>
        )}

        {state.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error!</p>
            <p className="text-sm">{state.error}</p>
          </div>
        )}

        {state.data && !state.isLoading && (
          <div className="bg-green-100 border border-green-400 px-4 py-3 rounded">
            <p className="font-bold text-green-700">Success!</p>
            <p className="text-sm mt-2">ID: {state.data.id}</p>
            <p className="text-sm">Title: {state.data.title}</p>
            <p className="text-sm">Time: {state.data.timestamp}</p>
          </div>
        )}
      </div>

      <div className="mt-3 bg-gray-800 text-white p-3 rounded text-xs font-mono">
        <p className="font-bold mb-2">State Flow:</p>
        <p>1. Click → dispatch(FETCH_START)</p>
        <p>2. Async operation runs...</p>
        <p>3. Success → dispatch(FETCH_SUCCESS)</p>
        <p>4. Error → dispatch(FETCH_ERROR)</p>
      </div>

      <div className="mt-3 bg-yellow-100 p-2 rounded text-xs">
        💡 Async logic in component, state updates in reducer!
      </div>
    </div>
  );
}

// ==========================================
// 5. ACTION CREATORS
// ==========================================
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      const existing = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };

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
          .filter((item) => item.quantity > 0),
      };

    case "CLEAR_CART":
      return { items: [] };

    default:
      return state;
  }
};

// Action Creators
const cartActions = {
  addItem: (item) => ({
    type: "ADD_ITEM",
    payload: item,
  }),

  removeItem: (id) => ({
    type: "REMOVE_ITEM",
    payload: id,
  }),

  updateQuantity: (id, quantity) => ({
    type: "UPDATE_QUANTITY",
    payload: { id, quantity },
  }),

  clearCart: () => ({
    type: "CLEAR_CART",
  }),
};

const products = [
  { id: 1, name: "Widget", price: 19.99 },
  { id: 2, name: "Gadget", price: 29.99 },
  { id: 3, name: "Doohickey", price: 39.99 },
];

function ActionCreatorsDemo() {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const total = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-4 border rounded mb-4 bg-pink-50">
      <h3 className="font-bold text-lg mb-2">5. Action Creators Pattern</h3>

      <div className="bg-white p-4 rounded border">
        <h4 className="font-semibold mb-3">Products:</h4>
        <div className="space-y-2 mb-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded"
            >
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-600">${product.price}</p>
              </div>
              <button
                onClick={() => dispatch(cartActions.addItem(product))}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3">Cart:</h4>

          {state.items.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Cart is empty</p>
          ) : (
            <>
              <div className="space-y-2 mb-4">
                {state.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        ${item.price} × {item.quantity} = $
                        {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          dispatch(
                            cartActions.updateQuantity(
                              item.id,
                              item.quantity - 1
                            )
                          )
                        }
                        className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          dispatch(
                            cartActions.updateQuantity(
                              item.id,
                              item.quantity + 1
                            )
                          )
                        }
                        className="px-2 py-1 bg-green-500 text-white rounded text-sm"
                      >
                        +
                      </button>
                      <button
                        onClick={() =>
                          dispatch(cartActions.removeItem(item.id))
                        }
                        className="px-2 py-1 bg-gray-500 text-white rounded text-sm ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
                <button
                  onClick={() => dispatch(cartActions.clearCart())}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-3 bg-yellow-100 p-2 rounded text-xs">
        💡 Action creators encapsulate action structure and prevent typos!
      </div>
    </div>
  );
}

// ==========================================
// 6. USEREDUCER + CONTEXT
// ==========================================
const ThemeContext = createContext();

const themeReducer = (state, action) => {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "TOGGLE_THEME":
      return { ...state, theme: state.theme === "light" ? "dark" : "light" };
    case "SET_FONT_SIZE":
      return { ...state, fontSize: action.payload };
    default:
      return state;
  }
};

function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(themeReducer, {
    theme: "light",
    fontSize: "medium",
  });

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

function ContextDemo() {
  return (
    <div className="p-4 border rounded mb-4 bg-indigo-50">
      <h3 className="font-bold text-lg mb-2">6. useReducer + Context</h3>

      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>

      <div className="mt-3 bg-yellow-100 p-2 rounded text-xs">
        💡 useReducer + Context = Simple global state management!
      </div>
    </div>
  );
}

function ThemedApp() {
  const { state, dispatch } = useTheme();

  const bgColor = state.theme === "light" ? "bg-white" : "bg-gray-800";
  const textColor = state.theme === "light" ? "text-gray-900" : "text-white";
  const fontSize =
    state.fontSize === "small"
      ? "text-sm"
      : state.fontSize === "large"
      ? "text-lg"
      : "text-base";

  return (
    <div
      className={`${bgColor} ${textColor} ${fontSize} p-4 rounded border transition-all`}
    >
      <div className="mb-4">
        <label className="block font-semibold mb-2">Theme:</label>
        <div className="flex gap-2">
          <button
            onClick={() => dispatch({ type: "SET_THEME", payload: "light" })}
            className={`px-4 py-2 rounded ${
              state.theme === "light" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Light
          </button>
          <button
            onClick={() => dispatch({ type: "SET_THEME", payload: "dark" })}
            className={`px-4 py-2 rounded ${
              state.theme === "dark" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Dark
          </button>
          <button
            onClick={() => dispatch({ type: "TOGGLE_THEME" })}
            className="px-4 py-2 bg-purple-500 text-white rounded"
          >
            Toggle
          </button>
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Font Size:</label>
        <div className="flex gap-2">
          <button
            onClick={() =>
              dispatch({ type: "SET_FONT_SIZE", payload: "small" })
            }
            className={`px-4 py-2 rounded ${
              state.fontSize === "small"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-900"
            }`}
          >
            Small
          </button>
          <button
            onClick={() =>
              dispatch({ type: "SET_FONT_SIZE", payload: "medium" })
            }
            className={`px-4 py-2 rounded ${
              state.fontSize === "medium"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-900"
            }`}
          >
            Medium
          </button>
          <button
            onClick={() =>
              dispatch({ type: "SET_FONT_SIZE", payload: "large" })
            }
            className={`px-4 py-2 rounded ${
              state.fontSize === "large"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-900"
            }`}
          >
            Large
          </button>
        </div>
      </div>

      <p className="mt-4">
        This text adapts to the theme and font size settings!
      </p>
    </div>
  );
}

// ==========================================
// 7. COMMON MISTAKES
// ==========================================
function CommonMistakes() {
  return (
    <div className="p-4 border rounded bg-red-50">
      <h3 className="font-bold text-lg mb-2">7. Common Mistakes to Avoid</h3>

      <div className="space-y-3">
        <div className="bg-white p-3 rounded border">
          <p className="font-semibold text-red-600 text-sm mb-2">
            ❌ Mistake 1: Mutating state directly
          </p>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {`// ❌ WRONG
state.items.push(newItem);
return state;

// ✅ CORRECT
return {
  ...state,
  items: [...state.items, newItem]
};`}
          </pre>
        </div>

        <div className="bg-white p-3 rounded border">
          <p className="font-semibold text-red-600 text-sm mb-2">
            ❌ Mistake 2: Side effects in reducer
          </p>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {`// ❌ WRONG - API call in reducer
case 'FETCH_DATA':
  fetch('/api').then(data => /* can't dispatch here */);
  return state;

// ✅ CORRECT - Async in component
const handleFetch = async () => {
  dispatch({ type: 'FETCH_START' });
  const data = await fetch('/api');
  dispatch({ type: 'FETCH_SUCCESS', payload: data });
};`}
          </pre>
        </div>

        <div className="bg-white p-3 rounded border">
          <p className="font-semibold text-red-600 text-sm mb-2">
            ❌ Mistake 3: No default case
          </p>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {`// ❌ WRONG - No default
switch (action.type) {
  case 'INCREMENT':
    return { count: state.count + 1 };
  // Typo in action type returns undefined!
}

// ✅ CORRECT - Handle unknown actions
default:
  throw new Error(\`Unknown action: \${action.type}\`);
  // or return state;`}
          </pre>
        </div>

        <div className="bg-white p-3 rounded border">
          <p className="font-semibold text-red-600 text-sm mb-2">
            ❌ Mistake 4: Not memoizing with Context
          </p>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {`// ❌ WRONG - New object every render
<Context.Provider value={{ state, dispatch }}>

// ✅ CORRECT - Memoize value
const value = useMemo(() => ({ state, dispatch }), [state]);
<Context.Provider value={value}>`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN APP
// ==========================================
export default function App() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2 text-center">
        useReducer - Interview Master Guide
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Complex state management with the reducer pattern
      </p>

      <BasicReducerDemo />
      <StateVsReducer />
      <TodoListDemo />
      <AsyncDemo />
      <ActionCreatorsDemo />
      <ContextDemo />
      <CommonMistakes />

      <div className="mt-6 p-4 bg-white border-2 border-gray-300 rounded">
        <h3 className="font-bold mb-2">🎯 useReducer Interview Checklist:</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>✅ Reducer signature: (state, action) ={">"} newState</li>
          <li>✅ Reducers must be pure functions (no side effects)</li>
          <li>✅ Always return new state (immutable updates)</li>
          <li>✅ Actions have type and optional payload</li>
          <li>✅ Use for complex state with multiple sub-values</li>
          <li>✅ Use when state updates depend on previous state</li>
          <li>✅ Handle async in components, not reducers</li>
          <li>✅ Always include default case in reducer</li>
          <li>✅ Action creators prevent typos and encapsulate logic</li>
          <li>✅ Works great with Context for global state</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded border-2 border-blue-300">
        <h3 className="font-bold mb-2">🔑 When to Use:</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-green-700 mb-2">
              ✅ Use useReducer:
            </p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Complex state with sub-values</li>
              <li>Multiple related state updates</li>
              <li>State transitions depend on prev state</li>
              <li>Want to centralize state logic</li>
              <li>Testing is important</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-blue-700 mb-2">✅ Use useState:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Simple independent state</li>
              <li>Few state variables</li>
              <li>Simple state updates</li>
              <li>No complex dependencies</li>
              <li>Keep it simple!</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-yellow-100 rounded border-2 border-yellow-300">
        <h3 className="font-bold mb-2">⚡ Key Differences from Redux:</h3>
        <div className="text-sm space-y-1">
          <p>• useReducer: Local/tree-scoped state (with Context)</p>
          <p>• Redux: Global app state with middleware</p>
          <p>• useReducer: Built into React, zero dependencies</p>
          <p>• Redux: Separate library, more features (DevTools, middleware)</p>
          <p>• useReducer: Perfect for medium complexity</p>
          <p>• Redux: Better for large apps with complex state</p>
        </div>
      </div>
    </div>
  );
}
