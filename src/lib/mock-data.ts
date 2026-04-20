/**
 * Mock data used when AWS credentials are not configured.
 * Replace with real DynamoDB/S3 data in production.
 */
import type { VLMEvent, Camera, ArchiveClip, AnalyticsData, SystemStatus } from '@/types';

export const MOCK_CAMERAS: Camera[] = [
  {
    cameraId: 'cam-01',
    name: 'Main Entrance',
    location: 'Entrance',
    rtspUrl: 'rtsp://192.168.1.101:554/stream',
    status: 'LIVE',
    vlmActive: true,
    lastDescription: 'Main Lobby. 2 persons detected. Tracking subject in blue jacket near reception desk. Behavior normal.',
    lastUpdated: new Date().toISOString(),
  },
  {
    cameraId: 'cam-04',
    name: 'Warehouse Aisle 4',
    location: 'Warehouse',
    rtspUrl: 'rtsp://192.168.1.104:554/stream',
    status: 'MOTION',
    vlmActive: true,
    lastDescription: 'Aisle 4. Forklift operation in progress. Unexpected pallet placement detected in restricted zone.',
    lastUpdated: new Date().toISOString(),
  },
  {
    cameraId: 'cam-07',
    name: 'Retail Floor',
    location: 'Retail Floor',
    rtspUrl: 'rtsp://192.168.1.107:554/stream',
    status: 'LIVE',
    vlmActive: true,
    lastDescription: 'Store Floor. High traffic density at checkout 1. Estimated 12 customers in queue.',
    lastUpdated: new Date().toISOString(),
  },
  {
    cameraId: 'cam-09',
    name: 'Loading Dock 2',
    location: 'Loading Dock',
    rtspUrl: 'rtsp://192.168.1.109:554/stream',
    status: 'LIVE',
    vlmActive: true,
    lastDescription: 'Dock 2. White logistics truck docked. Loading procedures 40% complete.',
    lastUpdated: new Date().toISOString(),
  },
  {
    cameraId: 'cam-11',
    name: 'Data Center North',
    location: 'Server Room',
    rtspUrl: 'rtsp://192.168.1.111:554/stream',
    status: 'SECURE',
    vlmActive: true,
    lastDescription: 'Data Center North. No personnel present. Rack temperatures within optimal range.',
    lastUpdated: new Date().toISOString(),
  },
  {
    cameraId: 'cam-15',
    name: 'External Parking',
    location: 'Parking',
    rtspUrl: 'rtsp://192.168.1.115:554/stream',
    status: 'LIVE',
    vlmActive: true,
    lastDescription: 'External Parking. 45 vehicles present. Lighting levels adequate. Rain starting to accumulate.',
    lastUpdated: new Date().toISOString(),
  },
];

export const MOCK_EVENTS: VLMEvent[] = [
  {
    eventId: 'evt-001',
    cameraId: 'cam-09',
    cameraName: 'Perimeter Sector 4',
    timestamp: new Date(Date.now() - 30000).toISOString(),
    type: 'CRITICAL',
    title: 'Intrusion Detected',
    description: 'Person climbing perimeter fence at Sector 4.',
    confidence: 94.2,
    location: 'Perimeter Sector 4',
    acknowledged: false,
  },
  {
    eventId: 'evt-002',
    cameraId: 'cam-01',
    cameraName: 'Main Entrance',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    type: 'OBJECT_MATCH',
    title: "VLM Query: 'Red Shirt'",
    description: 'Match found at Main Entrance. Probability: 98.4%',
    confidence: 98.4,
    location: 'Main Entrance',
    acknowledged: false,
    imageKey: 'frames/cam-01/evt-002.jpg',
  },
  {
    eventId: 'evt-003',
    cameraId: 'cam-07',
    cameraName: 'North Lobby',
    timestamp: new Date(Date.now() - 720000).toISOString(),
    type: 'ANOMALY',
    title: 'Unusual Package Left',
    description: 'Unattended black bag detected in North Lobby for > 10 mins.',
    confidence: 87.1,
    location: 'North Lobby',
    acknowledged: false,
  },
  {
    eventId: 'evt-004',
    cameraId: 'cam-11',
    cameraName: 'Main Gate',
    timestamp: new Date(Date.now() - 2700000).toISOString(),
    type: 'ACCESS',
    title: 'Authorized Entry',
    description: 'Staff member ID: #8221 recognized by Face AI.',
    confidence: 99.1,
    location: 'Main Gate',
    acknowledged: true,
  },
  {
    eventId: 'evt-005',
    cameraId: 'cam-15',
    cameraName: 'Gate B',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    type: 'VEHICLE',
    title: 'Gate B Activity',
    description: 'Delivery truck exited facility.',
    confidence: 91.3,
    location: 'Gate B',
    acknowledged: true,
  },
  {
    eventId: 'evt-006',
    cameraId: 'cam-04',
    cameraName: 'Camera 04',
    timestamp: new Date(Date.now() - 4200000).toISOString(),
    type: 'ANOMALY',
    title: 'Loitering Alert',
    description: 'Unrecognized human profile loitering for 2m 40s.',
    confidence: 88.5,
    location: 'Entrance Zone',
    acknowledged: false,
  },
];

