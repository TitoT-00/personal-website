import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ShadowEffect from './components/ShadowParticles';
import './App.css';

import Home from './components/sections/Home';
import About from './components/sections/About';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';
import CustomNavBar from './components/CustomNavBar';

function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('gold');
  const [activeSection, setActiveSection] = useState('home');



  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleNavClick = (e, section) => {
    e.preventDefault();
    setActiveSection(section);
  };

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
            <CustomNavBar activeSection={activeSection} setActiveSection={setActiveSection} />

            <main className="main-content">
              <AnimatePresence mode="wait">
                {activeSection === 'home' && (
                  <Home key="home" activeSection={activeSection} handleNavClick={handleNavClick}/>
                )}
                {activeSection === 'about' && (
                 <About key="about" />
                )}

                {activeSection === 'projects' && (
                 <Projects key="projects" />
                )}

                {activeSection === 'contact' && (
                  <Contact key="contact" />
                )}
              </AnimatePresence>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
