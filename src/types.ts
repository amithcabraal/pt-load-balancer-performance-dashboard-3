export interface LoadBalancerEntry {
  normalized_url: string;
  elb_status_code: string;
  request_verb: string;
  processing_time_bucket: string;
  count: number;
  total_requests: number;
  percentage: number;
}

export interface PerformanceMetricsEntry {
  base_url: string;
  request_verb: string;
  min_rt: number;
  max_rt: number;
  avg_rt: number;
  P25: number;
  P50: number;
  P60: number;
  P75: number;
  P90: number;
  P95: number;
  total: number;
  requests: number;
}

export type DataFormat = 'loadbalancer' | 'performance';

export interface ChartData {
  name: string;
  value: number;
}