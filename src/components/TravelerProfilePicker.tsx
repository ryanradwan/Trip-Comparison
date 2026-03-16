"use client";

import { useState } from "react";
import { TRAVELER_PROFILES } from "@/lib/constants";
import { TravelerWeights } from "@/lib/types";

interface Props {
  onSelect: (weights: TravelerWeights) => void;
}

export default function TravelerProfilePicker({ onSelect }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

  function handleSelect(profile: typeof TRAVELER_PROFILES[number]) {
    setActiveId(profile.id);
    onSelect({ ...profile.weights } as TravelerWeights);
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 10px", fontWeight: 500 }}>
        Quick-start with a traveller profile:
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {TRAVELER_PROFILES.map((profile) => {
          const isActive = activeId === profile.id;
          return (
            <button
              key={profile.id}
              onClick={() => handleSelect(profile)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: "var(--radius-md)",
                border: isActive ? "1.5px solid var(--accent-primary)" : "1.5px solid var(--border-medium)",
                backgroundColor: isActive ? "var(--accent-winner-bg)" : "var(--bg-page)",
                color: isActive ? "var(--accent-primary)" : "var(--text-body)",
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <span>{profile.icon}</span>
              <span>{profile.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
