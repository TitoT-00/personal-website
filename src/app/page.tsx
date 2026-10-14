"use client";

import { useCallback, useState } from "react";
import PortfolioDialog from "@/src/components/PortfolioDialog/PortfolioDialog";
import SpatialUniverse from "@/src/components/Universe/SpatialUniverse";
import Starfield from "@/src/components/Universe/Starfield";
import { portfolioData, type PortfolioData } from "@/src/data/portfolioData";
import { portfolioCategories, siteContent } from "@/src/data/siteData";
import { spatialContent } from "@/src/data/spatialData";

export default function Home() {
  const [selected, setSelected] = useState<keyof PortfolioData | null>(null);
  const [expanded, setExpanded] = useState<keyof PortfolioData | null>(null);
  const [activeItem, setActiveItem] = useState(0);
  const [paused, setPaused] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [reset, setReset] = useState(0);
  const [view, setView] = useState<"universe" | "index">("universe");

  const open = useCallback((category: keyof PortfolioData, index = 0) => {
    if (portfolioData[category].length === 0) return;
    setActiveItem(index);
    setSelected(category);
  }, []);
  const expand = useCallback((category: keyof PortfolioData | null) => {
    setExpanded(category);
    setZoom(1);
  }, []);
  const resetScene = () => { setZoom(1); setExpanded(null); setReset(value => value + 1); };

  return (
    <main className="portfolio immersive-portfolio">
      <Starfield paused={paused || selected !== null} />
      <section className="intro immersive-intro">
        <div className="intro-kicker"><span /> {siteContent.role} <span className="kicker-separator">/</span> PERSONAL PORTFOLIO</div>
        <h1>{spatialContent.greeting}<br /><span>{spatialContent.headline}</span></h1>
        <p>{spatialContent.introduction}</p>
        <div className="intro-meta">{spatialContent.disciplines.map(discipline => <span key={discipline}>{discipline}</span>)}</div>
      </section>

      <section className="scene immersive-scene" aria-label="Interactive portfolio constellation">
        <div className="scene-topline">
          <span className="scene-caption">{spatialContent.sceneTitle}</span>
          <div className="view-switch" aria-label="Portfolio view">
            <button aria-pressed={view === "universe"} className={view === "universe" ? "current" : ""} onClick={() => setView("universe")}><span>◉</span> Universe</button>
            <button aria-pressed={view === "index"} className={view === "index" ? "current" : ""} onClick={() => setView("index")}><span>☷</span> Index</button>
          </div>
        </div>

        {view === "universe" ? <SpatialUniverse expanded={expanded} onExpand={expand} onOpen={open} paused={paused || selected !== null} zoom={zoom} reset={reset} /> :
          <div className="category-index">{portfolioCategories.map((category, index) => <button key={category.name} onClick={() => open(category.name)} style={{ "--node-color": category.color } as React.CSSProperties}>
            <span>{String(index + 1).padStart(2, "0")} / {category.icon}</span>
            <strong>{category.name === "Side Projects" ? "Projects" : category.name}</strong>
            <span>{portfolioData[category.name].length} connections <span>↗</span></span>
          </button>)}</div>
        }

        <div className="scene-bottom">
          <span className="drag-hint"><span>{view === "universe" ? spatialContent.sceneHint : "Choose a section to explore my work."}</span></span>
          {view === "universe" && <div className="scene-controls">
            <button aria-label="Zoom out" disabled={zoom <= .75} onClick={() => setZoom(value => Math.max(.75, value - .25))}>−</button>
            <span aria-live="polite">{Math.round(zoom * 100)}%</span>
            <button aria-label="Zoom in" disabled={zoom >= 3} onClick={() => setZoom(value => Math.min(3, value + .25))}>+</button>
            <button className="read-zoom" onClick={() => setZoom(zoom === 1 ? 1.75 : 1)}>{zoom === 1 ? "Read" : "Fit"}</button>
            <i />
            <button aria-label="Reset constellation" onClick={resetScene}>⟲</button>
            <button aria-label={paused ? "Resume animation" : "Pause animation"} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? "▷" : "Ⅱ"}</button>
          </div>}
        </div>
      </section>

      <footer className="portfolio-footer"><span>{siteContent.identity} <span>·</span> {siteContent.role}</span><button onClick={() => open("Contact")}>{siteContent.footerAction} <span>↗</span></button></footer>
      <PortfolioDialog selected={selected} activeItem={activeItem} onSelectItem={setActiveItem} onClose={() => setSelected(null)} />
    </main>
  );
}
