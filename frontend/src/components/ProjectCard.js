import React, { useState } from "react";
import { motion } from "framer-motion";

const ProjectCard = ({header,description,code,link}) => {
    const [isClicked,setIsClicked] = useState(false); 
    return(
         <motion.div
            className="project-card"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
             >
            <h3>{header}</h3>
            <p style={{ fontStyle: 'italic',padding:'0' }}>{code}</p>
            <p>{description}</p>
            <div className="project-links">
             <a href={link} 
             target="_blank"
              rel="noopener noreferrer"
              style={{ color: isClicked ? 'gold' : 'cyan' }}
              onClick={() => setIsClicked(true)}

              >Source Code</a>
            </div>
       </motion.div>
    );
}

export default ProjectCard;