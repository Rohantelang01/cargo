"use client";

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface EarningsChartProps {
  data: any[];
}

export function EarningsChart({ data }: EarningsChartProps) {
  // Process data for the chart (group by date)
  const chartData = data.reduce((acc: any[], curr: any) => {
    const date = new Date(curr.timestamp).toLocaleDateString('en-US', { weekday: 'short' });
    const existing = acc.find(item => item.name === date);
    if (existing) {
      existing.amount += curr.amount;
    } else {
      acc.push({ name: date, amount: curr.amount });
    }
    return acc;
  }, []);

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#888888' }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#888888' }}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip 
            cursor={{ fill: '#88888810' }}
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              borderColor: 'hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            itemStyle={{ color: 'hsl(var(--primary))' }}
            formatter={(value) => [`₹${value}`, 'Earnings']}
          />
          <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="hsl(var(--primary))" fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
