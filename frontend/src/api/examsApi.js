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

export async function getSubjectSummary() {
    const response = await axiosClient.get('/exams/subjects/summary');
    return response.data.data;
}

export async function createSubjectResult(examId, data) {
    const response = await axiosClient.post(`/exams/${examId}/subjects`, data);
    return response.data.data;
}

export async function listSubjectResults(examId) {
    const response = await axiosClient.get(`/exams/${examId}/subjects`);
    return response.data.data;
}

export async function updateSubjectResult(id, data) {
    const response = await axiosClient.put(`/exams/subjects/${id}`, data);
    return response.data.data;
}

export async function deleteSubjectResult(id) {
    await axiosClient.delete(`/exams/subjects/${id}`);
}
