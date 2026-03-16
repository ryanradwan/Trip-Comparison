"use client";

import { useState, useRef, useEffect } from "react";
import { CityIndexEntry } from "@/lib/types";

interface Props {
  label: string;
  value: CityIndexEntry | null;
  onChange: (city: CityIndexEntry | null) => void;
  excludeId?: string;
  cities: CityIndexEntry[];
}

export default function CityInput({ label, value, onChange, excludeId, cities }: Props) {
  const [query, setQuery] = useState(value ? value.city : "");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value ? value.city : "");
  }, [value]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = cities
    .filter((c) => c.enabled && c.id !== excludeId)
    .filter((c) => {
      const q = query.toLowerCase();
      return c.city.toLowerCase().includes(q) || c.country.toLowerCase().includes(q) || c.region.toLowerCase().includes(q);
    })
;

  // Group by country
  const grouped: Record<string, CityIndexEntry[]> = {};
  for (const city of filtered) {
    if (!grouped[city.country]) grouped[city.country] = [];
    grouped[city.country].push(city);
  }

  function handleSelect(city: CityIndexEntry) {
    onChange(city);
    setQuery(city.city);
    setOpen(false);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setOpen(true);
    if (!e.target.value) onChange(null);
  }

  return (
    <div ref={ref} style={{ position: "relative", flex: 1 }}>
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 600,
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={query}
          onChange={handleInput}
          placeholder="City or country..."
          autoComplete="off"
          style={{
            width: "100%",
            padding: "12px 16px",
            fontSize: 15,
            border: "1.5px solid var(--border-medium)",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--bg-card)",
            color: "var(--text-body)",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => { e.target.style.borderColor = "var(--accent-primary)"; setOpen(true); }}
          onBlur={(e) => { e.target.style.borderColor = "var(--border-medium)"; }}
        />
        {value && (
          <button
            onClick={() => { onChange(null); setQuery(""); }}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            backgroundColor: "var(--bg-card)",
            border: "1.5px solid var(--border-medium)",
            borderRadius: "var(--radius-md)",
            boxShadow: "0 8px 32px rgba(123, 94, 67, 0.12)",
            zIndex: 100,
            maxHeight: 320,
            overflowY: "auto",
          }}
        >
          {Object.entries(grouped).map(([country, countryCities]) => (
            <div key={country}>
              <div
                style={{
                  padding: "8px 14px 4px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {country}
              </div>
              {countryCities.map((city) => (
                <button
                  key={city.id}
                  onMouseDown={() => handleSelect(city)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 14px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    color: "var(--text-body)",
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.backgroundColor = "var(--color-sand-light)"; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.backgroundColor = "transparent"; }}
                >
                  <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{city.city}</span>
                  <span style={{ color: "var(--text-muted)", marginLeft: 6, fontSize: 13 }}>{city.country}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
