import { Link, useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('dusasistan_user'));

    function handleLogout() {
        localStorage.removeItem('dusasistan_token');
        localStorage.removeItem('dusasistan_user');
        navigate('/login');
    }

    return (
        <div className="home-page">
            <h1>Hoş geldin, {user.fullName}</h1>
            <p>{user.targetSpecialty ? `Hedef branş: ${user.targetSpecialty}` : 'Henüz bir hedef branş seçmedin.'}</p>
            <Link to="/flashcards" className="home-link">Çalışma Kartları</Link>
            <Link to="/exams" className="home-link">Denemeler</Link>
            <Link to="/pomodoro" className="home-link">Pomodoro</Link>
            <button className="home-logout" onClick={handleLogout}>
                Çıkış Yap
            </button>
        </div>
    );
}

export default HomePage;
