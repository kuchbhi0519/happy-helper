import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  component: Index,
});

const LIVE_SITE = "https://www.dondregreen.com/";

type Palette = { background: string; ink: string };

const PALETTES: Record<"black" | "paper", Palette> = {
  black: { background: "#000000", ink: "#F5F5DC" },
  paper: { background: "#F5F5DC", ink: "#0A0A0A" },
};

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

const MENU_LINKS: { label: string; href: string }[] = [
  { label: "Home", href: LIVE_SITE },
  { label: "Collection", href: `${LIVE_SITE}collection` },
  { label: "About", href: `${LIVE_SITE}about` },
  { label: "Contact", href: "mailto:hello@dondregreen.com" },
];

function CornerBrackets({ ink }: { ink: string }) {
  const bracket = "pointer-events-none absolute w-8 h-8 sm:w-12 sm:h-12";
  return (
    <>
      <div className={`${bracket} left-4 top-4 border-l border-t`} style={{ borderColor: ink }} />
      <div className={`${bracket} right-4 top-4 border-r border-t`} style={{ borderColor: ink }} />
      <div className={`${bracket} bottom-4 left-4 border-b border-l`} style={{ borderColor: ink }} />
      <div className={`${bracket} bottom-4 right-4 border-b border-r`} style={{ borderColor: ink }} />
    </>
  );
}

function NewYorkTime({ ink }: { ink: string }) {
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
    <span
      className="whitespace-nowrap text-xs uppercase tracking-[0.2em]"
      style={{ color: ink }}
    >
      {formatted.replace(" ", "")}&nbsp;&middot;&nbsp;NYC
    </span>
  );
}

function OverlayMenu({
  closedPalette,
  openPalette,
  onClose,
}: {
  closedPalette: Palette;
  openPalette: Palette;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const escKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", escKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", escKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    if (leaving) return;
    setLeaving(true);
    setVisible(false);
    setTimeout(onClose, 320);
  };

  return (
    <nav
      aria-label="Site menu"
      className={`fixed inset-0 z-50 transition-colors duration-300 ${
        leaving || visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ backgroundColor: openPalette.background }}
    >
      <div className="flex items-center justify-between px-8 py-6 sm:px-12">
        <span
          className="text-xs uppercase tracking-[0.35em]"
          style={{ color: openPalette.ink }}
        >
          Dontre Green
        </span>
        <button
          type="button"
          onClick={handleClose}
          className="cursor-pointer text-xs font-medium uppercase tracking-[0.35em] transition-opacity hover:opacity-60"
          style={{ color: openPalette.ink }}
        >
          Close
        </button>
      </div>

      <div className="flex flex-col items-start justify-center gap-6 px-8 pt-16 sm:items-center sm:px-12">
        {MENU_LINKS.map(({ label, href }, i) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noreferrer"
            className={`transition-all duration-300 hover:italic ${
              visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{
              transitionDelay: visible ? `${80 + i * 70}ms` : "0ms",
              color: openPalette.ink,
              fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
              fontSize: "clamp(2.2rem, 7vw, 5rem)",
              letterSpacing: "-0.02em",
              textDecoration: "none",
              lineHeight: 1.1,
            }}
          >
            {label}
          </a>
        ))}
      </div>

      <div
        className="absolute bottom-8 left-0 right-0 flex items-center justify-center"
        style={{ color: openPalette.ink }}
      >
        <span className="text-[11px] uppercase tracking-[0.25em] opacity-70">
          www.dontregreen.com
        </span>
      </div>
    </nav>
  );
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [palette, setPalette] = useState<Palette>(PALETTES.black);
  const openPalette: Palette =
    palette.background === PALETTES.black.background ? PALETTES.paper : PALETTES.black;

  const toggleTheme = () =>
    setPalette((p) => (p.background === "#000000" ? PALETTES.paper : PALETTES.black));

  const smallControl =
    "cursor-pointer text-xs font-medium uppercase tracking-[0.3em] transition-opacity hover:opacity-60";

  return (
    <>
      <main
        className="relative flex min-h-screen flex-col overflow-hidden transition-colors duration-300"
        style={{ backgroundColor: palette.background, color: palette.ink }}
      >
        <CornerBrackets ink={palette.ink} />

        {/* Header */}
        <header className="flex shrink-0 items-center justify-center pt-8 pb-4">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className={`${smallControl}`}
            style={{ color: palette.ink }}
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
            <a
              key={i}
              href={`${LIVE_SITE}#${i + 1}`}
              target="_blank"
              rel="noreferrer"
              className="group relative block h-full shrink-0"
              style={{ aspectRatio: "3 / 4" }}
              aria-label={`Gallery tile ${i + 1} — open the live site`}
            >
              <div
                className="absolute inset-0 opacity-70 saturate-[0.85] transition duration-500 ease-out group-hover:scale-[1.03] group-hover:opacity-100 group-hover:saturate-100"
                style={{ backgroundImage: bg }}
              />
              <span
                className="pointer-events-none absolute inset-0 flex items-end justify-start p-3 text-[11px] uppercase tracking-[0.2em] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ color: palette.ink }}
              >
                {GALLERY_TITLES[i]}
              </span>
            </a>
          ))}
        </section>

        {/* Spacer */}
        <div className="grow" />

        {/* Footer */}
        <footer className="mx-auto mb-10 grid w-full max-w-6xl grid-cols-3 items-end gap-4 px-8 sm:mb-12 sm:px-14">
          <div className="justify-self-start">
            <button
              type="button"
              onClick={toggleTheme}
              className={smallControl}
              style={{ color: palette.ink }}
            >
              Change Theme
            </button>
          </div>
          <div
            className="hidden justify-self-center text-sm italic uppercase tracking-[0.18em] sm:block"
            style={{ fontFamily: "'Newsreader', Georgia, 'Times New Roman', serif", color: palette.ink }}
          >
            ART DIRECTOR
            <br />
            PHOTOGRAPHER
          </div>
          <div className="self-end justify-self-end">
            <NewYorkTime ink={palette.ink} />
          </div>
        </footer>
      </main>

      {menuOpen && (
        <OverlayMenu
          closedPalette={palette}
          openPalette={openPalette}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}
