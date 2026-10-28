const { calculateScore } = require("../src/utils/calculateScore");

describe("Quiz scoring", () => {
  test("calculates correct answers", () => {
    const questions = [
      { _id: "1", correctAnswer: "A", marks: 2 },
      { _id: "2", correctAnswer: "B", marks: 2 },
    ];

    const answers = { "1": "A", "2": "B" };

    expect(calculateScore(questions, answers)).toBe(4);
  });

  test("returns zero for all incorrect answers", () => {
    const questions = [
      { _id: "1", correctAnswer: "A", marks: 2 },
    ];

    const answers = { "1": "B" };

    expect(calculateScore(questions, answers)).toBe(0);
  });

  test("handles unanswered questions", () => {
    const questions = [
      { _id: "1", correctAnswer: "A", marks: 2 },
    ];

    expect(calculateScore(questions, {})).toBe(0);
  });
});
