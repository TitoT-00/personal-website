import { portfolioCategories } from "./siteData";
import { portfolioData, type PortfolioData } from "./portfolioData";
import { getNodeDisplay } from "@/src/utils/nodeDisplay";

export type SpatialNode = {
  id: string;
  category: keyof PortfolioData;
  itemIndex?: number;
  title: string;
  subtitle: string;
  color: string;
  icon: string;
  position: [number, number, number];
};

export const spatialContent = {
  greeting: "Tito Thomas.",
  headline: "Software engineer.",
  introduction: "I develop web and mobile applications, from interface design to backend services.",
  disciplines: ["Full-stack engineering", "Mobile development", "Backend development"],
  sceneTitle: "Experience & skills",
  sceneHint: "Drag to orbit · Scroll to zoom · Drag a sphere to move it",
};

export function getSpatialGraph(expanded: keyof PortfolioData | null) {
  const depth: Record<keyof PortfolioData, number> = {
    Education: 0, Skills: -.6, Career: .8, "Side Projects": -.4, Hobbies: .5, Contact: -.7,
  };
  const hubs: SpatialNode[] = portfolioCategories.map(category => ({
    id: category.name,
    category: category.name,
    title: category.name === "Side Projects" ? "Projects" : category.name,
    subtitle: `${portfolioData[category.name].length} connections`,
    color: category.color,
    icon: category.icon,
    position: [(category.x - 50) * .21, (49 - category.y) * .21, depth[category.name]],
  }));
  const root = hubs.find(hub => hub.category === expanded);
  const leaves: SpatialNode[] = [];
  const edges: { from: string; to: string; color: string; leaf: boolean }[] = hubs.map(hub => ({ from: "core", to: hub.id, color: hub.color, leaf: false }));
  if (root && expanded) {
    const direction = Math.atan2(root.position[1], root.position[0]);
    const items = portfolioData[expanded];
    const branching = expanded === "Career" || expanded === "Education";
    items.forEach((item, index) => {
      const ring = Math.floor(index / 5);
      const count = Math.min(5, items.length - ring * 5);
      const angle = direction + (count < 2 ? 0 : ((index % 5) / (count - 1) - .5) * 1.6);
      const distance = branching ? 3 + index * 3.1 : 3.7 + ring * 3.1;
      const offset = branching ? (index % 2 ? -.7 : .7) : 0;
      const theta = branching ? direction : angle;
      const display = getNodeDisplay(expanded, item);
      leaves.push({
        id: item.id, category: expanded, itemIndex: index,
        title: branching ? display.subtitle?.split(" • ")[0] || display.title : display.title,
        subtitle: branching ? display.badge || "" : display.subtitle || "",
        color: root.color, icon: "·",
        position: [root.position[0] + Math.cos(theta) * distance - Math.sin(direction) * offset, root.position[1] + Math.sin(theta) * distance + Math.cos(direction) * offset, root.position[2] + Math.sin(index * 1.4) * .8],
      });
      edges.push({ from: branching && index > 0 ? items[index - 1].id : root.id, to: item.id, color: root.color, leaf: true });
    });
  }
  return { nodes: [...hubs, ...leaves], edges };
}
