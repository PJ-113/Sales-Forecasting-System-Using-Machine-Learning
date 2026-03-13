import React, { useEffect, useState } from 'react';
import { Activity, TrendingUp, BarChart2, Brain, ArrowRight, Zap, Shield, Database } from 'lucide-react';

const features = [
  {
    icon: <TrendingUp size={28} color="#6366f1" />,
    title: 'คาดการณ์ยอดขาย',
    desc: 'ใช้โมเดล Prophet และ Machine Learning เพื่อพยากรณ์ยอดขายล่วงหน้าได้อย่างแม่นยำ',
  },
  {
    icon: <Brain size={28} color="#06b6d4" />,
    title: 'AI Insights อัจฉริยะ',
    desc: 'วิเคราะห์แนวโน้ม ฤดูกาล และรูปแบบการขายด้วย AI อัตโนมัติ',
  },
  {
    icon: <BarChart2 size={28} color="#a78bfa" />,
    title: 'แดชบอร์ดแบบโต้ตอบ',
    desc: 'ดูกราฟและผลลัพธ์แบบ Real-time พร้อมประเมินผลด้วยค่า RMSE และ MAPE',
  },
  {
    icon: <Database size={28} color="#34d399" />,
    title: 'รองรับข้อมูล CSV',
    desc: 'อัปโหลดไฟล์ข้อมูลยอดขายของคุณได้ง่ายๆ ระบบจะประมวลผลให้อัตโนมัติ',
  },
  {
    icon: <Zap size={28} color="#fb923c" />,
    title: 'ประมวลผลรวดเร็ว',
    desc: 'Backend FastAPI ประมวลผลและส่งผลการพยากรณ์กลับมาภายในไม่กี่วินาที',
  },
  {
    icon: <Shield size={28} color="#f472b6" />,
    title: 'แม่นยำและเชื่อถือได้',
    desc: 'ผ่านการทดสอบด้วยชุดข้อมูลจริง เพื่อให้ผลลัพธ์ที่น่าเชื่อถือสำหรับการตัดสินใจธุรกิจ',
  },
];

export default function HomePage({ onStart }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="home-page" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease' }}>
      {/* Animated background orbs */}
      <div className="home-orb home-orb-1" />
      <div className="home-orb home-orb-2" />
      <div className="home-orb home-orb-3" />

      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-badge animate-fade-in">
          <Activity size={14} />
          <span>Sales Forecasting System · Powered by Prophet ML</span>
        </div>

        <h1 className="home-title animate-fade-in" style={{ animationDelay: '0.1s' }}>
          คาดการณ์ยอดขาย<br />
          <span className="heading-gradient">ด้วย Machine Learning</span>
        </h1>

        <p className="home-subtitle animate-fade-in" style={{ animationDelay: '0.2s' }}>
          ระบบวิเคราะห์และพยากรณ์ยอดขายอัจฉริยะ ใช้เทคโนโลยี AI ชั้นนำ<br />
          เพื่อช่วยธุรกิจของคุณวางแผนและตัดสินใจได้อย่างมั่นใจ
        </p>

        <div className="home-cta animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <button className="btn btn-primary home-btn-start" onClick={onStart}>
            เริ่มใช้งานเลย
            <ArrowRight size={18} />
          </button>
          <div className="home-stat-row">
            <div className="home-stat">
              <span className="home-stat-value">Prophet</span>
              <span className="home-stat-label">ML Model</span>
            </div>
            <div className="home-stat-divider" />
            <div className="home-stat">
              <span className="home-stat-value">30 วัน</span>
              <span className="home-stat-label">ล่วงหน้า</span>
            </div>
            <div className="home-stat-divider" />
            <div className="home-stat">
              <span className="home-stat-value">Real-time</span>
              <span className="home-stat-label">ผลลัพธ์</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="home-features">
        <h2 className="home-section-title animate-fade-in" style={{ animationDelay: '0.4s' }}>
          ความสามารถของระบบ
        </h2>
        <div className="home-grid animate-fade-in" style={{ animationDelay: '0.5s' }}>
          {features.map((f, i) => (
            <div key={i} className="glass-panel home-feature-card" style={{ animationDelay: `${0.5 + i * 0.08}s` }}>
              <div className="home-feature-icon">{f.icon}</div>
              <h3 className="home-feature-title">{f.title}</h3>
              <p className="home-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer call-to-action */}
      <section className="home-footer-cta animate-fade-in" style={{ animationDelay: '0.9s' }}>
        <div className="glass-panel home-cta-card">
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>พร้อมเริ่มต้นแล้วหรือยัง?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            อัปโหลดข้อมูลยอดขายของคุณและรับผลการพยากรณ์ภายในไม่กี่วินาที
          </p>
          <button className="btn btn-primary home-btn-start" onClick={onStart}>
            ไปยังแดชบอร์ด
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
