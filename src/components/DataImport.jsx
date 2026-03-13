import React, { useState } from 'react';
import { UploadCloud, FileText, Loader } from 'lucide-react';

export default function DataImport({ onDataLoaded, isPredicting }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [fileName, setFileName] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    setFileName(file.name);
    // Instead of parsing locally, pass the raw File object up to App.jsx to be sent to backend
    onDataLoaded(file);
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <UploadCloud size={24} color="var(--primary-color)" /> นำเข้าข้อมูล (Data Import)
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        อัปโหลดไฟล์ข้อมูลยอดขายย้อนหลัง (CSV) เพื่อฝึกสอนโมเดลและพยากรณ์ผล
      </p>
      
      <div 
        className={`input-file-zone ${isDragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept=".csv" 
          id="file-upload" 
          style={{ display: 'none' }} 
          onChange={handleChange}
          disabled={isPredicting}
        />
        <label htmlFor="file-upload" style={{ cursor: isPredicting ? 'not-allowed' : 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          {isPredicting ? (
            <>
              <Loader size={48} color="var(--primary-color)" className="animate-spin" style={{ animation: 'spin 2s linear infinite' }} />
              <div style={{ color: 'var(--text-main)', fontWeight: '500' }}>กำลังฝึกสอนโมเดลและพยากรณ์ข้อมูล...</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>กรุณารอสักครู่ อาจใช้เวลาประมาณ 2-3 วินาที</div>
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </>
          ) : fileName ? (
            <>
              <FileText size={48} color="var(--secondary-color)" />
              <div style={{ color: 'var(--text-main)', fontWeight: '500' }}>{fileName}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>คลิกหรือลากไฟล์ใหม่มาวางเพื่อเปลี่ยนไฟล์</div>
            </>
          ) : (
            <>
              <UploadCloud size={48} color="var(--text-muted)" />
              <div style={{ color: 'var(--text-main)', fontWeight: '500' }}>ลากไฟล์ CSV มาวางที่นี่</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>หรือคลิกเพื่อเลือกไฟล์จากคอมพิวเตอร์ของคุณ</div>
            </>
          )}
        </label>
      </div>
    </div>
  );
}
