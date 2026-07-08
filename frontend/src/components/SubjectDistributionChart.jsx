import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

function SubjectDistributionChart({ summary }) {
    const data = summary.map((row) => ({
        subject: row.subject,
        correct: Number(row.correct_count),
        wrong: Number(row.wrong_count),
    }));

    return (
        <div className="exam-chart-wrapper">
            <h2 className="exam-chart-title">Branş Bazında Doğru / Yanlış Dağılımı</h2>
            <ResponsiveContainer width="100%" height={340}>
                <BarChart data={data} margin={{ top: 8, right: 16, bottom: 70, left: -16 }} barGap={4} barCategoryGap="28%">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis
                        dataKey="subject"
                        stroke="var(--text)"
                        tick={{ fill: 'var(--text)', fontSize: 11 }}
                        angle={-40}
                        textAnchor="end"
                        interval={0}
                    />
                    <YAxis stroke="var(--text)" tick={{ fill: 'var(--text)', fontSize: 12 }} allowDecimals={false} />
                    <Tooltip
                        cursor={{ fill: 'var(--border)', opacity: 0.4 }}
                        contentStyle={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border)',
                            borderRadius: 8,
                            color: 'var(--text-h)',
                        }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text)' }} />
                    <Bar dataKey="correct" name="Doğru" fill="#0ca30c" radius={[4, 4, 0, 0]} maxBarSize={20} />
                    <Bar dataKey="wrong" name="Yanlış" fill="#d03b3b" radius={[4, 4, 0, 0]} maxBarSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default SubjectDistributionChart;
