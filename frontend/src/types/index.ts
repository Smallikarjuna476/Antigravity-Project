export type UserRole = 'farmer' | 'officer' | 'researcher' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  state?: string;
  district?: string;
  farm_size_acres?: number;
  primary_crops?: string;
  is_active: boolean;
  is_verified: boolean;
  avatar_url?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface TreatmentInfo {
  organic: string;
  chemical: string;
  preventive: string;
  dosage_guide?: string;
  application_interval?: string;
}

export interface ExplainabilityData {
  saliency_focus: string;
  model_architecture: string;
  top_features: {
    feature: string;
    importance: number;
  }[];
  class_probabilities: {
    name: string;
    probability: number;
  }[];
}

export interface DiseaseDiagnosisResult {
  id?: string;
  crop: string;
  disease: string;
  scientific_name?: string;
  category: string;
  confidence: number;
  confidence_percentage: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'None';
  affected_area_pct: number;
  is_healthy: boolean;
  symptoms: string;
  cause: string;
  treatments: TreatmentInfo;
  prevention_tips: string;
  favorable_conditions?: string;
  original_image_url: string;
  heatmap_image_url: string;
  report_download_url?: string;
  nearby_experts_count: number;
  explainability: ExplainabilityData;
  created_at?: string;
}

export interface DiseaseHistoryItem {
  id: string;
  crop_name: string;
  disease_name: string;
  confidence: number;
  severity_level: string;
  affected_area_pct: number;
  original_image_url: string;
  heatmap_image_url: string;
  report_url?: string;
  stage: string;
  created_at: string;
}

export interface DiseaseEncyclopediaRecord {
  id: string;
  crop_name: string;
  disease_name: string;
  scientific_name?: string;
  category: string;
  severity_default: string;
  symptoms: string;
  cause: string;
  organic_treatment: string;
  chemical_treatment: string;
  prevention_tips: string;
  favorable_conditions?: string;
  sample_image_url?: string;
}

export interface ExpertContact {
  id: string;
  name: string;
  designation: string;
  organization: string;
  district: string;
  state: string;
  phone: string;
  email: string;
  specialization: string;
  latitude?: number;
  longitude?: number;
  availability: string;
}

export interface SampleTestImage {
  id: string;
  name: string;
  crop: string;
  condition: string;
  severity: string;
  filename: string;
  url: string;
  description: string;
}

export interface DiseaseCompareResult {
  before_log: DiseaseHistoryItem;
  after_log: DiseaseHistoryItem;
  days_between: number;
  lesion_reduction_pct: number;
  healing_progress_score: number;
  recovery_status: string;
  clinical_notes: string;
}

export interface ChatMessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  language: string;
  image_url?: string;
  created_at: string;
}

export interface ChatSession {
  session_id: string;
  title: string;
  language: string;
  created_at: string;
}

export interface ChatResponse {
  session_id: string;
  reply: string;
  language: string;
  voice_locale: string;
  suggestions: string[];
  references: string[];
  intent_detected: string;
  created_at: string;
}

export interface ChatHistoryResponse {
  session_id: string;
  title: string;
  language: string;
  messages: ChatMessageItem[];
}

// Module 3: Virtual Weather Intelligence Types
export interface WeatherAlert {
  id: string;
  type: string;
  severity: 'MODERATE' | 'SEVERE' | 'EXTREME';
  title: string;
  description: string;
  issued_at: string;
  valid_until: string;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  precipitation_mm: number;
  soil_moisture_surface: number;
  soil_moisture_10cm: number;
  soil_moisture_30cm: number;
}

export interface DailyForecast {
  date: string;
  temp_max: number;
  temp_min: number;
  precipitation_chance: number;
  condition: string;
  humidity: number;
  wind_speed_kmh: number;
}

export interface WeatherDataResponse {
  location: {
    lat: number;
    lon: number;
    name: string;
  };
  current: {
    temp: number;
    condition: string;
    humidity: number;
    uv_index: number;
    disease_favorable_index: number;
  };
  daily: DailyForecast[];
  hourly: HourlyForecast[];
}

// Module 4: Market Intelligence Types
export interface MandiRate {
  id: string;
  commodity: string;
  market: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  volume_tons: number;
  update_time: string;
  trend: 'up' | 'down' | 'stable';
}

export interface DayForecast {
  date: string;
  predicted_price: number;
  lower_bound: number;
  upper_bound: number;
}

export interface HistoricalPrice {
  date: string;
  price: number;
}

export interface MarketForecastResponse {
  commodity: string;
  confidence_score: number;
  optimal_harvest_window: string;
  demand_index: string;
  trends: {
    historical: HistoricalPrice[];
    forecast: DayForecast[];
  };
}

// Module 5: Smart Crop Planner
export interface CropTimelinePhase {
  month: number;
  phase: string;
  activity: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface CropRecommendation {
  id: string;
  name: string;
  suitability_score: number;
  risk_level: 'High' | 'Medium' | 'Low';
  estimated_profit_per_acre: number;
  water_requirement: 'Low' | 'Moderate' | 'High';
  seed_varieties: string[];
  timeline: CropTimelinePhase[];
}

export interface CropPlannerResponse {
  region: string;
  season: string;
  recommendations: CropRecommendation[];
}

export interface YieldBenchmark {
  year: number;
  regional_avg_tons: number;
  top_performer_tons: number;
}

export interface BenchmarkResponse {
  crop: string;
  benchmarks: YieldBenchmark[];
  fertilizer_demand_kg_per_acre: {
    'Nitrogen (N)': number;
    'Phosphorus (P)': number;
    'Potassium (K)': number;
  };
}


// Module 7: Government Schemes
export interface GovernmentScheme {
  id: string;
  name: string;
  scope: string; // 'National' or specific State name
  category: string;
  subsidy_amount: string;
  eligibility: string;
  documents_required: string[];
  deadline: string;
  portal_link: string;
}

export interface SchemeListResponse {
  state: string;
  total_schemes_found: number;
  schemes: GovernmentScheme[];
}

// Module 8: Crop Health Timeline
export interface TimelineEvent {
  id: string;
  day_offset: number;
  date: string;
  title: string;
  status: 'completed' | 'active' | 'upcoming';
  type: 'planting' | 'operation' | 'maintenance' | 'fertilizer' | 'milestone' | 'health' | 'harvest';
  description: string;
}

export interface TimelineResponse {
  crop: string;
  sowing_date: string;
  events: TimelineEvent[];
}

// Module 9: Smart Farm Journal
export interface JournalEntry {
  id: string;
  title: string;
  category: string;
  cost: number;
  description: string;
  date: string;
}
