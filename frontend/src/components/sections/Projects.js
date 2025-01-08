import React from "react";
import { motion } from "framer-motion";
import ProjectCard from "../ProjectCard";

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
                              <ProjectCard
                              header="Hexcode Revealer"
                              description="The fast way to get a hexcode from any image/camera"
                              code="Kotlin"
                              link="https://github.com/TitoT-00/RevealHexcode"
                              />  
                              <ProjectCard
                              header="OCRapp"
                              description="A way to take an image containing text and extracting it into a file. "
                              code="Kotlin"
                              link="https://github.com/TitoT-00/ocrApp"
                              /> 
                              <ProjectCard
                              header="FlutterProj"
                              description="3 Flutter Projects: Camp App, Firestarter, myApp"
                              code="Flutter/Dart, Hive DB, Firebase (Auth/Cloud)"
                              link="https://github.com/TitoT-00/flutterproj/"
  
                              /> 
                            </div>
                          </motion.section>
    );
}

export default Projects;