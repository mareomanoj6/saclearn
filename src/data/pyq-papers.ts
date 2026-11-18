/* ------------------------------------------------------------------
 * Real UCEST105 question papers (transcribed from the supplied PDFs).
 *
 *  1. KTU Regular, Dec 2024            (sem1.pdf – full paper, 60 marks)
 *  2. KTU Model paper, 2024 scheme     (sem2.pdf – full paper, 60 marks)
 *  3. CET Series 1, Nov 2024           (series1.pdf – 40 marks)
 *  4. CET Series 2, Dec 2024           (series2.pdf – 40 marks)
 *  5. Question bank – May 2026 (S), Dec 2025 (R,S), May 2025 (S)
 *     (qbank.pdf – topic-wise; its Dec 2024 items duplicate paper 1 and
 *      are therefore NOT repeated here)
 *
 * topicIds are assigned by hand so the analyzer does not depend on the
 * keyword mapper. Question-bank entries carry no part/marks in the PDF:
 * part is '?' and marks are an estimate (est: true).
 * ------------------------------------------------------------------ */
import type { ModuleId, PyqPaper, PyqQuestion } from './types'

const S = 'm1-strategies', P = 'm1-process', Y = 'm1-python'
const PS = 'm2-pseudocode', FC = 'm2-flowcharts'
const SEL = 'm3-selection', DEC = 'm3-decomposition', REC = 'm3-recursion'
const BF = 'm4-bruteforce', DC = 'm4-divide', DP = 'm4-dp', GR = 'm4-greedy', RN = 'm4-random'

type Row = [number: string, marks: number, module: ModuleId, topics: string | string[], text: string]

function paper(exam: string, year: number, key: string, part: (n: string) => 'A' | 'B', rows: Row[]): PyqPaper {
  return {
    exam, year,
    questions: rows.map(([number, marks, module, topics, text]): PyqQuestion => ({
      id: `${key}-${number.replace(/\s/g, '')}`, exam, part: part(number), number, marks, module,
      topicIds: Array.isArray(topics) ? topics : [topics], text,
    })),
  }
}
const partByNumber = (max: number) => (n: string) => (parseInt(n, 10) <= max ? 'A' : 'B')

/* question-bank rows: [module, topics, text, marks≈] */
type QB = [ModuleId, string | string[], string, number]
function bank(exam: string, year: number, key: string, rows: QB[]): PyqPaper {
  return {
    exam, year,
    questions: rows.map(([module, topics, text, marks], i): PyqQuestion => ({
      id: `${key}-${i + 1}`, exam, part: '?', number: `QB${i + 1}`, marks, est: true, module,
      topicIds: Array.isArray(topics) ? topics : [topics], text,
    })),
  }
}

