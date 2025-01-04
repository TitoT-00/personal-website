import React from "react";
import { motion } from "framer-motion";
const About = () => {
    const skillsData = {
        frontend: {
          icon: 'fa-code',
          title: 'Frontend Development',
          skills: [
            { name: 'Flutter', level: 'Expert', icon: 'fa-flutter' },
            { name: 'React.js', level: 'Proficient', icon: 'fa-react' },
            { name: 'HTML5 & CSS3', level: 'Proficient', icon: 'fa-html5' },
            { name: 'TypeScript', level: 'Capable', icon: 'fa-code' },
            { name: 'Next.js', level: 'Capable', icon: 'fa-n' },
            { name: 'Tailwind CSS', level: 'Capable', icon: 'fa-css3' }
          ]
        },
        backend: {
          icon: 'fa-server',
          title: 'Backend Development',
          skills: [
            { name: 'Node.js', level: 'Proficient', icon: 'fa-node-js' },
            { name: 'Python', level: 'Proficient', icon: 'fa-python' },
            { name: 'Firebase', level: 'Proficient', icon: 'fa-fire' },
            { name: 'MongoDB', level: 'Capable', icon: 'fa-database' },
            { name: 'PostgreSQL', level: 'Proficient', icon: 'fa-database' },
            { name: 'RESTful APIs', level: 'Proficient', icon: 'fa-plug' }
          ]
        },
        tools: {
          icon: 'fa-toolbox',
          title: 'Tools & DevOps',
          skills: [
            { name: 'Git & GitHub', level: 'Expert', icon: 'fa-github' },
            { name: 'AWS', level: 'Capable', icon: 'fa-aws' },
            { name: 'CI/CD', level: 'Beginner', icon: 'fa-code-branch' },
            { name: 'VS Code', level: 'Proficient', icon: 'fa-code' }
          ]
        }
      };
    return (
        <motion.section
        key="about"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="section about"
      >
        <h2>About Me</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
              I'm a passionate developer with a love for creating beautiful,
              interactive web experiences. With expertise in both front-end and
              back-end development, I bring ideas to life through clean code
              and creative solutions.
            </p>
            <section id="skills" className="section">
              <h2>Skills & Expertise</h2>
              <div className="skills-container">
                {Object.entries(skillsData).map(([key, category]) => (
                  <div key={key} className="skill-category">
                    <h3>
                      <i className={`fas ${category.icon}`}></i>
                      {category.title}
                    </h3>
                    <div className="skill-list">
                      {category.skills.map((skill, index) => (
                        <div key={index} className="skill-item">
                          <i className={`fab ${skill.icon}`}></i>
                          <div className="skill-info">
                            <div className="skill-name">{skill.name}</div>
                            <div className="skill-level">{skill.level}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </motion.section>
    );

}

export default About;