# Virtual Scrolling & Windowing - Complete Interview Guide

## 🎯 Key Concepts

### 1. Virtual Scrolling Concept

**What is Virtual Scrolling?**

Virtual scrolling (also called windowing) is a technique where you only render the items currently visible in the viewport, plus a small buffer. Instead of rendering 10,000 list items, you might only render 20 visible items at a time.

**The Problem It Solves:**

```javascript
// ❌ WITHOUT virtual scrolling - renders ALL items
function ProductList({ products }) {
  return (
    <div style={{ height: "600px", overflow: "auto" }}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
// With 10,000 products:
// - 10,000 DOM nodes created
// - Browser struggles to render
// - Scrolling is janky
// - Initial render takes seconds

// ✅ WITH virtual scrolling - renders only visible items
function ProductList({ products }) {
  return (
    <VirtualList height={600} itemCount={products.length} itemSize={80}>
      {({ index, style }) => (
        <ProductCard
          key={products[index].id}
          product={products[index]}
          style={style}
        />
      )}
    </VirtualList>
  );
}
// Only renders ~20 items at a time
// Smooth scrolling
// Fast initial render
```

**How It Works:**

1. Calculate which items are visible based on scroll position
2. Render only those items
3. Add padding top/bottom to maintain scroll height
4. Update rendered items as user scrolls

```
Scroll Container (600px height)
│
├─ Padding Top (items 0-49 not rendered, but space reserved)
│
├─ Item 50 (rendered)
├─ Item 51 (rendered)
├─ Item 52 (rendered)
│  ... (only visible items)
├─ Item 69 (rendered)
│
└─ Padding Bottom (items 70-9999 not rendered, but space reserved)
```

---

### 2. react-window Library

**Most Popular Virtual Scrolling Library:**

- Created by Brian Vaughn (React core team)
- Lightweight (~3KB gzipped)
- Simple API
- Supports fixed and variable heights
- Handles horizontal and vertical scrolling

**Installation:**

```bash
npm install react-window
```

**Basic Usage:**

```javascript
import { FixedSizeList } from "react-window";

function MyList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>{items[index].name}</div>
  );

  return (
    <FixedSizeList
      height={600} // Container height
      itemCount={items.length} // Total items
      itemSize={50} // Height of each item
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

**Component Types:**

```javascript
// Fixed height items
import { FixedSizeList } from "react-window";

// Variable height items
import { VariableSizeList } from "react-window";

// Grid (2D scrolling)
import { FixedSizeGrid } from "react-window";

// Variable height grid
import { VariableSizeGrid } from "react-window";
```

---

### 3. react-virtualized Library

**More Feature-Rich Alternative:**

- Older, more established library
- More components and features
- Larger bundle size (~30KB gzipped)
- More complex API
- Better for complex use cases

**When to Use react-virtualized:**

- Need advanced features (masonry layout, infinite loading)
- Need AutoSizer, WindowScroller
- Already using it (migration is non-trivial)

**When to Use react-window:**

- New projects
- Want smaller bundle size
- Simpler use case
- Fixed or simple variable heights

**Basic Example:**

```javascript
import { List, AutoSizer } from "react-virtualized";

function MyList({ items }) {
  const rowRenderer = ({ index, key, style }) => (
    <div key={key} style={style}>
      {items[index].name}
    </div>
  );

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          height={height}
          rowCount={items.length}
          rowHeight={50}
          rowRenderer={rowRenderer}
          width={width}
        />
      )}
    </AutoSizer>
  );
}
```

---

### 4. Fixed Size vs Variable Size Lists

**Fixed Size List:**

All items have the same height. Simplest and most performant.

```javascript
import { FixedSizeList } from "react-window";

<FixedSizeList
  height={600}
  itemCount={1000}
  itemSize={80} // All items are 80px tall
  width="100%"
>
  {Row}
</FixedSizeList>;
```

**Variable Size List:**

Items can have different heights. More complex, requires calculating heights.

```javascript
import { VariableSizeList } from "react-window";

const getItemSize = (index) => {
  // Return height for specific item
  return items[index].isExpanded ? 200 : 80;
};

<VariableSizeList
  height={600}
  itemCount={1000}
  itemSize={getItemSize} // Function that returns height
  width="100%"
>
  {Row}
</VariableSizeList>;
```

**When to Use Each:**

```javascript
// ✅ Fixed size when:
// - All items same height
// - Cards with consistent layout
// - Simple lists
// - Best performance

// ✅ Variable size when:
// - Items have different heights
// - Expandable/collapsible items
// - Dynamic content
// - More complex but necessary
```

---

### 5. Performance Characteristics

**DOM Nodes Comparison:**

```javascript
// Without virtualization
// 10,000 items × 1 div each = 10,000 DOM nodes
// Browser limit: ~10,000 nodes before slowdown