/* ---------------------------------------------------------------- 1 */
const DEC24 = paper('KTU Dec 2024 (Regular)', 2024, 'dec24', partByNumber(8), [
  ['1', 3, 1, S, 'You are asked to solve a jigsaw puzzle without a reference picture. How will you solve it using trial and error method?'],
  ['2', 3, 1, Y, 'Given the input "12345", write a Python code snippet to check if it is numeric.'],
  ['3', 3, 2, FC, "Draw the flowchart to generate the first 'n' numbers in the Fibonacci sequence."],
  ['4', 3, 2, PS, 'Write an algorithm to check whether the input integer is Palindrome or not.'],
  ['5', 3, 3, Y, 'Write the output produced by the following code. (i) for count in range(-10,-20,-2): print(count, end=" ")  (ii) for i in range(10,-1,-2): print(i)  (iii) 2*3**2**2'],
  ['6', 3, 3, SEL, 'Write a Python program to find the sum of even numbers from N given numbers.'],
  ['7', 3, 4, RN, 'What is the motivation for using a randomized approach in problem-solving?'],
  ['8', 3, 4, BF, 'A 4-digit numeric password system: a user has forgotten their password due to a system error. Write an algorithm for recovering the 4-digit numeric password.'],
  ['9 a', 5, 1, S, 'Explain how backtracking strategy can be applied to solve Sudoku problem?'],
  ['9 b', 4, 1, S, 'Your college is in a metropolitan city and you are new to the city. You would like to go out for dinner with friends. Explain how the heuristics approach can be used to find the best restaurant for dinner.'],
  ['10 a', 6, 1, S, 'You are asked to develop new campus management software for your college. How will you apply Means-Ends Analysis to develop the software?'],
  ['10 b', 3, 1, Y, 'Given the area of a circle. Write a Python program to calculate the radius of the circle using the math module.'],
  ['11 a', 6, 2, PS, 'Write a pseudocode to implement a grading system (Marks > 90: A; 80-89: B; 70-79: C; 60-70: D; 50-69: E; < 50: F). If the difference between the marks and the next multiple of 10 is less than 3, convert it to the next grade; no conversion below 50.'],
  ['11 b', 3, 2, PS, 'A logistics company has a list of delivery times (minutes). Write an algorithm to print the delivery times that are divisible by 6 but not divisible by 4 from a given set of delivery times.'],
  ['12 a', 6, 2, PS, 'Write the pseudocode to determine the largest and smallest numbers in a given list of N numbers (sales figures), ensuring the solution is efficient for real-world applications.'],
  ['12 b', 3, 2, PS, 'Write the pseudocode to calculate the factorial of a given number using a for loop.'],
  ['13 a', 5, 3, REC, "Use recursion to generate the first 'n' numbers in the Fibonacci sequence (financial growth projection tool)."],
  ['13 b', 4, 3, SEL, 'Write a program that accepts the lengths of three sides of a triangle as input and determines whether or not the triangle is a right triangle.'],
  ['14 a', 6, 3, REC, 'Given two positive integers a and b, write a Python program using recursion to find their LCM using the relationship between GCD and LCM (lcm × gcd = a × b); do not use the LCM formula directly.'],
  ['14 b', 3, 3, SEL, 'Reorganise the characters of a sentence so that capital letters come first, then small letters, then digits, then special characters; display the output as a single word (Python program).'],
  ['15 a', 6, 4, DC, 'Given an array of positive integer loan interest rates, develop an efficient Divide and Conquer algorithm to find the sum of the two smallest rates. Explain with a suitable example.'],
  ['15 b', 3, 4, [GR, DP], 'Compare and contrast greedy approach and dynamic programming approach.'],
  ['16 a', 6, 4, DP, 'Explain memoization and tabulation techniques in dynamic programming for calculating the n-th Fibonacci number.'],
  ['16 b', 3, 4, GR, 'Given an array of positive integers where each integer is the time taken to complete a task, develop a greedy algorithm to determine the maximum number of tasks you can complete in a given total time limit. Explain your reasoning behind each step.'],
])

