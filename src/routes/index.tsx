import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  component: Index,
});

const CREAM = "#F5F5DC";

const GALLERY_TITLES = [
  "Look 01",
  "Look 02",
  "Look 03",
  "Look 04",
  "Look 05",
  "Look 06",
  "Look 07",
];

// Placeholder tones for the gallery tiles until real photography is swapped in.
const TILE_COLORS = [
  "linear-gradient(160deg,#8aa0b6 0%,#5d7893 60%,#3e5670 100%)",
  "linear-gradient(160deg,#efeae0 0%,#ded5c4 55%,#bdb096 100%)",
  "linear-gradient(160deg,#f2f2ef 0%,#d9d8d2 55%,#8f8e86 100%)",
  "linear-gradient(160deg,#9a9a94 0%,#6b6b64 55%,#3c3c37 100%)",
  "linear-gradient(160deg,#b3584f 0%,#8c443d 55%,#5e2e29 100%)",
  "linear-gradient(160deg,#394356 0%,#283243 55%,#1b2331 100%)",
  "radial-gradient(circle at 50% 40%,#3a3a44 0%,#141417 70%), linear-gradient(#141417,#141417)",
];

function CornerBrackets() {
  const bracket = "pointer-events-none absolute w-8 h-8 sm:w-12 sm:h-12 border-[CREAM]";
  return (
    <>
      <div className={`${bracket} left-4 top-4 border-l border-t`} style={{ borderColor: CREAM }} />
      <div className={`${bracket} right-4 top-4 border-r border-t`} style={{ borderColor: CREAM }} />
      <div className={`${bracket} bottom-4 left-4 border-b border-l`} style={{ borderColor: CREAM }} />
      <div className={`${bracket} bottom-4 right-4 border-b border-r`} style={{ borderColor: CREAM }} />
    </>
  );
}

function NewYorkTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatted = now
    ? Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        hour: "numeric",
        minute: "2-digit",
        meridiem: "short",
      }).format(now)
    : "";

  return (
    <span className="whitespace-nowrap text-xs uppercase tracking-[0.2em]" style={{ color: CREAM }}>
      {formatted.replace(" ", "")}&nbsp;&middot;&nbsp;NYC
    </span>
  );
}

function Index() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-black" style={{ color: CREAM }}>
      <CornerBrackets />

      {/* Header */}
      <header className="flex shrink-0 items-center justify-center pt-8 pb-4">
        <button
          type="button"
          className="cursor-pointer text-xs font-medium uppercase tracking-[0.35em] transition-opacity hover:opacity-60"
          style={{ color: CREAM }}
        >
          Menu
        </button>
      </header>

      {/* Hero typography */}
      <section className="flex flex-col px-4 sm:px-10 md:px-16 lg:px-24">
        <h1
          className="font-serif-didone uppercase leading-[0.85] tracking-[-0.04em]"
          style={{ fontSize: "clamp(4.5rem, 17vw, 15rem)" }}
        >
          <span className="block pl-0 text-left">Dondre</span>
          <span className="block pr-0 text-right">Green</span>
        </h1>
      </section>

      {/* Gallery */}
      <section className="grid shrink-0 grid-cols-2 gap-x-2 gap-y-8 overflow-x-auto px-3 py-8 sm:grid-cols-4 md:gap-x-3 md:px-4 lg:grid-cols-7 lg:overflow-visible lg:px-5">
        {TILE_COLORS.map((bg, i) => (
          <figure
            key={i}
            className="group relative shrink-0 cursor-pointer"
            style={{ aspectRatio: "3 / 4" }}
          >
            <div
              className="absolute inset-0 opacity-70 saturate-[0.85] transition duration-500 ease-out group-hover:scale-[1.03] group-hover:opacity-100 group-hover:saturate-100"
              style={{ backgroundImage: bg }}
            />
            <figcaption className="pointer-events-none absolute inset-0 flex items-end justify-start p-3 text-[11px] uppercase tracking-[0.2em] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {GALLERY_TITLES[i]}
            </figcaption>
          </figure>
        ))}
      </section>

      {/* Spacer */}
      <div className="grow" />

      {/* Footer */}
      <footer className="mx-auto mb-10 grid w-full max-w-6xl grid-cols-3 items-end gap-4 px-8 sm:mb-12 sm:px-14">
        <div className="justify-self-start">
          <button
            type="button"
            className="cursor-pointer text-xs font-medium uppercase tracking-[0.3em] transition-opacity hover:opacity-60"
            style={{ color: CREAM }}
          >
            Change Theme
          </button>
        </div>
        <div
          className="hidden justify-self-center text-sm italic uppercase tracking-[0.18em] sm:block"
          style={{ fontFamily: "'Newsreader', Georgia, 'Times New Roman', serif", color: CREAM }}
        >
          ART DIRECTOR
          <br />
          PHOTOGRAPHER
        </div>
        <div className="self-end justify-self-end">
          <NewYorkTime />
        </div>
      </footer>
    </main>
  );
}
