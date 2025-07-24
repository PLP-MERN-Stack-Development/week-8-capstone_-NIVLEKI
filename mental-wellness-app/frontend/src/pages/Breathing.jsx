import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Breathing = () => {
  const [phase, setPhase] = useState('inhale');
  const [count, setCount] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const [cycle, setCycle] = useState(0);
  const navigate = useNavigate();

  const messages = {
    inhale: 'Breathe in...',
    hold: 'Hold...',
    exhale: 'Breathe out...',
    rest: 'Rest...'
  };

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setCount(prev => {
          if (prev <= 1) {
            // Move to next phase
            switch (phase) {
              case 'inhale':
                setPhase('hold');
                return 7;
              case 'hold':
                setPhase('exhale');
                return 8;
              case 'exhale':
                setPhase('rest');
                return 4;
              case 'rest':
                setPhase('inhale');
                setCycle(prevCycle => prevCycle + 1);
                return 4;
              default:
                return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, phase]);

  const handleStart = () => {
    setIsActive(true);
    setPhase('inhale');
    setCount(4);
    setCycle(0);
  };

  const handleStop = () => {
    setIsActive(false);
  };

  const getCircleSize = () => {
    switch (phase) {
      case 'inhale':
        return 'scale-110';
      case 'hold':
        return 'scale-110';
      case 'exhale':
        return 'scale-90';
      case 'rest':
        return 'scale-90';
      default:
        return 'scale-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex flex-col items-center justify-center">
      <button
        onClick={() => navigate('/dashboard')}
        className="absolute top-4 left-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
      >
        ← Back to Dashboard
      </button>

      <div className="text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-primary-dark mb-6">Breathing Exercise</h1>
        <p className="mb-8 text-gray-600">
          Follow the 4-7-8 breathing pattern: Inhale for 4 seconds, hold for 7 seconds, 
          exhale for 8 seconds, and rest for 4 seconds. Repeat for several cycles.
        </p>

        <div className="relative mb-8 flex justify-center">
          <div className={`w-64 h-64 rounded-full bg-primary-light transition-transform duration-1000 ${getCircleSize()} breathing-circle flex items-center justify-center`}>
            <div className="text-center">
              <p className="text-xl font-semibold mb-2">{messages[phase]}</p>
              <p className="text-4xl font-bold">{count}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-lg">Cycle: {cycle}</p>
        </div>

        <div className="flex justify-center space-x-4">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition"
            >
              Start
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
            >
              Stop
            </button>
          )}
        </div>

        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Benefits of 4-7-8 Breathing:</h2>
          <ul className="text-left list-disc pl-5 space-y-1 text-gray-700">
            <li>Reduces anxiety and stress</li>
            <li>Helps with relaxation and sleep</li>
            <li>Improves focus and concentration</li>
            <li>Regulates the nervous system</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Breathing;