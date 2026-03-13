import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function AIInsights({ data, selectedModel, selectedTimeframe, realInsight }) {
  const [insightText, setInsightText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!data || data.length === 0 || !realInsight) {
      setInsightText("รอรับข้อมูลเพื่อวิเคราะห์ผลเชิงลึก...");
      return;
    }

    setIsTyping(true);
    setInsightText("");
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      setInsightText((prev) => prev + realInsight[currentIndex]);
      currentIndex++;
      
      if (currentIndex >= realInsight.length - 1) { 
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 15); // Slightly faster typing for longer insights

    return () => clearInterval(interval);
  }, [data, selectedModel, selectedTimeframe, realInsight]);

  // Real insights are provided directly from the backend

  return (
    <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.4s', marginTop: '1.5rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '200px', height: '200px', background: 'var(--primary-glow)', borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none' }}></div>
      
      <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem' }}>
        <Sparkles size={20} color="#f59e0b" /> สรุปผลการพยากรณ์จาก AI
      </h3>
      
      <div style={{ 
        lineHeight: '1.7', 
        color: 'var(--text-main)', 
        fontSize: '1.05rem',
        minHeight: '100px',
        borderLeft: '3px solid var(--primary-color)',
        paddingLeft: '1rem',
        fontStyle: 'italic',
        background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.05) 0%, transparent 100%)',
        padding: '1rem 1rem 1rem 1.5rem',
        borderRadius: '0 8px 8px 0'
      }}>
        {insightText}
        {isTyping && <span style={{ display: 'inline-block', width: '8px', height: '16px', background: 'var(--primary-color)', marginLeft: '4px', animation: 'pulse-glow 1s infinite' }}></span>}
      </div>
    </div>
  );
}
