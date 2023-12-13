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

// Global Variables ------------------------------------------
let score = 0;
let currentQuestionIndex = 0;
let triviaQuestions = []; // Global variable

// Immediately-invoked async function to load the data
(async function loadTriviaQuestions() {
    try {
        const response = await fetch('triviaQuestions.json');
        triviaQuestions = await response.json();
    } catch (error) {
        console.error('Failed to load trivia questions:', error);
    }
})();

// Functions -----------------------------------------

function generateShareUrl(score) {
    const tweetText = `I scored ${score} points in the 12 Days of Christmas Trivia! Check it out: [Your Game URL] #12DaysTrivia`;
    return `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
}

function endDay() {
    stage = "EndDay";
    document.getElementById('presentationArea').textContent = `End of the Day. Post your score of ${score} to X`;
    document.getElementById('shareButton').style.display = 'block';
    document.getElementById('exitButton').style.display = 'block';
}

function getDayOfChristmas() {
    const start = new Date('12/14/2023');
    const end = new Date('12/25/2023'); // Include the day after the last day for comparison
    // const today = new Date(); // Replace this with a simulated date for testing
    const today = new Date('12/14/2023');  // Hard code the test date here, comment out for prod

    if (today.getTime() >= start.getTime() && today.getTime() <= end.getTime()) {
        const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
        // console.log("What day is this?", diff + 1);
        return diff + 1; // To get 1 to 12 instead of 0 to 11
    } else {
        console.log("What day is this? Returning 12 since we're outside of the range");
        return 12; // Not in the 12 days range, so always provide the last day
    }
}

function updateTriviaUI(trivia) {
    const presentationArea = document.getElementById('presentationArea');
    const optionsContainer = document.getElementById('responseOptions');

    presentationArea.textContent = trivia.question;
    optionsContainer.innerHTML = '';

    trivia.options.forEach((option, index) => {
        let button = document.createElement('button');
        button.textContent = option;
        button.classList.add('trivia-option');
        button.onclick = () => submitAnswer(option, trivia);
        optionsContainer.appendChild(button);
    });
    console.log("In updateTriviaUI");
    optionsContainer.style.display = 'block';
}

function submitAnswer(selectedAnswer, trivia) {
  const presentationArea = document.getElementById('presentationArea');
    if (selectedAnswer === trivia.answer) {
        score += 10;
        presentationArea.textContent = `Correct! Your score is now ${score}!`;
    } else {
        presentationArea.textContent = `Incorrect! Your score is still ${score}!`;
    }
    document.getElementById('responseOptions').style.display = 'none';
    document.getElementById('continueButton').style.display = 'block';

    // Add an image to the answer
    const image = document.createElement('img');
    image.src = trivia.image;
    image.style.width = '100%';
    image.style.height = 'auto';
    presentationArea.appendChild(image);

    // Add additional context to the answer
    const additionalText = document.createElement('p');
    additionalText.textContent = trivia.answerExplanation;
    presentationArea.appendChild(additionalText);
    
}

document.addEventListener('DOMContentLoaded', () => {
    /* Intro */
    const presentationArea = document.getElementById('presentationArea');
    presentationArea.innerHTML = `
        <h2>Welcome to the 12 Days of Christmas Trivia Game!</h2>
        <p>Get ready to test your knowledge about Christmas movies.</p>
        <p>Share your score and come back everyday for a new challenge!</p>
    `;

    document.getElementById('startButton').style.display = 'block';
    
    /* Event Handlers */
    document.getElementById('startButton').addEventListener('click', () => {
        document.getElementById('startButton').style.display = 'none';
        const day = getDayOfChristmas();
        const dayTrivia = triviaQuestions[day - 1][0];
        document.getElementById('presentationArea').textContent = dayTrivia.question;
        updateTriviaUI(dayTrivia);
    });

    document.getElementById('continueButton').addEventListener('click', () => {
        const day = getDayOfChristmas();
        if (currentQuestionIndex + 1 < triviaQuestions[day - 1].length) {
            currentQuestionIndex++;
            const dayTrivia = triviaQuestions[day - 1][currentQuestionIndex];
            document.getElementById('presentationArea').textContent = dayTrivia.question;
            updateTriviaUI(dayTrivia);
        } else {
            endDay();
        }
        document.getElementById('continueButton').style.display = 'none';
    });
  
    document.getElementById('shareButton').addEventListener('click', () => {
        const shareUrl = generateShareUrl(score);
        window.open(shareUrl, '_blank');
    });

    document.getElementById('exitButton').addEventListener('click', () => {
        window.location.href = 'exit.html';
    });
});
