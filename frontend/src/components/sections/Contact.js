import React from "react";
import { motion } from "framer-motion";

const Contact = () => {
    return(
        <motion.section
                    id="contact"
                    className="section contact-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2>Get in Touch</h2>
                    <p>Let's collaborate on your next project or discuss opportunities.</p>
                    
                    <div className="contact-grid">
                      <motion.div 
                        className="contact-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <div className="contact-icon">
                          <i className="fas fa-envelope"></i>
                        </div>
                        <h3 className="contact-title">Email</h3>
                        <p className="contact-text">Drop me a message anytime</p>
                        <a href="mailto:thomastito88@gmail.com" className="contact-link">
                          <i className="fas fa-paper-plane"></i>
                          Send Email
                        </a>
                      </motion.div>

                      <motion.div 
                        className="contact-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <div className="contact-icon">
                          <i className="fab fa-github"></i>
                        </div>
                        <h3 className="contact-title">GitHub</h3>
                        <p className="contact-text">Check out my code</p>
                        <a href="https://github.com/TitoT-00" target="_blank" rel="noopener noreferrer" className="contact-link">
                          <i className="fas fa-code-branch"></i>
                          View Profile
                        </a>
                      </motion.div>

                      <motion.div 
                        className="contact-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <div className="contact-icon">
                          <i className="fab fa-linkedin"></i>
                        </div>
                        <h3 className="contact-title">LinkedIn</h3>
                        <p className="contact-text">Let's connect professionally</p>
                        <a href="https://linkedin.com/in/titothomas01" target="_blank" rel="noopener noreferrer" className="contact-link">
                          <i className="fas fa-user-plus"></i>
                          Connect
                        </a>
                      </motion.div>
                    </div>
                  </motion.section>
    );
}

export default Contact;
