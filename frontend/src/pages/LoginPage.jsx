import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login } from '../api/authApi';
import getErrorMessage from '../api/getErrorMessage';
import heroImg from '../assets/hero.png';

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { token, user } = await login(formData);
            localStorage.setItem('dusasistan_token', token);
            localStorage.setItem('dusasistan_user', JSON.stringify(user));
            navigate('/');
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <img src={heroImg} className="auth-hero" alt="DUSAsistan" />
            <div className="auth-card">
                <h1>Giriş Yap</h1>
                <p className="auth-subtitle">DUSAsistan hesabına giriş yap</p>

                {location.state?.registered && (
                    <div className="auth-error" style={{ color: 'var(--accent)', background: 'var(--accent-bg)' }}>
                        Kayıt başarılı! Şimdi giriş yapabilirsin.
                    </div>
                )}
                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="field">
                        <label htmlFor="email">E-posta</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="password">Şifre</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button className="auth-submit" type="submit" disabled={loading}>
                        {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                    </button>
                </form>

                <p className="auth-switch">
                    Hesabın yok mu? <Link to="/register">Kayıt Ol</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
