import ConstellationNode from "@/src/components/ConstellationNode/index";
import CenterRune from "@/src/components/CenterRune/index";
import Background from "@/src/components/Background/index";

const portfolioNodes = [
  {
    title: "Career",
    position: "top-[22%] left-[14%]",
    color: "#f59e0b",
    delay: 0,
  },
  {
    title: "Skills",
    position: "top-[22%] right-[14%]",
    color: "#22d3ee",
    delay: 0.5,
  },
  {
    title: "Education",
    position: "top-[8%] left-1/2 -translate-x-1/2",
    color: "#a855f7",
    delay: 1,
  },
  {
    title: "Hobbies",
    position: "bottom-[20%] left-[14%]",
    color: "#22c55e",
    delay: 1.5,
  },
  {
    title: "Side Projects",
    position: "bottom-[8%] left-1/2 -translate-x-1/2",
    color: "#ef4444",
    delay: 2,
  },
  {
    title: "Contact",
    position: "bottom-[20%] right-[14%]",
    color: "#e2e8f0",
    delay: 2.5,
  },
];

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#02030a] text-white">
      <Background />
    {/* Constellation Nodes */}
      {portfolioNodes.map((node) => (
        <ConstellationNode
        key={node.title}
        title={node.title}
        position={node.position}
        color={node.color}
        />
      ))}
      <CenterRune />
    </main>
  );
}