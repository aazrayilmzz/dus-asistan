import axiosClient from './axiosClient';

export async function getStreak() {
    const response = await axiosClient.get('/stats/streak');
    return response.data.data;
}

export async function getWeeklySummary() {
    const response = await axiosClient.get('/stats/weekly-summary');
    return response.data.data;
}