/* ---------------------------------------------------------------- 2 */
const MODEL = paper('KTU Model Paper (2024 scheme)', 2024, 'model', partByNumber(8), [
  ['1', 3, 1, DEC, 'How do you use a decomposition strategy to design a menu-driven calculator that supports four basic arithmetic operators – addition, subtraction, multiplication and division?'],
  ['2', 3, 4, DP, 'A mad scientist makes a chain out of plutonium and lead pieces. Two plutonium pieces next to each other go BOOM! In how many ways can the scientist safely construct a chain of length n?'],
  ['3', 3, 3, PS, 'Write a case statement that examines the value of flag and prints: 1 → Hot, 2 → Luke warm, 3 → Cold, any other value → Out of range.'],
  ['4', 3, 3, FC, 'Draw a flowchart to print the numbers that are divisible by 4 but not by 3 in a list of n positive numbers.'],
  ['5', 3, 4, REC, 'Identify and rectify the problem with the following recursive definition to find the GCD of two positive integers: ABC(n, m): if n == 2 return m, else return ABC(m, n mod m).'],
  ['6', 3, 4, REC, 'Write a recursive procedure to search for a key in a list of n integers.'],
  ['7', 3, 3, [GR, DP], 'Compare and contrast greedy and dynamic programming strategies.'],
  ['8', 3, 3, BF, 'Give the pseudocode for the brute force technique to find the mode of the elements in an array (the value that appears most frequently).'],
  ['9', 9, 1, P, 'Walk through the six problem-solving steps to find the largest number out of three numbers.'],
  ['10 a', 5, 2, S, 'Your professor has given you an assignment on "Algorithmic thinking" to be submitted by this Wednesday. How do you employ means-end analysis to devise a strategy for completing it before the deadline?'],
  ['10 b', 4, 1, S, 'Name two current problems in your life that might be solved through a heuristic approach. Explain why each can be solved using heuristics.'],
  ['11 a', 6, 3, FC, 'Draw a flowchart for determining the percentage increase in the population of the country per decade, given the first and last decade and the population at the beginning of each decade.'],
  ['11 b', 3, 3, FC, 'Draw a flowchart to find the average mileage of a car in km per litre after six fill-ups (inputs: litres, starting odometer reading, odometer reading at each fill-up).'],
  ['12 a', 6, 3, PS, 'Ball-bounce experiment: input the initial height, bounciness index and number of bounces; write an algorithm that outputs the total distance travelled by the ball.'],
  ['12 b', 3, 3, PS, 'Light travels at 3 × 10^8 m/s. Write an algorithm that inputs a large distance in metres and displays it in light-years.'],
  ['13 a', 5, 4, REC, "Write a recursive function to find an array's minimum and maximum elements, returning a tuple (min, max)."],
  ['13 b', 4, 4, SEL, 'Write a program to input a matrix and determine its type: lower triangular, upper triangular, or diagonal.'],
  ['14 a', 6, 4, SEL, 'Write a program to read N words and display them in increasing order of their lengths. The length of each word is also to be displayed.'],
  ['14 b', 3, 4, SEL, '500 light bulbs start OFF. Pass k (k = 2…500) toggles every k-th bulb. Devise an algorithm to determine which bulbs glow at the end.'],
  ['15 a', 6, 3, GR, 'An empty stomach holds 1.5 litres. Give a greedy algorithm to output an efficient lunch menu maximising total nutritional value (rice 2.5 cups/800 cal, sambar 1.5/140, potato curry 0.5/50, fish fry 0.5/200, buttermilk 1/98, payasam 2/300; 1 cup = 250 ml).'],
  ['15 b', 3, 2, [DP, REC], 'How are recursion and dynamic programming related? Is it possible to construct a DP version for all recursive solutions?'],
  ['16 a', 4, 3, RN, 'Write a Python program for a random walk simulation on a 2D grid from (0, 0): at each step move up, down, left or right at random. Print the final position after 10 steps.'],
  ['16 b', 5, 2, DC, 'Use divide and conquer to find the majority element (appears more than n/2 times) in an array: find the majority element of each half and combine.'],
])

/* ---------------------------------------------------------------- 3 */
const S1 = paper('CET Series 1 (Nov 2024)', 2024, 's1', partByNumber(4), [
  ['1', 3, 1, S, 'Six glasses are in a row: the first three full of juice, the last three empty. By moving only one glass, can you arrange them so that empty and full glasses alternate?'],
  ['2', 3, 1, S, 'Cross-country road trip visiting multiple cities while minimising travel time. Using a heuristic approach, describe how you would choose the next city at each stop, preferring cities closer to the current location.'],
  ['3', 3, 1, PS, 'What is a looping construct? How does the "while" loop differ from the "repeat-until" loop?'],
  ['4', 3, 2, PS, 'Design an algorithm to reverse the digits of a positive integer.'],
  ['5 a', 5, 1, S, 'You need to renovate a house within a budget and a limited time frame (painting, new flooring, kitchen upgrade). Using Means-End Analysis, explain how you would prioritise tasks and allocate resources.'],
  ['5 b', 5, 1, S, 'A pile of mangoes: the king took 1/6, the queen 1/5 of the remainder, the three princes 1/4, 1/3 and 1/2 of the successive remainders, and the youngest child took the 3 remaining mangoes. Find the number of mangoes in the pile.'],
  ['5 c', 4, 1, Y, 'Give the output of any four relational operators using the two operands a = 5 and b = 3.'],
  ['6 a', 5, 1, S, 'You are organising a department-level coding competition ("Drishti"). Using the "working backwards" strategy, outline the steps you need to take to ensure the event is successful.'],
  ['6 b', 5, 1, S, 'A postal clerk sold some 15 Rs stamps and some 25 Rs stamps: 15 stamps in all, for a total of 315 Rs. How many of each type were sold?'],
  ['6 c', 4, 1, Y, 'Give the output of any four bitwise operators using the two operands a = 2 and b = 3.'],
  ['7 a', 8, 2, PS, "Write an algorithm that evaluates a student's score (0–100) into a letter grade (A ≥ 90, B 80–89, C 70–79, D 60–69, F < 60) using both an if-else structure and a case (switch) structure (floor the score to the nearest ten for the case). Print the grade from both methods."],
  ['7 b', 6, 2, PS, 'Given a sequence of n integers in the range 1 to 5, return the top k frequent elements. (Input n = 6: 1, 1, 1, 2, 2, 3, k = 2 → Output 1, 2.)'],
  ['8 a', 10, 2, PS, 'Write an algorithm that finds the sum of all prime numbers from 1 to a given integer n (inclusive), using both a while loop and a for loop.'],
  ['8 b', 4, 2, PS, 'Write an algorithm to find the minimum and maximum elements in a sequence of n integers.'],
])

