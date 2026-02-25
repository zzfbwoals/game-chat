// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBsbMrp1CyfF6WmB45N-rg3PV7-i6IpFPY",
  authDomain: "game-chat-28721.firebaseapp.com",
  projectId: "game-chat-28721",
  storageBucket: "game-chat-28721.firebasestorage.app",
  messagingSenderId: "296867470105",
  appId: "1:296867470105:web:40729ebf5a2de14d298388",
  measurementId: "G-FBELQ7J322"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const messagesRef = db.ref('messages');

// Predefined Users
const USERS = [
  { userId: 'fbwoals', userName: '류재민', password: '0421', avatar: 'JM' },
  { userId: 'rlaalsrud', userName: '김민경', password: '0423', avatar: 'MK' }
];

// State
let currentUser = null;
let lastClearedTimestamp = 0;

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const loginForm = document.getElementById('login-form');
const chatForm = document.getElementById('chat-form');
const loginError = document.getElementById('login-error');
const messagesContainer = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const logoutBtn = document.getElementById('logout-btn');
const clearBtn = document.getElementById('clear-btn');
const themeToggle = document.getElementById('theme-toggle');

// Initialization
function init() {
  const savedUser = JSON.parse(localStorage.getItem('current_user'));
  if (savedUser) {
    login(savedUser);
  }

  // Theme initialization
  const isDark = localStorage.getItem('dark_mode') === 'true';
  if (isDark) document.body.classList.add('dark');

  loginForm.addEventListener('submit', handleLogin);
  chatForm.addEventListener('submit', handleSendMessage);
  logoutBtn.addEventListener('click', logout);
  clearBtn.addEventListener('click', clearHistory);
  themeToggle.addEventListener('click', toggleTheme);

  // Listen for new messages from Firebase (Real-time!)
  messagesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    let messages = data ? Object.values(data) : [];
    
    if (currentUser) {
      // Filter out messages cleared by this user locally
      const userClearKey = `last_cleared_${currentUser.userId}`;
      lastClearedTimestamp = parseInt(localStorage.getItem(userClearKey)) || 0;
      
      messages = messages.filter(msg => msg.id > lastClearedTimestamp);
      
      renderMessages(messages);
      scrollToBottom();
    }
  });
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('dark_mode', isDark);
}

// Auth Functions
function handleLogin(e) {
  e.preventDefault();
  const userId = e.target.username.value;
  const password = e.target.password.value;

  const user = USERS.find(u => u.userId === userId && u.password === password);

  if (user) {
    login(user);
    loginError.textContent = '';
    e.target.reset();
  } else {
    loginError.textContent = 'Invalid ID or Password';
  }
}

function login(user) {
  currentUser = user;
  localStorage.setItem('current_user', JSON.stringify(user));
  
  // Load user-specific clear timestamp
  const userClearKey = `last_cleared_${user.userId}`;
  lastClearedTimestamp = parseInt(localStorage.getItem(userClearKey)) || 0;
  
  // Update UI
  document.getElementById('current-user-name').textContent = user.userName;
  document.getElementById('current-user-avatar').textContent = user.avatar;
  
  loginScreen.classList.add('hidden');
  chatScreen.classList.remove('hidden');
  
  // Refresh messages to apply filter
  messagesRef.once('value').then(snapshot => {
    const data = snapshot.val();
    let messages = data ? Object.values(data) : [];
    messages = messages.filter(msg => msg.id > lastClearedTimestamp);
    renderMessages(messages);
    scrollToBottom();
  });
}

function logout() {
  currentUser = null;
  localStorage.removeItem('current_user');
  loginScreen.classList.remove('hidden');
  chatScreen.classList.add('hidden');
}

// Chat Functions
function handleSendMessage(e) {
  e.preventDefault();
  const text = messageInput.value.trim();
  
  if (text && currentUser) {
    const newMessage = {
      id: Date.now(),
      senderId: currentUser.userId,
      senderName: currentUser.userName,
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    // Save to Firebase (This syncs to ALL devices)
    messagesRef.push(newMessage);

    messageInput.value = '';
  }
}

function clearHistory() {
  if (currentUser) {
    // Save current time as last cleared for this user
    const now = Date.now();
    const userClearKey = `last_cleared_${currentUser.userId}`;
    localStorage.setItem(userClearKey, now);
    lastClearedTimestamp = now;
    
    // Immediately clear UI
    renderMessages([]);
  }
}

function renderMessages(messages) {
  messagesContainer.innerHTML = '';
  // Sort by ID (timestamp)
  messages.sort((a, b) => a.id - b.id);
  messages.forEach(renderMessage);
}

function renderMessage(msg) {
  const isMine = msg.senderId === currentUser.userId;
  const messageEl = document.createElement('div');
  messageEl.classList.add('message');
  messageEl.classList.add(isMine ? 'mine' : 'other');
  
  messageEl.innerHTML = `
    ${!isMine ? `<span class="message-info">${msg.senderName} • ${msg.timestamp}</span>` : `<span class="message-info" style="text-align: right">${msg.timestamp}</span>`}
    <div class="bubble">${escapeHTML(msg.text)}</div>
  `;
  
  messagesContainer.appendChild(messageEl);
}

function scrollToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Start the app
init();
