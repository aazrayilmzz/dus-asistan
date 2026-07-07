export default function getErrorMessage(error) {
    return error.response?.data?.message || 'Bir hata oluştu, lütfen tekrar deneyin.';
}
