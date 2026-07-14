const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic();
const MODEL = 'claude-opus-4-8';

function buildSystemPrompt(subject) {
    return `Sen 20 yıldır DUS (Diş Hekimliği Uzmanlık Sınavı) hazırlayan, ${subject} alanında uzman bir öğretim üyesisin.

Kurallar:
- Soruların zorluk seviyesi son 10 yıl DUS ortalamasına yakın olsun.
- Sorular ezber değil klinik yorum ölçsün.
- Her sorunun tek, net bir doğru cevabı olsun.
- Cevabın sonuna kısa bir açıklama ve konunun geçtiği kaynak kitap/bölüm bilgisini ekle.
- Kullanıcının bu branştan zaten sahip olduğu sorularla aynı konuyu veya aynı soru kalıbını tekrar üretme; farklı alt başlıklara odaklan.
- Yanıtı sadece istenen JSON formatında ver, başka açıklama ekleme.`;
}

function buildUserPrompt(subject, count, existingQuestions) {
    const existingList = existingQuestions.length > 0
        ? `Kullanıcının bu branştan zaten sahip olduğu sorular (bunlarla örtüşme):\n${existingQuestions.map((q) => `- ${q}`).join('\n')}`
        : 'Kullanıcının bu branştan henüz kartı yok.';

    return `${subject} branşından ${count} adet çalışma kartı sorusu üret.\n\n${existingList}`;
}

const RESPONSE_SCHEMA = {
    type: 'object',
    properties: {
        questions: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    question: { type: 'string' },
                    answer: { type: 'string' },
                },
                required: ['question', 'answer'],
                additionalProperties: false,
            },
        },
    },
    required: ['questions'],
    additionalProperties: false,
};

async function generateQuestions({ subject, count, existingQuestions }) {
    const response = await client.messages.create({
        model: MODEL,
        max_tokens: 4096,
        system: buildSystemPrompt(subject),
        output_config: {
            format: { type: 'json_schema', schema: RESPONSE_SCHEMA },
        },
        messages: [
            { role: 'user', content: buildUserPrompt(subject, count, existingQuestions) },
        ],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    const parsed = JSON.parse(textBlock.text);
    return parsed.questions;
}

module.exports = { generateQuestions };
