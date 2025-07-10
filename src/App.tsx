
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { UnifiedModalSystem } from '@/components/modals/UnifiedModalSystem';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/:section" element={<Index />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
        <UnifiedModalSystem />
      </div>
    </Router>
  );
}

export default App;
