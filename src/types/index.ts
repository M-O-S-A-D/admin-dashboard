export interface VLMEvent {
  eventId: string;
  cameraId: string;
  cameraName: string;
  timestamp: string;
  type: 'CRITICAL' | 'ANOMALY' | 'ACCESS' | 'VEHICLE' | 'OBJECT_MATCH' | 'MOTION' | 'AUDIT';
  title: string;
  description: string;
  confidence?: number;
  imageKey?: string;   // S3 object key for the frame image
  imageUrl?: string;   // Pre-signed S3 URL (populated at runtime)
  location?: string;
  acknowledged?: boolean;
  tags?: string[];
}

export interface Camera {
  cameraId: string;
  name: string;
  location: string;
  rtspUrl: string;
  status: 'LIVE' | 'OFFLINE' | 'SECURE' | 'MOTION';
  vlmActive: boolean;
  lastDescription?: string;
  lastUpdated?: string;
}

export interface ArchiveClip {
  clipId: string;
  cameraId: string;
  cameraName: string;
  timestamp: string;
  duration: number;          // seconds
  type: 'EVENT' | 'MOTION' | 'AUDIT';
  location: string;
  matchScore?: number;       // 0-100 VLM match confidence
  vlmDescription?: string;
  imageKey?: string;
  imageUrl?: string;
  tags?: string[];
}

export interface AnalyticsData {
  totalDetections: number;
  detectionsDelta: number;    // % change vs last 7 days
  securityThreats: number;
  threatsDelta: number;
  objectConfidence: number;   // system-wide avg %
  vlmInferenceMs: number;
  detectionTrend: { time: string; human: number; vehicle: number }[];
  topCategories: { name: string; count: number }[];
  heatmapData: number[][];    // 10x10 grid of activity intensity 0-1
  recentFlagged: VLMEvent[];
}

export interface SystemStatus {
  activeCameras: number;
  totalCameras: number;
  systemHealth: number;        // %
  latencyMs: number;
  storageUsedTB: number;
  storageCapacityPct: number;
  vlmInferenceActive: boolean;
  version: string;
}
