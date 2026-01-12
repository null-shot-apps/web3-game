'use client';

import { useState } from 'react';
import { Player } from '@/app/game/page';

type GameLobbyProps = {
  roomCode: string;
  players: Player[];
  setPlayers: (players: Player[]) => void;
  onStartGame: () => void;
};

export default function GameLobby({ roomCode, players, setPlayers, onStartGame }: GameLobbyProps) {
  const [playerName, setPlayerName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [, setPlayerId] = useState('');

  const handleJoinGame = () => {
    if (playerName.trim() && players.length < 15) {
      const newPlayer: Player = {
        id: Math.random().toString(36).substring(7),
        name: playerName.trim(),
        lives: 3,
        isActive: true,
        isEliminated: false,
      };
      setPlayers([...players, newPlayer]);
      setPlayerId(newPlayer.id);
      setHasJoined(true);
    }
  };

  const canStartGame = players.length >= 2;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full shadow-2xl border border-white/20">
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          💣 Crypto Token Bomb Party
        </h1>
        <p className="text-white/80 text-center mb-6">Room Code: <span className="font-mono font-bold text-yellow-300">{roomCode}</span></p>

        {!hasJoined ? (
          <div className="mb-8">
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoinGame()}
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-4"
              maxLength={20}
            />
            <button
              onClick={handleJoinGame}
              disabled={!playerName.trim() || players.length >= 15}
              className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
            >
              Join Game ({players.length}/15)
            </button>
          </div>
        ) : (
          <div className="mb-8 text-center">
            <p className="text-green-400 font-semibold mb-4">✓ You&apos;ve joined as {playerName}</p>
            {players.length < 2 && (
              <p className="text-white/70 text-sm">Waiting for more players... (minimum 2 players)</p>
            )}
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Players in Lobby:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {players.map((player) => (
              <div
                key={player.id}
                className="bg-white/10 rounded-lg p-3 border border-white/20"
              >
                <p className="text-white font-medium">{player.name}</p>
                <p className="text-white/60 text-sm">❤️ {player.lives} lives</p>
              </div>
            ))}
          </div>
        </div>

        {hasJoined && canStartGame && (
          <button
            onClick={onStartGame}
            className="w-full px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors text-lg"
          >
            Start Game 🚀
          </button>
        )}

        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-white font-semibold mb-2">How to Play:</h3>
          <ul className="text-white/80 text-sm space-y-1">
            <li>• Each player has 10 seconds to type a valid crypto token name</li>
            <li>• Type the full token name (e.g., &quot;Bitcoin&quot;, not &quot;BTC&quot;)</li>
            <li>• Each token can only be used once per game</li>
            <li>• Fail to answer in time? Lose a life! ❤️</li>
            <li>• Last player standing wins! 🏆</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


