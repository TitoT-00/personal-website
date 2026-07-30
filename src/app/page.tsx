"use client";

import { useState } from "react";

import Background from "@/src/components/Background";
import CenterRune from "@/src/components/CenterRune";
import ConstellationBranches from "@/src/components/ConstellationBranches";
import ConstellationNode from "@/src/components/ConstellationNode";

const portfolioNodes = [
  {
    title: "Career",
    x: 16,
    y: 25,
    color: "#f59e0b",
    delay: 0,
  },
  {
    title: "Skills",
    x: 84,
    y: 25,
    color: "#22d3ee",
    delay: 0.5,
  },
  {
    title: "Education",
    x: 50,
    y: 10,
    color: "#a855f7",
    delay: 1,
  },
  {
    title: "Hobbies",
    x: 16,
    y: 76,
    color: "#22c55e",
    delay: 1.5,
  },
  {
    title: "Side Projects",
    x: 50,
    y: 90,
    color: "#ef4444",
    delay: 2,
  },
  {
    title: "Contact",
    x: 84,
    y: 76,
    color: "#e2e8f0",
    delay: 2.5,
  },
];

export default function Home() {
  const [activeTree, setActiveTree] = useState<string | null>(null);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#02030a] text-white">
      <Background />

      <ConstellationBranches
        nodes={portfolioNodes}
        activeTree={activeTree}
      />

      {portfolioNodes.map((node) => (
        <ConstellationNode
          key={node.title}
          title={node.title}
          x={node.x}
          y={node.y}
          color={node.color}
          delay={node.delay}
          onActivate={setActiveTree}
          onDeactivate={() => setActiveTree(null)}
        />
      ))}

      <CenterRune />
    </main>
  );
}