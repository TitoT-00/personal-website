import React from "react";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import "./Home.css";

const Home = ({activeSection}) => {
    return (
        <motion.section
        id="home"
        className={`section title-section ${activeSection === 'home' ? 'active' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="profile-picture-container"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <img src="/personal-website/profile.png" alt="Tito T" className="profile-picture" />
        </motion.div>
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
          <Link to="/projects" className="primary">
            <i className="fas fa-code"></i>
            View Projects
          </Link>
          <a href="/personal-website/resources/resume.pdf" className="secondary" download="tito_resume.pdf">
            <i className="fas fa-download"></i>
            Download Resume
          </a>
        </motion.div>
      </motion.section>
    );
  };

  export default Home;