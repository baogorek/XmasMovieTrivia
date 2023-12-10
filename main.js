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
let questionAnswered = false;
let stage = "Intro";


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

    countdownInterval = setInterval(() => {
        countdownTime--;
        countdownElement.textContent = `Get ready! Starting in ${countdownTime}...`;

        if (countdownTime <= 1) {
            stage = "Question";
            clearInterval(countdownInterval);
            countdownElement.textContent = '';
            displayQuestionOfDay(0);
        }
    }, 1000);
}

// const sleep = ms => new Promise(r => setTimeout(r, ms));

function endQuestion() {
    console.log("In endQuestion");
    document.getElementById('question').textContent = '';
    document.getElementById('options').textContent = 'Hang on...';
    questionAnswered = true;
}

function endDay() {
    stage = "EndDay";
    document.getElementById('options').textContent = `End of the Day. Post your score of ${score} to X`;
    document.getElementById('feedback').textContent = `You got a score of ${score} in the 12 Days of XMas Movie Trivia Challenge!`;
    document.getElementById('shareButton').style.display = 'block';
}


async function startAnsweringCountdown(callback) {
    let answeringTime = 5;
    questionAnswered = false;
    let countdownElement = document.getElementById('countdown'); 

    countdownElement.style.display = 'block';
    countdownElement.textContent = `Time remaining: ${answeringTime} seconds`;
    document.getElementById('trivia').style.display = 'block';

    countdownInterval = setInterval(() => {
       if ((questionAnswered || answeringTime <= 1) & stage == "Question") {
           answeringTime = 13; // Reset the time or set it to the desired delay
           stage = "Intermission";
           console.log("intermission");
       } else if (answeringTime <= 1 & stage == "Intermission") {
           stage = "Question";
           clearInterval(countdownInterval);
           clearAnsweringCountdown();
           callback();
       }
       answeringTime--;
       countdownElement.textContent = `Time remaining: ${answeringTime} seconds`;
    }, 1000); 
}

async function clearAnsweringCountdown() {
    console.log("in clear Answering Countdown");
    document.getElementById('countdown').textContent = '';
    document.getElementById('countdown').style.display = 'none';
    // await sleep(9000);  // or add another countdown
}

function getDayOfChristmas() {
    const start = new Date('12/14/2023');
    const end = new Date('12/25/2023'); // Include the day after the last day for comparison
    // const today = new Date(); // Replace this with a simulated date for testing
    const today = new Date('12/15/2023');  // Hard code the test date here, comment out for prod

    if (today.getTime() >= start.getTime() && today.getTime() <= end.getTime()) {
        const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
        // console.log("What day is this?", diff + 1);
        return diff + 1; // To get 1 to 12 instead of 0 to 11
    } else {
        console.log("What day is this? Returning 12 since we're outside of the range");
        return 12; // Not in the 12 days range, so always provide the last day
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
    //const optionsForm = document.getElementById('options');
    const optionsContainer = document.getElementById('options');

    const feedbackElement = document.getElementById('feedback');

    questionElement.textContent = trivia.question;
    optionsContainer.innerHTML = '';

    // Add new options as buttons
    trivia.options.forEach((option, index) => {
        let button = document.createElement('button');
        button.textContent = option;
        button.classList.add('trivia-option'); // Add a class for styling
        button.onclick = () => submitAnswer(option, trivia.answer);
        optionsContainer.appendChild(button);
    });
    // Reset feedback
    feedbackElement.textContent = '';
}

function submitAnswer(selectedAnswer, correctAnswer) {
    if (selectedAnswer === correctAnswer) {
        score += 10;
        document.getElementById('feedback').textContent = 'Correct!';
    } else {
        document.getElementById('feedback').textContent = 'Incorrect. Try again.';
    }
    endQuestion();
}



document.addEventListener('DOMContentLoaded', () => {
    const feedbackElement = document.getElementById('feedback');
  
    document.getElementById('startButton').addEventListener('click', () => {
        document.getElementById('intro').style.display = 'none';
        startInitialCountdown();
    });
  
    document.getElementById('shareButton').addEventListener('click', () => {
        const shareUrl = generateShareUrl(score);
        window.open(shareUrl, '_blank');
    });
  
});
