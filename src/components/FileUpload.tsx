import React from 'react';
import { Upload } from 'lucide-react';
import Papa from 'papaparse';
import { LoadBalancerEntry, PerformanceMetricsEntry, DataFormat } from '../types';

interface FileUploadProps {
  onDataLoaded: (data: LoadBalancerEntry[] | PerformanceMetricsEntry[], format: DataFormat) => void;
}

export function FileUpload({ onDataLoaded }: FileUploadProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transform: (value) => value.trim(),
      complete: (results) => {
        const firstRow = results.data[0] as any;
        
        // Detect the format based on the presence of specific columns
        const isPerformanceFormat = 'base_url' in firstRow && 'min_rt' in firstRow;
        
        if (isPerformanceFormat) {
          const data = results.data
            .filter((row: any) => 
              row.base_url && 
              !isNaN(row.min_rt) && 
              !isNaN(row.max_rt) && 
              !isNaN(row.avg_rt)
            )
            .map((row: any) => ({
              base_url: row.base_url,
              request_verb: row.request_verb,
              min_rt: Number(row.min_rt),
              max_rt: Number(row.max_rt),
              avg_rt: Number(row.avg_rt),
              P25: Number(row.P25),
              P50: Number(row.P50),
              P60: Number(row.P60),
              P75: Number(row.P75),
              P90: Number(row.P90),
              P95: Number(row.P95),
              total: Number(row.total),
              requests: Number(row.requests)
            }));
          onDataLoaded(data, 'performance');
        } else {
          const data = results.data
            .filter((row: any) => 
              row.normalized_url && 
              row.elb_status_code && 
              row.request_verb && 
              row.processing_time_bucket && 
              !isNaN(row.count) && 
              !isNaN(row.total_requests) && 
              !isNaN(row.percentage)
            )
            .map((row: any) => ({
              normalized_url: row.normalized_url,
              elb_status_code: row.elb_status_code,
              request_verb: row.request_verb,
              processing_time_bucket: row.processing_time_bucket,
              count: Number(row.count),
              total_requests: Number(row.total_requests),
              percentage: Number(row.percentage)
            }));
          onDataLoaded(data, 'loadbalancer');
        }
      }
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6">
      <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
        <Upload className="w-12 h-12 text-blue-500 mb-2" />
        <span className="text-lg font-medium text-gray-700">Upload CSV File</span>
        <span className="text-sm text-gray-500 mt-1">Supports both Load Balancer and Performance Metrics formats</span>
        <input
          type="file"
          className="hidden"
          accept=".csv"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  );
}