export const MOCK_ARCHIVE_CLIPS: ArchiveClip[] = [
  {
    clipId: 'clip-001',
    cameraId: 'cam-15',
    cameraName: 'Entrance Gate',
    timestamp: '2023-10-30T14:22:15Z',
    duration: 12,
    type: 'EVENT',
    location: 'Loading Dock A',
    matchScore: 98,
    vlmDescription: 'A red delivery truck entering the perimeter...',
    tags: ['Vehicles', 'Deliveries'],
  },
  {
    clipId: 'clip-002',
    cameraId: 'cam-04',
    cameraName: 'Warehouse Aisle',
    timestamp: '2023-10-30T11:05:42Z',
    duration: 45,
    type: 'MOTION',
    location: 'Main Floor',
    matchScore: 84,
    vlmDescription: 'Individual wearing a blue reflective vest moving a...',
    tags: ['Staff'],
  },
  {
    clipId: 'clip-003',
    cameraId: 'cam-01',
    cameraName: 'Main Lobby',
    timestamp: '2023-10-30T09:15:00Z',
    duration: 130,
    type: 'AUDIT',
    location: 'Front Desk',
    matchScore: 92,
    vlmDescription: 'Multiple individuals entering lobby area; perso...',
    tags: ['Staff', 'After Hours'],
  },
];

export const MOCK_ANALYTICS: AnalyticsData = {
  totalDetections: 14292,
  detectionsDelta: 14,
  securityThreats: 12,
  threatsDelta: -3,
  objectConfidence: 96.4,
  vlmInferenceMs: 124,
  detectionTrend: [
    { time: '00:00', human: 12, vehicle: 5 },
    { time: '02:00', human: 8, vehicle: 2 },
    { time: '04:00', human: 5, vehicle: 1 },
    { time: '06:00', human: 15, vehicle: 8 },
    { time: '08:00', human: 45, vehicle: 22 },
    { time: '10:00', human: 72, vehicle: 35 },
    { time: '12:00', human: 95, vehicle: 42 },
    { time: '14:00', human: 88, vehicle: 38 },
    { time: '16:00', human: 110, vehicle: 51 },
    { time: '18:00', human: 78, vehicle: 29 },
    { time: '20:00', human: 42, vehicle: 18 },
    { time: '22:00', human: 22, vehicle: 9 },
  ],
  topCategories: [
    { name: 'Delivery Vehicles', count: 4102 },
    { name: 'Unidentified Personnel', count: 2840 },
    { name: 'Lost Property/Packages', count: 1215 },
    { name: 'Pets/Animals', count: 842 },
  ],
  heatmapData: Array.from({ length: 10 }, (_, row) =>
    Array.from({ length: 10 }, (_, col) => {
      // Simulate higher activity in certain zones
      const isHotZone =
        (row < 2 && col < 2) ||
        (row < 2 && col > 8) ||
        (row > 5 && col > 6) ||
        (row === 3 && col === 7);
      return isHotZone ? Math.random() * 0.4 + 0.6 : Math.random() * 0.4;
    })
  ),
  recentFlagged: MOCK_EVENTS.filter(e =>
    ['CRITICAL', 'ANOMALY'].includes(e.type)
  ).slice(0, 3),
};

export const MOCK_SYSTEM_STATUS: SystemStatus = {
  activeCameras: 124,
  totalCameras: 130,
  systemHealth: 99.8,
  latencyMs: 45,
  storageUsedTB: 4.2,
  storageCapacityPct: 84,
  vlmInferenceActive: true,
  version: 'v2.4.0 Patch 12',
};
