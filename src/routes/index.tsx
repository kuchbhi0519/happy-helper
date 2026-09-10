import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  component: Index,
});

const pad = (n: number, len = 2) => String(n).padStart(len, "0");

function AnalogClock({ date }: { date: Date }) {
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();

  const hourDeg = ((h % 12) / 12) * 360 + (m / 60) * 30;
  const minDeg = (m / 60) * 360 + (s / 60) * 6;
  const secDeg = (s / 60) * 360;

  const faceSize = 220;
  const center = faceSize / 2;

  return (
    <div
      className="rounded-full border-[6px] border-white bg-white shadow-xl ring-1 ring-black/5"
      style={{ width: faceSize, height: faceSize, position: "relative" }}
    >
      {/* Tick marks */}
      {Array.from({ length: 60 }).map((_, i) => (
        <span
          key={i}
          className="absolute inset-0"
          style={{ transform: `rotate(${i * 6}deg)` }}
        >
          <span
            className="absolute rounded-full"
            style={{
              left: center - (i % 5 === 0 ? 2 : 1),
              top: 8,
              width: i % 5 === 0 ? 4 : 2,
              height: i % 5 === 0 ? 12 : 6,
              backgroundColor: i % 5 === 0 ? "#40403d" : "#c8c4bd",
            }}
          />
        </span>
      ))}

      {/* Numbers */}
      {[12, 3, 6, 9].map((num, idx) => {
        const deg = [0, 90, 180, 270][idx];
        const rad = (deg * Math.PI) / 180;
        const x = center + Math.sin(rad) * (faceSize / 2 - 28);
        const y = center - Math.cos(rad) * (faceSize / 2 - 28);
        return (
          <span
            key={num}
            className="absolute font-semibold leading-none text-neutral-800"
            style={{
              fontSize: 18,
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
            }}
          >
            {num}
          </span>
        );
      })}

      {/* Hands */}
      <Hand size={faceSize} length={52} width={6} rotation={hourDeg} color="#40403d" />
      <Hand size={faceSize} length={72} width={4} rotation={minDeg} color="#40403d" />
      <Hand
        size={faceSize}
        length={84}
        width={2}
        rotation={secDeg}
        color="#dc2626"
      />

      {/* Center pin */}
      <span className="absolute rounded-full bg-red-600 ring-2 ring-white" style={{ left: center - 5, top: center - 5, width: 10, height: 10 }} />
    </div>
  );
}

function Hand({
  size,
  length,
  width,
  rotation,
  color,
}: {
  size: number;
  length: number;
  width: number;
  rotation: number;
  color: string;
}) {
  const center = size / 2;
  return (
    <span
      className="absolute rounded-full"
      style={{
        left: center - width / 2,
        top: center - length,
        width: width,
        height: length,
        backgroundColor: color,
        transformOrigin: `${width / 2}px ${length}px`,
        transform: `rotate(${rotation}deg)`,
      }}
    />
  );
}

function DigitalClock({ date }: { date: Date }) {
  const timeString = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  return (
    <div className="mt-8 flex flex-col items-center gap-1.5">
      <div
        className="tabular-nums font-light tracking-tight text-neutral-900"
        style={{ fontSize: "clamp(3rem, 9vw, 5rem)", lineHeight: 1 }}
      >
        {timeString.slice(0, 5)}
        <span className="text-neutral-400">{timeString.slice(5)}</span>
      </div>
      <div className="text-sm uppercase tracking-[0.25em] text-neutral-500">
        {Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date)},{" "}
        {Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(date)}
      </div>
    </div>
  );
}

function Index() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="flex min-h-screen items-center justify-center px-6"
      style={{ backgroundColor: "#fcfbf8" }}
    >
      <div className="flex flex-col items-center">
        <AnalogClock date={now} />
        <DigitalClock date={now} />
      </div>
    </div>
  );
}
