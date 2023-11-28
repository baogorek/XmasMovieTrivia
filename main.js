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


document.addEventListener('DOMContentLoaded', () => {
    const questionElement = document.getElementById('question');
    const optionsForm = document.getElementById('options');
    const feedbackElement = document.getElementById('feedback');
    const submitButton = document.getElementById('submit');

    const trivia = {
        question: "In which Christmas movie does the main character travel to New York to meet his father?",
        options: ["Elf", "Home Alone", "The Santa Clause", "A Christmas Carol", "Miracle on 34th Street"],
        answer: "Elf"
    };

    questionElement.textContent = trivia.question;
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

    submitButton.onclick = (e) => {
        e.preventDefault();
        let selectedAnswer = document.querySelector('input[name="triviaOption"]:checked')?.value;
        if (selectedAnswer === trivia.answer) {
            feedbackElement.textContent = 'Correct!';
        } else {
            feedbackElement.textContent = 'Try again.';
        }
    };
});
