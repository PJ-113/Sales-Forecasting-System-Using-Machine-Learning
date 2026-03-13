import React, { useMemo } from 'react';
import {
  ComposedChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

/* ─── Custom Tooltip ─────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(10, 15, 30, 0.95)',
      border: '1px solid rgba(255,255,255,0.12)',
      padding: '0.85rem 1.1rem',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      minWidth: '200px',
    }}>
      <p style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
        📅 {label}
      </p>
      {payload.map((entry, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: '1.5rem', marginBottom: i < payload.length - 1 ? '0.35rem' : 0
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1', fontSize: '0.85rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: entry.color, display: 'inline-block' }} />
            {entry.name}
          </span>
          <span style={{ fontWeight: '700', color: entry.color, fontSize: '0.95rem', fontFamily: 'Outfit, sans-serif' }}>
            {Number(entry.value).toLocaleString('th-TH', { maximumFractionDigits: 0 })}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ─── Custom Legend ──────────────────────────────────────────────── */
const CustomLegend = ({ payload }) => (
  <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', paddingTop: '1rem' }}>
    {payload?.map((entry, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#94a3b8' }}>
        <span style={{
          display: 'inline-block', width: 24, height: 3,
          background: entry.color,
          borderRadius: 2,
          ...(entry.value === 'ยอดขายพยากรณ์' ? { backgroundImage: `repeating-linear-gradient(to right, ${entry.color} 0, ${entry.color} 5px, transparent 5px, transparent 9px)`, background: 'none' } : {})
        }} />
        {entry.value}
      </div>
    ))}
  </div>
);

/* ─── Stat Badge ─────────────────────────────────────────────────── */
const StatBadge = ({ label, value, color, trend }) => {
  const Icon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '10px', padding: '0.6rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.2rem'
    }}>
      <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        <span style={{ fontSize: '1.05rem', fontWeight: '700', color, fontFamily: 'Outfit, sans-serif' }}>{value}</span>
        {trend && <Icon size={14} color={trend === 'up' ? '#34d399' : trend === 'down' ? '#f87171' : '#94a3b8'} />}
      </div>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────── */
export default function ForecastChart({ data, selectedModel }) {

  /* Find first forecast point (where actual ends, forecast begins) */
  const forecastStartDate = useMemo(() => {
    const idx = data?.findIndex(d => d.actual == null && d.forecast != null);
    return idx > 0 ? data[idx]?.date : null;
  }, [data]);

  /* Summary stats */
  const stats = useMemo(() => {
    if (!data?.length) return null;
    const actuals = data.filter(d => d.actual != null).map(d => d.actual);
    const forecasts = data.filter(d => d.forecast != null).map(d => d.forecast);
    const avg = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    const maxForecast = forecasts.length ? Math.max(...forecasts) : null;
    const minForecast = forecasts.length ? Math.min(...forecasts) : null;
    const avgActual = avg(actuals);
    const avgForecast = avg(forecasts);
    const delta = avgActual ? ((avgForecast - avgActual) / avgActual) * 100 : 0;
    return { maxForecast, minForecast, avgForecast, delta };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="glass-panel" style={{ height: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <TrendingUp size={40} color="rgba(99,102,241,0.3)" />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>อัปโหลดข้อมูลเพื่อดูผลการพยากรณ์...</p>
      </div>
    );
  }

  return (
    <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.3s', height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem' }}>
          <TrendingUp size={22} color="var(--primary-color)" />
          กราฟเปรียบเทียบยอดขาย
          <span style={{
            background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
            color: '#a5b4fc', fontSize: '0.72rem', padding: '0.2rem 0.65rem',
            borderRadius: '99px', fontWeight: '500', letterSpacing: '0.04em'
          }}>{selectedModel}</span>
        </h2>

        {/* Stat badges */}
        {stats && (
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <StatBadge
              label="พยากรณ์สูงสุด"
              value={stats.maxForecast?.toLocaleString('th-TH', { maximumFractionDigits: 0 })}
              color="#6366f1"
              trend="up"
            />
            <StatBadge
              label="พยากรณ์ต่ำสุด"
              value={stats.minForecast?.toLocaleString('th-TH', { maximumFractionDigits: 0 })}
              color="#06b6d4"
              trend="down"
            />
            <StatBadge
              label="แนวโน้มเฉลี่ย"
              value={`${stats.delta >= 0 ? '+' : ''}${stats.delta.toFixed(1)}%`}
              color={stats.delta >= 0 ? '#34d399' : '#f87171'}
              trend={stats.delta > 0 ? 'up' : stats.delta < 0 ? 'down' : null}
            />
          </div>
        )}
      </div>

      {/* Chart */}
      <div style={{ flexGrow: 1, minHeight: '320px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="gradForecast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              stroke="transparent"
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              interval="preserveStartEnd"
            />

            <YAxis
              stroke="transparent"
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={v => {
                if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
                if (v >= 1_000) return `${(v / 1_000).toFixed(0)}k`;
                return v;
              }}
              width={48}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.12)', strokeWidth: 1 }} />
            <Legend content={<CustomLegend />} />

            {/* Reference line at forecast start */}
            {forecastStartDate && (
              <ReferenceLine
                x={forecastStartDate}
                stroke="rgba(251,146,60,0.6)"
                strokeDasharray="4 3"
                strokeWidth={1.5}
                label={{
                  value: 'เริ่มพยากรณ์',
                  position: 'insideTopRight',
                  fill: '#fb923c',
                  fontSize: 11,
                  fontFamily: 'Inter, sans-serif',
                  dy: -4,
                }}
              />
            )}

            {/* Actual area + line */}
            <Area
              type="monotone"
              dataKey="actual"
              name="ยอดขายที่เกิดขึ้นจริง"
              stroke="#06b6d4"
              strokeWidth={2.5}
              fill="url(#gradActual)"
              dot={false}
              activeDot={{ r: 5, fill: '#06b6d4', stroke: '#0f172a', strokeWidth: 2 }}
              connectNulls={false}
            />

            {/* Forecast area + dashed line */}
            <Area
              type="monotone"
              dataKey="forecast"
              name="ยอดขายพยากรณ์"
              stroke="#6366f1"
              strokeWidth={2.5}
              strokeDasharray="6 4"
              fill="url(#gradForecast)"
              dot={false}
              activeDot={{ r: 5, fill: '#6366f1', stroke: '#0f172a', strokeWidth: 2 }}
              connectNulls={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
