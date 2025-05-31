let perfectQuestion = true;
const scoreElement = document.getElementById('score');
const streakElement = document.getElementById('streak');
let score = 0
let streak = 1
var startTime, endTime;
var count = 200;
var multiplier = 1;

function start() {
    startTime = new Date();
};

function end() {
    endTime = new Date();
    var timeDiff = endTime - startTime; //in ms
    // strip the ms
    timeDiff /= 1000;
    
    // get seconds 
    var seconds = Math.round(timeDiff);
    return seconds;
}
function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

var count = 400;
var defaults = {
    origin: { y: 0.7 }
};

function fire(particleRatio, opts) {
    const defaults = {
        spread: 180,
        origin: { y: -0.1 },
        startVelocity: -35
    };
    confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * multiplier * particleRatio)
    });
}


function customConfetti() {
    if (!perfectQuestion) {
        streak = 1;
        streakElement.textContent = `Combo: ${streak - 1}`;
        return;
    }
    streak++;
    streakElement.textContent = `Combo: ${streak - 1}`;
    const timeSinceQuestionStarted = end();
    multiplier = Math.max(1 - (timeSinceQuestionStarted / 10) * 0.8, 0.2);
    score += 1 +( streak * multiplier)
    console.table({ score, streak, multiplier });
    scoreElement.textContent = `Score: ${Math.round(score)}`;
    
    
    
    
    
    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });
    fire(0.2, {
        spread: 60,
    });
    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
}
fetch('quiz.txt')
.then(response => response.text())
.then(data => {
    const textFileContent = data;
    const quizContainer = document.getElementById('quiz-container');
    const submitButton = document.getElementById('submit-button');
    const questions = textFileContent.split('|').filter(q => q.trim());
    const questionNumber = document.getElementById('question-number');
    
    let currentQuestionIndex = 0;
    let correctAnswersMap = new Map();
    
    questions.forEach((questionBlock, index) => {
        const lines = questionBlock.trim().split('\n');
        const questionText = lines[0];
        const answers = lines.slice(1);
        
        correctAnswersMap.set(index, answers.filter(a => a.startsWith('*')).map(a => a.replace(/^\*/, '').trim()));
    });
    
    function showQuestion(index) {
        start();
        perfectQuestion = true;
        questionNumber.textContent = `${index + 1}/${questions.length}`;
        quizContainer.innerHTML = '';
        const lines = questions[index].trim().split('\n');
        const questionText = lines[0];
        const answers = lines.slice(1);
        
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        
        const questionTitle = document.createElement('div');
        questionTitle.classList.add('question-title');
        questionTitle.textContent = questionText;
        
        const answersDiv = document.createElement('div');
        answersDiv.classList.add('answers');
        
        // Shuffle the answers array
        const shuffledAnswers = answers.sort(() => Math.random() - 0.5);
        
        shuffledAnswers.forEach((answer, i) => {
            const isCorrect = answer.startsWith('*');
            const cleanedAnswer = answer.replace(/^\*/, '').trim();
            
            const label = document.createElement('label');
            label.style.display = 'block';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = cleanedAnswer;
            checkbox.dataset.correct = isCorrect;
            checkbox.name = `question-${index}`;
            
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(cleanedAnswer));
            answersDiv.appendChild(label);
        });
        
        questionDiv.appendChild(questionTitle);
        questionDiv.appendChild(answersDiv);
        quizContainer.appendChild(questionDiv);
    }
    
    function validateQuestion(index) {
        const correctAnswers = correctAnswersMap.get(index);
        const selectedAnswers = Array.from(document.querySelectorAll(`input[name='question-${index}']:checked`)).map(cb => cb.value);
        return selectedAnswers.length === correctAnswers.length && correctAnswers.every(ca => selectedAnswers.includes(ca));
    }
    
    quizContainer.addEventListener('change', (event) => {
        if (event.target.type === 'checkbox') {
            if (event.target.dataset.correct === 'true') {
                event.target.parentElement.style.color = 'green';
            } else {
                event.target.parentElement.style.color = 'red';
                perfectQuestion = false;
            }
        }
        
        const checkboxes = document.querySelectorAll(`input[name='question-${currentQuestionIndex}']`);
        const isAnsweredCorrectly = validateQuestion(currentQuestionIndex);
        submitButton.disabled = !isAnsweredCorrectly;
    });
    
    document.getElementById('next').addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
            submitButton.disabled = true;
        }
    });
    
    document.getElementById('back').addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion(currentQuestionIndex);
            submitButton.disabled = true;
        }
    });
    
    
    
    
    submitButton.addEventListener('click', () => {
        if (validateQuestion(currentQuestionIndex)) {
            customConfetti();
            currentQuestionIndex++;
            
            if (currentQuestionIndex < questions.length) {
                showQuestion(currentQuestionIndex);
                submitButton.disabled = true;
            } else {
                alert('Quiz completed! All answers are correct.');
                quizContainer.innerHTML = '<h2>Well done!</h2>';
            }
        } else {
            alert('Incorrect answer. Please try again.');
        }
    });
    
    // quizContainer.addEventListener('change', () => {
        //     const checkboxes = document.querySelectorAll(`input[name='question-${currentQuestionIndex}']`);
    //     const isAnswered = Array.from(checkboxes).some(cb => cb.checked);
    //     submitButton.disabled = !isAnswered;
    // });
    
    // Initialize the first question
    showQuestion(currentQuestionIndex);
})
.catch(error => console.error('Error fetching the questions:', error));

