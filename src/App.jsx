import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import axios from 'axios';
import DataImport from './components/DataImport';
import Controls from './components/Controls';
import ForecastChart from './components/ForecastChart';
import AIInsights from './components/AIInsights';

// The URL where the FastAPI backend will be running
const API_URL = 'http://127.0.0.1:8000/api/forecast';

function App() {
  const [rawFile, setRawFile] = useState(null);
  const [selectedModel, setSelectedModel] = useState('Prophet'); // Defaulting to the real one
  const [selectedTimeframe, setSelectedTimeframe] = useState('Daily');
  
  const [chartData, setChartData] = useState([]);
  const [realInsight, setRealInsight] = useState('');
  const [metrics, setMetrics] = useState({ rmse: null, mape: null });
  const [isPredicting, setIsPredicting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Trigger backend prediction whenever file, model, or timeframe changes
  useEffect(() => {
    if (!rawFile) return;

    const fetchForecast = async () => {
      setIsPredicting(true);
      // Reset current insights & metrics while loading
      setRealInsight(''); 
      setMetrics({ rmse: null, mape: null });
      
      const formData = new FormData();
      formData.append('file', rawFile);
      
      try {
        setErrorMsg(''); // clear previous error
        const response = await axios.post(API_URL, formData, {
          params: {
            model_type: selectedModel,
            timeframe: selectedTimeframe
          },
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });

        if (response.data) {
          setChartData(response.data.chartData || []);
          setRealInsight(response.data.insight || '');
          setMetrics({
            rmse: response.data.rmse ?? null,
            mape: response.data.mape ?? null,
          });
        }
      } catch (error) {
        console.error("Error fetching forecast:", error);
        let msg = error.response?.data?.error || error.message || 'Unknown error';
        if (msg === 'Network Error') {
          msg = `Cannot connect to backend at ${API_URL}`;
        }
        setErrorMsg(msg);
        alert(`Prediction failed: ${msg}. Is the backend server running?`);
      } finally {
        setIsPredicting(false);
      }
    };

    fetchForecast();
  }, [rawFile, selectedModel, selectedTimeframe]);

  const handleDataLoaded = (file) => {
    setRawFile(file);
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div>
          <h1 className="heading-gradient" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', margin: '0' }}>
            <Activity color="var(--primary-color)" /> ระบบคาดการณ์ยอดขาย
          </h1>
        </div>

        <Controls 
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          selectedTimeframe={selectedTimeframe}
          setSelectedTimeframe={setSelectedTimeframe}
          isPredicting={isPredicting}
          rmse={metrics.rmse}
          mape={metrics.mape}
        />

      </aside>

      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        {errorMsg && (
          <div style={{
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            <strong>ข้อผิดพลาด:</strong> {errorMsg}
          </div>
        )}
          <div>
            <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.25rem 0' }}>แดชบอร์ดคาดการณ์ยอดขาย</h2>
          </div>
        </header>

        <div className="dashboard-grid">
          <div className="col-span-full">
            <DataImport onDataLoaded={handleDataLoaded} isPredicting={isPredicting} />
          </div>

          <div className="col-span-8">
            <ForecastChart 
              data={chartData} 
              selectedModel={selectedModel} 
            />
          </div>

          <div className="col-span-4">
            <AIInsights 
              data={chartData} 
              selectedModel={selectedModel} 
              selectedTimeframe={selectedTimeframe} 
              realInsight={realInsight}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