// With virtualization
// ~20 visible items × 1 div each = 20 DOM nodes
// 500x fewer nodes!
```

**Memory Usage:**

```javascript
// Without virtualization
const items = Array(10000)
  .fill()
  .map((_, i) => ({
    id: i,
    rendered: true, // All in DOM
  }));
// Memory: ~100MB+ for DOM nodes

// With virtualization
// Only renders ~20 items at a time
// Memory: ~2MB for DOM nodes
// 50x less memory!
```

**Rendering Performance:**

```javascript
// Without virtualization
// Initial render: 2-5 seconds
// Re-render all items: 1-3 seconds
// Scroll frame rate: 15-30 FPS (janky)

// With virtualization
// Initial render: 50-100ms
// Re-render visible items: 16ms
// Scroll frame rate: 60 FPS (smooth)
```

**When Virtualization Helps:**

- ✅ Lists with 100+ items
- ✅ Lists with 1000+ items (essential!)
- ✅ Complex item components
- ✅ Infinite scrolling
- ✅ Mobile devices (limited memory)

**When It's Overkill:**

- ❌ Lists with <50 items
- ❌ Simple text-only items
- ❌ Lists that don't scroll
- ❌ Adds complexity for minimal gain

---

### 6. Infinite Loading Integration

**Pattern: Load More on Scroll:**

```javascript
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

function InfiniteList() {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreItems = async (startIndex, stopIndex) => {
    const newItems = await fetchItems(startIndex, stopIndex);
    setItems((prev) => [...prev, ...newItems]);

    if (newItems.length === 0) {
      setHasMore(false);
    }
  };

  const isItemLoaded = (index) => !hasMore || index < items.length;

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={hasMore ? items.length + 1 : items.length}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeList
          height={600}
          itemCount={items.length}
          itemSize={80}
          onItemsRendered={onItemsRendered}
          ref={ref}
          width="100%"
        >
          {Row}
        </FixedSizeList>
      )}
    </InfiniteLoader>
  );
}
```

**With Loading Indicators:**

```javascript
const Row = ({ index, style }) => {
  const isLoading = !isItemLoaded(index);

  if (isLoading) {
    return (
      <div style={style}>
        <Skeleton />
      </div>
    );
  }

  return <div style={style}>{items[index].name}</div>;
};
```

---

### 7. Styling and Layout Considerations

**Positioning:**

Virtual lists use absolute positioning internally:

```javascript
// react-window generates this:
<div
  style={{
    position: "absolute",
    top: "4000px", // Calculated based on scroll
    height: "80px",
    width: "100%",
  }}
>
  Item content
</div>
```

**Custom Styling:**

```javascript
import { FixedSizeList } from "react-window";

const Row = ({ index, style }) => (
  <div
    style={{
      ...style,
      // Add your custom styles
      padding: "10px",
      borderBottom: "1px solid #ccc",
    }}
  >
    {items[index].name}
  </div>
);

// Or use className
const Row = ({ index, style }) => (
  <div style={style} className="list-item">
    {items[index].name}
  </div>
);
```

**Grid Layouts:**

```javascript
import { FixedSizeGrid } from "react-window";

const Cell = ({ columnIndex, rowIndex, style }) => (
  <div style={style}>
    Row {rowIndex}, Column {columnIndex}
  </div>
);

<FixedSizeGrid
  columnCount={5}
  columnWidth={200}
  height={600}
  rowCount={1000}
  rowHeight={80}
  width={1000}
>
  {Cell}
</FixedSizeGrid>;
```

**Responsive Sizing:**

```javascript
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

<AutoSizer>
  {({ height, width }) => (
    <FixedSizeList
      height={height}
      itemCount={items.length}
      itemSize={80}
      width={width}
    >
      {Row}
    </FixedSizeList>
  )}
