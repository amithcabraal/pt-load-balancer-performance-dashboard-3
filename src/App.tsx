import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { PerformanceDashboard } from './components/PerformanceDashboard';
import { MenuBar } from './components/MenuBar';
import { LoadBalancerEntry, PerformanceMetricsEntry, DataFormat } from './types';
import { BarChart } from 'lucide-react';

function App() {
  const [data, setData] = useState<LoadBalancerEntry[] | PerformanceMetricsEntry[]>([]);
  const [format, setFormat] = useState<DataFormat | null>(null);

  const handleDataLoaded = (newData: LoadBalancerEntry[] | PerformanceMetricsEntry[], format: DataFormat) => {
    setData(newData);
    setFormat(format);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <MenuBar />
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center space-x-3">
          <BarChart className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-900">
            {format === 'performance' ? 'Performance Metrics Dashboard' : 'Load Balancer Analysis Dashboard'}
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {data.length === 0 ? (
          <FileUpload onDataLoaded={handleDataLoaded} />
        ) : format === 'performance' ? (
          <PerformanceDashboard data={data as PerformanceMetricsEntry[]} />
        ) : (
          <Dashboard data={data as LoadBalancerEntry[]} />
        )}
      </main>
    </div>
  );
}

export default App;