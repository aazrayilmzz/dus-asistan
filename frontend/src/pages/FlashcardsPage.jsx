import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listFlashcards, createFlashcard, deleteFlashcard } from '../api/flashcardsApi';
import getErrorMessage from '../api/getErrorMessage';
import FlashcardStudy from '../components/FlashcardStudy';
import FlashcardForm from '../components/FlashcardForm';
import { SPECIALTIES, DIFFICULTIES } from '../constants/specialties';
import './FlashcardsPage.css';

function FlashcardsPage() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [filters, setFilters] = useState({ subject: '', difficulty: '' });

    useEffect(() => {
        let cancelled = false;

        setLoading(true);
        setError('');
        listFlashcards(filters)
            .then((data) => {
                if (!cancelled) setCards(data);
            })
            .catch((err) => {
                if (!cancelled) setError(getErrorMessage(err));
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [filters]);

    async function handleCreate(formData) {
        try {
            const created = await createFlashcard(formData);
            setCards((prev) => [created, ...prev]);
            setShowForm(false);
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    }

    async function handleDelete(id) {
        const previousCards = cards;
        setCards((prev) => prev.filter((card) => card.id !== id));

        try {
            await deleteFlashcard(id);
        } catch (err) {
            setCards(previousCards);
            setError(getErrorMessage(err));
        }
    }

    function handleFilterChange(event) {
        const { name, value } = event.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    }

    return (
        <div className="flashcards-page">
            <header className="flashcards-header">
                <Link to="/" className="flashcards-back">← Ana Sayfa</Link>
                <h1>Çalışma Kartları</h1>
                <button className="auth-submit" onClick={() => setShowForm((s) => !s)}>
                    {showForm ? 'Kapat' : '+ Yeni Kart'}
                </button>
            </header>

            {showForm && <FlashcardForm onCreate={handleCreate} onCancel={() => setShowForm(false)} />}

            <div className="flashcards-filters">
                <select name="subject" value={filters.subject} onChange={handleFilterChange}>
                    <option value="">Tüm Branşlar</option>
                    {SPECIALTIES.map((specialty) => (
                        <option key={specialty} value={specialty}>
                            {specialty}
                        </option>
                    ))}
                </select>
                <select name="difficulty" value={filters.difficulty} onChange={handleFilterChange}>
                    <option value="">Tüm Zorluklar</option>
                    {DIFFICULTIES.map((level) => (
                        <option key={level} value={level}>
                            {level}
                        </option>
                    ))}
                </select>
            </div>

            {error && <div className="auth-error">{error}</div>}

            {loading ? (
                <p className="flashcards-status">Yükleniyor...</p>
            ) : cards.length === 0 ? (
                <p className="flashcards-status">Henüz kart yok. Yukarıdan ilk kartını ekle!</p>
            ) : (
                <div className="flashcards-grid">
                    {cards.map((card) => (
                        <FlashcardStudy key={card.id} card={card} onDelete={handleDelete} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default FlashcardsPage;
