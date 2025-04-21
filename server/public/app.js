const socket = io('http://127.0.0.1:8000');

const formJoin = document.querySelector('.form-join');
const nameInput = document.querySelector('#name');
const chatRoom = document.querySelector('#room');

const chatDisplay = document.querySelector('.chat-display');

const userList = document.querySelector('.user-list');

const roomList = document.querySelector('.room-list');

const activity = document.querySelector('.activity');

const formMsg = document.querySelector('.form-msg');
const msgInput = document.querySelector('#message');

function sendMessage(e) {
  e.preventDefault();
  nameInput.value;
  if (nameInput.value && msgInput.value) {
    socket.emit('messageFromSocket', {
      name: nameInput.value,
      msg: msgInput.value,
    });
    msgInput.value = '';
  }
  msgInput.focus();
}

function enterRoom(e) {
  e.preventDefault();
  if (nameInput.value && chatRoom.value) {
    socket.emit('enterRoom', {
      name: nameInput.value,
      room: chatRoom.value,
    });
  }
}

function renderMessage({ name, text, time }) {
  activity.textContent = '';
  const li = document.createElement('li');
  li.className = 'post';
  if (name === nameInput.value) li.className = 'post post--left';
  if (name !== nameInput.value && name !== 'Admin')
    li.className = 'post post--right';
  if (name !== 'Admin') {
    li.innerHTML = `<div class="post__header ${
      name === nameInput.value ? 'post__header--user' : 'post__header--reply'
    }">
        <span class="post__header--name">${name}</span> 
        <span class="post__header--time">${time}</span> 
        </div>
        <div class="post__text">${text}</div>`;
  } else {
    li.innerHTML = `<div class="post__text">${text}</div>`;
  }
  chatDisplay.appendChild(li);

  chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

function renderUserList({ users }) {
  userList.textContent = '';
  if (users) {
    userList.innerHTML = `<em>Users in ${chatRoom.value}:</em>`;
    users.forEach((user, i) => {
      userList.innerHTML += ` ${user.name}`;
      if (users.length > 1 && i !== users.length - 1) {
        userList.innerHTML += `,`;
      }
    });
  }
}

function renderRoomList({ rooms }) {
  roomList.textContent = '';
  if (rooms) {
    roomList.innerHTML = `<em>Active Rooms:</em>`;
    rooms.forEach((room, i) => {
      roomList.innerHTML += ` ${room}`;
      if (rooms.length > 1 && i !== rooms.length - 1) {
        roomList.innerHTML += `,`;
      }
    });
  }
}

function renderActivity(name) {
  activity.textContent = `${name} is typing...`;
  setTimeout(() => {
    activity.innerHTML = '';
  }, 1000);
}

formJoin.addEventListener('submit', enterRoom);

formMsg.addEventListener('submit', sendMessage);

msgInput.addEventListener('keypress', () => {
  socket.emit('activityFromSocket', nameInput.value);
});

socket.on('messageToRender', renderMessage);
socket.on('userList', renderUserList);
socket.on('roomList', renderRoomList);
socket.on('activityToRender', renderActivity);
