import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ShadowEffect from './components/ShadowParticles';
import './App.css';

import Home from './components/sections/Home';
import About from './components/sections/About';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';
import CustomNavBar from './components/CustomNavBar';

function AppContent() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('gold');
  const location = useLocation();
  const currentPath = location.pathname === '/' ? 'home' : location.pathname.slice(1);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <div className={`App ${theme}`}>
      <ShadowEffect theme={theme} setTheme={setTheme} />
      
      <AnimatePresence>
        {!loading && (
          <motion.div
            className="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <CustomNavBar activeSection={currentPath} />

            <main className="main-content">
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/personal-website" element={<Home />} />
                  <Route path="/personal-website/about" element={<About />} />
                  <Route path="/personal-website/projects" element={<Projects />} />
                  <Route path="/personal-website/contact" element={<Contact />} />
                </Routes>
              </AnimatePresence>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
