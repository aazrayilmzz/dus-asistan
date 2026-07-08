import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

function formatDate(isoDate) {
    const [year, month, day] = isoDate.split('-');
    return `${day}.${month}`;
}

function ExamProgressChart({ exams }) {
    const data = [...exams]
        .sort((a, b) => (a.exam_date < b.exam_date ? -1 : 1))
        .map((exam) => ({
            date: formatDate(exam.exam_date),
            examName: exam.exam_name,
            correct: Number(exam.correct_count),
            wrong: Number(exam.wrong_count),
            net: Number(exam.net),
        }));

    return (
        <div className="exam-chart-wrapper">
            <h2 className="exam-chart-title">Net Gelişimi</h2>
            <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" stroke="var(--text)" tick={{ fill: 'var(--text)', fontSize: 12 }} />
                    <YAxis stroke="var(--text)" tick={{ fill: 'var(--text)', fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border)',
                            borderRadius: 8,
                            color: 'var(--text-h)',
                        }}
                        labelFormatter={(_, payload) => payload?.[0]?.payload?.examName ?? ''}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text)' }} />
                    <Line
                        type="monotone"
                        dataKey="correct"
                        name="Doğru"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="wrong"
                        name="Yanlış"
                        stroke="var(--error)"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="net"
                        name="Net"
                        stroke="var(--accent)"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default ExamProgressChart;
