"use client";

import { useState } from "react";
import { FAQ_SECTIONS } from "./faqData";

export default function FaqAccordion() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  function toggle(key: string) {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <>
      {FAQ_SECTIONS.map((section) => (
        <section key={section.title} style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 20,
              color: "var(--text-primary)",
              margin: "0 0 16px",
              paddingBottom: 10,
              borderBottom: "2px solid var(--border-light)",
            }}
          >
            {section.title}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {section.questions.map((item) => {
              const key = `${section.title}-${item.q}`;
              const isOpen = openItems[key];
              return (
                <div
                  key={key}
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-light)",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                  }}
                >
                  <button
                    onClick={() => toggle(key)}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 20px",
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      gap: 16,
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4 }}>
                      {item.q}
                    </span>
                    <span style={{ fontSize: 18, color: "var(--accent-primary)", flexShrink: 0, lineHeight: 1 }}>
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      style={{
                        padding: "14px 20px 16px",
                        fontSize: 14,
                        color: "var(--text-body)",
                        lineHeight: 1.7,
                        borderTop: "1px solid var(--border-light)",
                      }}
                    >
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
