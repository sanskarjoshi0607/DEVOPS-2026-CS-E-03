const questions = [
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyper Tool Markup Language",
            "Home Text Language"
        ],
        answer: "Hyper Text Markup Language"
    },
    {
        question: "Which language is used for styling?",
        options: ["HTML", "CSS", "Java", "Python"],
        answer: "CSS"
    },
    {
        question: "Which language makes websites interactive?",
        options: ["CSS", "HTML", "JavaScript", "C++"],
        answer: "JavaScript"
    }
];

let currentQuestion = 0;
let score = 0;

const question = document.getElementById("question");
const options = document.querySelectorAll(".option");
const nextBtn = document.getElementById("nextBtn");
const result = document.getElementById("result");

function loadQuestion() {
    const q = questions[currentQuestion];

    question.innerText = q.question;

    options.forEach((option, index) => {
        option.innerText = q.options[index];
        option.style.background = "#eee";

        option.onclick = () => {
            options.forEach(btn => btn.disabled = true);

            if (option.innerText === q.answer) {
                option.style.background = "lightgreen";
                score++;
            } else {
                option.style.background = "lightcoral";
            }
        };

        option.disabled = false;
    });
}

nextBtn.onclick = () => {
    currentQuestion++;

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        document.getElementById("quiz").style.display = "none";
        result.innerText = `Your Score: ${score}/${questions.length}`;
    }
};

loadQuestion();
