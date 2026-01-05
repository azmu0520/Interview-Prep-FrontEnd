# useRef - Complete Interview Guide

## 🎯 Key Concepts

### 1. What is useRef?

**Core Understanding:**

- `useRef` returns a **mutable ref object** with a `.current` property
- The ref object **persists across renders** (doesn't get recreated)
- Changing `.current` **does NOT trigger re-renders**
- It's like a "box" that can hold any mutable value

**The Two Main Use Cases:**

```javascript
// USE CASE 1: Accessing DOM elements
function Component() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus(); // Direct DOM manipulation
  };

  return <input ref={inputRef} />;
}

// USE CASE 2: Storing mutable values
function Component() {
  const countRef = useRef(0);

  const increment = () => {
    countRef.current += 1; // Doesn't trigger re-render
    console.log(countRef.current);
  };

  return <button onClick={increment}>Click</button>;
}
```

---

### 2. DOM Element References

**Basic Pattern:**

```javascript
function Component() {
  const inputRef = useRef(null);

  // After first render, inputRef.current points to the DOM node
  useEffect(() => {
    console.log(inputRef.current); // <input> element
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} placeholder="I'll be focused" />;
}
```

**Common DOM Operations:**

```javascript
function MediaPlayer() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const play = () => videoRef.current.play();
  const pause = () => videoRef.current.pause();
  const seek = (time) => (videoRef.current.currentTime = time);

  const captureFrame = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
  };

  return (
    <>
      <video ref={videoRef} src="video.mp4" />
      <canvas ref={canvasRef} />
      <button onClick={play}>Play</button>
      <button onClick={pause}>Pause</button>
      <button onClick={captureFrame}>Capture</button>
    </>
  );
}
```

**Measuring DOM Elements:**

```javascript
function ResizeAware() {
  const divRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (divRef.current) {
        setDimensions({
          width: divRef.current.offsetWidth,
          height: divRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div ref={divRef}>
      Width: {dimensions.width}px, Height: {dimensions.height}px
    </div>
  );
}
```

---

### 3. Mutable Value Storage (Persists Across Renders)

**Key Difference from State:**

```javascript
// State: Triggers re-render when changed
function WithState() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount((c) => c + 1); // Component re-renders
  };

  return <div>{count}</div>; // Shows updated value
}

// Ref: Does NOT trigger re-render
function WithRef() {
  const countRef = useRef(0);

  const increment = () => {
    countRef.current += 1; // No re-render
    console.log(countRef.current); // Logs new value
  };

  return <div>{countRef.current}</div>; // Won't update on screen!
}
```

**When to Use Refs for Values:**

✅ **Good use cases:**

- Storing interval/timeout IDs
- Keeping track of previous values
- Storing subscription objects
- Caching values that don't affect render
- Avoiding stale closures

❌ **Don't use refs for:**

- Data that should trigger re-renders
- Data that should be displayed in UI
- Data that should be in the React lifecycle

---

### 4. Doesn't Trigger Re-renders When Changed

**The Core Behavior:**

```javascript
function RenderCounter() {
  const [count, setCount] = useState(0);
  const renderCount = useRef(0);

  // This runs on every render
  renderCount.current += 1;

  return (
    <div>
      <p>State count: {count}</p>
      <p>Render count: {renderCount.current}</p>
      <button onClick={() => setCount((c) => c + 1)}>
        Increment State (triggers re-render)
      </button>
    </div>
  );
}
```

**Practical Example - Tracking Clicks:**

```javascript
function ClickTracker() {
  const [lastRender, setLastRender] = useState(Date.now());
  const totalClicksRef = useRef(0);

  const handleClick = () => {
    totalClicksRef.current += 1;
    console.log(`Total clicks: ${totalClicksRef.current}`);
    // No re-render, so UI doesn't update
  };

  const showStats = () => {
    setLastRender(Date.now()); // Trigger re-render to show updated ref
  };

  return (
    <>
      <button onClick={handleClick}>Click me</button>
      <button onClick={showStats}>Show Stats</button>
      <p>Total clicks: {totalClicksRef.current}</p>
      <p>Last updated: {new Date(lastRender).toLocaleTimeString()}</p>
    </>
  );
}
```

---

### 5. Accessing Previous Values

**Classic Pattern - Previous State:**

```javascript
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value; // Update after render
  });

  return ref.current; // Return previous value
}

function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <p>Difference: {count - (prevCount || 0)}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}
```

**How It Works:**

```javascript
// Render 1: count = 0
// - prevCount = undefined (ref.current not set yet)
// - After render: ref.current = 0

// Render 2: count = 1
// - prevCount = 0 (ref.current from last render)
// - After render: ref.current = 1

// Render 3: count = 2
// - prevCount = 1 (ref.current from last render)
// - After render: ref.current = 2
```

**Comparing Previous Props:**

```javascript
function ProductCard({ product }) {
  const prevProduct = usePrevious(product);

  useEffect(() => {
    if (prevProduct && prevProduct.id !== product.id) {
      console.log(
        `Product changed from ${prevProduct.name} to ${product.name}`
      );
      // Trigger animation, fetch new data, etc.
    }
  }, [product, prevProduct]);

  return <div>{product.name}</div>;
}
```

---

### 6. Storing Timers/Intervals

**Proper Cleanup Pattern:**

```javascript
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const start = () => {
    if (intervalRef.current) return; // Already running

    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };

  const reset = () => {
    stop();
    setSeconds(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div>
      <p>Seconds: {seconds}</p>
      <button onClick={start} disabled={isRunning}>
        Start
      </button>
      <button onClick={stop} disabled={!isRunning}>
        Stop
      </button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

**Why Use Ref for Timer ID:**

```javascript
// ❌ WRONG - using state for timer ID
function BadTimer() {
  const [seconds, setSeconds] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const start = () => {
    const id = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    setIntervalId(id); // Causes re-render! Unnecessary!
  };

  // ...
}

// ✅ CORRECT - using ref for timer ID
function GoodTimer() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  const start = () => {
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    // No re-render, perfect!
  };

  // ...
}
```

**Debounce with Timeout:**

```javascript
function SearchInput() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const timeoutRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      fetch(`/api/search?q=${value}`)
        .then((res) => res.json())
        .then(setResults);
    }, 500);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <input value={query} onChange={handleChange} />
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </>
  );
}
```

---

### 7. Imperative DOM Manipulation

**When You Need It:**

```javascript
function ScrollToTop() {
  const containerRef = useRef(null);

  const scrollToTop = () => {
    containerRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div ref={containerRef} style={{ height: "400px", overflow: "auto" }}>
      {/* Long content */}
      <button onClick={scrollToTop}>Scroll to Top</button>
    </div>
  );
}
```

**Focus Management:**

```javascript
function LoginForm() {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    if (!username) {
      setError("Username required");
      usernameRef.current.focus();
      return;
    }

    if (!password) {
      setError("Password required");
      passwordRef.current.focus();
      return;
    }

    // Submit...
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={usernameRef} placeholder="Username" />
      <input ref={passwordRef} type="password" placeholder="Password" />
      {error && <p className="error">{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
```

**Animation Control:**

```javascript
function AnimatedBox() {
  const boxRef = useRef(null);

  const animate = () => {
    const element = boxRef.current;

    // Use Web Animations API
    element.animate(
      [{ transform: "translateX(0px)" }, { transform: "translateX(300px)" }],
      {
        duration: 1000,
        easing: "ease-in-out",
      }
    );
  };

  return (
    <>
      <div
        ref={boxRef}
        style={{ width: 100, height: 100, background: "blue" }}
      />
      <button onClick={animate}>Animate</button>
    </>
  );
}
```

---

### 8. Forwarding Refs (forwardRef)

**The Problem:**

```javascript
// ❌ This doesn't work - functional components don't have refs
function MyInput(props) {
  return <input {...props} />;
}

function Parent() {
  const inputRef = useRef(null);
  return <MyInput ref={inputRef} />; // Warning! Can't add ref to function component
}
```

**The Solution - forwardRef:**

```javascript
// ✅ Use forwardRef to pass ref through
const MyInput = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});

function Parent() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <>
      <MyInput ref={inputRef} placeholder="Type here" />
      <button onClick={focusInput}>Focus Input</button>
    </>
  );
}
```

**Complex Example - Custom Input Component:**

```javascript
const FancyInput = forwardRef(({ label, error, ...props }, ref) => {
  return (
    <div className="fancy-input">
      {label && <label>{label}</label>}
      <input ref={ref} {...props} className={error ? "error" : ""} />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
});

function Form() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!emailRef.current.value) {
      emailRef.current.focus();
      return;
    }

    if (!passwordRef.current.value) {
      passwordRef.current.focus();
      return;
    }

    // Submit...
  };

  return (
    <form onSubmit={handleSubmit}>
      <FancyInput ref={emailRef} label="Email" type="email" />
      <FancyInput ref={passwordRef} label="Password" type="password" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

**With useImperativeHandle:**

```javascript
const VideoPlayer = forwardRef((props, ref) => {
  const videoRef = useRef(null);

  useImperativeHandle(ref, () => ({
    play: () => videoRef.current.play(),
    pause: () => videoRef.current.pause(),
    seek: (time) => (videoRef.current.currentTime = time),
  }));

  return <video ref={videoRef} src={props.src} />;
});

function App() {
  const playerRef = useRef(null);

  return (
    <>
      <VideoPlayer ref={playerRef} src="video.mp4" />
      <button onClick={() => playerRef.current.play()}>Play</button>
      <button onClick={() => playerRef.current.pause()}>Pause</button>
      <button onClick={() => playerRef.current.seek(10)}>Skip to 10s</button>
    </>
  );
}
```

---

## 🎤 Top Interview Questions & Model Answers

### Q1: What's the difference between useRef and useState?

**Answer:**

> "The fundamental difference is that useState triggers re-renders when the state changes, while useRef doesn't. With useState, when you call setState, React re-renders the component and the new value appears in the UI. With useRef, when you change ref.current, nothing happens visually - the component doesn't re-render. Both persist values across renders, but they serve different purposes. Use useState for data that should be displayed in the UI and cause updates. Use useRef for mutable values that don't need to trigger re-renders, like timer IDs, previous values, or DOM references. Another key difference: useState updates are asynchronous and batched, while ref updates are immediate and synchronous."

**Code Comparison:**

```javascript
// useState: Triggers re-render, UI updates
const [count, setCount] = useState(0);
setCount(1); // Component re-renders, UI shows "1"

// useRef: No re-render, UI doesn't update
const countRef = useRef(0);
countRef.current = 1; // No re-render, UI still shows old value
```

---

### Q2: When would you use useRef instead of state?

**Answer:**

> "I use useRef in four main scenarios: First, for accessing DOM elements directly - when I need to call methods like focus(), measure dimensions, or control media playback. Second, for storing mutable values that shouldn't trigger re-renders, like timer IDs from setInterval or setTimeout. Third, for keeping track of previous values from props or state, using the pattern where you update the ref after each render. Fourth, for storing any value that needs to persist across renders but doesn't affect what's displayed, like WebSocket connections, subscription objects, or flags that track whether a component is mounted. The key question I ask is: 'Does changing this value need to update the UI?' If no, useRef is probably the right choice."

---

### Q3: How does useRef work internally / what does it return?

**Answer:**

> "useRef returns a plain JavaScript object with a single property called 'current'. React keeps this object in memory for the lifetime of the component - it creates it on the first render and returns the same object on every subsequent render. The object is mutable, so you can change ref.current at any time without triggering re-renders. When you pass a ref to a JSX element like <div ref={myRef}>, React automatically sets myRef.current to the DOM node after the element is created. The key insight is that it's just a persistent object - React doesn't do anything special when you change ref.current, which is why it doesn't trigger re-renders. You can think of it as instance variables in class components, but for functional components."

---

### Q4: What is ref forwarding and why is it needed?

**Answer:**

> "Ref forwarding is a technique to pass a ref through a component to one of its children. It's needed because functional components don't have instances, so you can't attach refs to them directly. If you try to pass a ref to a functional component without forwardRef, React warns you and ignores it. By wrapping your component with forwardRef, you get access to the ref as a second parameter, and you can then pass it down to a DOM element or another component. This is essential for creating reusable component libraries where parent components need access to the underlying DOM nodes. For example, a custom Input component might need to expose focus() functionality to its parent, which requires forwarding the ref to the actual input element."

---

### Q5: Can you explain a use case for storing previous values with useRef?

**Answer:**

> "A classic use case is tracking whether a value has actually changed in useEffect. Let me give you a concrete example: imagine you're fetching user data based on a userId prop, but you want to avoid refetching if the user just toggled a theme or some other unrelated state changed. You can store the previous userId in a ref and compare it in useEffect. Another common case is animations - you might want to animate only when a value increases, not decreases. By storing the previous value in a ref and comparing it with the current value, you can determine the direction of change. The pattern is: read the ref at the start of the render, use it for comparisons, then update it in a useEffect after the render completes. This gives you access to both the previous and current values during the same render cycle."

---

### Q6: Why use useRef for timer IDs instead of state?

**Answer:**

> "Using state for timer IDs would be wasteful and could cause bugs. Every time you update state, React re-renders the component. Timer IDs are just numbers that you need to store so you can cancel the timer later - there's no reason to re-render just because you stored a timer ID. With useRef, you can store the ID without causing any re-renders. Additionally, using state could introduce timing bugs - when you call setState, the update isn't immediate, so if you try to clear the interval right after setting the state, you might not have the ID yet. With refs, the assignment is immediate and synchronous. It's the perfect tool for values that are 'behind the scenes' and don't affect the UI directly."

---

### Q7: What are callback refs and when would you use them?

**Answer:**

> "Callback refs are an alternative to ref objects where you pass a function instead of a ref object to the ref prop. React calls your function with the DOM node when the component mounts, and calls it with null when it unmounts. They're useful when you need to do something immediately when the ref is set, without waiting for a useEffect to run. For example, measuring a DOM element's dimensions right after it mounts, or integrating with third-party libraries that expect a DOM node. Another use case is dynamic refs, like ref lists where you don't know how many refs you need upfront. The callback ref pattern gives you more control and timing precision than ref objects, but for most cases, the simpler useRef pattern is sufficient."

**Code Example:**

```javascript
function Component() {
  const [height, setHeight] = useState(0);

  // Callback ref - called immediately when element mounts
  const measureRef = useCallback((node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return <div ref={measureRef}>Height: {height}px</div>;
}
```

---

## 🚨 Common Mistakes to Avoid

### 1. Using Refs for Values That Should Be State

```javascript
// ❌ WRONG - UI won't update
function Counter() {
  const countRef = useRef(0);

  const increment = () => {
    countRef.current += 1;
    // UI still shows 0!
  };

  return (
    <div>
      <p>Count: {countRef.current}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

// ✅ CORRECT - use state for UI values
function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount((c) => c + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

### 2. Accessing ref.current During Render

```javascript
// ❌ WRONG - ref.current is null during first render
function Component() {
  const inputRef = useRef(null);

  // This crashes on first render!
  inputRef.current.focus();

  return <input ref={inputRef} />;
}

// ✅ CORRECT - access in useEffect or event handler
function Component() {
  const inputRef = useRef(null);

  useEffect(() => {
    // ref.current is set after render
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} />;
}
```

### 3. Not Cleaning Up Timers/Subscriptions

```javascript
// ❌ WRONG - timer keeps running after unmount
function Timer() {
  const intervalRef = useRef(null);

  const start = () => {
    intervalRef.current = setInterval(() => {
      console.log("tick");
    }, 1000);
  };

  // No cleanup!

  return <button onClick={start}>Start</button>;
}

// ✅ CORRECT - cleanup in useEffect
function Timer() {
  const intervalRef = useRef(null);

  const start = () => {
    intervalRef.current = setInterval(() => {
      console.log("tick");
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return <button onClick={start}>Start</button>;
}
```

### 4. Forgetting forwardRef for Custom Components

```javascript
// ❌ WRONG - ref doesn't work
function CustomInput(props) {
  return <input {...props} />;
}

function Parent() {
  const inputRef = useRef(null);
  // inputRef.current will be undefined!
  return <CustomInput ref={inputRef} />;
}

// ✅ CORRECT - use forwardRef
const CustomInput = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});

function Parent() {
  const inputRef = useRef(null);
  // inputRef.current will point to the input element
  return <CustomInput ref={inputRef} />;
}
```

### 5. Creating Refs Inside Loops/Conditions

```javascript
// ❌ WRONG - breaks Rules of Hooks
function List({ items }) {
  return items.map((item) => {
    const ref = useRef(null); // Hook inside loop!
    return (
      <div key={item.id} ref={ref}>
        {item.name}
      </div>
    );
  });
}

// ✅ CORRECT - use refs array or callback refs
function List({ items }) {
  const refsRef = useRef({});

  return items.map((item) => (
    <div key={item.id} ref={(el) => (refsRef.current[item.id] = el)}>
      {item.name}
    </div>
  ));
}
```

---

## 🔑 Interview Checklist

### ✅ Must Know (Will definitely be asked)

- ✅ What useRef does (returns mutable ref object)
- ✅ Difference between useRef and useState
- ✅ Accessing DOM elements with refs
- ✅ Refs don't trigger re-renders
- ✅ When to use refs vs state

### ✅ Should Know (Often asked)

- ✅ Storing previous values pattern
- ✅ Timer/interval storage
- ✅ forwardRef for custom components
- ✅ Ref cleanup in useEffect
- [ ] Callback refs

### ✅ Nice to Know (Senior level)

- [ ] useImperativeHandle with forwardRef
- [ ] Ref in dependency arrays (usually don't include)
- [ ] Measuring DOM elements
- [ ] Integrating with third-party DOM libraries

---

## 💡 Pro Tips for Interviews

1. **Explain the "no re-render" behavior**: This is the key differentiator from state
2. **Give real examples**: Focus management, timers, previous values
3. **Know when NOT to use refs**: Don't use for values that affect UI
4. **Understand ref lifecycle**: null initially, set after mount
5. **Show cleanup knowledge**: Always cleanup timers/subscriptions

---

## 📚 Quick Reference

```javascript
// Basic ref for DOM element
const inputRef = useRef(null);
<input ref={inputRef} />
inputRef.current.focus(); // Access DOM node

// Ref for mutable value
const countRef = useRef(0);
countRef.current += 1; // No re-render

// Ref with initial value
const timerRef = useRef(null);
timerRef.current = setInterval(...);

// Previous value pattern
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// Forward ref
const MyComponent = forwardRef((props, ref) => {
  return <div ref={ref}>...</div>;
});

// Callback ref
<div ref={node => {
  if (node) {
    // Do something with node
  }
}} />

// Ref array
const refsRef = useRef({});
<div ref={el => refsRef.current[id] = el} />

// Cleanup pattern
useEffect(() => {
  return () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };
}, []);
```

---

## 🎯 The Golden Rules

1. **"Refs are for values that don't affect the output"** - If it affects what's rendered, use state
2. **"Refs are synchronous"** - Unlike state, ref updates are immediate
3. **"Refs persist across renders"** - The same object is returned every time
4. **"Always cleanup side effects"** - Clear timers, unsubscribe, cleanup refs in useEffect return

---

## 🔗 Common Patterns

### Pattern 1: Focus Management

```javascript
const inputRef = useRef(null);
useEffect(() => {
  inputRef.current?.focus();
}, []);
```

### Pattern 2: Previous Value Tracking

```javascript
const prevValueRef = useRef();
useEffect(() => {
  prevValueRef.current = value;
});
const prevValue = prevValueRef.current;
```

### Pattern 3: Timer Management

```javascript
const timerRef = useRef(null);
const startTimer = () => {
  timerRef.current = setInterval(() => {...}, 1000);
};
useEffect(() => () => clearInterval(timerRef.current), []);
```

### Pattern 4: Conditional Ref Assignment

```javascript
<div ref={shouldTrack ? divRef : null} />
```

---

**Remember:** useRef is for "side effects" of your component - accessing the DOM, storing mutable values, keeping track of state without causing re-renders. It's React's way of giving you an "escape hatch" from the declarative paradigm when you need it!
