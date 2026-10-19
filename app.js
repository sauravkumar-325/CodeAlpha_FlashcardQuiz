
const defaultCards = [
  {
    question: "What is HTML?",
    answer: "HTML stands for HyperText Markup Language."
  },
  {
    question: "What is CSS?",
    answer: "CSS is used to style web pages."
  },
  {
    question: "What is JavaScript?",
    answer: "JavaScript adds interactivity to websites."
  }
];

let cards = defaultCards.map(card => ({ ...card }));

try {
  const savedCards = localStorage.getItem("flashcards");

  if (savedCards !== null) {
    const parsed = JSON.parse(savedCards);

    if (
      Array.isArray(parsed) &&
      parsed.every(card =>
        card &&
        typeof card.question === "string" &&
        typeof card.answer === "string"
      )
    ) {
      cards = parsed;
    }
  }
} catch (error) {
  console.error("Could not load saved flashcards:", error);
}

let currentIndex = 0;
let showingAnswer = false;

const cardCount = document.getElementById("cardCount");
const cardLabel = document.getElementById("cardLabel");
const cardText = document.getElementById("cardText");
const cardHint = document.getElementById("cardHint");
const showAnswerBtn = document.getElementById("showAnswer");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");
const cardForm = document.getElementById("cardForm");
const questionInput = document.getElementById("question");
const answerInput = document.getElementById("answer");

function saveCards() {
  try {
    localStorage.setItem("flashcards", JSON.stringify(cards));
  } catch (error) {
    alert("Could not save cards in this browser.");
    console.error(error);
  }
}

function displayCard() {
  if (cards.length === 0) {
    cardCount.textContent = "No cards available";
    cardLabel.textContent = "EMPTY DECK";
    cardText.textContent = "Add your first flashcard!";
    cardHint.textContent = "Create a question below to get started.";
    showAnswerBtn.hidden = true;
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    editBtn.disabled = true;
    deleteBtn.disabled = true;
    return;
  }

  const card = cards[currentIndex];

  cardCount.textContent =
    `Card ${currentIndex + 1} of ${cards.length}`;

  cardLabel.textContent = showingAnswer ? "ANSWER" : "QUESTION";
  cardText.textContent = showingAnswer
    ? card.answer
    : card.question;

  cardHint.textContent = showingAnswer
    ? "Great! Ready for the next card?"
    : "Think about your answer...";

  showAnswerBtn.hidden = showingAnswer;
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === cards.length - 1;
  editBtn.disabled = false;
  deleteBtn.disabled = false;
}

showAnswerBtn.addEventListener("click", () => {
  showingAnswer = true;
  displayCard();
});

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    showingAnswer = false;
    displayCard();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < cards.length - 1) {
    currentIndex++;
    showingAnswer = false;
    displayCard();
  }
});

cardForm.addEventListener("submit", event => {
  event.preventDefault();

  const question = questionInput.value.trim();
  const answer = answerInput.value.trim();

  if (!question || !answer) {
    alert("Please enter both question and answer.");
    return;
  }

  cards.push({ question, answer });
  currentIndex = cards.length - 1;
  showingAnswer = false;

  saveCards();
  displayCard();
  cardForm.reset();
});

editBtn.addEventListener("click", () => {
  if (cards.length === 0) return;

  const card = cards[currentIndex];

  const question = prompt("Edit question:", card.question);
  if (question === null) return;

  const answer = prompt("Edit answer:", card.answer);
  if (answer === null) return;

  if (!question.trim() || !answer.trim()) {
    alert("Question and answer cannot be empty.");
    return;
  }

  cards[currentIndex] = {
    question: question.trim(),
    answer: answer.trim()
  };

  showingAnswer = false;
  saveCards();
  displayCard();
});

deleteBtn.addEventListener("click", () => {
  if (cards.length === 0) return;

  const confirmed = confirm("Delete this flashcard?");
  if (!confirmed) return;

  cards.splice(currentIndex, 1);

  if (currentIndex >= cards.length) {
    currentIndex = Math.max(0, cards.length - 1);
  }

  showingAnswer = false;
  saveCards();
  displayCard();
});

displayCard();
