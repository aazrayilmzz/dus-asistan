import axiosClient from './axiosClient';

export async function listExams() {
    const response = await axiosClient.get('/exams');
    return response.data.data;
}

export async function createExam(data) {
    const response = await axiosClient.post('/exams', data);
    return response.data.data;
}

export async function updateExam(id, data) {
    const response = await axiosClient.put(`/exams/${id}`, data);
    return response.data.data;
}

export async function deleteExam(id) {
    await axiosClient.delete(`/exams/${id}`);
}
