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
const EMPANADA_SPEED = 12;
const PLATE_SPEED = 8;
const BASE_CUSTOMER_SPEED = 1.5;

// Types
interface Customer {
  id: number;
  lane: number;
  x: number;
  speed: number;
  emoji: string;
  state: 'walking' | 'eating' | 'satisfied';
  points: number;
}

interface Empanada {
  id: number;
  lane: number;
  x: number;
  image: string;
}

interface Plate {
  id: number;
  lane: number;
  x: number;
}

type GameState = 'start' | 'playing' | 'gameover';

const customerEmojis = ['👨', '👩', '👴', '👧', '🧑', '👨‍🦱', '👩‍🦰', '🧔'];
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

  // Entity states
  const [damianLane, setDamianLane] = useState(1);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [empanadas, setEmpanadas] = useState<Empanada[]>([]);
  const [plates, setPlates] = useState<Plate[]>([]);

  // Refs for game loop
  const gameLoopRef = useRef<number>();
  const lastSpawnRef = useRef(0);
  const idCounterRef = useRef(0);
  const keysPressed = useRef<Set<string>>(new Set());

  // Get reward based on score
  const getReward = useCallback(() => {
    if (score >= 500) return { text: "FREE MEAL!", color: "text-yellow-400", icon: "🎉" };
    if (score >= 250) return { text: "FREE EMPANADA!", color: "text-green-400", icon: "🥟" };
    if (score >= 100) return { text: "10% OFF YOUR ORDER!", color: "text-blue-400", icon: "🎫" };
    return { text: "Keep practicing!", color: "text-gray-400", icon: "💪" };
  }, [score]);

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
    setPlates([]);
    lastSpawnRef.current = Date.now();
    idCounterRef.current = 0;
  }, []);

  // Spawn customer
  const spawnCustomer = useCallback(() => {
    const lane = Math.floor(Math.random() * LANE_COUNT);
    const speedMultiplier = 1 + (level - 1) * 0.15;
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

    setCustomers(prev => [...prev, newCustomer]);
  }, [level]);

  // Throw empanada
  const throwEmpanada = useCallback(() => {
    if (gameState !== 'playing') return;

    const newEmpanada: Empanada = {
      id: idCounterRef.current++,
      lane: damianLane,
      x: DAMIAN_X - 50,
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

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [moveDamian, throwEmpanada]);

  // Main game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      const now = Date.now();

      // Spawn customers
      const spawnInterval = Math.max(1500 - level * 100, 800);
      if (now - lastSpawnRef.current > spawnInterval) {
        spawnCustomer();
        lastSpawnRef.current = now;
      }

      // Update customers
      setCustomers(prev => {
        const updated: Customer[] = [];
        let livesLost = 0;

        for (const customer of prev) {
          if (customer.state === 'walking') {
            const newX = customer.x + customer.speed;

            // Customer reached Damian - lose a life
            if (newX >= DAMIAN_X - 80) {
              livesLost++;
              continue;
            }

            updated.push({ ...customer, x: newX });
          } else if (customer.state === 'eating') {
            // Customer is eating, will transition to satisfied
            updated.push(customer);
          } else if (customer.state === 'satisfied') {
            // Customer walks off left
            const newX = customer.x - 3;
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

      // Update empanadas and check collisions
      setEmpanadas(prev => {
        const updated: Empanada[] = [];

        for (const emp of prev) {
          const newX = emp.x - EMPANADA_SPEED;

          // Check collision with customers
          let hit = false;
          setCustomers(customers => {
            const newCustomers = customers.map(c => {
              if (c.lane === emp.lane && c.state === 'walking' &&
                  Math.abs(c.x - newX) < 50) {
                hit = true;
                // Spawn plate after delay
                setTimeout(() => {
                  setPlates(plates => [...plates, {
                    id: idCounterRef.current++,
                    lane: c.lane,
                    x: c.x + 30,
                  }]);
                }, 800);

                // Update score
                setScore(s => s + c.points);
                setCustomersServed(cs => {
                  const newCount = cs + 1;
                  // Level up every 10 customers
                  if (newCount % 10 === 0) {
                    setLevel(l => l + 1);
                  }
                  return newCount;
                });

                // Make customer eat then satisfied
                setTimeout(() => {
                  setCustomers(cust => cust.map(cu =>
                    cu.id === c.id ? { ...cu, state: 'satisfied' as const } : cu
                  ));
                }, 600);

                return { ...c, state: 'eating' as const };
              }
              return c;
            });
            return newCustomers;
          });

          if (!hit && newX > -50) {
            updated.push({ ...emp, x: newX });
          }
        }

        return updated;
      });

      // Update plates
      setPlates(prev => {
        const updated: Plate[] = [];
        let livesLost = 0;

        for (const plate of prev) {
          const newX = plate.x + PLATE_SPEED;

          // Check if Damian catches it
          if (newX >= DAMIAN_X - 60 && newX <= DAMIAN_X + 20) {
            setDamianLane(currentLane => {
              if (plate.lane === currentLane) {
                setScore(s => s + 5);
              } else {
                // Plate missed
                livesLost++;
              }
              return currentLane;
            });
            continue;
          }

          // Plate fell off
          if (newX > GAME_WIDTH + 50) {
            livesLost++;
            continue;
          }

          updated.push({ ...plate, x: newX });
        }

        if (livesLost > 0) {
          setLives(l => Math.max(0, l - livesLost));
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
              <li>🍽️ Catch returning plates in your lane</li>
              <li>😤 Don't let hangry customers reach you!</li>
            </ul>
          </div>

          <div className="bg-[#1a3a24] rounded-xl p-4 mb-6 text-sm">
            <h3 className="text-[#C4A052] font-bold mb-2">REWARDS</h3>
            <div className="text-white/90 space-y-1">
              <p>🎫 100+ pts = 10% off</p>
              <p>🥟 250+ pts = FREE empanada</p>
              <p>🎉 500+ pts = FREE meal!</p>
            </div>
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
    const reward = getReward();

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

          <div className="bg-[#1a3a24] rounded-xl p-6 mb-6">
            <p className="text-white/70 text-sm mb-1">FINAL SCORE</p>
            <p className="text-5xl font-bold text-white mb-4">{score}</p>

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
          </div>

          <motion.div
            className="bg-[#1a3a24] rounded-xl p-6 mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <p className="text-6xl mb-2">{reward.icon}</p>
            <p className={`text-2xl font-bold ${reward.color}`}>
              {reward.text}
            </p>
            {score >= 100 && (
              <p className="text-white/60 text-sm mt-2">
                Show this screen to claim your reward!
              </p>
            )}
          </motion.div>

          <motion.button
            onClick={startGame}
            className="bg-[#C4A052] hover:bg-[#d4b062] text-[#2D5A3D] font-bold text-xl px-10 py-3 rounded-full shadow-lg"
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
        <div className="flex gap-4">
          <div className="bg-[#2D5A3D] px-4 py-2 rounded-lg">
            <span className="text-[#C4A052] font-bold">SCORE: </span>
            <span className="text-white font-bold">{score}</span>
          </div>
          <div className="bg-[#2D5A3D] px-4 py-2 rounded-lg">
            <span className="text-[#C4A052] font-bold">LVL: </span>
            <span className="text-white font-bold">{level}</span>
          </div>
        </div>
        <div className="bg-[#2D5A3D] px-4 py-2 rounded-lg">
          <span className="text-red-400 text-xl">
            {'❤️'.repeat(lives)}{'🖤'.repeat(3 - lives)}
          </span>
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

        {/* Lanes */}
        {Array.from({ length: LANE_COUNT }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full border-b-2 border-[#8B7355]/30"
            style={{
              top: `${(i + 1) * (100 / LANE_COUNT)}%`,
              height: 0,
            }}
          />
        ))}

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
              className="absolute flex items-center justify-center text-4xl md:text-5xl"
              style={{
                left: `${(customer.x / GAME_WIDTH) * 100}%`,
                top: `${(customer.lane * LANE_HEIGHT + LANE_HEIGHT / 2) / GAME_HEIGHT * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: customer.state === 'eating' ? [0, -10, 10, -10, 0] : 0,
              }}
              exit={{ opacity: 0, scale: 0 }}
            >
              {customer.state === 'walking' && customer.emoji}
              {customer.state === 'eating' && '😋'}
              {customer.state === 'satisfied' && '😊'}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empanadas */}
        <AnimatePresence>
          {empanadas.map(emp => (
            <motion.div
              key={emp.id}
              className="absolute w-10 h-10 md:w-12 md:h-12"
              style={{
                left: `${(emp.x / GAME_WIDTH) * 100}%`,
                top: `${(emp.lane * LANE_HEIGHT + LANE_HEIGHT / 2) / GAME_HEIGHT * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              exit={{ scale: 0 }}
              transition={{ rotate: { duration: 0.5, repeat: Infinity, ease: 'linear' } }}
            >
              <Image
                src={emp.image}
                alt="Empanada"
                fill
                className="object-contain"
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Plates */}
        <AnimatePresence>
          {plates.map(plate => (
            <motion.div
              key={plate.id}
              className="absolute text-3xl md:text-4xl"
              style={{
                left: `${(plate.x / GAME_WIDTH) * 100}%`,
                top: `${(plate.lane * LANE_HEIGHT + LANE_HEIGHT / 2) / GAME_HEIGHT * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              🍽️
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Damian */}
        <motion.div
          className="absolute w-16 h-24 md:w-20 md:h-32"
          style={{
            right: '2%',
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
            className="object-contain object-bottom"
          />
        </motion.div>

        {/* Lane indicators (which lane Damian is on) */}
        <div
          className="absolute right-0 top-0 bottom-0 w-8 flex flex-col"
          style={{ background: 'rgba(45, 90, 61, 0.3)' }}
        >
          {Array.from({ length: LANE_COUNT }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 flex items-center justify-center transition-colors ${
                i === damianLane ? 'bg-[#C4A052]/50' : ''
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