</AutoSizer>;
```

---

## 🎤 Top Interview Questions & Model Answers

### Q1: What is virtual scrolling and why is it needed?

**Answer:**

> "Virtual scrolling, also called windowing, is a technique where you only render the items currently visible in the viewport, rather than rendering the entire list. For example, if you have a list of 10,000 items but only 20 fit on screen, virtual scrolling renders just those 20 items plus a small buffer, and updates which items are rendered as the user scrolls. It's needed because rendering thousands of DOM nodes causes serious performance problems - the initial render is slow, scrolling becomes janky, and memory usage spikes. I've worked on a project where we had a table with 5,000 rows, and without virtual scrolling it took 3-4 seconds to render and scrolling was at 15-20 FPS. After implementing react-window, initial render was under 100ms and scrolling was smooth 60 FPS. The key is that most of those items are never seen by the user, so rendering them is wasted work."

---

### Q2: How does virtual scrolling work technically?

**Answer:**

> "Virtual scrolling works by calculating which items are visible based on the scroll position and only rendering those items. Here's the process: First, you define the total height of the scrollable area based on the number of items and item height. Then, as the user scrolls, you calculate which items should be visible - typically by dividing scroll position by item height to get the start index. You render only those visible items plus a small buffer above and below for smooth scrolling. Importantly, you add padding-top and padding-bottom elements to maintain the total scroll height, so the scrollbar behaves correctly. The rendered items are absolutely positioned at their correct vertical position. When the user scrolls, you recalculate which items should be visible and update the DOM. Libraries like react-window handle all this math for you, but understanding the concept is important for debugging and optimization."

---

### Q3: When should you use virtual scrolling?

**Answer:**

> "Virtual scrolling should be used when you have large lists, typically 100+ items, especially if each item is complex with multiple DOM nodes. It's essential for lists with 1,000+ items - without it, the app becomes unusable. I also use it for infinite scroll scenarios, mobile apps where memory is limited, and when users have reported performance issues with scrolling. However, I don't use it for small lists under 50 items - the complexity isn't worth it and you might not see any benefit. It's also overkill for simple text-only lists where rendering 500 items takes 50ms anyway. The decision comes down to measuring - if initial render takes more than 200-300ms or scrolling isn't smooth 60 FPS, virtual scrolling is the solution."

---

### Q4: What are the differences between react-window and react-virtualized?

**Answer:**

> "React-window is the newer, lightweight library by the same author - Brian Vaughn from the React team. It's a complete rewrite focused on being smaller (3KB vs 30KB) and simpler. React-virtualized is the older library with more features like AutoSizer, masonry layout, and advanced scrolling patterns, but it has a larger bundle size and more complex API. For new projects, I default to react-window because it handles 90% of use cases with a much smaller footprint. I only reach for react-virtualized when I need specific features like WindowScroller or when working on a project that already uses it. React-window covers fixed and variable size lists and grids, which handles most real-world scenarios. The API is cleaner too - react-window uses render props while react-virtualized uses class-based components."

---

### Q5: How do you handle variable height items in a virtualized list?

**Answer:**

> "Variable height items are trickier because the library can't pre-calculate positions without knowing heights. React-window provides VariableSizeList for this. You provide an itemSize function that returns the height for each index. The challenge is you need to know or estimate heights beforehand. One approach is to measure items once and cache their heights. Another is to have a default estimated height and dynamically update as items render, though this can cause scroll position jumps. For best performance, I try to design UIs with fixed heights when possible, or use a few distinct sizes rather than truly variable. If you absolutely need variable heights, you might need to implement a more sophisticated solution that measures items, caches heights, and resets the list's cache when heights change. For complex cases, I've used react-virtualized's CellMeasurer which handles measurement automatically."

---

### Q6: How do you integrate infinite loading with virtual scrolling?

**Answer:**

> "I use react-window-infinite-loader which provides the InfiniteLoader component. It wraps your virtual list and calls a loadMoreItems function when the user scrolls near the end. You provide an isItemLoaded function that returns whether data for that index is available, and itemCount which is either the current count plus 1 if more items exist, or just the current count if you've reached the end. The pattern is: maintain a loading state, when loadMoreItems is called, fetch the next batch, append to your array, and update the hasMore flag. The tricky parts are handling loading states - showing skeleton loaders for items that haven't loaded yet, preventing multiple simultaneous loads, and handling errors gracefully. I also implement a threshold so loading starts before the user reaches the absolute end, making it feel instant."

---

### Q7: What are the limitations and gotchas of virtual scrolling?

**Answer:**

> "The main limitations are: First, you lose browser's native find-in-page functionality since most items aren't in the DOM. Second, accessibility can be challenging - screen readers need special handling since they can't navigate items that aren't rendered. Third, you need to know or estimate item heights beforehand, which is tricky for dynamic content. Fourth, scroll-to-top or scroll-to-item requires using the library's imperative API. Fifth, CSS transitions and animations on items entering/leaving the viewport need special handling. Sixth, if you have focus management or keyboard navigation, you need to handle items that aren't rendered yet. And finally, the bundle size and complexity might not be worth it for small lists. The biggest gotcha I've encountered is forgetting that item components receive a style prop which must be spread onto the element for positioning to work."

---

## 🚨 Common Mistakes to Avoid

### 1. Not Spreading the Style Prop

```javascript
// ❌ WRONG - items won't position correctly
const Row = ({ index, style }) => <div>{items[index].name}</div>;

// ✅ CORRECT - must spread style
const Row = ({ index, style }) => <div style={style}>{items[index].name}</div>;
```

### 2. Using Index as Key

```javascript
// ❌ WRONG - index as key causes issues
const Row = ({ index, style }) => (
  <div style={style} key={index}>
    {items[index].name}
  </div>
);

