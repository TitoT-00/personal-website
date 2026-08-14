"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useDragControls, animate as animateValue } from "framer-motion";

import Background from "@/src/components/Background";
import BackgroundConstellations from "@/src/components/BackgroundConstellations";
import CenterRune from "@/src/components/CenterRune";
import { portfolioData } from "@/src/data/portfolioData";

import {
  calculateMainNodesLayout,
  generateMainBranch,
  getCenterNodePosition,
} from "@/src/utils/mainConstellationLayout";
import {
  calculateProgressionTree,
  calculateRadialTree,
  calculateTreeCamera,
} from "@/src/utils/treeLayout";

import { getNodeDisplay } from "@/src/utils/nodeDisplay";
import type { MainNodeLayout, TreeLayout, CameraState } from "@/src/types/constellation";

const CATEGORIES = [
  { title: "Education", color: "#a855f7", delay: 0 },
  { title: "Skills", color: "#22d3ee", delay: 0.5 },
  { title: "Contact", color: "#e2e8f0", delay: 1 },
  { title: "Side Projects", color: "#ef4444", delay: 1.5 },
  { title: "Hobbies", color: "#22c55e", delay: 2 },
  { title: "Career", color: "#f59e0b", delay: 2.5 },
];

const PROGRESSION_CATEGORIES = ["Career", "Education", "Side Projects"];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedChildNode, setSelectedChildNode] = useState<string | null>(null);
  const [showTree, setShowTree] = useState(false);

  // Calculate main constellation layout
  const mainNodes = useMemo(() => calculateMainNodesLayout(CATEGORIES), []);
  const centerPos = getCenterNodePosition();

  // Get selected node layout
  const selectedNode = mainNodes.find((n) => n.title === selectedCategory);

  // Calculate tree layout if category selected
  const treeLayout: TreeLayout | null = useMemo(() => {
    if (!selectedNode) return null;

    const data = portfolioData[selectedCategory as keyof typeof portfolioData];
    if (!data || !Array.isArray(data)) return null;

    const isProgression = PROGRESSION_CATEGORIES.includes(selectedCategory!);

    if (isProgression) {
      return calculateProgressionTree(
        selectedNode.x,
        selectedNode.y,
        data,
        selectedNode.angle
      );
    } else {
      return calculateRadialTree(
        selectedNode.x,
        selectedNode.y,
        data,
        selectedNode.angle
      );
    }
  }, [selectedNode, selectedCategory]);

  // Calculate camera state with bounds checking
  const camera: CameraState = useMemo(() => {
    if (!selectedNode || !treeLayout) {
      return { x: 0, y: 0, scale: 1 };
    }

    // Calculate bounds of entire tree
    const allX = [
      selectedNode.x,
      ...treeLayout.nodes.map(n => n.x),
      ...treeLayout.cards.map(c => c.x),
      ...treeLayout.cards.map(c => c.x + c.width),
    ];
    const allY = [
      selectedNode.y,
      ...treeLayout.nodes.map(n => n.y),
      ...treeLayout.cards.map(c => c.y),
      ...treeLayout.cards.map(c => c.y + c.height),
    ];

    const bounds = {
      minX: Math.min(...allX),
      maxX: Math.max(...allX),
      minY: Math.min(...allY),
      maxY: Math.max(...allY),
    };

    return calculateTreeCamera(selectedNode.x, selectedNode.y, selectedNode.angle, bounds);
  }, [selectedNode, treeLayout]);

  // Track viewport size so the percentage-based camera can be converted to
  // pixels - drag gestures operate in pixels, so the world transform needs
  // matching units to let manual dragging and programmatic pans coexist.
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const updateSize = () =>
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Pixel-based motion values driving the world transform. Programmatic
  // camera changes animate these; dragging manipulates them directly.
  const worldX = useMotionValue(0);
  const worldY = useMotionValue(0);
  const worldScale = useMotionValue(1);
  const dragControls = useDragControls();

  useEffect(() => {
    if (!viewportSize.width || !viewportSize.height) return;

    const targetX = (camera.x / 100) * viewportSize.width;
    const targetY = (camera.y / 100) * viewportSize.height;
    const springConfig = { type: "spring" as const, damping: 30, stiffness: 150, mass: 1 };

    const xControls = animateValue(worldX, targetX, springConfig);
    const yControls = animateValue(worldY, targetY, springConfig);
    const scaleControls = animateValue(worldScale, camera.scale, springConfig);

    return () => {
      xControls.stop();
      yControls.stop();
      scaleControls.stop();
    };
  }, [camera, viewportSize, worldX, worldY, worldScale]);

  // Handle node click
  const handleNodeClick = (title: string) => {
    if (selectedCategory === title) {
      // Deselect
      setShowTree(false);
      setTimeout(() => {
        setSelectedCategory(null);
        setSelectedChildNode(null);
      }, 500);
    } else {
      // Select new
      if (selectedCategory) {
        setShowTree(false);
        setTimeout(() => {
          setSelectedCategory(title);
          setSelectedChildNode(null);
          setTimeout(() => setShowTree(true), 700);
        }, 500);
      } else {
        setSelectedCategory(title);
        setSelectedChildNode(null);
        setTimeout(() => setShowTree(true), 700);
      }
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#02030a] text-white">
      {/* Background layers - fixed to viewport, NOT part of the camera
          transform, so they always fully cover the screen during pan/zoom */}
      <Background />
      <BackgroundConstellations />

      {/* Camera/World Container - click and drag the background to pan.
          Drag is started manually (dragListener=false + onPointerDown) and
          only fires when the pointer-down target is the world div itself,
          never a descendant button/card, so node clicks are never eaten
          by the drag gesture recognizer. */}
      <motion.div
        className="constellation-world absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ transformOrigin: "0% 0%", x: worldX, y: worldY, scale: worldScale }}
        drag
        dragListener={false}
        dragControls={dragControls}
        dragMomentum={false}
        dragElastic={0}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) {
            dragControls.start(e);
          }
        }}
      >
        {/* SVG Layer - All branches */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ zIndex: 5 }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Main constellation branches */}
          {!selectedCategory && mainNodes.map((node) => {
            const branch = generateMainBranch(node);
            return (
              <motion.path
                key={branch.id}
                d={branch.d}
                fill="none"
                stroke={node.color}
                strokeWidth="0.15"
                strokeLinecap="round"
                opacity={0.3}
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: node.delay }}
              />
            );
          })}

          {/* Tree branches */}
          {showTree && treeLayout && treeLayout.branches.map((branch, index) => (
            <motion.path
              key={branch.id}
              d={branch.d}
              fill="none"
              stroke={selectedNode?.color}
              strokeWidth="0.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              style={{
                filter: `drop-shadow(0 0 4px ${selectedNode?.color})`,
              }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              transition={{
                pathLength: { duration: 0.8, delay: index * 0.15, ease: "easeOut" },
                opacity: { duration: 0.3, delay: index * 0.15 },
              }}
            />
          ))}
        </svg>

        {/* Main Constellation Nodes */}
        {mainNodes.map((node) => {
          const isSelected = selectedCategory === node.title;

          return (
            <motion.button
              key={node.id}
              type="button"
              onClick={() => handleNodeClick(node.title)}
              className="constellation-node group absolute z-10"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: selectedCategory && !isSelected ? 0.3 : 1,
                scale: 1,
              }}
              transition={{ delay: node.delay, duration: 0.6 }}
            >
              {/* Glow */}
              <div
                className="absolute -inset-4 rounded-full opacity-30 blur-xl transition-opacity duration-300 group-hover:opacity-60"
                style={{ backgroundColor: node.color }}
              />

              {/* Node */}
              <div
                className="relative h-6 w-6 rounded-full border-2 transition-all duration-300"
                style={{
                  borderColor: node.color,
                  backgroundColor: isSelected ? node.color : "transparent",
                  boxShadow: `0 0 20px ${node.color}`,
                }}
              >
                <div
                  className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ backgroundColor: node.color }}
                />
              </div>

              {/* Label */}
              <div
                className="absolute top-8 whitespace-nowrap text-xs font-medium uppercase tracking-wider opacity-70 transition-opacity group-hover:opacity-100"
                style={{ color: node.color, left: "50%", transform: "translateX(-50%)" }}
              >
                {node.title}
              </div>
            </motion.button>
          );
        })}

        {/* Center Rune */}
        <div
          className="absolute z-10"
          style={{
            left: `${centerPos.x}%`,
            top: `${centerPos.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <CenterRune activeColor={selectedNode?.color} />
        </div>

        {/* Expanded Tree Nodes and Cards */}
        <AnimatePresence>
          {showTree && treeLayout && treeLayout.nodes.map((node, index) => {
            const card = treeLayout.cards.find((c) => c.nodeId === node.id);
            if (!card) return null;

            const isChildSelected = selectedChildNode === node.id;
            const isOtherSelected = selectedChildNode && selectedChildNode !== node.id;
            const display = getNodeDisplay(selectedCategory!, node.data);

            return (
              <motion.div
                key={node.id}
                className="absolute z-20"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: isOtherSelected ? 0.4 : 1,
                  scale: 1,
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  delay: index * 0.15 + 0.5,
                  duration: 0.4,
                }}
              >
                <div
                  className="relative flex items-center gap-3"
                  style={{
                    transform: "translate(-50%, -50%)",
                    flexDirection: card.isRight ? "row" : "row-reverse",
                  }}
                >
                  {/* Constellation Node */}
                  <button
                    type="button"
                    onClick={() => setSelectedChildNode(isChildSelected ? null : node.id)}
                    className="group relative flex-shrink-0"
                  >
                    <div
                      className="absolute -inset-3 rounded-full opacity-30 blur-lg transition-opacity group-hover:opacity-60"
                      style={{ backgroundColor: selectedNode?.color }}
                    />
                    <div
                      className="relative h-3 w-3 rounded-full border-2 transition-all duration-300 group-hover:scale-150"
                      style={{
                        borderColor: selectedNode?.color,
                        backgroundColor: "transparent",
                        boxShadow: `0 0 15px ${selectedNode?.color}`,
                      }}
                    >
                      <div
                        className="absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                        style={{ backgroundColor: selectedNode?.color }}
                      />
                    </div>
                  </button>

                  {/* Compact Card */}
                  <button
                    type="button"
                    onClick={() => setSelectedChildNode(isChildSelected ? null : node.id)}
                    className="group cursor-pointer rounded-xl border bg-[#02030a]/98 p-4 text-left backdrop-blur-xl transition-all duration-300 hover:shadow-2xl"
                    style={{
                      width: `${card.width}vw`,
                      minHeight: `${card.height}vh`,
                      borderColor: `${selectedNode?.color}40`,
                      boxShadow: `0 0 25px ${selectedNode?.color}25`,
                    }}
                  >
                    {display.badge && (
                      <div
                        className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase"
                        style={{
                          backgroundColor: `${selectedNode?.color}20`,
                          color: selectedNode?.color,
                        }}
                      >
                        {display.badge}
                      </div>
                    )}
                    <h3 className="mb-1 text-sm font-bold text-white">
                      {display.title}
                    </h3>
                    {display.subtitle && (
                      <p className="mb-2 text-xs text-white/50">{display.subtitle}</p>
                    )}
                    {display.bodyLines.length > 0 && (
                      <>
                        <div className="h-px bg-white/10 mb-2" />
                        <p className="text-xs text-white/70 line-clamp-2">
                          {display.bodyLines[0]}
                        </p>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Detailed Dialog - rendered OUTSIDE the camera/world transform.
          A `transform` on an ancestor creates a new containing block, which
          would break `position: fixed` and center the dialog on the
          transformed world instead of the real viewport. */}
      <AnimatePresence>
        {selectedChildNode && treeLayout && (() => {
            const nodeData = treeLayout.nodes.find((n) => n.id === selectedChildNode)?.data;
            if (!nodeData) return null;
            const display = getNodeDisplay(selectedCategory!, nodeData);

            return (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div
                  className="absolute inset-0 bg-black/85 backdrop-blur-lg"
                  onClick={() => setSelectedChildNode(null)}
                />
                <motion.div
                  className="relative z-10 max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl border bg-[#02030a]/98 p-8 backdrop-blur-xl"
                  style={{
                    borderColor: `${selectedNode?.color}60`,
                    boxShadow: `0 0 60px ${selectedNode?.color}40`,
                  }}
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                >
                  <button
                    onClick={() => setSelectedChildNode(null)}
                    className="absolute right-6 top-6 rounded-full border border-white/20 p-2 hover:bg-white/10"
                  >
                    <svg className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {display.badge && (
                    <div
                      className="mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-bold uppercase"
                      style={{
                        backgroundColor: `${selectedNode?.color}25`,
                        color: selectedNode?.color,
                      }}
                    >
                      {display.badge}
                    </div>
                  )}
                  <h2 className="mb-2 text-3xl font-bold text-white">{display.title}</h2>
                  {display.subtitle && (
                    <p className="mb-8 text-xl text-white/60">{display.subtitle}</p>
                  )}

                  {display.bodyLines.length > 0 && (
                    <div className="mb-8">
                      {display.bodyLines.length > 1 && (
                        <h3 className="mb-4 text-sm font-bold uppercase" style={{ color: selectedNode?.color }}>
                          Details
                        </h3>
                      )}
                      <ul className="space-y-3">
                        {display.bodyLines.map((line: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3 text-white/85">
                            <span
                              className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                              style={{ backgroundColor: selectedNode?.color }}
                            />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {display.tags && display.tags.length > 0 && (
                    <div className="mb-8">
                      <h3 className="mb-4 text-sm font-bold uppercase" style={{ color: selectedNode?.color }}>
                        Technologies & Tools
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {display.tags.map((tech: string, idx: number) => (
                          <span
                            key={idx}
                            className="rounded-lg border px-4 py-2 text-sm font-medium"
                            style={{
                              borderColor: `${selectedNode?.color}60`,
                              color: selectedNode?.color,
                              backgroundColor: `${selectedNode?.color}15`,
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {display.link && (
                    <a
                      href={display.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-white/10"
                      style={{
                        borderColor: `${selectedNode?.color}60`,
                        color: selectedNode?.color,
                      }}
                    >
                      Visit Link →
                    </a>
                  )}
                </motion.div>
              </motion.div>
            );
          })()}
      </AnimatePresence>
    </main>
  );
}
