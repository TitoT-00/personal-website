export type CareerItem = {
  id: string;
  year: string;
  title: string;
  company: string;
  responsibilities: string[];
  technologies?: string[];
};

export type SkillItem = {
  id: string;
  category: string;
  name: string;
  level: number;
  yearsOfExperience: number;
};

export type EducationItem = {
  id: string;
  year: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  achievements?: string[];
};

export type HobbyItem = {
  id: string;
  name: string;
  description: string;
  icon?: string;
};

export type ProjectItem = {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  year: string;
};

export type ContactItem = {
  id: string;
  platform: string;
  label: string;
  value: string;
  link: string;
};

export type PortfolioData = {
  Career: CareerItem[];
  Skills: SkillItem[];
  Education: EducationItem[];
  Hobbies: HobbyItem[];
  "Side Projects": ProjectItem[];
  Contact: ContactItem[];
};

export const portfolioData: PortfolioData = {
  Career: [
    {
      id: "career-1",
      year: "2023 - Present",
      title: "Senior Software Engineer",
      company: "Tech Innovations Inc.",
      responsibilities: [
        "Led development of microservices architecture serving 1M+ users",
        "Mentored team of 5 junior developers",
        "Reduced API response time by 40% through optimization",
        "Implemented CI/CD pipeline reducing deployment time by 60%",
      ],
      technologies: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
    },
    {
      id: "career-2",
      year: "2021 - 2023",
      title: "Full Stack Developer",
      company: "Digital Solutions Co.",
      responsibilities: [
        "Built responsive web applications using React and Next.js",
        "Developed RESTful APIs with Node.js and Express",
        "Collaborated with design team to implement pixel-perfect UIs",
        "Integrated third-party payment systems (Stripe, PayPal)",
      ],
      technologies: ["React", "Next.js", "MongoDB", "Express", "Tailwind CSS"],
    },
    {
      id: "career-3",
      year: "2019 - 2021",
      title: "Frontend Developer",
      company: "StartUp Ventures",
      responsibilities: [
        "Created interactive dashboards for data visualization",
        "Implemented responsive designs across multiple devices",
        "Optimized web performance achieving 95+ Lighthouse scores",
        "Participated in agile development sprints",
      ],
      technologies: ["JavaScript", "React", "Redux", "SASS", "Webpack"],
    },
    {
      id: "career-4",
      year: "2018 - 2019",
      title: "Junior Web Developer",
      company: "Web Agency Pro",
      responsibilities: [
        "Developed client websites using HTML, CSS, and JavaScript",
        "Maintained and updated existing web applications",
        "Collaborated with senior developers on feature implementation",
        "Conducted code reviews and testing",
      ],
      technologies: ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap"],
    },
  ],
  Skills: [
    {
      id: "skill-1",
      category: "Frontend",
      name: "React",
      level: 9,
      yearsOfExperience: 5,
    },
    {
      id: "skill-2",
      category: "Frontend",
      name: "TypeScript",
      level: 8,
      yearsOfExperience: 4,
    },
    {
      id: "skill-3",
      category: "Frontend",
      name: "Next.js",
      level: 8,
      yearsOfExperience: 3,
    },
    {
      id: "skill-4",
      category: "Backend",
      name: "Node.js",
      level: 8,
      yearsOfExperience: 4,
    },
    {
      id: "skill-5",
      category: "Backend",
      name: "Python",
      level: 7,
      yearsOfExperience: 3,
    },
    {
      id: "skill-6",
      category: "Database",
      name: "PostgreSQL",
      level: 7,
      yearsOfExperience: 3,
    },
  ],
  Education: [
    {
      id: "edu-1",
      year: "2014 - 2018",
      degree: "Bachelor of Science",
      institution: "University of Technology",
      fieldOfStudy: "Computer Science",
      achievements: [
        "Graduated with Honors (GPA: 3.8/4.0)",
        "Dean's List all semesters",
        "Led university hackathon team to 1st place",
      ],
    },
  ],
  Hobbies: [
    {
      id: "hobby-1",
      name: "Open Source",
      description: "Contributing to open source projects and building developer tools",
    },
    {
      id: "hobby-2",
      name: "Photography",
      description: "Landscape and street photography with focus on composition",
    },
    {
      id: "hobby-3",
      name: "Gaming",
      description: "Strategy games and competitive esports",
    },
  ],
  "Side Projects": [
    {
      id: "project-1",
      name: "Task Manager Pro",
      description: "A modern task management app with real-time collaboration",
      technologies: ["React", "Firebase", "Tailwind CSS"],
      link: "https://github.com/example/task-manager",
      year: "2023",
    },
    {
      id: "project-2",
      name: "Weather Dashboard",
      description: "Beautiful weather visualization with forecasts and alerts",
      technologies: ["Next.js", "TypeScript", "Chart.js"],
      link: "https://github.com/example/weather-dashboard",
      year: "2022",
    },
  ],
  Contact: [
    {
      id: "contact-1",
      platform: "Email",
      label: "Email",
      value: "your.email@example.com",
      link: "mailto:your.email@example.com",
    },
    {
      id: "contact-2",
      platform: "GitHub",
      label: "GitHub",
      value: "github.com/yourusername",
      link: "https://github.com/yourusername",
    },
    {
      id: "contact-3",
      platform: "LinkedIn",
      label: "LinkedIn",
      value: "linkedin.com/in/yourprofile",
      link: "https://linkedin.com/in/yourprofile",
    },
  ],
};