/* ---------------------------------------------------------------- 4 */
const S2 = paper('CET Series 2 (Dec 2024)', 2024, 's2', partByNumber(4), [
  ['1', 3, 3, REC, 'Consider the recursive algorithm A(m, n): if m == 0 return n+1; else if n == 0 return A(m−1, 1); else return A(m−1, A(m, n−1)). Find the value returned on the call A(1, 2).'],
  ['2', 3, 3, REC, 'Identify the issue in the recursive function def list_sum(lst): return lst[0] + list_sum(lst[0:]) and rewrite it to avoid the issue.'],
  ['3', 3, 4, BF, 'A four-digit numerical padlock has digits 0–9. Using a brute-force strategy, how many attempts might be required to guarantee opening the lock?'],
  ['4', 3, 4, BF, 'Suggest a real-world scenario where brute-force is preferred over divide-and-conquer and explain why.'],
  ['5 a', 7, 3, DEC, 'Create a modular algorithm to check if a given number is prime: (a) define modules for input validation, prime checking and result display; (b) explain how modularisation improves code clarity.'],
  ['5 b', 7, 3, REC, 'Design a recursive algorithm to reverse the digits of a positive integer. Trace it for input 123 and explain how the call stack changes.'],
  ['6 a', 8, 3, DEC, 'Develop a modular algorithm for an inventory system (add, remove, search an item). Write pseudocode for each module and describe their interconnections.'],
  ['6 b', 6, 3, REC, 'Trace the function calls of sum_upto(n) (return 0 if n == 0, else n + sum_upto(n−1)) for n = 4 and explain how the call stack changes.'],
  ['7 a', 8, 4, BF, 'An inversion is a pair (i, j) with i < j and arr[i] > arr[j]. Design a brute-force algorithm to count the inversions of an array of size n and count its steps in terms of n.'],
  ['7 b', 6, 4, [BF, DC], 'Specify whether brute-force or divide-and-conquer is more appropriate, and justify: (i) cracking a password; (ii) sorting a large dataset.'],
  ['8 a', 8, 4, DC, 'Draw a diagram showing how the array [8, 4, 3, 7, 6, 5, 2, 1] is sorted using merge sort. Write pseudocode for merge sort and explain each step briefly.'],
  ['8 b', 6, 4, DC, 'Explain how a divide-and-conquer approach can be used to calculate x^n (n > 0). Provide pseudocode.'],
])

