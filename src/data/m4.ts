import type { Topic } from './types'

export const m4Topics: Topic[] = [
  /* ============================ 4.1 ============================ */
  {
    id: 'm4-bruteforce',
    moduleId: 4,
    title: 'Brute-force Approach',
    short: 'Brute Force',
    icon: 'Lock',
    summary: 'Try every possibility until one works — guaranteed to succeed, often painfully slow. Padlock and password guessing examples.',
    subtopics: ['Brute-force Approach', 'Example: Padlock', 'Example: Password guessing'],
    keywords: ['brute force', 'brute-force', 'padlock', 'password', 'exhaustive', 'combination'],
    visualizers: ['padlock'],
    takeaways: [
      'Brute force systematically tests every candidate solution.',
      'Characteristics: exhaustive search, simple, inefficient, guaranteed to find a solution if one exists.',
      'Used when the search space is small, simplicity matters, or no better algorithm is known.',
      '3-dial padlock: 10³ = 1000 combinations. 6-char password from 95 symbols: 95⁶ ≈ 735 billion.',
    ],
    sections: [
      {
        id: 'approach',
        title: 'Brute-force Approach',
        blocks: [
          { type: 'p', text: 'The **brute-force approach** solves a problem by systematically testing **all possible solutions** until the correct one is found. It guarantees a solution if one exists but is often inefficient because of its exhaustive nature.' },
          { type: 'compare', items: [
            { title: 'Exhaustive search', tone: 'blue', points: ['Every candidate examined, no optimisation'] },
            { title: 'Simplicity', tone: 'green', points: ['Easy to understand and implement'] },
            { title: 'Inefficiency', tone: 'red', points: ['Slow — search space explodes'] },
            { title: 'Guaranteed', tone: 'violet', points: ['Finds the answer if it exists'] },
          ] },
          { type: 'p', text: 'Use it when the solution space is **small**, **simplicity** is preferred over efficiency, or **no better algorithm** is readily available.' },
        ],
      },
      {
        id: 'padlock',
        title: 'Example: Padlock',
        blocks: [
          { type: 'p', text: 'A padlock with **3 dials**, each 0–9, has 10 × 10 × 10 = **1000** combinations. Brute force starts at 000 and increments — 001, 002 … 999 — stopping when the lock opens.' },
          { type: 'code', lang: 'python', runnable: true, code: 'def padlock(key):\n    for combination in range(1000):      # 000 to 999\n        guess = f"{combination:03}"       # always 3 digits\n        if guess == key:\n            print(f"Padlock opened with {guess} after {combination + 1} tries")\n            break\n\npadlock("302")' },
        ],
      },
      {
        id: 'password',
        title: 'Example: Password guessing',
        blocks: [
          { type: 'p', text: 'A **brute-force attack** tries every possible password. With 95 printable characters (26 lower + 26 upper + 10 digits + 33 symbols) a 6-character password has 95⁶ ≈ **735 billion** possibilities — which is why long passwords matter.' },
          { type: 'table', head: ['Length', 'Digits only (10ⁿ)', 'All 95 chars (95ⁿ)'], rows: [['3', '1,000', '857,375'], ['4', '10,000', '81,450,625'], ['6', '1,000,000', '735,091,890,625'], ['8', '100,000,000', '6.6 × 10¹⁵']] },
          { type: 'code', lang: 'python', runnable: true, title: 'Guess a 3-letter password with itertools', code: 'import itertools, string\n\ndef crack(password):\n    chars = string.ascii_letters\n    tries = 0\n    for guess in itertools.product(chars, repeat=3):\n        tries += 1\n        if "".join(guess) == password:\n            print("Found", "".join(guess), "in", tries, "tries")\n            return\n\ncrack("CaT")' },
        ],
      },
    ],
    starterCode: `import itertools, string, time

def padlock(key):
    for combination in range(1000):
        guess = f"{combination:03}"
        if guess == key:
            return combination + 1

print("Padlock 302 opened after", padlock("302"), "tries")

def crack(password, chars=string.ascii_lowercase):
    start = time.time()
    for n, guess in enumerate(itertools.product(chars, repeat=len(password)), 1):
        if "".join(guess) == password:
            return n, round(time.time() - start, 3)

for pw in ["ab", "cat", "zzz"]:
    tries, secs = crack(pw)
    print(f"{pw!r}: {tries} guesses in {secs}s")
`,
  },

  /* ============================ 4.2 ============================ */
  {
    id: 'm4-divide',
    moduleId: 4,
    title: 'Divide-and-conquer Approach',
    short: 'Divide & Conquer',
    icon: 'Split',
    summary: 'Divide the problem, conquer the pieces recursively, merge the answers. Merge sort is the flagship example.',
    subtopics: ['Divide-and-conquer Approach', 'Example: The Merge Sort Algorithm', 'Advantages of Divide and Conquer Approach', 'Disadvantages of Divide and Conquer Approach'],
    keywords: ['divide and conquer', 'divide-and-conquer', 'merge sort', 'mergesort', 'merge', 'sub-problem', 'subproblem'],
    visualizers: ['mergesort'],
    takeaways: [
      'Three steps: Divide (split into sub-problems) → Conquer (solve recursively; base case directly) → Merge (combine).',
      'Sub-problems are independent, so they can even be solved in parallel.',
      'Merge sort: split until size 1, then merge sorted halves — always O(n log n).',
      'Pros: simpler sub-problems, efficiency, parallelism. Cons: recursion overhead, extra memory, overkill for small inputs.',
    ],
    sections: [
      {
        id: 'approach',
        title: 'Divide-and-conquer Approach',
        blocks: [
          { type: 'p', text: '**Divide and conquer** solves a problem by dividing it into sub-problems, solving them individually, and merging their solutions into the solution of the original problem.' },
          { type: 'flow', steps: [
            { label: 'Divide', desc: 'Break into smaller sub-problems, recursively, until trivial' },
            { label: 'Conquer', desc: 'Solve each sub-problem (base case directly)' },
            { label: 'Merge', desc: 'Combine sub-solutions into the final answer' },
          ] },
          { type: 'code', lang: 'python', runnable: true, title: 'Maximum element by divide and conquer', code: 'def find_max(arr, left, right):\n    if left == right:                 # one element\n        return arr[left]\n    mid = (left + right) // 2\n    max_left = find_max(arr, left, mid)\n    max_right = find_max(arr, mid + 1, right)\n    return max(max_left, max_right)   # merge\n\narr = [12, 34, 67, 89, 23, 45, 78]\nprint("Max:", find_max(arr, 0, len(arr) - 1))' },
        ],
      },
      {
        id: 'mergesort',
        title: 'Example: The Merge Sort Algorithm',
        blocks: [
          { type: 'list', ordered: true, items: ['**Divide:** split the array into two halves recursively until each sub-array has one element.', '**Sort:** a one-element array is already sorted.', '**Merge:** repeatedly merge two sorted sub-arrays by comparing their front elements.'] },
          { type: 'code', lang: 'python', runnable: true, code: 'def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\ndef merge(left, right):\n    result, i, j = [], 0, 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i]); i += 1\n        else:\n            result.append(right[j]); j += 1\n    return result + left[i:] + right[j:]\n\nprint(merge_sort([38, 27, 43, 3, 9, 82, 10]))', output: '[3, 9, 10, 27, 38, 43, 82]' },
        ],
      },
      {
        id: 'advantages',
        title: 'Advantages of Divide and Conquer Approach',
        blocks: [
          { type: 'list', items: ['Solves hard problems by reducing them to simpler ones', 'Efficient algorithms (merge sort O(n log n) vs O(n²) simple sorts)', 'Independent sub-problems → parallel execution', 'Good cache/memory locality on small pieces', 'Naturally expressed with recursion'] },
        ],
      },
      {
        id: 'disadvantages',
        title: 'Disadvantages of Divide and Conquer Approach',
        blocks: [
          { type: 'list', items: ['Recursion overhead — many function calls', 'Extra memory (merge sort needs auxiliary arrays; deep call stack)', 'Overkill for small or simple problems', 'If sub-problems overlap, it repeats work (use Dynamic Programming instead)', 'Merging step can be tricky to design'] },
        ],
      },
    ],
    starterCode: `def merge_sort(arr, depth=0):
    pad = "  " * depth
    print(pad + "split", arr)
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid], depth + 1)
    right = merge_sort(arr[mid:], depth + 1)
    merged, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i]); i += 1
        else:
            merged.append(right[j]); j += 1
    merged += left[i:] + right[j:]
    print(pad + "merge ->", merged)
    return merged

print(merge_sort([38, 27, 43, 3, 9, 82, 10]))
`,
  },

  /* ============================ 4.3 ============================ */
  {
    id: 'm4-dp',
    moduleId: 4,
    title: 'Dynamic Programming Approach',
    short: 'Dynamic Prog.',
    icon: 'Table',
    summary: 'Store answers to overlapping sub-problems so each is computed once. Fibonacci with memoization and tabulation, and how DP differs from plain recursion.',
    subtopics: ['Dynamic Programming Approach', 'Example: Fibonacci series', 'Recursion vs Dynamic Programming'],
    keywords: ['dynamic programming', 'memoization', 'memoisation', 'tabulation', 'top-down', 'bottom-up', 'overlapping', 'fibonacci', 'recursion vs dynamic'],
    visualizers: ['fibdp'],
    takeaways: [
      'DP: break into sub-problems → solve optimally → store results → reuse → build the final answer.',
      'Naive recursive fib(n) recomputes the same values — exponential time.',
      'Memoization = top-down recursion + cache. Tabulation = bottom-up loop filling a table.',
      'DP uses extra memory for the table but cuts time dramatically (fib: exponential → linear).',
    ],
    sections: [
      {
        id: 'approach',
        title: 'Dynamic Programming Approach',
        blocks: [
          { type: 'flow', steps: [
            { label: 'Break down', desc: 'into sub-problems' }, { label: 'Solve optimally', desc: 'each sub-problem' }, { label: 'Store', desc: 'results in a table' }, { label: 'Reuse', desc: 'avoid repeated calculation' }, { label: 'Combine', desc: 'answer for the full problem' },
          ] },
          { type: 'compare', items: [
            { title: 'Memoization (Top-Down)', tone: 'blue', points: ['Solve recursively', 'Save each result in a dict/array', 'If seen before → look it up'] },
            { title: 'Tabulation (Bottom-Up)', tone: 'green', points: ['Solve iteratively', 'Fill the table from the smallest sub-problem up', 'No recursion overhead'] },
          ] },
        ],
      },
      {
        id: 'fibonacci',
        title: 'Example: Fibonacci series',
        blocks: [
          { type: 'p', text: 'Fibonacci: 0, 1, 1, 2, 3, 5, 8, 13 … with fib(0) = 0, fib(1) = 1, fib(n) = fib(n−1) + fib(n−2). The plain recursive version computes fib(2) **three times** and fib(1) **five times** just for fib(5).' },
          { type: 'code', lang: 'python', runnable: true, title: 'Three versions side by side', code: 'calls = 0\ndef fib(n):                      # plain recursion\n    global calls; calls += 1\n    return n if n <= 1 else fib(n-1) + fib(n-2)\n\nmemo = {}\ndef fib_memo(n):                 # memoization (top-down)\n    if n in memo: return memo[n]\n    memo[n] = n if n <= 1 else fib_memo(n-1) + fib_memo(n-2)\n    return memo[n]\n\ndef fib_tab(n):                  # tabulation (bottom-up)\n    table = [0, 1] + [0] * (n - 1)\n    for i in range(2, n + 1):\n        table[i] = table[i-1] + table[i-2]\n    return table[n]\n\nprint(fib(20), "using", calls, "calls")\nprint(fib_memo(20), fib_tab(20))' },
        ],
      },
      {
        id: 'vs',
        title: 'Recursion vs Dynamic Programming',
        blocks: [
          { type: 'table', head: ['Feature', 'Recursion', 'Dynamic Programming'], rows: [
            ['Definition', 'Function calls itself on smaller problems until a condition is met', 'Breaks into sub-problems and stores their results to avoid recomputation'],
            ['Approach', 'Top-down', 'Usually bottom-up (tabulation), or top-down with memoization'],
            ['Base case', 'Essential to stop recursion', 'Also needed; focus is on iteratively filling the table'],
            ['Performance', 'Slower — call overhead and redundant work', 'Faster — each sub-problem solved once'],
            ['Memory', 'Only stack space', 'Extra memory for the table'],
            ['Time complexity', 'Often exponential with overlapping sub-problems', 'Much lower (fib: linear)'],
          ] },
        ],
      },
    ],
    starterCode: `import time

def fib(n):
    return n if n <= 1 else fib(n - 1) + fib(n - 2)

memo = {}
def fib_memo(n):
    if n not in memo:
        memo[n] = n if n <= 1 else fib_memo(n - 1) + fib_memo(n - 2)
    return memo[n]

def fib_tab(n):
    t = [0, 1]
    for i in range(2, n + 1):
        t.append(t[i - 1] + t[i - 2])
    return t[:n + 1]

for f in (fib, fib_memo):
    s = time.time()
    print(f.__name__, f(27), f"{time.time() - s:.4f}s")
print("table:", fib_tab(12))
`,
  },

  /* ============================ 4.4 ============================ */
  {
    id: 'm4-greedy',
    moduleId: 4,
    title: 'Greedy Algorithm Approach',
    short: 'Greedy',
    icon: 'Coins',
    summary: 'Always take the choice that looks best right now. Task completion, coin change and fractional knapsack — and when greedy is (and isn’t) optimal.',
    subtopics: [
      'Example: Given an array of positive integers each indicating the completion time for a task, find the maximum number of tasks that can be completed in the limited amount of time that you have',
      'Motivations for the Greedy Approach',
      'Characteristics of the Greedy Algorithm',
      'Greedy Algorithms vs Dynamic Programming',
    ],
    keywords: ['greedy', 'locally optimal', 'task', 'completion time', 'maximum number of tasks', 'coin', 'knapsack', 'greedy vs'],
    visualizers: ['greedy', 'coins'],
    takeaways: [
      'Greedy builds a solution piece by piece, always picking the locally best option, hoping for a global optimum.',
      'Task completion: sort times ascending, keep adding while total ≤ available time. [2,3,1,4,6], T=8 → 3 tasks.',
      'Characteristics: local optimisation, irrevocable decisions, problem-specific heuristics, efficient, not always optimal.',
      'DP guarantees an optimum by considering all cases (more time & memory); greedy is faster but may miss it.',
    ],
    sections: [
      {
        id: 'example',
        title: 'Example: Given an array of positive integers each indicating the completion time for a task, find the maximum number of tasks that can be completed in the limited amount of time that you have',
        blocks: [
          { type: 'p', text: 'A **greedy algorithm** makes a sequence of **locally optimal** choices hoping they lead to a **globally optimal** solution. To finish the *most* tasks, always do the *shortest* remaining task next.' },
          { type: 'flow', steps: [
            { label: 'Sort ascending', desc: '[2,3,1,4,6] → [1,2,3,4,6]' }, { label: 'Take 1', desc: 'total 1, count 1' }, { label: 'Take 2', desc: 'total 3, count 2' }, { label: 'Take 3', desc: 'total 6, count 3' }, { label: '4 doesn’t fit', desc: '6 + 4 > 8 → stop' },
          ] },
          { type: 'code', lang: 'python', runnable: true, code: 'def max_tasks(completion_times, available_time):\n    completion_times.sort()              # greedy choice: shortest first\n    total_time = task_count = 0\n    for t in completion_times:\n        if total_time + t <= available_time:\n            total_time += t\n            task_count += 1\n        else:\n            break\n    return task_count\n\nprint(max_tasks([2, 3, 1, 4, 6], 8))', output: '3' },
          { type: 'h', text: 'More greedy examples from the notes' },
          { type: 'compare', items: [
            { title: 'Coin change (₹1, 2, 5, 10)', tone: 'amber', points: ['Always take the largest coin that fits', '₹18 = 10 + 5 + 2 + 1 → 4 coins'] },
            { title: 'Fractional knapsack', tone: 'green', points: ['Sort items by profit/weight', 'Take whole items while they fit, then a fraction', 'Mr. Chottu’s 15 kg bag → profit 55.33'] },
            { title: 'Travel TVM → Ernakulam', tone: 'blue', points: ['Filter by time → airplane, train', 'Then by cost → train', 'Then practical constraints'] },
          ] },
        ],
      },
      {
        id: 'motivations',
        title: 'Motivations for the Greedy Approach',
        blocks: [
          { type: 'list', items: ['**Simplicity** — straightforward logic, minimal data structures.', '**Efficiency** — fast execution, low memory.', '**Optimal for specific problems** — when the *greedy-choice property* and *optimal substructure* hold.', '**Real-world applicability** — scheduling, network routing, resource allocation; quick near-optimal answers.'] },
        ],
      },
      {
        id: 'characteristics',
        title: 'Characteristics of the Greedy Algorithm',
        blocks: [
          { type: 'compare', items: [
            { title: 'Local optimisation', tone: 'blue', points: ['Best choice using current state only'] },
            { title: 'Irrevocable decisions', tone: 'red', points: ['No backtracking / revision'] },
            { title: 'Problem-specific heuristics', tone: 'amber', points: ['Rule tailored to the problem'] },
            { title: 'Optimality', tone: 'green', points: ['Optimal for coin change (standard coins), Huffman, Kruskal — not universally'] },
            { title: 'Efficiency', tone: 'violet', points: ['High time and space efficiency'] },
          ] },
          { type: 'callout', tone: 'warn', text: 'Greedy can fail: with coins {1, 3, 4} and amount 6, greedy picks 4+1+1 (3 coins) but 3+3 (2 coins) is optimal. Try it in **Animate → Coin change**.' },
        ],
      },
      {
        id: 'vs',
        title: 'Greedy Algorithms vs Dynamic Programming',
        blocks: [
          { type: 'table', head: ['Feature', 'Greedy', 'Dynamic Programming'], rows: [
            ['Optimality', 'No guarantee of optimal solution', 'Guaranteed optimal — considers all cases'],
            ['Approach', 'Locally optimal choice at each stage', 'Recurrence using previously computed states'],
            ['Memory', 'Efficient — never revisits choices', 'Needs a DP table (more memory)'],
            ['Time', 'Generally faster', 'Generally slower'],
            ['Backtracking', 'Never', 'Implicitly considers alternatives'],
          ] },
        ],
      },
    ],
    starterCode: `def max_tasks(times, available):
    times = sorted(times)
    total = count = 0
    chosen = []
    for t in times:
        if total + t > available:
            break
        total += t; count += 1; chosen.append(t)
    return count, chosen

print(max_tasks([2, 3, 1, 4, 6], 8))

def greedy_coins(amount, coins=(10, 5, 2, 1)):
    used = []
    for c in sorted(coins, reverse=True):
        while amount >= c:
            amount -= c; used.append(c)
    return used

print("Rs 18 ->", greedy_coins(18))
print("6 with {4,3,1} ->", greedy_coins(6, (4, 3, 1)), "(optimal is [3, 3]!)")
`,
  },

  /* ============================ 4.5 ============================ */
  {
    id: 'm4-random',
    moduleId: 4,
    title: 'Randomized Approach',
    short: 'Randomized',
    icon: 'Dices',
    summary: 'Use randomness to simulate and estimate. The coupon-collector jeans problem, the hat-check problem, Monte Carlo π, and why randomness helps.',
    subtopics: [
      'Example 1: A company selling jeans gives a coupon for each pair of jeans. There are n different coupons. Collecting n different coupons would give you free jeans. How many jeans do you expect to buy before getting a free one?',
      'Example 2: n people go to a party and drop off their hats to a hat-check person. When the party is over, a different hat-check person is on duty and returns the n hats randomly back to each person. What is the expected number of people who get back their hats?',
      'Motivations for the Randomized Approach',
    ],
    keywords: ['random', 'randomized', 'randomised', 'coupon', 'jeans', 'hat', 'hat-check', 'expected number', 'monte carlo', 'probability', 'simulation', 'coin toss'],
    visualizers: ['coupon', 'hats', 'montecarlo'],
    takeaways: [
      'Randomized algorithms use random input/choices; results vary but are statistically predictable.',
      'Coupon collector: expected purchases = n·(1 + 1/2 + … + 1/n) = n·Hₙ (n = 10 → ≈ 29.3).',
      'Hat check: expected number of people who get their own hat = 1, for any n.',
      'Monte Carlo: area of unit circle ≈ 4 × (points inside / total points) → π.',
      'Motivations: complexity reduction, versatility, performance on large data. Trade-off: no deterministic guarantee.',
    ],
    sections: [
      {
        id: 'coupon',
        title: 'Example 1: Coupon collector (free jeans)',
        blocks: [
          { type: 'p', text: 'Each pair of jeans comes with one of **n** equally likely coupons. When you already hold *k* different coupons, the chance the next one is new is (n − k)/n, so on average you wait n/(n − k) purchases. Adding these up:' },
          { type: 'callout', tone: 'exam', title: 'Expected purchases', text: '**E = n/n + n/(n−1) + … + n/1 = n × (1 + 1/2 + 1/3 + … + 1/n) = n·Hₙ.** For n = 5 → ≈ 11.4; n = 10 → ≈ 29.3.' },
          { type: 'code', lang: 'python', runnable: true, code: 'import random\n\ndef buy_until_free(n):\n    seen, bought = set(), 0\n    while len(seen) < n:\n        seen.add(random.randint(1, n))\n        bought += 1\n    return bought\n\nn, trials = 10, 10000\navg = sum(buy_until_free(n) for _ in range(trials)) / trials\nexact = n * sum(1 / k for k in range(1, n + 1))\nprint(f"simulated {avg:.2f}  vs  theory {exact:.2f}")' },
        ],
      },
      {
        id: 'hats',
        title: 'Example 2: Hat-check problem',
        blocks: [
          { type: 'p', text: 'Hats are returned as a **random permutation**. Each person gets their own hat with probability 1/n. By linearity of expectation, the expected number of matches is n × (1/n) = **1**, no matter how many people attend.' },
          { type: 'code', lang: 'python', runnable: true, code: 'import random\n\ndef party(n):\n    hats = list(range(n))\n    random.shuffle(hats)\n    return sum(1 for person, hat in enumerate(hats) if person == hat)\n\nfor n in (3, 10, 100):\n    avg = sum(party(n) for _ in range(20000)) / 20000\n    print(f"n = {n:>3}: average matches = {avg:.3f}")' },
        ],
      },
      {
        id: 'motivations',
        title: 'Motivations for the Randomized Approach',
        blocks: [
          { type: 'compare', items: [
            { title: 'Complexity reduction', tone: 'blue', points: ['Probabilistic decisions simplify hard problems', 'e.g. place screening stations by sampling'] },
            { title: 'Versatility', tone: 'green', points: ['Optimisation, simulation, many domains'] },
            { title: 'Performance', tone: 'amber', points: ['Efficient on large datasets'] },
          ] },
          { type: 'h', text: 'Characteristics' },
          { type: 'list', items: ['**Probabilistic choices** — outcomes vary but are statistically predictable.', '**Efficiency** — trades deterministic guarantees for probabilistic correctness.', '**Average-case complexity** — judged over many runs, not the worst case.'] },
          { type: 'table', head: ['Randomized', 'Deterministic'], rows: [['Incorporates chance', 'Exact, repeatable results'], ['Good for large, complex, variable data', 'Good for precision-critical problems'], ['e.g. estimate satisfaction by sampling', 'e.g. exact shopping bill']] },
          { type: 'h', text: 'Python’s random module' },
          { type: 'table', head: ['Function', 'Returns'], rows: [['random.random()', 'float in [0, 1)'], ['random.uniform(a, b)', 'float between a and b'], ['random.randint(a, b)', 'int between a and b (inclusive)'], ['random.choice(seq)', 'one random element'], ['random.choices(seq, k=n)', 'n elements with replacement'], ['random.shuffle(list)', 'shuffles in place']] },
          { type: 'code', lang: 'python', runnable: true, title: 'Monte Carlo: area of the unit circle', code: 'import random\nnum_points, inside = 100000, 0\nfor _ in range(num_points):\n    x, y = random.uniform(-1, 1), random.uniform(-1, 1)\n    if x**2 + y**2 <= 1:\n        inside += 1\nprint("Estimated area:", 4 * inside / num_points)' },
        ],
      },
    ],
    starterCode: `import random

# Coin toss experiment: does P(head) approach 0.5?
for n in [100, 500, 1000, 5000, 100000]:
    heads = sum(random.randint(0, 1) for _ in range(n))
    print(f"{n:>6} tosses -> P(head) = {heads / n:.4f}")

# Coupon collector
def buy_until_free(n):
    seen, bought = set(), 0
    while len(seen) < n:
        seen.add(random.randrange(n)); bought += 1
    return bought

n = 5
avg = sum(buy_until_free(n) for _ in range(5000)) / 5000
print(f"n={n}: ~{avg:.2f} jeans (theory {n * sum(1/k for k in range(1, n+1)):.2f})")
`,
  },
]
