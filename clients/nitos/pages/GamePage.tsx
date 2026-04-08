'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Game constants
const LANE_COUNT = 4;
const GAME_WIDTH = 800;
const GAME_HEIGHT_DESKTOP = 480;
const GAME_HEIGHT_MOBILE = 600; // Taller on mobile
const DAMIAN_START_X = GAME_WIDTH - 100;
const CUSTOMER_START_X = -60;
const EMPANADA_SPEED = 6;
const BASE_CUSTOMER_SPEED = 1.2;
const DAMIAN_MOVE_SPEED = 60; // Left/right movement speed (2x faster!)
const TIP_VALUES = [5, 10, 15, 20, 25]; // Random tip amounts
const TIP_EMOJIS = ['💰', '💵'];

// Lane Y positions as percentages (matching the wooden steps in the background)
const LANE_Y_POSITIONS = [42, 55, 68, 81]; // % from top for each lane

// Types
interface Customer {
  id: number;
  lane: number;
  x: number;
  speed: number;
  emoji: string;
  state: 'walking' | 'satisfied';
  points: number;
  droppedTip: boolean;
}

interface Empanada {
  id: number;
  lane: number;
  x: number;
  image: string;
}

interface Tip {
  id: number;
  lane: number;
  x: number;
  value: number;
  emoji: string;
  createdAt: number; // timestamp for expiration
}

const TIP_LIFETIME = 5000; // Tips vanish after 5 seconds

interface FloatingScore {
  id: number;
  x: number;
  y: number;
  value: number;
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

function getRandomTip() {
  return {
    value: TIP_VALUES[Math.floor(Math.random() * TIP_VALUES.length)],
    emoji: TIP_EMOJIS[Math.floor(Math.random() * TIP_EMOJIS.length)],
  };
}

export function GamePage() {
  // Detect mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const GAME_HEIGHT = isMobile ? GAME_HEIGHT_MOBILE : GAME_HEIGHT_DESKTOP;

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
  const [damianX, setDamianX] = useState(DAMIAN_START_X); // Damian can now move left/right
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [empanadas, setEmpanadas] = useState<Empanada[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);

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
    setDamianX(DAMIAN_START_X);
    setCustomers([]);
    setEmpanadas([]);
    setTips([]);
    setFloatingScores([]);
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
    const maxPerLane = level;
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
      droppedTip: false,
    };

