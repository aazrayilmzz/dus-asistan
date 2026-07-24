import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

function WeeklySubjectChart({ bySubject }) {
    const data = bySubject.map((row) => ({ subject: row.subject, count: row.count }));

    return (
        <div className="exam-chart-wrapper">
            <h2 className="exam-chart-title">Bu Hafta Branş Bazında Çözülen Soru</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 8, right: 16, bottom: 70, left: -16 }} barCategoryGap="28%">
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
                    <Bar dataKey="count" name="Soru" fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default WeeklySubjectChart;
