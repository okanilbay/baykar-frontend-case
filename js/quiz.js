let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let countdown;
let canSelect = false;
let selectedAnswers = [];

function fetchQuestions() {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(data => {
            questions = data.slice(0, 10);
            renderQuestion();
        })
        .catch(error => console.error('Error fetching questions:', error));
}

function renderQuestion() {
    const questionElement = document.getElementById('question');
    const choicesElement = document.getElementById('choices');
    const currentQuestion = questions[currentQuestionIndex];

    questionElement.textContent = currentQuestion.title;
    choicesElement.innerHTML = '';

    const choices = ['A', 'B', 'C', 'D'];

    choices.forEach(choice => {
        const li = document.createElement('li');
        li.textContent = choice + ". " + currentQuestion.body;
        li.addEventListener('click', () => {
            if (canSelect) {
                const selectedChoice = choicesElement.querySelector('.selected');
                if (selectedChoice) {
                    selectedChoice.classList.remove('selected');
                }
                li.classList.add('selected');
            }
        });
        choicesElement.appendChild(li);
    });

    let timeLeft = 30;
    countdown = setInterval(() => {
        timeLeft--;
        document.getElementById('countdown').textContent = timeLeft;
        if (timeLeft === 20) {
            canSelect = true;
        }
        if (timeLeft === 0) {
            clearInterval(countdown);
            saveAnswer();
        }
    }, 1000);
}

function saveAnswer() {
    const selectedChoice = document.querySelector('.selected');
    if (selectedChoice) {
        const userAnswer = selectedChoice.textContent[0];
        selectedAnswers.push(userAnswer);
        checkAnswer(userAnswer);
    } else {
        selectedAnswers.push('');
        nextQuestion();
    }
}

function checkAnswer(userAnswer) {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = 'A';
    const resultElement = document.getElementById('result-body');
    const tr = document.createElement('tr');
    const tdQuestion = document.createElement('td');
    const tdUserAnswer = document.createElement('td');

    if (userAnswer === correctAnswer) {
        score++;
    }

    tdQuestion.textContent = currentQuestion.title;
    tdUserAnswer.textContent = userAnswer;

    tr.appendChild(tdQuestion);
    tr.appendChild(tdUserAnswer);

    resultElement.appendChild(tr);

    nextQuestion();
}

function nextQuestion() {
    clearInterval(countdown);
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        renderQuestion();
        canSelect = false;
    } else {
        showResults(); // Son sorudan sonra sonuçları göster
    }
}

function showResults() {
    const resultBody = document.getElementById('result-body');
    resultBody.innerHTML = '';

    questions.forEach((question, index) => {
        const tr = document.createElement('tr');
        const tdQuestion = document.createElement('td');
        const tdUserAnswer = document.createElement('td');

        tdQuestion.textContent = "Soru " + (index + 1);
        tdUserAnswer.textContent = selectedAnswers[index] || '';

        tr.appendChild(tdQuestion);
        tr.appendChild(tdUserAnswer);

        resultBody.appendChild(tr);
    });

    // Sonuçları gösterdikten sonra sonuç ekranına geç
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('result-container').style.display = 'block';
    document.getElementById('score').textContent = 'Score: ' + score + ' / 10';
}

fetchQuestions();