/* ---------------------------------------------------------------- 5 */
const MAY26 = bank('May 2026 (S)', 2026, 'may26', [
  [1, S, 'For each of Trial and Error, Heuristic approach and Means-Ends Analysis, list any two real-world use cases where the approach can be applied, and justify.', 6],
  [1, P, 'Identify two ill-defined problems and two well-defined problems.', 3],
  [1, P, 'Apply the six steps of the problem-solving process to the task of calculating the real roots of a quadratic equation.', 9],
  [1, Y, 'Evaluate the following Python expressions and write the final output: (i) (5 > 3) and (8 < 6) or (7 == 7)  (ii) 2**3**2  (iii) 15 and -8', 3],
  [1, Y, 'Mention any three functions available in the Python math library and state what each does.', 3],
  [1, Y, 'Write a Python program to reverse a three-digit number without using any loops.', 3],
  [2, PS, 'Write pseudocode to calculate the sum of all even numbers from 1 to N.', 3],
  [2, PS, 'Define pseudocode. List any two advantages of using pseudocode while designing algorithms.', 3],
  [2, PS, 'Write pseudocode to find the average height of boys and the average height of girls in a class of n students.', 6],
  [2, FC, 'Draw a flowchart to find the factorial of a number.', 3],
  [2, FC, 'Draw a flowchart using a CASE construct to display the day of the week based on a number (1–7).', 3],
  [2, FC, 'Using a for loop construct, draw a flowchart to identify the largest of n input numbers.', 3],
  [3, SEL, 'Given s = "MALAYALAM", write the output of: (i) s[-3:]  (ii) s[::-1]  (iii) s[1:8:2]', 3],
  [3, SEL, 'Write a menu-driven Python program to maintain a telephone directory using a dictionary: add, update, delete, display all contacts, and exit.', 6],
  [3, SEL, 'Write a Python program to create a one-dimensional NumPy array and reverse its contents without using a second array.', 3],
  [3, SEL, 'Write a Python program to validate credentials for the University portal, given usernames in list USERNAME and passwords in list PASSWORD (PASSWORD[i] belongs to USERNAME[i]).', 6],
  [3, DEC, 'What is modularization in software development? Discuss its benefits.', 3],
  [3, REC, 'Write a recursive Python function to add two positive numbers.', 3],
  [4, BF, 'Subset Sum: write a brute-force approach to check whether a subset of a given set can produce a target sum (e.g. {2, 4, 6, 8}, target 10 → {4, 6}).', 6],
  [4, DC, 'Compare Divide and Conquer with Dynamic Programming.', 3],
  [4, DC, 'Explain and illustrate the Merge Sort procedure by applying it to the list: 38, 27, 43, 3, 9, 82, 10.', 6],
  [4, DP, 'Write the bottom-up Dynamic Programming algorithm to compute the n-th Fibonacci number.', 3],
  [4, GR, 'In what type of problems is the greedy method guaranteed to work? Explain with a suitable example.', 3],
  [4, RN, 'Explain how a randomized method can be used to approximate the expected number of people who get their own hat back when n hats are randomly distributed among n people.', 6],
])

const DEC25 = bank('Dec 2025 (R,S)', 2025, 'dec25', [
  [1, S, 'How can the heuristic problem-solving strategy help create an effective time-management plan for a study schedule when preparing for multiple subjects in your second-semester university examination?', 6],
  [1, S, "As a fitness expert you want to write and publish a comprehensive fitness book with customised workout routines within a year. How can you use means-ends analysis to achieve this goal?", 6],
  [1, P, 'Walk through the six problem-solving steps to find the area of a right triangle.', 6],
  [1, Y, 'What will be the output of the following Python code? (i) (8 + 6 * 2 ** 3**1) / 7 - 4  (ii) 8 > 5 and 4 <= 4 or 25 != 30', 3],
  [1, Y, 'List out any four Python built-in modules.', 3],
  [2, PS, 'Write an algorithm to display all odd numbers between 1 and 500 in descending order.', 3],
  [2, PS, 'Develop a pseudocode to find the average of the numbers entered by the user that are divisible by 4, where input ends when the user enters -5555 (excluded from the average).', 6],
  [2, PS, 'A robot moves on an N × N grid from a specified start position. Write an algorithm that takes a list of movement commands ("up", "down", "left", "right") and calculates its final position.', 6],
  [2, FC, 'Develop a flowchart for calculating a parking fee with different rates for vehicle type (Car, Bike, Truck) and parking duration (hours).', 6],
  [2, FC, "A farmer wants the average yield per hectare after harvesting crops from different sections of the farm. Develop a flowchart to calculate the average yield.", 6],
  [2, FC, 'Develop a flowchart for a traffic-light control system: input a colour (Red, Yellow, Green) and display the action ("Stop", "Prepare to stop", "Go").', 3],
  [3, SEL, 'A twisted prime is a prime whose reverse is also prime. Write a Python program that checks whether a given number is a twisted prime.', 6],
  [3, SEL, 'Write a Python program to input a list of n numbers and display the sum of cubes of each value.', 3],
  [3, SEL, 'Compare set and list in Python (any two features). Write Python code to convert a given list into a set and write your observation on the printed set. [list values missing in source PDF]', 3],
  [3, DEC, 'Explain any one method, with a suitable example, to return multiple values from a function in Python.', 3],
  [3, REC, 'Write a recursive function that searches for a key in a list of N integers; initially called with the list, the key and the start index; return the index or -1.', 3],
  [3, REC, 'Given a recursive function on a non-negative integer: (1) describe what it computes; (2) explain how the call stack grows and shrinks for input 123. [function code missing in source PDF]', 6],
  [4, BF, 'Identify a real-world scenario where the brute-force approach is preferred over divide and conquer. Explain why.', 3],
  [4, DC, 'List any three advantages and three disadvantages of the divide-and-conquer approach.', 3],
  [4, DP, 'Ram wants the number of distinct ways to climb N stairs taking 1 or 2 steps at a time. Identify the optimal substructure and overlapping subproblems that justify using DP (example N = 3 → 3 ways).', 6],
  [4, DP, 'What do Memoization and Tabulation mean in the context of problem solving? (programs not needed)', 3],
  [4, GR, 'Greedy: given positive item weights and a bag with a maximum weight limit, write an algorithm to maximise the number of items added without exceeding the limit (e.g. max_weight = 10 → 4 items).', 6],
  [4, GR, 'Compare and contrast Greedy and Dynamic Programming problem-solving strategies.', 3],
])

