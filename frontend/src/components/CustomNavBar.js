import React from "react";
import {motion} from "framer-motion";

const CustomNavBar = ({activeSection,setActiveSection}) => {
    return(
        <nav className="navigation">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveSection('home')}
            className={activeSection === 'home' ? 'active' : ''}
          >
            Home
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveSection('about')}
            className={activeSection === 'about' ? 'active' : ''}
          >
            About
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveSection('projects')}
            className={activeSection === 'projects' ? 'active' : ''}
          >
            Projects
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveSection('contact')}
            className={activeSection === 'contact' ? 'active' : ''}
          >
            Contact
          </motion.button>
        </nav>

    );
}

export default CustomNavBar;