import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext';

// Entry / staff auth / shared
import Welcome from './pages/Welcome';
import StaffLogin from './pages/StaffLogin';
import VitalsInfo from './pages/VitalsInfo';
import LiveOpdQueue from './pages/LiveOpdQueue';
import NotFound from './pages/NotFound';

// Check-in
import LanguageSelection from './pages/checkin/LanguageSelection';
import Accessibility from './pages/checkin/Accessibility';
import Identification from './pages/checkin/Identification';
import AbhaQr from './pages/checkin/AbhaQr';
import AbhaMobile from './pages/checkin/AbhaMobile';
import NewRegistration from './pages/checkin/NewRegistration';
import InfoConfirmation from './pages/checkin/InfoConfirmation';
import AiAssistant from './pages/checkin/AiAssistant';
import TokenGenerated from './pages/checkin/TokenGenerated';

// History
import HistoryIntro from './pages/history/HistoryIntro';
import ChiefComplaint from './pages/history/ChiefComplaint';
import SymptomSelection from './pages/history/SymptomSelection';
import AiFollowUp from './pages/history/AiFollowUp';
import SymptomDetails from './pages/history/SymptomDetails';
import RedFlag from './pages/history/RedFlag';
import PastHistory from './pages/history/PastHistory';
import ReviewComplete from './pages/history/ReviewComplete';

// Documents
import DocIntro from './pages/documents/DocIntro';
import DocScanner from './pages/documents/DocScanner';
import OcrProcessing from './pages/documents/OcrProcessing';
import ExtractedReview from './pages/documents/ExtractedReview';
import AbnormalFindings from './pages/documents/AbnormalFindings';
import DocTimeline from './pages/documents/DocTimeline';
import DocComplete from './pages/documents/DocComplete';

// Queue (patient)
import QueueStatus from './pages/queue/QueueStatus';
import LiveQueue from './pages/queue/LiveQueue';
import ReadyCall from './pages/queue/ReadyCall';

// Exit — default + named exports verified in exit/ExitFlow.jsx
import ExitCompleted, { VisitSummary, PrescriptionDocs, FollowUp, FinalExit } from './pages/exit/ExitFlow';

// Doctor
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientCase from './pages/doctor/PatientCase';
import IntakeTranscript from './pages/doctor/IntakeTranscript';
import MedicalTimeline from './pages/doctor/MedicalTimeline';
import AiSummary from './pages/doctor/AiSummary';
import MedicalDocs from './pages/doctor/MedicalDocs';
import ConsultationWorkspace from './pages/doctor/ConsultationWorkspace';
import ConsultationComplete from './pages/doctor/ConsultationComplete';
import DoctorReview from './pages/doctor/DoctorReview';
import RedFlagAlert from './pages/doctor/RedFlagAlert';

