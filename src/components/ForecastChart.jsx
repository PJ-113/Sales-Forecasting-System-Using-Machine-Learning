import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function ForecastChart({ data, selectedModel }) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-panel" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>อัปโหลดข้อมูลเพื่อดูผลการพยากรณ์...</p>
      </div>
    );
  }

  // Custom styling for tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid var(--glass-border)',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
          <p style={{ color: 'white', marginBottom: '0.5rem', fontWeight: '500' }}>{label}</p>
          {payload.map((entry, index) => (
            <div key={index} style={{ color: entry.color, fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <span>{entry.name}:</span>
              <span style={{ fontWeight: 'bold' }}>{Math.round(entry.value).toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.3s', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <TrendingUp size={24} color="var(--primary-color)" /> กราฟเปรียบเทียบยอดขาย ({selectedModel})
      </h2>
      
      <div style={{ flexGrow: 1, minHeight: '350px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="var(--text-muted)" 
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
              tickMargin={10}
            />
            <YAxis 
              stroke="var(--text-muted)" 
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
              tickFormatter={(value) => `${value / 1000}k`}
              tickMargin={10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            
            {/* Historical Data */}
            <Line 
              type="monotone" 
              dataKey="actual" 
              name="ยอดขายที่เกิดขึ้นจริง"
              stroke="#06b6d4" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }} 
            />
            
            {/* Forecast Data */}
            <Line 
              type="monotone" 
              dataKey="forecast" 
              name="ยอดขายพยากรณ์"
              stroke="#6366f1" 
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
