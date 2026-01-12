const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store game rooms
const rooms = new Map();

// Fetch crypto tokens from CoinGecko
let cryptoTokens = [];
async function fetchCryptoTokens() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/list');
    cryptoTokens = response.data.map(token => token.name.toLowerCase());
    console.log(`Loaded ${cryptoTokens.length} crypto tokens`);
  } catch (error) {
    console.error('Error fetching crypto tokens:', error.message);
    // Fallback tokens if API fails
    cryptoTokens = ['bitcoin', 'ethereum', 'solana', 'cardano', 'ripple', 'polkadot', 'dogecoin', 'avalanche', 'polygon', 'chainlink'];
  }
}

// Initialize tokens on startup
fetchCryptoTokens();
// Refresh tokens every hour
setInterval(fetchCryptoTokens, 3600000);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create-room', (callback) => {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    rooms.set(roomCode, {
      players: [],
      gameState: 'lobby',
      usedTokens: [],
      currentPlayerIndex: 0
    });
    callback({ roomCode });
  });

  socket.on('join-room', ({ roomCode, playerName }, callback) => {
    const room = rooms.get(roomCode);
    
    if (!room) {
      callback({ success: false, error: 'Room not found' });
      return;
    }

    if (room.players.length >= 15) {
      callback({ success: false, error: 'Room is full' });
      return;
    }

    if (room.gameState !== 'lobby') {
      callback({ success: false, error: 'Game already started' });
      return;
    }

    const player = {
      id: socket.id,
      name: playerName,
      lives: 3,
      isAlive: true
    };

    room.players.push(player);
    socket.join(roomCode);
    
    io.to(roomCode).emit('player-joined', { players: room.players });
    callback({ success: true, players: room.players });
  });

  socket.on('start-game', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || room.players.length < 2) return;

    room.gameState = 'playing';
    room.currentPlayerIndex = 0;
    room.usedTokens = [];
    
    io.to(roomCode).emit('game-started', {
      currentPlayer: room.players[0],
      players: room.players
    });
  });

  socket.on('submit-token', ({ roomCode, token }, callback) => {
    const room = rooms.get(roomCode);
    if (!room) {
      callback({ success: false, error: 'Room not found' });
      return;
    }

    const normalizedToken = token.toLowerCase().trim();
    
    // Check if token is valid and not used
    const isValid = cryptoTokens.includes(normalizedToken);
    const isUsed = room.usedTokens.includes(normalizedToken);

    if (isValid && !isUsed) {
      room.usedTokens.push(normalizedToken);
      callback({ success: true });
      
      // Move to next player
      nextTurn(roomCode);
    } else {
      callback({ success: false, error: isUsed ? 'Token already used' : 'Invalid token' });
      
      // Player loses a life
      const currentPlayer = room.players[room.currentPlayerIndex];
      currentPlayer.lives--;
      
      if (currentPlayer.lives <= 0) {
        currentPlayer.isAlive = false;
      }

      io.to(roomCode).emit('player-failed', {
        player: currentPlayer,
        reason: isUsed ? 'Token already used' : 'Invalid token'
      });

      // Check for game over
      const alivePlayers = room.players.filter(p => p.isAlive);
      if (alivePlayers.length === 1) {
        room.gameState = 'finished';
        io.to(roomCode).emit('game-over', { winner: alivePlayers[0] });
      } else {
        nextTurn(roomCode);
      }
    }
  });

  socket.on('timeout', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    const currentPlayer = room.players[room.currentPlayerIndex];
    currentPlayer.lives--;
    
    if (currentPlayer.lives <= 0) {
      currentPlayer.isAlive = false;
    }

    io.to(roomCode).emit('player-failed', {
      player: currentPlayer,
      reason: 'Time ran out'
    });

    // Check for game over
    const alivePlayers = room.players.filter(p => p.isAlive);
    if (alivePlayers.length === 1) {
      room.gameState = 'finished';
      io.to(roomCode).emit('game-over', { winner: alivePlayers[0] });
    } else {
      nextTurn(roomCode);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove player from all rooms
    rooms.forEach((room, roomCode) => {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        io.to(roomCode).emit('player-left', { players: room.players });
        
        // Clean up empty rooms
        if (room.players.length === 0) {
          rooms.delete(roomCode);
        }
      }
    });
  });
});

function nextTurn(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;

  // Find next alive player
  let nextIndex = (room.currentPlayerIndex + 1) % room.players.length;
  let attempts = 0;
  
  while (!room.players[nextIndex].isAlive && attempts < room.players.length) {
    nextIndex = (nextIndex + 1) % room.players.length;
    attempts++;
  }

  room.currentPlayerIndex = nextIndex;
  
  io.to(roomCode).emit('next-turn', {
    currentPlayer: room.players[nextIndex],
    players: room.players
  });
}

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

