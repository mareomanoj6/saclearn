import type { Topic } from './types'

export const m2Topics: Topic[] = [
  /* ============================ 2.1 ============================ */
  {
    id: 'm2-pseudocode',
    moduleId: 2,
    title: 'Algorithm and Pseudocode Representation',
    short: 'Pseudocode',
    icon: 'FileText',
    summary: 'Writing algorithms as structured English: the three constructs — sequencing, selection and repetition — and the KTU sample problems.',
    subtopics: [
      'Meaning and Definition of Pseudocode',
      'Reasons for using pseudocode',
      'The main constructs of pseudocode - Sequencing',
      'Selection (if-else structure, case structure)',
      'Repetition (for, while, repeat-until loops)',
      'Sample problems',
    ],
    keywords: ['pseudocode', 'pseudo code', 'algorithm', 'sequencing', 'selection', 'case structure', 'switch', 'repeat-until', 'repeat until', 'repetition', 'entry controlled', 'exit controlled', 'simple interest', 'larger of two', 'smallest of three', 'grade', 'descending order', 'sum of n numbers', 'largest of n'],
    visualizers: ['pseudo'],
    takeaways: [
      'An algorithm is a finite sequence of well-defined steps that turns input into output.',
      'Pseudocode = natural language + simple programming constructs, independent of any language.',
      'Three constructs: sequencing (top to bottom), selection (IF/ELSE, CASE), repetition (FOR, WHILE, REPEAT-UNTIL).',
      'WHILE is entry-controlled (may run 0 times); REPEAT-UNTIL is exit-controlled (runs at least once).',
      'FOR is definite iteration (count known); WHILE/REPEAT-UNTIL are indefinite (condition-based).',
    ],
    sections: [
      {
        id: 'meaning',
        title: 'Meaning and Definition of Pseudocode',
        blocks: [
          { type: 'p', text: 'An **algorithm** is a precise, finite, step-by-step procedure that transforms input into the desired output — even making milk coffee is an algorithm. **Pseudocode** is a structured, informal, high-level description of an algorithm that mixes natural language with basic programming constructs. It is a bridge between human language and real code.' },
          { type: 'code', lang: 'pseudo', title: 'Pseudocode: area of a rectangle', code: 'PRINT "Enter the length: "\nINPUT l\nPRINT "Enter the breadth: "\nINPUT b\nSET area = l * b\nPRINT "Area =", area' },
          { type: 'flow', title: 'Steps in algorithm development', steps: [
            { label: 'Problem definition' }, { label: 'Model development' }, { label: 'Algorithm design' }, { label: 'Verification' },
            { label: 'Implementation' }, { label: 'Complexity analysis' }, { label: 'Testing & debugging' }, { label: 'Documentation' }, { label: 'Optimisation' },
          ] },
        ],
      },
      {
        id: 'reasons',
        title: 'Reasons for using pseudocode',
        blocks: [
          { type: 'compare', items: [
            { title: 'Why use it', tone: 'green', points: ['Easy to understand — language independent', 'Focus on logic, not syntax', 'More legible than code, more precise than English', 'Easy translation to any language', 'Finds flaws before coding', 'Good documentation & teaching tool'] },
            { title: 'Limitations', tone: 'red', points: ['Not standardised — styles vary', 'May still contain some ambiguity', 'Cannot be executed'] },
          ] },
          { type: 'list', ordered: true, items: [
            'Use clear, concise statements — one action or decision per line.',
            'Keep consistent indentation to show nesting.',
            'Use standard keywords: INPUT, PRINT/OUTPUT, IF-THEN-ELSE, FOR, WHILE.',
            'Avoid language-specific syntax.',
            'Use descriptive variable names and consistent notation.',
          ] },
        ],
      },
      {
        id: 'sequencing',
        title: 'The main constructs of pseudocode - Sequencing',
        blocks: [
          { type: 'p', text: 'Statements execute **one after another** from top to bottom; each completes before the next begins. No statement is skipped.' },
          { type: 'code', lang: 'pseudo', title: 'Evaluate d = a + b * c', code: 'START\nINPUT a, b, c\nSET d = a + b * c\nPRINT d\nSTOP' },
          { type: 'code', lang: 'pseudo', title: 'Simple interest', code: 'START\nINPUT P, R, T\nSET SI = (P * R * T) / 100\nPRINT "Simple interest =", SI\nSTOP' },
        ],
      },
      {
        id: 'selection',
        title: 'Selection (if-else structure, case structure)',
        blocks: [
          { type: 'compare', items: [
            { title: 'IF', tone: 'blue', points: ['IF age >= 18', '   PRINT "You can vote"', 'ENDIF'] },
            { title: 'IF-ELSE', tone: 'green', points: ['IF score >= 50', '   PRINT "Pass"', 'ELSE', '   PRINT "Fail"', 'ENDIF'] },
            { title: 'IF-ELSE IF-ELSE', tone: 'amber', points: ['IF n > 0  PRINT "Positive"', 'ELSE IF n < 0  PRINT "Negative"', 'ELSE  PRINT "Zero"', 'ENDIF'] },
          ] },
          { type: 'code', lang: 'pseudo', title: 'Smallest of three numbers', code: 'INPUT a, b, c\nIF a < b AND a < c THEN\n    PRINT a, "is smallest"\nELSE IF b < c THEN\n    PRINT b, "is smallest"\nELSE\n    PRINT c, "is smallest"\nENDIF' },
          { type: 'p', text: 'The **CASE (SWITCH) structure** selects one of many alternatives based on the value of a single expression. `BREAK` exits after a match; `DEFAULT` runs if nothing matches.' },
          { type: 'code', lang: 'pseudo', title: 'KTU grade using CASE (marks out of 100)', code: 'INPUT marks\nSET band = marks / 5   // integer division\nSWITCH (band)\n  CASE 20, 19, 18: PRINT "S"   BREAK   // 90-100\n  CASE 17:         PRINT "A+"  BREAK   // 85-89\n  CASE 16:         PRINT "A"   BREAK   // 80-84\n  CASE 15:         PRINT "B+"  BREAK   // 75-79\n  CASE 14:         PRINT "B"   BREAK   // 70-74\n  CASE 13:         PRINT "C+"  BREAK   // 65-69\n  CASE 12:         PRINT "C"   BREAK   // 60-64\n  CASE 11:         PRINT "D"   BREAK   // 55-59\n  CASE 10:         PRINT "P"   BREAK   // 50-54\n  DEFAULT:         PRINT "F"           // below 50\nENDSWITCH' },
          { type: 'table', caption: 'KTU grade scale', head: ['Grade', 'Marks (%)', 'Grade point'], rows: [
            ['S', '90 – 100', '10'], ['A+', '85 – 89', '9'], ['A', '80 – 84', '8.5'], ['B+', '75 – 79', '8'], ['B', '70 – 74', '7.5'],
            ['C+', '65 – 69', '7'], ['C', '60 – 64', '6.5'], ['D', '55 – 59', '6'], ['P', '50 – 54', '5.5'], ['F', '< 50', '0'],
          ] },
        ],
      },
      {
        id: 'repetition',
        title: 'Repetition (for, while, repeat-until loops)',
        blocks: [
          { type: 'p', text: 'A loop repeats its **body**; each run is an **iteration** (pass). If the number of iterations is known it is **definite** iteration, otherwise **indefinite** (conditional) iteration.' },
          { type: 'compare', items: [
            { title: 'FOR', tone: 'blue', points: ['SET sum = 0', 'FOR i = 1 TO n', '   sum = sum + i', 'ENDFOR', 'PRINT sum'] },
            { title: 'WHILE', tone: 'green', points: ['SET sum = 0, i = 1', 'WHILE i <= n', '   sum = sum + i', '   INCREMENT i', 'ENDWHILE'] },
            { title: 'REPEAT-UNTIL', tone: 'amber', points: ['SET sum = 0, i = 1', 'REPEAT', '   sum = sum + i', '   INCREMENT i', 'UNTIL i > n'] },
          ] },
          { type: 'table', head: ['', 'WHILE', 'REPEAT-UNTIL'], rows: [
            ['Condition checked', 'At the beginning', 'At the end'],
            ['Called', 'Entry-controlled loop', 'Exit-controlled loop'],
            ['Minimum runs', '0 (if the condition is false initially)', '1 (always runs at least once)'],
            ['Loop continues while', 'condition is TRUE', 'condition is FALSE (stops when TRUE)'],
          ] },
        ],
      },
      {
        id: 'samples',
        title: 'Sample problems',
        blocks: [
          { type: 'code', lang: 'pseudo', title: 'Larger of two numbers', code: 'INPUT a, b\nIF a > b THEN\n    PRINT a\nELSE\n    PRINT b\nENDIF' },
          { type: 'code', lang: 'pseudo', title: 'Print 50 down to 1', code: 'FOR i = 50 DOWNTO 1\n    PRINT i\nENDFOR' },
          { type: 'code', lang: 'pseudo', title: 'Factorial of a number', code: 'INPUT n\nSET fact = 1\nFOR i = 1 TO n\n    fact = fact * i\nENDFOR\nPRINT fact' },
          { type: 'code', lang: 'pseudo', title: 'Largest of n numbers', code: 'INPUT n\nINPUT x\nSET largest = x\nFOR i = 2 TO n\n    INPUT x\n    IF x > largest THEN\n        largest = x\n    ENDIF\nENDFOR\nPRINT largest' },
          { type: 'callout', tone: 'tip', text: 'Every one of these is traced line by line in the **Animate** tab — watch the variables change.' },
        ],
      },
    ],
    starterCode: `# Sum of n numbers using all three loop styles
n = 5
nums = [4, 8, 15, 16, 23]

# FOR (definite)
total = 0
for i in range(n):
    total += nums[i]
print("FOR   :", total)

# WHILE (entry-controlled)
total, i = 0, 0
while i < n:
    total += nums[i]
    i += 1
print("WHILE :", total)

# REPEAT-UNTIL (exit-controlled) — Python has no repeat-until,
# so we emulate it with while True + break
total, i = 0, 0
while True:
    total += nums[i]
    i += 1
    if i >= n:          # UNTIL i >= n
        break
print("REPEAT:", total)
`,
  },

  /* ============================ 2.2 ============================ */
  {
    id: 'm2-flowcharts',
    moduleId: 2,
    title: 'Flowcharts',
    short: 'Flowcharts',
    icon: 'Workflow',
    summary: 'The standard symbols, the three control structures drawn as diagrams, rules for good flowcharts, and how they compare with algorithms.',
    subtopics: [
      'Symbols used in creating a Flowchart - start and end, arithmetic calculations, input/output operation, decision (selection), module name (call), for loop (Hexagon), flow-lines, on-page connector, off-page connector',
      'Flowcharts for the sample problems',
    ],
    keywords: ['flowchart', 'flow chart', 'symbol', 'terminal', 'parallelogram', 'diamond', 'hexagon', 'connector', 'flow line', 'raptor'],
    visualizers: ['flowchart'],
    takeaways: [
      'Oval = start/end, rectangle = process, parallelogram = input/output, diamond = decision.',
      'Hexagon = FOR loop (preparation), double-sided rectangle = module call, circle = on-page connector, pentagon = off-page connector.',
      'Flow goes top to bottom, left to right; every symbol except decision has one entry and one exit.',
      'Flowcharts are easier to debug and show branching/looping visually; algorithms are easier to turn into code.',
    ],
    sections: [
      {
        id: 'symbols',
        title: 'Symbols used in creating a Flowchart',
        blocks: [
          { type: 'p', text: 'A **flowchart** is a diagrammatic representation of an algorithm. Different shapes denote different operations and are joined by arrows called **flow lines**. (The syllabus suggests tools like **RAPTOR** for drawing executable flowcharts.)' },
          { type: 'widget', name: 'flowSymbols' },
          { type: 'compare', items: [
            { title: 'Sequence', tone: 'blue', points: ['Statements in order', 'Input a,b → sum = a+b → print sum'] },
            { title: 'Decision', tone: 'amber', points: ['Diamond with Yes / No branches', 'Even or odd: rem = N % 2, rem == 0?'] },
            { title: 'Loop', tone: 'green', points: ['Arrow flows back to an earlier step', 'Product of first N numbers'] },
          ] },
          { type: 'h', text: 'Rules for drawing flowcharts' },
          { type: 'list', ordered: true, items: [
            'Use only the standard symbols.',
            'Flow from top to bottom and left to right.',
            'Except the decision symbol, every symbol has exactly one entry and one exit ("single rule").',
            'Write operations independent of any programming language.',
            'Label every decision branch clearly (Yes/No, True/False).',
          ] },
          { type: 'table', caption: 'Algorithm vs Flowchart', head: ['Algorithm', 'Flowchart'], rows: [
            ['Step-by-step procedure in text', 'Graphical representation of the steps'],
            ['Harder to understand', 'Easy to understand'],
            ['No rules to follow', 'Needs standard symbols and rules'],
            ['Debugging is harder', 'Debugging is easier'],
            ['Branching & looping hard to see', 'Branching & looping easy to see'],
            ['Translates more directly into code', 'Better for planning & communication; large ones get unwieldy'],
          ] },
        ],
      },
      {
        id: 'samples',
        title: 'Flowcharts for the sample problems',
        blocks: [
          { type: 'p', text: 'Open **Animate** to watch a token travel through flowcharts for: simple interest (sequence), larger of two numbers & smallest of three (decision) and factorial (loop) — with the variable table updating at every symbol.' },
          { type: 'flow', title: 'Factorial flowchart in words', steps: [
            { label: 'Start' }, { label: 'Input n' }, { label: 'fact = 1, i = 1' }, { label: 'i ≤ n ?', desc: 'Decision' }, { label: 'fact = fact × i, i = i + 1', desc: 'Loop back' }, { label: 'Print fact', desc: 'When No' }, { label: 'Stop' },
          ] },
        ],
      },
    ],
    starterCode: `# The flowcharts from this topic, as Python
P, R, T = 10000, 8, 2
SI = (P * R * T) / 100
print("Simple interest:", SI)

a, b, c = 42, 17, 29
if a < b and a < c:
    print("Smallest:", a)
elif b < c:
    print("Smallest:", b)
else:
    print("Smallest:", c)

n = 5
fact, i = 1, 1
while i <= n:          # the decision diamond
    fact = fact * i
    i = i + 1          # flow line loops back
print(n, "! =", fact)
`,
  },
]
