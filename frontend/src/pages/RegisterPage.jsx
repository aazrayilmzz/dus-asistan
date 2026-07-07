import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/authApi';
import getErrorMessage from '../api/getErrorMessage';
import heroImg from '../assets/hero.png';
import { SPECIALTIES } from '../constants/specialties';

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        targetSpecialty: '',
        targetScore: '',
    });
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
            await register({
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                targetSpecialty: formData.targetSpecialty,
                targetScore: formData.targetScore ? Number(formData.targetScore) : undefined,
            });
            navigate('/login', { state: { registered: true } });
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
                <h1>Kayıt Ol</h1>
                <p className="auth-subtitle">DUSAsistan'a hoş geldin</p>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="field">
                        <label htmlFor="fullName">Ad Soyad</label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

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

                    <div className="field">
                        <label htmlFor="targetSpecialty">Hedef Branş (opsiyonel)</label>
                        <select
                            id="targetSpecialty"
                            name="targetSpecialty"
                            value={formData.targetSpecialty}
                            onChange={handleChange}
                        >
                            <option value="">Seçiniz</option>
                            {SPECIALTIES.map((specialty) => (
                                <option key={specialty} value={specialty}>
                                    {specialty}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <label htmlFor="targetScore">Hedef Puan (opsiyonel)</label>
                        <input
                            id="targetScore"
                            name="targetScore"
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            value={formData.targetScore}
                            onChange={handleChange}
                        />
                    </div>

                    <button className="auth-submit" type="submit" disabled={loading}>
                        {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
                    </button>
                </form>

                <p className="auth-switch">
                    Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
