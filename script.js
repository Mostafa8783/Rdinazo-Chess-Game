const boardElement = document.getElementById('board');
const infoElement = document.getElementById('info');
const boardSize = 8;
let board = [];
let currentPlayer = 'white';
let selectedPiece = null;
let possibleMoves = [];

// آرایه برای نمایش مهره‌ها (می‌توانید از حروف اختصاری استفاده کنید)
const pieces = {
    'r': '&#9820;', // رخ سیاه
    'n': '&#9822;', // اسب سیاه
    'b': '&#9821;', // فیل سیاه
    'q': '&#9819;', // وزیر سیاه
    'k': '&#9818;', // شاه سیاه
    'p': '&#9823;', // سرباز سیاه
    'R': '&#9814;', // رخ سفید
    'N': '&#9816;', // اسب سفید
    'B': '&#9815;', // فیل سفید
    'Q': '&#9813;', // وزیر سفید
    'K': '&#9812;', // شاه سفید
    'P': '&#9817;', // سرباز سفید
    '': ''      // خانه خالی
};

// آرایش اولیه صفحه شطرنج
const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

function createBoard() {
    boardElement.innerHTML = '';
    board = [];
    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.dataset.row = i;
            square.dataset.col = j;
            if ((i + j) % 2 === 0) {
                square.classList.add('white');
            } else {
                square.classList.add('black');
            }

            const piece = initialBoard[i][j];
            if (piece) {
                const pieceElement = document.createElement('div');
                pieceElement.classList.add('piece');
                if (piece === piece.toUpperCase()) {
                    pieceElement.classList.add('white-piece');
                } else {
                    pieceElement.classList.add('black-piece');
                }
                pieceElement.innerHTML = pieces[piece];
                square.appendChild(pieceElement);
            }

            square.addEventListener('click', handleSquareClick);
            boardElement.appendChild(square);
            board[i][j] = piece;
        }
    }
}

function handleSquareClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const clickedPiece = board[row][col];

    removePossibleMoves();
    document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));

    if (selectedPiece) {
        // تلاش برای حرکت دادن مهره انتخاب شده
        const target = { row, col };
        if (isValidMove(selectedPiece.position, target)) {
            movePiece(selectedPiece.position, target);
            switchPlayer();
        }
        selectedPiece = null;
        possibleMoves = [];
    } else if (clickedPiece && getPieceColor(clickedPiece) === currentPlayer) {
        // انتخاب مهره
        selectedPiece = { piece: clickedPiece, position: { row, col } };
        event.target.classList.add('selected');
        possibleMoves = getPossibleMoves(selectedPiece.position);
        showPossibleMoves();
    }
}

function getPieceColor(piece) {
    return piece === piece.toUpperCase() ? 'white' : 'black';
}

function isValidMove(start, end) {
    // در اینجا منطق ساده برای تست حرکت قرار می‌گیرد (باید کامل شود)
    if (!selectedPiece) return false;
    const pieceType = selectedPiece.piece.toLowerCase();
    const startRow = start.row;
    const startCol = start.col;
    const endRow = end.row;
    const endCol = end.col;

    if (startRow === endRow && startCol === endCol) return false; // عدم حرکت

    // منطق بسیار ساده برای سرباز (فقط یک خانه به جلو)
    if (pieceType === 'p') {
        const direction = currentPlayer === 'white' ? -1 : 1;
        if (endCol === startCol && endRow === startRow + direction && !board[endRow][endCol]) {
            return true;
        }
        // TODO: اضافه کردن منطق حرکت مورب برای گرفتن و حرکت دو خانه در شروع
        return false;
    }

    // منطق ساده برای رخ (فقط حرکت افقی یا عمودی)
    if (pieceType === 'r') {
        if (startRow === endRow) {
            const min = Math.min(startCol, endCol);
            const max = Math.max(startCol, endCol);
            for (let i = min + 1; i < max; i++) {
                if (board[startRow][i]) return false;
            }
            return true;
        }
        if (startCol === endCol) {
            const min = Math.min(startRow, endRow);
            const max = Math.max(startRow, endRow);
            for (let i = min + 1; i < max; i++) {
                if (board[i][startCol]) return false;
            }
            return true;
        }
        return false;
    }

    // TODO: اضافه کردن منطق برای سایر مهره‌ها

    // حرکت پیش‌فرض غیرمجاز
    return false;
}

function getPossibleMoves(position) {
    // TODO: پیاده‌سازی منطق کامل برای یافتن حرکات ممکن برای هر مهره
    return [];
}

function showPossibleMoves() {
    possibleMoves.forEach(move => {
        const square = document.querySelector(`.square[data-row="${move.row}"][data-col="${move.col}"]`);
        if (square) {
            square.classList.add('possible-move');
        }
    });
}

function removePossibleMoves() {
    document.querySelectorAll('.possible-move').forEach(el => el.classList.remove('possible-move'));
}

function movePiece(start, end) {
    const startSquare = document.querySelector(`.square[data-row="${start.row}"][data-col="${start.col}"]`);
    const endSquare = document.querySelector(`.square[data-row="${end.row}"][data-col="${end.col}"]`);

    if (startSquare && endSquare) {
        const pieceToMove = startSquare.firstChild;
        if (pieceToMove) {
            board[end.row][end.col] = board[start.row][start.col];
            board[start.row][start.col] = '';
            endSquare.innerHTML = '';
            endSquare.appendChild(pieceToMove);
            startSquare.innerHTML = '';
        }
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    infoElement.textContent = `نوبت بازیکن ${currentPlayer === 'white' ? 'سفید' : 'سیاه'}`;
}

// مقداردهی اولیه صفحه شطرنج
createBoard();
