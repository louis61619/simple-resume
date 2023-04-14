import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useEffectOnlyOnce } from "~/hook/useMount";

const Preview = ({ children, ...props }: { children: React.ReactNode }) => {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);
  const isMountStyle = useRef(false);

  const mountNode = contentRef?.contentWindow?.document?.body;

  useEffect(() => {
    if (isMountStyle.current) return;
    if (contentRef) {
      const cssLink = document.createElement("link");
      cssLink.href = "/preview.css";
      cssLink.rel = "stylesheet";
      cssLink.type = "text/css";
      contentRef?.contentWindow?.document.head.appendChild(cssLink);
      isMountStyle.current = true;
    }
  }, [contentRef]);

  return (
    <iframe className="w-1/2" {...props} ref={setContentRef}>
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
};

export { Preview };
