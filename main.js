// Predefined Users
const USERS = [
  { userId: 'fbwoals', userName: '류재민', password: '0421', avatar: 'JM' },
  { userId: 'rlaalsrud', userName: '김민경', password: '0423', avatar: 'MK' }
];

// State
let currentUser = null;
let messages = JSON.parse(localStorage.getItem('chat_messages')) || [];

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const loginForm = document.getElementById('login-form');
const chatForm = document.getElementById('chat-form');
const loginError = document.getElementById('login-error');
const messagesContainer = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const logoutBtn = document.getElementById('logout-btn');

// Initialization
function init() {
  const savedUser = JSON.parse(localStorage.getItem('current_user'));
  if (savedUser) {
    login(savedUser);
  }

  loginForm.addEventListener('submit', handleLogin);
  chatForm.addEventListener('submit', handleSendMessage);
  logoutBtn.addEventListener('click', logout);
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
  
  // Update UI
  document.getElementById('current-user-name').textContent = user.userName;
  document.getElementById('current-user-avatar').textContent = user.avatar;
  
  loginScreen.classList.add('hidden');
  chatScreen.classList.remove('hidden');
  
  renderMessages();
  scrollToBottom();
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
    
    messages.push(newMessage);
    localStorage.setItem('chat_messages', JSON.stringify(messages));
    
    renderMessage(newMessage);
    messageInput.value = '';
    scrollToBottom();

    // Mock response for demo purposes (optional)
    // if (messages.length % 3 === 0) simulateResponse();
  }
}

function renderMessages() {
  messagesContainer.innerHTML = '';
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
