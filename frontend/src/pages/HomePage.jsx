import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('dusasistan_token');
        const storedUser = localStorage.getItem('dusasistan_user');

        if (!token || !storedUser) {
            navigate('/login');
            return;
        }

        setUser(JSON.parse(storedUser));
    }, [navigate]);

    function handleLogout() {
        localStorage.removeItem('dusasistan_token');
        localStorage.removeItem('dusasistan_user');
        navigate('/login');
    }

    if (!user) {
        return null;
    }

    return (
        <div className="home-page">
            <h1>Hoş geldin, {user.fullName}</h1>
            <p>{user.targetSpecialty ? `Hedef branş: ${user.targetSpecialty}` : 'Henüz bir hedef branş seçmedin.'}</p>
            <button className="home-logout" onClick={handleLogout}>
                Çıkış Yap
            </button>
        </div>
    );
}

export default HomePage;
