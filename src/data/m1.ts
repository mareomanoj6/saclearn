import type { Topic } from './types'

export const m1Topics: Topic[] = [
  /* ============================ 1.1 ============================ */
  {
    id: 'm1-strategies',
    moduleId: 1,
    title: 'Problem-Solving Strategies',
    short: 'Strategies',
    icon: 'Lightbulb',
    summary: 'What a problem is, why one strategy is never enough, and the core toolkit: trial and error, heuristics, means-ends analysis and backtracking.',
    subtopics: [
      'Problem-solving strategies defined',
      'Importance of understanding multiple problem-solving strategies',
      'Trial and Error',
      'Heuristics',
      'Means-Ends Analysis',
      'Backtracking (Working backward)',
    ],
    keywords: ['problem solving strateg', 'well-defined', 'ill-defined', 'trial and error', 'heuristic', 'means-end', 'means ends', 'tower of hanoi', 'backtrack', 'working backward', 'guess and check', 'rule of thumb'],
    visualizers: ['hanoi', 'backtrack'],
    takeaways: [
      'A problem is defined by four parameters: initial situation, goal, set of resources and commitment.',
      'Well-defined problems have clear goals and one identifiable solution; ill-defined ones are open-ended.',
      'Trial and error tries solutions one by one and rules out failures — simple but slow.',
      'Heuristics are mental shortcuts ("rules of thumb"): break into steps, guess & check, work backwards.',
      'Means-ends analysis keeps reducing the gap between the current state and the goal (Tower of Hanoi: 2ⁿ − 1 moves).',
      'Backtracking explores a path, and on a dead end undoes the last choice and tries another.',
    ],
    sections: [
      {
        id: 'defined',
        title: 'Problem-solving strategies defined',
        blocks: [
          { type: 'p', text: 'A computer has no intelligence of its own — it does **exactly** what it is told. So before instructing it, we must clearly understand the problem. A *problem* is a situation where the solution is not immediately apparent.' },
          { type: 'compare', items: [
            { title: 'Initial situation', tone: 'blue', points: ['Where you start'] },
            { title: 'Goal', tone: 'green', points: ['Where you want to be'] },
            { title: 'Set of resources', tone: 'amber', points: ['What you can use'] },
            { title: 'Commitment', tone: 'violet', points: ['Willingness to solve it'] },
          ] },
          { type: 'callout', tone: 'key', text: 'If one or more of these four components is missing, the problem is **not well defined**.' },
          { type: 'table', caption: 'Well-defined vs Ill-defined problems', head: ['Well-defined problems', 'Ill-defined problems'], rows: [
            ['Clear goals and objectives', 'Unclear and vague goals and objectives'],
            ['Specific, measurable outcomes', 'Multiple, conflicting outcomes'],
            ['Relevant data available', 'Insufficient data available'],
            ['Single, identifiable solution', 'Multiple possible solutions'],
            ['Logical, step-by-step approach', 'Requires creative, iterative approach'],
            ['Ex: Chess game, solve 2x + 3 = 7, crossword, baking from a recipe', 'Ex: Paint a beautiful picture, design a sustainable city, write a novel, resolve workplace conflict'],
          ] },
          { type: 'p', text: 'A **problem-solving strategy** is a plan used to find a solution or overcome a challenge. Each strategy includes multiple steps that give helpful guidelines. Effective problem solving means identifying the problem, selecting the right process to approach it, and developing a plan to resolve it.' },
        ],
      },
      {
        id: 'importance',
        title: 'Importance of understanding multiple problem-solving strategies',
        blocks: [
          { type: 'p', text: 'Knowing several strategies gives you a **diverse toolkit**. Some problems suit systematic trial and error, others an analytical approach like means-ends analysis. If one method fails you can quickly switch tactics — increasing the chance of success, boosting critical thinking, creativity, confidence and competence.' },
          { type: 'compare', items: [
            { title: 'Adaptability', tone: 'blue', points: ['Switch tactics when one fails'] },
            { title: 'Efficiency', tone: 'green', points: ['Pick the fastest fit'] },
            { title: 'Improved outcomes', tone: 'amber', points: ['More innovative solutions'] },
            { title: 'Skill development', tone: 'violet', points: ['Critical & creative thinking'] },
          ] },
          { type: 'flow', title: 'General steps in problem solving', steps: [
            { label: 'Identify', desc: 'Notice the problem' },
            { label: 'Define', desc: 'State it precisely' },
            { label: 'List solutions', desc: 'Brainstorm options' },
            { label: 'Evaluate', desc: 'Compare the options' },
            { label: 'Implement', desc: 'Apply the best one' },
          ] },
          { type: 'p', text: 'Commonly used strategies: **1. Trial and Error, 2. Algorithm, 3. Heuristics, 4. Means-Ends Analysis, 5. Backtracking.** An *algorithm* is a step-by-step logical procedure that **guarantees** a solution (e.g. the steps to bake a cake, or how Google ranks search results).' },
        ],
      },
      {
        id: 'trial',
        title: 'Trial and Error',
        blocks: [
          { type: 'p', text: 'Try a number of different solutions and **rule out those that do not work**. A good option when you have a very limited number of options available. Not usually time-efficient, but very commonly used.' },
          { type: 'flow', steps: [
            { label: 'Identify the problem', desc: 'Clearly define the issue' },
            { label: 'Try a solution', desc: 'Attempt a possible fix' },
            { label: 'Evaluate the outcome', desc: 'Did it work?' },
            { label: 'Repeat', desc: 'If it failed, try another' },
          ] },
          { type: 'list', items: [
            '**Broken printer:** check ink levels → check if the paper tray is jammed → check if the printer is actually connected to the laptop.',
            '**Malfunctioning phone:** restart the phone → turn off Wi-Fi → turn off Bluetooth until the cause is found.',
          ] },
        ],
      },
      {
        id: 'heuristics',
        title: 'Heuristics',
        blocks: [
          { type: 'p', text: 'A heuristic is a **mental shortcut** that lets us make decisions quickly without having all the relevant information. A *rule of thumb* is an example — it saves time and energy but does **not guarantee** a solution.' },
          { type: 'h', text: 'We reach for a heuristic when…' },
          { type: 'list', items: [
            'We are faced with too much information',
            'The time to make a decision is limited',
            'The decision to be made is unimportant',
            'There is very little information to use',
            'An appropriate heuristic happens to come to mind at that moment',
          ] },
          { type: 'h', text: 'Types of heuristics' },
          { type: 'compare', items: [
            { title: 'a. Break into smaller steps', tone: 'blue', points: ['Research project → brainstorm, thesis, research, outline, rough draft, revise, final draft, references, proofread', 'A big task becomes less overwhelming'] },
            { title: 'b. Guess and Check', tone: 'green', points: ['Make a guess → check → refine → repeat', 'Find x where 15 + x = 32: try 20 (35, too big) → 18 (33) → 17 (32 ✓)'] },
            { title: 'c. Working backwards', tone: 'amber', points: ['Start from the end result', 'Meeting at 3:00 pm, 30 min travel → leave 2:30; 1 h prep → start 1:30; 1 h task → start 12:30'] },
          ] },
        ],
      },
      {
        id: 'mea',
        title: 'Means-Ends Analysis',
        blocks: [
          { type: 'p', text: 'Choose and analyse an action at a **series of smaller steps** to move closer to the goal. At each point, compare the current state with the goal, find the biggest difference, and pick a sub-goal (a *means*) that reduces it.' },
          { type: 'h', text: 'Example 1: Tower of Hanoi' },
          { type: 'p', text: 'Three rods — Source (A), Auxiliary (B), Destination (C). Rod A holds disks with the largest at the bottom. Move the whole tower to C keeping the same order.' },
          { type: 'list', ordered: true, items: [
            'Only one disk can be moved at a time.',
            'Only the uppermost disk of a rod can be moved, onto the top of another rod.',
            'A larger disk is never placed on a smaller disk.',
          ] },
          { type: 'code', lang: 'pseudo', title: 'Recursive procedure for N disks', code: 'HANOI(N, A, C, B):        // move N disks from A to C using B\n  1. Move top N-1 disks from A to B using C\n  2. Move the bottom disk from A to C\n  3. Move N-1 disks from B to C using A' },
          { type: 'callout', tone: 'exam', title: 'Formula to remember', text: 'Minimum moves = **2ⁿ − 1**. n = 3 → 7 moves, n = 4 → 15 moves, n = 14 → 16383 moves.' },
          { type: 'h', text: 'Example 2: Road trip Trivandrum → Kashmir (~3,700 km)' },
          { type: 'flow', steps: [
            { label: 'Define goal', desc: 'Drive to Kashmir' },
            { label: 'Current state', desc: 'In Trivandrum, car ready' },
            { label: 'Difference', desc: '≈ 3,700 km' },
            { label: 'Sub-goals', desc: 'Fuel/rest stops, 500–600 km a day, route' },
            { label: 'Implement', desc: 'Day 1 Bangalore … Day 8 Srinagar' },
            { label: 'Adjust', desc: 'Traffic, weather, preference' },
          ] },
        ],
      },
      {
        id: 'backtracking',
        title: 'Backtracking (Working backward)',
        blocks: [
          { type: 'p', text: 'Backtracking finds a solution **incrementally** by trying different options and **undoing** them if they lead to a dead end, then trying another route — until the solution is found or all options are exhausted.' },
          { type: 'p', text: 'In the graph example (start X, goal G): try X→A→B (dead end), back up, try X→A→C (dead end), back up to X, try X→D→E (dead end), then X→D→F→G — success. Run it in the **Animate** tab.' },
          { type: 'list', items: ['Sudoku puzzles', 'Maze problems', 'Forgetting the PIN of your phone and trying combinations'] },
        ],
      },
    ],
    starterCode: `# Tower of Hanoi — means-ends analysis in code
def hanoi(n, source, target, aux):
    if n == 1:
        print(f"Move disk 1 from {source} to {target}")
        return 1
    moves = hanoi(n - 1, source, aux, target)
    print(f"Move disk {n} from {source} to {target}")
    moves += 1
    moves += hanoi(n - 1, aux, target, source)
    return moves

n = 3
total = hanoi(n, "A", "C", "B")
print("Total moves:", total, "| formula 2^n - 1 =", 2**n - 1)

# Guess and check: find x such that 15 + x == 32
guess = 20
while 15 + guess != 32:
    print("Trying", guess, "->", 15 + guess)
    guess = guess - 1 if 15 + guess > 32 else guess + 1
print("Answer:", guess)
`,
  },

  /* ============================ 1.2 ============================ */
  {
    id: 'm1-process',
    moduleId: 1,
    title: 'The Problem-Solving Process',
    short: 'Process',
    icon: 'Cpu',
    summary: 'The computer as an input → process → output machine, and the six-step process that takes a problem all the way to an evaluated program.',
    subtopics: [
      'Computer as a model of computation',
      'Understanding the problem',
      'Formulating a model',
      'Developing an algorithm',
      'Writing the program',
      'Testing the program',
      'Evaluating the solution',
    ],
    keywords: ['model of computation', 'von neumann', 'instruction cycle', 'fetch', 'decode', 'cpu', 'alu', 'control unit', 'register', 'memory', 'understanding the problem', 'formulating a model', 'developing an algorithm', 'testing the program', 'evaluating the solution', 'problem solving process', 'discriminant'],
    visualizers: ['cpu'],
    takeaways: [
      'Von Neumann model: Input → CPU (ALU + CU + registers) ↔ Memory → Output.',
      'Instruction cycle: Fetch → Decode → Execute → Store, repeated for every instruction.',
      'Six steps: understand → model → algorithm → program → test → evaluate.',
      'Understanding = identifying the inputs, outputs and processing needed.',
      'A bug is an error that gives wrong or undesirable results; debugging finds and fixes it.',
    ],
    sections: [
      {
        id: 'model',
        title: 'Computer as a model of computation',
        blocks: [
          { type: 'p', text: 'Computer science is about solving problems with computers, so we first need the computer’s **information processing model**: data comes in through input devices, is processed by the CPU using memory, and results go out through output devices. For bigger problems the input/process/output stages are repeated many times.' },
          { type: 'widget', name: 'vonNeumann' },
          { type: 'h', text: 'Instruction execution cycle' },
          { type: 'flow', steps: [
            { label: 'Fetch', desc: 'Get the instruction from memory (address in PC)' },
            { label: 'Decode', desc: 'Identify the operation to perform' },
            { label: 'Execute', desc: 'CPU performs the operation' },
            { label: 'Store', desc: 'Write the result to memory / output' },
          ] },
          { type: 'compare', items: [
            { title: 'ALU', tone: 'blue', points: ['Arithmetic unit: + − × ÷', 'Logic unit: comparisons'] },
            { title: 'Control Unit', tone: 'green', points: ['Generates control signals', 'Fetches & interprets instructions', 'Talks to I/O devices', 'Decides what/when/where'] },
            { title: 'Registers', tone: 'amber', points: ['ACC – result of ALU ops', 'IR – current instruction', 'PC – address of next instruction'] },
          ] },
          { type: 'widget', name: 'memoryHierarchy' },
          { type: 'table', caption: 'Devices & memory at a glance', head: ['Category', 'Examples / notes'], rows: [
            ['Human data-entry input', 'Keyboard, mouse, trackball, joystick, graphics tablet'],
            ['Source data-entry input', 'Microphone (audio), webcam (video), scanner & barcode reader (optical)'],
            ['Hard-copy output', 'Printer, plotter — permanent and portable'],
            ['Soft-copy output', 'Monitor, projector, speakers — needs a computer to view'],
            ['RAM', 'Primary, volatile, holds data & programs while running'],
            ['ROM', 'Primary, non-volatile, read-only (boot information)'],
            ['Cache', 'Between RAM and CPU, frequently used data'],
            ['External memory', 'Magnetic tape (sequential), hard disk, CD/DVD'],
          ] },
        ],
      },
      {
        id: 'understand',
        title: 'Understanding the problem',
        blocks: [
          { type: 'p', text: 'The first step is to fully understand the problem by identifying its **input**, **output** and **processing** needs.' },
          { type: 'compare', items: [
            { title: 'Input requirements', tone: 'blue', points: ['What data is available? In what format?', 'Is anything missing?', 'e.g. grades as 0–100 or letters A–F'] },
            { title: 'Output requirements', tone: 'green', points: ['What is needed and in what format?', 'Number, letter grade, chart?'] },
            { title: 'Processing', tone: 'amber', points: ['How to get from input to output?', 'e.g. absent students: count as 0 or skip?'] },
          ] },
        ],
      },
      {
        id: 'formulate',
        title: 'Formulating a model',
        blocks: [
          { type: 'p', text: 'Figure out **how to use the available data to compute an answer** — usually a formula. If no formula exists, one must be developed.' },
          { type: 'list', items: [
            'Sum of two numbers: `Sum = Number1 + Number2`',
            'Average grade: `Average = (x1 + x2 + … + xn) / n` (0–100)',
            'Letter grades can’t be added directly — map them to numbers first (A+ = 12 … F = 0), then average',
            'Discriminant of ax² + bx + c: `D = b² − 4ac`',
          ] },
        ],
      },
      {
        id: 'algorithm',
        title: 'Developing an algorithm',
        blocks: [
          { type: 'p', text: 'An **algorithm** is a precise sequence of instructions for solving a problem. It is represented as **pseudocode** (informal text, no programming syntax) or a **flowchart** (diagram).' },
          { type: 'code', lang: 'pseudo', title: 'Algorithm: sum of two numbers', code: 'Step 1: Start\nStep 2: Input Number1\nStep 3: Input Number2\nStep 4: Sum = Number1 + Number2\nStep 5: Output Sum\nStep 6: End' },
        ],
      },
      {
        id: 'write',
        title: 'Writing the program',
        blocks: [
          { type: 'p', text: 'Converting the algorithm into instructions the computer can execute is called **coding** or **implementing** the algorithm.' },
          { type: 'code', lang: 'python', runnable: true, title: 'Discriminant calculator', code: 'a = int(input("Enter a: "))\nb = int(input("Enter b: "))\nc = int(input("Enter c: "))\nd = (b**2) - (4*a*c)\nprint("Discriminant =", d)' },
          { type: 'defs', items: [
            { k: 'Debugging', v: 'Finding and fixing errors in a program.' },
            { k: 'Compiling', v: 'Converting a program into instructions the computer understands.' },
          ] },
        ],
      },
      {
        id: 'test',
        title: 'Testing the program',
        blocks: [
          { type: 'p', text: '**Running** the program with various inputs verifies accuracy. If output is wrong, either the algorithm was not implemented properly, or there is a **bug** in the algorithm itself (it misses some situation) — go back to the algorithm step.' },
          { type: 'table', caption: 'A test suite for the discriminant program', head: ['a', 'b', 'c', 'Expected d'], rows: [['1', '2', '1', '0'], ['1', '5', '6', '1'], ['2', '3', '5', '-31'], ['1', '-4', '4', '0']] },
        ],
      },
      {
        id: 'evaluate',
        title: 'Evaluating the solution',
        blocks: [
          { type: 'p', text: 'Once a result is produced, **revisit the original problem**: is the output a properly formatted solution? Does it match the original intent and requirements? The computer only executes what it is told — *you* must interpret the result.' },
          { type: 'flow', title: 'The whole process', steps: [
            { label: 'Understand' }, { label: 'Model' }, { label: 'Algorithm' }, { label: 'Program' }, { label: 'Test' }, { label: 'Evaluate' },
          ] },
        ],
      },
    ],
    starterCode: `# The six-step process on one problem: average of n marks
# 1. Understand: input n marks, output their average
# 2. Model: average = (x1 + x2 + ... + xn) / n
# 3-4. Algorithm -> program:
marks = [72, 88, 95, 64, 81]     # change these (or use input())
n = len(marks)
total = 0
for m in marks:
    total = total + m
average = total / n
print("Average of", n, "marks =", round(average, 2))

# 5. Test: try an empty list? n would be 0 -> ZeroDivisionError!
# 6. Evaluate: does the answer make sense for the original problem?
`,
  },

  /* ============================ 1.3 ============================ */
  {
    id: 'm1-python',
    moduleId: 1,
    title: 'Essentials of Python Programming',
    short: 'Python Basics',
    icon: 'Terminal',
    summary: 'Variables, numeric and string types, the math module, input()/print() and every Python operator with its precedence.',
    subtopics: [
      'Creating and using variables in Python',
      'Numeric and String data types in Python',
      'Using the math module',
      'Using the Python Standard Library for handling basic I/O - print, input',
      'Python operators and their precedence',
    ],
    keywords: ['variable', 'identifier', 'keyword', 'data type', 'numeric', 'int', 'float', 'complex', 'string', 'math module', 'math.', 'sqrt', 'ceil', 'floor', 'print', 'input', 'operator', 'precedence', 'bitwise', 'membership', 'identity', 'type conversion', 'escape sequence', 'compiler', 'interpreter', 'literal', 'token'],
    visualizers: ['precedence'],
    takeaways: [
      'Python is high-level, interpreted and dynamically typed — no type declarations needed.',
      'Identifiers: letters, digits, underscore; cannot start with a digit or be a keyword; case-sensitive.',
      'Numeric types: int, float, complex (3+4j). Use type() to check, int()/float()/str() to convert.',
      'input() always returns a string — wrap it in int() or float() for numbers.',
      'Precedence: () → ** → unary → * / // % → + − → shifts → & → ^ → | → comparisons → not → and → or.',
    ],
    sections: [
      {
        id: 'variables',
        title: 'Creating and using variables in Python',
        blocks: [
          { type: 'p', text: 'Python is a general-purpose, high-level, **interpreted** language created by Guido van Rossum (late 1980s). An **interpreter** translates and runs one line at a time; a **compiler** translates the whole program into object code first.' },
          { type: 'table', head: ['Compiler', 'Interpreter'], rows: [
            ['Takes the entire program as input', 'Takes a single instruction as input'],
            ['Generates intermediate object code', 'No intermediate object code'],
            ['More memory (object code stored)', 'Less memory'],
            ['Errors shown after the whole program is checked', 'Errors shown per instruction'],
            ['Example: C', 'Example: Python, BASIC'],
          ] },
          { type: 'p', text: 'A **variable** is a name that refers to a memory location. In Python a variable is created the moment you assign to it — no type declaration.' },
          { type: 'code', lang: 'python', runnable: true, code: 'a = 10            # int\nb = "StudyGlance"  # str\nc = 12.5          # float\nx = y = z = 50    # same value to many variables\np, q, r = 5, 10, 15  # multiple assignment\nprint(a, b, c, x, y, z, p, q, r)' },
          { type: 'table', caption: 'Identifier rules', head: ['Identifier', 'Valid?', 'Reason'], rows: [
            ['totalSales', 'Yes', ''], ['total_Sales', 'Yes', ''], ['_count', 'Yes', 'May start with underscore'],
            ['4thQtrSales', 'No', 'Cannot begin with a digit'], ['totalSale$', 'No', 'Cannot contain $'], ['for', 'No', 'Keyword'],
          ] },
          { type: 'list', items: [
            '**Tokens** (smallest units): keywords, identifiers, literals, operators, special symbols.',
            '**Comments:** `#` for single line, triple quotes `"""…"""` for multi-line.',
            '**Keywords** like `if, else, for, while, def, return, True, None, and, or, not, import` cannot be used as names.',
          ] },
        ],
      },
      {
        id: 'types',
        title: 'Numeric and String data types in Python',
        blocks: [
          { type: 'compare', items: [
            { title: 'int', tone: 'blue', points: ['Whole numbers, unlimited length', 'a = 10, b = -12'] },
            { title: 'float', tone: 'green', points: ['Has a decimal point', 'x = 12.3, y = -13.4'] },
            { title: 'complex', tone: 'violet', points: ['Real + imaginary (j)', 'A = 2+5j, C = -6j'] },
            { title: 'str', tone: 'amber', points: ['Characters in \'…\', "…" or """…"""', 'Immutable sequence'] },
          ] },
          { type: 'code', lang: 'python', runnable: true, title: 'type() and explicit conversion (type casting)', code: 'num1 = 5\nnum2 = 2.0\nnum3 = 1 + 2j\nprint(num1, type(num1))\nprint(num2, type(num2))\nprint(num3, type(num3))\nprint(float(1), int(2.8), str(42) + "!", complex(1))', output: "5 <class 'int'>\n2.0 <class 'float'>\n(1+2j) <class 'complex'>\n1.0 2 42! (1+0j)" },
          { type: 'table', caption: 'Escape sequences', head: ['Code', 'Meaning'], rows: [['\\n', 'New line'], ['\\t', 'Tab'], ['\\\\', 'Backslash'], ["\\'", 'Single quote'], ['\\"', 'Double quote'], ['\\r', 'Carriage return'], ['\\b', 'Backspace']] },
        ],
      },
      {
        id: 'math',
        title: 'Using the math module',
        blocks: [
          { type: 'p', text: 'A **module** groups related code. The built-in `math` module gives constants and functions — first `import math`.' },
          { type: 'table', head: ['Function', 'Example', 'Result'], rows: [
            ['math.sqrt(x)', 'math.sqrt(100)', '10.0'],
            ['math.ceil(x)', 'math.ceil(4.5867)', '5'],
            ['math.floor(x)', 'math.floor(4.5687)', '4'],
            ['math.fabs(x)', 'math.fabs(-5.5)', '5.5'],
            ['math.pi', 'math.pi', '3.14159…'],
            ['math.factorial(n)', 'math.factorial(5)', '120'],
            ['math.gcd(a, b)', 'math.gcd(5, 15)', '5'],
            ['math.exp(x)', 'math.exp(4)', '54.598…'],
            ['math.pow(x, y)', 'math.pow(2, 4)', '16.0 (always float)'],
            ['math.log(x, base)', 'math.log(8, 2)', '3.0'],
            ['math.sin/cos/tan(rad)', 'math.sin(math.pi/6)', '0.4999…'],
          ] },
        ],
      },
      {
        id: 'io',
        title: 'Using the Python Standard Library for handling basic I/O - print, input',
        blocks: [
          { type: 'code', lang: 'python', runnable: true, title: 'input() returns a string', code: 'name = input("What is your name? ")\nage = int(input("Your age? "))        # convert!\nx, y = input("Two numbers: ").split() # several values in one line\nprint("Hello,", name, "- next year you will be", age + 1)\nprint("Sum:", int(x) + int(y))' },
          { type: 'code', lang: 'python', runnable: true, title: 'print(*objects, sep=" ", end="\\n")', code: "print('James Bond', 7, sep=' --> 00')\nprint('Value of a:', 2, sep='000')\nprint('Car', 'Bike', 'Train', 'Plane', sep=' | ')\nprint('no newline', end='...')\nprint('done')", output: 'James Bond --> 007\nValue of a:0002\nCar | Bike | Train | Plane\nno newline...done' },
          { type: 'callout', tone: 'tip', text: 'In the Playground, type everything your program will `input()` into the **Input** box first — one value per line.' },
        ],
      },
      {
        id: 'operators',
        title: 'Python operators and their precedence',
        blocks: [
          { type: 'table', caption: 'Operator families', head: ['Type', 'Operators', 'Example (a=21, b=10)'], rows: [
            ['Arithmetic', '+  -  *  /  %  **  //', 'a/b = 2.1, a%b = 1, a//b = 2'],
            ['Comparison', '==  !=  >  <  >=  <=', 'a > b → True'],
            ['Assignment', '=  +=  -=  *=  /=  %=  **=  //=', 'a += 5 → 26'],
            ['Logical', 'and  or  not', '(a > 5 and b < 15) → True'],
            ['Bitwise', '&  |  ^  ~  <<  >>', '60 & 13 = 12, 60 | 13 = 61, 60 ^ 13 = 49, ~60 = -61, 60 << 2 = 240, 60 >> 2 = 15'],
            ['Membership', 'in  not in', '"banana" in fruits → True'],
            ['Identity', 'is  is not', 'x is y — same object in memory?'],
          ] },
          { type: 'table', caption: 'Precedence (highest → lowest)', head: ['Level', 'Operators'], rows: [
            ['1', '( )  parentheses'],
            ['2', '**  exponent (right-to-left)'],
            ['3', '+x  -x  ~x  unary'],
            ['4', '*  /  //  %'],
            ['5', '+  -'],
            ['6', '<<  >>'],
            ['7', '&'],
            ['8', '^'],
            ['9', '|'],
            ['10', '==  !=  >  <  >=  <=  is  in  (comparisons)'],
            ['11', 'not'],
            ['12', 'and'],
            ['13', 'or'],
          ] },
          { type: 'callout', tone: 'exam', title: 'Worked example', text: 'R = A + 3 < B * 1 or C and D with A=1, B=5, C=-1, D=True → `B*1 = 5` → `A+3 = 4` → `4 < 5 = True` → `True or …` = **True** (Python short-circuits, so `C and D` is never evaluated). Step through it in **Animate**.' },
        ],
      },
    ],
    starterCode: `import math

# Variables & types
a, b = 21, 10
print("a/b =", a / b, "| a//b =", a // b, "| a%b =", a % b, "| a**2 =", a ** 2)
print(type(a), type(a / b), type(3 + 4j))

# math module
print("sqrt(100) =", math.sqrt(100))
print("ceil(4.58) =", math.ceil(4.58), "floor(4.58) =", math.floor(4.58))
print("gcd(15, 5) =", math.gcd(15, 5), "factorial(5) =", math.factorial(5))

# Precedence: guess before you run!
A, B, C, D = 1, 5, -1, True
R = A + 3 < B * 1 or C and D
print("R =", R)
print("2 + 3 * 4 ** 2 =", 2 + 3 * 4 ** 2)

# Bitwise
print(60 & 13, 60 | 13, 60 ^ 13, ~60, 60 << 2, 60 >> 2)
`,
  },
]
