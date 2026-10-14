"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { getSpatialGraph } from "@/src/data/spatialData";
import type { PortfolioData } from "@/src/data/portfolioData";
import { createSpatialRenderer } from "./spatialRenderer";

type Props = {
  expanded: keyof PortfolioData | null;
  onExpand: (category: keyof PortfolioData | null) => void;
  onOpen: (category: keyof PortfolioData, index: number) => void;
  paused: boolean;
  zoom: number;
  reset: number;
};

export default function SpatialUniverse({ expanded, onExpand, onOpen, paused, zoom, reset }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const labels = useRef(new Map<string, HTMLButtonElement>());
  const coreLabel = useRef<HTMLDivElement>(null);
  const settings = useRef({ paused, zoom, onExpand, onOpen, expanded });
  const engine = useRef<ReturnType<typeof createSpatialRenderer> | null>(null);
  const [fallback, setFallback] = useState(false);
  const graph = useMemo(() => getSpatialGraph(expanded), [expanded]);

  useEffect(() => { settings.current = { paused, zoom, onExpand, onOpen, expanded }; }, [paused, zoom, onExpand, onOpen, expanded]);
  useEffect(() => {
    if (!host.current) return;
    try {
      engine.current = createSpatialRenderer(host.current, labels.current, coreLabel.current, () => settings.current);
    } catch {
      queueMicrotask(() => setFallback(true));
    }
    return () => { engine.current?.dispose(); engine.current = null; };
  }, []);
  useEffect(() => { engine.current?.setGraph(graph); }, [graph]);
  useEffect(() => { engine.current?.setZoom(zoom); }, [zoom]);
  useEffect(() => { engine.current?.reset(); }, [reset]);

  return <div ref={host} className={`spatial-scene ${zoom > 1 ? "spatial-reading" : ""} ${fallback ? "spatial-fallback" : ""}`}>
    {expanded && <div className="spatial-back"><button onClick={() => onExpand(null)}>← All connections</button><button onClick={() => onOpen(expanded, 0)}>{expanded} details ↗</button></div>}
    <div className="spatial-labels">
      <div ref={coreLabel} className="spatial-core-label"><strong>TT</strong><span>SOFTWARE ENGINEER</span></div>
      {graph.nodes.map((node, i) => <button key={node.id}
        ref={el => { if (el) labels.current.set(node.id, el); else labels.current.delete(node.id); }}
        className={`spatial-node ${node.itemIndex === undefined ? "spatial-hub" : "spatial-leaf"} ${expanded === node.category ? "is-active" : expanded ? "is-muted" : ""}`}
        style={{ "--node-color": node.color, transform: "translate(-50%, -50%)", ...(fallback ? { left: `${12 + (i % 3) * 34}%`, top: `${20 + Math.floor(i / 3) * 18}%` } : {}) } as CSSProperties}
        aria-label={`Explore ${node.title}`} aria-expanded={node.itemIndex === undefined ? expanded === node.category : undefined}
        onClick={() => node.itemIndex === undefined ? onExpand(expanded === node.category ? null : node.category) : onOpen(node.category, node.itemIndex)}>
        {node.itemIndex === undefined && <><span className="node-glyph">{node.icon}</span><span className="node-index">{String(i + 1).padStart(2, "0")}</span></>}
        {node.itemIndex !== undefined && <span className="label-leader" aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", height: 1, background: node.color, transformOrigin: "left center", pointerEvents: "none", opacity: 0 }} />}
        <span className="node-label">{node.title}<span>↗</span></span><span className="node-meta">{node.subtitle}</span>
      </button>)}
    </div>
    {fallback && <p className="spatial-fallback-note">Explore the connections below, or switch to Index for a complete view.</p>}
  </div>;
}
