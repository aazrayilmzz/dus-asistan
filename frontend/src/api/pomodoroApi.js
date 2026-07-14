import axiosClient from './axiosClient';

export async function startSession(data) {
    const response = await axiosClient.post('/pomodoro/start', data);
    return response.data.data;
}

export async function completeSession(id) {
    const response = await axiosClient.patch(`/pomodoro/${id}/complete`);
    return response.data.data;
}

export async function abandonSession(id) {
    const response = await axiosClient.patch(`/pomodoro/${id}/abandon`);
    return response.data.data;
}

export async function getActiveSession() {
    const response = await axiosClient.get('/pomodoro/active');
    return response.data.data;
}

export async function getHistory() {
    const response = await axiosClient.get('/pomodoro');
    return response.data.data;
}

export async function getStreak() {
    const response = await axiosClient.get('/pomodoro/streak');
    return response.data.data;
}
