import { portfolioData, type PortfolioData } from "./portfolioData";

export type PortfolioCategory = {
  name: keyof PortfolioData;
  color: string;
  icon: string;
  x: number;
  y: number;
};

const categories: PortfolioCategory[] = [
  { name: "Education", color: "#b89aff", icon: "◇", x: 28, y: 25 },
  { name: "Skills", color: "#79d7ea", icon: "⌘", x: 69, y: 20 },
  { name: "Career", color: "#eac28b", icon: "▱", x: 82, y: 50 },
  { name: "Side Projects", color: "#e79ba9", icon: "⌁", x: 69, y: 78 },
  { name: "Hobbies", color: "#9bd4b2", icon: "✳", x: 28, y: 76 },
  { name: "Contact", color: "#c6cce3", icon: "↗", x: 16, y: 49 },
];

export const portfolioCategories = categories.filter(category => portfolioData[category.name].length > 0);

export const siteContent = {
  intro: {
    greeting: "Hi, I’m Tito.",
    headline: "I build for web and mobile.",
    description: [
      "Software engineer working across web and mobile applications,",
      "from interface design to backend services.",
    ],
  },
  identity: "TITO THOMAS",
  role: "SOFTWARE ENGINEER",
  footerAction: "Get in touch",
} as const;
