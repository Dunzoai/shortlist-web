'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Game constants
const LANE_COUNT = 4;
const GAME_WIDTH = 800;
const GAME_HEIGHT = 480;
const LANE_HEIGHT = GAME_HEIGHT / LANE_COUNT;
const DAMIAN_X = GAME_WIDTH - 100;
const CUSTOMER_START_X = -60;
const EMPANADA_SPEED = 6; // Slower so you can see them fly
const BASE_CUSTOMER_SPEED = 1.2;

// Types
interface Customer {
  id: number;
  lane: number;
  x: number;
  speed: number;
  emoji: string;
  state: 'walking' | 'satisfied';
  points: number;
}

interface Empanada {
  id: number;
  lane: number;
  x: number;
  image: string;
}

type GameState = 'start' | 'playing' | 'gameover';

// Expanded customer emoji list
const customerEmojis = [
  '👨', '👩', '👴', '👧', '👶', '🧑', '👱', '👨‍🦰', '👩‍🦰', '👨‍🦱', '👩‍🦱', '👨‍🦳', '👩‍🦳',
  '👮', '👷', '💂', '🕵️', '👨‍🍳', '👨‍🎤', '👸', '🤴',
  '🎅', '🤶', '🧛', '🧟', '🧙', '🦸', '🦹', '👻', '🤡', '🥷',
  '👨🏻', '👨🏼', '👨🏽', '👨🏾', '👨🏿', '👩🏻', '👩🏼', '👩🏽', '👩🏾', '👩🏿'
];

const empanadaImages = ['/empanada.png', '/sweet-empanada.png', '/street-corn-empanada.png'];

function getRandomEmoji() {
  return customerEmojis[Math.floor(Math.random() * customerEmojis.length)];
}

function getRandomEmpanada() {
  return empanadaImages[Math.floor(Math.random() * empanadaImages.length)];
}

