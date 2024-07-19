"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Clock, Trophy } from 'lucide-react';

const SYMBOLS = ['🎯', '⏰', '📚', '💪', '🧠', '✅'];
const WORK_TIME = 5; // 25 minutes in seconds

const ProductivitySlots: React.FC = () => {
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState('');
  const [slots, setSlots] = useState(['?', '?', '?']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [points, setPoints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isWorking, setIsWorking] = useState(false);
  const [breakTime, setBreakTime] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isWorking && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isWorking && timeLeft === 0) {
      setIsWorking(false);
      alert("Work session complete! Spin the slots for your break time!");
    }
    return () => clearInterval(timer);
  }, [isWorking, timeLeft]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, newTask.trim()]);
      setNewTask('');
    }
  };

  const startWork = () => {
    if (tasks.length > 0) {
      setIsWorking(true);
      setTimeLeft(WORK_TIME);
    } else {
      alert("Please add a task before starting work!");
    }
  };

  const spinSlots = () => {
    if (tasks.length === 0) return;

    setIsSpinning(true);

    const spinInterval = setInterval(() => {
      setSlots(SYMBOLS.sort(() => 0.5 - Math.random()).slice(0, 3));
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      setIsSpinning(false);
      determineReward();
    }, 3000);
  };

  const determineReward = () => {
    const [s1, s2, s3] = slots;
    let earnedPoints = 0;
    let breakMinutes = 5; // Minimum break time

    if (s1 === s2 && s2 === s3) {
      earnedPoints = 50;
      breakMinutes = 15; // Maximum break time
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
      earnedPoints = 30;
      breakMinutes = 10;
    } else {
      earnedPoints = 10;
    }

    setPoints(points + earnedPoints);
    setBreakTime(breakMinutes * 60); // Convert to seconds
    completeTask();
  };

  const completeTask = () => {
    if (tasks.length > 0) {
      setTasks(tasks.slice(1));
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-900 p-4">
      <h1 className="text-4xl font-bold mb-8 text-white">Productivity Slots</h1>
      <Card className="w-full max-w-md bg-purple-800 text-white">
        <CardHeader>
          <CardTitle className="text-center">Pomodoro Slot Machine</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <Clock className="inline-block mr-2" />
            <span className="text-2xl font-bold">
              {isWorking ? `Work Time: ${formatTime(timeLeft)}` : `Break Time: ${formatTime(breakTime)}`}
            </span>
          </div>
          {!isWorking && (
            <>
              <div className="flex justify-around text-6xl mb-4">
                {slots.map((symbol, index) => (
                  <div key={index} className="bg-purple-700 p-4 rounded-lg">
                    {symbol}
                  </div>
                ))}
              </div>
              <Button 
                onClick={spinSlots} 
                disabled={isSpinning || tasks.length === 0 || timeLeft > 0}
                className="w-full mb-4 bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                {isSpinning ? 'Spinning...' : 'Spin for Break Time'}
              </Button>
            </>
          )}
          {!isWorking && timeLeft === WORK_TIME && (
            <Button 
              onClick={startWork} 
              disabled={tasks.length === 0}
              className="w-full mb-4 bg-green-500 hover:bg-green-600"
            >
              Start Work Session
            </Button>
          )}
          <div className="text-center mb-4">
            <Trophy className="inline-block mr-2" />
            <span className="text-2xl font-bold">Points: {points}</span>
          </div>
          <div className="mb-4">
            <Input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter a new task"
              className="mb-2"
            />
            <Button onClick={addTask} className="w-full bg-blue-500 hover:bg-blue-600">
              Add Task
            </Button>
          </div>
          <div>
            <h3 className="font-bold mb-2">Task Queue:</h3>
            <ul className="list-disc pl-5">
              {tasks.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductivitySlots;