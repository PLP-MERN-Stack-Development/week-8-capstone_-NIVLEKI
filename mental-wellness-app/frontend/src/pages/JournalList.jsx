import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const JournalList = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await axios.get('/api/journal');
        setEntries(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/journal/${id}`);
      setEntries(entries.filter(entry => entry._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary-dark">Journal Entries</h1>
          <button
            onClick={() => navigate('/journal/new')}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
          >
            New Entry
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500 mb-4">No journal entries yet.</p>
            <button
              onClick={() => navigate('/journal/new')}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
            >
              Create Your First Entry
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map(entry => (
              <div key={entry._id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <Link to={`/journal/${entry._id}`} className="flex-1">
                    <h2 className="text-lg font-semibold text-primary-dark">{entry.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </Link>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/journal/${entry._id}/edit`)}
                      className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(entry._id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-gray-700 line-clamp-2">{entry.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalList;