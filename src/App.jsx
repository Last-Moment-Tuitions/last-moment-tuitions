import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header, Footer } from './components/Layout';
import { StickyBanner } from './components/StickyBanner';
import HomePage from './pages/HomePage';
import UPSCPage from './pages/UPSCPage';
import SEBIPage from './pages/SEBIPage';
import IBPSSOPage from './pages/IBPSSOPage';
import CourseDetails from './pages/CourseDetails';
import './index.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <StickyBanner>
          🎉 <span className="font-bold">New Year Sale!</span> Get 50% off on all courses. Use code: <span className="font-bold">NEWYear2025</span>
        </StickyBanner>
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/exams/upsc" element={<UPSCPage />} />
            <Route path="/government/sebi-grade-a-it" element={<SEBIPage />} />
            <Route path="/government/ibps-so" element={<IBPSSOPage />} />
            <Route path="/courses/web-design" element={<CourseDetails />} />

            <Route path="/exams/jee" element={<UPSCPage />} />

            <Route path="/exams/gate" element={<UPSCPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
