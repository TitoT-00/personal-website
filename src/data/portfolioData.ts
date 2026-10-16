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

const skills = [
  {
    id: "skill-1",
    category: "Frontend",
    name: "React",
    level: 8,
    yearsOfExperience: 4,
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
    category: "Mobile",
    name: "React Native",
    level: 9,
    yearsOfExperience: 2,
  },
  {
    id: "skill-5",
    category: "Mobile",
    name: "Flutter",
    level: 9,
    yearsOfExperience: 4,
  },
  {
    id: "skill-6",
    category: "Backend",
    name: "Node.js",
    level: 8,
    yearsOfExperience: 4,
  },
  {
    id: "skill-7",
    category: "Backend",
    name: "Python",
    level: 8,
    yearsOfExperience: 5,
  },
  {
    id: "skill-8",
    category: "Database",
    name: "PostgreSQL",
    level: 7,
    yearsOfExperience: 3,
  },
  {
    id: "skill-9",
    category: "Cloud & DevOps",
    name: "Docker",
    level: 8,
    yearsOfExperience: 3,
  },
];

export const portfolioData: PortfolioData = {
  Career: [
    {
      id: "carrer-1",
      year: "Sept 2025 - Current",
      title: "IT Engineer",
      company: "Optum",
      responsibilities: [
        " Provided Tier 2 technical support for clinical and corporate users in a healthcare environment, resolving hardware, software, and connectivity issues to minimize downtime and support patient care operations",
        "Managed incidents, problems, and service requests using ServiceNow, ensuring accurate documentation, prioritization, and SLA compliance.",
        "Supported Go-Live deployments across multiple clinical sites, delivering on-site technical support for system rollouts, workstation activations, and application launches.",
        "Installed, configured, and maintained medical, vendor, and endpoint devices, including building full workstation setups for physicians, exam rooms, and medical bays.",
        "Executed scripts and performed device imaging, OS configuration, and software installations to support system updates, troubleshooting, and site expansions.",
      ],
      technologies: ["Windows 10/11","Active Directory","Microsoft Intune","Cisco AnyConnect VPN","ServiceNow","RDP","TCP/IP"]
    },
    {
      id: "career-2",
      year: "Sept 2025 - March 2026",
      title: "Software Engineer (Full Stack)",
      company: "Campus Connect",
      responsibilities: [
        "Owned development of a cross platform mobile application using React Native and TypeScript, taking major features from product requirements through implementation, testing, and release.",
        "Designed the application architecture, database schema, and end to end user workflows, mapping how data, backend services, and client functionality interacted across the platform.",
        "Built Python REST APIs supporting authentication and application business logic.",
        "Took ownership of the product beyond assigned development tasks by identifying usability issues, proposing technical and design improvements, and shaping features throughout the development lifecycle.",
      ],
      technologies: ["React Native", "Python", "TypeScript", "REST APIs", "Docker", "Google Cloud Run", "Google Artifact Registry", "Google Secret Manager"],
    },
    {
      id: "career-3",
      year: "Feb 2025 - Nov 2025",
      title: "Full Stack Developer",
      company: "SOULCHI",
      responsibilities: [
        "Developed cross-platform mobile applications using Flutter and Firebase, contributing to core product functionality and production releases.",
        "Built backend APIs and Firebase Cloud Functions supporting production features, application logic, and automated workflows.",
        "Designed and refined the home screen experience, improving layout, visual hierarchy, component styling, and overall mobile UI aesthetics in collaboration with designers and stakeholders.",
      ],
      technologies: ["Flutter", "Dart", "Firebase", "Node.js", "Riverpod", "Cloud Functions"],
    },
    {
      id: "career-4",
      year: "Dec 2022 - Dec 2024",
      title: "Software Engineer (Mobile + Web)",
      company: "Maxsip Telecom",
      responsibilities: [
        "Led development of cross platform mobile and web applications supporting enterprise telecommunications operations.",
        "Built React and Node.js applications for inventory, order management, user administration, and reporting.",
        "Developed Flutter mobile applications deployed to Google Play and the Apple App Store.",
        "Participated in architecture, testing, deployment, and ongoing production support.",
      ],
      technologies: ["Flutter", "React", "Node.js", "Firebase", "Kotlin", "MongoDB"],
    },
  ],
  Skills: skills,
  Education: [
    {
      id: "edu-1",
      year: "2024 - 2026",
      degree: "Master of Science",
      institution: "Troy University",
      fieldOfStudy: "Computer Science",
    },
    {
      id: "edu-2",
      year: "2018 - 2022",
      degree: "Bachelors",
      institution: "Hofstra University",
      fieldOfStudy: "Computer Science",
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
  "Side Projects": [],
  Contact: [
    {
      id: "contact-1",
      platform: "Email",
      label: "Email",
      value: "thomastito88@gmail.com",
      link: "mailto:thomastito88@gmail.com",
    },
    {
      id: "contact-2",
      platform: "GitHub",
      label: "GitHub",
      value: "TitoT-00",
      link: "https://github.com/TitoT-00",
    },
    {
      id: "contact-3",
      platform: "LinkedIn",
      label: "LinkedIn",
      value: "linkedin.com/in/titothomas01",
      link: "https://linkedin.com/in/titothomas01/",
    },
  ],
};
