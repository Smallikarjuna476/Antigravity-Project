import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppLayout } from './components/layout/AppLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { DiseaseDetectionPage } from './pages/DiseaseDetectionPage';

import { AssistantPage } from './pages/AssistantPage';
import { WeatherPage } from './pages/WeatherPage';
import { MarketPage } from './pages/MarketPage';
import { CropPlannerPage } from './pages/CropPlannerPage';
import { SoilIntelligencePage } from './pages/SoilIntelligencePage';
import { SchemesPage } from './pages/SchemesPage';
import { HealthTimelinePage } from './pages/HealthTimelinePage';
import { FarmJournalPage } from './pages/FarmJournalPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { KnowledgeHubPage } from './pages/KnowledgeHubPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { YieldSimulatorPage } from './pages/YieldSimulatorPage';

import { ExplainableAIPage } from './pages/ExplainableAIPage';
import { CommunityForumPage } from './pages/CommunityForumPage';
import { ReportGeneratorPage } from './pages/ReportGeneratorPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Authenticated Application Shell */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/disease" element={<DiseaseDetectionPage />} />
              <Route path="/assistant" element={<AssistantPage />} />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/market" element={<MarketPage />} />
              <Route path="/planner" element={<CropPlannerPage />} />
              <Route path="/soil" element={<SoilIntelligencePage />} />
              <Route path="/schemes" element={<SchemesPage />} />
              <Route path="/timeline" element={<HealthTimelinePage />} />
              <Route path="/journal" element={<FarmJournalPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/knowledge" element={<KnowledgeHubPage />} />
              <Route path="/forum" element={<CommunityForumPage />} />
              <Route path="/reports" element={<ReportGeneratorPage />} />
              <Route path="/digital-twin" element={<DigitalTwinPage />} />
              <Route path="/yield-simulator" element={<YieldSimulatorPage />} />

              <Route path="/explainable-ai" element={<ExplainableAIPage />} />
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
