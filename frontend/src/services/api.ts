import axios from 'axios';
import {
  User,
  DiseaseDiagnosisResult,
  DiseaseHistoryItem,
  DiseaseEncyclopediaRecord,
  ExpertContact,
  SampleTestImage,
  DiseaseCompareResult
} from '../types';

export const BACKEND_URL = 'http://localhost:8000';
export const API_BASE = `${BACKEND_URL}/api/v1`;

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agrisense_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to resolve static image and download URLs
export const getFullUrl = (path?: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BACKEND_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

// ==================== AUTH API ====================
export const authApi = {
  login: async (email: string, password: string): Promise<{ access_token: string; user: User }> => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (userData: any): Promise<{ access_token: string; user: User }> => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getProfile: async (): Promise<User> => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  getRoles: async () => {
    const res = await api.get('/auth/roles');
    return res.data;
  }
};

// ==================== MODULE 1: DISEASE DETECTION API ====================
export const diseaseApi = {
  diagnoseImage: async (file: File, cropHint?: string, notes?: string): Promise<DiseaseDiagnosisResult> => {
    const formData = new FormData();
    formData.append('file', file);
    if (cropHint) formData.append('crop_hint', cropHint);
    if (notes) formData.append('notes', notes);

    const res = await api.post('/disease/diagnose', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  diagnoseFromSampleUrl: async (sampleFilename: string): Promise<DiseaseDiagnosisResult> => {
    const res = await api.post(`/disease/diagnose-sample/${sampleFilename}`);
    return res.data;
  },

  getHistory: async (limit = 20): Promise<DiseaseHistoryItem[]> => {
    const res = await api.get('/disease/history', { params: { limit } });
    return res.data;
  },

  getReportDownloadUrl: (logId: string) => {
    return `${API_BASE}/disease/report/${logId}`;
  },

  compareScans: async (logIdBefore: string, logIdAfter: string): Promise<DiseaseCompareResult> => {
    const res = await api.post('/disease/compare', {
      log_id_before: logIdBefore,
      log_id_after: logIdAfter,
    });
    return res.data;
  },

  getEncyclopedia: async (crop?: string, query?: string): Promise<DiseaseEncyclopediaRecord[]> => {
    const res = await api.get('/disease/encyclopedia', { params: { crop, query } });
    return res.data;
  },

  getExperts: async (district?: string, state?: string): Promise<ExpertContact[]> => {
    const res = await api.get('/disease/experts', { params: { district, state } });
    return res.data;
  },

  getSampleImages: async (): Promise<SampleTestImage[]> => {
    const res = await api.get('/disease/sample-images');
    return res.data;
  }
};

// ==================== MODULE 2: AI ASSISTANT API ====================
export const assistantApi = {
  chat: async (
    message: string,
    language: string = 'en',
    sessionId?: string,
    imageUrl?: string,
    cropContext?: string
  ): Promise<any> => {
    const res = await api.post('/assistant/chat', {
      message,
      language,
      session_id: sessionId,
      image_url: imageUrl,
      crop_context: cropContext
    });
    return res.data;
  },

  getSessions: async (): Promise<any[]> => {
    const res = await api.get('/assistant/sessions');
    return res.data;
  },

  getHistory: async (sessionId: string): Promise<any> => {
    const res = await api.get(`/assistant/history/${sessionId}`);
    return res.data;
  }
};
// --- Module 3: Weather Intelligence ---
export const weatherApi = {
  getForecast: async (lat: number, lon: number): Promise<any> => {
    const res = await api.get(`/weather/forecast?lat=${lat}&lon=${lon}`);
    return res.data;
  },
  getAlerts: async (district: string): Promise<any> => {
    const res = await api.get(`/weather/alerts?district=${district}`);
    return res.data;
  }
};

// --- Module 4: Market Intelligence ---
export const marketApi = {
  getLiveRates: async (state: string, commodity?: string): Promise<any> => {
    const params = commodity ? `?state=${state}&commodity=${commodity}` : `?state=${state}`;
    const res = await api.get(`/market/live-rates${params}`);
    return res.data;
  },
  getPriceForecast: async (commodity: string): Promise<any> => {
    const res = await api.get(`/market/intelligent-forecast?commodity=${commodity}`);
    return res.data;
  },
  getProfitCalculator: async (commodity: string, acres: number, yieldTons: number, distanceKm: number): Promise<any> => {
    const res = await api.get(`/market/profit-calculator?commodity=${commodity}&acres=${acres}&expected_yield_tons=${yieldTons}&transport_distance_km=${distanceKm}`);
    return res.data;
  }
};

// --- Module 4.5: Yield Simulator ---
export const yieldSimApi = {
  getSimulation: async (nitrogen: number, water: number, temp: number, pest: number): Promise<any> => {
    const res = await api.get(`/yield/simulate?nitrogen=${nitrogen}&water=${water}&temp=${temp}&pest_stress=${pest}`);
    return res.data;
  }
};

// --- Module 5: Smart Crop Planner ---
export const plannerApi = {
  getRecommendations: async (state: string, season: string): Promise<any> => {
    const res = await api.get(`/planner/recommendations?state=${state}&season=${season}`);
    return res.data;
  },
  getBenchmarks: async (crop: string): Promise<any> => {
    const res = await api.get(`/planner/benchmarks?crop=${crop}`);
    return res.data;
  }
};

// --- Module 6: Soil & NPK Intelligence ---
export const soilApi = {
  scanReport: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/soil/scan', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  getHistory: async (): Promise<any> => {
    const res = await api.get('/soil/history');
    return res.data;
  }
};

// --- Module 7: Government Schemes ---
export const schemesApi = {
  getSchemes: async (state: string): Promise<any> => {
    const res = await api.get(`/schemes/list?state=${state}`);
    return res.data;
  }
};


// --- Module 9: Smart Farm Journal ---
export const journalApi = {
  getEntries: async (): Promise<any> => {
    const res = await api.get('/journal/entries');
    return res.data;
  },
  createEntry: async (entry: any): Promise<any> => {
    const res = await api.post('/journal/entries', entry);
    return res.data;
  },
  deleteEntry: async (id: string): Promise<any> => {
    const res = await api.delete(`/journal/entries/${id}`);
    return res.data;
  }
};

// --- Module 13: Community Forum ---
export const forumApi = {
  getPosts: async (category: string, search: string): Promise<any> => {
    const res = await api.get(`/forum/posts?category=${category}&search=${search}`);
    return res.data;
  }
};

// --- Module 10: Analytics ---
export const analyticsApi = {
  getMetrics: async (timeframe: string): Promise<any> => {
    const res = await api.get(`/analytics/metrics?timeframe=${timeframe}`);
    return res.data;
  }
};

// --- Module 1: XAI Samples ---
export const xaiApi = {
  getSamples: async (): Promise<any> => {
    const res = await api.get('/xai/samples');
    return res.data;
  },
  getFeatures: async (): Promise<any> => {
    const res = await api.get('/xai/features');
    return res.data;
  }
};

// --- Module 12: Digital Twin ---
export const twinApi = {
  getStatus: async (): Promise<any> => {
    const res = await api.get('/twin/status');
    return res.data;
  }
};

// --- Module 14: Knowledge Hub ---
export const hubApi = {
  getArticles: async (category: string, search: string): Promise<any> => {
    const res = await api.get(`/hub/articles?category=${category}&search=${search}`);
    return res.data;
  }
};
