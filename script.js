const board = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');
const statusDisplay = document.getElementById('status');
const moveCountDisplay = document.getElementById('move-count');

let cards = [];
let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;
let matchedCards = 0;
let moveCount = 0;
const totalPairs = 8; // Số cặp thẻ
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : Infinity;

// Tạo thẻ
const createCards = () => {
    const cardValues = [];
    for (let i = 1; i <= totalPairs; i++) {
        cardValues.push(i, i); // Mỗi giá trị xuất hiện hai lần
    }

    // Trộn thẻ
    cardValues.sort(() => Math.random() - 0.5);
    cards = cardValues;

    // Tạo các ô thẻ
    board.innerHTML = '';
    cards.forEach((value, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });

    // Reset số lần lật thẻ
    moveCount = 0;
    moveCountDisplay.innerText = moveCount;
};

// Lật thẻ
const flipCard = (event) => {
    if (lockBoard) return;
    const clickedCard = event.target;

    if (clickedCard === firstCard) return;

    clickedCard.classList.add('flipped');
    clickedCard.innerText = clickedCard.dataset.value;

    moveCount++;
    moveCountDisplay.innerText = moveCount;

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = clickedCard;
        return;
    }

    secondCard = clickedCard;
    checkForMatch();
};

// Kiểm tra cặp thẻ
const checkForMatch = () => {
    lockBoard = true;
    const isMatch = firstCard.dataset.value === secondCard.dataset.value;

    if (isMatch) {
        matchedCards += 2;
        resetBoard();
        if (matchedCards === cards.length) {
            handleWin();
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            firstCard.innerText = '';
            secondCard.classList.remove('flipped');
            secondCard.innerText = '';
            resetBoard();
        }, 1000);
    }
};

// Đặt lại các biến
const resetBoard = () => {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
};

// Xử lý khi người chơi thắng
const handleWin = () => {
    statusDisplay.innerText = `Bạn đã thắng trong ${moveCount} lượt lật thẻ!`;
    if (moveCount < highScore) {
        highScore = moveCount;
        localStorage.setItem('highScore', highScore);
        alert(`Bạn đã thiết lập kỷ lục mới: ${highScore} lượt lật thẻ!`);
    }
};

// Đặt lại trò chơi
const resetGame = () => {
    matchedCards = 0;
    statusDisplay.innerText = '';
    createCards();
};

// Khởi động trò chơi
createCards();

resetButton.addEventListener('click', resetGame);
