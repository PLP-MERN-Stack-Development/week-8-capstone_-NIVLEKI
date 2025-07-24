import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import MoodTracker from './pages/MoodTracker';
import JournalList from './pages/JournalList';
import JournalEditor from './pages/JournalEditor';
import Breathing from './pages/Breathing';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mood-tracker" element={<MoodTracker />} />
            <Route path="/journal" element={<JournalList />} />
            <Route path="/journal/new" element={<JournalEditor />} />
            <Route path="/journal/:id" element={<JournalEditor />} />
            <Route path="/journal/:id/edit" element={<JournalEditor />} />
            <Route path="/breathing" element={<Breathing />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;