// ✅ CORRECT - use stable ID
const Row = ({ index, style }) => (
  <div style={style} key={items[index].id}>
    {items[index].name}
  </div>
);
```

### 3. Accessing Index Outside Bounds

```javascript
// ❌ WRONG - item might not exist
const Row = ({ index, style }) => (
  <div style={style}>{items[index].name} // May be undefined!</div>
);

// ✅ CORRECT - check bounds
const Row = ({ index, style }) => {
  if (!items[index]) {
    return <div style={style}>Loading...</div>;
  }

  return <div style={style}>{items[index].name}</div>;
};
```

### 4. Not Memoizing Row Component

```javascript
// ❌ WRONG - Row recreated on every render
function List() {
  const Row = ({ index, style }) => (
    <div style={style}>{items[index].name}</div>
  );

  return <FixedSizeList {...props}>{Row}</FixedSizeList>;
}

// ✅ CORRECT - memoize Row
const Row = memo(({ index, style }) => (
  <div style={style}>{items[index].name}</div>
));

function List() {
  return <FixedSizeList {...props}>{Row}</FixedSizeList>;
}
```

### 5. Expensive Operations in Row

```javascript
// ❌ WRONG - expensive operation per item
const Row = ({ index, style }) => {
  const processedData = expensiveOperation(items[index]); // Runs every render!

  return <div style={style}>{processedData}</div>;
};

// ✅ CORRECT - preprocess data
const processedItems = useMemo(
  () => items.map((item) => expensiveOperation(item)),
  [items]
);

const Row = ({ index, style }) => (
  <div style={style}>{processedItems[index]}</div>
);
```

---

## 🔑 Interview Checklist

### ✅ Must Know

- ✅ What virtual scrolling is (render only visible items)
- ✅ Why it's needed (performance with large lists)
- ✅ react-window basic usage
- ✅ Fixed vs variable size lists
- ✅ When to use vs not use
- ✅ Must spread style prop

### ✅ Should Know

- ✅ How it works technically (scroll position math)
- ✅ react-window vs react-virtualized
- ✅ Infinite loading integration
- ✅ Performance characteristics
- ✅ Common mistakes

### ✅ Nice to Know

- [ ] Variable height measurement strategies
- [ ] Grid virtualization
- [ ] Accessibility considerations
- [ ] Custom scrollbar styling
- [ ] Scroll position restoration

---

## 💡 Pro Tips for Interviews

1. **Know the numbers**: "10,000 items → 20 rendered = 500x fewer DOM nodes"
2. **Mention libraries**: react-window for most cases, react-virtualized for complex
3. **Trade-offs**: Complexity vs performance - not always worth it
4. **Real example**: Have a story of improving list performance
5. **Measure first**: Don't optimize prematurely

---

## 📚 Quick Reference

```javascript
// Fixed size list
import { FixedSizeList } from "react-window";

const Row = ({ index, style }) => <div style={style}>Row {index}</div>;

<FixedSizeList height={600} itemCount={1000} itemSize={50} width="100%">
  {Row}
</FixedSizeList>;

// Variable size list
import { VariableSizeList } from "react-window";

const getItemSize = (index) => (items[index].isExpanded ? 200 : 50);

<VariableSizeList
  height={600}
  itemCount={1000}
  itemSize={getItemSize}
  width="100%"
>
  {Row}
</VariableSizeList>;

// With infinite loading
import InfiniteLoader from "react-window-infinite-loader";

<InfiniteLoader
  isItemLoaded={(index) => index < items.length}
  itemCount={items.length + 1}
  loadMoreItems={loadMore}
>
  {({ onItemsRendered, ref }) => (
    <FixedSizeList onItemsRendered={onItemsRendered} ref={ref} {...props}>
      {Row}
    </FixedSizeList>
  )}
</InfiniteLoader>;

// Responsive sizing
import AutoSizer from "react-virtualized-auto-sizer";

<AutoSizer>
  {({ height, width }) => (
    <FixedSizeList height={height} width={width} {...props}>
      {Row}
    </FixedSizeList>
  )}
</AutoSizer>;
```

---

## 🎯 The Golden Rules

1. **"Only render what's visible"** - Core principle of virtualization
2. **"Measure before optimizing"** - Not always needed for small lists
3. **"Always spread style prop"** - Required for positioning
4. **"Use stable keys"** - Not index, use item IDs
5. **"Fixed heights when possible"** - Best performance

---

**Remember:** Virtual scrolling is a powerful optimization for large lists, but it adds complexity. Only use it when you've measured and confirmed that rendering performance is actually a problem. Start with simple lists, measure with React DevTools Profiler, and add virtualization when needed!
