import axiosClient from './axiosClient';

export async function listFlashcards(filters = {}) {
    const response = await axiosClient.get('/flashcards', { params: filters });
    return response.data.data;
}

export async function createFlashcard(data) {
    const response = await axiosClient.post('/flashcards', data);
    return response.data.data;
}

export async function updateFlashcard(id, data) {
    const response = await axiosClient.put(`/flashcards/${id}`, data);
    return response.data.data;
}

export async function deleteFlashcard(id) {
    await axiosClient.delete(`/flashcards/${id}`);
}

export async function reviewFlashcard(id, rating) {
    const response = await axiosClient.patch(`/flashcards/${id}/review`, { rating });
    return response.data.data;
}
