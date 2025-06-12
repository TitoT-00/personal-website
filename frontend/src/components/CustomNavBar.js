import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./CustomNavBar.css";

const CustomNavBar = ({ activeSection }) => {
    return(
        <nav className="navigation">
          <Link to="/personal-website">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={activeSection === 'home' ? 'active' : ''}
            >
              Home
            </motion.button>
          </Link>
          <Link to="/personal-website/about">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={activeSection === 'about' ? 'active' : ''}
            >
              About
            </motion.button>
          </Link>
          <Link to="/personal-website/projects">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={activeSection === 'projects' ? 'active' : ''}
            >
              Projects
            </motion.button>
          </Link>
          <Link to="/personal-website/contact">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={activeSection === 'contact' ? 'active' : ''}
            >
              Contact
            </motion.button>
          </Link>
        </nav>

    );
}

export default CustomNavBar;