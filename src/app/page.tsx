"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SectionConstellation from "@/src/components/Universe/SectionConstellation";
import Universe from "@/src/components/Universe/Universe";
import { portfolioData, type PortfolioData } from "@/src/data/portfolioData";
import { getNodeDisplay } from "@/src/utils/nodeDisplay";

const categories: { name: keyof PortfolioData; caption: string; color: string; icon: string; x: number; y: number }[] = [
  { name: "Education", caption: "THE FOUNDATION", color: "#b89aff", icon: "◇", x: 28, y: 25 },
  { name: "Skills", caption: "MY TOOLKIT", color: "#79d7ea", icon: "⌘", x: 69, y: 20 },
  { name: "Career", caption: "THE JOURNEY", color: "#eac28b", icon: "▱", x: 82, y: 50 },
  { name: "Side Projects", caption: "BUILT WITH CURIOSITY", color: "#e79ba9", icon: "⌁", x: 69, y: 78 },
  { name: "Hobbies", caption: "BEYOND THE CODE", color: "#9bd4b2", icon: "✳", x: 28, y: 76 },
  { name: "Contact", caption: "LET’S CONNECT", color: "#c6cce3", icon: "↗", x: 16, y: 49 },
];
export default function Home() {
  const [selected, setSelected] = useState<keyof PortfolioData | null>(null);
  const [expanded, setExpanded] = useState<keyof PortfolioData | null>(null);
  const [paused, setPaused] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [reset, setReset] = useState(0);
  const [view, setView] = useState("universe");
  const [activeItem, setActiveItem] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const active = categories.find(c => c.name === selected);
  const constellation = categories.find(c => c.name === expanded);
  useEffect(() => { if (selected) dialog.current?.showModal(); else dialog.current?.close(); }, [selected]);
  const open = (name: keyof PortfolioData, index = 0) => { setActiveItem(index); setSelected(name); };
  return (
    <main className="portfolio">
      <header className="header">
        <Link className="brand" href="/" aria-label="Tito Thomas home"><span className="brand-mark">✳</span><span>TITO THOMAS<span className="brand-sub">SOFTWARE ENGINEER</span></span></Link>
        <nav aria-label="Main navigation"><button className={view === "universe" ? "nav-active" : ""} onClick={() => setView("universe")}>About me</button><button onClick={() => open("Side Projects")}>Selected work <span>↗</span></button><button onClick={() => open("Contact")}>Let’s talk <span>↗</span></button></nav>
        <span className="availability"><i /> OPEN TO OPPORTUNITIES</span>
      </header>
      <section className="intro"><h1>Hi, I’m Tito.<br /><span>I build for web and mobile.</span></h1><p>Full-stack software engineer with a focus on thoughtful products<br />and practical AI experiences.</p></section>
      <section className={`scene ${view === "universe" && expanded ? "scene-expanded" : ""}`} aria-label="Portfolio constellation">
        <div className="view-switch"><button className={view === "universe" ? "current" : ""} onClick={() => setView("universe")}>◉ &nbsp; Universe</button><button className={view === "list" ? "current" : ""} onClick={() => setView("list")}>☷ &nbsp; Index</button></div>
        {view === "universe" ? <SectionConstellation categories={categories} expanded={expanded} zoom={zoom} onExpand={category => { setExpanded(category); setZoom(1); }} onOpen={open}>
          <Universe paused={paused} zoom={1} reset={reset} color={active?.color || constellation?.color || "#a995ff"} />
        </SectionConstellation> : <div className="category-index">{categories.map((c, i) => <button key={c.name} onClick={() => open(c.name)}><span style={{ color: c.color }}>0{i + 1} / {c.icon}</span><strong>{c.name}</strong><span>{portfolioData[c.name].length} NODES &nbsp; ↗</span></button>)}</div>}
        <div className="scene-bottom"><span className="drag-hint">⤧ <span>{zoom > 1 ? "Drag to pan" : "Drag to rotate"} <b>·</b> + to enlarge text</span></span><div className="scene-controls"><button aria-label="Zoom out" disabled={zoom <= 1} onClick={() => setZoom(z => Math.max(1, Math.round((z - .25) * 100) / 100))}>−</button><span>{Math.round(zoom * 100)}%</span><button aria-label="Zoom in" disabled={zoom >= 4} onClick={() => setZoom(z => Math.min(4, Math.round((z + .25) * 100) / 100))}>+</button><button className="read-zoom" onClick={() => setZoom(zoom === 1 ? 2.5 : 1)}>{zoom === 1 ? "Read" : "Fit"}</button><i /><button aria-label="Reset view" onClick={() => { setZoom(1); setReset(r => r + 1); setExpanded(null); }}>⟲</button><button aria-label={paused ? "Resume animation" : "Pause animation"} aria-pressed={paused} onClick={() => setPaused(p => !p)}>{paused ? "▷" : "Ⅱ"}</button></div></div>
      </section>
      <footer><span>TITO THOMAS · SOFTWARE ENGINEER</span><button onClick={() => open("Contact")}>Get in touch ↗</button></footer>
      <dialog aria-label={selected || "Portfolio details"} ref={dialog} onCancel={() => setSelected(null)} onClick={e => { if (e.target === e.currentTarget) setSelected(null); }} className={`detail-dialog ${selected === "Career" || selected === "Side Projects" ? "detail-wide" : "detail-compact"}`}>
        {selected && <div className="detail-inner" style={{ "--node-color": active?.color } as React.CSSProperties}><div className="detail-top"><span className="eyebrow">TITO THOMAS</span><button aria-label="Close details" onClick={() => setSelected(null)}>✕</button></div><h2>{selected}<span>.</span></h2><div className="detail-layout"><div className="item-tabs">{portfolioData[selected].map((item, i) => { const d = getNodeDisplay(selected, item); return <button key={item.id} className={activeItem === i ? "selected" : ""} aria-pressed={activeItem === i} onClick={() => setActiveItem(i)}><span>{String(i + 1).padStart(2, "0")}</span>{d.title}<span>↗</span></button>; })}</div><article className="item-detail" key={`${selected}-${activeItem}`}>{(() => { const d = getNodeDisplay(selected, portfolioData[selected][activeItem]); return <>{selected === "Side Projects" && <div className="project-stage" onPointerMove={e => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--tilt", `${(e.clientX - r.left - r.width / 2) / 16}deg`); }} onPointerLeave={e => e.currentTarget.style.setProperty("--tilt", "-12deg")}><div className="project-model"><div className="mock-toolbar"><i /><i /><i /><span>{d.title}</span></div>{activeItem === 0 ? <div className="mock-app"><small>YOUR SPACE TO MAKE THINGS HAPPEN</small><h3>A little more focus.</h3>{["Design something meaningful", "Build the next idea", "Make room for curiosity"].map((s, i) => <div className="mock-task" key={s}><span>{i === 0 ? "✓" : "○"}</span>{s}<b>{i === 0 ? "Done" : "In progress"}</b></div>)}</div> : <div className="mock-weather"><span>☀</span><strong>24°</strong><p>A beautiful day for new ideas.</p><div>MON &nbsp; TUE &nbsp; WED &nbsp; THU &nbsp; FRI</div></div>}</div><span className="preview-caption">CONCEPT PREVIEW</span></div>}{d.badge && selected !== "Contact" && <span className="detail-badge">{d.badge}</span>}<h3>{d.title}</h3>{d.subtitle && <p className="detail-subtitle">{d.subtitle}</p>}{d.bodyLines.map(line => <p key={line}>{line}</p>)}{selected === "Skills" && <div className="skill-meter"><span style={{ width: `${portfolioData.Skills[activeItem].level * 10}%` }} /></div>}{!!d.tags?.length && <div className="tags">{d.tags.map(t => <span key={t}>{t}</span>)}</div>}{d.link && !d.link.includes("github.com/example") && <a className="visit-link" href={d.link} target="_blank" rel="noreferrer">{selected === "Contact" ? "Let’s connect" : "Explore project"} ↗</a>}</>; })()}</article></div></div>}
      </dialog>
    </main>
  );
}
