import { useEffect, useRef } from "react";

const GOOGLE_SCRIPT_ID = "google-identity-services";

export default function GoogleSignInButton({ clientId, onCredential }) {
  const containerRef = useRef(null);
  const callbackRef = useRef(onCredential);

  useEffect(() => { callbackRef.current = onCredential; }, [onCredential]);

  useEffect(() => {
    if (!clientId || !containerRef.current) return undefined;
    let cancelled = false;
    const render = () => {
      if (cancelled || !window.google?.accounts?.id || !containerRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: ({ credential }) => credential && callbackRef.current(credential),
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      containerRef.current.replaceChildren();
      window.google.accounts.id.renderButton(containerRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        logo_alignment: "left",
        width: Math.max(280, Math.floor(containerRef.current.getBoundingClientRect().width || 440)),
      });
    };
    const existing = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existing) {
      if (window.google?.accounts?.id) render();
      else existing.addEventListener("load", render, { once: true });
      return () => { cancelled = true; existing.removeEventListener("load", render); };
    }
    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.addEventListener("load", render, { once: true });
    document.head.appendChild(script);
    return () => { cancelled = true; script.removeEventListener("load", render); };
  }, [clientId]);

  return <div className="min-h-11 w-full" ref={containerRef} aria-label="Continue with Google" />;
}
