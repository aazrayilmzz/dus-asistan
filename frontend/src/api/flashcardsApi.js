import axiosClient from './axiosClient';

export async function listFlashcards(filters = {}) {
    const response = await axiosClient.get('/flashcards', { params: filters });
    return response.data.data;
}

export async function createFlashcard(data) {
    const response = await axiosClient.post('/flashcards', data);
    return response.data.data;
}

export async function deleteFlashcard(id) {
    await axiosClient.delete(`/flashcards/${id}`);
}
