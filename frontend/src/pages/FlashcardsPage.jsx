import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    listFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    reviewFlashcard,
    generateFlashcards,
} from '../api/flashcardsApi';
import getErrorMessage from '../api/getErrorMessage';
import FlashcardStudy from '../components/FlashcardStudy';
import FlashcardForm from '../components/FlashcardForm';
import FlashcardReviewSession from '../components/FlashcardReviewSession';
import AiGenerateForm from '../components/AiGenerateForm';
import { EXAM_SUBJECTS, DIFFICULTIES } from '../constants/specialties';
import './FlashcardsPage.css';

function sortCards(list) {
    return [...list].sort((a, b) => {
        if (a.subject !== b.subject) return a.subject.localeCompare(b.subject, 'tr');
        return new Date(b.created_at) - new Date(a.created_at);
    });
}

function FlashcardsPage() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingCard, setEditingCard] = useState(null);
    const [searchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        subject: searchParams.get('subject') || '',
        difficulty: '',
        needsReview: searchParams.get('needsReview') === 'true',
        isAiGenerated: false,
    });
    const [dueCards, setDueCards] = useState([]);
    const [reviewMode, setReviewMode] = useState(false);
    const [reviewCards, setReviewCards] = useState([]);
    const [showAiForm, setShowAiForm] = useState(false);

    function refreshDueCards() {
        listFlashcards({ due: true })
            .then(setDueCards)
            .catch(() => setDueCards([]));
    }

    useEffect(() => {
        refreshDueCards();
    }, []);

    useEffect(() => {
        let cancelled = false;

        setLoading(true);
        setError('');
        listFlashcards({
            subject: filters.subject,
            difficulty: filters.difficulty,
            needsReview: filters.needsReview ? true : undefined,
            isAiGenerated: filters.isAiGenerated ? true : undefined,
        })
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

    function openCreateForm() {
        setEditingCard(null);
        setShowForm(true);
    }

    function openEditForm(card) {
        setEditingCard(card);
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditingCard(null);
    }

    async function handleSubmit(formData) {
        try {
            if (editingCard) {
                const updated = await updateFlashcard(editingCard.id, formData);
                setCards((prev) => sortCards(prev.map((card) => (card.id === updated.id ? updated : card))));
            } else {
                const created = await createFlashcard(formData);
                setCards((prev) => sortCards([created, ...prev]));
            }
            closeForm();
        } catch (err) {
            throw new Error(getErrorMessage(err));
        }
    }

    async function handleGenerate({ subject, count }) {
        try {
            const created = await generateFlashcards({ subject, count });
            setCards((prev) => sortCards([...created, ...prev]));
            setShowAiForm(false);
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

    async function handleToggleReview(card) {
        const previousCards = cards;
        const nextNeedsReview = !card.needs_review;

        if (filters.needsReview && !nextNeedsReview) {
            setCards((prev) => prev.filter((c) => c.id !== card.id));
        } else {
            setCards((prev) => prev.map((c) => (c.id === card.id ? { ...c, needs_review: nextNeedsReview } : c)));
        }

        try {
            await updateFlashcard(card.id, { needsReview: nextNeedsReview });
        } catch (err) {
            setCards(previousCards);
            setError(getErrorMessage(err));
        }
    }

    async function handleRate(card, rating) {
        try {
            await reviewFlashcard(card.id, rating);
        } catch (err) {
            setError(getErrorMessage(err));
        }
    }

    function startReview(cardsToReview) {
        setReviewCards(cardsToReview);
        setReviewMode(true);
    }

    function handleFinishReview() {
        setReviewMode(false);
        refreshDueCards();
    }

    return (
        <div className="flashcards-page">
            <header className="flashcards-header">
                <Link to="/" className="flashcards-back">← Ana Sayfa</Link>
                <h1>Çalışma Kartları</h1>
                {!reviewMode && (
                    <div className="flashcards-header-actions">
                        {cards.length > 0 && (
                            <button className="flashcards-ai-btn" onClick={() => startReview(cards)}>
                                Tek Tek Çalış
                            </button>
                        )}
                        <button
                            className="flashcards-ai-btn"
                            onClick={() => {
                                setShowAiForm((prev) => !prev);
                                if (showForm) closeForm();
                            }}
                        >
                            {showAiForm ? 'Kapat' : 'AI ile Soru Üret'}
                        </button>
                        <button
                            className="auth-submit"
                            onClick={() => {
                                if (showForm) {
                                    closeForm();
                                } else {
                                    openCreateForm();
                                    setShowAiForm(false);
                                }
                            }}
                        >
                            {showForm ? 'Kapat' : '+ Yeni Kart'}
                        </button>
                    </div>
                )}
            </header>

            {reviewMode ? (
                <FlashcardReviewSession cards={reviewCards} onRate={handleRate} onFinish={handleFinishReview} />
            ) : (
                <>
                    {dueCards.length > 0 && (
                        <div className="due-review-banner">
                            <span>Bugün tekrar edilecek <strong>{dueCards.length}</strong> kartın var.</span>
                            <button className="auth-submit" onClick={() => startReview(dueCards)}>
                                Tekrarı Başlat
                            </button>
                        </div>
                    )}

                    {showAiForm && (
                        <AiGenerateForm onGenerate={handleGenerate} onCancel={() => setShowAiForm(false)} />
                    )}

                    {showForm && <FlashcardForm initialCard={editingCard} onSubmit={handleSubmit} onCancel={closeForm} />}

                    <div className="flashcards-filters">
                        <select name="subject" value={filters.subject} onChange={handleFilterChange}>
                            <option value="">Tüm Branşlar</option>
                            {EXAM_SUBJECTS.map((specialty) => (
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
                        <label className="flashcards-review-filter">
                            <input
                                type="checkbox"
                                checked={filters.needsReview}
                                onChange={(event) =>
                                    setFilters((prev) => ({ ...prev, needsReview: event.target.checked }))
                                }
                            />
                            Sadece Hata Kutusu ★
                        </label>
                        <label className="flashcards-review-filter">
                            <input
                                type="checkbox"
                                checked={filters.isAiGenerated}
                                onChange={(event) =>
                                    setFilters((prev) => ({ ...prev, isAiGenerated: event.target.checked }))
                                }
                            />
                            Sadece AI Üretimi
                        </label>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    {loading ? (
                        <p className="flashcards-status">Yükleniyor...</p>
                    ) : cards.length === 0 ? (
                        <p className="flashcards-status">
                            {filters.needsReview
                                ? 'Hata kutusu boş. Zorlandığın kartları yıldızlayarak buraya ekleyebilirsin.'
                                : filters.isAiGenerated
                                ? 'AI ile üretilmiş kart yok. "AI ile Soru Üret" ile oluşturabilirsin.'
                                : 'Henüz kart yok. Yukarıdan ilk kartını ekle!'}
                        </p>
                    ) : (
                        <div className="flashcards-grid">
                            {cards.map((card) => (
                                <FlashcardStudy
                                    key={card.id}
                                    card={card}
                                    onDelete={handleDelete}
                                    onEdit={openEditForm}
                                    onToggleReview={handleToggleReview}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default FlashcardsPage;
