import axiosClient from './axiosClient';

export async function login({ email, password }) {
    const response = await axiosClient.post('/auth/login', { email, password });
    return response.data.data;
}

export async function register({ email, password, fullName, targetSpecialty, targetScore, targetExamDate }) {
    const response = await axiosClient.post('/auth/register', {
        email,
        password,
        fullName,
        targetSpecialty: targetSpecialty || undefined,
        targetScore: targetScore || undefined,
        targetExamDate: targetExamDate || undefined,
    });
    return response.data.data;
}

export async function updateProfile({ targetExamDate }) {
    const response = await axiosClient.patch('/auth/me', { targetExamDate });
    return response.data.data;
}
