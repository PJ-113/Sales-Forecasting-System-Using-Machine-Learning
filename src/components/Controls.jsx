import React from 'react';
import { Settings2 } from 'lucide-react';

export default function Controls({ 
  selectedModel, setSelectedModel, 
  selectedTimeframe, setSelectedTimeframe,
  isPredicting,
  rmse,
  mape
}) {
  return (
    <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.2s', marginTop: '1.5rem' }}>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Settings2 size={24} color="var(--secondary-color)" /> การตั้งค่า
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            เลือกโมเดลพยากรณ์
          </label>
          <select 
            className="select-modern" 
            style={{ width: '100%', opacity: isPredicting ? 0.5 : 1, cursor: isPredicting ? 'not-allowed' : 'pointer' }}
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={isPredicting}
          >
            <option value="LightGBM">LightGBM (Tree-based)</option>
            <option value="SARIMAX">SARIMAX (Statistical)</option>
            <option value="Prophet">Prophet (Additive)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ความละเอียดช่วงเวลา
          </label>
          <select 
            className="select-modern" 
            style={{ width: '100%', opacity: isPredicting ? 0.5 : 1, cursor: isPredicting ? 'not-allowed' : 'pointer' }}
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            disabled={isPredicting}
          >
            <option value="Daily">รายวัน (Daily)</option>
            <option value="Weekly">รายสัปดาห์ (Weekly)</option>
            <option value="Monthly">รายเดือน (Monthly)</option>
          </select>
        </div>
        
        <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>ค่าประเมินโมเดล (Evaluation):</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>RMSE</span>
            <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>
              {rmse != null ? rmse.toFixed(2) : '-'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>MAPE</span>
            <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>
              {mape != null ? `${mape.toFixed(1)}%` : '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
