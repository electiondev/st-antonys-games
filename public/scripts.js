console.log("🚀 scripts.js is loaded");  // Debug if script is running

// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, orderBy, query } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

console.log("📢 Firebase SDK loaded!");  // Debug Firebase import

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyPyMnjguGoNJ7LU8hA5utirT3aH_pyL4",
  authDomain: "st-antonys-games.firebaseapp.com",
  projectId: "st-antonys-games",
  storageBucket: "st-antonys-games.firebasestorage.app",
  messagingSenderId: "30280850548",
  appId: "1:30280850548:web:0a007861c16471ba210521",
  measurementId: "G-BHCC5T3YWF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("Firebase Initialized:", app);

const db = getFirestore(app);
console.log("Firestore Connected:", db);

// Test Firestore Read
async function testFirestoreConnection() {
    try {
        const querySnapshot = await getDocs(collection(db, "scores"));
        console.log("Firestore Read Test Successful:", querySnapshot.docs.length, "documents found.");
        querySnapshot.forEach(doc => {
            console.log(doc.id, "=>", doc.data());
        });
    } catch (error) {
        console.error("Firestore Read Test Failed:", error);
    }
}
testFirestoreConnection();


// =======================
// 📌 FETCH AND DISPLAY SCORES (index.html)
// =======================
async function fetchScores() {
    const scoresTable = document.getElementById("scores-table");
    const leaderboardTable = document.getElementById("leaderboard-table");
    let leaderboard = {};

    // Query Firestore and order by timestamp
    const q = query(collection(db, "scores"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);


    scoresTable.innerHTML = `
        <tr class="bg-blue-200">
            <th class="border px-4 py-2">Team A</th>
            <th class="border px-4 py-2">Team B</th>
            <th class="border px-4 py-2">Score</th>
            <th class="border px-4 py-2">Winner</th>
        </tr>
    `;

    querySnapshot.forEach((doc) => {
        let data = doc.data();

        // Add row to scores table
        scoresTable.innerHTML += `
            <tr>
                <td class="border px-4 py-2">${data.teamA}</td>
                <td class="border px-4 py-2">${data.teamB}</td>
                <td class="border px-4 py-2">${data.scoreA} - ${data.scoreB}</td>
                <td class="border px-4 py-2 font-bold text-green-600">${data.winner}</td>
            </tr>
        `;

        // Update leaderboard
        if (leaderboard[data.winner]) {
            leaderboard[data.winner] += 1;
        } else {
            leaderboard[data.winner] = 1;
        }
    });

    // Display leaderboard data
    leaderboardTable.innerHTML = `
        <tr class="bg-green-200">
            <th class="border px-4 py-2">Team</th>
            <th class="border px-4 py-2">Wins</th>
        </tr>
    `;
    Object.keys(leaderboard).forEach(team => {
        leaderboardTable.innerHTML += `
            <tr>
                <td class="border px-4 py-2">${team}</td>
                <td class="border px-4 py-2 font-bold">${leaderboard[team]}</td>
            </tr>
        `;
    });
}

// Call fetchScores if on index.html
if (document.getElementById("scores-table")) {
    fetchScores();
}

// =======================
// 📌 ADD NEW SCORE (add-score.html)
// =======================
async function addScore(event) {
    event.preventDefault(); // Prevent page reload

    // Get form values
    const teamA = document.getElementById("teamA").value;
    const scoreA = parseInt(document.getElementById("scoreA").value);
    const teamB = document.getElementById("teamB").value;
    const scoreB = parseInt(document.getElementById("scoreB").value);
    const winner = scoreA > scoreB ? teamA : teamB;

    // Add data to Firestore
    await addDoc(collection(db, "scores"), {
        teamA,
        scoreA,
        teamB,
        scoreB,
        winner,
        timestamp: new Date()
    });

    alert("Score added successfully!");
    window.location.href = "index.html"; // Redirect to leaderboard
}

// Attach event listener if on add-score.html
if (document.getElementById("score-form")) {
    document.getElementById("score-form").addEventListener("submit", addScore);
}