import type { Topic } from './types'

export const m3Topics: Topic[] = [
  /* ============================ 3.1 ============================ */
  {
    id: 'm3-selection',
    moduleId: 3,
    title: 'Selection and Iteration using Python',
    short: 'Control & Data',
    icon: 'Repeat',
    summary: 'if / elif / else, for with range(), while, break–continue–pass, and Python’s sequence types: list, tuple, set, string, dictionary and NumPy arrays.',
    subtopics: [
      'if-else, elif',
      'for loop, range',
      'while loop',
      'Sequence data types in Python - list, tuple, set, strings, dictionary',
      'Creating and using Arrays in Python (using Numpy library)',
    ],
    keywords: ['if-else', 'if else', 'elif', 'for loop', 'range', 'while loop', 'break', 'continue', 'pass', 'list', 'tuple', 'set', 'dictionary', 'dict', 'slicing', 'slice', 'append', 'insert', 'remove', 'numpy', 'array', 'reshape', 'matrix', 'leap year', 'mutable', 'immutable'],
    visualizers: ['range', 'slicing'],
    takeaways: [
      'Python uses indentation (4 spaces) and a colon after if / elif / else / for / while.',
      'range(stop), range(start, stop), range(start, stop, step) — stop is never included.',
      'break exits the loop, continue skips to the next iteration, pass does nothing.',
      'list [ ] mutable · tuple ( ) immutable · set { } unique & unordered · dict {k: v} key-value.',
      'NumPy arrays: same type, fixed size, rectangular; np.array, ndim, shape, reshape, add, matmul.',
    ],
    sections: [
      {
        id: 'if',
        title: 'if-else, elif',
        blocks: [
          { type: 'code', lang: 'python', runnable: true, code: 'number = 0\nif number > 0:\n    print("Positive number")\nelif number == 0:\n    print("Zero")\nelse:\n    print("Negative number")\nprint("This statement is always executed")' },
          { type: 'callout', tone: 'warn', text: 'A colon `:` ends every header line, and the body must be indented by the same amount (4 spaces by convention). `elif` means *else if*.' },
          { type: 'code', lang: 'python', runnable: true, title: 'Leap year (classic exam question)', code: 'year = 2024\nif year % 400 == 0:\n    print(year, "is a leap year")\nelif year % 100 == 0:\n    print(year, "is not a leap year")\nelif year % 4 == 0:\n    print(year, "is a leap year")\nelse:\n    print(year, "is not a leap year")' },
        ],
      },
      {
        id: 'for',
        title: 'for loop, range',
        blocks: [
          { type: 'table', head: ['Call', 'Generates'], rows: [
            ['range(6)', '0 1 2 3 4 5'], ['range(3, 6)', '3 4 5'], ['range(3, 20, 2)', '3 5 7 … 19'], ['range(10, 0, -1)', '10 9 8 … 1 (count down)'],
          ] },
          { type: 'code', lang: 'python', runnable: true, code: 'for i in range(1, 6):\n    print("*" * i)          # star pattern with a loop\n\nfor count in range(10, 0, -1):\n    print(count, end=" ")' },
          { type: 'compare', items: [
            { title: 'break', tone: 'red', points: ['Exits the loop immediately', 'for n in range(1,10): if n>5: break'] },
            { title: 'continue', tone: 'amber', points: ['Skips rest of this iteration', 'Print only odd: if n%2==0: continue'] },
            { title: 'pass', tone: 'blue', points: ['Does nothing — placeholder', 'Needed where syntax requires a statement'] },
          ] },
        ],
      },
      {
        id: 'while',
        title: 'while loop',
        blocks: [
          { type: 'p', text: '`while <condition>:` repeats while the condition is True — **indefinite iteration**. Update the loop variable inside the body or you get an infinite loop.' },
          { type: 'code', lang: 'python', runnable: true, title: 'Sum 1..100000 — for vs while', code: 'theSum = 0\nfor count in range(1, 100001):\n    theSum += count\nprint(theSum)\n\ntheSum, count = 0, 1\nwhile count <= 100000:\n    theSum += count\n    count += 1\nprint(theSum)' },
          { type: 'code', lang: 'python', runnable: true, title: 'Random numbers', code: 'import random\nfor roll in range(10):\n    print(random.randint(1, 6), end=" ")' },
        ],
      },
      {
        id: 'sequences',
        title: 'Sequence data types in Python - list, tuple, set, strings, dictionary',
        blocks: [
          { type: 'compare', items: [
            { title: 'list  [ ]', tone: 'blue', points: ['Ordered, mutable, duplicates ok', 'append, insert, extend, remove, pop, index, count, sort, reverse'] },
            { title: 'tuple  ( )', tone: 'violet', points: ['Ordered, immutable', 'Single item needs comma: (42,)', 'Can be a dict key; faster'] },
            { title: 'set  { }', tone: 'green', points: ['Unordered, unique, unindexed', 'add, update, remove, discard, pop', '| & - ^ set operations', 'Empty set: set() — {} is a dict!'] },
            { title: 'str  " "', tone: 'amber', points: ['Ordered, immutable characters', 's[0], s[-1], s[::-1], split()'] },
            { title: 'dict  {k: v}', tone: 'red', points: ['Key–value pairs, keys unique & immutable', 'get, keys, values, items, update, pop, popitem'] },
          ] },
          { type: 'code', lang: 'python', runnable: true, title: 'Lists: indexing, slicing, mutation', code: 't = [9, 41, 12, 3, 74, 15]\nprint(t[1:3], t[:4], t[3:], t[-3:])\nt[2] = 28              # lists are mutable\nt[1:3] = [20, 30, 40]  # replace a slice (list grows)\nt[0:0] = [0]           # insert at the front\nprint(t)\nt.append(99); t.insert(2, 5); t.remove(74); print(t.pop(), t)' },
          { type: 'code', lang: 'python', runnable: true, title: 'Tuples & sets', code: 'person = ("Alice", 25, "Engineer")\nname, age, job = person          # unpacking\nprint(name, age, job, len(person))\n\nA, B = {1, 2, 3}, {3, 4, 5}\nprint(A | B, A & B, A - B, A ^ B)' },
          { type: 'code', lang: 'python', runnable: true, title: 'Dictionaries: word count', code: 'words = ["apple", "banana", "apple", "orange", "banana", "apple"]\ncount = {}\nfor w in words:\n    count[w] = count.get(w, 0) + 1\nprint(count)\nfor k, v in count.items():\n    print(f"{k}: {v}")', output: "{'apple': 3, 'banana': 2, 'orange': 1}\napple: 3\nbanana: 2\norange: 1" },
          { type: 'callout', tone: 'tip', text: '`s = "Banana"; s[0] = "b"` → **TypeError** because strings are immutable. Use `s.lower()` or build a new string.' },
        ],
      },
      {
        id: 'numpy',
        title: 'Creating and using Arrays in Python (using Numpy library)',
        blocks: [
          { type: 'p', text: '**NumPy** (`import numpy as np`) handles fast maths on large, multi-dimensional arrays. Every element has the **same type**, the size is **fixed** after creation, and the shape must be **rectangular**.' },
          { type: 'code', lang: 'python', runnable: true, code: 'import numpy as np\narr = np.array([1, 2, 3, 4, 5, 6])\nmat = arr.reshape(2, 3)          # 6 elements -> 2 x 3\nprint(arr, arr.ndim, arr.shape)\nprint(mat, mat.ndim, mat.shape)\nprint(mat[0, 2], mat[-1, 2], arr[1:5:2])\n\nm1 = np.array([[1, 2], [3, 4]]); m2 = np.array([[5, 6], [7, 8]])\nprint(np.add(m1, m2)); print(np.matmul(m1, m2)); print(np.transpose(m1))' },
          { type: 'table', head: ['Operation', 'NumPy'], rows: [['Add', 'np.add(x, y)'], ['Subtract', 'np.subtract(x, y)'], ['Element-wise multiply', 'np.multiply(x, y)'], ['Matrix multiply', 'np.matmul(x, y)'], ['Transpose', 'np.transpose(x)'], ['Change shape', 'x.reshape(r, c) — total elements must match']] },
        ],
      },
    ],
    starterCode: `# Telephone directory with a dictionary (menu-driven)
directory = {"Asha": "9876543210", "Rahul": "9123456780"}

def show():
    for name, phone in sorted(directory.items()):
        print(f"  {name:<8} {phone}")

directory["Meera"] = "9988776655"   # add
directory["Rahul"] = "9000000001"   # update
directory.pop("Asha", None)         # delete
print("Search Meera ->", directory.get("Meera", "not found"))
show()

# Lists, slicing and loops
nums = [12, 75, 34, 99, 45, 67]
largest = nums[0]
for n in nums:
    if n > largest:
        largest = n
print("Largest:", largest, "| first 3:", nums[:3], "| reversed:", nums[::-1])
`,
  },

  /* ============================ 3.2 ============================ */
  {
    id: 'm3-decomposition',
    moduleId: 3,
    title: 'Decomposition and Modularization',
    short: 'Functions',
    icon: 'Boxes',
    summary: 'Breaking big problems into small, testable pieces — and expressing those pieces as Python functions, including functions that return several values.',
    subtopics: [
      'Problem decomposition as a strategy for solving complex problems',
      'Modularization',
      'Motivation for modularization',
      'Defining and using functions in Python',
      'Functions with multiple return values',
    ],
    keywords: ['decomposition', 'modular', 'module', 'function', 'def ', 'return', 'parameter', 'argument', 'multiple return', 'top three', 'import'],
    visualizers: ['topthree', 'mergesort'],
    takeaways: [
      'Decomposition breaks a big task into smaller self-contained functions that are easier to code, test and debug.',
      'Modularization splits a program into independent, reusable modules (functions, classes, files, packages).',
      'Motivations: readability, maintenance, reusability, collaboration, testing, scalability.',
      'def name(params): … return value — defining a function does not run it; you must call it.',
      'return a, b packs a tuple; unpack with x, y = f(). Lists and dicts can also carry many values.',
    ],
    sections: [
      {
        id: 'decomposition',
        title: 'Problem decomposition as a strategy for solving complex problems',
        blocks: [
          { type: 'p', text: '**Problem decomposition** breaks a large programming task into smaller, self-contained modules or functions that are easier to understand, code, test and debug.' },
          { type: 'compare', items: [
            { title: 'Clarity', tone: 'blue', points: ['Small tasks are easier to grasp'] },
            { title: 'Reusability', tone: 'green', points: ['Parts become reusable functions'] },
            { title: 'Debugging', tone: 'amber', points: ['Isolate errors in small parts'] },
            { title: 'Collaboration', tone: 'violet', points: ['Team members work in parallel'] },
            { title: 'Maintainability', tone: 'red', points: ['Change one part safely'] },
          ] },
          { type: 'h', text: 'Syllabus example: top three integers from a list (n ≥ 3)' },
          { type: 'flow', steps: [
            { label: 'Read the list' }, { label: 'update_top3(x)', desc: 'Sub-problem: insert x into (first, second, third)' }, { label: 'Scan every element' }, { label: 'Return first, second, third' },
          ] },
          { type: 'p', text: '**Merge sort** is the other syllabus example: *sort a list* is decomposed into *split*, *sort each half* (the same problem, smaller) and *merge two sorted lists*. Both are animated in this topic.' },
          { type: 'list', items: ['Keep functions small — one task each', 'Use meaningful names (`calculate_total`)', 'Test incrementally', 'Document with comments', 'Think recursively where it fits'] },
        ],
      },
      {
        id: 'modularization',
        title: 'Modularization',
        blocks: [
          { type: 'p', text: '**Modularization** divides a large program into smaller, self-contained, reusable **modules**, each doing one job, which work together while staying independent. A module may be a function, a class, a package, or a separate library/component.' },
          { type: 'code', lang: 'python', title: 'Lab 16/17: define a module and import it', code: '# fibmodule.py\ndef fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        print(a, end=" ")\n        a, b = b, a + b\n\n# main.py\nimport fibmodule            # whole module\nfibmodule.fib(10)\nfrom fibmodule import fib   # one specific function\nfib(5)' },
        ],
      },
      {
        id: 'motivation',
        title: 'Motivation for modularization',
        blocks: [
          { type: 'table', head: ['Motivation', 'Example'], rows: [
            ['Improved readability', 'user.py, database.py, utils.py instead of one giant file'],
            ['Easier maintenance', 'A bug in email_sender doesn’t require reading unrelated code'],
            ['Code reusability', 'factorial() in math_utils.py reused everywhere'],
            ['Supports collaboration', 'One dev on authentication.py, another on payment_processing.py'],
            ['Encourages testing', 'Unit-test login() in auth.py in isolation'],
            ['Facilitates scalability', 'Add report_generator.py without touching payroll code'],
          ] },
        ],
      },
      {
        id: 'functions',
        title: 'Defining and using functions in Python',
        blocks: [
          { type: 'code', lang: 'python', runnable: true, code: 'def greet(name):            # name is a parameter\n    print("Hello", name)\n\ngreet("John")               # "John" is the argument\n\ndef find_square(num):\n    result = num * num\n    return result           # function ends here\n\nsquare = find_square(3)\nprint("Square:", square)' },
          { type: 'flow', title: 'How a call works', steps: [
            { label: 'Call greet()', desc: 'Control jumps to the definition' }, { label: 'Run the body' }, { label: 'return / end', desc: 'Back to the line after the call' },
          ] },
          { type: 'callout', tone: 'key', text: 'A function without `return` gives back **None**. Code after `return` never runs.' },
          { type: 'code', lang: 'python', runnable: true, title: 'Lab 15: right-triangle check with functions', code: 'def is_right_triangle(a, b, c):\n    a, b, c = sorted([a, b, c])\n    return a*a + b*b == c*c\n\nprint(is_right_triangle(3, 4, 5))\nprint(is_right_triangle(2, 3, 4))' },
        ],
      },
      {
        id: 'multiple',
        title: 'Functions with multiple return values',
        blocks: [
          { type: 'code', lang: 'python', runnable: true, code: 'def calculate_area_and_perimeter(length, width):\n    area = length * width\n    perimeter = 2 * (length + width)\n    return area, perimeter        # packed into a tuple\n\nresult = calculate_area_and_perimeter(5, 3)\nprint(result)                     # (15, 16)\narea, perimeter = calculate_area_and_perimeter(5, 3)\nprint(f"Area: {area}, Perimeter: {perimeter}")' },
          { type: 'compare', items: [
            { title: 'Tuple (most common)', tone: 'blue', points: ['return w, h', 'w, h = f()'] },
            { title: 'List', tone: 'green', points: ['return [a, b, c]', 'Mutable after return'] },
            { title: 'Dictionary', tone: 'amber', points: ['return {"name": n, "age": a}', 'Named values'] },
          ] },
        ],
      },
    ],
    starterCode: `# Decomposition: top three integers from a list
def update_top3(top, x):
    """Sub-problem: place x into the (first, second, third) triple."""
    first, second, third = top
    if x > first:
        return x, first, second
    elif x > second:
        return first, x, second
    elif x > third:
        return first, second, x
    return top

def top_three(nums):
    top = (float('-inf'),) * 3
    for x in nums:
        top = update_top3(top, x)
    return top            # multiple return values (a tuple)

first, second, third = top_three([12, 75, 34, 99, 45, 67])
print("Top three:", first, second, third)
`,
  },

  /* ============================ 3.3 ============================ */
  {
    id: 'm3-recursion',
    moduleId: 3,
    title: 'Recursion',
    short: 'Recursion',
    icon: 'Layers',
    summary: 'Functions that call themselves: base case, recursive case, how the call stack grows and unwinds, how to avoid infinite recursion, and the five classic sample problems.',
    subtopics: [
      'Recursion Defined',
      'Reasons for using Recursion',
      'The Call Stack',
      'Recursion and the Stack',
      'Avoiding Circularity in Recursion',
      'Sample problems - nth Fibonacci number, GCD of two positive integers, factorial, adding two positive integers, sum of digits of a positive number',
    ],
    keywords: ['recursion', 'recursive', 'base case', 'call stack', 'stack', 'circularity', 'infinite recursion', 'fibonacci', 'gcd', 'greatest common divisor', 'factorial', 'sum of digits', 'adding two', 'lifo'],
    visualizers: ['callstack'],
    takeaways: [
      'Recursion: a function calls itself on a smaller instance until it hits a base case.',
      'Every recursive function needs a base case AND must progress toward it.',
      'The call stack is LIFO: each call pushes a frame; at the base case frames pop and return in reverse order.',
      'No base case / no progress → circularity → infinite recursion → stack overflow (RecursionError).',
      'Recursion is elegant for divide-and-conquer & trees but uses more memory than iteration.',
    ],
    sections: [
      {
        id: 'defined',
        title: 'Recursion Defined',
        blocks: [
          { type: 'p', text: '**Recursion** is a technique where a function calls itself to solve a smaller instance of the same problem, until the problem is reduced to a **base case** where the recursion stops.' },
          { type: 'compare', items: [
            { title: 'Base case', tone: 'green', points: ['Stops the recursion', 'if n == 1: return 1'] },
            { title: 'Recursive case', tone: 'blue', points: ['Smaller version of the problem', 'return n * factorial(n - 1)'] },
          ] },
          { type: 'code', lang: 'python', runnable: true, code: 'def countdown(n):\n    if n == 0:              # base case\n        print("Blastoff!")\n    else:\n        print(n)\n        countdown(n - 1)    # progress toward base case\n\ncountdown(3)' },
        ],
      },
      {
        id: 'reasons',
        title: 'Reasons for using Recursion',
        blocks: [
          { type: 'list', items: [
            '**Simplifies complex problems** that are naturally recursive (trees, mazes, factorial, file systems).',
            '**Reduces code complexity** — fewer lines than the iterative version.',
            '**Natural fit for divide and conquer** — merge sort, quick sort, binary search.',
            '**Processes dynamic/hierarchical structures** — tree traversals, graphs.',
            '**Handles unknown sizes** — generating permutations or subsets.',
          ] },
          { type: 'table', caption: 'Iteration vs Recursion', head: ['Aspect', 'Iteration', 'Recursion'], rows: [
            ['Definition', 'Repeats using loops', 'Function calls itself with modified parameters'],
            ['State', 'Explicit variables (counters)', 'Implicitly on the call stack'],
            ['Termination', 'Loop condition false', 'Base case reached'],
            ['Memory', 'Efficient, no extra frames', 'Extra stack frame per call'],
            ['Speed', 'Generally faster', 'Slower (call overhead)'],
            ['Readability', 'Clear for simple repetition', 'Elegant for trees / divide & conquer'],
            ['Typical errors', 'Off-by-one, infinite loop', 'Stack overflow, missing base case'],
          ] },
        ],
      },
      {
        id: 'callstack',
        title: 'The Call Stack',
        blocks: [
          { type: 'p', text: 'A **stack** is LIFO — Last In, First Out. `push 10 → [10]`, `push 20 → [10, 20]`, `pop → [10]`. The **call stack** is the special stack a program uses to manage function calls: each call pushes its execution context (parameters, local variables, return point).' },
          { type: 'flow', steps: [{ label: 'push factorial(4)' }, { label: 'push factorial(3)' }, { label: 'push factorial(2)' }, { label: 'push factorial(1)', desc: 'Base case → 1' }, { label: 'pop → 2×1 = 2' }, { label: 'pop → 3×2 = 6' }, { label: 'pop → 4×6 = 24' }] },
        ],
      },
      {
        id: 'stack',
        title: 'Recursion and the Stack',
        blocks: [
          { type: 'p', text: 'Every recursive call creates a **new instance** of the function with its own frame on the stack. When the base case is reached the stack **unwinds**: each pending call resumes, finishes its computation using the returned value and pops off — in reverse order.' },
          { type: 'table', caption: 'find_max_recursive([3, 1, 4, 1, 5])', head: ['Step', 'Call / Resolve', 'Action'], rows: [
            ['1', 'find_max([3,1,4,1,5])', 'calls with [1,4,1,5]'], ['2', 'find_max([1,4,1,5])', 'calls with [4,1,5]'], ['3', 'find_max([4,1,5])', 'calls with [1,5]'],
            ['4', 'find_max([1,5])', 'calls with [5]'], ['5', 'find_max([5])', 'base case → 5'], ['4', 'max(1, 5)', 'returns 5'], ['3', 'max(4, 5)', 'returns 5'], ['2', 'max(1, 5)', 'returns 5'], ['1', 'max(3, 5)', 'returns 5'],
          ] },
        ],
      },
      {
        id: 'circularity',
        title: 'Avoiding Circularity in Recursion',
        blocks: [
          { type: 'compare', items: [
            { title: '❌ Circular', tone: 'red', points: ['def bad(n):', '    print(n)', '    bad(n)   # no base case, no progress'] },
            { title: '✅ Safe', tone: 'green', points: ['def good(n):', '    if n == 0: print("Done!")', '    else: print(n); good(n - 1)'] },
          ] },
          { type: 'list', ordered: true, items: ['**Always define a base case.**', '**Make progress toward it** on every call (n − 1, list[1:], b → a % b).', '**Test edge cases** (0, 1, empty list, negative input).'] },
        ],
      },
      {
        id: 'samples',
        title: 'Sample problems - nth Fibonacci number, GCD of two positive integers, factorial, adding two positive integers, sum of digits of a positive number',
        blocks: [
          { type: 'code', lang: 'python', runnable: true, code: 'def fib(n):            # 0 1 1 2 3 5 8 ...\n    if n <= 1:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\ndef gcd(a, b):          # Euclid\n    if b == 0:\n        return a\n    return gcd(b, a % b)\n\ndef factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\ndef add(a, b):          # a + b using only +1\n    if b == 0:\n        return a\n    return add(a + 1, b - 1)\n\ndef sum_digits(n):\n    if n < 10:\n        return n\n    return n % 10 + sum_digits(n // 10)\n\nprint(fib(7), gcd(48, 18), factorial(5), add(4, 3), sum_digits(1234))', output: '13 6 120 7 10' },
          { type: 'callout', tone: 'tip', text: 'Watch each of these push and pop frames in the **Animate** tab — pick a function and an input.' },
        ],
      },
    ],
    starterCode: `def factorial(n):
    if n == 1:                 # base case
        return 1
    return n * factorial(n - 1)

def gcd(a, b):
    print(f"  gcd({a}, {b})")
    return a if b == 0 else gcd(b, a % b)

def sum_digits(n):
    return n if n < 10 else n % 10 + sum_digits(n // 10)

def product(nums):             # classroom exercise 11
    return 1 if not nums else nums[0] * product(nums[1:])

print("5! =", factorial(5))
print("gcd =", gcd(48, 18))
print("digits of 9875 sum to", sum_digits(9875))
print("product =", product([2, 3, 4]))

# Try removing the base case of factorial and run again -> RecursionError
`,
  },
]