export function GamePage() {
  // Game state
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [customersServed, setCustomersServed] = useState(0);

  // Leaderboard state
  const [playerName, setPlayerName] = useState('');

  // Entity states
  const [damianLane, setDamianLane] = useState(1);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [empanadas, setEmpanadas] = useState<Empanada[]>([]);

  // Refs for game loop
  const gameLoopRef = useRef<number | null>(null);
  const lastSpawnRef = useRef(0);
  const idCounterRef = useRef(0);
  const keysPressed = useRef<Set<string>>(new Set());

  // Start game
  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setLevel(1);
    setCustomersServed(0);
    setDamianLane(1);
    setCustomers([]);
    setEmpanadas([]);
    setPlayerName('');
    lastSpawnRef.current = Date.now();
    idCounterRef.current = 0;
  }, []);

  // Count customers in a lane
  const getCustomersInLane = useCallback((lane: number, customerList: Customer[]) => {
    return customerList.filter(c => c.lane === lane && c.state === 'walking').length;
  }, []);

  // Spawn customer with level-based lane limits
  const spawnCustomer = useCallback((currentCustomers: Customer[]) => {
    // Find lanes that have room (based on level)
    const maxPerLane = level; // Level 1 = 1 per lane, Level 2 = 2 per lane, etc.
    const availableLanes = [];

    for (let i = 0; i < LANE_COUNT; i++) {
      if (getCustomersInLane(i, currentCustomers) < maxPerLane) {
        availableLanes.push(i);
      }
    }

    if (availableLanes.length === 0) return null;

    const lane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
    const speedMultiplier = 1 + (level - 1) * 0.12;
    const speed = BASE_CUSTOMER_SPEED * speedMultiplier * (0.8 + Math.random() * 0.4);
    const points = Math.round(10 + speed * 5);

    const newCustomer: Customer = {
      id: idCounterRef.current++,
      lane,
      x: CUSTOMER_START_X,
      speed,
      emoji: getRandomEmoji(),
      state: 'walking',
      points,
    };

    return newCustomer;
  }, [level, getCustomersInLane]);

  // Throw empanada
  const throwEmpanada = useCallback(() => {
    if (gameState !== 'playing') return;

    const newEmpanada: Empanada = {
      id: idCounterRef.current++,
      lane: damianLane,
      x: DAMIAN_X - 60,
      image: getRandomEmpanada(),
    };

    setEmpanadas(prev => [...prev, newEmpanada]);
  }, [gameState, damianLane]);

  // Move Damian
  const moveDamian = useCallback((direction: 'up' | 'down') => {
    if (gameState !== 'playing') return;

    setDamianLane(prev => {
      if (direction === 'up' && prev > 0) return prev - 1;
      if (direction === 'down' && prev < LANE_COUNT - 1) return prev + 1;
      return prev;
    });
  }, [gameState]);

  // Submit score (placeholder for Supabase)
  const submitScore = useCallback(() => {
    if (!playerName.trim()) return;
    // TODO: Wire up Supabase leaderboard
    console.log('Submitting score:', { name: playerName, score, level, customersServed });
    alert(`Score submitted! ${playerName}: ${score} points`);
  }, [playerName, score, level, customersServed]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'gameover') return;
      if (keysPressed.current.has(e.key)) return;
      keysPressed.current.add(e.key);

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        moveDamian('up');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        moveDamian('down');
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        throwEmpanada();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [moveDamian, throwEmpanada, gameState]);

  // Refs to track current state for game loop
  const customersRef = useRef<Customer[]>([]);
  const empanadasRef = useRef<Empanada[]>([]);

  // Keep refs in sync with state
  useEffect(() => {
    customersRef.current = customers;
  }, [customers]);

  useEffect(() => {
    empanadasRef.current = empanadas;
  }, [empanadas]);

  // Main game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      const now = Date.now();
      const currentCustomers = customersRef.current;
      const currentEmpanadas = empanadasRef.current;

      // Spawn customers
      const spawnInterval = Math.max(2000 - level * 150, 800);
      if (now - lastSpawnRef.current > spawnInterval) {
        const newCustomer = spawnCustomer(currentCustomers);
        if (newCustomer) {
          lastSpawnRef.current = now;
          setCustomers(prev => [...prev, newCustomer]);
        }
      }

      // Track which customers got hit this frame
      const hitCustomerIds = new Set<number>();
      const empanadasToRemove = new Set<number>();

      // Check empanada collisions FIRST
      for (const emp of currentEmpanadas) {
        const newEmpX = emp.x - EMPANADA_SPEED;

        // Find walking customers in this lane, sorted by x (rightmost first)
        const walkingInLane = currentCustomers
          .filter(c => c.lane === emp.lane && c.state === 'walking' && !hitCustomerIds.has(c.id))
          .sort((a, b) => b.x - a.x);

        for (const customer of walkingInLane) {
          // Check if empanada reached this customer (empanada moving left, customer on left)
          if (newEmpX <= customer.x + 50) {
            // HIT!
            hitCustomerIds.add(customer.id);
            empanadasToRemove.add(emp.id);

            // Update score
            setScore(s => s + customer.points);
            setCustomersServed(cs => {
              const newCount = cs + 1;
              if (newCount % 10 === 0) {
                setLevel(l => l + 1);
              }
              return newCount;
            });

            break; // Only hit the first (rightmost) customer
          }
        }
      }

      // Update customers
      setCustomers(prev => {
        const updated: Customer[] = [];
        let livesLost = 0;

        for (const customer of prev) {
          // Check if this customer was hit
          if (hitCustomerIds.has(customer.id)) {
            // Turn satisfied and start walking back
            updated.push({ ...customer, state: 'satisfied' });
            continue;
          }

          if (customer.state === 'walking') {
            const newX = customer.x + customer.speed;

            // Customer reached Damian - lose a life
            if (newX >= DAMIAN_X - 80) {
              livesLost++;
              continue;
            }

            updated.push({ ...customer, x: newX });
          } else if (customer.state === 'satisfied') {
            // Customer walks backward off screen
            const newX = customer.x - 4;
            if (newX > -100) {
              updated.push({ ...customer, x: newX });
            }
          }
        }

        if (livesLost > 0) {
          setLives(l => Math.max(0, l - livesLost));
        }

        return updated;
      });

      // Update empanadas
      setEmpanadas(prev => {
        const updated: Empanada[] = [];

        for (const emp of prev) {
          // Remove if it hit a customer
          if (empanadasToRemove.has(emp.id)) {
            continue;
          }

          const newX = emp.x - EMPANADA_SPEED;

          // Keep if still on screen
          if (newX > -80) {
            updated.push({ ...emp, x: newX });
          }
        }

        return updated;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, level, spawnCustomer]);

  // Check for game over
  useEffect(() => {
    if (lives <= 0 && gameState === 'playing') {
      setGameState('gameover');
    }
  }, [lives, gameState]);

  // Start Screen
  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-[#D4C5A9] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#2D5A3D] rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl border-4 border-[#C4A052]"
        >
          <div className="relative w-40 h-40 mx-auto mb-6">
            <Image
              src="/nitos-logo.avif"
              alt="Nito's Empanadas"
              fill
              className="object-contain"
            />
          </div>

          <h1
            className="text-3xl md:text-4xl font-bold text-[#C4A052] mb-2"
            style={{ fontFamily: 'var(--font-permanent-marker), cursive' }}
          >
            EMPANADA RUSH
          </h1>

          <p className="text-white text-xl italic mb-6">
            "You want empanadas?"
          </p>

          <div className="bg-[#1a3a24] rounded-xl p-4 mb-6 text-left text-sm">
            <h3 className="text-[#C4A052] font-bold mb-2 text-center">HOW TO PLAY</h3>
            <ul className="text-white/90 space-y-1">
              <li>⬆️⬇️ Move between lanes (Arrow keys or W/S)</li>
              <li>🥟 Throw empanadas (Spacebar or Tap)</li>
              <li>😤 Don't let hangry customers reach you!</li>
              <li>📈 More customers per lane as you level up!</li>
            </ul>
          </div>

          <motion.button
            onClick={startGame}
            className="bg-[#C4A052] hover:bg-[#d4b062] text-[#2D5A3D] font-bold text-2xl px-12 py-4 rounded-full shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            START GAME
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Game Over Screen
  if (gameState === 'gameover') {
    return (
      <div className="min-h-screen bg-[#D4C5A9] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#2D5A3D] rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl border-4 border-[#C4A052]"
        >
          <h1
            className="text-4xl font-bold text-[#C4A052] mb-4"
            style={{ fontFamily: 'var(--font-permanent-marker), cursive' }}
          >
            GAME OVER
          </h1>

          <motion.div
            className="bg-[#1a3a24] rounded-xl p-6 mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <p className="text-white/70 text-sm mb-1">FINAL SCORE</p>
            <p className="text-6xl font-bold text-[#C4A052] mb-4">{score}</p>

            <div className="grid grid-cols-2 gap-4 text-white/80 text-sm">
              <div>
                <p className="text-[#C4A052]">Customers Served</p>
                <p className="text-2xl font-bold">{customersServed}</p>
              </div>
              <div>
                <p className="text-[#C4A052]">Level Reached</p>
                <p className="text-2xl font-bold">{level}</p>
              </div>
            </div>
          </motion.div>

          {/* Leaderboard Entry */}
          <motion.div
            className="bg-[#1a3a24] rounded-xl p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-white text-sm mb-3">Enter your name for the leaderboard:</p>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name"
              maxLength={20}
              className="w-full px-4 py-3 rounded-lg bg-[#2D5A3D] text-white placeholder-white/50 border-2 border-[#C4A052]/50 focus:border-[#C4A052] outline-none text-center text-lg mb-3"
            />
            <motion.button
              onClick={submitScore}
              disabled={!playerName.trim()}
              className="w-full bg-[#C4A052] hover:bg-[#d4b062] disabled:bg-[#C4A052]/50 disabled:cursor-not-allowed text-[#2D5A3D] font-bold text-lg px-6 py-3 rounded-full shadow-lg"
              whileHover={{ scale: playerName.trim() ? 1.02 : 1 }}
              whileTap={{ scale: playerName.trim() ? 0.98 : 1 }}
            >
              SUBMIT SCORE
            </motion.button>
          </motion.div>

          <p className="text-white/70 text-sm mb-6 italic">
            🏆 Top 5 scores each week win prizes at Nito's next event!
          </p>

          <motion.button
            onClick={startGame}
            className="bg-white/20 hover:bg-white/30 text-white font-bold text-xl px-10 py-3 rounded-full shadow-lg border-2 border-white/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            PLAY AGAIN
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Playing Screen
  return (
    <div className="min-h-screen bg-[#8B7355] flex flex-col items-center justify-center p-2 md:p-4">
      {/* HUD */}
      <div className="w-full max-w-[800px] flex justify-between items-center mb-2 px-2">
        <div className="flex gap-2 md:gap-4">
          <div className="bg-[#2D5A3D] px-3 md:px-4 py-2 rounded-lg">
            <span className="text-[#C4A052] font-bold text-sm md:text-base">SCORE: </span>
            <span className="text-white font-bold text-sm md:text-base">{score}</span>
          </div>
          <div className="bg-[#2D5A3D] px-3 md:px-4 py-2 rounded-lg">
            <span className="text-[#C4A052] font-bold text-sm md:text-base">LVL: </span>
            <span className="text-white font-bold text-sm md:text-base">{level}</span>
          </div>
        </div>
        <div className="flex gap-2 md:gap-4 items-center">
          <button className="bg-[#2D5A3D] px-3 py-2 rounded-lg text-[#C4A052] text-xs md:text-sm font-bold hover:bg-[#1a3a24] transition-colors">
            🏆 HIGH SCORES
          </button>
          <div className="bg-[#2D5A3D] px-3 md:px-4 py-2 rounded-lg">
            <span className="text-red-400 text-lg md:text-xl">
              {'❤️'.repeat(lives)}{'🖤'.repeat(3 - lives)}
            </span>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div
        className="relative bg-[#D4C5A9] rounded-xl overflow-hidden shadow-2xl border-4 border-[#4a3728]"
        style={{
          width: '100%',
          maxWidth: GAME_WIDTH,
          height: 'auto',
          aspectRatio: `${GAME_WIDTH}/${GAME_HEIGHT}`,
        }}
      >
        {/* Background truck (subtle) */}
        <div className="absolute right-0 bottom-0 w-48 h-48 opacity-10 pointer-events-none">
          <Image
            src="/nitos-truck.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        {/* Lane backgrounds (counter texture) */}
        {Array.from({ length: LANE_COUNT }).map((_, i) => (
          <div
            key={`lane-bg-${i}`}
            className="absolute w-full"
            style={{
              top: `${i * (100 / LANE_COUNT)}%`,
              height: `${100 / LANE_COUNT}%`,
              background: i % 2 === 0
                ? 'linear-gradient(90deg, #c4a982 0%, #d4b992 50%, #c4a982 100%)'
                : 'linear-gradient(90deg, #b89970 0%, #c8a980 50%, #b89970 100%)',
            }}
          />
        ))}

        {/* Lane dividers */}
        {Array.from({ length: LANE_COUNT - 1 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-[2px] bg-[#8B7355]/40"
            style={{
              top: `${(i + 1) * (100 / LANE_COUNT)}%`,
            }}
          />
        ))}

        {/* Counter edge line */}
        <div
          className="absolute top-0 bottom-0 w-2 bg-[#4a3728]"
          style={{ right: '12%' }}
        />

        {/* Customers */}
        <AnimatePresence>
          {customers.map(customer => (
            <motion.div
              key={customer.id}
              className="absolute flex items-center justify-center text-4xl md:text-5xl select-none"
              style={{
                left: `${(customer.x / GAME_WIDTH) * 100}%`,
                top: `${(customer.lane * LANE_HEIGHT + LANE_HEIGHT / 2) / GAME_HEIGHT * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{ opacity: 0, scale: 0 }}
            >
              {customer.state === 'walking' && customer.emoji}
              {customer.state === 'satisfied' && '😋'}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empanadas - LARGER SIZE */}
        <AnimatePresence>
          {empanadas.map(emp => (
            <motion.div
              key={emp.id}
              className="absolute"
              style={{
                width: 70,
                height: 70,
                left: `${(emp.x / GAME_WIDTH) * 100}%`,
                top: `${(emp.lane * LANE_HEIGHT + LANE_HEIGHT / 2) / GAME_HEIGHT * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 720 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                rotate: { duration: 1, repeat: Infinity, ease: 'linear' },
                scale: { duration: 0.2 }
              }}
            >
              <Image
                src={emp.image}
                alt="Empanada"
                fill
                className="object-contain drop-shadow-lg"
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Damian - properly sized */}
        <motion.div
          className="absolute"
          style={{
            width: 80,
            height: 140,
            right: '1%',
          }}
          animate={{
            top: `${(damianLane * LANE_HEIGHT + LANE_HEIGHT / 2) / GAME_HEIGHT * 100}%`,
            y: '-50%',
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <Image
            src="/damian-sneakers.png"
            alt="Damian"
            fill
            className="object-contain object-bottom drop-shadow-xl"
          />
        </motion.div>

        {/* Lane indicators (which lane Damian is on) */}
        <div
          className="absolute right-0 top-0 bottom-0 w-6 flex flex-col"
          style={{ background: 'rgba(45, 90, 61, 0.2)' }}
        >
          {Array.from({ length: LANE_COUNT }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 flex items-center justify-center transition-colors ${
                i === damianLane ? 'bg-[#C4A052]/40' : ''
              }`}
            >
              {i === damianLane && <span className="text-white text-xs">◄</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Controls */}
      <div className="w-full max-w-[800px] flex justify-between items-center mt-4 px-4 md:hidden">
        <div className="flex flex-col gap-2">
          <motion.button
            onClick={() => moveDamian('up')}
            className="bg-[#2D5A3D] text-white w-16 h-12 rounded-lg text-2xl font-bold shadow-lg active:bg-[#1a3a24]"
            whileTap={{ scale: 0.9 }}
          >
            ▲
          </motion.button>
          <motion.button
            onClick={() => moveDamian('down')}
            className="bg-[#2D5A3D] text-white w-16 h-12 rounded-lg text-2xl font-bold shadow-lg active:bg-[#1a3a24]"
            whileTap={{ scale: 0.9 }}
          >
            ▼
          </motion.button>
        </div>

        <motion.button
          onClick={throwEmpanada}
          className="bg-[#C4A052] text-[#2D5A3D] w-24 h-24 rounded-full text-4xl font-bold shadow-lg active:bg-[#d4b062]"
          whileTap={{ scale: 0.9 }}
        >
          🥟
        </motion.button>
      </div>

      {/* Desktop instructions */}
      <div className="hidden md:block text-white/60 text-sm mt-4">
        ⬆️⬇️ or W/S to move • SPACE to throw
      </div>
    </div>
  );
}
