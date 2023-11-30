if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/XmasMovieTrivia/service-worker.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

const triviaQuestions = [
    {
        question: "In which Christmas movie does the main character travel to New York to meet his father?",
        options: ["Elf", "Home Alone", "The Santa Clause", "A Christmas Carol", "Miracle on 34th Street"],
        answer: "Elf"
    },
    {
        question: "Question for Day 2",
        options: ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"],
        answer: "Correct Answer for Day 2"
    }
];


document.addEventListener('DOMContentLoaded', () => {                                                                                                
    const submitButton = document.getElementById('submit');                                                                                          
    const feedbackElement = document.getElementById('feedback');                                                                                     

    displayQuestionOfDay();

    submitButton.onclick = (e) => {                                                                                                                  
        e.preventDefault();                                                                                                                          
        const day = getDayOfChristmas();
        if (day !== null && day <= triviaQuestions.length) {
            const dayTrivia = triviaQuestions[day - 1];
            let selectedAnswer = document.querySelector('input[name="triviaOption"]:checked')?.value;                                                    
            if (selectedAnswer === dayTrivia.answer) {                                                                                                      
                feedbackElement.textContent = 'Correct!';                                                                                                
            } else {                                                                                                                                     
                feedbackElement.textContent = 'Try again.';                                                                                              
            }
        }                                                                                                                                            
    };                                                                                                                                               
});


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

function displayQuestionOfDay() {
    const day = getDayOfChristmas();
    if (day !== null && day <= triviaQuestions.length) {
        const dayTrivia = triviaQuestions[day - 1]; // Arrays are 0-indexed
        updateTriviaUI(dayTrivia);
    } else {
        console.log("It's not the time for 12 Days of Christmas yet.");
        // Handle days outside the 12 days of Christmas
    }
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


document.addEventListener('DOMContentLoaded', displayQuestionOfDay);

