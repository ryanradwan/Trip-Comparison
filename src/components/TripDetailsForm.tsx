"use client";

import { TripContext } from "@/lib/types";
import { MONTHS, TRAVEL_TYPES, BUDGET_PRESETS } from "@/lib/constants";

interface Props {
  value: TripContext;
  onChange: (ctx: TripContext) => void;
}

const btnBase: React.CSSProperties = {
  padding: "8px 14px",
  fontSize: 13,
  fontWeight: 500,
  border: "1.5px solid var(--border-medium)",
  borderRadius: "var(--radius-sm)",
  cursor: "pointer",
  backgroundColor: "var(--bg-card)",
  color: "var(--text-body)",
  transition: "all 0.15s",
};

const btnActive: React.CSSProperties = {
  ...btnBase,
  backgroundColor: "var(--color-sand-light)",
  borderColor: "var(--accent-primary)",
  color: "var(--text-primary)",
  fontWeight: 600,
};

export default function TripDetailsForm({ value, onChange }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Month */}
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
          When are you traveling?
        </label>
        <select
          value={value.month}
          onChange={(e) => onChange({ ...value, month: Number(e.target.value) })}
          style={{
            width: "100%",
            padding: "10px 14px",
            fontSize: 14,
            border: "1.5px solid var(--border-medium)",
            borderRadius: "var(--radius-sm)",
            backgroundColor: "var(--bg-card)",
            color: "var(--text-body)",
            outline: "none",
            cursor: "pointer",
          }}
        >
          {MONTHS.map((m, i) => (
            <option key={m} value={i}>{m}</option>
          ))}
        </select>
      </div>

      {/* Trip length */}
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
          Trip length: <span style={{ color: "var(--accent-primary)" }}>{value.tripLengthDays} days</span>
        </label>
        <input
          type="range"
          min={3}
          max={30}
          value={value.tripLengthDays}
          onChange={(e) => onChange({ ...value, tripLengthDays: Number(e.target.value) })}
          style={{ "--slider-value": `${((value.tripLengthDays - 3) / 27) * 100}%` } as React.CSSProperties}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>3 days</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>30 days</span>
        </div>
      </div>

      {/* Budget */}
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
          Daily budget
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          {BUDGET_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => onChange({ ...value, dailyBudget: preset.value })}
              style={value.dailyBudget === preset.value ? btnActive : btnBase}
            >
              <div>{preset.label}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 400 }}>{preset.sublabel}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Travel type */}
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
          Who&apos;s traveling?
        </label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TRAVEL_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => onChange({ ...value, travelType: t.value })}
              style={value.travelType === t.value ? btnActive : btnBase}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
