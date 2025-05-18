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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let board = null;
let game = new Chess();
let roomId = "";
let isWhite = true;

function startGame() {
  roomId = document.getElementById("room-id").value.trim();
  if (!roomId) {
    alert("لطفاً آیدی اتاق را وارد کنید");
    return;
  }
  const gameRef = db.ref("rooms/" + roomId);
  gameRef.once("value", snapshot => {
    if (snapshot.exists()) {
      isWhite = false;
    } else {
      isWhite = true;
      gameRef.set({ fen: game.fen() });
    }
    setupBoard(gameRef);
  });
}

function setupBoard(gameRef) {
  board = Chessboard('board', {
    draggable: true,
    position: game.fen(),
    orientation: isWhite ? 'white' : 'black',
    onDrop: (source, target) => {
      const move = game.move({ from: source, to: target, promotion: 'q' });
      if (move === null) return 'snapback';
      gameRef.set({ fen: game.fen() });
    }
  });

  gameRef.on("value", snapshot => {
    const data = snapshot.val();
    if (data && data.fen && data.fen !== game.fen()) {
      game.load(data.fen);
      board.position(game.fen());
    }
  });
}
