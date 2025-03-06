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
                              <ProjectCard
                               header="Retro Game Haven"
                               description="E-Commerce Website for Retro Games and Consoles and More"
                               code="Python Flask and Stripe Integration"
                               link="https://github.com/TitoT-00/ecommerce-site"
                               />

                               <ProjectCard
                               header="Design Foods POS"
                               description="Point of Sale for a local restaurant, with customizable options for the menu"
                               code="React/Vite"
                               link="https://github.com/TitoT-00/design-food-menu"
                               />

                            </div>
                          </motion.section>
    );
}

export default Projects;