// Triage
import TriageDashboard from './pages/triage/TriageDashboard';
import LiveTriageQueue from './pages/triage/LiveTriageQueue';
import PatientAssessment from './pages/triage/PatientAssessment';
import Vitals from './pages/triage/Vitals';
import AssignPriority from './pages/triage/AssignPriority';
import TriageSummary from './pages/triage/TriageSummary';
import PatientHandoff from './pages/triage/PatientHandoff';
import TriageHistory from './pages/triage/TriageHistory';
import AlertCenter from './pages/triage/AlertCenter';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import OpdOperations from './pages/admin/OpdOperations';
import KioskManagement from './pages/admin/KioskManagement';
import StaffManagement from './pages/admin/StaffManagement';
import Analytics from './pages/admin/Analytics';
import AuditAccess from './pages/admin/AuditAccess';
import SystemSettings from './pages/admin/SystemSettings';
import AdminAlertCenter from './pages/admin/AdminAlertCenter';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function ThemeManager() {
  const { state } = useApp();
  useEffect(() => {
    if (state.theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [state.theme]);
  return null;
}

function DocumentTitle() {
  const { pathname } = useLocation();
  useEffect(() => { document.title = 'AAROGYAVAANI'; }, [pathname]);
  return null;
}

import AshokaChakra from './components/AshokaChakra';
import { BrandText } from './components/BrandLogo';

function AppBg() {
  const { state } = useApp();
  const op = state.theme === 'dark' ? 0.2 : 0.05;
  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: op, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      <AshokaChakra size={900} />
    </div>
  );
}

function SplashScreen() {
  const [show, setShow] = useState(true);
  
  useEffect(() => {
    const hasSplashed = sessionStorage.getItem('medikiosk_splashed');
    if (hasSplashed) {
      setShow(false);
    } else {
      sessionStorage.setItem('medikiosk_splashed', 'true');
      const timer = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg)', zIndex: 99999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'splash-fadeout 0.5s ease 1.5s forwards' }}>
      <div style={{ animation: 'splash-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
        <AshokaChakra size={150} isActive={true} />
      </div>
      <div style={{ marginTop: 24, fontSize: 32, fontFamily: 'var(--font-head)', letterSpacing: '0.15em', animation: 'splash-fadein 0.8s ease 0.3s both' }}>
        <BrandText darkBg={false} />
      </div>
      <style>{`
        @keyframes splash-fadeout { to { opacity: 0; visibility: hidden; } }
        @keyframes splash-pop { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes splash-fadein { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SplashScreen />
      <ScrollToTop />
      <ThemeManager />
      <DocumentTitle />
      <AppBg />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/staff/login" element={<StaffLogin />} />

        <Route path="/checkin/language" element={<LanguageSelection />} />
        <Route path="/checkin/accessibility" element={<Accessibility />} />
        <Route path="/checkin/identify" element={<Identification />} />
        <Route path="/checkin/abha-qr" element={<AbhaQr />} />
        <Route path="/checkin/abha-mobile" element={<AbhaMobile />} />
        <Route path="/checkin/register" element={<NewRegistration />} />
        <Route path="/checkin/confirm" element={<InfoConfirmation />} />
        <Route path="/checkin/ai-assistant" element={<AiAssistant />} />
        <Route path="/checkin/token" element={<TokenGenerated />} />

        <Route path="/history/intro" element={<HistoryIntro />} />
        <Route path="/history/chief-complaint" element={<ChiefComplaint />} />
        <Route path="/history/symptoms" element={<SymptomSelection />} />
        <Route path="/history/ai-followup" element={<AiFollowUp />} />
        <Route path="/history/details" element={<SymptomDetails />} />
        <Route path="/history/red-flag" element={<RedFlag />} />
        <Route path="/history/past-history" element={<PastHistory />} />
        <Route path="/history/review" element={<ReviewComplete />} />

        <Route path="/documents/intro" element={<DocIntro />} />
        <Route path="/documents/scanner" element={<DocScanner />} />
        <Route path="/documents/processing" element={<OcrProcessing />} />
        <Route path="/documents/review" element={<ExtractedReview />} />
        <Route path="/documents/abnormal" element={<AbnormalFindings />} />
        <Route path="/documents/timeline" element={<DocTimeline />} />
        <Route path="/documents/complete" element={<DocComplete />} />

        <Route path="/vitals" element={<VitalsInfo />} />

        <Route path="/queue/status" element={<QueueStatus />} />
        <Route path="/queue/live" element={<LiveQueue />} />
        <Route path="/queue/ready" element={<ReadyCall />} />

        <Route path="/exit/completed" element={<ExitCompleted />} />
        <Route path="/exit/summary" element={<VisitSummary />} />
        <Route path="/exit/prescription" element={<PrescriptionDocs />} />
        <Route path="/exit/followup" element={<FollowUp />} />
        <Route path="/exit/done" element={<FinalExit />} />

        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/queue" element={<LiveOpdQueue />} />
        <Route path="/doctor/case/:tokenNo" element={<PatientCase />} />
        <Route path="/doctor/case/:id" element={<PatientCase />} />
        <Route path="/doctor/transcript/:id" element={<IntakeTranscript />} />
        <Route path="/doctor/timeline/:id" element={<MedicalTimeline />} />
        <Route path="/doctor/summary" element={<AiSummary />} />
        <Route path="/doctor/documents" element={<MedicalDocs />} />
        <Route path="/doctor/workspace" element={<ConsultationWorkspace />} />
        <Route path="/doctor/complete" element={<ConsultationComplete />} />
        <Route path="/doctor/review" element={<DoctorReview />} />
        <Route path="/doctor/review/:id" element={<DoctorReview />} />
        <Route path="/doctor/alerts" element={<RedFlagAlert />} />

        <Route path="/triage/dashboard" element={<TriageDashboard />} />
        <Route path="/triage/queue" element={<LiveTriageQueue />} />
        <Route path="/triage/assessment/:token" element={<PatientAssessment />} />
        <Route path="/triage/assessment/:id" element={<PatientAssessment />} />
        <Route path="/triage/vitals/:id" element={<Vitals />} />
        <Route path="/triage/priority/:id" element={<AssignPriority />} />
        <Route path="/triage/summary/:id" element={<TriageSummary />} />
        <Route path="/triage/handoff/:id" element={<PatientHandoff />} />
        <Route path="/triage/history" element={<TriageHistory />} />
        <Route path="/triage/alerts" element={<AlertCenter />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/opd" element={<OpdOperations />} />
        <Route path="/admin/kiosks" element={<KioskManagement />} />
        <Route path="/admin/staff" element={<StaffManagement />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/audit" element={<AuditAccess />} />
        <Route path="/admin/settings" element={<SystemSettings />} />
        <Route path="/admin/alerts" element={<AdminAlertCenter />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
