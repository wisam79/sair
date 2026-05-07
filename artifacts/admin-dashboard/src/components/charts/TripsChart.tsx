'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TripsChartProps {
  data: Array<{ date: string; trips: number }>;
}

export const TripsChart: React.FC<TripsChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip formatter={(value: any) => `${Number(value)} رحلة`} />
      <Bar dataKey="trips" fill="#0D2847" />
    </BarChart>
  </ResponsiveContainer>
);
