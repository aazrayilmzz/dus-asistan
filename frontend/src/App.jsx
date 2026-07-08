import { Navigate, Route, Routes } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FlashcardsPage from './pages/FlashcardsPage';
import ExamsPage from './pages/ExamsPage';
import PomodoroPage from './pages/PomodoroPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';

function App() {
    return (
        <Routes>
            <Route path="/" element={<RequireAuth><HomePage /></RequireAuth>} />
            <Route path="/flashcards" element={<RequireAuth><FlashcardsPage /></RequireAuth>} />
            <Route path="/exams" element={<RequireAuth><ExamsPage /></RequireAuth>} />
            <Route path="/pomodoro" element={<RequireAuth><PomodoroPage /></RequireAuth>} />
            <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