const MAY25 = bank('May 2025 (S)', 2025, 'may25', [
  [1, S, 'Identify the most suitable problem-solving strategy for each, and justify: (i) a complex Sudoku where you are unsure how to proceed in the final few cells; (ii) planning a family trip: destination, flights, accommodation within a budget.', 6],
  [1, S, 'What is the difference between algorithms and heuristics in problem-solving? Provide an example where heuristics lead to a faster solution than an algorithm.', 3],
  [1, P, 'Walk through the six problem-solving steps to calculate the area of a circle.', 6],
  [1, Y, 'What will be the result of the following expressions in Python? (i) (50 - 5 * 6) // 4  (ii) not (10 < 5) or (5 == 5)  (iii) True and 5', 3],
  [1, Y, 'What are the basic data types in Python? Provide examples for each.', 3],
  [1, Y, 'Write a Python program to convert a time input in minutes to hours and minutes (e.g. 85 minutes is 1 hour 25 minutes).', 3],
  [2, PS, 'What are the advantages of using pseudocode over directly writing the code?', 3],
  [2, PS, 'If the three sides of a triangle are input, write an algorithm/pseudocode to check whether the triangle is isosceles, equilateral or scalene.', 6],
  [2, PS, 'Write pseudocode to determine the average age of students in a class. The user stops the input by entering age 0.', 6],
  [2, FC, 'Draw a flowchart to print integers below 50.', 3],
  [2, FC, 'A shop gives a 10% discount on all mobiles plus a flat exchange price of 1000 for old mobiles. Draw a flowchart to input the original price and print the selling price.', 6],
  [2, FC, 'Draw a flowchart to find the largest number from a series of numbers entered sequentially.', 3],
  [3, SEL, 'Given a list of numbers, write slicing expressions to (1) extract the first 5 elements, (2) extract every second element starting from the first, (3) reverse the list. [list values missing in source PDF]', 3],
  [3, SEL, 'What are the primary differences between lists, tuples and strings in Python in terms of mutability, usage and methods?', 3],
  [3, SEL, 'Write a Python program to input two lists and merge them into a third list in which all even numbers come first, then odd numbers, each group in sorted order.', 6],
  [3, DEC, 'Write a Python function isValid_mobile_no: a valid number has exactly 10 digits and the first digit is 7, 8 or 9.', 3],
  [3, REC, 'What is circularity in recursion? How can you prevent circularity in recursive functions?', 3],
  [3, REC, 'Write a recursive function in Python to find the GCD of two numbers.', 3],
  [3, REC, 'Write a recursive function to multiply two positive numbers. Trace the calls for 3 and 4 and explain the call-stack changes.', 6],
  [4, BF, 'What is the brute-force computational problem-solving approach, and how many maximum attempts are needed to guarantee opening a four-digit numerical padlock?', 3],
  [4, DC, 'Illustrate the process of sorting an array using merge sort. Draw a diagram showing how the array is split and merged at each stage.', 6],
  [4, DP, 'Compare Dynamic Programming and Recursion in terms of approach, efficiency and use cases.', 3],
  [4, DP, 'What is memoization, and how does it differ from tabulation in dynamic programming?', 3],
  [4, GR, 'A vending machine must return change using the least number of coins from given denominations (infinite supply). Implement the greedy algorithm.', 6],
  [4, GR, 'Compare Greedy Algorithms and Dynamic Programming in terms of approach, solution guarantee and applicable scenarios. Give examples where each is preferred.', 6],
])

export const REAL_PAPERS: PyqPaper[] = [DEC24, MODEL, S1, S2, MAY26, DEC25, MAY25]
