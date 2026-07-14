export const DAILY_TIPS = [
    'Süt dişlenmesi toplam 20 dişten oluşur, kalıcı dişlenme ise 32 dişe kadar çıkabilir (20 yaş dişleri dahil).',
    'Aktif hatırlama (kitaba bakmadan kendi kendine soru sorma), tekrar okumaktan çok daha kalıcı öğrenme sağlar.',
    'Pulpa, dişin sinir ve damarlarını barındıran en iç tabakadır; mine ve dentin tarafından korunur.',
    'Pomodoro tekniğinde kısa molalar sadece dinlenme değil, öğrenilen bilginin pekişmesi için de gereklidir.',
    'Periodontal ligament, dişi alveolar kemiğe bağlayan ve çiğneme kuvvetlerini absorbe eden bağ dokusudur.',
    'Karışık zorlukta soru çözmek (interleaving), aynı konudan art arda soru çözmekten daha kalıcı öğrenme sağlar.',
    'Mine, vücuttaki en sert doku olmasına rağmen kendini yenileyemez — bu yüzden koruyucu önlemler kritik önemdedir.',
    'Düzenli, kısa aralıklarla tekrar (spaced repetition), bilgiyi uzun süreli belleğe aktarmanın en etkili yollarından biridir.',
    'Trigeminal sinir (V. kraniyal sinir), yüzdeki ve çene bölgesindeki duyusal innervasyonun büyük kısmından sorumludur.',
    'Çalışırken düzenli uyku, tekrar sayısından çok daha fazla hatırlama performansını etkiler.',
    'Oklüzyon, üst ve alt dişlerin kapanış ilişkisini ifade eder ve ortodontik değerlendirmenin temelini oluşturur.',
    'Zor bir konuyu kendi cümlelerinle birine anlatmayı denemek (Feynman tekniği), eksik noktaları hızla ortaya çıkarır.',
];

function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diffMs = date - start;
    return Math.floor(diffMs / (24 * 60 * 60 * 1000));
}

export function getTipOfTheDay() {
    const index = getDayOfYear(new Date()) % DAILY_TIPS.length;
    return DAILY_TIPS[index];
}
