// Predefined Users
const USERS = [
  { userId: 'fbwoals', userName: '류재민', password: '0421', avatar: 'JM' },
  { userId: 'rlaalsrud', userName: '김민경', password: '0423', avatar: 'MK' }
];

// State
let currentUser = null;
let messages = JSON.parse(localStorage.getItem('chat_messages')) || [];

// Real-time Communication Channel
const chatChannel = new BroadcastChannel('game_chat_room');

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

// Initialization
function init() {
  const savedUser = JSON.parse(localStorage.getItem('current_user'));
  if (savedUser) {
    login(savedUser);
  }

  loginForm.addEventListener('submit', handleLogin);
  chatForm.addEventListener('submit', handleSendMessage);
  logoutBtn.addEventListener('click', logout);
  clearBtn.addEventListener('click', clearHistory);

  // Listen for messages from other tabs
  chatChannel.onmessage = (event) => {
    if (event.data.type === 'NEW_MESSAGE') {
      const msg = event.data.payload;
      // Sync local array and storage
      messages = JSON.parse(localStorage.getItem('chat_messages')) || [];
      if (!messages.find(m => m.id === msg.id)) {
        messages.push(msg);
        localStorage.setItem('chat_messages', JSON.stringify(messages));
      }
      
      if (currentUser) {
        renderMessages(); // Re-render all to stay in sync
        scrollToBottom();
      }
    } else if (event.data.type === 'CLEAR_HISTORY') {
      messages = [];
      localStorage.setItem('chat_messages', JSON.stringify(messages));
      renderMessages();
    }
  };
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
    
    renderMessages();
    
    // Broadcast to other tabs
    chatChannel.postMessage({
      type: 'NEW_MESSAGE',
      payload: newMessage
    });

    messageInput.value = '';
    scrollToBottom();
  }
}

function clearHistory() {
  if (confirm('모든 채팅 내역을 삭제하시겠습니까?')) {
    messages = [];
    localStorage.setItem('chat_messages', JSON.stringify(messages));
    renderMessages();
    
    // Broadcast clear action
    chatChannel.postMessage({ type: 'CLEAR_HISTORY' });
  }
}

function renderMessages() {
  messagesContainer.innerHTML = '';
  // Sort messages by timestamp just in case
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
