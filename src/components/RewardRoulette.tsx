"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface RouletteNumber {
  number: number;
  color: 'red' | 'black' | 'green';
}

interface Task {
  id: number;
  name: string;
}

const ROULETTE_NUMBERS: RouletteNumber[] = [
  { number: 0, color: 'green' },
  { number: 32, color: 'red' }, { number: 15, color: 'black' }, { number: 19, color: 'red' },
  { number: 4, color: 'black' }, { number: 21, color: 'red' }, { number: 2, color: 'black' },
  { number: 25, color: 'red' }, { number: 17, color: 'black' }, { number: 34, color: 'red' },
  { number: 6, color: 'black' }, { number: 27, color: 'red' }, { number: 13, color: 'black' },
  { number: 36, color: 'red' }, { number: 11, color: 'black' }, { number: 30, color: 'red' },
  { number: 8, color: 'black' }, { number: 23, color: 'red' }, { number: 10, color: 'black' },
  { number: 5, color: 'red' }, { number: 24, color: 'black' }, { number: 16, color: 'red' },
  { number: 33, color: 'black' }, { number: 1, color: 'red' }, { number: 20, color: 'black' },
  { number: 14, color: 'red' }, { number: 31, color: 'black' }, { number: 9, color: 'red' },
  { number: 22, color: 'black' }, { number: 18, color: 'red' }, { number: 29, color: 'black' },
  { number: 7, color: 'red' }, { number: 28, color: 'black' }, { number: 12, color: 'red' },
  { number: 35, color: 'black' }, { number: 3, color: 'red' }, { number: 26, color: 'black' }
];

const TaskRouletteWheel: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const wheelRef = useRef<SVGGElement>(null);
  const ballRef = useRef<SVGCircleElement>(null);
  const [newTask, setNewTask] = useState('');

  const resetWheel = useCallback(() => {
    if (wheelRef.current && ballRef.current) {
      wheelRef.current.style.transition = 'none';
      wheelRef.current.setAttribute('transform', 'rotate(0)');
      ballRef.current.style.transition = 'none';
      ballRef.current.setAttribute('transform', 'rotate(0)');
    }
  }, []);

  const forceReflow = (element: SVGGraphicsElement) => {
    void element.getBBox();
  };

  const spinRoulette = () => {
    if (isSpinning || tasks.length === 0) return;

    setIsSpinning(true);
    setSelectedTask(null);

    const wheel = wheelRef.current;
    const ball = ballRef.current;
    if (!wheel || !ball) return;

    // Reset wheel and ball position
    resetWheel();

    // Force a reflow to ensure the reset takes effect
    forceReflow(wheel);
    forceReflow(ball);

    const task = selectRandomTask();
    const wheelRotation = 2000 + Math.random() * 360;
    const ballRotation = wheelRotation + (360 - (Math.random() * 360));

    wheel.style.transition = 'transform 8s cubic-bezier(0.25, 0.1, 0.25, 1)';
    wheel.setAttribute('transform', `rotate(${wheelRotation})`);

    ball.style.transition = 'transform 8s cubic-bezier(0.5, 0.1, 0.15, 1)';
    ball.setAttribute('transform', `rotate(${ballRotation})`);

    setTimeout(() => {
      setSelectedTask(task);
      setIsSpinning(false);
    }, 8000);
  };

  const selectRandomTask = () => {
    const randomIndex = Math.floor(Math.random() * tasks.length);
    return tasks[randomIndex];
  };

  const addCustomTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: tasks.length + 1, name: newTask }]);
      setNewTask('');
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-800 p-4">
      <h1 className="text-4xl font-bold mb-8 text-white">Task Roulette</h1>
      <div className="bg-green-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="relative w-96 h-96 mx-auto mb-8">
          <svg viewBox="0 0 1000 1000" className="w-full h-full">
            <defs>
              <radialGradient id="wheelGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#e6d5a5" />
                <stop offset="100%" stopColor="#d4af37" />
              </radialGradient>
              <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
                <feOffset dy="3" dx="3" />
                <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff" />
                <feFlood floodColor="#000" floodOpacity="0.2" />
                <feComposite in2="shadowDiff" operator="in" />
                <feComposite in2="SourceGraphic" operator="over" />
              </filter>
            </defs>
            <g ref={wheelRef} style={{ transformOrigin: "center" }}>
              <circle cx="500" cy="500" r="450" fill="url(#wheelGradient)" stroke="#c5a028" strokeWidth="10" filter="url(#innerShadow)" />
              {ROULETTE_NUMBERS.map((number, index) => {
                const angle = (index * 360) / ROULETTE_NUMBERS.length;
                const startAngle = angle - (360 / ROULETTE_NUMBERS.length / 2);
                const endAngle = angle + (360 / ROULETTE_NUMBERS.length / 2);
                const startCoord = polarToCartesian(500, 500, 450, startAngle);
                const endCoord = polarToCartesian(500, 500, 450, endAngle);

                return (
                  <g key={number.number}>
                    <path
                      d={`M 500 500 L ${startCoord.x} ${startCoord.y} A 450 450 0 0 1 ${endCoord.x} ${endCoord.y} Z`}
                      fill={number.color === 'red' ? '#e34234' : number.color === 'black' ? '#1e1e1e' : '#00a86b'}
                    />
                    <text
                      x={polarToCartesian(500, 500, 400, angle).x}
                      y={polarToCartesian(500, 500, 400, angle).y}
                      fill="white"
                      fontSize="24"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${90 + angle}, ${polarToCartesian(500, 500, 400, angle).x}, ${polarToCartesian(500, 500, 400, angle).y})`}
                    >
                      {number.number}
                    </text>
                  </g>
                );
              })}
              <circle cx="500" cy="500" r="50" fill="#c5a028" stroke="#a8850a" strokeWidth="5" />
              <circle cx="500" cy="500" r="30" fill="#e6d5a5" />
            </g>
            <circle
              ref={ballRef}
              cx="500"
              cy="80"
              r="15"
              fill="white"
              filter="url(#innerShadow)"
              style={{ transformOrigin: "center center" }}
            />
          </svg>
        </div>
        <button
          onClick={spinRoulette}
          disabled={isSpinning || tasks.length === 0}
          className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors w-full flex items-center justify-center disabled:bg-yellow-400 mb-4"
        >
          {isSpinning ? 'Spinning...' : 'Spin the Roulette'}
        </button>
        {selectedTask && (
          <Alert className="mb-4 bg-yellow-100 border-yellow-400">
            <AlertTitle className="text-yellow-800">Your Task:</AlertTitle>
            <AlertDescription className="text-yellow-700">
              {selectedTask.name}
            </AlertDescription>
          </Alert>
        )}
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2 text-white">Add Custom Task</h2>
          <Input
            type="text"
            placeholder="Enter task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="mb-2"
          />
          <Button onClick={addCustomTask} className="w-full">
            Add Task
          </Button>
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2 text-white">Current Tasks</h2>
          <ul className="list-disc pl-5 text-white">
            {tasks.map((task) => (
              <li key={task.id}>{task.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

export default TaskRouletteWheel;