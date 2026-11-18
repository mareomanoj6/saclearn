import type { QuizQuestion } from './types'

type Q = Omit<QuizQuestion, 'id' | 'topicId'>
const q = (topicId: string, rows: Q[]): QuizQuestion[] => rows.map((r, i) => ({ ...r, id: `${topicId}-q${i + 1}`, topicId }))

export const QUIZZES: QuizQuestion[] = [
  ...q('m1-strategies', [
    { kind: 'mcq', question: 'Which of these is an ill-defined problem?', options: ['Solve 2x + 3 = 7', 'Complete a crossword', 'Design a sustainable city', 'Bake a cake from a recipe'], answer: 2, explain: 'It has vague goals, many stakeholders and no single correct solution.' },
    { kind: 'mcq', question: 'Minimum number of moves to solve Tower of Hanoi with 5 disks?', options: ['25', '31', '32', '63'], answer: 1, explain: '2ⁿ − 1 = 2⁵ − 1 = 31.' },
    { kind: 'mcq', question: 'Planning backwards from a 3:00 pm meeting to decide when to start getting ready is an example of…', options: ['Trial and error', 'Working backwards heuristic', 'Brute force', 'Means-ends analysis'], answer: 1, explain: 'You start from the end result and work back through the steps.' },
    { kind: 'mcq', question: 'Which strategy undoes the last choice on reaching a dead end?', options: ['Heuristics', 'Backtracking', 'Greedy', 'Trial and error'], answer: 1, explain: 'Backtracking returns to the previous decision point and tries another path.' },
    { kind: 'output', question: 'What does this print?', code: 'def hanoi(n):\n    if n == 0:\n        return 0\n    return 2 * hanoi(n - 1) + 1\nprint(hanoi(4))', options: ['8', '15', '16', '7'], answer: 1, explain: 'T(n) = 2T(n−1) + 1 → 1, 3, 7, 15.' },
  ]),
  ...q('m1-process', [
    { kind: 'mcq', question: 'Which register holds the address of the next instruction?', options: ['Accumulator', 'Instruction Register', 'Program Counter', 'MAR'], answer: 2, explain: 'The PC points to the next instruction to fetch.' },
    { kind: 'mcq', question: 'Correct order of the instruction cycle:', options: ['Decode → Fetch → Execute → Store', 'Fetch → Decode → Execute → Store', 'Fetch → Execute → Decode → Store', 'Store → Fetch → Decode → Execute'], answer: 1, explain: 'Fetch from memory, decode, execute, then store the result.' },
    { kind: 'mcq', question: 'In which step do you decide the formula D = b² − 4ac?', options: ['Understanding the problem', 'Formulating a model', 'Testing the program', 'Evaluating the solution'], answer: 1, explain: 'Formulating a model = finding how to compute the answer from the data.' },
    { kind: 'mcq', question: 'Which memory is volatile?', options: ['ROM', 'Hard disk', 'RAM', 'Magnetic tape'], answer: 2, explain: 'RAM loses its contents when power is switched off.' },
    { kind: 'output', question: 'Output?', code: 'a, b, c = 1, 5, 6\nd = (b**2) - (4*a*c)\nprint(d)', options: ['1', '-1', '49', '11'], answer: 0, explain: '25 − 24 = 1.' },
  ]),
  ...q('m1-python', [
    { kind: 'mcq', question: 'Which is a valid identifier?', options: ['4thQtr', 'total$', '_total2', 'for'], answer: 2, explain: 'Starts with an underscore, only letters/digits/underscore, not a keyword.' },
    { kind: 'output', question: 'Output?', code: 'print(2 + 3 * 4 ** 2)', options: ['400', '50', '196', '62'], answer: 1, explain: '4**2 = 16, 3*16 = 48, 2 + 48 = 50.' },
    { kind: 'output', question: 'Output?', code: 'print(7 // 2, 7 % 2, 7 / 2)', options: ['3 1 3.5', '3.5 1 3', '3 1 3', '4 1 3.5'], answer: 0, explain: 'Floor division 3, remainder 1, true division 3.5.' },
    { kind: 'output', question: 'Output?', code: 'x = input()   # user types 5\nprint(x * 2)', options: ['10', '55', 'Error', '5 5'], answer: 1, explain: 'input() returns the string "5"; "5" * 2 = "55".' },
    { kind: 'output', question: 'Output?', code: "print('a', 'b', 'c', sep='-', end='!')", options: ['a b c!', 'a-b-c!', 'a-b-c-!', 'abc!'], answer: 1, explain: 'sep goes between items; end replaces the newline.' },
    { kind: 'output', question: 'Output?', code: 'import math\nprint(math.ceil(4.2), math.floor(-4.2))', options: ['5 -4', '4 -5', '5 -5', '4 -4'], answer: 2, explain: 'ceil(4.2) = 5; floor(−4.2) = −5 (largest integer ≤ −4.2).' },
    { kind: 'output', question: 'Output?', code: 'print(60 & 13, 60 >> 2)', options: ['12 15', '61 240', '49 15', '12 240'], answer: 0, explain: '0011 1100 & 0000 1101 = 0000 1100 = 12; 60 >> 2 = 15.' },
  ]),
  ...q('m2-pseudocode', [
    { kind: 'mcq', question: 'Which loop always executes its body at least once?', options: ['FOR', 'WHILE', 'REPEAT-UNTIL', 'None'], answer: 2, explain: 'REPEAT-UNTIL checks the condition at the end (exit-controlled).' },
    { kind: 'mcq', question: 'Selecting among many alternatives based on one variable is best expressed with…', options: ['Sequencing', 'CASE structure', 'REPEAT-UNTIL', 'FOR loop'], answer: 1, explain: 'SWITCH/CASE matches one expression against many values.' },
    { kind: 'mcq', question: 'A student scores 87. KTU grade?', options: ['S', 'A+', 'A', 'B+'], answer: 1, explain: '85–89 is A+ (grade point 9).' },
    { kind: 'output', question: 'Trace: what is printed?', code: 'SET sum = 0\nSET i = 1\nREPEAT\n    sum = sum + i\n    i = i + 2\nUNTIL i > 7\nPRINT sum', options: ['16', '9', '25', '15'], answer: 0, explain: 'i = 1, 3, 5, 7 are added → 16; then i = 9 > 7 stops.' },
    { kind: 'mcq', question: 'WHILE is called an…', options: ['Exit-controlled loop', 'Entry-controlled loop', 'Definite loop', 'Infinite loop'], answer: 1, explain: 'The condition is tested before entering the body.' },
  ]),
  ...q('m2-flowcharts', [
    { kind: 'mcq', question: 'Which symbol is used for input/output?', options: ['Rectangle', 'Diamond', 'Parallelogram', 'Oval'], answer: 2, explain: 'Parallelograms show reading input or printing output.' },
    { kind: 'mcq', question: 'Which symbol represents a FOR loop?', options: ['Hexagon', 'Circle', 'Pentagon', 'Diamond'], answer: 0, explain: 'The hexagon (preparation symbol) is used for FOR loops.' },
    { kind: 'mcq', question: 'An off-page connector is drawn as…', options: ['Small circle', 'Pentagon (home-plate)', 'Double rectangle', 'Arrow'], answer: 1, explain: 'Circles connect on the same page; the pentagon continues to another page.' },
    { kind: 'mcq', question: 'Which symbol may have more than one exit?', options: ['Process', 'Input/Output', 'Decision', 'Terminal'], answer: 2, explain: 'Only the decision symbol branches (Yes/No).' },
  ]),
  ...q('m3-selection', [
    { kind: 'output', question: 'Output?', code: 'print(list(range(10, 0, -3)))', options: ['[10, 7, 4, 1]', '[10, 7, 4]', '[9, 6, 3]', '[10, 7, 4, 1, -2]'], answer: 0, explain: 'Start 10, step −3, stop before 0: 10, 7, 4, 1.' },
    { kind: 'output', question: 'Output?', code: 'for n in range(1, 10):\n    if n % 2 == 0:\n        continue\n    if n > 6:\n        break\n    print(n, end=" ")', options: ['1 3 5', '1 3 5 7', '2 4 6', '1 3 5 7 9'], answer: 0, explain: 'Evens skipped; at 7 the loop breaks before printing.' },
    { kind: 'output', question: 'Output?', code: 't = [9, 41, 12, 3, 74, 15]\nprint(t[1:3], t[-2:])', options: ['[41, 12] [74, 15]', '[9, 41] [74, 15]', '[41, 12, 3] [15]', '[41, 12] [3, 74]'], answer: 0, explain: 'Slice end is exclusive; −2: takes the last two.' },
    { kind: 'output', question: 'Output?', code: 'A = {1, 2, 3}\nB = {3, 4, 5}\nprint(A ^ B)', options: ['{3}', '{1, 2, 3, 4, 5}', '{1, 2, 4, 5}', '{1, 2}'], answer: 2, explain: 'Symmetric difference: in either set but not both.' },
    { kind: 'mcq', question: 'type({}) is…', options: ['set', 'dict', 'list', 'tuple'], answer: 1, explain: 'Empty braces create a dictionary; use set() for an empty set.' },
    { kind: 'output', question: 'Output?', code: 'import numpy as np\na = np.array([1, 2, 3, 4, 5, 6]).reshape(2, 3)\nprint(a.shape, a[1, 0])', options: ['(2, 3) 4', '(3, 2) 3', '(2, 3) 2', '(6,) 4'], answer: 0, explain: 'Rows [1 2 3] and [4 5 6]; a[1,0] = 4.' },
    { kind: 'output', question: 'Output?', code: 'd = {"a": 1}\nd["b"] = 2\nd["a"] = 5\nprint(len(d), d.get("c", 0))', options: ['3 0', '2 0', '2 None', 'KeyError'], answer: 1, explain: 'Keys a and b; get returns the default 0 for a missing key.' },
  ]),
  ...q('m3-decomposition', [
    { kind: 'output', question: 'Output?', code: 'def f(a, b):\n    return a + b, a * b\n\nx = f(3, 4)\nprint(x)', options: ['7 12', '(7, 12)', '[7, 12]', '7'], answer: 1, explain: 'Multiple return values are packed into a tuple.' },
    { kind: 'output', question: 'Output?', code: 'def greet():\n    print("Hi")\n\nr = greet()\nprint(r)', options: ['Hi', 'Hi, then None', 'None', 'Error'], answer: 1, explain: 'greet prints "Hi" and returns None, which is then printed.' },
    { kind: 'mcq', question: 'Which is NOT a motivation for modularization?', options: ['Code reusability', 'Easier testing', 'Faster CPU clock speed', 'Team collaboration'], answer: 2, explain: 'Modularization is about code organisation, not hardware.' },
    { kind: 'mcq', question: 'In def area(l, w):, l and w are…', options: ['Arguments', 'Parameters', 'Return values', 'Modules'], answer: 1, explain: 'Names in the definition are parameters; values in the call are arguments.' },
  ]),
  ...q('m3-recursion', [
    { kind: 'output', question: 'Output?', code: 'def f(n):\n    if n < 10:\n        return n\n    return n % 10 + f(n // 10)\nprint(f(4321))', options: ['10', '4321', '1234', '24'], answer: 0, explain: 'Sum of digits: 1 + 2 + 3 + 4 = 10.' },
    { kind: 'output', question: 'Output?', code: 'def gcd(a, b):\n    return a if b == 0 else gcd(b, a % b)\nprint(gcd(48, 18))', options: ['3', '6', '9', '18'], answer: 1, explain: 'gcd(48,18) → gcd(18,12) → gcd(12,6) → gcd(6,0) = 6.' },
    { kind: 'mcq', question: 'How many frames are on the stack at the deepest point of factorial(4) (base case n == 1)?', options: ['3', '4', '5', '1'], answer: 1, explain: 'factorial(4), (3), (2), (1) — four frames.' },
    { kind: 'mcq', question: 'A recursive function with no base case will…', options: ['Return None', 'Run once', 'Cause infinite recursion / stack overflow', 'Be optimised automatically'], answer: 2, explain: 'Python raises RecursionError when the stack limit is reached.' },
    { kind: 'output', question: 'Output?', code: 'def fib(n):\n    return n if n <= 1 else fib(n-1) + fib(n-2)\nprint(fib(7))', options: ['8', '13', '21', '7'], answer: 1, explain: '0 1 1 2 3 5 8 13 → fib(7) = 13.' },
  ]),
  ...q('m4-bruteforce', [
    { kind: 'mcq', question: 'Main drawback of brute force?', options: ['May miss the answer', 'Inefficient for large search spaces', 'Hard to implement', 'Needs sorting'], answer: 1, explain: 'It is guaranteed but examines every possibility.' },
    { kind: 'mcq', question: 'Worst-case tries for a 4-digit (0–9) PIN?', options: ['40', '1000', '10,000', '9,999'], answer: 2, explain: '10⁴ = 10,000 combinations.' },
    { kind: 'output', question: 'Output?', code: 'print(f"{7:03}")', options: ['7', '007', '700', '0.07'], answer: 1, explain: 'Zero-padded to width 3.' },
  ]),
  ...q('m4-divide', [
    { kind: 'mcq', question: 'Correct order of divide and conquer?', options: ['Merge → Divide → Conquer', 'Divide → Conquer → Merge', 'Conquer → Divide → Merge', 'Divide → Merge → Conquer'], answer: 1, explain: 'Split, solve sub-problems, combine.' },
    { kind: 'mcq', question: 'Merge sort time complexity:', options: ['O(n)', 'O(n²)', 'O(n log n)', 'O(log n)'], answer: 2, explain: 'log n levels, O(n) merging work per level.' },
    { kind: 'mcq', question: 'Merging [3, 27, 38] and [9, 10, 43] gives…', options: ['[3, 9, 10, 27, 38, 43]', '[3, 27, 38, 9, 10, 43]', '[9, 10, 43, 3, 27, 38]', '[3, 9, 27, 10, 38, 43]'], answer: 0, explain: 'Repeatedly take the smaller front element.' },
    { kind: 'mcq', question: 'Which is a disadvantage of divide and conquer?', options: ['Cannot be parallelised', 'Recursion overhead and extra memory', 'Never finds optimal answer', 'Only works on strings'], answer: 1, explain: 'Many recursive calls and auxiliary arrays cost time and memory.' },
  ]),
  ...q('m4-dp', [
    { kind: 'mcq', question: 'Memoization is…', options: ['Bottom-up iteration', 'Top-down recursion with stored results', 'A greedy strategy', 'Random sampling'], answer: 1, explain: 'Recursion plus a cache of solved sub-problems.' },
    { kind: 'mcq', question: 'DP is useful when sub-problems are…', options: ['Independent', 'Overlapping', 'Random', 'Sorted'], answer: 1, explain: 'Overlapping sub-problems are recomputed by plain recursion; DP stores them.' },
    { kind: 'output', question: 'Output?', code: 't = [0, 1]\nfor i in range(2, 8):\n    t.append(t[i-1] + t[i-2])\nprint(t[-1])', options: ['8', '13', '21', '7'], answer: 1, explain: 'Table 0 1 1 2 3 5 8 13 → last is 13.' },
    { kind: 'mcq', question: 'How many times does naive fib(5) call fib(2)?', options: ['1', '2', '3', '5'], answer: 2, explain: 'fib(4) calls it twice (via fib(3) and directly) and fib(3) once more → 3.' },
  ]),
  ...q('m4-greedy', [
    { kind: 'output', question: 'Output?', code: 'times = sorted([5, 2, 4, 1, 3])\ntotal = count = 0\nfor t in times:\n    if total + t > 7:\n        break\n    total += t\n    count += 1\nprint(count)', options: ['2', '3', '4', '5'], answer: 1, explain: '1 + 2 + 3 = 6; adding 4 gives 10 > 7 → 3 tasks.' },
    { kind: 'mcq', question: 'Greedy decisions are…', options: ['Revisited later', 'Irrevocable', 'Random', 'Always globally optimal'], answer: 1, explain: 'Once made, a greedy choice is never undone.' },
    { kind: 'mcq', question: 'With coins {1, 3, 4}, greedy for 6 uses how many coins?', options: ['2', '3', '4', '6'], answer: 1, explain: 'Greedy picks 4 + 1 + 1 = 3 coins, while 3 + 3 = 2 is optimal.' },
    { kind: 'mcq', question: 'Which guarantees an optimal solution?', options: ['Greedy', 'Dynamic Programming', 'Both', 'Neither'], answer: 1, explain: 'DP considers all relevant sub-problems.' },
  ]),
  ...q('m4-random', [
    { kind: 'mcq', question: 'Expected number of people who get their own hat back with n = 50?', options: ['0', '1', '25', '50'], answer: 1, explain: 'n × (1/n) = 1 by linearity of expectation.' },
    { kind: 'mcq', question: 'Expected purchases to collect all 4 coupons?', options: ['4', '≈ 8.33', '≈ 6.25', '16'], answer: 1, explain: '4 × (1 + 1/2 + 1/3 + 1/4) = 4 × 2.083 ≈ 8.33.' },
    { kind: 'mcq', question: 'Monte Carlo: 7,850 of 10,000 random points fall inside the unit circle. Estimated area?', options: ['0.785', '3.14', '7.85', '1.57'], answer: 1, explain: '4 × 0.785 = 3.14.' },
    { kind: 'mcq', question: 'random.randint(1, 6) can return…', options: ['0–5', '1–5', '1–6', '0–6'], answer: 2, explain: 'Both endpoints are inclusive.' },
  ]),
]
