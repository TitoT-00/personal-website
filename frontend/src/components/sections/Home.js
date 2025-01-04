import React from "react";
import { motion } from "framer-motion";

const Home = (activeSection, handleNavClick) => {
    return (
        <motion.section
        id="home"
        className={`section title-section ${activeSection === 'home' ? 'active' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="title-main"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Tito T.
        </motion.h1>
        <motion.div 
          className="title-role"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Full Stack Developer
        </motion.div>
        <motion.p 
          className="title-description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          Crafting elegant solutions through code. Specializing in modern web and mobile applications
          with a focus on performance, accessibility, and user experience.
        </motion.p>
        <motion.div 
          className="title-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <a href="#projects" className="primary" onClick={(e) => handleNavClick(e, 'projects')}>
            <i className="fas fa-code"></i>
            View Projects
          </a>
          <a href="#contact" className="secondary" onClick={(e) => handleNavClick(e, 'contact')}>
            <i className="fas fa-paper-plane"></i>
            Get in Touch
          </a>
        </motion.div>
      </motion.section>
    );
  };

  export default Home;