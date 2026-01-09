# Data Structures & Algorithms - Complete Interview Preparation Guide

### Comprehensive guide for Software Engineer role | Language-Agnostic Approach

---

## 📋 Table of Contents

1. [Complexity Analysis](#1-complexity-analysis) - ⭐⭐⭐ CRITICAL
2. [Arrays & Strings](#2-arrays--strings) - ⭐⭐⭐ CRITICAL
3. [Hash Tables & Sets](#3-hash-tables--sets) - ⭐⭐⭐ CRITICAL
4. [Linked Lists](#4-linked-lists) - ⭐⭐⭐ CRITICAL
5. [Stacks & Queues](#5-stacks--queues) - ⭐⭐⭐ CRITICAL
6. [Trees & Binary Search Trees](#6-trees--binary-search-trees) - ⭐⭐⭐ CRITICAL
7. [Graphs](#7-graphs) - ⭐⭐ IMPORTANT
8. [Heaps & Priority Queues](#8-heaps--priority-queues) - ⭐⭐ IMPORTANT
9. [Sorting Algorithms](#9-sorting-algorithms) - ⭐⭐ IMPORTANT
10. [Searching Algorithms](#10-searching-algorithms) - ⭐⭐ IMPORTANT
11. [Recursion & Backtracking](#11-recursion--backtracking) - ⭐⭐ IMPORTANT
12. [Dynamic Programming](#12-dynamic-programming) - ⭐⭐ IMPORTANT
13. [Greedy Algorithms](#13-greedy-algorithms) - ⭐ GOOD TO KNOW
14. [Bit Manipulation](#14-bit-manipulation) - ⭐ GOOD TO KNOW
15. [Advanced Topics](#15-advanced-topics) - ⭐ GOOD TO KNOW

---

## 1. Complexity Analysis

> ⭐⭐⭐ **CRITICAL**

### 1.1 Time Complexity (Big O Notation)

#### Topics to Master:

- Big O, Big Omega, Big Theta notation
- Common time complexities (O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ), O(n!))
- Best, average, and worst case analysis
- Calculating time complexity
- Amortized analysis
- Space-time tradeoffs
- Analyzing recursive algorithms

#### Key Understanding Points:

- Big O describes upper bound (worst case)
- Drop constants and non-dominant terms
- Understand growth rates intuitively
- Sequential operations add, nested operations multiply
- Recursive complexity requires recurrence relations
- Multiple loops don't always mean O(n²)
- Logarithmic time usually involves halving

#### Common Interview Questions:

- What is Big O notation?
- What's the difference between O(n) and O(n²)?
- How do you calculate time complexity?
- What's the time complexity of this algorithm?
- Explain amortized time complexity
- Why is binary search O(log n)?

---

### 1.2 Space Complexity

#### Topics to Master:

- Input space vs auxiliary space
- Stack space in recursion
- Space complexity of common data structures
- In-place algorithms
- Space optimization techniques
- Memory allocation patterns

#### Key Understanding Points:

- Auxiliary space is extra space used
- Recursive calls use stack space
- In-place means O(1) extra space
- Sometimes can trade space for time
- Arrays use contiguous memory
- Trees/graphs can use significant space

#### Common Interview Questions:

- What is space complexity?
- What's the space complexity of recursion?
- Can you solve this in O(1) space?
- What's an in-place algorithm?
- How does recursion affect space complexity?

---

### 1.3 Analyzing Algorithms

#### Topics to Master:

- Iterative algorithm analysis
- Recursive algorithm analysis (Master theorem)
- Loop analysis (single, nested, dependent)
- Best/average/worst case scenarios
- Input size impact
- Hidden constants

#### Key Understanding Points:

- Count operations as function of input size
- Identify dominant operations
- Recursive tree method for analysis
- Master theorem for divide-and-conquer
- Real-world performance vs theoretical
- Cache locality matters in practice

#### Common Interview Questions:

- How do you analyze a recursive algorithm?
- What's the Master theorem?
- Analyze the complexity of this code
- What's the difference between best and worst case?

---

## 2. Arrays & Strings

> ⭐⭐⭐ **CRITICAL**

### 2.1 Array Fundamentals

#### Topics to Master:

- Array representation in memory
- Static vs dynamic arrays
- Array operations (access, insert, delete, search)
- Multi-dimensional arrays
- Jagged arrays
- Array traversal techniques
- Array rotation
- Array manipulation patterns

#### Key Understanding Points:

- Arrays store elements contiguously in memory
- O(1) random access by index
- Insertion/deletion expensive (shifting required)
- Dynamic arrays amortize insertion cost
- Cache-friendly due to locality
- Fixed size in static arrays
- Zero-indexed in most languages

#### Common Interview Questions:

- How are arrays stored in memory?
- What's the difference between static and dynamic arrays?
- Why is array access O(1)?
- How do you rotate an array?
- What are the time complexities of array operations?

---

### 2.2 Array Patterns & Techniques

#### Topics to Master:

- Two pointers technique
- Sliding window pattern
- Prefix sum / cumulative sum
- Kadane's algorithm (max subarray)
- Dutch National Flag problem
- Array partitioning
- In-place modifications
- Frequency counting

#### Key Understanding Points:

- Two pointers: opposite ends or fast/slow
- Sliding window maintains state while traversing
- Prefix sum enables O(1) range queries
- Kadane's algorithm uses DP concept
- In-place saves O(n) space
- Many problems have O(n) solution with right pattern
- Pattern recognition is key skill

#### Common Interview Questions:

- Explain the two-pointer technique
- What is the sliding window pattern?
- How does Kadane's algorithm work?
- When should you use two pointers?
- What's the difference between sliding window and two pointers?

---

### 2.3 String Fundamentals

#### Topics to Master:

- String representation (array of characters)
- Immutable vs mutable strings
- String operations (concatenation, substring, search)
- Character encoding (ASCII, Unicode, UTF-8)
- String comparison and equality
- String hashing
- String manipulation patterns

#### Key Understanding Points:

- Strings are character arrays in most languages
- Immutability affects complexity (Python, Java)
- String concatenation can be O(n²) if immutable
- Use StringBuilder/list for efficient building
- ASCII: 128 chars, Extended ASCII: 256 chars
- Unicode handles all world languages
- String problems often use hash maps

#### Common Interview Questions:

- Are strings mutable or immutable in [language]?
- Why is string concatenation slow?
- What's the difference between ASCII and Unicode?
- How do you efficiently build strings?
- How do you compare strings?

---

### 2.4 String Patterns & Algorithms

#### Topics to Master:

- Pattern matching (naive, KMP, Rabin-Karp)
- Palindrome detection
- Anagram detection
- Substring search
- String reversal
- Character frequency problems
- Longest common substring/subsequence
- String compression

#### Key Understanding Points:

- Pattern matching has specialized algorithms
- Palindrome: two pointers from ends
- Anagrams: same character frequency
- KMP uses preprocessing for O(n+m) search
- Many string problems use sliding window
- Hash maps great for frequency counting
- Rolling hash for efficient substring comparison

#### Common Interview Questions:

- How do you check if a string is a palindrome?
- How do you find anagrams?
- Explain the KMP algorithm
- How do you find all substrings?
- What's the longest palindromic substring algorithm?

---

## 3. Hash Tables & Sets

> ⭐⭐⭐ **CRITICAL**

### 3.1 Hash Table Fundamentals

#### Topics to Master:

- Hash function properties
- Hash table structure
- Load factor and resizing
- Collision resolution (chaining, open addressing)
- Hash table operations
- Universal hashing
- Perfect hashing

#### Key Understanding Points:

- Hash function maps key to index
- Good hash function distributes uniformly
- Collisions inevitable (Birthday paradox)
- Chaining uses linked lists at each slot
- Open addressing probes for next free slot
- Load factor affects performance
- Average O(1) operations, worst O(n)

#### Common Interview Questions:

- How does a hash table work?
- What is a hash function?
- How do you handle collisions?
- What is load factor?
- Why is hash table lookup O(1) on average?
- What makes a good hash function?

---

### 3.2 Hash Table Patterns

#### Topics to Master:

- Frequency counting
- Two sum pattern
- Group by key pattern
- Caching/memoization
- Duplicate detection
- Intersection and union problems
- Subarray sum problems
- LRU cache implementation

#### Key Understanding Points:

- Hash maps excel at O(1) lookups
- Frequency counter pattern very common
- Two sum: store complements
- Grouping uses hash key
- Memoization prevents recalculation
- Set for existence checking
- Can trade space for time

#### Common Interview Questions:

- How do you find two numbers that sum to a target?
- How do you group anagrams?
- What is memoization?
- How do you detect duplicates efficiently?
- How would you implement an LRU cache?

---

### 3.3 Hash Sets

#### Topics to Master:

- Set operations (add, remove, contains)
- Set vs hash table
- Mathematical set operations (union, intersection, difference)
- Unique element problems
- Membership testing
- Bloom filters (advanced)

#### Key Understanding Points:

- Set stores only keys, no values
- Perfect for membership testing
- Union: all elements from both sets
- Intersection: common elements
- Difference: elements in first but not second
- O(1) average for add/remove/contains
- Useful for deduplication

#### Common Interview Questions:

- What's the difference between set and hash table?
- How do you find unique elements?
- How do you compute set intersection?
- When should you use a set vs an array?

---

## 4. Linked Lists

> ⭐⭐⭐ **CRITICAL**

### 4.1 Linked List Fundamentals

#### Topics to Master:

- Node structure (data + pointer)
- Singly linked lists
- Doubly linked lists
- Circular linked lists
- Linked list operations (insert, delete, search)
- Head and tail pointers
- Dummy/sentinel nodes

#### Key Understanding Points:

- Non-contiguous memory allocation
- Each node points to next node
- O(1) insertion/deletion with pointer
- O(n) search and access by index
- Doubly linked: previous and next pointers
- Circular: last points to first
- Dynamic size, no waste

#### Common Interview Questions:

- How does a linked list work?
- What's the difference between array and linked list?
- What are the types of linked lists?
- Why use doubly linked list?
- What's a circular linked list?

---

### 4.2 Linked List Patterns

#### Topics to Master:

- Fast and slow pointers (tortoise and hare)
- Reversal techniques
- Merging sorted lists
- Detecting cycles (Floyd's algorithm)
- Finding middle element
- Removing nth node from end
- Palindrome detection
- Intersection detection

#### Key Understanding Points:

- Two pointers solve many problems
- Fast/slow pointers: cycle detection, middle finding
- Reversal: iterative O(n) O(1) space
- Dummy node simplifies edge cases
- Cycle detection: fast catches slow
- Many patterns use O(1) space
- Drawing diagrams helps understanding

#### Common Interview Questions:

- How do you reverse a linked list?
- How do you detect a cycle?
- How do you find the middle element?
- How do you merge two sorted lists?
- How do you remove nth node from end?
- How do you find where two lists intersect?

---

### 4.3 Advanced Linked List Operations

#### Topics to Master:

- Flattening multi-level lists
- Clone list with random pointers
- Add two numbers represented as lists
- Reorder list
- Partition list
- Remove duplicates
- Swap nodes in pairs

#### Key Understanding Points:

- Complex pointer manipulation
- May need multiple passes
- Sometimes need hash map for O(1) lookup
- Edge cases: empty, single node, two nodes
- Be careful with pointer updates
- Test with small examples first

#### Common Interview Questions:

- How do you flatten a multi-level linked list?
- How do you clone a linked list with random pointers?
- How do you add two numbers in linked lists?

---

## 5. Stacks & Queues

> ⭐⭐⭐ **CRITICAL**

### 5.1 Stack Fundamentals

#### Topics to Master:

- LIFO (Last In First Out) principle
- Stack operations (push, pop, peek, isEmpty)
- Stack implementations (array, linked list)
- Function call stack
- Stack frame and activation records
- Stack overflow

#### Key Understanding Points:

- Add and remove from same end (top)
- All operations O(1)
- Array implementation: end is top
- Linked list implementation: head is top
- Used in recursion internally
- Limited by stack size (especially recursion)
- Natural for backtracking

#### Common Interview Questions:

- What is a stack?
- How do you implement a stack?
- What's LIFO?
- Where are stacks used in programming?
- What causes stack overflow?

---

### 5.2 Stack Patterns

#### Topics to Master:

- Balanced parentheses/brackets
- Expression evaluation (infix, postfix, prefix)
- Next greater/smaller element
- Monotonic stack
- Stock span problem
- Min/max stack
- Valid stack sequences
- Tower of Hanoi

#### Key Understanding Points:

- Stack perfect for nested structures
- Monotonic stack maintains order
- Next greater element: O(n) with stack
- Expression evaluation: operator precedence
- Min stack: track minimum with each element
- Many problems have O(n) time O(n) space solution
- Think about what needs to be "undone"

#### Common Interview Questions:

- How do you check balanced parentheses?
- What is a monotonic stack?
- How do you evaluate postfix expressions?
- How do you find next greater element?
- How do you implement a min stack?

---

### 5.3 Queue Fundamentals

#### Topics to Master:

- FIFO (First In First Out) principle
- Queue operations (enqueue, dequeue, front, isEmpty)
- Queue implementations (array, linked list, circular)
- Deque (double-ended queue)
- Priority queue (concept)

#### Key Understanding Points:

- Add at back, remove from front
- All operations O(1)
- Circular queue prevents wasted space
- Array implementation needs two pointers
- Linked list: head=front, tail=back
- Deque allows operations at both ends
- Used in BFS, scheduling

#### Common Interview Questions:

- What is a queue?
- How do you implement a queue?
- What's FIFO?
- What's a circular queue?
- What's a deque?

---

### 5.4 Queue Patterns

#### Topics to Master:

- Level order traversal (BFS)
- Moving average from data stream
- Sliding window maximum/minimum
- Queue using stacks
- Stack using queues
- Design circular queue
- Task scheduling

#### Key Understanding Points:

- Queue natural for BFS
- Sliding window uses deque
- Can implement queue with 2 stacks
- Can implement stack with 2 queues
- Level order: process all nodes at current level
- Many real-world systems use queues

#### Common Interview Questions:

- How do you implement BFS?
- How do you implement queue using stacks?
- What is sliding window maximum?
- How do you do level order traversal?

---

## 6. Trees & Binary Search Trees

> ⭐⭐⭐ **CRITICAL**

### 6.1 Tree Fundamentals

#### Topics to Master:

- Tree terminology (root, leaf, parent, child, sibling, height, depth, level)
- Binary tree vs general tree
- Tree representation in memory
- Tree traversal (inorder, preorder, postorder, level order)
- Complete, full, and perfect binary trees
- Balanced vs unbalanced trees

#### Key Understanding Points:

- Hierarchical data structure
- Root at top, leaves at bottom
- Each node has at most one parent
- Binary tree: at most 2 children per node
- Height: longest path from root to leaf
- Depth: distance from root
- Traversal order determines processing sequence

#### Common Interview Questions:

- What is a tree?
- What's the difference between binary tree and BST?
- Explain tree traversal methods
- What's the height of a tree?
- What's a complete binary tree?
- What's a balanced tree?

---

### 6.2 Binary Search Tree (BST)

#### Topics to Master:

- BST property (left < node < right)
- BST operations (insert, delete, search)
- BST traversal and validation
- Finding min/max
- Finding successor/predecessor
- BST to sorted array
- Array to BST

#### Key Understanding Points:

- Left subtree values all less than node
- Right subtree values all greater than node
- Inorder traversal gives sorted order
- Search/insert/delete O(h) where h is height
- Balanced BST: h = log n
- Unbalanced BST: h = n (worst case)
- Deletion has 3 cases: leaf, one child, two children

#### Common Interview Questions:

- What is a BST?
- How do you validate a BST?
- How do you insert into a BST?
- How do you delete from a BST?
- What's the time complexity of BST operations?
- How do you find the kth smallest element?

---

### 6.3 Tree Patterns & Techniques

#### Topics to Master:

- Recursive tree traversal
- Iterative traversal with stack
- Level order traversal with queue
- Finding height/depth
- Checking tree properties (balanced, symmetric, complete)
- Lowest common ancestor (LCA)
- Path sum problems
- Tree construction from traversals
- Diameter of tree
- Vertical order traversal

#### Key Understanding Points:

- Recursion natural for trees
- Most problems have recursive solution
- Base case: null node or leaf
- DFS uses stack (or recursion)
- BFS uses queue
- Many problems combine traversal + condition check
- LCA: first common node in paths from root

#### Common Interview Questions:

- How do you find tree height?
- How do you check if tree is balanced?
- What is the lowest common ancestor?
- How do you find all paths with given sum?
- How do you construct tree from traversals?
- How do you check if tree is symmetric?

---

### 6.4 Advanced Tree Topics

#### Topics to Master:

- AVL trees (self-balancing BST)
- Red-Black trees
- B-trees and B+ trees
- Trie (prefix tree)
- Segment tree
- Fenwick tree (Binary Indexed Tree)
- N-ary trees
- Serialize and deserialize tree

#### Key Understanding Points:

- Balanced trees maintain O(log n) operations
- AVL: height difference ≤ 1, requires rotations
- Red-Black: looser balance, faster operations
- B-trees: multiple keys per node, good for disk
- Trie: efficient string operations
- Segment tree: range queries in O(log n)
- Serialization preserves tree structure

#### Common Interview Questions:

- What is an AVL tree?
- How do tree rotations work?
- What is a trie?
- How do you serialize a tree?
- What are segment trees used for?

---

## 7. Graphs

> ⭐⭐ **IMPORTANT**

### 7.1 Graph Fundamentals

#### Topics to Master:

- Graph terminology (vertex, edge, directed, undirected, weighted)
- Graph representations (adjacency matrix, adjacency list, edge list)
- Types of graphs (directed, undirected, weighted, cyclic, acyclic, connected)
- Graph properties (degree, path, cycle, connected components)
- Directed acyclic graph (DAG)

#### Key Understanding Points:

- Graph: vertices connected by edges
- Directed: edges have direction
- Undirected: edges bidirectional
- Weighted: edges have values
- Adjacency matrix: O(V²) space, O(1) edge check
- Adjacency list: O(V+E) space, O(degree) edge check
- Sparse graph: use adjacency list
- Dense graph: consider adjacency matrix

#### Common Interview Questions:

- What is a graph?
- What are the ways to represent a graph?
- When to use adjacency matrix vs list?
- What's a directed graph?
- What's a DAG?

---

### 7.2 Graph Traversal

#### Topics to Master:

- Depth-First Search (DFS)
- Breadth-First Search (BFS)
- DFS applications (cycle detection, topological sort, connected components)
- BFS applications (shortest path, level order)
- Iterative vs recursive DFS
- Visited array/set
- Traversal time complexity

#### Key Understanding Points:

- DFS: go deep before wide (stack/recursion)
- BFS: explore level by level (queue)
- Both O(V+E) time complexity
- DFS space: O(V) for recursion depth
- BFS space: O(V) for queue
- Visited tracking prevents infinite loops
- Choice depends on problem requirements

#### Common Interview Questions:

- Explain DFS and BFS
- When to use DFS vs BFS?
- How do you detect cycles?
- How do you find connected components?
- What's the time complexity of graph traversal?

---

### 7.3 Graph Algorithms

#### Topics to Master:

- Shortest path (Dijkstra, Bellman-Ford, Floyd-Warshall)
- Minimum spanning tree (Prim's, Kruskal's)
- Topological sort
- Union-Find (Disjoint Set Union)
- Strongly connected components (Kosaraju's, Tarjan's)
- Bipartite graph detection
- Graph coloring
- Hamiltonian and Eulerian paths

#### Key Understanding Points:

- Dijkstra: single source, non-negative weights, O((V+E)log V)
- Bellman-Ford: handles negative weights, O(VE)
- Floyd-Warshall: all pairs shortest path, O(V³)
- MST: connects all vertices with minimum total weight
- Topological sort: linear ordering of DAG
- Union-Find: efficient for connectivity queries
- Bipartite: 2-colorable graph

#### Common Interview Questions:

- How does Dijkstra's algorithm work?
- What's the difference between Prim's and Kruskal's?
- What is topological sort?
- How does Union-Find work?
- When can you use Dijkstra vs Bellman-Ford?

---

### 7.4 Graph Patterns

#### Topics to Master:

- Clone graph
- Number of islands
- Word ladder
- Course schedule (cycle detection)
- Network delay time
- Critical connections
- Cheapest flights
- Graph valid tree
- Alien dictionary

#### Key Understanding Points:

- Many problems reducible to graph problems
- Grid can be treated as graph
- Often need to build graph first
- BFS for shortest path in unweighted graph
- DFS for exploring all possibilities
- Topological sort for dependency problems
- Union-Find for connectivity

#### Common Interview Questions:

- How do you clone a graph?
- How do you count islands?
- How do you detect if graph is a valid tree?
- How do you find critical connections?

---

## 8. Heaps & Priority Queues

> ⭐⭐ **IMPORTANT**

### 8.1 Heap Fundamentals

#### Topics to Master:

- Heap property (min-heap, max-heap)
- Binary heap structure
- Heap representation (array)
- Heap operations (insert, extract min/max, heapify)
- Building heap from array
- Heap sort

#### Key Understanding Points:

- Complete binary tree stored as array
- Min-heap: parent ≤ children
- Max-heap: parent ≥ children
- Parent at i, children at 2i+1 and 2i+2
- Insert: O(log n), add at end and bubble up
- Extract: O(log n), remove root and bubble down
- Build heap: O(n) using bottom-up heapify
- Not sorted, but maintains partial order

#### Common Interview Questions:

- What is a heap?
- How is a heap stored?
- What's the difference between min-heap and max-heap?
- What are heap operations complexities?
- How do you build a heap?

---

### 8.2 Priority Queue

#### Topics to Master:

- Priority queue abstract data type
- Priority queue implementations
- Priority queue operations
- Applications of priority queues
- Custom comparators

#### Key Understanding Points:

- Priority queue: element with highest priority served first
- Typically implemented with heap
- Insert: O(log n), extract min/max: O(log n)
- Peek: O(1)
- Used in many algorithms (Dijkstra, Prim's, A\*)
- Can have custom priority function

#### Common Interview Questions:

- What is a priority queue?
- How do you implement a priority queue?
- When should you use a priority queue?
- What's the difference between queue and priority queue?

---

### 8.3 Heap Patterns

#### Topics to Master:

- Top K elements
- K closest points
- Merge K sorted lists/arrays
- Median from data stream
- Meeting rooms
- Task scheduler
- Kth largest element in stream

#### Key Understanding Points:

- Top K: use min-heap of size K
- K closest: use max-heap of size K
- Merge K sorted: min-heap with first element of each
- Running median: use two heaps (max and min)
- Many optimization problems use heaps
- Heap vs sorting: O(n log k) vs O(n log n)

#### Common Interview Questions:

- How do you find K largest elements?
- How do you merge K sorted lists?
- How do you find running median?
- How do you schedule tasks?

---

## 9. Sorting Algorithms

> ⭐⭐ IMPORTANT

### 9.1 Comparison-Based Sorting

#### Topics to Master:

- Bubble sort
- Selection sort
- Insertion sort
- Merge sort
- Quick sort
- Heap sort
- Stability in sorting
- In-place sorting
- Comparison sort lower bound (Ω(n log n))

#### Key Understanding Points:

- Bubble: O(n²), stable, in-place
- Selection: O(n²), unstable, in-place
- Insertion: O(n²), stable, in-place, good for small/nearly sorted
- Merge: O(n log n), stable, O(n) space, divide-and-conquer
- Quick: O(n log n) average, O(n²) worst, in-place, divide-and-conquer
- Heap: O(n log n), unstable, in-place
- Stable: maintains relative order of equal elements
- In-place: O(1) extra space

#### Common Interview Questions:

- Explain quick sort
- Explain merge sort
- What's the difference between stable and unstable sorting?
- Why can't comparison sort be faster than O(n log n)?
- When to use which sorting algorithm?

---

### 9.2 Non-Comparison Sorting

#### Topics to Master:

- Counting sort
- Radix sort
- Bucket sort
- When to use non-comparison sorting
- Time and space trade-offs

#### Key Understanding Points:

- Counting sort: O(n+k) where k is range, requires known range
- Radix sort: O(d(n+k)) where d is digits, sorts digit by digit
- Bucket sort: O(n+k) average, distributes into buckets
- Can beat O(n log n) with constraints
- Require extra space
- Work with integers or fixed range

#### Common Interview Questions:

- What is counting sort?
- When can you beat O(n log n)?
- Explain radix sort
- What are limitations of counting sort?

---

### 9.3 Sorting Patterns

#### Topics to Master:

- Sort by custom criteria
- Partial sorting
- Sorting linked lists
- Sorting strings
- External sorting
- Nearly sorted arrays
- Finding Kth element without full sort

#### Key Understanding Points:

- Custom comparator for complex sorting
- QuickSelect for Kth element: O(n) average
- Merge sort better for linked lists
- Insertion sort good for nearly sorted
- External sorting for data not in memory
- Sometimes don't need full sort

#### Common Interview Questions:

- How do you sort a linked list?
- How do you find Kth largest without sorting?
- How do you sort by multiple criteria?

---

## 10. Searching Algorithms

> ⭐⭐ IMPORTANT

### 10.1 Linear Search

#### Topics to Master:

- Sequential search
- Sentinel search
- Search in unsorted vs sorted
- Finding multiple occurrences
- Search with conditions

#### Key Understanding Points:

- O(n) time complexity
- Works on unsorted data
- Simple to implement
- No preprocessing required
- Best for small datasets or one-time search

#### Common Interview Questions:

- When to use linear search?
- How do you find all occurrences?

---

### 10.2 Binary Search

#### Topics to Master:

- Binary search on sorted array
- Binary search implementation (iterative, recursive)
- Binary search boundaries
- Binary search on answer
- Rotated sorted array search
- Finding first/last occurrence
- Peak element finding

#### Key Understanding Points:

- O(log n) time complexity
- Requires sorted data
- Divide and conquer approach
- Watch for infinite loops (boundary conditions)
- Can search for "answer" in range
- Lower bound vs upper bound
- Many variations in interviews

#### Common Interview Questions:

- Implement binary search
- How do you find first occurrence?
- How do you search in rotated array?
- What is binary search on answer?
- What are common binary search bugs?

---

### 10.3 Search Patterns

#### Topics to Master:

- Search in 2D matrix
- Finding peak element
- Finding square root
- Search in infinite array
- Interpolation search
- Exponential search
- Ternary search

#### Key Understanding Points:

- Binary search applicable beyond arrays
- Can search for floating point values
- Monotonic function enables binary search
- Interpolation search: O(log log n) for uniform data
- Ternary search for unimodal functions
- Many optimization problems use binary search

#### Common Interview Questions:

- How do you search in a 2D sorted matrix?
- How do you find square root using binary search?
- When to use interpolation search?

---

## 11. Recursion & Backtracking

> ⭐⭐ IMPORTANT

### 11.1 Recursion Fundamentals

#### Topics to Master:

- Recursion concept and base case
- Recursion vs iteration
- Call stack and stack overflow
- Tail recursion
- Memoization and top-down DP
- Recursion tree
- Common recursion patterns

#### Key Understanding Points:

- Function calls itself with simpler input
- Must have base case to terminate
- Each call has own local variables
- Stack space O(depth)
- Tail recursion can be optimized
- Can convert to iteration with explicit stack
- Recursion natural for tree/graph problems

#### Common Interview Questions:

- What is recursion?
- What's the difference between recursion and iteration?
- What is tail recursion?
- How does call stack work?
- What causes stack overflow?

---

### 11.2 Backtracking

#### Topics to Master:

- Backtracking concept
- Choice, constraint, goal pattern
- Pruning
- State space tree
- Common backtracking problems
- Optimization with memoization

#### Key Understanding Points:

- Systematic way to try all possibilities
- Make choice, recurse, undo choice (backtrack)
- Prune branches that can't lead to solution
- Build solution incrementally
- Time often exponential (O(2ⁿ) or O(n!))
- DFS-based approach

#### Common Interview Questions:

- What is backtracking?
- How does backtracking differ from recursion?
- When should you use backtracking?
- How do you optimize backtracking?

---

### 11.3 Backtracking Patterns

#### Topics to Master:

- Permutations and combinations
- Subsets and power set
- N-Queens problem
- Sudoku solver
- Word search
- Palindrome partitioning
- Generate parentheses
- Letter combinations
- Path finding with obstacles

#### Key Understanding Points:

- Permutations: order matters, n! possibilities
- Combinations: order doesn't matter, C(n,k) possibilities
- Subsets: 2ⁿ possibilities
- Constraint satisfaction problems
- Often need visited array
- Backtrack by undoing changes
- Can optimize with early termination

#### Common Interview Questions:

- How do you generate all permutations?
- How do you solve N-Queens?
- How do you find all subsets?
- How do you implement word search?
- What's the difference between permutations and combinations?

---

## 12. Dynamic Programming

> ⭐⭐ **IMPORTANT**

### 12.1 DP Fundamentals

#### Topics to Master:

- Overlapping subproblems
- Optimal substructure
- Memoization (top-down)
- Tabulation (bottom-up)
- State definition
- State transition
- DP vs divide-and-conquer
- DP vs greedy

#### Key Understanding Points:

- DP optimizes recursive solutions
- Stores results to avoid recalculation
- Two approaches: top-down (memo) and bottom-up (table)
- Top-down: recursion + cache
- Bottom-up: iterative, fills table
- Must identify state and transitions
- Space can often be optimized

#### Common Interview Questions:

- What is dynamic programming?
- What's the difference between memoization and tabulation?
- When should you use DP?
- What is optimal substructure?
- What are overlapping subproblems?

---

### 12.2 1D DP Problems

#### Topics to Master:

- Fibonacci sequence
- Climbing stairs
- House robber
- Maximum subarray (Kadane's)
- Longest increasing subsequence
- Coin change
- Decode ways
- Jump game
- Partition equal subset sum

#### Key Understanding Points:

- State: usually dp[i] = answer for first i elements
- Transition: relate dp[i] to previous states
- Base cases: initialize small inputs
- Often O(n) time, O(n) or O(1) space
- Many can optimize space to O(1)
- Pattern: current depends on previous few states

#### Common Interview Questions:

- How do you solve climbing stairs?
- Explain the house robber problem
- How do you find longest increasing subsequence?
- How do you solve coin change?

---

### 12.3 2D DP Problems

#### Topics to Master:

- Longest common subsequence
- Longest common substring
- Edit distance
- Unique paths
- Minimum path sum
- Regular expression matching
- Interleaving strings
- Distinct subsequences
- 0/1 Knapsack

#### Key Understanding Points:

- State: usually dp[i][j] = answer for first i and first j
- Two sequences or 2D grid common
- Transition: consider including/excluding elements
- Often O(n²) time, O(n²) space
- Can optimize space to O(n) with rolling array
- Many string problems use 2D DP

#### Common Interview Questions:

- How do you find longest common subsequence?
- What's the edit distance algorithm?
- How do you solve 0/1 knapsack?
- How do you find unique paths in grid?

---

### 12.4 Advanced DP Patterns

#### Topics to Master:

- DP on trees
- DP with bitmasking
- Digit DP
- State machine DP
- Interval DP
- DP optimization techniques
- Space optimization (rolling array)
- Reconstructing solution from DP

#### Key Understanding Points:

- Tree DP: root subproblem depends on children
- Bitmasking: use bits to represent state
- State machine: states with transitions
- Interval DP: subproblems are ranges
- Many optimizations possible
- Sometimes need to store path, not just value

#### Common Interview Questions:

- How do you do DP on trees?
- What is bitmasking in DP?
- How do you reconstruct the solution?

---

## 13. Greedy Algorithms

> ⭐ **GOOD TO KNOW**

### 13.1 Greedy Fundamentals

#### Topics to Master:

- Greedy choice property
- Optimal substructure
- Greedy vs DP
- Proving greedy correctness
- When greedy fails
- Activity selection problem

#### Key Understanding Points:

- Make locally optimal choice at each step
- Hope it leads to globally optimal solution
- Doesn't always work (need proof!)
- Usually simpler and faster than DP
- No backtracking or reconsidering
- Requires specific problem properties

#### Common Interview Questions:

- What is a greedy algorithm?
- How is greedy different from DP?
- When can you use greedy?
- How do you prove greedy correctness?

---

### 13.2 Greedy Patterns

#### Topics to Master:

- Interval scheduling
- Fractional knapsack
- Huffman coding
- Job sequencing
- Minimum spanning tree
- Dijkstra's shortest path
- Jump game
- Gas station
- Meeting rooms

#### Key Understanding Points:

- Sort often first step
- Choose by some criteria (earliest end, largest value, etc.)
- Process choices in order
- Many scheduling problems are greedy
- Graph algorithms often use greedy
- Proof by exchange argument common

#### Common Interview Questions:

- How do you solve activity selection?
- What's the difference between fractional and 0/1 knapsack?
- How do you solve jump game?
- How do you schedule meetings?

---

## 14. Bit Manipulation

> ⭐ **GOOD TO KNOW**

### 14.1 Bit Operations

#### Topics to Master:

- Binary representation
- Bitwise operators (AND, OR, XOR, NOT, shifts)
- Common bit tricks
- Counting set bits
- Power of two check
- Setting/clearing/toggling bits
- Isolating rightmost bit
- Two's complement

#### Key Understanding Points:

- AND (&): both bits 1
- OR (|): at least one bit 1
- XOR (^): exactly one bit 1 (different bits)
- NOT (~): flip bits
- Left shift (<<): multiply by 2
- Right shift (>>): divide by 2
- XOR properties: a^a=0, a^0=a, commutative

#### Common Interview Questions:

- What are bitwise operators?
- How do you check if number is power of 2?
- How do you count set bits?
- What is XOR useful for?

---

### 14.2 Bit Manipulation Patterns

#### Topics to Master:

- Single number (XOR trick)
- Missing number
- Bit masks
- Subsets using bits
- Bit manipulation in DP
- Hamming distance
- Reverse bits
- Power set generation

#### Key Understanding Points:

- XOR finds single unique element
- Bit masks represent sets
- Can enumerate subsets with bits
- Often O(1) space solutions
- Very efficient operations
- Tricky but powerful

#### Common Interview Questions:

- How do you find single number using XOR?
- How do you generate power set using bits?
- How do you calculate Hamming distance?

---

## 15. Advanced Topics

> ⭐ **GOOD TO KNOW**

### 15.1 String Algorithms

#### Topics to Master:

- KMP (Knuth-Morris-Pratt) pattern matching
- Rabin-Karp algorithm
- Z-algorithm
- Manacher's algorithm (longest palindrome)
- Suffix arrays and suffix trees
- Aho-Corasick algorithm

#### Key Understanding Points:

- Naive string search: O(nm)
- KMP: O(n+m) using failure function
- Rabin-Karp: O(n+m) average using rolling hash
- Advanced algorithms for specialized problems
- Preprocessing makes search faster

#### Common Interview Questions:

- What is KMP algorithm?
- How does Rabin-Karp work?
- When to use which string algorithm?

---

### 15.2 Advanced Data Structures

#### Topics to Master:

- Disjoint Set Union (Union-Find)
- Segment tree
- Fenwick tree (BIT)
- Sparse table
- Suffix array
- LRU/LFU cache
- Skip list
- Bloom filter

#### Key Understanding Points:

- Each structure optimizes specific operations
- Union-Find: connectivity queries
- Segment tree: range queries and updates
- Fenwick tree: simpler, prefix sums
- Trade-offs between complexity and implementation

#### Common Interview Questions:

- How does Union-Find work?
- What is path compression?
- When to use segment tree?
- How do you implement LRU cache?

---

### 15.3 Advanced Graph Algorithms

#### Topics to Master:

- Strongly connected components
- Articulation points and bridges
- Eulerian path and circuit
- Hamiltonian path
- Max flow (Ford-Fulkerson)
- Min cut
- Bipartite matching
- Traveling salesman problem

#### Key Understanding Points:

- Specialized algorithms for specific graph problems
- Many are NP-hard (no polynomial solution known)
- Approximation algorithms for hard problems
- Understanding complexity important

#### Common Interview Questions:

- What are strongly connected components?
- What is max flow problem?
- What makes a graph Eulerian?

---

### 15.4 Mathematical Algorithms

#### Topics to Master:

- GCD and LCM
- Prime number algorithms (Sieve of Eratosthenes)
- Modular arithmetic
- Fast exponentiation
- Combinatorics (permutations, combinations)
- Probability in algorithms
- Number theory basics

#### Key Understanding Points:

- Mathematical insight can simplify problems
- Euclidean algorithm for GCD: O(log n)
- Sieve generates primes up to n: O(n log log n)
- Fast exponentiation: O(log n)
- Modular arithmetic prevents overflow

#### Common Interview Questions:

- How do you find GCD?
- How do you generate prime numbers?
- What is fast exponentiation?
- How do you calculate nCr?

---

## Additional Study Resources

### Practice Platforms:

1. **LeetCode** - Most popular, 2000+ problems
2. **HackerRank** - Good for beginners
3. **Codeforces** - Competitive programming
4. **CodeChef** - Monthly contests
5. **AtCoder** - Japanese platform, quality problems
6. **Project Euler** - Mathematical/algorithmic problems
7. **CSES Problem Set** - Comprehensive DSA problems

### Books:

- **Cracking the Coding Interview** (Gayle Laakmann McDowell)
- **Introduction to Algorithms** (CLRS)
- **Algorithm Design Manual** (Steven Skiena)
- **Elements of Programming Interviews**
- **Grokking Algorithms** (Aditya Bhargava) - Visual approach
- **Competitive Programming** (Steven & Felix Halim)

### Online Courses:

- **CS50** (Harvard) - Introduction to Computer Science
- **Algorithms Specialization** (Stanford/Coursera)
- **MIT 6.006** - Introduction to Algorithms
- **Princeton Algorithms** (Coursera)
- **Grokking the Coding Interview** (Educative)

### YouTube Channels:

- Abdul Bari (Algorithms)
- Back To Back SWE
- NeetCode
- William Fiset
- Tushar Roy

---

## Learning Path & Timeline

### Week 1-2: Foundation (CRITICAL)

- [ ] Master time and space complexity
- [ ] Understand Big O deeply
- [ ] Practice complexity analysis
- [ ] Set up coding environment
- [ ] Start with easy array problems

### Week 3-4: Arrays & Strings (CRITICAL)

- [ ] Two pointers technique
- [ ] Sliding window pattern
- [ ] String manipulation
- [ ] Solve 20-30 easy problems
- [ ] Move to medium problems

### Week 5-6: Hash Tables & Linked Lists (CRITICAL)

- [ ] Hash table operations and patterns
- [ ] Frequency counting problems
- [ ] Linked list manipulation
- [ ] Fast/slow pointer technique
- [ ] Solve 20 problems each

### Week 7-8: Stacks, Queues, Trees (CRITICAL)

- [ ] Stack and queue operations
- [ ] Tree traversals (all types)
- [ ] Binary search tree operations
- [ ] Level order traversal
- [ ] Solve 30 tree problems

### Week 9-10: Graphs (IMPORTANT)

- [ ] Graph representations
- [ ] DFS and BFS mastery
- [ ] Common graph algorithms
- [ ] Solve 20 graph problems

### Week 11-12: Sorting & Searching (IMPORTANT)

- [ ] Understand all sorting algorithms
- [ ] Master binary search and variations
- [ ] Practice implementation
- [ ] Solve 15 problems

### Week 13-14: Recursion & Backtracking (IMPORTANT)

- [ ] Recursion patterns
- [ ] Backtracking template
- [ ] Common backtracking problems
- [ ] Solve 15 problems

### Week 15-16: Dynamic Programming (IMPORTANT)

- [ ] 1D DP problems (easier)
- [ ] 2D DP problems
- [ ] Common DP patterns
- [ ] Solve 20 DP problems

### Week 17-18: Advanced Topics (GOOD TO KNOW)

- [ ] Heaps and priority queues
- [ ] Greedy algorithms
- [ ] Bit manipulation
- [ ] Advanced data structures
- [ ] Solve 15 mixed problems

### Week 19-20: Mock Interviews & Review

- [ ] Daily mock interviews
- [ ] Review weak areas
- [ ] Practice explaining solutions
- [ ] Time management practice
- [ ] Solve random medium/hard problems

---

## Problem-Solving Framework

### Step 1: Understand (5 minutes)

- Read problem carefully
- Identify inputs and outputs
- Clarify ambiguities
- Ask questions
- Check constraints

### Step 2: Examples (5 minutes)

- Create simple example
- Create edge case examples
- Walk through manually
- Verify understanding

### Step 3: Approach (10 minutes)

- Think of brute force first
- Identify patterns
- Consider data structures
- Think of optimizations
- Discuss trade-offs

### Step 4: Code (15 minutes)

- Use clear variable names
- Write clean, readable code
- Handle edge cases
- Don't optimize prematurely
- Comment complex parts

### Step 5: Test (5 minutes)

- Test with your examples
- Test edge cases
- Walk through line by line
- Check off-by-one errors
- Verify complexity

### Step 6: Optimize (5 minutes)

- Analyze time and space
- Identify bottlenecks
- Consider alternatives
- Discuss improvements

---

## Common Patterns Recognition

### Pattern 1: Two Pointers

**When to use:** Sorted array, palindrome, pairs
**Example:** Two sum in sorted array, container with most water

### Pattern 2: Sliding Window

**When to use:** Subarray/substring problems, fixed/variable window
**Example:** Maximum sum subarray, longest substring without repeating

### Pattern 3: Fast & Slow Pointers

**When to use:** Linked list cycle, middle element
**Example:** Detect cycle, find middle of linked list

### Pattern 4: Merge Intervals

**When to use:** Overlapping intervals
**Example:** Merge intervals, meeting rooms

### Pattern 5: Cyclic Sort

**When to use:** Array with numbers in range [1, n]
**Example:** Find missing number, find duplicate

### Pattern 6: In-place Reversal

**When to use:** Reverse linked list, sublist
**Example:** Reverse linked list, reverse nodes in k-group

### Pattern 7: Tree BFS

**When to use:** Level order traversal
**Example:** Binary tree level order, zigzag traversal

### Pattern 8: Tree DFS

**When to use:** Path problems, tree traversal
**Example:** Path sum, diameter of tree

### Pattern 9: Monotonic Stack

**When to use:** Next greater/smaller element
**Example:** Next greater element, daily temperatures

### Pattern 10: Top K Elements

**When to use:** Find k largest/smallest
**Example:** K closest points, top k frequent elements

### Pattern 11: Modified Binary Search

**When to use:** Sorted/rotated array, search space
**Example:** Search in rotated array, find peak element

### Pattern 12: Subsets/Permutations

**When to use:** Combinations, all possibilities
**Example:** Generate parentheses, permutations

### Pattern 13: Greedy

**When to use:** Local optimal leads to global
**Example:** Jump game, gas station

### Pattern 14: Dynamic Programming

**When to use:** Overlapping subproblems, optimal substructure
**Example:** Longest increasing subsequence, coin change

### Pattern 15: Union Find

**When to use:** Connectivity, grouping
**Example:** Number of islands, redundant connection

---

## Interview Tips & Best Practices

### Before the Interview:

- [ ] Sleep well
- [ ] Review key concepts
- [ ] Prepare questions to ask
- [ ] Test your setup (if remote)
- [ ] Have paper and pen ready

### During Problem Solving:

- [ ] **Think out loud** - Show your thought process
- [ ] **Ask clarifying questions** - Understand requirements
- [ ] **Start with brute force** - Show you can solve it
- [ ] **Discuss trade-offs** - Time vs space
- [ ] **Write clean code** - Readable variable names
- [ ] **Test your solution** - Walk through examples
- [ ] **Handle edge cases** - Empty input, single element, etc.

### Communication:

- ✅ "Let me think about this for a moment..."
- ✅ "I'm considering two approaches..."
- ✅ "The brute force would be... but we can optimize..."
- ✅ "I'm not sure about X, but here's what I'm thinking..."
- ✅ "Can I assume...?"
- ❌ Long silences
- ❌ "I don't know"
- ❌ Starting to code immediately

### Time Management:

- Understanding: 5 min
- Approach discussion: 10 min
- Coding: 15 min
- Testing & optimization: 10 min

### If You're Stuck:

1. Walk through example manually
2. Think about similar problems
3. Consider different data structures
4. Ask for hint (it's okay!)
5. Explain your confusion

---

## Common Mistakes to Avoid

### Conceptual Mistakes:

- Not considering edge cases
- Forgetting to handle null/empty inputs
- Off-by-one errors in loops
- Not initializing variables
- Infinite loops
- Integer overflow
- Modifying input when not allowed

### Interview Mistakes:

- Jumping to code without discussing approach
- Not testing solution
- Ignoring interviewer hints
- Being defensive about mistakes
- Not asking questions
- Writing messy code
- Poor time management

### Problem-Solving Mistakes:

- Premature optimization
- Over-complicating solution
- Not starting with brute force
- Ignoring constraints
- Not verifying complexity
- Assuming instead of asking

---

## Quick Reference: Complexity Cheat Sheet

### Data Structure Operations:

| Structure          | Access     | Search     | Insert     | Delete     | Space |
| ------------------ | ---------- | ---------- | ---------- | ---------- | ----- |
| Array              | O(1)       | O(n)       | O(n)       | O(n)       | O(n)  |
| Dynamic Array      | O(1)       | O(n)       | O(1)\*     | O(n)       | O(n)  |
| Linked List        | O(n)       | O(n)       | O(1)       | O(1)       | O(n)  |
| Stack              | O(n)       | O(n)       | O(1)       | O(1)       | O(n)  |
| Queue              | O(n)       | O(n)       | O(1)       | O(1)       | O(n)  |
| Hash Table         | N/A        | O(1)\*     | O(1)\*     | O(1)\*     | O(n)  |
| Binary Search Tree | O(log n)\* | O(log n)\* | O(log n)\* | O(log n)\* | O(n)  |
| AVL Tree           | O(log n)   | O(log n)   | O(log n)   | O(log n)   | O(n)  |
| Binary Heap        | N/A        | N/A        | O(log n)   | O(log n)   | O(n)  |

\*Amortized or Average case

### Sorting Algorithms:

| Algorithm      | Best       | Average    | Worst      | Space    | Stable |
| -------------- | ---------- | ---------- | ---------- | -------- | ------ |
| Bubble Sort    | O(n)       | O(n²)      | O(n²)      | O(1)     | Yes    |
| Selection Sort | O(n²)      | O(n²)      | O(n²)      | O(1)     | No     |
| Insertion Sort | O(n)       | O(n²)      | O(n²)      | O(1)     | Yes    |
| Merge Sort     | O(n log n) | O(n log n) | O(n log n) | O(n)     | Yes    |
| Quick Sort     | O(n log n) | O(n log n) | O(n²)      | O(log n) | No     |
| Heap Sort      | O(n log n) | O(n log n) | O(n log n) | O(1)     | No     |
| Counting Sort  | O(n+k)     | O(n+k)     | O(n+k)     | O(k)     | Yes    |
| Radix Sort     | O(d(n+k))  | O(d(n+k))  | O(d(n+k))  | O(n+k)   | Yes    |

---

## Final Thoughts

### Key Principles:

1. **Understand, don't memorize** - Know why, not just how
2. **Practice consistently** - Daily coding builds intuition
3. **Learn from mistakes** - Review wrong solutions
4. **Recognize patterns** - Most problems use common patterns
5. **Think before coding** - 5 minutes planning saves 20 minutes debugging
6. **Communicate clearly** - Interviewers value thought process
7. **Start simple** - Brute force first, then optimize
8. **Test thoroughly** - Edge cases matter
9. **Learn progressively** - Master basics before advanced topics
10. **Stay curious** - Understand the "why" behind solutions

### Remember:

- Interviews test problem-solving, not just knowledge
- It's okay to not know everything
- Practice makes pattern recognition natural
- Clean code matters as much as correct code
- Communication skills are as important as coding skills

---

## Progress Tracking

### Weekly Goals:

- [ ] Week 1-2: **\_** problems solved, topics covered: **\_**
- [ ] Week 3-4: **\_** problems solved, topics covered: **\_**
- [ ] Week 5-6: **\_** problems solved, topics covered: **\_**
- [ ] Continue tracking...

### Topics Mastered:

- [ ] Time/Space Complexity
- [ ] Arrays & Strings
- [ ] Hash Tables
- [ ] Linked Lists
- [ ] Stacks & Queues
- [ ] Trees & BST
- [ ] Graphs
- [ ] Heaps
- [ ] Sorting & Searching
- [ ] Recursion & Backtracking
- [ ] Dynamic Programming
- [ ] Greedy Algorithms
- [ ] Bit Manipulation
- [ ] Advanced Topics

### Problem Count by Difficulty:

- Easy: **\_** / 100
- Medium: **\_** / 150
- Hard: **\_** / 50

---

**Target**: Software Engineer Interview Preparation
**Focus**: Concept-First, Language-Agnostic Learning
