"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { portfolioData, type PortfolioData } from "@/src/data/portfolioData";
import { getNodeDisplay } from "@/src/utils/nodeDisplay";

export type ConstellationCategory = {
  name: keyof PortfolioData; color: string; icon: string; x: number; y: number;
};
type Props = {
  categories: ConstellationCategory[];
  expanded: keyof PortfolioData | null;
  onExpand: (category: keyof PortfolioData | null) => void;
  onOpen: (category: keyof PortfolioData, index: number) => void;
  children: ReactNode;
  zoom: number;
};

export default function SectionConstellation({ categories, expanded, onExpand, onOpen, children, zoom }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const previousZoom = useRef(zoom);
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  useLayoutEffect(() => {
    const el = container.current;
    if (el) {
      const ratio = zoom / previousZoom.current;
      el.scrollLeft = zoom === 1 ? 0 : (el.scrollLeft + el.clientWidth / 2) * ratio - el.clientWidth / 2;
      el.scrollTop = zoom === 1 ? 0 : (el.scrollTop + el.clientHeight / 2) * ratio - el.clientHeight / 2;
    }
    previousZoom.current = zoom;
  }, [zoom]);
  const [size, setSize] = useState({ width: 1000, height: 650 });
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  const category = categories.find(c => c.name === expanded);
  const root = { x: (category?.x || 50) * 10, y: (category?.y || 49) * 6.5 };
  const direction = Math.atan2(root.y - 318.5, root.x - 500);
  const branching = expanded === "Career" || expanded === "Education";
  const items = expanded ? portfolioData[expanded] : [];
  const nodes = items.map((item, index) => {
    const ring = Math.floor(index / 5);
    const count = Math.min(5, items.length - ring * 5);
    const localIndex = index % 5;
    const angle = direction + (count === 1 ? 0 : (localIndex / (count - 1) - .5) * 1.6);
    const distance = branching ? 210 + index * 210 : 300 + ring * 240;
    const offset = branching ? (index % 2 === 0 ? -45 : 45) : 0;
    const x = root.x + Math.cos(branching ? direction : angle) * distance - Math.sin(direction) * offset;
    const y = root.y + Math.sin(branching ? direction : angle) * distance + Math.cos(direction) * offset;
    return { item, index, x, y, display: getNodeDisplay(expanded!, item) };
  });
  // The entire world shares one camera: hubs never move relative to the core.
  const minX = Math.min(0, ...nodes.map(n => n.x - 95));
  const maxX = Math.max(1000, ...nodes.map(n => n.x + 95));
  const minY = Math.min(0, ...nodes.map(n => n.y - 20));
  const maxY = Math.max(650, ...nodes.map(n => n.y + 95));
  const stageWidth = expanded ? Math.max(size.width, 700) : size.width;
  const scale = Math.min(stageWidth / (maxX - minX), size.height / (maxY - minY)) * zoom;
  const centerX = (minX + maxX) / 2, centerY = (minY + maxY) / 2;

  return <div ref={container} tabIndex={0} aria-label="Portfolio map. Use zoom controls to enlarge text, then drag or scroll to explore."
    onPointerDownCapture={e => {
      if (zoom <= 1 || e.button !== 0 || (e.target as HTMLElement).closest("button")) return;
      e.stopPropagation();
      drag.current = { x: e.clientX, y: e.clientY, left: e.currentTarget.scrollLeft, top: e.currentTarget.scrollTop };
      e.currentTarget.setPointerCapture(e.pointerId);
    }}
    onPointerMove={e => {
      if (!drag.current) return;
      e.currentTarget.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
      e.currentTarget.scrollTop = drag.current.top - (e.clientY - drag.current.y);
    }}
    onPointerUp={() => { drag.current = null; }}
    onPointerCancel={() => { drag.current = null; }}
    style={{ touchAction: zoom > 1 ? "none" : "auto" }} className={`anchored-constellation ${expanded ? "has-expansion" : ""}`}>
    {expanded && <div className="branch-actions"><button onClick={() => onExpand(null)}>← Back</button><button onClick={() => onOpen(expanded, 0)}>{expanded} details ↗</button></div>}
    <div style={{ position: "relative", width: stageWidth * zoom, height: size.height * zoom }}>
    <div className="constellation-world-map" style={{ transform: `translate(-50%, -50%) scale(${scale}) translate(${500 - centerX}px, ${325 - centerY}px)` }}>
      {children}
      <svg className="anchored-lines" viewBox="0 0 1000 650" aria-hidden="true">
        {categories.map(c => <path key={c.name} className="hub-connection" d={`M 500 318.5 L ${(500 + c.x * 10) / 2} ${318.5 + (c.y * 6.5 - 318.5) * .3} L ${c.x * 10} ${c.y * 6.5}`} stroke={c.color} />)}
        {nodes.map((node, i) => {
          const start = branching && i > 0 ? nodes[i - 1] : root;
          const mid = { x: start.x + (node.x - start.x) * .5, y: start.y + (node.y - start.y) * .35 };
          return <path key={`${expanded}-${node.item.id}`} className="anchored-branch" stroke={category?.color} d={`M ${start.x} ${start.y} L ${mid.x} ${mid.y} L ${node.x} ${node.y}`} pathLength="1" style={{ animationDelay: `${i * 50}ms` }} />;
        })}
      </svg>
      <div className="core-label"><strong>TT.</strong></div>
      {categories.map(c => <button key={c.name} className={`anchored-hub ${expanded && expanded !== c.name ? "muted-hub" : ""}`} style={{ left: c.x * 10, top: c.y * 6.5, "--node-color": c.color } as CSSProperties} onClick={() => onExpand(expanded === c.name ? null : c.name)} aria-expanded={expanded === c.name} aria-label={`Explore ${c.name} constellation`}><span className="node-orb">{c.icon}</span><span className="hub-title">{c.name}</span></button>)}
      {nodes.map(({ item, index, x, y, display }) => <button key={`${expanded}-${item.id}`} className="anchored-leaf" style={{ left: x, top: y, "--node-color": category?.color, animationDelay: `${index * 50}ms` } as CSSProperties} onClick={() => onOpen(expanded!, index)} aria-label={`Explore ${display.title}${display.subtitle ? `, ${display.subtitle}` : ""}`}><span className="leaf-star" /><span className="leaf-copy">{branching && <small>{display.badge}</small>}<strong>{branching ? display.subtitle?.split(" • ")[0] : display.title}</strong>{branching && <span>{display.title}</span>}</span></button>)}
    </div>
    </div>
  </div>;
}
