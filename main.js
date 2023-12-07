if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

let score = 0; // Initialize score
let countdownInterval; // Declare this outside to access it globally in this scope
let currentQuestionIndex = 0; // Global variable to track the question index


const triviaQuestions = [
    [
        { question: "First question for Day 1", options: ["Option 1", "Option 2"], answer: "Option 1" },
        { question: "Second question for Day 1", options: ["Option 3", "Option 4"], answer: "Option 3" }
    ],
    [
        { question: "First question for Day 2", options: ["Option 1", "Option 2"], answer: "Option 1" },
        { question: "Second question for Day 2", options: ["Option 3", "Option 4"], answer: "Option 3" }
    ],
];


function generateShareUrl(score) {
    const tweetText = `I scored ${score} points in the 12 Days of Christmas Trivia! Check it out: [Your Game URL] #12DaysTrivia`;
    return `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
}


function startInitialCountdown() {
    let countdownTime = 3; // Adjust time as needed
    let countdownElement = document.getElementById('countdown'); 

    document.getElementById('trivia').style.display = 'block';
    countdownElement.textContent = `Get ready! Starting in ${countdownTime}...`;

    let countdownInterval = setInterval(() => {
        countdownTime--;
        countdownElement.textContent = `Get ready! Starting in ${countdownTime}...`;

        if (countdownTime <= 0) {
            clearInterval(countdownInterval);
            countdownElement.textContent = '';
            displayQuestionOfDay(0);
        }
    }, 1000);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function endQuestion() {
    document.getElementById('question').textContent = '';
    document.getElementById('options').textContent = 'Hang on...';
    document.getElementById('submit').style.display = 'none';
    await sleep(300); // TODO (baogorek): another countdown timer might be nicer
}

function endDay() {
    //document.getElementById('trivia').style.display = 'none';
    document.getElementById('options').textContent = `End of the Day. Post your score of ${score} to X`;
    document.getElementById('feedback').textContent = `You got a score of ${score} in the 12 Days of XMas Movie Trivia Challenge!`;
    document.getElementById('shareButton').style.display = 'block';
}


function startAnsweringCountdown(callback) {
    let answeringTime = 5;
    let countdownElement = document.getElementById('countdown'); 

    document.getElementById('submit').style.display = 'block';

    countdownElement.style.display = 'block';
    countdownElement.textContent = `Time remaining: ${answeringTime} seconds`;
    document.getElementById('trivia').style.display = 'block';

    let countdownInterval = setInterval(() => {
        answeringTime--;
        countdownElement.textContent = `Time remaining: ${answeringTime} seconds`;

        if (answeringTime <= 0) {
            clearInterval(countdownInterval);
            // countdownElement.textContent = '';
            // countdownElement.style.display = 'none'; 
            // endQuestion();
            clearAnsweringCountdown();
            callback();
        }
    }, 1000);
}

function clearAnsweringCountdown() {
      clearInterval(countdownInterval);
      document.getElementById('countdown').textContent = '';
      document.getElementById('countdown').style.display = 'none';
}

function getDayOfChristmas() {
    const start = new Date('2023-12-14');
    const end = new Date('2024-12-25'); // Include the day after the last day for comparison
    // const today = new Date(); // Replace this with a simulated date for testing
    const today = new Date('2023-12-14');

    if (today >= start && today < end) {
        const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
        return diff + 1; // To get 1 to 12 instead of 0 to 11
    } else {
        return null; // Not in the 12 days range
    }
}

function displayQuestionOfDay(questionIndex) {
    currentQuestionIndex = questionIndex; // Update the global variable
    const day = getDayOfChristmas();
    if (day !== null && day <= triviaQuestions.length && questionIndex < triviaQuestions[day - 1].length) {
        const dayTrivia = triviaQuestions[day - 1][questionIndex];
        document.getElementById('question').textContent = dayTrivia.question;
        updateTriviaUI(dayTrivia);
    } else {
        console.log("It's not the time for 12 Days of Christmas yet.");
    }
    startAnsweringCountdown(() => {
       if (questionIndex + 1 < triviaQuestions[day - 1].length) {
           displayQuestionOfDay(questionIndex + 1); // Display the next question
       } else {
           endDay();
       }
    })
}


function updateTriviaUI(trivia) {
    const questionElement = document.getElementById('question');
    const optionsForm = document.getElementById('options');
    const feedbackElement = document.getElementById('feedback');

    // Clear previous options
    optionsForm.innerHTML = '';

    // Set the new question
    questionElement.textContent = trivia.question;

    // Add new options
    trivia.options.forEach((option, index) => {
        let label = document.createElement('label');
        let radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.name = 'triviaOption';
        radioButton.value = option;
        radioButton.id = 'option' + index;

        label.appendChild(radioButton);
        label.appendChild(document.createTextNode(option));
        optionsForm.appendChild(label);
    });

    // Reset feedback
    feedbackElement.textContent = '';
}

document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submit');
    const feedbackElement = document.getElementById('feedback');
  
    document.getElementById('startButton').addEventListener('click', () => {
        document.getElementById('intro').style.display = 'none';
        startInitialCountdown();
    });
  
    document.getElementById('shareButton').addEventListener('click', () => {
        const shareUrl = generateShareUrl(score);
        window.open(shareUrl, '_blank');
    });
  
    submitButton.onclick = (e) => {
        e.preventDefault();
        clearAnsweringCountdown();
        const day = getDayOfChristmas();
        if (day !== null && day <= triviaQuestions.length) {
            const dayTrivia = triviaQuestions[day - 1];
            let selectedAnswer = document.querySelector('input[name="triviaOption"]:checked')?.value;
            let correctAnswer = dayTrivia[currentQuestionIndex].answer;
            if (selectedAnswer === correctAnswer) {
                feedbackElement.textContent = 'Correct!';
               score += 10;
            } else {
                feedbackElement.textContent = `Incorrect! The correct answer was \"${correctAnswer}!\"`;
            }
            endQuestion();
        }
    };
});
