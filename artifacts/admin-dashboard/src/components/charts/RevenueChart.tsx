'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
  data: Array<{ date: string; revenue: number }>;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip formatter={(value: any) => `${Number(value).toLocaleString()} IQD`} />
      <Line type="monotone" dataKey="revenue" stroke="#0D2847" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
);
