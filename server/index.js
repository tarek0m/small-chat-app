import express from 'express';
import { Server } from 'socket.io';

const PORT = 8000;
const ADMIN = 'Admin';

const app = express();

const expressServer = app.listen(PORT, () =>
  console.log(`listening to port ${PORT}`)
);

app.use(express.static('public'));

const UsersState = {
  users: [],
  setUsers: function (newUsersArray) {
    this.users = newUsersArray;
  },
};

const io = new Server(expressServer);

io.on('connection', (socket) => {
  console.log(`User ${socket.id.substring(0, 5)} connected`);
  socket.emit('messageToRender', buildMsg(ADMIN, 'Welcome to the chat!'));

  socket.on('enterRoom', ({ name, room }) => {
    const prevRoom = getUser(socket.id)?.room;

    if (prevRoom) {
      socket.leave(prevRoom);
      io.to(prevRoom).emit(
        'messageToRender',
        buildMsg(ADMIN, `${name} has left the room`)
      );
    }

    const user = activateUser(socket.id, name, room);

    // Cannot update previous room users list until after the state update in activate user
    if (prevRoom) {
      io.to(prevRoom).emit('userList', {
        users: getUsersInRoom(prevRoom),
      });
    }

    socket.join(user.room);

    socket.emit(
      'messageToRender',
      buildMsg(ADMIN, `You have joined the ${user.room} chat room`)
    );

    socket.broadcast
      .to(user.room)
      .emit('messageToRender', buildMsg(ADMIN, `${user.name} joined the room`));

    io.to(user.room).emit('userList', {
      users: getUsersInRoom(user.room),
    });

    io.emit('roomList', {
      rooms: getAllActiveRooms(),
    });
  });

  socket.on('disconnect', () => {
    const user = getUser(socket.id);
    if (user) {
      console.log(user + ' left');
      userLeavesApp(user.id);

      io.to(user.room).emit(
        'messageToRender',
        buildMsg(ADMIN, `${user.name} has left the room`)
      );

      io.to(user.room).emit('userList', {
        users: getUsersInRoom(user.room),
      });

      io.emit('roomList', {
        rooms: getAllActiveRooms(),
      });
    }
    console.log(`User ${socket.id.substring(0, 5)} disconnected`);
  });

  socket.on('messageFromSocket', ({ name, msg }) => {
    const room = getUser(socket.id)?.room;

    if (room) {
      console.log(`msg from ${name} to ${room}`);
      io.to(room).emit('messageToRender', buildMsg(name, msg));
    }
  });

  socket.on('activityFromSocket', (name) => {
    const room = getUser(socket.id)?.room;
    if (room) {
      socket.broadcast.to(room).emit('activityToRender', name);
    }
  });
});

function buildMsg(name, text) {
  return {
    name,
    text,
    time: new Intl.DateTimeFormat('default', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).format(new Date()),
  };
}

function activateUser(id, name, room) {
  const user = { id, name, room };
  UsersState.setUsers([
    ...UsersState.users.filter((user) => user.id !== id),
    user,
  ]);
  return user;
}

function userLeavesApp(id) {
  UsersState.setUsers(UsersState.users.filter((user) => user.id !== id));
}

function getUser(id) {
  return UsersState.users.find((user) => user.id === id);
}

function getUsersInRoom(room) {
  return UsersState.users.filter((user) => user.room === room);
}

function getAllActiveRooms() {
  return Array.from(new Set(UsersState.users.map((user) => user.room)));
}
