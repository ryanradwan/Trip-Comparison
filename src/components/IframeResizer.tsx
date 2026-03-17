"use client";

import { useEffect } from "react";

export default function IframeResizer() {
  useEffect(() => {
    const sendHeight = () => {
      window.parent.postMessage(
        { type: "iframeHeight", height: document.documentElement.scrollHeight },
        "*"
      );
    };

    sendHeight();
    const t1 = setTimeout(sendHeight, 300);
    const t2 = setTimeout(sendHeight, 1000);
    const t3 = setTimeout(sendHeight, 2500);

    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.documentElement);

    return () => {
      observer.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return null;
}
