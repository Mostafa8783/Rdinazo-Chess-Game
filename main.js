// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHCLr4WO84IsdENcsKwx1pQXuRtUDLJx8",
  authDomain: "rdinazo-chess.firebaseapp.com",
  projectId: "rdinazo-chess",
  storageBucket: "rdinazo-chess.firebasestorage.app",
  messagingSenderId: "540475992058",
  appId: "1:540475992058:web:9ff07119b24e378ccea643",
  measurementId: "G-2BPC1VMNE1"
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
