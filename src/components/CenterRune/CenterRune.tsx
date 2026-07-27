export default function CenterRune() {
    return (
           <section className="relative z-10 flex flex-col items-center text-center">
        <div className="absolute h-72 w-72 rounded-full border border-blue-300/20 shadow-[0_0_80px_rgba(80,130,255,0.2)]" />

        <div className="absolute h-56 w-56 animate-pulse rounded-full border border-white/10" />

        <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-white/20 bg-white/[0.02] backdrop-blur-sm">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.5em] text-blue-200/60">
              Software Engineer
            </p>

            <h1 className="text-3xl font-light tracking-[0.15em]">
              TITO THOMAS
            </h1>
          </div>
        </div>

        <p className="mt-12 text-sm uppercase tracking-[0.35em] text-white/40">
          Choose a path
        </p>
      </section>
    );
}