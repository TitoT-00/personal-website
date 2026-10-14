"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { portfolioData, type PortfolioData } from "@/src/data/portfolioData";
import { portfolioCategories, siteContent } from "@/src/data/siteData";
import { getNodeDisplay } from "@/src/utils/nodeDisplay";

type PortfolioDialogProps = {
  selected: keyof PortfolioData | null;
  activeItem: number;
  onSelectItem: (index: number) => void;
  onClose: () => void;
};

export default function PortfolioDialog({ selected, activeItem, onSelectItem, onClose }: PortfolioDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const category = portfolioCategories.find((entry) => entry.name === selected);
  const items = selected ? portfolioData[selected] : [];
  const safeIndex = Math.max(0, Math.min(activeItem, items.length - 1));
  const item = items[safeIndex];
  const display = selected && item ? getNodeDisplay(selected, item) : null;
  const skill = selected === "Skills" ? portfolioData.Skills[safeIndex] : null;
  const wide = selected === "Career" || selected === "Side Projects";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selected && items.length > 0 && !dialog.open) dialog.showModal();
    else if ((!selected || items.length === 0) && dialog.open) dialog.close();
  }, [selected, items.length]);

  useEffect(() => {
    dialogRef.current?.scrollTo({ top: 0 });
  }, [selected, activeItem]);

  return (
    <dialog
      ref={dialogRef}
      className={`portfolio-dialog ${wide ? "portfolio-dialog-wide" : ""} ${selected === "Contact" ? "portfolio-dialog-contact" : ""}`}
      style={{ "--dialog-accent": category?.color ?? "#b89aff" } as CSSProperties}
      aria-labelledby="portfolio-dialog-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      {selected && display && (
        <div className="portfolio-dialog-inner">
          <header className="portfolio-dialog-header">
            <div className="portfolio-dialog-heading">
              <span className="portfolio-dialog-symbol" aria-hidden="true">{category?.icon}</span>
              <div>
                <span className="portfolio-dialog-identity">{siteContent.identity}</span>
                <h2 id="portfolio-dialog-title">{selected}<span>.</span></h2>
              </div>
            </div>
            <button className="portfolio-dialog-close" onClick={onClose} aria-label="Close details">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
          </header>

          {selected === "Contact" ? (
            <div className="portfolio-contact-list">
              {portfolioData.Contact.map((contact, index) => (
                <a
                  key={contact.id}
                  className={`portfolio-contact-card ${index === safeIndex ? "is-selected" : ""}`}
                  href={contact.link}
                  target={contact.link.startsWith("mailto:") ? undefined : "_blank"}
                  rel={contact.link.startsWith("mailto:") ? undefined : "noreferrer"}
                  onClick={() => onSelectItem(index)}
                >
                  <span className="portfolio-contact-icon" aria-hidden="true">{contact.platform === "Email" ? "@" : contact.platform === "GitHub" ? "⌘" : "in"}</span>
                  <span className="portfolio-contact-copy"><strong>{contact.label}</strong><span>{contact.value}</span></span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" /></svg>
                </a>
              ))}
            </div>
          ) : (
            <div className={`portfolio-dialog-layout ${selected === "Career" ? "portfolio-dialog-timeline" : ""} ${selected === "Skills" ? "portfolio-dialog-skills" : ""}`}>
              <nav className="portfolio-dialog-items" aria-label={`${selected} entries`}>
                {items.map((entry, index) => {
                  const entryDisplay = getNodeDisplay(selected, entry);
                  const title = selected === "Career" ? entryDisplay.subtitle : selected === "Education" ? portfolioData.Education[index].institution : entryDisplay.title;
                  return (
                    <button key={entry.id} className={index === safeIndex ? "is-selected" : ""} aria-pressed={index === safeIndex} onClick={() => onSelectItem(index)}>
                      <span className="portfolio-item-indicator" aria-hidden="true" />
                      <span className="portfolio-item-copy"><strong>{title}</strong>{selected === "Career" && <small>{entryDisplay.badge}</small>}</span>
                      <span className="portfolio-item-arrow" aria-hidden="true">↗</span>
                    </button>
                  );
                })}
              </nav>
              <article className="portfolio-dialog-detail" key={`${selected}-${safeIndex}`}>
                <div className="portfolio-detail-heading">
                  {display.badge && selected !== "Skills" && <span className="portfolio-detail-badge">{display.badge}</span>}
                  <h3>{display.title}</h3>
                  {display.subtitle && selected !== "Side Projects" && <p className="portfolio-detail-subtitle">{display.subtitle}</p>}
                </div>
                {selected === "Career" ? (
                  <ul className="portfolio-career-responsibilities">{display.bodyLines.map((line) => <li key={line}>{line}</li>)}</ul>
                ) : selected === "Skills" && skill ? (
                  <div className="portfolio-skill-level">
                    <div><span>Proficiency</span><strong>{skill.level}<small>/10</small></strong></div>
                    <div className="portfolio-skill-meter" role="meter" aria-label={`${skill.name} proficiency`} aria-valuemin={0} aria-valuemax={10} aria-valuenow={skill.level}>
                      {Array.from({ length: 10 }, (_, index) => <span key={index} className={index < skill.level ? "is-filled" : ""} />)}
                    </div>
                    <p>{skill.yearsOfExperience}+ years of experience</p>
                  </div>
                ) : (
                  <div className="portfolio-detail-body">{display.bodyLines.map((line) => <p key={line}>{line}</p>)}</div>
                )}
                {!!display.tags?.length && <div className="portfolio-detail-tags">{display.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
                {display.link && (
                  <a className="portfolio-detail-link" href={display.link} target="_blank" rel="noreferrer">View project <span aria-hidden="true">↗</span></a>
                )}
              </article>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
