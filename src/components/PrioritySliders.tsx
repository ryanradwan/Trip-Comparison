"use client";

import { SLIDER_CATEGORIES } from "@/lib/constants";
import { TravelerWeights } from "@/lib/types";

interface Props {
  weights: TravelerWeights;
  onChange: (weights: TravelerWeights) => void;
}

export default function PrioritySliders({ weights, onChange }: Props) {
  const half = Math.ceil(SLIDER_CATEGORIES.length / 2);
  const col1 = SLIDER_CATEGORIES.slice(0, half);
  const col2 = SLIDER_CATEGORIES.slice(half);

  function updateWeight(key: string, val: number) {
    onChange({ ...weights, [key]: val });
  }

  function SliderRow({ cat }: { cat: typeof SLIDER_CATEGORIES[number] }) {
    const val = weights[cat.key] ?? cat.defaultWeight;
    const pct = val;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "var(--text-body)" }}>
            {cat.icon} {cat.label}
          </span>
          <span style={{ fontSize: 12, color: "var(--accent-primary)", fontWeight: 600, minWidth: 28, textAlign: "right" }}>
            {val}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={val}
          onChange={(e) => updateWeight(cat.key, Number(e.target.value))}
          style={
            {
              background: `linear-gradient(to right, var(--color-bronze) 0%, var(--color-bronze) ${pct}%, var(--color-sand-light) ${pct}%, var(--color-sand-light) 100%)`,
            } as React.CSSProperties
          }
        />
      </div>
    );
  }

  return (
    <div>
      <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 0, marginBottom: 16 }}>
        Drag to weight what matters most to you. Higher = more important.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "12px 32px",
        }}
      >
        {col1.map((cat) => <SliderRow key={cat.key} cat={cat} />)}
        {col2.map((cat) => <SliderRow key={cat.key} cat={cat} />)}
      </div>
    </div>
  );
}
