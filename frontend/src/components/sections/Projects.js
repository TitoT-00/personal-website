import React from "react";
import { motion } from "framer-motion";

const Projects = () => {
    return(
         <motion.section
                            key="projects"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="section projects"
                          >
                            <h2>My Projects</h2>
                            <div className="projects-grid">
                                {/* Hexcode Revealer */}
                              <motion.div
                                className="project-card"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <h3>Hexcode Revealer</h3>
                                <p>The fast way to get a hexcode from any image/camera</p>
                                <div className="project-links">
                                  <a href="https://github.com/TitoT-00/RevealHexcode" target="_blank" rel="noopener noreferrer">Source Code</a>
                                </div>
                              </motion.div>
                              <motion.div
                                className="project-card"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <h3>OCRapp</h3>
                                <p>A way to take an image containing text and extracting it into a file. </p>
                                <div className="project-links">
                                  <a href="https://github.com/TitoT-00/ocrApp" target="_blank" rel="noopener noreferrer" >Source Code</a>
                                
                                </div>
                              </motion.div>
                            </div>
                          </motion.section>
    );
}

export default Projects;