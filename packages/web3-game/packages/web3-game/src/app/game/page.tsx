'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GameLobby from '@/components/GameLobby';
import GamePlay from '@/components/GamePlay';
import GameOver from '@/components/GameOver';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export type Player = {
  id: string;
  name: string;
  lives: number;
  isActive: boolean;
  isEliminated: boolean;
};

export type GameState = 'lobby' | 'playing' | 'gameover';

export default function GamePage() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState>('lobby');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');
  const [usedTokens, setUsedTokens] = useState<Set<string>>(new Set());
  const [winner, setWinner] = useState<Player | null>(null);

  useEffect(() => {
    // Get room code from URL on client side only
    const params = new URLSearchParams(window.location.search);
    const room = params.get('room');
    
    if (!room) {
      router.push('/');
    } else {
      setRoomCode(room);
    }
  }, [router]);

  const handleStartGame = () => {
    setGameState('playing');
  };

  const handleGameOver = (winningPlayer: Player) => {
    setWinner(winningPlayer);
    setGameState('gameover');
  };

  const handlePlayAgain = () => {
    setPlayers(players.map(p => ({ ...p, lives: 3, isActive: true, isEliminated: false })));
    setUsedTokens(new Set());
    setWinner(null);
    setGameState('lobby');
  };

  const handleLeaveGame = () => {
    router.push('/');
  };

  if (!roomCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading game...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {gameState === 'lobby' && (
        <GameLobby
          roomCode={roomCode}
          players={players}
          setPlayers={setPlayers}
          onStartGame={handleStartGame}
        />
      )}
      {gameState === 'playing' && (
        <GamePlay
          roomCode={roomCode}
          players={players}
          setPlayers={setPlayers}
          currentPlayerId={currentPlayerId}
          setCurrentPlayerId={setCurrentPlayerId}
          usedTokens={usedTokens}
          setUsedTokens={setUsedTokens}
          onGameOver={handleGameOver}
        />
      )}
      {gameState === 'gameover' && winner && (
        <GameOver
          winner={winner}
          onPlayAgain={handlePlayAgain}
          onLeaveGame={handleLeaveGame}
        />
      )}
    </div>
  );
}

