type CenterRuneProps = {
  activeColor?: string;
};

export default function CenterRune({ activeColor }: CenterRuneProps) {
  const borderColor = activeColor || "rgba(147, 197, 253, 0.2)";
  const glowColor = activeColor ? `${activeColor}40` : "rgba(80, 130, 255, 0.2)";
  const textColor = activeColor || "rgba(191, 219, 254, 0.6)";

  return (
    <section className="relative z-10 flex flex-col items-center text-center">
      <div
        className="absolute h-72 w-72 rounded-full border transition-all duration-700"
        style={{
          borderColor: borderColor,
          boxShadow: `0 0 80px ${glowColor}`,
        }}
      />

      <div className="absolute h-56 w-56 animate-pulse rounded-full border border-white/10 transition-all duration-700" />

      <div
        className="relative flex h-48 w-48 items-center justify-center rounded-full border bg-white/[0.02] backdrop-blur-sm transition-all duration-700"
        style={{
          borderColor: activeColor || "rgba(255, 255, 255, 0.2)",
          boxShadow: activeColor ? `0 0 40px ${activeColor}30` : "none",
        }}
      >
        <div>
          <p
            className="mb-2 text-xs uppercase tracking-[0.5em] transition-colors duration-700"
            style={{
              color: textColor,
            }}
          >
            Software Engineer
          </p>

          <h1
            className="text-3xl font-light tracking-[0.15em] transition-colors duration-700"
            style={{
              color: activeColor || "white",
            }}
          >
            TITO THOMAS
          </h1>
        </div>
      </div>

      <p className="mt-12 text-sm uppercase tracking-[0.35em] text-white/40">
        {activeColor ? "Exploring..." : "Choose a path"}
      </p>
    </section>
  );
}