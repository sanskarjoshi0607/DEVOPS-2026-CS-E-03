const questions = [
    {
        question: "Which language is used to create the structure of a web page?",
        options: ["HTML", "CSS", "JavaScript", "Python"],
        answer: "HTML"
    },

    {
        question: "Which language is used to style a web page?",
        options: ["HTML", "CSS", "Java", "C++"],
        answer: "CSS"
    },

    {
        question: "Which language is used to add interactivity to a web page?",
        options: ["HTML", "CSS", "JavaScript", "SQL"],
        answer: "JavaScript"
    },

    {
        question: "Which keyword is used to declare a variable in JavaScript?",
        options: ["var", "int", "string", "define"],
        answer: "var"
    },

    {
        question: "Which symbol is used for comments in JavaScript?",
        options: ["//", "##", "<!--", "**"],
        answer: "//"
    }
];


// Get HTML elements

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const questionNumber = document.getElementById("question-number");
const questionElement = document.getElementById("question");

const optionsContainer = document.getElementById("options");

const scoreElement = document.getElementById("score");

const progressBar = document.getElementById("progress-bar");

const finalScore = document.getElementById("final-score");
const resultMessage = document.getElementById("result-message");


// Variables

let currentQuestion = 0;
let score = 0;
let selectedAnswer = false;


// Start Quiz

startBtn.addEventListener("click", function () {

    currentQuestion = 0;
    score = 0;

    startScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");

    quizScreen.classList.remove("hidden");

    showQuestion();
});


// Display Question

function showQuestion() {

    selectedAnswer = false;

    nextBtn.disabled = true;

    const question = questions[currentQuestion];

    questionNumber.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    scoreElement.textContent =
        `Score: ${score}`;

    questionElement.textContent = question.question;

    optionsContainer.innerHTML = "";


    // Progress bar

    const progress =
        ((currentQuestion + 1) / questions.length) * 100;

    progressBar.style.width = progress + "%";


    // Create options

    question.options.forEach(function (option) {

        const optionElement = document.createElement("div");

        optionElement.classList.add("option");

        optionElement.textContent = option;

        optionElement.addEventListener("click", function () {

            selectAnswer(optionElement, option);

        });

        optionsContainer.appendChild(optionElement);
    });
}


// Select Answer

function selectAnswer(element, selectedOption) {

    if (selectedAnswer) {
        return;
    }

    selectedAnswer = true;

    const correctAnswer =
        questions[currentQuestion].answer;


    // Disable selecting another option

    const allOptions =
        document.querySelectorAll(".option");

    allOptions.forEach(function (option) {
        option.style.pointerEvents = "none";
    });


    if (selectedOption === correctAnswer) {

        element.classList.add("correct");

        score++;

        scoreElement.textContent =
            `Score: ${score}`;

    } else {

        element.classList.add("wrong");

        // Show correct answer

        allOptions.forEach(function (option) {

            if (option.textContent === correctAnswer) {
                option.classList.add("correct");
            }

        });
    }

    nextBtn.disabled = false;
}


// Next Question

nextBtn.addEventListener("click", function () {

    currentQuestion++;

    if (currentQuestion < questions.length) {

        showQuestion();

    } else {

        showResult();
    }
});


// Show Result

function showResult() {

    quizScreen.classList.add("hidden");

    resultScreen.classList.remove("hidden");

    finalScore.textContent =
        `${score} / ${questions.length}`;


    if (score === questions.length) {

        resultMessage.textContent =
            "Excellent! You got all answers correct.";

    } else if (score >= questions.length / 2) {

        resultMessage.textContent =
            "Good job! Keep practicing.";

    } else {

        resultMessage.textContent =
            "Keep learning and try again!";
    }
}


// Restart Quiz

restartBtn.addEventListener("click", function () {

    resultScreen.classList.add("hidden");

    quizScreen.classList.remove("hidden");

    currentQuestion = 0;
    score = 0;

    showQuestion();
});