type ConstellationNodeProps = {
  title: string;
  x: number;
  y: number;
  color: string;
  delay?: number;
  onActivate: (title: string) => void;
  onDeactivate: () => void;
};

export default function ConstellationNode({
  title,
  x,
  y,
  color,
  delay = 0,
  onActivate,
  onDeactivate,
}: ConstellationNodeProps) {
  return (
    <button
      type="button"
      className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      aria-label={`Open ${title} tree`}
      onMouseEnter={() => onActivate(title)}
      onMouseLeave={onDeactivate}
      onFocus={() => onActivate(title)}
      onBlur={onDeactivate}
    >
      <span
        className="constellation-node flex flex-col items-center gap-4"
        style={{
          animationDelay: `${delay}s`,
        }}
      >
        <span className="relative flex h-12 w-12 items-center justify-center">
          <span
            className="absolute h-full w-full rounded-full border opacity-0 transition-all duration-500 group-hover:scale-[1.8] group-hover:opacity-30"
            style={{ borderColor: color }}
          />

          <span
            className="absolute h-8 w-8 rounded-full opacity-20 blur-md transition-all duration-500 group-hover:scale-150 group-hover:opacity-70"
            style={{ backgroundColor: color }}
          />

          <span
            className="relative h-4 w-4 rounded-full border transition-all duration-500 group-hover:scale-150"
            style={{
              borderColor: color,
              backgroundColor: `${color}33`,
              boxShadow: `0 0 18px ${color}`,
            }}
          />
        </span>

        <span
          className="translate-y-2 whitespace-nowrap text-sm uppercase tracking-[0.3em] text-white/40 opacity-70 transition-all duration-500 group-hover:translate-y-0 group-hover:text-white group-hover:opacity-100"
          style={{
            textShadow: `0 0 12px ${color}`,
          }}
        >
          {title}
        </span>
      </span>
    </button>
  );
}