import axiosClient from './axiosClient';

export async function login({ email, password }) {
    const response = await axiosClient.post('/auth/login', { email, password });
    return response.data.data;
}

export async function register({ email, password, fullName, targetSpecialty, targetScore }) {
    const response = await axiosClient.post('/auth/register', {
        email,
        password,
        fullName,
        targetSpecialty: targetSpecialty || undefined,
        targetScore: targetScore || undefined,
    });
    return response.data.data;
}
