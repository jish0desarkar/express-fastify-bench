export const mockResponse = {
  id: "c1a9f2af-2d32-4a9f-8b3e-d1b2f5ba7e11",
  name: "SystemReport",
  description: "Large JSON object for testing serialization performance",
  version: "1.0.0",
  runtime: {
    cpu: "M4 Max",
    cores: 12,
    threads: 24,
  },
  memory: {
    total: "32GB",
    used: "18.7GB",
    free: "13.3GB",
  },
  disk: {
    total: "1TB",
    used: "720GB",
    free: "280GB",
  },
  network: {
    downloadMbps: 940,
    uploadMbps: 950,
    latencyMs: 2,
  },
  ui: {
    width: 1920,
    height: 1080,
    density: "high",
  },
  geo: {
    lat: 12.9716,
    lng: 77.5946,
    accuracy: 5,
  },
  cache: {
    hits: 78292,
    misses: 1203,
    strategy: "LRU",
  },
  jobs: {
    queued: 14,
    processing: 3,
    failed: 2,
  },
  payments: {
    provider: "Stripe",
    currency: "INR",
    retry: false,
  },
  notifications: {
    email: true,
    sms: false,
    push: true,
  },
  limits: {
    maxRequestsPerMinute: 1200,
    maxConnections: 500,
    maxPayloadMb: 10,
  },
};
