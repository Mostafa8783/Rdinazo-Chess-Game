// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgbmbJE6w5BybIuWk7gEc9zlJmQYtwKxM",
  authDomain: "rdinazo-chess-game.firebaseapp.com",
  projectId: "rdinazo-chess-game",
  storageBucket: "rdinazo-chess-game.firebasestorage.app",
  messagingSenderId: "469942196401",
  appId: "1:469942196401:web:5e31b38db381f90b05aa90"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// مقداردهی Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let board = null;
let game = new Chess();
let roomId = "";
let isWhite = true;
let playerColor = null;  // "white" یا "black"

// ایجاد اتاق جدید
function createRoom() {
  roomId = Math.random().toString(36).substr(2, 6);
  isWhite = true;
  playerColor = "white";

  const gameRef = db.ref("rooms/" + roomId);
  gameRef.set({
    fen: game.fen(),
    turn: 'w',  // نوبت شروع بازی سفید است
    players: {
      white: true,
      black: false
    }
  });

  document.getElementById("room-display").innerText = "آیدی اتاق شما: " + roomId + " (شما سفید هستید)";
  document.getElementById("board").style.display = "block";
  setupBoard(gameRef);
}

// ورود به اتاق موجود
function joinRoom() {
  roomId = document.getElementById("room-id").value.trim();
  if (!roomId) {
    alert("لطفاً آیدی اتاق را وارد کنید");
    return;
  }

  const gameRef = db.ref("rooms/" + roomId);

  gameRef.once("value", snapshot => {
    const data = snapshot.val();
    if (snapshot.exists()) {
      if(data.players.black === false) {
        // اجازه ورود بازیکن سیاه
        playerColor = "black";
        gameRef.child('players/black').set(true);
        document.getElementById("room-display").innerText = "وارد اتاق شدی: " + roomId + " (شما سیاه هستید)";
        document.getElementById("board").style.display = "block";
        setupBoard(gameRef);
      } else {
        alert("اتاق پر است!");
      }
    } else {
      alert("اتاق وجود ندارد.");
    }
  });
}

// راه‌اندازی صفحه شطرنج و مدیریت حرکات
function setupBoard(gameRef) {
  board = Chessboard('board', {
    draggable: true,
    position: game.fen(),
    orientation: playerColor,
    onDragStart: (source, piece) => {
      // اجازه حرکت فقط به بازیکن نوبت دار
      if ((playerColor === 'white' && game.turn() !== 'w') ||
          (playerColor === 'black' && game.turn() !== 'b')) {
        return false;
      }
      // فقط مهره‌های خود بازیکن قابل حرکتند
      if ((playerColor === 'white' && piece.search(/^b/) !== -1) ||
          (playerColor === 'black' && piece.search(/^w/) !== -1)) {
        return false;
      }
    },
    onDrop: (source, target) => {
      const move = game.move({ from: source, to: target, promotion: 'q' });
      if (move === null) return 'snapback';

      // به‌روزرسانی پایگاه داده با حالت جدید بازی
      gameRef.update({
        fen: game.fen(),
        turn: game.turn()
      });

      return;
    },
    onSnapEnd: () => {
      board.position(game.fen());
    }
  });

  // شنونده تغییرات دیتابیس برای بروزرسانی صفحه برای بازیکن مقابل
  gameRef.on("value", snapshot => {
    const data = snapshot.val();
    if (data && data.fen && data.fen !== game.fen()) {
      game.load(data.fen);
      board.position(game.fen());
    }
  });
}
