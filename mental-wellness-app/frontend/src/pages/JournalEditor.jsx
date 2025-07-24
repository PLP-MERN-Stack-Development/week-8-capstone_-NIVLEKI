import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const JournalEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState({
    title: '',
    content: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (id && id !== 'new') {
      const fetchEntry = async () => {
        try {
          const res = await axios.get(`/api/journal/${id}`);
          setEntry(res.data);
          setIsEditMode(true);
        } catch (err) {
          console.error(err);
          navigate('/journal');
        }
      };
      fetchEntry();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    setEntry({ ...entry, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`/api/journal/${id}`, entry);
      } else {
        await axios.post('/api/journal', entry);
      }
      navigate('/journal');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to save entry');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/journal')}
          className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          ← Back to Journal
        </button>

        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-primary-dark mb-4">
            {isEditMode ? 'Edit Journal Entry' : 'New Journal Entry'}
          </h1>
          
          {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={entry.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <button
                  type="button"
                  onClick={() => setPreview(!preview)}
                  className="text-sm text-primary hover:text-primary-dark"
                >
                  {preview ? 'Show Editor' : 'Show Preview'}
                </button>
              </div>
              
              {preview ? (
                <div className="p-3 border border-gray-300 rounded min-h-[200px] bg-gray-50">
                  <ReactMarkdown>{entry.content}</ReactMarkdown>
                </div>
              ) : (
                <textarea
                  id="content"
                  name="content"
                  value={entry.content}
                  onChange={handleChange}
                  required
                  rows="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-primary focus:border-primary"
                />
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/journal')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
              >
                {isEditMode ? 'Update Entry' : 'Save Entry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JournalEditor;