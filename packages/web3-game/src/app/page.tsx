'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateRoom = () => {
    const newRoomCode = generateRoomCode();
    router.push(`/game?room=${newRoomCode}`);
  };

  const handleJoinRoom = () => {
    if (roomCode.trim()) {
      router.push(`/game?room=${roomCode.toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">💣</div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Crypto Token Bomb Party
          </h1>
          <p className="text-white/80">
            Fast-paced crypto token typing game!
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleCreateRoom}
            className="w-full px-6 py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors text-lg"
          >
            Create New Game 🎮
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-white/60">or</span>
            </div>
          </div>

          <div>
            <input
              type="text"
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-3 text-center font-mono text-lg"
              maxLength={6}
            />
            <button
              onClick={handleJoinRoom}
              disabled={!roomCode.trim()}
              className="w-full px-6 py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors text-lg"
            >
              Join Game 🚀
            </button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-white font-semibold mb-2 text-center">How to Play:</h3>
          <ul className="text-white/80 text-sm space-y-1">
            <li>• 2-15 players compete</li>
            <li>• 10 seconds per turn to type a crypto token name</li>
            <li>• Each token can only be used once</li>
            <li>• 3 lives per player</li>
            <li>• Last one standing wins! 🏆</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

