// ========================================
// Firebase Configuration
// ========================================

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};


// ========================================
// Start Firebase
// ========================================

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

const messagesRef = database.ref("messages");


// ========================================
// User
// ========================================

let username = localStorage.getItem("chat_username");

if (!username) {

  username = prompt("نام خود را وارد کنید:");

  if (!username || username.trim() === "") {
    username = "کاربر ناشناس";
  }

  username = username.trim().substring(0, 30);

  localStorage.setItem(
    "chat_username",
    username
  );
}


// ========================================
// Elements
// ========================================

const messageForm =
  document.getElementById("messageForm");

const messageInput =
  document.getElementById("messageInput");

const messagesContainer =
  document.getElementById("messages");


// ========================================
// Send Message
// ========================================

messageForm.addEventListener(
  "submit",
  function (event) {

    event.preventDefault();

    const text =
      messageInput.value.trim();

    if (!text) {
      return;
    }

    if (text.length > 500) {
      alert("پیام نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد.");
      return;
    }

    const message = {

      username: username,

      text: text,

      timestamp:
        firebase.database.ServerValue.TIMESTAMP

    };

    messagesRef
      .push(message)
      .then(() => {

        messageInput.value = "";

        messageInput.focus();

      })
      .catch((error) => {

        console.error(error);

        alert(
          "ارسال پیام انجام نشد."
        );

      });

  }
);


// ========================================
// Receive Messages
// ========================================

messagesRef
  .limitToLast(100)
  .on(
    "child_added",
    function (snapshot) {

      const message =
        snapshot.val();

      displayMessage(message);

    }
  );


// ========================================
// Display Message
// ========================================

function displayMessage(message) {

  const welcome =
    messagesContainer.querySelector(".welcome");

  if (welcome) {
    welcome.remove();
  }

  const messageElement =
    document.createElement("div");

  const isMine =
    message.username === username;

  messageElement.className =
    "message" +
    (isMine ? " mine" : "");


  // Username
  const nameElement =
    document.createElement("div");

  nameElement.className =
    "message-name";

  nameElement.textContent =
    message.username;


  // Text
  const textElement =
    document.createElement("div");

  textElement.className =
    "message-text";

  // textContent برای جلوگیری از اجرای HTML
  textElement.textContent =
    message.text;


  // Time
  const timeElement =
    document.createElement("div");

  timeElement.className =
    "message-time";

  timeElement.textContent =
    formatTime(message.timestamp);


  messageElement.appendChild(
    nameElement
  );

  messageElement.appendChild(
    textElement
  );

  messageElement.appendChild(
    timeElement
  );


  messagesContainer.appendChild(
    messageElement
  );


  // Scroll پایین
  messagesContainer.scrollTop =
    messagesContainer.scrollHeight;
}


// ========================================
// Format Time
// ========================================

function formatTime(timestamp) {

  if (!timestamp) {
    return "";
  }

  const date =
    new Date(timestamp);

  return date.toLocaleTimeString(
    "fa-IR",
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  );
}


// ========================================
// Enter = Send
// Shift + Enter = New line
// ========================================

messageInput.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      messageForm.requestSubmit();

    }

  }
);