    return newCustomer;
  }, [level, getCustomersInLane]);

  // Throw empanada
  const throwEmpanada = useCallback(() => {
    if (gameState !== 'playing') return;

    // Damian can only throw when he's at the serving position (right side)
    if (damianX < DAMIAN_START_X - 50) return;

    const newEmpanada: Empanada = {
      id: idCounterRef.current++,
      lane: damianLane,
      x: damianX - 60,
      image: getRandomEmpanada(),
    };

    setEmpanadas(prev => [...prev, newEmpanada]);
  }, [gameState, damianLane, damianX]);

  // Move Damian up/down (lanes)
  const moveDamianVertical = useCallback((direction: 'up' | 'down') => {
    if (gameState !== 'playing') return;

    setDamianLane(prev => {
      if (direction === 'up' && prev > 0) return prev - 1;
      if (direction === 'down' && prev < LANE_COUNT - 1) return prev + 1;
      return prev;
    });
  }, [gameState]);

  // Move Damian left/right (to collect tips)
  const moveDamianHorizontal = useCallback((direction: 'left' | 'right') => {
    if (gameState !== 'playing') return;

    setDamianX(prev => {
      if (direction === 'left') return Math.max(100, prev - DAMIAN_MOVE_SPEED);
      if (direction === 'right') return Math.min(GAME_WIDTH - 50, prev + DAMIAN_MOVE_SPEED);
      return prev;
    });
  }, [gameState]);

  // Submit score (placeholder for Supabase)
  const submitScore = useCallback(() => {
    if (!playerName.trim()) return;
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
        moveDamianVertical('up');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        moveDamianVertical('down');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        moveDamianHorizontal('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        moveDamianHorizontal('right');
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
  }, [moveDamianVertical, moveDamianHorizontal, throwEmpanada, gameState]);

  // Refs to track current state for game loop
  const customersRef = useRef<Customer[]>([]);
  const empanadasRef = useRef<Empanada[]>([]);
  const tipsRef = useRef<Tip[]>([]);
  const damianXRef = useRef(DAMIAN_START_X);
  const damianLaneRef = useRef(1);

  // Keep refs in sync with state
  useEffect(() => { customersRef.current = customers; }, [customers]);
  useEffect(() => { empanadasRef.current = empanadas; }, [empanadas]);
  useEffect(() => { tipsRef.current = tips; }, [tips]);
  useEffect(() => { damianXRef.current = damianX; }, [damianX]);
  useEffect(() => { damianLaneRef.current = damianLane; }, [damianLane]);

  // Main game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      const now = Date.now();
      const currentCustomers = customersRef.current;
      const currentEmpanadas = empanadasRef.current;
      const currentTips = tipsRef.current;
      const currentDamianX = damianXRef.current;
      const currentDamianLane = damianLaneRef.current;

      // Spawn customers
      const spawnInterval = Math.max(2000 - level * 150, 800);
      if (now - lastSpawnRef.current > spawnInterval) {
        const newCustomer = spawnCustomer(currentCustomers);
        if (newCustomer) {
          lastSpawnRef.current = now;
          setCustomers(prev => [...prev, newCustomer]);
        }
      }

      // Track collisions
      const hitCustomerIds = new Set<number>();
      const empanadasToRemove = new Set<number>();
      const tipsToRemove = new Set<number>();
      let missedEmpanadas = 0;

      // Check empanada collisions
      for (const emp of currentEmpanadas) {
        const newEmpX = emp.x - EMPANADA_SPEED;

        // Check if empanada flew off left edge (MISSED!)
        if (newEmpX <= -80) {
          empanadasToRemove.add(emp.id);
          missedEmpanadas++;
          continue;
        }

        // Find walking customers in this lane
        const walkingInLane = currentCustomers
          .filter(c => c.lane === emp.lane && c.state === 'walking' && !hitCustomerIds.has(c.id))
          .sort((a, b) => b.x - a.x);

        for (const customer of walkingInLane) {
          if (newEmpX <= customer.x + 50) {
            hitCustomerIds.add(customer.id);
            empanadasToRemove.add(emp.id);

            setScore(s => s + customer.points);
            setCustomersServed(cs => {
              const newCount = cs + 1;
              if (newCount % 10 === 0) {
                setLevel(l => l + 1);
              }
              return newCount;
            });

            break;
          }
        }
      }

      // Penalize missed empanadas
      if (missedEmpanadas > 0) {
        setLives(l => Math.max(0, l - missedEmpanadas));
      }

      // Check tip collection (Damian picks up tips)
      for (const tip of currentTips) {
        if (tip.lane === currentDamianLane && Math.abs(tip.x - currentDamianX) < 60) {
          tipsToRemove.add(tip.id);
          setScore(s => s + tip.value);

          // Add floating score animation
          const floatingId = idCounterRef.current++;
          setFloatingScores(prev => [...prev, {
            id: floatingId,
            x: tip.x,
            y: LANE_Y_POSITIONS[tip.lane], // Store as percentage
            value: tip.value,
          }]);

          // Remove floating score after animation
          setTimeout(() => {
            setFloatingScores(prev => prev.filter(f => f.id !== floatingId));
          }, 1000);
        }
      }

      // Update customers
      setCustomers(prev => {
        const updated: Customer[] = [];
        let livesLost = 0;
        const newTips: Tip[] = [];

        for (const customer of prev) {
          if (hitCustomerIds.has(customer.id)) {
            updated.push({ ...customer, state: 'satisfied' });
            continue;
          }

          if (customer.state === 'walking') {
            const newX = customer.x + customer.speed;

            if (newX >= DAMIAN_START_X - 80) {
              livesLost++;
              continue;
            }

            updated.push({ ...customer, x: newX });
          } else if (customer.state === 'satisfied') {
            const newX = customer.x - 4;

            // Drop a tip randomly as they walk back (~25% of customers drop a tip)
            if (!customer.droppedTip && Math.random() < 0.005) {
              const tipData = getRandomTip();
              newTips.push({
                id: idCounterRef.current++,
                lane: customer.lane,
                x: customer.x,
                value: tipData.value,
                emoji: tipData.emoji,
                createdAt: Date.now(),
              });
              customer.droppedTip = true;
            }

            if (newX > -100) {
              updated.push({ ...customer, x: newX, droppedTip: customer.droppedTip });
            }
          }
        }

        if (livesLost > 0) {
          setLives(l => Math.max(0, l - livesLost));
        }

        // Add new tips
        if (newTips.length > 0) {
          setTips(t => [...t, ...newTips]);
        }

        return updated;
      });

      // Update empanadas
      setEmpanadas(prev => {
        const updated: Empanada[] = [];
        for (const emp of prev) {
          if (empanadasToRemove.has(emp.id)) continue;
          const newX = emp.x - EMPANADA_SPEED;
          if (newX > -80) {
            updated.push({ ...emp, x: newX });
          }
        }
        return updated;
      });

      // Update tips (remove collected ones and expired ones)
      const currentTime = Date.now();
      setTips(prev => prev.filter(tip =>
        !tipsToRemove.has(tip.id) && (currentTime - tip.createdAt) < TIP_LIFETIME
      ));

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
              <li>⬆️⬇️ Move between lanes (W/S or ↑↓)</li>
              <li>⬅️➡️ Move left/right to collect tips (A/D or ←→)</li>
              <li>🥟 Throw empanadas (Spacebar or Tap)</li>
              <li>💰 Collect tips from happy customers!</li>
              <li>😤 Don't let hangry customers reach you!</li>
              <li>🎯 Don't miss! Wasted empanadas cost lives!</li>
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

      {/* Game Area - Taller on mobile */}
      <div
        className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-[#4a3728]"
        style={{
          width: '100%',
          maxWidth: GAME_WIDTH,
          height: 'auto',
          aspectRatio: `${GAME_WIDTH}/${GAME_HEIGHT}`,
        }}
      >
        {/* Custom game board background */}
        <Image
          src="/nitos-game-board.jpg"
          alt="Game Board"
          fill
          className="object-cover"
          priority
        />

        {/* Tips */}
        <AnimatePresence>
          {tips.map(tip => {
            // Calculate opacity based on age (fade out in last 2 seconds)
            const age = Date.now() - tip.createdAt;
            const fadeStartTime = TIP_LIFETIME - 2000; // Start fading 2 seconds before expiry
            const opacity = age > fadeStartTime
              ? Math.max(0.3, 1 - (age - fadeStartTime) / 2000)
              : 1;

            return (
              <motion.div
                key={tip.id}
                className="absolute text-3xl md:text-4xl select-none"
                style={{
                  left: `${(tip.x / GAME_WIDTH) * 100}%`,
                  top: `${LANE_Y_POSITIONS[tip.lane]}%`,
                  transform: 'translate(-50%, -50%)',
                  opacity,
                }}
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                {tip.emoji}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Floating Score Animations */}
        <AnimatePresence>
          {floatingScores.map(fs => (
            <motion.div
              key={fs.id}
              className="absolute text-2xl md:text-3xl font-bold text-[#C4A052] select-none pointer-events-none"
              style={{
                left: `${(fs.x / GAME_WIDTH) * 100}%`,
                top: `${fs.y}%`,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 0, y: -120, scale: 1.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              +{fs.value}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Customers */}
        <AnimatePresence>
          {customers.map(customer => (
            <motion.div
              key={customer.id}
              className="absolute flex items-center justify-center text-4xl md:text-5xl select-none"
              style={{
                left: `${(customer.x / GAME_WIDTH) * 100}%`,
                top: `${LANE_Y_POSITIONS[customer.lane]}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              {customer.state === 'walking' && customer.emoji}
              {customer.state === 'satisfied' && '😋'}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empanadas */}
        <AnimatePresence>
          {empanadas.map(emp => (
            <motion.div
              key={emp.id}
              className="absolute"
              style={{
                width: 70,
                height: 70,
                left: `${(emp.x / GAME_WIDTH) * 100}%`,
                top: `${LANE_Y_POSITIONS[emp.lane]}%`,
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
              <Image src={emp.image} alt="Empanada" fill className="object-contain drop-shadow-lg" />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Damian - now moves left/right too */}
        <motion.div
          className="absolute"
          style={{ width: 80, height: 140 }}
          animate={{
            left: `${(damianX / GAME_WIDTH) * 100}%`,
            top: `${LANE_Y_POSITIONS[damianLane]}%`,
            x: '-50%',
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
      </div>

      {/* Mobile Controls - D-pad with SVG arrows */}
      <div className="w-full max-w-[800px] flex justify-between items-center mt-4 px-4 md:hidden">
        {/* D-pad style controls */}
        <div className="flex flex-col items-center gap-2">
          <motion.button
            onClick={() => moveDamianVertical('up')}
            className="bg-[#2D5A3D] text-white w-16 h-16 rounded-2xl shadow-lg active:bg-[#1a3a24] flex items-center justify-center border-2 border-[#C4A052]/30"
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4l-8 8h5v8h6v-8h5z" />
            </svg>
          </motion.button>
          <div className="flex gap-2">
            <motion.button
              onClick={() => moveDamianHorizontal('left')}
              className="bg-[#2D5A3D] text-white w-16 h-16 rounded-2xl shadow-lg active:bg-[#1a3a24] flex items-center justify-center border-2 border-[#C4A052]/30"
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 12l8-8v5h8v6h-8v5z" />
              </svg>
            </motion.button>
            <div className="w-16 h-16" /> {/* Spacer */}
            <motion.button
              onClick={() => moveDamianHorizontal('right')}
              className="bg-[#2D5A3D] text-white w-16 h-16 rounded-2xl shadow-lg active:bg-[#1a3a24] flex items-center justify-center border-2 border-[#C4A052]/30"
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 12l-8 8v-5H4v-6h8V4z" />
              </svg>
            </motion.button>
          </div>
          <motion.button
            onClick={() => moveDamianVertical('down')}
            className="bg-[#2D5A3D] text-white w-16 h-16 rounded-2xl shadow-lg active:bg-[#1a3a24] flex items-center justify-center border-2 border-[#C4A052]/30"
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 20l8-8h-5V4h-6v8H4z" />
            </svg>
          </motion.button>
        </div>

        <motion.button
          onClick={throwEmpanada}
          className="bg-[#C4A052] w-24 h-24 rounded-full shadow-lg active:bg-[#d4b062] flex items-center justify-center border-4 border-[#2D5A3D]/20"
          whileTap={{ scale: 0.9 }}
        >
          <span className="text-5xl">🥟</span>
        </motion.button>
      </div>

      {/* Desktop instructions */}
      <div className="hidden md:block text-white/60 text-sm mt-4">
        ↑↓ or W/S = lanes • ←→ or A/D = move • SPACE = throw
      </div>
    </div>
  );
}
