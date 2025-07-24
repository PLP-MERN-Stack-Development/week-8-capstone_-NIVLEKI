import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [moods, setMoods] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moodRes, journalRes] = await Promise.all([
          axios.get('/api/mood'),
          axios.get('/api/journal?limit=3')
        ]);
        setMoods(moodRes.data);
        setJournalEntries(journalRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary-dark">Welcome, {user?.username}</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
          >
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-primary-dark">Your Mood Summary</h2>
            <div className="h-64">
              <Bar data={moodData} options={options} />
            </div>
            <Link
              to="/mood-tracker"
              className="mt-4 inline-block text-primary hover:text-primary-dark font-medium"
            >
              View Mood Tracker →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-primary-dark">Recent Journal Entries</h2>
            {journalEntries.length > 0 ? (
              <ul className="space-y-3">
                {journalEntries.map(entry => (
                  <li key={entry._id} className="border-b pb-3 last:border-b-0">
                    <Link
                      to={`/journal/${entry._id}`}
                      className="block hover:bg-gray-50 p-2 rounded transition"
                    >
                      <h3 className="font-medium">{entry.title}</h3>
                      <p className="text-sm text-gray-500 truncate">{entry.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(entry.date).toLocaleDateString()}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No journal entries yet.</p>
            )}
            <Link
              to="/journal"
              className="mt-4 inline-block text-primary hover:text-primary-dark font-medium"
            >
              View All Entries →
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-primary-dark">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/mood-tracker"
              className="bg-primary-light p-4 rounded-lg hover:bg-primary transition text-center"
            >
              <h3 className="font-medium">Log Mood</h3>
            </Link>
            <Link
              to="/journal/new"
              className="bg-secondary-light p-4 rounded-lg hover:bg-secondary transition text-center"
            >
              <h3 className="font-medium">New Journal Entry</h3>
            </Link>
            <Link
              to="/breathing"
              className="bg-accent-light p-4 rounded-lg hover:bg-accent transition text-center"
            >
              <h3 className="font-medium">Breathing Exercise</h3>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;