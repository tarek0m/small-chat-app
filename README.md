# Small Chat App

A real-time chat application built with Express.js and Socket.IO that allows users to create and join chat rooms, send messages, and see other active users.

## Features

- **Real-time messaging**: Instant message delivery using Socket.IO
- **Chat rooms**: Create and join different chat rooms
- **User activity**: Shows when users are typing
- **User management**: Tracks users joining and leaving rooms
- **Active room tracking**: Displays all currently active chat rooms

## Technologies Used

- **Backend**: Node.js with Express.js
- **Real-time Communication**: Socket.IO
- **Frontend**: HTML, CSS, and vanilla JavaScript

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## Usage

### Development Mode

To run the application in development mode with automatic reloading:

```bash
npm run dev
```

### Production Mode

To run the application in production mode:

```bash
npm start
```

The application will be available at `http://localhost:8000`

## How to Use

1. Open the application in your browser
2. Enter your name and a chat room name
3. Click "Join" to enter the chat room
4. Type messages in the input field and click "Send" to share them
5. See other users in the room and active rooms at the bottom of the chat
6. When someone is typing, you'll see a notification

## Project Structure

- `index.js`: Main server file with Socket.IO and Express configuration
- `public/`: Frontend files
  - `index.html`: Main HTML structure
  - `style.css`: Styling for the chat interface
  - `app.js`: Frontend JavaScript handling the Socket.IO events
