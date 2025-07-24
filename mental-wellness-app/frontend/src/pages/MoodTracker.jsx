import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MoodTracker = () => {
  const [moods, setMoods] = useState([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [todayMood, setTodayMood] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const res = await axios.get('/api/mood');
        setMoods(res.data);
        
        // Check if mood is logged for today
        const today = new Date().toDateString();
        const todayEntry = res.data.find(entry => 
          new Date(entry.date).toDateString() === today
        );
        
        if (todayEntry) {
          setTodayMood(todayEntry.mood);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchMoods();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMood) {
      setError('Please select a mood');
      return;
    }

    try {
      const res = await axios.post('/api/mood', { mood: selectedMood });
      setTodayMood(selectedMood);
      setMoods([res.data, ...moods]);
      setSelectedMood('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to log mood');
    }
  };

  const moodData = {
    labels: moods.map(mood => new Date(mood.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Mood',
        data: moods.map(mood => {
          const moodValues = { happy: 5, neutral: 3, sad: 1, angry: 2, anxious: 4 };
          return moodValues[mood.mood] || 3;
        }),
        backgroundColor: 'rgba(178, 235, 242, 0.6)',
        borderColor: 'rgba(128, 222, 234, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          callback: function(value) {
            const moodLabels = { 1: 'Sad', 2: 'Angry', 3: 'Neutral', 4: 'Anxious', 5: 'Happy' };
            return moodLabels[value] || '';
          }
        }
      }
    }
  };

  const moodColors = {
    happy: 'bg-yellow-300',
    sad: 'bg-blue-300',
    angry: 'bg-red-300',
    neutral: 'bg-gray-300',
    anxious: 'bg-purple-300'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h1 className="text-2xl font-bold text-primary-dark mb-4">Mood Tracker</h1>
          
          {todayMood ? (
            <div className="mb-6">
              <p className="text-lg mb-2">You've already logged your mood today:</p>
              <div className={`inline-flex items-center px-4 py-2 rounded-full ${moodColors[todayMood]}`}>
                <span className="capitalize font-medium">{todayMood}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mb-6">
              <h2 className="text-xl font-semibold mb-4">How are you feeling today?</h2>
              
              {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
              
              <div className="flex flex-wrap gap-3 mb-4">
                {['happy', 'sad', 'angry', 'neutral', 'anxious'].map(mood => (
                  <label
                    key={mood}
                    className={`flex items-center px-4 py-2 rounded-full cursor-pointer transition ${moodColors[mood]} ${selectedMood === mood ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                  >
                    <input
                      type="radio"
                      name="mood"
                      value={mood}
                      checked={selectedMood === mood}
                      onChange={() => setSelectedMood(mood)}
                      className="sr-only"
                    />
                    <span className="capitalize">{mood}</span>
                  </label>
                ))}
              </div>
              
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
              >
                Log Mood
              </button>
            </form>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-primary-dark">Mood History</h2>
          <div className="h-64">
            <Bar data={moodData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;