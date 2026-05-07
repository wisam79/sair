'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SubscriptionsChartProps {
  data: Array<{ name: string; value: number }>;
}

const COLORS = ['#0D2847', '#FF6B35', '#94A3B8'];

export const SubscriptionsChart: React.FC<SubscriptionsChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie data={data} cx="50%" cy="50%" labelLine={false} label outerRadius={80} fill="#8884d8" dataKey="value">
        {data.map((_entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip formatter={(value: any) => `${Number(value)} اشتراك`} />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);
