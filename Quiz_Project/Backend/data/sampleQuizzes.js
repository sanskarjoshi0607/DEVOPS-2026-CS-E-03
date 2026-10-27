/**
 * Sample Quizzes Data
 * Used for database seeding and seamless fallback mode.
 * Each quiz contains metadata and a list of questions with options,
 * correct answers (0-based index), and helpful explanations.
 */

export const sampleQuizzes = [
  {
    title: "React.js Essentials",
    description: "Test your understanding of core React concepts like JSX, Components, State, Props, and common Hooks.",
    category: "React",
    difficulty: "Easy",
    timeLimit: 5, // in minutes
    questions: [
      {
        questionText: "What is JSX in React?",
        options: [
          "A CSS preprocessor used in React applications",
          "A syntax extension to JavaScript that looks like HTML",
          "A database query language for MongoDB",
          "A package manager for Node.js"
        ],
        correctOptionIndex: 1,
        explanation: "JSX stands for JavaScript XML. It allows you to write HTML-like elements inside JavaScript, which React converts into React elements."
      },
      {
        questionText: "Which React hook is commonly used to manage local state in a functional component?",
        options: [
          "useEffect",
          "useContext",
          "useState",
          "useReducer"
        ],
        correctOptionIndex: 2,
        explanation: "useState is the primary hook for adding reactive local state variables to functional components."
      },
      {
        questionText: "How do you pass data from a parent component down to a child component?",
        options: [
          "Using Props (Properties)",
          "Using Redux dispatchers only",
          "By modifying document.getElementById",
          "Using LocalStorage"
        ],
        correctOptionIndex: 0,
        explanation: "In React, data flows downwards from parent to child components via props (short for properties)."
      },
      {
        questionText: "What does the second argument (dependency array) of useEffect do?",
        options: [
          "It defines the CSS styles for the component",
          "It controls when the effect re-runs based on which values have changed",
          "It forces the effect to run on every microsecond",
          "It is used to pass arguments to child components"
        ],
        correctOptionIndex: 1,
        explanation: "The dependency array tells React to only re-run the effect function when one of the specified dependencies has changed between renders."
      },
      {
        questionText: "Why is a unique 'key' prop required when rendering lists in React?",
        options: [
          "To secure the React DOM against hackers",
          "To enable React to identify which items have changed, been added, or removed efficiently",
          "To style list items with alternating colors",
          "Keys are purely optional and make no performance difference"
        ],
        correctOptionIndex: 1,
        explanation: "Keys give elements a stable identity across renders, helping React's reconciliation algorithm accurately identify changes in lists."
      }
    ]
  },
  {
    title: "Modern JavaScript (ES6+)",
    description: "Challenge yourself with modern JavaScript features: arrow functions, destructuring, promises, and async/await.",
    category: "JavaScript",
    difficulty: "Medium",
    timeLimit: 6,
    questions: [
      {
        questionText: "What is the difference between 'let' and 'var' in JavaScript?",
        options: [
          "'let' is block-scoped, while 'var' is function-scoped",
          "'var' cannot be reassigned once declared",
          "'let' is only available in browsers, not in Node.js",
          "There is no difference; they are exact aliases"
        ],
        correctOptionIndex: 0,
        explanation: "'let' respects block scope (within curly braces {}), while 'var' is scoped to the enclosing function and gets hoisted."
      },
      {
        questionText: "Which array method returns a NEW array containing only items that satisfy a given test condition?",
        options: [
          "forEach()",
          "filter()",
          "map()",
          "reduce()"
        ],
        correctOptionIndex: 1,
        explanation: "Array.prototype.filter() creates a shallow copy of a portion of a given array, filtered down to just the elements from the given array that pass the test implemented by the provided function."
      },
      {
        questionText: "What will `console.log(typeof null)` output in standard JavaScript?",
        options: [
          "\"null\"",
          "\"undefined\"",
          "\"object\"",
          "\"number\""
        ],
        correctOptionIndex: 2,
        explanation: "In JavaScript, typeof null returns 'object'. This is a historical bug in the original implementation of JS that has been preserved for backward compatibility."
      },
      {
        questionText: "What keyword is used inside an async function to pause execution until a Promise resolves?",
        options: [
          "pause",
          "wait",
          "await",
          "yield"
        ],
        correctOptionIndex: 2,
        explanation: "The 'await' operator is used in async functions to wait for a Promise to settle (resolve or reject)."
      },
      {
        questionText: "What does the spread operator (...) do when used with an object: `{ ...person, age: 25 }`?",
        options: [
          "Deletes the person object",
          "Creates a new object copying person's properties, overriding or adding age: 25",
          "Converts the object into an Array",
          "Throws a SyntaxError"
        ],
        correctOptionIndex: 1,
        explanation: "The spread syntax shallow-copies all enumerable own properties from the target object into a new object literal."
      }
    ]
  },
  {
    title: "Web Development Fundamentals",
    description: "Core knowledge of HTML5, CSS3, HTTP request methods, and browser mechanics.",
    category: "Web Development",
    difficulty: "Easy",
    timeLimit: 5,
    questions: [
      {
        questionText: "Which HTML5 semantic tag represents navigation links?",
        options: [
          "<navigation>",
          "<nav>",
          "<links>",
          "<menu-bar>"
        ],
        correctOptionIndex: 1,
        explanation: "The <nav> element in HTML5 is intended for major navigation links on a website."
      },
      {
        questionText: "What CSS layout model is best suited for 1-dimensional layouts (rows OR columns)?",
        options: [
          "CSS Grid",
          "CSS Flexbox",
          "Float",
          "Inline-block"
        ],
        correctOptionIndex: 1,
        explanation: "Flexbox (Flexible Box Layout) is designed for 1-dimensional layouts (a row or a column), whereas CSS Grid excels at 2-dimensional layouts (rows and columns simultaneously)."
      },
      {
        questionText: "Which HTTP status code signifies that a requested resource was not found?",
        options: [
          "200 OK",
          "301 Moved Permanently",
          "404 Not Found",
          "500 Internal Server Error"
        ],
        correctOptionIndex: 2,
        explanation: "HTTP 404 indicates that the origin server did not find a current representation for the target resource."
      },
      {
        questionText: "What is CORS (Cross-Origin Resource Sharing)?",
        options: [
          "A security feature implemented by web browsers to restrict cross-origin HTTP requests",
          "A database protocol used by MongoDB",
          "A stylesheet language",
          "A JavaScript bundler"
        ],
        correctOptionIndex: 0,
        explanation: "CORS is an HTTP-header based security mechanism that allows a server to indicate any origins (domain, scheme, or port) other than its own from which a browser should permit loading resources."
      },
      {
        questionText: "Which CSS property is used to change the text color of an element?",
        options: [
          "text-color",
          "font-color",
          "color",
          "background-color"
        ],
        correctOptionIndex: 2,
        explanation: "In CSS, the 'color' property sets the foreground color value of an element's text and text decorations."
      }
    ]
  },
  {
    title: "Python Programming Essentials",
    description: "Test your Python syntax, data types, functions, and standard idioms.",
    category: "Python",
    difficulty: "Medium",
    timeLimit: 5,
    questions: [
      {
        questionText: "What is the key difference between a Python List and a Tuple?",
        options: [
          "Lists are immutable, while Tuples are mutable",
          "Lists are mutable (can be changed), while Tuples are immutable (cannot be changed)",
          "Tuples can only store numbers",
          "Lists are defined with parentheses () and Tuples with brackets []"
        ],
        correctOptionIndex: 1,
        explanation: "Lists (created with []) are mutable and can be modified in place. Tuples (created with ()) are immutable and cannot be changed after creation."
      },
      {
        questionText: "What is the correct syntax for a list comprehension creating squares of 0 through 4?",
        options: [
          "[x^2 for x in range(5)]",
          "[x**2 for x in range(5)]",
          "{x*2 for x in 5}",
          "map(x => x*2, 5)"
        ],
        correctOptionIndex: 1,
        explanation: "In Python, exponentiation is written with `**`. `[x**2 for x in range(5)]` generates [0, 1, 4, 9, 16]."
      },
      {
        questionText: "Which keyword is used to handle exceptions in Python?",
        options: [
          "catch",
          "except",
          "handle",
          "rescue"
        ],
        correctOptionIndex: 1,
        explanation: "Python uses `try ... except` blocks for exception handling."
      },
      {
        questionText: "What does the `len()` function return when called on a string 'Hello'?",
        options: [
          "4",
          "5",
          "6",
          "IndexError"
        ],
        correctOptionIndex: 1,
        explanation: "'Hello' has 5 characters, so `len('Hello')` returns 5."
      }
    ]
  }
];
