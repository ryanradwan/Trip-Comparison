"use client";

import { useEffect } from "react";

export default function IframeResizer() {
  useEffect(() => {
    const sendHeight = () => {
      const height = document.body.offsetHeight;
      window.parent.postMessage({ type: "iframeHeight", height }, "*");
    };

    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.body);
    sendHeight();
    const t = setTimeout(sendHeight, 800);

    return () => {
      observer.disconnect();
      clearTimeout(t);
    };
  }, []);

  return null;
}
